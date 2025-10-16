import { useState } from 'react';

export function useOpenable() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const toggle = () => {
    setIsOpen((prevValue) => !prevValue);
  };

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle,
  };
}
