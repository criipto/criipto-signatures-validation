export interface CriiptoEvidenceWrapper {
  type: string;
  meta: string;
  value: string;
}

export interface CriiptoJwtEvidence {
  jwt: string;
  jwks: string;
}

export interface CriiptoDrawableEvidence {
  image: string;
  name?: string;
}