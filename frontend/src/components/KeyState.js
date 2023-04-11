import { useState, useEffect } from 'react';

export const useKeyState = (key, initialValue) => {
  const [keyState, setKeyState] = useState(localStorage.getItem(key) || initialValue);

  useEffect(() => {
    localStorage.setItem(key, keyState);
  }, [key, keyState]);

  return [keyState, setKeyState];
};