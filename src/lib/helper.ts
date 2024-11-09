import { Principal } from '@dfinity/principal';

export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}
/**
 * isPrincipal use to check given value is principal or not
 * @param value 
 * @returns boolean
 */
export function isPrincipal(value: any): boolean {
  try {
    Principal.fromText(value as string);
    return true;
  } catch {
    return false;
  }
}

