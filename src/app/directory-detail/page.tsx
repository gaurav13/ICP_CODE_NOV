'use client';
import React from 'react';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import Web3DirectoryDetail from '@/components/Web3DirectoryDetail/Web3DirectoryDetail';

export default function DirectoryPG() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const directoryId = searchParams.get('directoryId');
  if (directoryId) {
    return <Web3DirectoryDetail directoryId={directoryId} />;
  } else {
    // router.push("/")
    return (
      <main id='main'>
        <div className='main-inner'>
          <div className='inner-content' />
        </div>{' '}
      </main>
    );
  }
}
