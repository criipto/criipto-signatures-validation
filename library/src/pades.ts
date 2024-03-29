import { PDFDocument, PDFName, PDFDict, PDFString, PDFHexString } from 'pdf-lib';
import { decodeJwt, decodeProtectedHeader, JWTPayload } from 'jose';
import pkijs from 'pkijs';
import asn1js from 'asn1js';
import {CriiptoCompositeEvidence, CriiptoDrawableEvidence, CriiptoEvidenceWrapper, CriiptoJwtEvidence} from './criipto.js';
import { tryFindBirthdateClaim, tryFindCountryClaim, tryFindNameClaim, tryFindNonSensitiveId } from './claims.js';
import { tryParseJSON } from './utils.js';

export const ALLOWED_CLOCK_SKEW = 5 * 60;

type JwkRendition = {
  kty : string
  use : string
  kid : string
  x5t : string
  e : string
  n : string
  x5c : string[]
}

type JwksRendition = {
  keys : JwkRendition[]
}

export type Check = {
  description: string
  result: 'OK' | 'WARNING' | 'ERROR'
  explanation?: string
}

export type CriiptoIdentity = {
  name: string
  id?: string
  birthdate?: string
  country?: string
}

export type CriiptoJwtSignature = {
  type: 'criipto.signature.jwt'
  identity: CriiptoIdentity
  evidence: {
    jwt: {
      payload: JWTPayload
      raw: string
    }
    jwks: JwksRendition
  }
  validity: {
    valid: boolean
    checks: Check[]
    jwt: {
      kid: string | null
      jwk: JwkRendition | null
    }
  }
}
export type CriiptoDrawableSignature = {
  type: 'criipto.signature.drawable',
  identity: CriiptoIdentity
  evidence: {
    image: string
    name?: string
  }
  validity: {
    /**
    * A drawable signature cannot really be invalid 
    */
    valid: true
  }
}

export type CriiptoCompositeSignature = {
  type: 'criipto.signature.composite'
  evidences: (CriiptoJwtSignature | CriiptoDrawableSignature)[]
}

export type PAdESSignature = {
  name: string
  timestamp?: {
    date: Date
  }
}

export type PAdESDocumentTimestamp = {
  type: 'document-time-stamp'
}

type SignatureUnion = PAdESSignature & (CriiptoJwtSignature | CriiptoDrawableSignature | CriiptoCompositeSignature | PAdESDocumentTimestamp | {type: 'unknown'})
export type PAdESValidation = {
  type: 'pades'
  signatures: SignatureUnion[]
}

function parseJwtEvidence(jwtEvidence: CriiptoJwtEvidence, tst?: {date: Date}) : CriiptoJwtSignature {
  const payload = decodeJwt(jwtEvidence.jwt);
  const header = decodeProtectedHeader(jwtEvidence.jwt);
  const jwks : JwksRendition = JSON.parse(jwtEvidence.jwks);
  const kid = header.kid ?? null;
  const jwk = jwks.keys.find(s => s.kid === kid) ?? null;
  const exp = payload.exp ? new Date(payload.exp * 1000) : null;
  const certificate = jwk && jwk.x5c?.[0] ? new pkijs.Certificate({ schema: asn1js.fromBER(Buffer.from(jwk!.x5c[0], 'base64')).result }) : null;

  const checks : Check[] = [
    {
      description: 'JWT includes a kid',
      result: kid ? 'OK' : 'ERROR',
      explanation: kid ? undefined : 'No kid found in embedded JWT header'
    },
    {
      description: 'JWKS includes kid from JWT',
      result: jwk ? 'OK' : 'ERROR',
      explanation: jwk ? undefined : 'No JWK found matching kid'
    },
    (
      !exp ? {
        description: 'JWT had not expired at time of signing',
        result: 'WARNING',
        explanation: 'JWT contains no expiration claim'
      } : 
      !tst ? {
        description: 'JWT had not expired at time of signing',
        result: 'ERROR',
        explanation: 'Signature contains no timestamp token'
      } : {
        description: 'JWT had not expired at time of signing',
        result: (exp.valueOf() + ALLOWED_CLOCK_SKEW) > tst.date.valueOf() ? 'OK' : 'ERROR',
        explanation: (exp.valueOf() + ALLOWED_CLOCK_SKEW) > tst.date.valueOf() ? undefined : `JWT expiration (${exp.toJSON()}) is before signature timestamp (${tst.date.toJSON()})`
      }
    ),
    (
      !certificate ? {
        description: 'JWK certificate had not expired at time of signing',
        result: 'WARNING',
        explanation: 'JWK contained no x5c'
      } :
      !tst ? {
        description: 'JWK certificate had not expired at time of signing',
        result: 'ERROR',
        explanation: 'Signature contains no timestamp token'
      } : {
        description: 'JWK certificate had not expired at time of signing',
        result: certificate.notAfter.value.valueOf() > tst.date.valueOf() ? 'OK' : 'ERROR',
        explanation: 
          certificate.notAfter.value.valueOf() > tst.date.valueOf() ? undefined :
            `JWK certificate was expired (${certificate.notAfter.value.toJSON()}) at the time of signing (${tst.date.toJSON()})`,
      }
    )
  ]

  const valid = !checks.some(c => c.result === 'ERROR');

  return {
    type: 'criipto.signature.jwt',
    identity: {
      name: tryFindNameClaim(payload)!,
      country: tryFindCountryClaim(payload) ?? undefined,
      birthdate: tryFindBirthdateClaim(payload) ?? undefined,
      id: tryFindNonSensitiveId(payload) ?? undefined,
    },
    evidence: {
      jwt: {
        raw: jwtEvidence.jwt,
        payload
      },
      jwks
    },
    validity: {
      valid,
      checks,
      jwt: {
        kid,
        jwk
      }
    }
  };
}
function parseDrawableEvidence(evidence: CriiptoDrawableEvidence) : CriiptoDrawableSignature {
  return {
    type: 'criipto.signature.drawable',
    identity: {
      name: evidence.name!
    },
    evidence: evidence,
    validity: {
      valid: true
    }
  }
}

