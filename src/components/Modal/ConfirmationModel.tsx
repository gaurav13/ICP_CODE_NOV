import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import infinity from '@/assets/Img/Icons/infinity.png';
import NFIDLogo from '@/assets/Img/NFID.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { LoginEnum } from '@/lib/utils';
import authMethods from '@/lib/auth';
import googleicon from '@/assets/Img/login/google.png';
import logo2 from '@/assets/Img/Logo/headerlogo.png';
import Link from 'next/link';
import '../../styles/login_popup.css';
import infinityicon from '@/assets/Img/infinity.png';

function ConfirmationModel({
  show,
  handleClose,
  handleConfirm,
}: {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}) {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const { t, changeLocale } = useLocalization(LANG);
  const [selected, setSelected] = useState<LoginEnum | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    if (auth.state == 'initialized') handleClose();
  }, [auth.isLoading]);
  return (
    <>
  
    <Modal
      show={show}
      onHide={handleClose}
      backdrop={auth.isLoading ? 'static' : true}
      keyboard={false}
      className='login-modaol'
      centered
    >
      <Modal.Body>
        <div style={{ position: 'absolute', right: '13px', top: '8px' }}><Button
          disabled={auth.isLoading}
          className='custome-close-btn newDesignCloseBTn '
          onClick={handleClose}
        >
          <i className='fa fa-close ' />
        </Button></div>
        <h2> {LANG === 'jp' ? '数秒でログインまたはサインアップ' : 'Log in or sign up in seconds'}</h2>
        <h4>
        {LANG === 'jp'
        ? 'メールまたはウォレットサービスを使用して Blockza を続行してください（無料です）！'
        : 'Use your email or wallet services to continue with Blockza (it’s free)!'}
        </h4>
        <Button
          className='reg-btn-full'
          disabled={auth.isLoading}
          id='nfid_btn'
          onClick={() => handleLogin(LoginEnum.NFID)}
        >
          <Image src={googleicon} alt='Google ' />
          {auth.isLoading && selected == LoginEnum.NFID ? (
            <span>
              <Spinner size='sm' />
            </span>
          ) : (
            t('Google')
          )}
        </Button>
        <Link href='https://learn.nfid.one'>
        {LANG === 'jp'
      ? '暗号化で強化されています NFID'
      : 'Enhanced with cryptography by NFID'}
        </Link>
        <Button
          className='reg-btn-full'
          disabled={auth.isLoading}
          onClick={() => handleLogin(LoginEnum.InternetIdentity)}
          id='handleLogin_identity'
        >
           <Image src={infinityicon} alt="infinity icon" />
          {auth.isLoading && selected == LoginEnum.InternetIdentity ? (
            <span>
              <Spinner size='sm' />
            </span>
          ) : (
            t('Internet Identity')
          )}
        </Button>
        <Link
          className='mb-1'
          href='https://internetcomputer.org/internet-identity'
        >
          {LANG === 'jp'
      ? 'インターネットアイデンティティについてもっと知る'
      : 'Learn more about Internet Identity'}
        </Link>
        <p style={{ fontSize: '12px' }}>
        {LANG === 'jp'
    ? '続行することで、BlockZa の '
    : 'By continuing, you agree to BlockZa’s '}{' '}
          <Link href='/terms-of-use/'>{LANG === 'jp' ? '利用規約' : 'Terms of Use'}</Link>.<br /> Read our{' '}
          <Link href='/privacy-policy/'>{LANG === 'jp' ? 'プライバシーポリシー' : 'Privacy Policy'}</Link>
        </p>
        {/* <Link href="#"><h6>Other options?</h6></Link> */}
        {/* <Button variant="secondary" onClick={handleClose}>
            Close
          </Button> */}
      </Modal.Body>
      {/* <Modal.Body>
      <Button
        disabled={auth.isLoading}
        className='custome-close-btn '
        onClick={handleClose}
      >
        <i className='fa fa-close ' />
      </Button>
      <div className='d-flex justify-content-center'>
      <Image src={logo2} alt='Blockza' className='blockzaLogo' />
      </div>
      <div className='text-center mt-3 white-modal'>
        <p className='text-left titletxt'>{t("Connect With Internet Identity")} </p>
        <Button
          className=' connect-btn II'
          disabled={auth.isLoading}
          onClick={() => handleLogin(LoginEnum.InternetIdentity)}
          id='handleLogin_identity'
        >
          <Image
            src={infinity}
            alt='Infinte Logo'
          />
          {auth.isLoading && selected == LoginEnum.InternetIdentity ? (
            <Spinner size='sm' />
          ) : (
            <span className='rgb II'>{t("connect")}</span>
          )}
          <span style={{ width: 55 }}></span>
        </Button>
        <p className='text-left second titletxt'>{t("Connect With Google")}</p>
        <Button
          className='connect-btn NFID'
          disabled={auth.isLoading}
          id='nfid_btn'
          onClick={() => handleLogin(LoginEnum.NFID)}
        >
           <Image
            src={NFIDLogo}
            alt='Google Logo'
          />
          {auth.isLoading && selected == LoginEnum.NFID ? (
            <Spinner size='sm' />
          ) : (
            <span className='rgb NFID'>{t("Google")}</span>
          )}
          <span style={{ width: 66 }}></span>
        </Button>
      </div>
    </Modal.Body> */}
    </Modal>
    </>
  );
}

export default ConfirmationModel;
