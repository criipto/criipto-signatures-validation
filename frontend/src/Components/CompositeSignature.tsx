import IdentityDetails from './IdentityDetails';
import IdentityEvidenceJWT from './IdentityEvidenceJWT';
import IdentityEvidenceDrawable from './IdentityEvidenceDrawable';
import ValidityEvidence from './ValidityEvidence';
import useCollapsible from '../Hooks/useCollapsible';
import { formattedDate } from '../Helpers/dateFormatter';

import type { PAdESSignature, CriiptoCompositeSignature } from '../../../library/src/pades';

export default function SignatureInfoCard(props: { signature: PAdESSignature & CriiptoCompositeSignature; index: number }) {
  const { signature, index } = props;
  const initialStates = Object.keys(signature).map(() => true);
  const { isOpenArray, toggleCollapse } = useCollapsible(initialStates);

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow mx-8 my-8">
      <div
        key={index}
        className="px-4 py-5 text-white bg-dark-purple text-5xl sm:px-6"
        onClick={() => toggleCollapse(index)}
      >
        <h3 className="text-base font-semibold leading-7">{signature.name}</h3>
      </div>
      {isOpenArray[index] && (
        <div className="pl-4 pt-6">
          <h3 className="text-base font-semibold leading-7">Composite Signature</h3>
          {signature.timestamp && <h3 className="text-base font-semibold leading-7">Signature time: {formattedDate(signature.timestamp?.date)}</h3>}
          {signature.evidences.map((evidence, evidenceIndex) => (
            <div
              className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mx-8 my-6"
              key={evidenceIndex}
            >
              <div className="px-4 py-5 text-white bg-dark-purple text-5xl sm:px-6">{evidence.type === 'criipto.signature.drawable' ? <h3 className="text-base font-semibold leading-7">Drawable Signature</h3> : <h3 className="text-base font-semibold leading-7">JWT Signature</h3>}</div>
              <div className="px-4 py-5 sm:p-6 bg-gray-100">
                <ul>
                  <li>
                    <ValidityEvidence
                      key={`checks-${evidenceIndex}`}
                      validityChecks={evidence.validity}
                      dateSigned={signature.timestamp?.date}
                    />
                  </li>
                  <li key={`identity-${evidenceIndex}`}>
                    <IdentityDetails identityData={evidence.identity} />
                  </li>
                  {'jwt' in evidence.evidence && (
                    <li key={`evidence-jwt-${evidenceIndex}`}>
                      <IdentityEvidenceJWT evidenceData={evidence.evidence} />
                    </li>
                  )}
                  {'image' in evidence.evidence && (
                    <li key={`evidence-image-${evidenceIndex}`}>
                      <IdentityEvidenceDrawable evidenceData={evidence.evidence} />
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
