import useCollapsible from '../Hooks/useCollapsible';

export default function UnknownSignature(props: { signature: object; index: number }) {
  const { signature, index } = props;
  const initialStates = Object.keys(signature).map(() => false);
  const { isOpenArray, toggleCollapse } = useCollapsible(initialStates);

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-white shadow mx-8 my-8">
      <div className="px-4 py-5 text-white bg-red-400 text-5xl sm:px-6" onClick={() => toggleCollapse(index)}>
        <h3 className="text-base font-semibold leading-7">Not a signature produced by Criipto</h3>
      </div>
      {isOpenArray[index] && <div className="px-4 py-5 sm:p-6 bg-gray-100">This signature type is unknown.</div>}
    </div>
  );
}
