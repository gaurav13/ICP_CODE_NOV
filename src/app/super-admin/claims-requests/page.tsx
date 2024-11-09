'use client';
import React, { useEffect} from 'react';
import Head from 'next/head';
import { Row, Col } from 'react-bootstrap';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import PendingTokensClaimsList from '@/components/transections/TokensClaimRequests';
export default function UserManagment() {
  const router = useRouter();

  const { auth, userAuth} = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,


  }));
  const pathname = usePathname();
  

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.adminManagement && !userAuth.isAdminBlocked) {

          
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth, pathname]);

  return userAuth.userPerms?.adminManagement && !userAuth.isAdminBlocked ? (
    <>
      <main id='main' className='dark'>
        <div className='main-inner admin-main'>
          <div className='section admin-inner-pnl' id='top'>
            <Row className='mb-2'>
              <Col xl='8' lg='6' md='6'>
                <h1>Tokens Claims Requests</h1>
              </Col>
            </Row>
          </div>   
        </div>
        <div>
        <PendingTokensClaimsList isAdmin={true}/>
        </div>
      </main>
    </>
  ) : (
    <></>
  );
}
