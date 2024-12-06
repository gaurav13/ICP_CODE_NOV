'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Container, Modal, Spinner } from 'react-bootstrap';
import { LANG } from '@/constant/language';
import Logo from '@/assets/Img/login/logo-block.png';
import googleicon from '@/assets/Img/login/google.png';
import infinityicon from '@/assets/Img/infinity.png';
import Image from 'next/image';
import Link from 'next/link';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import useLocalization from '@/lib/UseLocalization';
import authMethods from '@/lib/auth';
import { LoginEnum } from '@/lib/utils';
import logger from '@/lib/logger';
import Connect from '@/components/Connect/Connect';
import { useRouter } from 'next/navigation';

export default function login() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const { t, changeLocale } = useLocalization(LANG);
  const [selected, setSelected] = useState<LoginEnum | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  let router = useRouter();
  let handleClose = () => {};

  const { login } = authMethods({
    useConnectPlugWalletStore,
    setIsLoading,
    handleClose,
  });
  async function handleLogin(type: LoginEnum) {
    setSelected(type);
    login(type);
  }

  useEffect(() => {
    if (!auth.isLoading && auth.state == 'initialized') {
      router.push('/');
    }
  }, [auth]);
  return (
    <>
      <Connect hideUi={true} />
      <Container className='admin-log-main' fluid>
        <div className='logo-cntnr'>
          <Link href='/'>
            <Image src={Logo} alt='Logo' />
          </Link>
        </div>
        <Row>
          <Container className='text-center'>
            <div className='text-pnl'>
              <h1>Log in or sign up in seconds</h1>
              <h2>
                Use your email or wallet services to continue with Blockza{' '}
                <br />
                (It’s Free)!
              </h2>
              <Button
                onClick={() => handleLogin(LoginEnum.NFID)}
                disabled={auth.isLoading || auth?.state == 'initialized'}
              >
                <Image src={googleicon} alt='Google Icon' />
                {auth.isLoading && selected == LoginEnum.NFID ? (
                  <span>
                    <Spinner size='sm' />
                  </span>
                ) : (
                  t('Continue with Google')
                )}
              </Button>
              <p>
                Enhanced with cryptography by{' '}
                <Link target='_blank' href='https://learn.nfid.one'>
                  NFID
                </Link>
              </p>
              <Button
                onClick={() => handleLogin(LoginEnum.InternetIdentity)}
                disabled={auth.isLoading || auth?.state == 'initialized'}
              >
                {' '}
                <Image src={infinityicon} alt='infinity icon' />
                {auth.isLoading && selected == LoginEnum.InternetIdentity ? (
                  <span>
                    <Spinner size='sm' />
                  </span>
                ) : (
                  t('Login with Internet Identity')
                )}
              </Button>
              <p>
                What is Internet{' '}
                <Link
                  target='_blank'
                  href='https://internetcomputer.org/internet-identity'
                >
                  Identity?
                </Link>
              </p>
              <p>
                By continuing, you agree to BlockZa’s{' '}
                <Link href='/privacy-policy'>Terms of Use</Link>.<br /> Read our{' '}
                <Link href='/terms-of-use'>Privacy Policy.</Link>
              </p>
            </div>
          </Container>
        </Row>
      </Container>
    </>
  );
}
