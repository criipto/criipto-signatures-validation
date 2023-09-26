import type { CriiptoDrawableSignature } from '../../../library/src/pades';

type DrawableEvidence = CriiptoDrawableSignature['evidence'];

export default function IdentityEvidence(props: { evidenceData: DrawableEvidence }) {
  const { evidenceData } = props;

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mb-6 mt-6">
      <div className="px-4 py-5 sm:px-6 bg-light-purple font-semibold">
        <h3 className="text-base font-semibold leading-7">Identity Evidence</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Drawable signature</p>
      </div>
      {'image' in evidenceData && (
        <div className="pt-0 pb-5 px-5">
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">signature</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <img src={`data:image/png;base64,${evidenceData.image}`} alt="drawable signature" className="h-24 rounded-lg" />
            </dd>
          </div>
        </div>
      )}
    </div>
  );
}