export async function validatePDF(blob: Buffer) : Promise<PAdESValidation> {
  const document = await PDFDocument.load(blob);
  const form = document.getForm();
  const fields = form.getFields();

  const signatures : PAdESValidation["signatures"] = [];

  for (const field of fields) {
    const signatureName = field.acroField.dict.lookup(PDFName.of('T'), PDFString).decodeText();
    const signatureRef = field.acroField.dict.get(PDFName.of('V'));
    const signatureDict = document.catalog.context.lookup(signatureRef, PDFDict);

    const contents = signatureDict.lookup(PDFName.of('Contents'), PDFString, PDFHexString);
    const contentInfo = pkijs.ContentInfo.fromBER(contents.asBytes());
    if (contentInfo.contentType !== pkijs.ContentInfo.SIGNED_DATA) {
       throw new Error("CMS is not Signed Data");
    }
    const signedData = new pkijs.SignedData({ schema: contentInfo.content });

    // doc-timestamp
    if (signedData.encapContentInfo.eContentType === '1.2.840.113549.1.9.16.1.4') {
      const tstAsn = asn1js.fromBER(signedData.encapContentInfo!.eContent!.valueBlock.valueHex);
      const tstInfo = new pkijs.TSTInfo({ schema: tstAsn.result });
      const date = tstInfo.genTime;

      signatures.push({
        type: 'document-time-stamp',
        name: signatureName,
        timestamp: {
          date: date
        }
      });
      continue;
    }

    const tst = extractTST(signedData);

    const baseSignature : PAdESSignature = {
      name: signatureName,
      timestamp: tst ? {
        date: tst.date
      } : undefined
    }

    const contactInfo = signatureDict.lookupMaybe(PDFName.of('ContactInfo'), PDFString);
    if (contactInfo) {
      const value = contactInfo.decodeText();
      const wrapper = tryParseJSON<CriiptoEvidenceWrapper>(value);
      if (!wrapper) {
        signatures.push({
          type: 'unknown',
          ...baseSignature
        });
        continue;
      }

      if (wrapper.type === 'signature.jwt.v1' || wrapper.type === 'criipto.signature.jwt.v1') {
        const jwtSignature = JSON.parse(wrapper.value) as CriiptoJwtEvidence;
        signatures.push({
          ...baseSignature,
          ...parseJwtEvidence(jwtSignature, tst)
        });
        continue;
      }
      if (wrapper.type === 'signature.drawable.v1' || wrapper.type === 'criipto.signature.drawable.v1') {
        const imageSignature = JSON.parse(wrapper.value) as CriiptoDrawableEvidence;

        signatures.push({
          ...baseSignature,
          ...parseDrawableEvidence(imageSignature)
        });
        continue;
      }
      if (wrapper.type === 'criipto.signature.composite.v1') {
        const evidences = JSON.parse(wrapper.value) as CriiptoCompositeEvidence;
        signatures.push({
          type: 'criipto.signature.composite',
          ...baseSignature,
          evidences: 
            evidences.map(evidence => {
              if (evidence.type === 'criipto.signature.drawable.v1') return {...baseSignature, ...parseDrawableEvidence(evidence.value)};
              if (evidence.type === 'criipto.signature.jwt.v1') return {...baseSignature, ...parseJwtEvidence(evidence.value)};
              return null as any;
            })
            .filter(id => id)
        });
      }
    }

  }

  return {
    type: 'pades',
    signatures: signatures,
  };
}

const PDF_MAGIC_STRING = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
export function isPDF(blob: Buffer) {
  if (blob.subarray(0, 4).equals(PDF_MAGIC_STRING)) {
    return true;
  }
  // With UTF8 BOM - https://en.wikipedia.org/wiki/Byte_order_mark#Byte_order_marks_by_encoding
  if (blob.subarray(3, 7).equals(PDF_MAGIC_STRING)) {
    return true;
  }

  // With UTF16 BOM
  if (blob.subarray(2, 6).equals(PDF_MAGIC_STRING)) {
    return true;
  }

  // Other BOM lengths
  if (blob.subarray(4, 8).equals(PDF_MAGIC_STRING)) {
    return true;
  }
}

export function extractTST(input: pkijs.SignedData) {
  const tstAttributes = input.signerInfos[0].unsignedAttrs?.attributes.find(s => s.type === '1.2.840.113549.1.9.16.2.14');
  if (!tstAttributes) return undefined;
  if (!tstAttributes.values.length) return undefined;

  const tstSimp = new pkijs.ContentInfo({schema: tstAttributes.values[0]});
  const tstSigned = new pkijs.SignedData({ schema: tstSimp.content });

  // if (tstSigned.certificates) {
  //   for (const tstCert of tstSigned.certificates) {
  //     if ("subject" in tstCert) {
  //       // console.log(tstCert.subject);
  //       if (tstCert.subject instanceof RelativeDistinguishedNames) {
  //         for (const attribute of tstCert.subject.typesAndValues) {
  //           // console.log(attribute.type);
  //           // console.log(attribute.value.getValue())
  //         }
  //       }
  //     }
  //   }
  // }
  
  const tstAsn = asn1js.fromBER(tstSigned.encapContentInfo!.eContent!.valueBlock.valueHex);
  const tstInfo = new pkijs.TSTInfo({ schema: tstAsn.result });

  return {
    date: tstInfo.genTime
  }
}