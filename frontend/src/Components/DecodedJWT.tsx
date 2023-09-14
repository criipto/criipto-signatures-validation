import { useEffect, useState } from 'react';
import { useJwt } from 'react-jwt';

export default function DecodedJWT(props: { rawPayload: string }) {
  const { rawPayload } = props;
  const { decodedToken } = useJwt(rawPayload);
  const [claims, setClaims] = useState({});

  console.log('decodedToken', decodedToken);
  console.log('rawPayload', rawPayload);

  useEffect(() => {
    if (decodedToken) {
      setClaims(decodedToken);
    }
  }, [decodedToken]);

  if (!claims) {
    return null;
  }

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Identity Information</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Decoded JWT payload</p>
      </div>
      <div className="mt-6">
        <dl className="grid grid-cols-1 sm:grid-cols-2">
          {Object.entries(claims).map(([key, value]) => (
            <div key={key} className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">{key}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {typeof value === 'object' ? (
                  <dl>
                    {Object.entries(value).map(([subKey, subValue]) => (
                      <div key={subKey}>
                        <dt className="text-sm font-medium leading-6 text-gray-900">{subKey}</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{subValue}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
