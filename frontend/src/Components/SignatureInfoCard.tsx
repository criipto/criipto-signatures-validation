import IdentityDetails from './IdentityDetails';
import IdentityEvidenceJWT from './IdentityEvidenceJWT';
import IdentityEvidenceDrawable from './IdentityEvidenceDrawable';
import ValidityEvidence from './ValidityEvidence';
import useCollapsible from '../Hooks/useCollapsible';

import type { PAdESSignature, CriiptoJwtSignature, CriiptoDrawableSignature } from '../../../library/src/pades';

export default function SignatureInfoCard(props: { signature: PAdESSignature & (CriiptoJwtSignature | CriiptoDrawableSignature); index: number }) {
  const { signature, index } = props;
  const initialStates = Object.keys(signature).map(() => true);
  const { isOpenArray, toggleCollapse } = useCollapsible(initialStates);

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mx-8 my-8">
      <div key={index} className="px-4 py-5 text-white bg-dark-purple text-5xl sm:px-6" onClick={() => toggleCollapse(index)}>
        <h3 className="text-base font-semibold leading-7">{signature.name}</h3>
      </div>
      {isOpenArray[index] && (
        <div className="px-4 py-5 sm:p-6 bg-gray-100">
          <ul>
            <li>
              <ValidityEvidence key={`checks-${index}`} validityChecks={signature.validity} />
            </li>
            <li key={`identity-${index}`}>
              <IdentityDetails identityData={signature.identity} />
            </li>
            {'jwt' in signature.evidence && (
              <li key={`evidence-${index}`}>
                <IdentityEvidenceJWT evidenceData={signature.evidence} />
              </li>
            )}
            {'image' in signature.evidence && (
              <li key={`evidence-${index}`}>
                <IdentityEvidenceDrawable evidenceData={signature.evidence} />
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
