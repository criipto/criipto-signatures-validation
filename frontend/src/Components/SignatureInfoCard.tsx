import IdentityDetails from './IdentityDetails';
import DecodedJWT from './DecodedJWT';
import IdentityEvidence from './IdentityEvidence';

import type { PAdESSignature, CriiptoJwtSignature, CriiptoDrawableSignature } from '../../../library/src/pades';

export default function SignatureInfoCard(props: { signature: PAdESSignature & (CriiptoJwtSignature | CriiptoDrawableSignature); index: number }) {
  const { signature, index } = props;

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mx-8 my-8">
      <div className="px-4 py-5 text-white bg-dark-purple text-5xl sm:px-6">
        <h3 className="text-base font-semibold leading-7">{signature.name}</h3>
        <p className="mt-1 max-w-2xl text-base leading-6 text-white font-semibold">Signatory: {signature.identity.name} </p>
      </div>
      <div className="px-4 py-5 sm:p-6 bg-gray-100">
        <ul>
          <li key={`identity-${index}`}>
            <IdentityDetails identityData={signature.identity} />
          </li>
          {'jwt' in signature.evidence && (
            <>
              <li key={`evidence-${index}`}>
                <IdentityEvidence evidenceData={signature.evidence} />
              </li>
              <li key={`DecodedJWT-${index}`}>
                <DecodedJWT rawPayload={signature.evidence.jwt.raw} />
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
