import test from 'ava';
import {JWTPayload} from 'jose';
import { tryFindNameClaim, tryFindNonSensitiveId } from '../claims.js';

[
  <[JWTPayload, string]>[{"name": "Test Testersen"}, "Test Testersen"],
  <[JWTPayload, string]>[{"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "Mads Mikkelsen"}, "Mads Mikkelsen"]
].forEach(([input, expected]) => {
  test(`tryFindNameClaim finds name for ${JSON.stringify(input)} input`, t => {
    const actual = tryFindNameClaim(input);

    t.is(actual, expected);
  });
});

[
  <[JWTPayload, string]>[{"identityscheme": "dknemid", "pidNumberIdentifier": "9208-2002-2-294247448400"}, "9208-2002-2-294247448400"],
  <[JWTPayload, string]>[{"identityscheme": "dknemid", "dk:gov:saml:attribute:PidNumberIdentifier": "9208-2002-2-294247448400"}, "9208-2002-2-294247448400"],
  <[JWTPayload, string]>[{"identityscheme": "dkmitid", "uuid": "74ffcd31-fbaf-4c33-bdac-169f25c1e416"}, "74ffcd31-fbaf-4c33-bdac-169f25c1e416"],
  <[JWTPayload, string]>[{"identityscheme": "dkmitid", "dk:gov:saml:attribute:UUID": "74ffcd31-fbaf-4c33-bdac-169f25c1e416"}, "74ffcd31-fbaf-4c33-bdac-169f25c1e416"],
  <[JWTPayload, string]>[{"identityscheme": "nobankid", "uniqueuserid": "9578-6000-4-351726"}, "9578-6000-4-351726"],
  <[JWTPayload, string]>[{"identityscheme": "nobankid-oidc", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/x500distinguishedname/uniqueuserid": "9578-6000-4-351726"}, "9578-6000-4-351726"]
].forEach(([input, expected]) => {
  test(`tryFindNonSensitiveId finds ${expected} for ${JSON.stringify(input)} input`, t => {
    const actual = tryFindNonSensitiveId(input);

    t.is(actual, expected);
  });
});