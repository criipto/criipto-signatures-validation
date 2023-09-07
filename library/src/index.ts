import { PAdESValidation, isPDF, validatePDF } from "./pades.js";

export function validate(blob: Buffer) {
  if (isPDF(blob)) {
    return validatePDF(blob);
  }
  throw new Error('Unknown file type');
}

export type Validation = PAdESValidation;