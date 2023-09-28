import useCollapsible from '../Hooks/useCollapsible';
import { formattedDate } from '../Helpers/dateFormatter';
import type { PAdESSignature, PAdESDocumentTimestamp } from '../../../library/src/pades';

export default function DocumentTimeStamp(props: { signature: PAdESSignature & PAdESDocumentTimestamp; index: number }) {
  const { signature, index } = props;
  const initialStates = Object.keys(signature).map(() => true);
  const { isOpenArray, toggleCollapse } = useCollapsible(initialStates);

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mx-8 my-8">
        <div className="px-4 py-5 text-black bg-light-purple text-5xl sm:px-6" onClick={() => toggleCollapse(index)}>
          <h3 className="text-base font-semibold leading-7">Document Time Stamp</h3>
        </div>
        {isOpenArray[index] && (
          <div className="overflow-shown bg-white shadow sm:rounded-b-lg">
            <div className="border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                {signature.timestamp?.date && (
                  <div className="px-4 py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 ">
                    <dt className="text-sm font-medium text-gray-900">Timestamp</dt>
                    <dd className="text-center mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 ">
                      <p className="h-4 sm:h-5">{formattedDate(signature.timestamp?.date)}</p>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
