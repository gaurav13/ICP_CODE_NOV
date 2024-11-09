'use client';
import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import AddServayComponent from '@/components/ServayComponents/AddServayComponent';
export default function Page() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const router = useRouter();

  useEffect(() => {
    if (auth.state === 'anonymous') {
      router.replace('/');
    }
  }, [userAuth, auth]);

  const location = usePathname();
  let language;

  const changeLang = () => {
    if (LANG === 'jp') {
      language = location?.includes('super-admin/') ? 'en' : 'jp';
    } else {
      language = 'en';
    }
  };
  const funcCalling = changeLang();
  const { t, changeLocale } = useLocalization(language);

  return (
    <>
      <main id='main' className='dark'>
        <div className='main-inner admin-main'>
          <div className='section admin-inner-pnl' id='top'>
            <Row>
              <Col xl='9' lg='12' className='text-left'>
                <h1>{t('Add Survey')}</h1>
                <div className='spacer-20' />
                <AddServayComponent />
              </Col>
            </Row>
            <div className='mt-4' />
          </div>
        </div>
      </main>
    </>
  );
}
