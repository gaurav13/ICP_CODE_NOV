// components/ScriptManager.js
'use client';
import { GOOGLE_ADD_SCRIPT } from '@/constant/config';
import { ADD_ARTICLE } from '@/constant/routes';
import { usePathname } from 'next/navigation';

const MainLayoutScript = () => {
  const pathname = usePathname();

  // Define the path(s) where the script should be excluded
  const excludeScriptPaths = [ADD_ARTICLE];

  const shouldExcludeScript = excludeScriptPaths.includes(pathname);
  if (shouldExcludeScript  || pathname.startsWith("/super-admin/")) {
    return null;
  } else {
    return (
      <>
        <script
          async
          src={GOOGLE_ADD_SCRIPT}
          crossOrigin='anonymous'
        ></script>
      </>
    );
  }
};

export default MainLayoutScript;
