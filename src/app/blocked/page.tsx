'use client';
import { BLOCKED } from '@/constant/routes';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function Blocked() {
  const { userAuth } = useConnectPlugWalletStore((state) => ({
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const location = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (!userAuth.status) {
      router.replace('/');
    }
  }, [userAuth]);
  useEffect(() => {
    if (location.startsWith(BLOCKED) && !location.endsWith('/')) {
     router.push(`${BLOCKED}/`);
   }
     }, [])
  return (
    <>
      <main id='main'>
        <div className='main-inner d-flex justify-content-center mt-5  p-5'>
          <p className='fw-bold h3 text-center'>
            Your account has been blocked by an administrator. Kindly reach out
            to the admin to submit an appeal for unblocking
          </p>
        </div>
      </main>
    </>
  );
}
