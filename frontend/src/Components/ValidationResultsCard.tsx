import SignatureInfoCard from './SignatureInfoCard';
import UnknownSignature from './UnknownSignature';
import type { Validation } from '../../../library/src/index';
import useCollapsible from '../Hooks/useCollapsible';

type ValidationResponse = {
  [key: string]: Validation | { error: string };
};

export default function ValidationResults(props: { results: ValidationResponse }) {
  const { results } = props;
  const initialStates = Object.keys(results).map(() => true);
  const { isOpenArray, toggleCollapse } = useCollapsible(initialStates);

  return (
    <>
      {Object.keys(results).length > 0 &&
        Object.entries(results).map(([fileName, result], index) => (
          <div key={index} className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow my-4">
            <div className="px-4 py-5 sm:px-6 bg-dark-purple text-white" onClick={() => toggleCollapse(index)} key={`header-${index}`}>
              <h2 className="font-semibold">{fileName}</h2>
            </div>

            {isOpenArray[index] && (
              <div key={index}>
                {'error' in result ? (
                  <p>Error validating file: {result['error']}</p>
                ) : result.type === 'pades' ? (
                  <>
                    {result.signatures && result.signatures.length > 0 ? (
                      <ul>
                        {result.signatures.map((signature, index) => (
                          <div key={index}>
                            {signature.type === 'criipto.signature.jwt' || signature.type === 'criipto.signature.drawable' ? (
                              <SignatureInfoCard signature={signature} index={index} />
                            ) : (
                              <UnknownSignature signature={signature} index={index} />
                            )}
                          </div>
                        ))}
                      </ul>
                    ) : (
                      <p className="m-4 py-4">No signatures in this document.</p>
                    )}
                  </>
                ) : null}
              </div>
            )}
          </div>
        ))}
    </>
  );
}
