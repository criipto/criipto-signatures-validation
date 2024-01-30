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

export type CriiptoCompositeEvidence = (
  {type: 'criipto.signature.jwt.v1', value: CriiptoJwtEvidence} |
  {type: 'criipto.signature.drawable.v1', value: CriiptoDrawableEvidence}
)[];