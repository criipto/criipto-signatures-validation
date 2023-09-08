import {JWTPayload} from 'jose';
export const identitySchemes = [
  "dkmitid",
  "dknemid",
  "sebankid",
  "beeid",
  "nobankid",
  "nobankid-oidc",
  "nldigid",
  "itsme",
  "germansofort",
  "novippslogin",
  "fitupas",
  "fimobileid"
] as const;

export type IdentityScheme = typeof identitySchemes[number] | '%UNKNOWN'

export function parseIdentityScheme(input: string) : IdentityScheme {
  if (!input || !input.length) throw new Error('Invalid empty input to parseIdentityScheme');
  if (identitySchemes.includes(input as any)) return input as IdentityScheme;
  return input as '%UNKNOWN';
}

export function tryFindClaim(possibles: string[], claims: JWTPayload) : string | null {
  return possibles.reduce((memo: string | null, possible) => {
    if (memo) return memo;
    if (claims[possible]) return claims[possible] as string;
    return memo;
  }, null);
}

export function findClaim(possibles: string[], claims: JWTPayload) {
  const candidate = tryFindClaim(possibles, claims);
  if (!candidate) throw new Error(`None of possible ${possibles.join(', ')} claims found in set`)
  return candidate;
}

export function findIdentitySchemeClaim(claims: JWTPayload) {
  const claim = findClaim(
    ["identityscheme", "http://schemas.grean.id/claims/identityscheme"],
    claims
  );
  return parseIdentityScheme(claim);
}

export function tryFindNameClaim(claims: JWTPayload) {
  return findClaim(
      ["name", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
      claims
  )
}

export function tryFindCountryClaim(claims: JWTPayload) {
  return findClaim(
      ["country", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/country"],
      claims
  )
}

export function tryFindBirthdateClaim(claims: JWTPayload) {
  return findClaim(
      ["birthdate", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth"],
      claims
  )
}

export function tryFindNonSensitiveId(claims: JWTPayload) {
  const identityScheme = findIdentitySchemeClaim(claims);
  switch (identityScheme) {
    case 'dkmitid': return tryFindClaim(["uuid", "dk:gov:saml:attribute:UUID"], claims);
    case 'dknemid': return tryFindClaim(["pidNumberIdentifier", "dk:gov:saml:attribute:PidNumberIdentifier"], claims);
    case 'sebankid': return null;
    case 'beeid': return null;
    case 'nobankid-oidc': return tryFindClaim(["uniqueuserid", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname/uniqueuserid"], claims);
    case 'nobankid': return tryFindClaim(["uniqueuserid", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname/uniqueuserid"], claims);
    case 'nldigid': return null;
    case 'itsme': return null;
    case 'germansofort': return null;
    case 'novippslogin': return null;
    case 'fitupas': return null;
    case 'fimobileid': return null;
    return null;
  }
}

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}