import type { CriiptoJwtSignature, CriiptoDrawableSignature } from '../../../library/src/pades';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import Tooltip from './Tooltip';

type ValidityEvidence = CriiptoJwtSignature['validity'];
type DrawableEvidence = CriiptoDrawableSignature['validity'];

export default function ValidityChecks(props: { validityChecks: ValidityEvidence | DrawableEvidence; dateSigned?: Date }) {
  const { validityChecks, dateSigned } = props;
  let formattedDateSigned = '';
  if (dateSigned) {
    const date = new Date(dateSigned);
    formattedDateSigned = date.toJSON().slice(0, 19).replace('T', ' ');
  }

  return (
    <div className="overflow-shown bg-white shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6 bg-light-purple">
        <h3 className="text-base font-semibold leading-7 text-gray-900">Validity Checks</h3>
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {dateSigned && (
            <div className="px-4 py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 ">
              <dt className="text-sm font-medium text-gray-900">Signature time:</dt>
              <dd className="text-center mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 ">
                <p className="h-4 sm:h-5">{formattedDateSigned}</p>
              </dd>
            </div>
          )}
          <div className="px-4 py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 ">
            <dt className="text-sm font-medium text-gray-900">Valid signature</dt>
            {validityChecks.valid ? (
              <dd className="text-center mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 ">
                <Tooltip message={'OK'}>
                  <FontAwesomeIcon className="text-green-500 h-4 sm:h-5" icon={faCircleCheck} />
                </Tooltip>
              </dd>
            ) : (
              <dd className="text-center mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 ">
                <Tooltip message={'Invalid Signature'}>
                  <FontAwesomeIcon className="text-red-500 h-4 sm:h-5" icon={faCircleXmark} />
                </Tooltip>
              </dd>
            )}
          </div>
          {'checks' in validityChecks
            ? validityChecks.checks.map((check, index) => (
                <div className="px-4 py-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6 " key={`validityCheck-${index}`}>
                  <dt className="text-sm font-medium text-gray-900">{check.description}</dt>
                  <dd className="text-center mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 ">
                    {check.result === 'OK' ? (
                      <Tooltip message={check.result}>
                        <FontAwesomeIcon className="text-green-500 h-4 sm:h-5" icon={faCircleCheck} />
                      </Tooltip>
                    ) : check.result === 'ERROR' ? (
                      <Tooltip message={check.explanation}>
                        <FontAwesomeIcon className="text-red-500 h-4 sm:h-5" icon={faCircleXmark} />
                      </Tooltip>
                    ) : (
                      <Tooltip message={check.explanation}>
                        <FontAwesomeIcon className="text-yellow-500 h-4 sm:h-5" icon={faCircleExclamation} />
                      </Tooltip>
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
