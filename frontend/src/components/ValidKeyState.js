import { useState, useEffect } from 'react';

export const useValidKeyState = (validKey, initialValue) => {
  const [validKeyState, setValidKeyState] = useState(localStorage.getItem(validKey) || initialValue);

  useEffect(() => {
    localStorage.setItem(validKey, validKeyState);
  }, [validKey, validKeyState]);

  return [validKeyState, setValidKeyState];
};