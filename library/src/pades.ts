import { PDFDocument, PDFName, PDFDict, PDFString } from 'pdf-lib/es';
import {CriiptoDrawableEvidence, CriiptoEvidenceWrapper, CriiptoJwtEvidence} from './criipto.js';

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

export type CriiptoJwtSignature = {
  type: 'criipto.signature.jwt'
  evidence: {
    jwt: {
      raw: string
    }
    jwks: JwksRendition
  }
}
export type CriiptoDrawableSignature = {
  type: 'criipto.signature.drawable',
  evidence: {
    image: string
    name?: string
  }
}
export type PAdESSignature = {
  name: string
}
export type PAdESValidation = {
  type: 'pades'
  signatures: (PAdESSignature & (CriiptoJwtSignature | CriiptoDrawableSignature | {type: 'unknown'}))[]
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
    const contactInfo = signatureDict.lookupMaybe(PDFName.of('ContactInfo'), PDFString);

    const baseSignature : PAdESSignature = {
      name: signatureName
    }

    if (contactInfo) {
      const value = contactInfo.decodeText();
      const wrapper = JSON.parse(value) as CriiptoEvidenceWrapper;

      if (wrapper.type === 'signature.jwt.v1' || wrapper.type === 'criipto.signature.jwt.v1') {
        const jwtSignature = JSON.parse(wrapper.value) as CriiptoJwtEvidence;

        signatures.push({
          type: 'criipto.signature.jwt',
          ...baseSignature,
          evidence: {
            jwt: {
              raw: jwtSignature.jwt
            },
            jwks: JSON.parse(jwtSignature.jwks)
          }
        });
        continue;
      }
      if (wrapper.type === 'signature.drawable.v1' || wrapper.type === 'criipto.signature.drawable.v1') {
        const imageSignature = JSON.parse(wrapper.value) as CriiptoDrawableEvidence;

        signatures.push({
          type: 'criipto.signature.drawable',
          ...baseSignature,
          evidence: imageSignature
        });
        continue;
      }
    }
    signatures.push({type: 'unknown', ...baseSignature});
  }

  return {
    type: 'pades',
    signatures: signatures
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