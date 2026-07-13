import { useState, useCallback, useRef, useEffect } from 'react';
import { storage } from '../utils/storage';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = storage.get(key);
    return item !== null ? item : initialValue;
  });

  const keyRef = useRef(key);
  const valueRef = useRef(storedValue);

  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  useEffect(() => {
    valueRef.current = storedValue;
  }, [storedValue]);

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(valueRef.current) : value;
        setStoredValue(valueToStore);
        const result = storage.set(keyRef.current, valueToStore);
        if (result && result.error === 'quota_exceeded') {
          console.error('Storage quota exceeded. Data saved in memory only.');
        }
      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
    },
    []
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storage.remove(keyRef.current);
    } catch (error) {
      console.error('Error removing localStorage:', error);
    }
  }, [initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
