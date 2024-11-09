import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Cropper from 'react-easy-crop';
import ImgDialog from './ImgDialog';
import getCroppedImg from './cropImage';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import logger from '@/lib/logger';
import { CropperProps } from '@/types/cropper';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname } from 'next/navigation'
import { decimalToFraction } from '@/constant/decimalToFraction';
const dogImg =
  'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg';
const ImageCropper = ({
  show,
  handleClose,
  cropperProps,
}: {
  show: boolean;
  handleClose: () => void;
  cropperProps: CropperProps;
} 
) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const location = usePathname();
  let language;
 
  const changeLang = () => {
    if (LANG === 'jp') {
      language = location.includes('super-admin/') ? 'en' : 'jp';
    }
    else{
      language = "en"
    }
  };
  const funcCalling = changeLang()
  const { t, changeLocale } = useLocalization(language);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState(10);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleModalClose = () => {
    setZoom(1);
    setRange(10);
    setRotation(0);
    handleClose();
  };
  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        cropperProps.imgUrl,
        cropperProps.imgName,
        croppedAreaPixels,
        rotation
      );
      // console.log('donee', { croppedImage });
      setCroppedImage(croppedImage as any);
    } catch (e) {
      console.error(e);
    }
  };
  const handleSave = async () => {
    setLoading(true);
    await cropperProps.callBack(
      cropperProps.imgUrl,
      cropperProps.imgName,
      croppedAreaPixels,
      rotation
    );
    setLoading(false);
    setZoom(1);
    setRotation(0);
    setRange(10);
  };
  const onClose = () => {
    setCroppedImage(null);
  };

  return (
    <Modal animation={false} show={show} size='lg' onHide={handleModalClose}>
      <Modal.Header closeButton>
        {/* <p className=' m-0 expectedRatioheader'>{t('Expected ratio')} {decimalToFraction(cropperProps.aspect)}</p> */}
        <p className=' m-0 expectedRatioheader'>{t('Upload')} {cropperProps.maxWidth} <span className='imageCropperStandered'>x</span> {cropperProps.maxHeight} px {t("images to avoid cropping.")}</p>

      </Modal.Header>
      <Modal.Body>
        <div>
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 300,
              background: '#333',
            }}
          >
            <Cropper
              image={cropperProps.imgUrl}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              objectFit='contain'
              aspect={cropperProps.aspect}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={(e) => {
                setZoom(e);
                setRange(e * 10);
              }}
              maxZoom={4}
            />
          </div>
          <div className='cropper-controls mt-3'>
            <Form.Label className='h5'>{t('Zoom')}</Form.Label>
            <Form.Range
              value={range}
              min={10}
              max={40}
              onChange={(e) => {
                logger(e.target.valueAsNumber / 10);
                setZoom(e.target.valueAsNumber / 10);
                setRange(e.target.valueAsNumber);
              }}
            />
          </div>
          <div className='cropper-controls mt-3'>
            <Form.Label className='h5'>{t('Rotate')}</Form.Label>
            <Form.Range
              value={rotation}
              // min={10}
              max={360}
              onChange={(e) => {
                logger(e.target.valueAsNumber);
                setRotation(e.target.valueAsNumber);
              }}
            />
          </div>
          <div className='d-flex justify-content-center gap-3'>
            <Button
              className='publish-btn big  mt-2 px-3'
              onClick={handleModalClose}
            >
              {t('Cancel')}
            </Button>
            <Button
              className='publish-btn big mt-2  px-3'
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Spinner size='sm' /> : t('Save')}
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default ImageCropper;
