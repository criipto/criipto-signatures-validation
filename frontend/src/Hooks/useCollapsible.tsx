import { useState, useMemo, useCallback } from 'react';

function useCollapsible(initialStates: boolean[]) {
  const [isOpenArray, setIsOpenArray] = useState(initialStates);

  const toggleCollapse = useCallback(
    (index: number) => {
      const updatesIsOpenArray = [...isOpenArray];
      updatesIsOpenArray[index] = !updatesIsOpenArray[index];
      setIsOpenArray(updatesIsOpenArray);
    },
    [isOpenArray]
  );

  const memoizedValue = useMemo(() => {
    return {
      isOpenArray,
      toggleCollapse,
    };
  }, [isOpenArray, toggleCollapse]);

  return memoizedValue;
}

export default useCollapsible;
