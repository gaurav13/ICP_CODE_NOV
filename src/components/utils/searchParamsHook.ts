import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

function useSearchParamsHook(): string {
  const [currentPagePath, setCurrentPagePath] = useState<string>('');
let params=useParams()
  useEffect(() => {
    setCurrentPagePath(window.location.search);
  }, [params]); // Run this effect only once after component mounts

  return currentPagePath;
}

export default useSearchParamsHook;