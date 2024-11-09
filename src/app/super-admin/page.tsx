'use client';
import { redirect } from 'next/navigation';
import authMethods from '@/lib/auth';
import { useConnectPlugWalletStore } from '@/store/useStore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, Spinner } from 'react-bootstrap';
import iconlogo from '@/assets/Img/Icons/icon-logo.png';
import logo from '@/assets/Img/Logo/Footer-logo.png';
import { ConnectPlugWalletSlice } from '@/types/store';
import logger from '@/lib/logger';
export default function SuperAdmin() {
  const [isConnectLoading, setIsConnectLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState(false);

  const { auth, setAuth, setIdentity, userAuth } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      setIdentity: state.setIdentity,
      userAuth: (state as ConnectPlugWalletSlice).userAuth,
    })
  );

  const handleConnectClose = () => {
    setIsConnectLoading(false);
  };

  const methods = authMethods({
    useConnectPlugWalletStore,
    setIsLoading: setIsConnectLoading,
    handleClose: handleConnectClose,
  });
  const connect = async () => {
    setIsConnectLoading(true);
    const login = await methods.login();
  };
  const disconnect = async () => {
    await methods.logout();
    await methods.initAuth();
    setConnected(false);
    // if (userAuth.status) {
    //   router.replace('/');
    // }
  };
  React.useEffect(() => {
    const getIdentity = async () => {
      if (auth.client) {
        const con = await auth.client.isAuthenticated();
        setConnected(con);
      }
    };
    getIdentity();
  }, [auth]);
  React.useEffect(() => {
    if (!userAuth.isAdminBlocked) {
      if (userAuth.userPerms?.userManagement) {
        redirect('/super-admin/user-managment');
      } else if (userAuth.userPerms?.articleManagement) {
        redirect('/super-admin/article-list');
      } else if (userAuth.userPerms?.adminManagement) {
        redirect('/super-admin/make-admin');
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [connected, auth]);

  return (
    <>
      <div
        className='d-flex justify-content-center align-items-center w-100 position-fixed h-100'
        id=''
        style={{ backgroundColor: '#24292d' }}
      >
        <Container className=''>
          <Row>
            {isLoading ? (
              <div className='d-flex justify-content-center'>
                {' '}
                <Spinner animation='border' variant='light' />
              </div>
            ) : userAuth?.isAdminBlocked ? (
              <Col className='d-flex flex-column align-items-center text-white'>
                <div>
                  <Image src={logo} alt='Blockza' height={150} width={150} />
                </div>
                <p className={`d-inline superadmintext my-4`}>
                  {
                    'Access to your account has been restricted by the superadmin. Kindly reach out to the superadmin for assistance in resolving and lifting the restriction on your account.'
                  }
                </p>
              </Col>
            ) : (
              <Col className='d-flex flex-column align-items-center text-white'>
                <div>
                  <Image src={logo} alt='Blockza' height={150} width={150} />
                </div>
                <p className={`d-inline superadmintext my-4`}>
                  {connected
                    ? 'You have no rights assigned !'
                    : 'Please connect your wallet to Internet Identity'}{' '}
                </p>
                <div>
                  <Button
                    onClick={connected ? disconnect : connect}
                    className='connect-btn shj'
                    disabled={isConnectLoading}
                  >
                    <span
                      style={{ width: '30px', height: '30px' }}
                      className='me-2'
                    >
                      <Image
                        src={iconlogo}
                        alt='Blockza'
                        height={25}
                        width={25}
                      />
                    </span>
                    {isConnectLoading ? (
                      <Spinner size='sm' className='ms-4 text-primary' />
                    ) : connected ? (
                      <span className='text-black'>Disconnect</span>
                    ) : (
                      <span className='text-black'>Connect</span>
                    )}
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </div>
    </>
  );
}
