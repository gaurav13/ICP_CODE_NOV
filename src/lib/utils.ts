import { makeTokenCanister } from '@/dfx/service/actor-locator';
import clsx, { ClassValue } from 'clsx';
import { useRouter } from 'next/router';
import { twMerge } from 'tailwind-merge';
export function handleGoBack(router:any) {

  router?.back()
}
/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function IndexToChar(index: number) {
  switch (index) {
    case 0:
      return 'A';

    case 1:
      return 'B';
    case 2:
      return 'C';
      case 3:
        return 'D';
    default:
      return 'D';
  }
}


export function formatTime(seconds: number): string {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  
  // Add leading zero if necessary
  let minutesString = String(minutes).padStart(2, '0');
  let secondsString = String(remainingSeconds).padStart(2, '0');
  
  return `${minutesString}:${secondsString}`;
}
/**
 * getTokenSymble USE TO GET SYMBOLE OF TOKEN
 * @param identity 
 * @returns SYMBOLE OF TOKEN
 */
export async function getTokenSymble  (identity:any) {
  let tokenActor = await makeTokenCanister({
    agentOptions: {
      identity,
    },
  });
  let symbol= await tokenActor.icrc1_symbol();
  return ""
 
}


   /**
   * debounce use avoid the extra calls
   * @parms function and duration
   * @return   null;
   */
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
