import { PDFDocument } from 'pdf-lib';

export type PAdESValidation = {
  type: 'pades'
  signatures: {
    type: 'criipto.signature.jwt' | 'criipto.signature.drawable' | 'unknown'
  }[]
}

export async function validatePDF(blob: Buffer) : Promise<PAdESValidation> {
  const document = await PDFDocument.load(blob);
  return {
    type: 'pades',
    signatures: []
  };
}

const PDF_MAGIC_STRING = new Uint8Array([0x25, 0x50, 0x44, 0x46]);
export function isPDF(blob: Buffer) {
  console.log(blob.subarray(0, 4), PDF_MAGIC_STRING);
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