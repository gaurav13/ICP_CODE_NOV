'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col } from 'react-bootstrap';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { usePathname, useRouter } from 'next/navigation';
import AddServayComponent from '@/components/ServayComponents/AddServayComponent';
import useSearchParamsHook from '@/components/utils/searchParamsHook';

export default function Page() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const router = useRouter();
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let surveyId = searchParams.get('SurveyId');

  return (
    userAuth.userPerms?.articleManagement &&
    !userAuth.isAdminBlocked && (
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <Head>
              <title>Hi</title>
            </Head>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='9' lg='12' className='text-left'>
                  <h1>
                    Survey Management <i className='fa fa-arrow-right' />{' '}
                    <span> {surveyId ? 'Edit' : 'Add'} Survey</span>
                  </h1>
                  <div className='spacer-20' />
                  <AddServayComponent />
                </Col>
              </Row>
              <div className='mt-4' />
            </div>
          </div>
        </main>
      </>
    )
  );
}
