import type { CriiptoIdentity } from '../../../library/src/pades';

export default function IdentityDetails(props: { identityData: CriiptoIdentity }) {
  const { identityData } = props;
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mb-6 mt-6">
      <div className="px-4 py-5 sm:px-6 bg-light-purple font-semibold">
        <h3 className="text-base font-semibold leading-7">Identity Details</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details of the signatory</p>
      </div>

      <div className="pt-0 pb-5 px-5">
        <dl className="grid grid-cols-1 sm:grid-cols-2">
          {Object.entries(identityData).map(([identityKey, identityValue]) => (
            <div key={identityKey} className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">{identityKey}</dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">{identityValue}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
