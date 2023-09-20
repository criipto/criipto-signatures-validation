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
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mb-6 mt-6">
      <div className="px-4 py-5 sm:px-6 bg-light-purple font-semibold">
        <h3 className="text-base font-semibold leading-7 ">Identity Information</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Decoded JWT payload</p>
      </div>

      <div className="pt-0 pb-5 px-5">
        <dl className="grid grid-cols-1 sm:grid-cols-2">
          {Object.entries(claims).map(([key, value]) => (
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">{key}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {value && typeof value === 'object' ? (
                  <dl>
                    {Object.entries(value).map(([subKey, subValue]) => (
                      <div key={subKey}>
                        {subValue && (
                          <>
                            <dt className="text-sm font-medium leading-6 text-gray-900">{subKey}</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{subValue}</dd>
                          </>
                        )}
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="break-all">{value as string}</p>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
