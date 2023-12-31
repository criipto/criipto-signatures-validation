import { useEffect, useState } from 'react';
import type { CriiptoJwtSignature } from '../../../library/src/pades';
import JwtPayloadViewer from './JwtPayloadViewer';
import { JwtPayload } from '@criipto/jwt-viewer';

type EvidenceData = CriiptoJwtSignature['evidence'];

export default function IdentityEvidence(props: { evidenceData: EvidenceData }) {
  const { evidenceData } = props;
  const decodedToken = evidenceData.jwt.payload;
  const [claims, setClaims] = useState<JwtPayload>();

  useEffect(() => {
    if (decodedToken) {
      setClaims(decodedToken as JwtPayload);
    }
  }, [decodedToken]);

  if (!claims) {
    return null;
  }

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mb-6 mt-6">
      <div className="px-4 py-5 sm:px-6 bg-light-purple font-semibold">
        <h3 className="text-base font-semibold leading-7">Identity Evidence</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">JWT and JWKs</p>
      </div>
      {'jwt' in evidenceData && 'jwks' in evidenceData && (
        <>
          <div className="pt-0 pb-5 px-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="border-t border-gray-100 px-6 py-6 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">JWT Encoded:</dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 whitespace-pre-wrap break-all sm:mt-2">{evidenceData.jwt.raw}</dd>
              </div>

              {claims && (
                <div className="border-t border-gray-100 px-6 py-6 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">JWT Decoded:</dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                    <pre className="whitespace-pre-wrap break-normal overflow-shown">
                      <JwtPayloadViewer payload={claims} />
                    </pre>
                  </dd>
                </div>
              )}
            </div>
          </div>
          <div className="pt-0 pb-5 px-5">
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">JWKs:</dt>
              <span className="text-sm">a set of cryptographic keys used for implementing digital signatures in web applications.</span>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <ul className="flex flex-wrap gap-4 mt-4">
                  {evidenceData.jwks.keys.map((key, index) => (
                    <li key={index}>
                      <div className="overflow-hidden rounded-lg bg-gray-200 mb-3">
                        <div className="px-4 py-5 sm:p-6">
                          <h2 className="font-semibold mb-2">Keys #{index + 1}</h2>
                          <div className="space-y-2">
                            <p>
                              <strong>kty:</strong> {key.kty}
                            </p>
                            <p>
                              <strong>use:</strong> {key.use}
                            </p>
                            <p>
                              <strong>kid:</strong> {key.kid}
                            </p>
                            <p>
                              <strong>x5t:</strong> {key.x5t}
                            </p>
                            <p>
                              <strong>e:</strong> {key.e}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
