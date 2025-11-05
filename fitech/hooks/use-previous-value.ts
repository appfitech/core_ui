import { useEffect, useRef } from 'react';

const usePreviousValue = <TValue>(value?: TValue): TValue | undefined => {
  const prevValue = useRef<TValue>();

  useEffect(() => {
    prevValue.current = value;

    return () => {
      prevValue.current = undefined;
    };
  });

  return prevValue.current;
};

export default usePreviousValue;
