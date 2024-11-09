import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal, Spinner, Row, Col } from 'react-bootstrap';
import { number, object, string } from 'yup';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  Formik,
  FormikHelpers,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
  useFormikContext,
  FormikTouched,
  setNestedObjectValues,
} from 'formik';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import { fileToCanisterBinaryStoreFormat } from '@/dfx/utils/image';
import { toast } from 'react-toastify';
import logger from '@/lib/logger';
import {
  makeEntryActor,
  makeLedgerCanister,
} from '@/dfx/service/actor-locator';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { useConnectPlugWalletStore } from '@/store/useStore';
import Image from 'next/image';
import { BASE_IMG_URL, isDescription, isValidFileType } from '@/constant/image';
import {
  ARTICLE_FEATURED_IMAGE_ASPECT,
  COMPANY_BANNER_IMAGE_ASPECT,
  COMPANY_FOUNDER_IMAGE_ASPECT,
  COMPANY_LOGO_IMAGE_ASPECT,
  MAX_ARTICLE_FEATURED_SIZES,
  MAX_COMPANY_BANNER_SIZES,
  MAX_COMPANY_FOUNDER_SIZES,
} from '@/constant/sizes';
import { CropperProps } from '@/types/cropper';
import ImageCropper from '@/components/Cropper';
import getCroppedImg from '@/components/Cropper/cropImage';
import resizeImage from '@/components/utils/resizeImage';
import getCategories from '@/components/utils/getCategories';
import uploadImage from '@/components/utils/uploadImage';
import { getImage } from '@/components/utils/getImage';
import { Principal } from '@dfinity/principal';
import { getIdFromLink, getIdFromUrl } from '@/constant/DateFormates';
import Texteditor from '@/components/cutomeEditor/Editor';
import { EMAIL_VALIDATE } from '@/constant/regulerExpression';
import Tippy from '@tippyjs/react';
function ScrollToError() {
  const formik = useFormikContext();
  const submitting = formik?.isSubmitting;

  useEffect(() => {
    const el = document.querySelector('.Mui-err');
    (el?.parentElement ?? el)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [submitting]);
  return null;
}
export default function AddCompanyForm({
  showWeb3Model,
  setShowWeb3Model,
  reFetchfn,
  directoryId,
  handleWeb3modelclose,
}: {
  showWeb3Model: any;
  setShowWeb3Model: any;
  reFetchfn?: any;
  directoryId?: any;
  handleWeb3modelclose?: any;
}) {
  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state: any) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );

  const [tempweb3PreviewImg, setTempweb3PreviewImg] = useState('');
  const { t, changeLocale } = useLocalization(LANG);
  const [previewweb3File, setPreviewweb3File] = useState<File | null>(null);
  const [cropperImg, setCropperImg] = useState<CropperProps | undefined>();
  const [showCropper, setShowCropper] = useState(false);
  const [tempWeb3, setDirectory] = useState<any>();

  const [isWeb3Submitting, setisWeb3Submitting] = useState(false);
  const [tempweb3BannerPreviewImg, setTempweb3BannerPreviewImg] = useState('');
  const [bannerLink, setBannerLink] = useState<undefined | string>();
  const [logoLink, setLogoLink] = useState<undefined | string>();
  const [founderLink, setFounderLink] = useState<undefined | string>();
  const [previewweb3BannerFile, setPreviewweb3BannerFile] =
    useState<File | null>(null);
  const [tempweb3ComapnyPreviewLogo, setTempweb3ComapnyPreviewLogo] =
    useState('');
  const [previewweb3companyLogoFile, setPreviewweb3companyLogoFile] =
    useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>();

  const [logoError, setLogoError] = useState(false);
  const [bannerError, setBannerError] = useState(false);
  const [founderError, setFounderError] = useState(false);
  const [web3Content, setweb3Content] = useState('');
  const [discriptionErr, setDiscriptionErr] = useState(false);

  const web3FormikRef = useRef<FormikProps<FormikValues>>(null);
  const initialWeb3Values: any = {
    company: tempWeb3 ? tempWeb3.company : '',
    companyLogo: '',
    // companyDetail: tempWeb3 ? tempWeb3.companyDetail : '',
    shortDescription: tempWeb3 ? tempWeb3.shortDescription : '',
    founderName: tempWeb3 ? tempWeb3.founderName : '',
    founderDetail: tempWeb3 ? tempWeb3.founderDetail : '',
    founderImage: '',
    companyBanner: '',
    catagory: tempWeb3 ? tempWeb3.catagory : '',
    companyUrl: tempWeb3
      ? tempWeb3?.companyUrl?.length != 0
        ? tempWeb3.companyUrl[0]
        : ''
      : '',
    facebook: tempWeb3
      ? tempWeb3?.facebook?.length != 0
        ? tempWeb3.facebook[0]
        : ''
      : '',
    instagram: tempWeb3
      ? tempWeb3?.instagram?.length != 0
        ? tempWeb3.instagram[0]
        : ''
      : '',
    linkedin: tempWeb3
      ? tempWeb3?.linkedin?.length != 0
        ? tempWeb3.linkedin[0]
        : ''
      : '',
    discord: tempWeb3
      ? tempWeb3?.discord?.length != 0
        ? tempWeb3.discord[0]
        : 'no'
      : 'no',
    telegram: tempWeb3
      ? tempWeb3?.telegram?.length != 0
        ? tempWeb3.telegram[0]
        : ''
      : '',
    twitter: tempWeb3
      ? tempWeb3?.twitter?.length != 0
        ? tempWeb3.twitter[0]
        : ''
      : '',
    founderEmail: tempWeb3
      ? tempWeb3?.founderEmail?.length != 0
        ? tempWeb3.founderEmail
        : ''
      : '',
  };
  const web3Schema = object().shape({
    company: string()
      .required(t('Company Name is required'))
      .max(100, t('Company Name cannot be more than 100 characters')),
    // description: string().required('Description is required'),
    shortDescription: string()
      .required(t('Short Description is required'))
      .max(250, t('Short Description cannot be more than 250 characters')),
    // companyDetail: string()
    //   .required(t('Company Detail is required'))
    //   .max(1000, t('Company Detail cannot be more than 1000 characters')),
    founderName: string()
      .required(t('Founder Name is required'))
      .max(200, t('Founder Name cannot be more than 200 characters')),
    founderDetail: string()
      .required(t('Founder Detail is required'))
      .max(400, t('Founder Detail cannot be more than 400 characters')),
    catagory: string().required(t('Category is required')),
    // img: mixed().required('Image is required'),
    companyUrl: string().url(t('Company Link must be a valid Link')),
    facebook: string().url(t('Facebook Link must be a valid Link')),
    instagram: string().url(t('Youtube Link must be a valid Link')),
    linkedin: string().url(t('LinkedIn Link must be a valid Link')),
    discord: string(),
    telegram: string().url(t('Telegram Link must be a valid Link')),
    twitter: string().url(t('Twitter Link must be a valid Link')),
    founderEmail: string()
      .required(t('Founder Email is required'))
      .trim()
      .matches(EMAIL_VALIDATE, t('Invalid Email')),
  });
  const comapanyLogoUpload = async (
    imgUrl: string,
    imgName: string,
    pixels: any,
    rotation: number = 0
  ) => {
    const croppedImage = await getCroppedImg(imgUrl, imgName, pixels, rotation);
    if (!croppedImage) return;
    const resizedFile = await resizeImage(
      croppedImage,
      MAX_COMPANY_FOUNDER_SIZES.width,
      MAX_COMPANY_FOUNDER_SIZES.height
    );
    const newUrl = URL.createObjectURL(resizedFile);
    const _logoLink = await uploadImage(resizedFile);
    setLogoLink(_logoLink);
    setTempweb3ComapnyPreviewLogo(newUrl);
    setPreviewweb3companyLogoFile(resizedFile);
    setLogoError(false);
    handleHideCropper();
  };
  const comapanyFounderUpload = async (
    imgUrl: string,
    imgName: string,
    pixels: any,
    rotation: number = 0
  ) => {
    const croppedImage = await getCroppedImg(imgUrl, imgName, pixels, rotation);
    if (!croppedImage) return;
    const resizedFile = await resizeImage(
      croppedImage,
      MAX_COMPANY_FOUNDER_SIZES.width,
      MAX_COMPANY_FOUNDER_SIZES.height
    );
    const newUrl = URL.createObjectURL(resizedFile);
    const _founderLink = await uploadImage(resizedFile);
    setFounderLink(_founderLink);
    setTempweb3PreviewImg(newUrl);
    setPreviewweb3File(resizedFile);

    setFounderError(false);

    handleHideCropper();
  };
  const handleShowCropper = () => {
    setShowCropper(true);
  };
  const handleHideCropper = () => {
    setShowCropper(false);
  };
  const handleImageChageCommon = (e: any, imgName: string) => {
    const img = e.target.files[0];
    if (!img) return;

    const validType = isValidFileType(img && img.name.toLowerCase(), 'image');
    if (!validType) {
      toast.error(t('Not a valid image type'));
      return;
    }
    // setImgCation(img.name);

    const imgUrl = URL.createObjectURL(img);
    switch (imgName) {
      case 'logo':
        setCropperImg({
          imgUrl,
          imgName: img.name,
          aspect: COMPANY_LOGO_IMAGE_ASPECT,
          callBack: comapanyLogoUpload,
          maxWidth: MAX_COMPANY_FOUNDER_SIZES.width,
          maxHeight: MAX_COMPANY_FOUNDER_SIZES.height,
        });
        break;
      case 'founder':
        setCropperImg({
          imgUrl,
          imgName: img.name,
          aspect: COMPANY_FOUNDER_IMAGE_ASPECT,
          callBack: comapanyFounderUpload,
          maxWidth: MAX_COMPANY_FOUNDER_SIZES.width,
          maxHeight: MAX_COMPANY_FOUNDER_SIZES.height,
        });
        break;
      case 'banner':
        setCropperImg({
          imgUrl,
          imgName: img.name,
          aspect: COMPANY_BANNER_IMAGE_ASPECT,
          callBack: comapanyBannerUpload,
          maxWidth: MAX_COMPANY_BANNER_SIZES.width,
          maxHeight: MAX_COMPANY_BANNER_SIZES.height,
        });
        break;

      default:
        toast.error(t('Errorr while uploading media'));
        logger(
          t(
            'Image name didn not match any of the provided cases please add a case if you want to use this function for more images'
          )
        );
        break;
    }
    handleShowCropper();
    e.target.value = '';
  };
  const comapanyBannerUpload = async (
    imgUrl: string,
    imgName: string,
    pixels: any,
    rotation: number = 0
  ) => {
    const croppedImage = await getCroppedImg(imgUrl, imgName, pixels, rotation);
    if (!croppedImage) return;
    const resizedFile = await resizeImage(
      croppedImage,
      MAX_COMPANY_BANNER_SIZES.width,
      MAX_COMPANY_BANNER_SIZES.height
    );

    const newUrl = URL.createObjectURL(resizedFile);
    const _bannerLink = await uploadImage(resizedFile);
    setBannerLink(_bannerLink);
    setTempweb3BannerPreviewImg(newUrl);
    setPreviewweb3BannerFile(resizedFile);
    setBannerError(false);
    handleHideCropper();
  };
  const web3ModelClose = () => {
    setShowWeb3Model(false);
    setTempweb3BannerPreviewImg('');
    setPreviewweb3BannerFile(null);
    setTempweb3PreviewImg('');
    setPreviewweb3File(null);
    setTempweb3ComapnyPreviewLogo('');
    setPreviewweb3companyLogoFile(null);
    if (handleWeb3modelclose) {
      handleWeb3modelclose();
    }
  };
  const web3ModelShow = () => setShowWeb3Model(true);
  let submitWeb3form = (e: any) => {
    e.preventDefault();
    if (!founderLink) {
      setFounderError(true);
    }
    if (!bannerLink) {
      setBannerError(true);
    }
    if (!logoLink) {
      setLogoError(true);
    }
    let isDec = isDescription(web3Content);

    if (isDec.length <= 0) {
      setDiscriptionErr(true);
    }
    web3FormikRef.current?.handleSubmit();
  };
  const resetWeb3 = () => {
    setShowWeb3Model(false);
    setTempweb3BannerPreviewImg('');
    setPreviewweb3BannerFile(null);
    setTempweb3PreviewImg('');
    setPreviewweb3File(null);
    setTempweb3ComapnyPreviewLogo('');
    setPreviewweb3companyLogoFile(null);
    setweb3Content('');
    setFounderLink(undefined);
    setBannerLink(undefined);
    setLogoLink(undefined);
  };
  let addWeb3 = async (e: any) => {
    if (!identity)
      return toast.error(t('Please connect to internet identity.'));

    let founderImgArray = null;
    let web3BannerArray = null;
    let web3CompanyLogoArray = null;
    let isDec = isDescription(web3Content);

    if (isDec.length <= 0) {
      setDiscriptionErr(true);
      return;
    }
    if (e.catagory === 'Please Select Category') {
      return toast.error(t('Please select at least one  category'));
    }
    if (
      previewweb3File !== null ||
      (founderLink != undefined && founderLink != null)
    ) {
      // founderImgArray = await fileToCanisterBinaryStoreFormat(previewweb3File);
      founderImgArray = BASE_IMG_URL + founderLink;
    } else {
      return toast.error(t('Please select a Founder Image.'));
    }

    if (
      previewweb3BannerFile !== null ||
      (bannerLink != undefined && bannerLink != null)
    ) {
      // web3BannerArray = await fileToCanisterBinaryStoreFormat(
      //   previewweb3BannerFile
      // );
      web3BannerArray = BASE_IMG_URL + bannerLink;
    } else {
      return toast.error(t('Please select company Banner Image.'));
    }
    if (
      previewweb3companyLogoFile !== null ||
      (logoLink != undefined && logoLink != null)
    ) {
      // web3CompanyLogoArray = await fileToCanisterBinaryStoreFormat(
      //   previewweb3companyLogoFile
      // );
      web3CompanyLogoArray = BASE_IMG_URL + logoLink;
      logger(logoLink, 'logoLink');
    } else {
      return toast.error(t('Please select Company Logo.'));
    }
    logger(e, 'web3form');
    setisWeb3Submitting(true);
    let tempWeb3 = {
      company: e.company,
      shortDescription: e.shortDescription,
      companyDetail: web3Content,
      founderName: e.founderName,
      founderDetail: e.founderDetail,
      founderImage: founderImgArray,
      companyBanner: web3BannerArray,
      companyLogo: web3CompanyLogoArray,
      catagory: e.catagory,
      companyUrl: e.companyUrl,
      facebook: e.facebook,
      instagram: e.instagram,
      linkedin: e.linkedin,
      discord: e.discord,
      telegram: e.telegram,
      twitter: e.twitter,
      founderEmail: e.founderEmail,
    };
    let entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    if (directoryId) {
      entryActor
        .insertWeb3(
          tempWeb3,
          userCanisterId,
          commentCanisterId,
          directoryId,
          true
        )
        .then((e: any) => {
          setisWeb3Submitting(false);
          if (e.ok) {
            toast.success(t('Company Updated successfully.'));
            reFetchfn();
            resetWeb3();
          } else {
            toast.error(e.err);
          }
        })
        .catch((err: any) => {
          toast.error(t('Something went wrong.'));
          setisWeb3Submitting(false);
          resetWeb3();
        });
    } else {
      entryActor
        .insertWeb3(tempWeb3, userCanisterId, commentCanisterId, '', false)
        .then((e: any) => {
          setisWeb3Submitting(false);
          if (e.ok) {
            toast.success(
              t(
                'Your directory has been published successfully. We will review it shortly and contact you with feedback. Thank you for your submission.'
              )
            );
            reFetchfn();
            resetWeb3();
          } else {
            toast.error(e.err);
          }
        })
        .catch((err: any) => {
          toast.error(t('Something went wrong.'));
          setisWeb3Submitting(false);
          setShowWeb3Model(false);
          setTempweb3BannerPreviewImg('');
          setPreviewweb3BannerFile(null);
          setTempweb3PreviewImg('');
          setPreviewweb3File(null);
          setTempweb3ComapnyPreviewLogo('');
          setPreviewweb3companyLogoFile(null);
        });
    }
  };
  let getWeb3 = async (directoryId: String) => {
    logger(directoryId, 'directoryIddirectoryId');

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    if (directoryId) {
      let TempDirectory: null | any = null;
      let tempWeb3 = await entryActor.getWeb3_for_admin(
        directoryId,
        userCanisterId
      );

      if (tempWeb3.length != 0) {
        tempWeb3[0].catagoryId = tempWeb3[0].catagory;
        tempWeb3[0].companyBanner = await getImage(tempWeb3[0].companyBanner);
        tempWeb3[0].founderImage = await getImage(tempWeb3[0].founderImage);
        tempWeb3[0].companyLogo = await getImage(tempWeb3[0].companyLogo);

        TempDirectory = tempWeb3;
      }
      setTempweb3BannerPreviewImg(TempDirectory[0].companyBanner);
      setTempweb3ComapnyPreviewLogo(TempDirectory[0].companyLogo);
      setTempweb3PreviewImg(TempDirectory[0].founderImage);
      let bannerId = getIdFromUrl(TempDirectory[0].companyBanner);
      let founderId = getIdFromUrl(TempDirectory[0].founderImage);
      let logoId = getIdFromUrl(TempDirectory[0].companyLogo);
      logger({ bannerId, id: TempDirectory[0].companyBanner }, 'testides');
      setBannerLink(bannerId);
      setLogoLink(logoId);
      setFounderLink(founderId);
      setDirectory(TempDirectory[0]);
      setweb3Content(tempWeb3[0].companyDetail);
      setShowWeb3Model(true);
    }
    // const promted = await entryActor.getPromotedEntries();
    // logger(promted, 'PROMTED ENTRIES');
  };
  useEffect(() => {
    logger(directoryId, 'directoryId54432534');
    if (directoryId && directoryId != undefined) {
      getWeb3(directoryId);
    }
  }, [directoryId]);
  useEffect(() => {
    async function getData() {
      const _categories = await getCategories(identity);
      setCategories(_categories);
    }
    // if (auth.state == 'initialized' && identity) {
      getData();
    // }
  }, []);

  return (
    <>
      {cropperImg && (
        <ImageCropper
          show={showCropper}
          handleClose={handleHideCropper}
          cropperProps={cropperImg}
        />
      )}
      <Modal
        show={showWeb3Model}
        size='xl'
        className='resiter-company-modal'
        onHide={web3ModelClose}
        backdrop='static'
      >
        <Modal.Header closeButton={!isWeb3Submitting}>
          <Modal.Title>
            <b>{t('register your company')}</b>
            <div className='spacer-20' />
          </Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={initialWeb3Values}
          innerRef={web3FormikRef}
          enableReinitialize
          validationSchema={web3Schema}
          onSubmit={async (values, actions) => {
            // uploadEntry(values);
            // hello.greet(values.title).then((res) => {
            //   logger('GET GREETED KID::::::', res);
            // });

            await addWeb3(values);
          }}
        >
          {({ errors, touched, handleChange, handleBlur }) => (
            <FormikForm
              className='flex flex-col items-center justify-center px-3'
              // onChange={(e) => handleImageChange(e)}
            >
              <Row>
                <Col xl='6' lg='6' md='6' className='mb-3 '>
                  <Field name='company'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Label>{t('Company Name')}</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder={t('Enter Company Name here')}
                          autoComplete='off'
                          value={field.value}
                          onInput={handleBlur}
                          onChange={handleChange}
                          name='company'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='company'
                      component='div'
                    />
                  </div>
                </Col>
                <Col xl='6' lg='6' md='6' className='mb-3 '>
                  <Field name='shortDescription'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Label>
                          {t('Company short description')}
                        </Form.Label>
                        <Form.Control
                          type='text'
                          placeholder={t('Enter Company  description here...')}
                          autoComplete='off'
                          value={field.value}
                          onInput={handleBlur}
                          onChange={handleChange}
                          name='shortDescription'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='shortDescription'
                      component='div'
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl='12' lg='12' md='12' className='mb-3'>
                  {/* <Field name='companyDetail'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.companyDetail'
                      >
                        <Form.Label>{t('Company Detail')}</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={6}
                          placeholder={t('Enter Company Detail here...')}
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleBlur}
                          name='companyDetail'
                          style={{ minHeight: '110px', maxHeight: '2000px' }}
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='companyDetail'
                      component='div'
                    />
                  </div> */}
                  <div className='full-div my-3'>
                    <Form.Label>{t('Company Detail')}</Form.Label>
                    <Texteditor
                      initialValue={web3Content}
                      value={web3Content}
                      onChangefn={setweb3Content}
                      errorState={setDiscriptionErr}
                      placeholder={
                        directoryId
                          ? 'Enter Company Detail here...'
                          : t('Enter Company Detail here...')
                      }
                    />
                    {discriptionErr && (
                      <div className='text-danger mb-2'>
                        {t('Company Detail is required')}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl='12' lg='12' md='12' className='mb-3'>
                  <Field name='founderName'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput2'
                      >
                        <Form.Label>{t('Founder Name')}</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder={t('Enter Founder Name here')}
                          autoComplete='off'
                          value={field.value}
                          onInput={handleBlur}
                          onChange={handleChange}
                          name='founderName'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='founderName'
                      component='div'
                    />
                  </div>
                </Col>
                <Col xl='12' lg='12' md='12' className='mb-3'>
                  <Field name='founderDetail'>
                    {({ field, formProps }: any) => (
                      <Form.Group className='mb-2'>
                        <Form.Label>{t('Founder Details')}</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={2}
                          placeholder={t('Enter Founder Details here...')}
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleBlur}
                          name='founderDetail'
                          style={{ minHeight: '50px', maxHeight: '900px' }}
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='founderDetail'
                      component='div'
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl='6' lg='6' md='6' className='mb-3'>
                  <Field name='companyUrl'>
                    {({ field, formProps }: any) => (
                      <Form.Group className='mb-2'>
                        <Form.Label>{t('Company Url')}</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder={t('Enter Company URL  Here...')}
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleBlur}
                          name='companyUrl'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mt-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='companyUrl'
                      component='div'
                    />
                  </div>
                </Col>
                <Col xl='6' lg='6' md='6' className='mb-3'>
                  <Field name='facebook'>
                    {({ field, formProps }: any) => (
                      <Form.Group className='mb-2'>
                        <Form.Label>{t('Facebook Link')}</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder={t('Enter Facebook Link here...')}
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleBlur}
                          name='facebook'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mt-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='facebook'
                      component='div'
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl='6' lg='6' md='6' className='mb-3'>
                  <Field name='instagram'>
                    {({ field, formProps }: any) => (
                      <Form.Group className='mb-2'>
                        <Form.Label>{t('Youtube Link')}</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder={t('Enter Youtube Link Here...')}
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleBlur}
                          name='instagram'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mt-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='instagram'
                      component='div'
                    />
                  </div>
                </Col>
                <Col xl='6' lg='6' md='6' className='mb-3'>
                  <Field name='linkedin'>
                    {({ field, formProps }: any) => (
                      <Form.Group className='mb-2'>
                        <Form.Label>{t('LinkedIn Link')}</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder={t('Enter LInkIdein Link here...')}
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleBlur}
                          name='linkedin'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mt-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='linkedin'
                      component='div'
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl='6' lg='6' md='6' className='mb-3'>
                <Field name='discord'>
  {({ field }: any) => (
    <Form.Group className='mb-2'>
        <Form.Label>
        {t('Feature directory')}
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='mb-0'>
                                            {t("Feature your company with ease using our AI Chatbot Avatar.")} 
                                            </p>
                                            <p className='mb-0'>
                                            {t("Boost your brand visibility effortlessly! Join us for just $40 per month and let our AI handle your corporate information!")} 
                                            </p>
                                          </div>
                                        }
                                      >
                                        <span className='ps-1'>
                                          <i className='fa fa-circle-info' />
                                        </span>
                                      </Tippy>
                                    </Form.Label>
    
<div className='d-flex'>

              <label className='d-flex align-items-center'>
                <Field type="radio" name="discord" value="yes" className="me-2"/>
                {t('Yes')}
              </label>
          
              <label className='d-flex align-items-center ms-3'>
                <Field type="radio" name="discord" value="no" className="me-2"/>
                {t('No')}
              </label>
           
            <ErrorMessage name="discord" component="div" />
            

</div>
     

    </Form.Group>
  )}
</Field>

<div className='text-danger mt-2'>
  <ErrorMessage
    className='Mui-err'
    name='discord'
    component='div'
  />
</div>

                  
                </Col>
                <Col xl='6' lg='6' md='6' className='mb-3'>
                  <Field name='telegram'>
                    {({ field, formProps }: any) => (
                      <Form.Group className='mb-2'>
                        <Form.Label>{t('Telegram Link')}</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder={t('Enter Telegram Link here...')}
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleBlur}
                          name='telegram'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mt-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='telegram'
                      component='div'
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl='6' lg='6' md='6' className='mb-3'>
                  <Field name='twitter'>
                    {({ field, formProps }: any) => (
                      <Form.Group className='mb-2'>
                        <Form.Label>{t('Twitter Link')}</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder={t('Enter Twitter Link Here...')}
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleBlur}
                          name='twitter'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mt-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='twitter'
                      component='div'
                    />
                  </div>
                </Col>
                <Col xl='6' lg='6' md='6' className='mb-3'>
                  <Field name='founderEmail'>
                    {({ field, formProps }: any) => (
                      <Form.Group className='mb-2'>
                        <Form.Label>{t('Founder Email')}</Form.Label>
                        <Form.Control
                          type='text'
                          placeholder={t('Enter Founder Email Address Here...')}
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleBlur}
                          name='founderEmail'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mt-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='founderEmail'
                      component='div'
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xl='12' lg='12' md='12' className='mb-3'>
                  <Field name='catagory'>
                    {({ field, form }: any) => (
                      <Form.Group className='mb-2'>
                        <Form.Label>{t('Category')}</Form.Label>
                        <Form.Select
                          value={field.value}
                          onChange={handleChange}
                          onInput={handleChange}
                          name='catagory'
                        >
                          <option value={''}>
                            {t('Please Select Category')}
                          </option>
                          {categories &&
                            categories.map((category: any, index) => (
                              <option value={category[0]} key={index}>
                                {category[1].name}
                              </option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                    )}
                  </Field>

                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='catagory' // Adjust the name to 'category'
                      component='div'
                    />
                  </div>
                </Col>
                <Col xl='6' lg='6' md='6' className='mb-4'>
                  <div className='d-flex flex-column align-items-center photo-editor-pnl'>
                    {tempweb3ComapnyPreviewLogo && (
                      <div
                        style={{
                          // height: '252px',
                          width: '250px',
                          // overflow: 'hidden',
                        }}
                      >
                        <Image
                          // fill={true}
                          // style={{ maxHeight: '200px', maxWidth: '200px' }}
                          width={250}
                          height={250}
                          // fill={true}
                          src={tempweb3ComapnyPreviewLogo}
                          alt='Banner'
                        />
                      </div>
                    )}
                    <Form.Group  className='mb-4'>
                      {/* <Form.Label>Select Company Banner Image</Form.Label> */}
                      <div className='input-group d-flex justify-content-center'>
                        <Form.Control
                          id='previewweb3companylogo'
                          className='d-none'
                          // onChange={handleCompanyLogoChange}
                          onChange={(e) => handleImageChageCommon(e, 'logo')}
                          name='founder image'
                          type='file'
                        />
                        <Button
                          type='button'
                          className='reg-btn blue-btn  mt-2 rounded'
                        >
                          <i className='fa fa-upload me-1' />{' '}
                          <label
                            className='text-white'
                            htmlFor='previewweb3companylogo'
                          >
                            {t('Select Company Logo')}
                          </label>
                        </Button>
                      </div>
                    </Form.Group>
                  </div>
                  {logoError && (
                    <div className='text-danger mb-2'>
                      {t('Company logo is required')}
                    </div>
                  )}
                </Col>
                <Col xl='6' lg='6' md='6' className='mb-4'>
                  <div className='d-flex  flex-column align-items-center photo-editor-pnl'>
                    {tempweb3PreviewImg && (
                      <div
                        style={{
                          // height: '252px',
                          width: '250px',
                          // overflow: 'hidden',
                        }}
                      >
                        <Image
                          // fill={true}
                          // style={{ maxHeight: '200px', maxWidth: '200px' }}
                          width={250}
                          height={250}
                          // fill={true}
                          src={tempweb3PreviewImg}
                          alt='Banner'
                        />
                      </div>
                    )}
                    <Form.Group className='mb-3'>
                      {/* <Form.Label>Select Company Banner Image</Form.Label> */}
                      <div className='input-group d-flex justify-content-center'>
                        <Form.Control
                          id='previewweb3Img'
                          className='d-none'
                          // onChange={handleFounderImageChange}
                          onChange={(e) => handleImageChageCommon(e, 'founder')}
                          name='founder image'
                          type='file'
                        />
                        <Button
                          type='button'
                          className='reg-btn blue-btn  mt-2 rounded'
                        >
                          <i className='fa fa-upload me-2' />
                          <label
                            className='text-white'
                            htmlFor='previewweb3Img'
                          >
                            {t('Select Founder Image')}
                          </label>
                        </Button>
                      </div>
                    </Form.Group>
                  </div>
                  {founderError && (
                    <div className='text-danger mb-2'>
                      {t('Founder Image is required')}
                    </div>
                  )}
                </Col>
              </Row>
              <Row>
                <Col xl='12' lg='12' md='12' className='mb-4'>
                  <div className='d-flex flex-column align-items-center photo-editor-pnl'>
                    {tempweb3BannerPreviewImg && (
                      <div
                        style={{
                          // height: '252px',
                          width: '250px',
                          // overflow: 'hidden',
                        }}
                      >
                        <Image
                          // fill={true}
                          // style={{ maxHeight: '200px', maxWidth: '200px' }}
                          width={250}
                          height={250}
                          // fill={true}
                          src={tempweb3BannerPreviewImg}
                          alt='Banner'
                        />
                      </div>
                    )}
                    <Form.Group  className='mb-3'>
                      {/* <Form.Label>Select Company Banner Image</Form.Label> */}
                      <div className='input-group d-flex justify-content-center'>
                        <Form.Control
                          id='previewweb3companyBannerImg2'
                          className='d-none'
                          // onChange={handleCompanyBannerChange}
                          onChange={(e) => handleImageChageCommon(e, 'banner')}
                          name='founder image'
                          type='file'
                        />
                        <Button
                          type='button'
                          className='reg-btn blue-btn mt-2 rounded'
                        >
                          <i className='fa fa-upload me-1' />{' '}
                          <label
                            className='text-white'
                            htmlFor='previewweb3companyBannerImg2'
                          >
                            {t('Select Company Banner Image')}
                          </label>
                        </Button>
                      </div>
                    </Form.Group>
                  </div>
                  {bannerError && (
                    <div className='text-danger mb-2'>
                      {t('Company Banner Image is required')}
                    </div>
                  )}
                </Col>

                <Col xl='12' lg='12' md='12' className='mb-4'>
                  <Button
                    className='w-100 reg-btn blue-btn'
                    disabled={isWeb3Submitting}
                    onClick={(e) => submitWeb3form(e)}
                  >
                    {isWeb3Submitting ? (
                      <Spinner animation='border' size='sm' />
                    ) : directoryId ? (
                      t('Edit Company')
                    ) : (
                      t('Add Company')
                    )}
                  </Button>
                </Col>
              </Row>

              <ScrollToError />
            </FormikForm>
          )}
        </Formik>
      </Modal>
    </>
  );
}
