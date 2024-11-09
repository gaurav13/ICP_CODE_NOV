
import Image from 'next/image';
import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import infinity from '@/assets/Img/Icons/infinity.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
function ConfirmationModel({ show, handleClose, handleConfirm }:{ show:boolean, handleClose:() => void, handleConfirm:() => void }) {
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("Connect with Internet Identity")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t("Are you sure you want to connect with Internet Identity?")}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t("Cancel")}
        </Button>
        <Button  className='confirmationBtn' onClick={handleConfirm}>
     
                        <Image
                          src={infinity}
                          alt='icpimage'
                          style={{ height: '10px  ', width: '20px' }}
                        /> {t("Connect")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModel
