'use client';
import React, { useEffect } from 'react';
import Head from 'next/head';
import { Row, Col } from 'react-bootstrap';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import AddQuizComponent from '@/components/QuizListComponent/AddQuizComponent';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
export default function Page() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let quizId = searchParams.get('quizId');
  const router = useRouter();
  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth]);

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
                    Quiz Management <i className='fa fa-arrow-right' />{' '}
                    <span> {quizId ? 'Edit' : 'Add'} Quiz</span>
                  </h1>
                  <div className='spacer-20' />
                  <AddQuizComponent />
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
