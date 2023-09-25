import { useState } from 'react';

function useCollapsible(initialStates: boolean[]) {
  const [isOpenArray, setIsOpenArray] = useState(initialStates);

  const toggleCollapse = (index: number) => {
    const updatesIsOpenArray = [...isOpenArray];
    updatesIsOpenArray[index] = !updatesIsOpenArray[index];
    setIsOpenArray(updatesIsOpenArray);
  };

  return {
    isOpenArray,
    toggleCollapse,
  };
}

export default useCollapsible;
