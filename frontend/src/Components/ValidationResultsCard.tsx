import SignatureInfoCard from './SignatureInfoCard';
import type { Validation } from '../../../library/src/index';

type ValidationResponse = {
  [key: string]: Validation | { error: string };
};

export default function ValidationResults(props: { results: ValidationResponse }) {
  const { results } = props;
  const signedDocument = results[Object.keys(results)[0]];
  const signatures = 'signatures' in signedDocument ? signedDocument.signatures : [];

  return (
    <div className="overflow-hidden rounded-lg bg-light-purple shadow mb-4">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-center px-2 py-1 rounded-md font-semibold text-4xl mb-6">Validation Results</h2>
        <h3 className="text-base font-semibold leading-7">Document Name: {Object.keys(results)[0]}</h3>
        {results && signatures && <p className="mt-1 max-w-2xl text-md leading-6 font-semibold">Number of Signatures: {signatures.length}</p>}
      </div>

      {signatures.length > 0 && (
        <>
          {signatures.map((signature) => (
            <div className="flex flex-wrap px-4 gap-4" key={signature.name}>
              <div className="rounded-lg bg-gray-50 ">
                <div className="px-4 py-5 sm:p-6">
                  <p className="font-semibold">{signature.name}</p>
                  <p>Signature type: {signature.type}</p>
                  {signature.type === 'criipto.signature.jwt' && <p>Signed by: {signature.identity.name}</p>}
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mt-4">
        {Object.entries(results).map(([fileName, result]) => (
          <div key={fileName}>
            {'error' in result ? (
              <p>Error validating file: {result.error as string}</p>
            ) : (
              <>
                {result.type === 'pades' && signatures && signatures.length > 0 && (
                  <ul>
                    {signatures.map((signature, index) => (
                      <div key={index}>{signature.type === 'criipto.signature.jwt' && <SignatureInfoCard signature={signature} index={index} />}</div>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
