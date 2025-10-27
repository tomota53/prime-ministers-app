import { useState, useEffect } from 'react';

/**
 * LocalStorageを使用した状態管理フック
 * @param {string} key - LocalStorageのキー
 * @param {*} initialValue - 初期値
 * @returns {[*, function]} - [値, 値を設定する関数]
 */
const useLocalStorage = (key, initialValue) => {
  // LocalStorageから初期値を取得
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // 値が変更されたらLocalStorageに保存
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
