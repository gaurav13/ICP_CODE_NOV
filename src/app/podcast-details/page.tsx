'use client';
import React, { useEffect, useState } from 'react';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { useRouter } from 'next/navigation';
import Podcast from '@/components/Podcast';

export default function PodcastPage() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const articleId = searchParams.get('podcastId');
  let router = useRouter();
  if (articleId) {
    return <Podcast articleId={articleId} />;
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
