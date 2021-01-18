import * as React from 'react';

export function useStickyObjectState<T>(defaultValue: T, key: string): [T, React.Dispatch<T>] {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

export function useStickyPrimitiveState<T extends string | number>(
  defaultValue: T,
  key: string
): [T, React.Dispatch<T>] {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return (stickyValue !== null ? JSON.parse(stickyValue).value : defaultValue) ?? defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify({ value: value }));
  }, [key, value]);
  return [value, setValue];
}
