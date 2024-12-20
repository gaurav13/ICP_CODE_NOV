'use client';
import Connect from '@/components/Connect/Connect';
import authMethods from '@/lib/auth';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import Image from 'next/image';
import React, { useState } from 'react';
import iconlogo from '@/assets/Img/Icons/icon-logo.png';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import ConfirmationModel from '@/components/Modal/ConfirmationModel';

function ConnectModal({
  handleClose,
  showModal,
  link,
}: {
  handleClose: () => void;
  showModal: boolean;
  link?: string;
}) {
  const [isConnectLoading, setIsConnectLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connected, setConnected] = useState(false);
  const router = useRouter();
  const [loginModalShow, setLoginModalShow] = React.useState(false);

  const handleConnectClose = () => {
    setIsConnectLoading(false);
    if (link) router.push(link);
    handleClose();
  };

  const methods = authMethods({
    useConnectPlugWalletStore,
    setIsLoading: setIsConnectLoading,
    handleClose: handleConnectClose,
  });
  const connect = async () => {
    setIsConnectLoading(true);
    setLoginModalShow(true)
    // const login = await methods.login();
    // logger(link, 'logged in ');
  };
  React.useEffect(() => {
    document.body.classList.add('no-scroll');
  }, [showModal]);
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <h4 className='mb-0'>{t('Connect With Internet Identity')}</h4>
      </Modal.Header>
      <Modal.Body>
        <div className='d-flex justify-content-center gap-2'>
          <Button
            onClick={connect}
            className='connect-btn shj'
            disabled={isConnectLoading}
          >
            <span style={{ width: '30px', height: '30px' }} className='me-2'>
              <Image src={iconlogo} alt='Blockza' height={25} width={25} />
            </span>
            {isConnectLoading ? (
              <Spinner size='sm' className='ms-4 text-primary' />
            ) : connected ? (
              <span className='text-black'>{t('Disconnect')}</span>
            ) : (
              <span className='text-black'>{t('Connect ')}</span>
            )}
          </Button>
          {/* <Button className='default-btn' onClick={handleClose}>
            Cancel
          </Button> */}
        </div>
      </Modal.Body>
    </Modal>
     <ConfirmationModel
     show={loginModalShow}
     handleClose={() => setLoginModalShow(false)}
     handleConfirm={connect}
   />
   </>
  );
}

export default ConnectModal;
