{
  /* Using Description Lists https://tailwindui.com/components/application-ui/data-display/description-lists*/
}

import type { CriiptoIdentity } from '../../../library/src/pades';

export default function IdentityDetails(props: { identityData: CriiptoIdentity }) {
  const { identityData } = props;
  return (
    <div className="py-5">
      <div className="px-4 sm:px-0 ">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Identity Details</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">JWT claims embedded in signature</p>
      </div>
      {Object.entries(identityData).map(([identityKey, identityValue]) => (
        <div className="mt-6 border-t border-gray-100">
          <dl className="divide-y divide-gray-100">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">{identityKey}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">{identityValue}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}
