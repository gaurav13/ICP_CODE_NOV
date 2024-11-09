'use client';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import EventDetails from '@/components/EventDetail/EventDetail';

export default function EventDetailsPG() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const eventId = searchParams.get('eventId');
  let router = useRouter();
  if (eventId) {
    return <EventDetails eventId={eventId} />;
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
