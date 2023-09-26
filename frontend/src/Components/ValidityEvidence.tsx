import type { CriiptoJwtSignature, CriiptoDrawableSignature } from '../../../library/src/pades';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

type ValidityEvidence = CriiptoJwtSignature['validity'];
type DrawableEvidence = CriiptoDrawableSignature['validity'];

export default function ValidityChecks(props: { validityChecks: ValidityEvidence | DrawableEvidence }) {
  const { validityChecks } = props;

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6 bg-light-purple">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Validity Checks</h3>
        {/* <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Is it valid?</p> */}
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-medium text-gray-900">Valid signature</dt>
            {validityChecks.valid ? (
              <dd className="text-center mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 ">
                <FontAwesomeIcon className="text-green-500 h-4 sm:h-5" icon={faCircleCheck} />
              </dd>
            ) : (
              <dd className="text-center mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 ">
                <FontAwesomeIcon className="text-red-500 h-4 sm:h-5" icon={faCircleXmark} />
              </dd>
            )}
          </div>
          {'checks' in validityChecks
            ? validityChecks.checks.map((check, index) => (
                <div className="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 " key={`validityCheck-${index}`}>
                  <dt className="text-sm font-medium text-gray-900">{check.description}</dt>
                  <dd className="text-center mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 ">
                    {check.result === 'OK' ? (
                      <FontAwesomeIcon className="text-green-500 h-4 sm:h-5" icon={faCircleCheck} />
                    ) : check.result === 'ERROR' ? (
                      <FontAwesomeIcon className="text-red-500 h-4 sm:h-5" icon={faCircleXmark} />
                    ) : (
                      <FontAwesomeIcon className="text-yellow-500 h-4 sm:h-5" icon={faCircleExclamation} />
                    )}
                  </dd>
                </div>
              ))
            : null}
        </dl>
      </div>
    </div>
  );
}
