import test from 'ava';
import fs from 'fs/promises';
import pkijs, { TSTInfo, RelativeDistinguishedNames } from 'pkijs';
import asn1js from 'asn1js';
import { PDFDocument, PDFName, PDFDict, PDFString, PDFArray, PDFNumber, PDFHexString } from 'pdf-lib';
import { validate } from '../index.js';

test('extracts JWT evidence and identity', async (t) => {
  const blob = await fs.readFile(new URL('./569c2bf9-0dd8-4c0a-bfc1-2f03d628c95a.pdf', import.meta.url));

  const actual = await validate(blob);

  t.is(actual.type, 'pades');
  t.is(actual.signatures.length, 1);

  const signature = actual.signatures[0];
  t.is(signature.type, 'criipto.signature.jwt');
  
  if (signature.type === 'criipto.signature.jwt') {
    t.deepEqual(signature.identity, {
      birthdate: '1910-06-14',
      country: 'NO',
      id: '9578-6000-4-1433659',
      name: 'Ole Olsen',
    });
    t.truthy(signature.evidence.jwt);
    t.truthy(signature.evidence.jwks)
  }
});

test('pdf', async (t) => {
  const blob = await fs.readFile(new URL('./569c2bf9-0dd8-4c0a-bfc1-2f03d628c95a.pdf', import.meta.url));
  const document = await PDFDocument.load(blob);
  const form = document.getForm();
  const fields = form.getFields();
  for (const field of fields) {
    const signatureRef = field.acroField.dict.get(PDFName.of('V'));
    const signatureDict = document.catalog.context.lookup(signatureRef, PDFDict);

    const byteRange = signatureDict.lookup(PDFName.of('ByteRange'), PDFArray);
    const contents = signatureDict.lookup(PDFName.of('Contents'), PDFString, PDFHexString);
    const cmsContentSimp = pkijs.ContentInfo.fromBER(contents.asBytes());
    if (cmsContentSimp.contentType !== pkijs.ContentInfo.SIGNED_DATA) {
       throw new Error("CMS is not Signed Data");
    }
    const cmsSignedSimp = new pkijs.SignedData({ schema: cmsContentSimp.content });
    const tst = cmsSignedSimp.signerInfos[0].unsignedAttrs?.attributes.find(s => s.type === '1.2.840.113549.1.9.16.2.14');
    // console.log(tst?.values);
    const tstSimp = new pkijs.ContentInfo({schema: tst?.values[0]});
    tstSimp.fromSchema(tst?.values[0]);

    console.log(tstSimp.contentType);
    const tstSigned = new pkijs.SignedData({ schema: tstSimp.content });

    console.log(tstSigned);
    if (tstSigned.certificates) {
      for (const tstCert of tstSigned.certificates) {
        if ("subject" in tstCert) {
          // console.log(tstCert.subject);
          if (tstCert.subject instanceof RelativeDistinguishedNames) {
            for (const attribute of tstCert.subject.typesAndValues) {
              // console.log(attribute.type);
              // console.log(attribute.value.getValue())
            }
          }
        }
      }
    }
    
    const tstAsn = asn1js.fromBER(tstSigned.encapContentInfo!.eContent!.valueBlock.valueHex);
		const tstInfo = new pkijs.TSTInfo({ schema: tstAsn.result });
    console.log(tstInfo);

    if (tstInfo.tsa?.value instanceof RelativeDistinguishedNames) {
      for (const attribute of tstInfo.tsa.value.typesAndValues) {
        // console.log(attribute.type);
        // console.log(attribute.value.getValue())
      }
    }
  }
});

// TST: 1.2.840.113549.1.9.16.2.14
// https://pkijs.org/examples/PDFExample/bundle.js