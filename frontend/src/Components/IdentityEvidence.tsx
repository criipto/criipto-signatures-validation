import type { CriiptoJwtSignature } from '../../../library/src/pades';

type EvidenceData = CriiptoJwtSignature['evidence'];

export default function IdentityEvidence(props: { evidenceData: EvidenceData }) {
  const { evidenceData } = props;
  return (
    <div className="py-5">
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Identity Evidence</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">JWT and JWKs</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">JWT</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{evidenceData.jwt.raw}</dd>
          </div>
        </dl>
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">JWKS</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <ul>
                {evidenceData.jwks.keys.map((key, index) => (
                  <li key={index}>
                    <div>
                      <strong>kty:</strong> {key.kty}
                    </div>
                    <div>
                      <strong>use:</strong> {key.use}
                    </div>
                    <div>
                      <strong>kid:</strong> {key.kid}
                    </div>
                    <div>
                      <strong>x5t:</strong> {key.x5t}
                    </div>
                    <div>
                      <strong>e:</strong> {key.e}
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
