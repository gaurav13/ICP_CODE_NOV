'use client';
import React, { useEffect, useRef, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Head from 'next/head';
import { Row, Col, Form, Button, Spinner, Modal } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikProps,
  FormikValues,
  FormikHelpers,
  useFormikContext,
} from 'formik';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { User } from '@/types/profile';
import { date, object, string, number } from 'yup';
import { getImage, getImageById } from '@/components/utils/getImage';
import defaultBanner from '@/assets/Img/default-banner.jpg';
import girl from '@/assets/Img/user-img.png';
import authMethods from '@/lib/auth';
import {
  MAX_AUTHOR_INFO_CHARACTERS,
  MAX_AUTHOR_META_DESC_CHARACTERS,
  MAX_AUTHOR_TITLE_CHARACTERS,
  MAX_DESIGNATION_CHARACTERS,
  MAX_IMAGE_SIZE,
  MAX_NAME_CHARACTERS,
  MIN_NAME_CHARACTERS,
} from '@/constant/validations';
import { toast } from 'react-toastify';
import { fileToCanisterBinaryStoreFormat } from '@/dfx/utils/image';
import logger from '@/lib/logger';
import Resizer from 'react-image-file-resizer';
import resizeImage from '@/components/utils/resizeImage';
import ImageCropper from '@/components/Cropper';
import { CropperProps } from '@/types/cropper';
import getCroppedImg from '@/components/Cropper/cropImage';
import { BASE_IMG_URL, isValidFileType } from '@/constant/image';
import {
  MAX_BANNER_SIZES,
  MAX_PROFILE_SIZES,
  bannerAspect,
  profileAspect,
} from '@/constant/sizes';
import instance from '@/components/axios';
import uploadImage from '@/components/utils/uploadImage';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { ConnectPlugWalletSlice } from '@/types/store';
import { Principal } from '@dfinity/principal';
import { getIdFromLink, getIdFromUrl } from '@/constant/DateFormates';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import { setOptions } from 'react-chartjs-2/dist/utils';
import axios from 'axios';
import {
  EMAIL_VALIDATE,
  ONLY_ALPHABET,
  ONLY_ALPHANUMERIC,
} from '@/constant/regulerExpression';

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

export default function ProfileDetails() {
 
  const [showModal, setShowModal] = useState(false);
  const [buttonText, setButtonText] = useState('Verify Email');
  const [verify, setVerify] = React.useState(false);
  const [otpEmail, setOtpEmail] = React.useState<string | undefined>();
  const [isVerifying, setIsVerifying] = React.useState(false);

  const [isSendingOtp, setIsSendingOtp] = React.useState(false);

  const storedIsTimerActive =
    typeof window !== 'undefined' &&
    localStorage.getItem('isTimerActive') === 'true';

  const storedRemainingTime =
    (typeof window !== 'undefined' &&
      parseInt(localStorage.getItem('remainingTime') as string, 10)) ||
    30;

  const [isTimerActive, setIsTimerActive] = React.useState(storedIsTimerActive);
  const [remainingTime, setRemainingTime] = React.useState(storedRemainingTime);
  const { t } = useLocalization(LANG);
  const [user, setUser] = useState<User | null>();
  // Both these are for profile Image
  const [tempImg, setTempImg] = useState({ imgUrl: '' });
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const userId = searchParams.get('userId');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  // These are for Banner Image
  const [tempBannerImg, setTempBannerImg] = useState({ imgUrl: '' });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerImg, setBannerImg] = useState<string | null>();
  const [profileImg, setProfileImg] = useState<string | null>();
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGender, setCurrentGender] = useState('Male');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [cropperImg, setCropperImg] = useState<CropperProps | undefined>();
  const [showCropper, setShowCropper] = useState(false);
  const [bannerImgId, setBannerImgId] = useState<string | undefined>();
  const [profileImgId, setProfileImgId] = useState<string | undefined>();
  const [emailButtonDisabled, setEmailButtonDisabled] = useState(false);
  const [emailFieldDisabled, setEmailFieldDisabled] = useState(false);
  const [emailval, setemail] = useState('');
  const router = useRouter();
  const formRef = useRef<FormikProps<FormikValues>>(null);

  const btnText = async () => {
    // try {
    //   if(emailval==''){
    //     setButtonText("Verify Email")
    //   }else{
    //     var formValuesemail = formRef.current.values.email;
    //     if(formValuesemail==emailval){
    //       setButtonText("Change Email")
    //     }else{
    //       setButtonText("Verify Email")
    //     }
    //   }
    //   var formValuesemail;
    //   if (formRef?.current) {
    //     formValuesemail = formRef.current.values.email;
    //     if (formValuesemail === initialUser.email) {
    //       setButtonText("Change Email")
    //     }
    //     }else{ setButtonText("Verify Email")}}
    // catch(error:any){
    //   toast.error("An error occurred.");
    //   // toast.error(t(error.response.data.errorMessage));
    // }
  };
  useEffect(() => {
    logger(emailval, 'emailvalemailval');
    if (emailval == '') {
      setButtonText('Verify Email');
    } else {
      if (formRef?.current) {
        var formValuesemail = formRef?.current.values.email;
        logger({ formValuesemail, emailval }, 'gffgfdgfd');

        if (formValuesemail == emailval) {
          setButtonText('Change Email');
        } else {
          setButtonText('Verify Email');
        }
      }
    }
  }, [emailval, formRef?.current?.values?.email]);
  const handleShow = async (values: FormikValues) => {
    try {
      var formValuesemail;
      if (formRef?.current) {
        formValuesemail = formRef?.current.values.email;

        if (formValuesemail === emailval) {
          toast.error('Email already verified');
        } else {
          let tempPath = window.location.origin;
          const response = await instance.post('auth/sendOtp', {
            email: formValuesemail,
            baseUrl: tempPath,
            lng: LANG,
          });

          setOtpEmail(formValuesemail);
          logger(otpEmail, 'sdsdasdasd');
          setVerify(true);
          toast.success(t('OTP sent to email'));
          setShowModal(true);
        }
      }
    } catch (error: any) {
      toast.error(t(error.response.data.errorMessage));
      logger(error, 'sdjksajdsadasd');
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const verifyOtp = async (
    values: FormikValues,
    actions: FormikHelpers<typeof otpValues>
  ) => {
    setIsVerifying(true);
    try {
      let tempotp = values.otp.toString();
      let formValuesemail;
      if (formRef?.current) {
        formValuesemail = formRef.current.values.email;
        logger(formValuesemail, 'Current form values:');
      }

      const response = await instance.post('auth/verify_user_profile_otp', {
        email: formValuesemail,
        otp: tempotp,
      });

      toast.success(t('OTP verification successful'));
      var stats = response.status;
      if (stats === 200) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('status', 'stats');
        }
      }
      setVerify(false);
      actions.resetForm();
      const token = response.data.data;
    
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      

      }
      setEmailConnected(true);
      handleClose();
      logger(response, 'otp verification rep');
      setEmailButtonDisabled(true);
      setEmailFieldDisabled(true);
    } catch (error) {
      toast.error(t('Invalid OTP'));
      logger(error);
    }
    setIsVerifying(false);
  };

  const {
    auth,
    setAuth,
    setIdentity,
    userAuth,
    emailConnected,
    setEmailConnected,
  } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    setAuth: state.setAuth,
    setIdentity: state.setIdentity,
    userAuth: state.userAuth,
    setEmailConnected: (state as ConnectPlugWalletSlice).setEmailConnected,
    emailConnected: (state as ConnectPlugWalletSlice).emailConnected,
  }));

  const methods = authMethods({
    useConnectPlugWalletStore,
    handleClose,
    setIsLoading,
  });

  const initialUser = {
    name: user?.name[0] ?? '',
    designation: user?.designation[0] ?? '',
    email: user?.email[0] ?? '',
    website: user?.website[0] ?? '',
    dob: user?.dob[0] ?? '',
    // gender: user?.gender[0] ? user?.gender[0] : '',
    facebook: user?.facebook[0] ?? '',
    twitter: user?.twitter[0] ?? '',
    instagram: user?.instagram[0] ?? '',
    linkedin: user?.linkedin[0] ?? '',
    authorInfo: user?.authorInfo[0] ?? '',
    authorTitle: user?.authorTitle[0] ?? '',
    authorDescription: user?.authorDescription[0] ?? '',

    // bio: user?.bio[0] ? user?.bio[0] : '',
    // externalLink: user?.externalLink[0] ? user?.externalLink[0] : '',
  };

  const userSchema = object().shape({
    // name: string()
    //   .required('Name is required')
    //   .max(MAX_NAME_CHARACTERS, 'Name can not be more than 40 characters'),
    name:
      LANG == 'en'
        ? string()
            .required(t('Name is required'))
            .matches(ONLY_ALPHABET, t('Only alphabets are allowed'))
            .max(
              MAX_NAME_CHARACTERS,
              t('Name can not be more than 40 characters')
            )
            .min(
              MIN_NAME_CHARACTERS,
              t('Name can not be less than 3 characters')
            )
        : string()
            .required(t('Name is required'))
            .max(
              MAX_NAME_CHARACTERS,
              t('Name can not be more than 40 characters')
            )
            .min(
              MIN_NAME_CHARACTERS,
              t('Name can not be less than 3 characters')
            ),
    designation:
      LANG == 'en'
        ? string()
            .matches(
              ONLY_ALPHANUMERIC,
              t('Only AlphaNumeric characters are allowed')
            )
            .max(
              MAX_DESIGNATION_CHARACTERS,
              t('Designation can not be more than 100 characters')
            )
            .min(
              MIN_NAME_CHARACTERS,
              t('Designation can not be less than 3 characters')
            )
        : string()
            .max(
              MAX_DESIGNATION_CHARACTERS,
              t('Designation can not be more than 100 characters')
            )
            .min(
              MIN_NAME_CHARACTERS,
              t('Designation can not be less than 3 characters')
            ),
    // email: string().email('Invalid Email').required('Email is required'),
    email: string()
      .required(t('Email is required'))
      .trim()
      .matches(EMAIL_VALIDATE, t('Invalid Email')),
    website: string().url(t('Website Link must be a valid URL')),
    dob: date().max(new Date(), t('Date is not valid')),
    // gender: string().required('Gender is required'),
    facebook: string().url(t('Facebook Link must be a valid URL')),
    twitter: string().url(t('Twitter Link must be a valid URL')),
    instagram: string().matches(/^[a-zA-Z][a-zA-Z0-9_]{4,31}$/, t('Invalid Telegram ID')),
    linkedin: string().url(t('Linkedin Link must be a valid URL')),
    authorInfo: string().max(
      MAX_AUTHOR_INFO_CHARACTERS,
      `${t(
        'Author Info can not be more than'
      )} ${MAX_AUTHOR_INFO_CHARACTERS} ${t('characters')}`
    ),
    authorTitle: string().max(
      MAX_AUTHOR_TITLE_CHARACTERS,
      `${t(
        'Author Title can not be more than '
      )} ${MAX_AUTHOR_TITLE_CHARACTERS} ${t('characters')}`
    ),
    authorDescription: string().max(
      MAX_AUTHOR_META_DESC_CHARACTERS,
      `${t(
        'Author Description can not be more than'
      )}  ${MAX_AUTHOR_META_DESC_CHARACTERS} ${t('characters')}`
    ),
  });
  const handleShowCropper = () => {
    setShowCropper(true);
  };
  const handleHideCropper = () => {
    setShowCropper(false);
  };
  const profileUpload = async (
    imgUrl: string,
    imgName: string,
    pixels: any,
    rotation: number = 0
  ) => {
    const croppedImage = await getCroppedImg(imgUrl, imgName, pixels, rotation);
    if (!croppedImage) return;
    const resizedProfile = await resizeImage(
      croppedImage,
      MAX_PROFILE_SIZES.width,
      MAX_PROFILE_SIZES.height
    );

    const newUrl = URL.createObjectURL(resizedProfile);
    setTempImg({
      imgUrl: newUrl,
    });
    const imgId = await uploadImage(resizedProfile);

    setProfileImgId(imgId);
    setProfileFile(resizedProfile);
    handleHideCropper();
  };
  const bannerUpload = async (
    imgUrl: string,
    imgName: string,
    pixels: any,
    rotation: number = 0
  ) => {
    const croppedImage = await getCroppedImg(imgUrl, imgName, pixels, rotation);
    if (!croppedImage) return;
    const resizedBanner = await resizeImage(
      croppedImage,
      MAX_BANNER_SIZES.width,
      MAX_BANNER_SIZES.height
    );
    const newUrl = URL.createObjectURL(resizedBanner);

    // return response.data;
    setTempBannerImg({
      imgUrl: newUrl,
    });
    const imgId = await uploadImage(resizedBanner);
    setBannerImgId(imgId);
    setBannerFile(resizedBanner);
    handleHideCropper();
  };
  const handleImageChange = async (e: any) => {
    const img = e.target.files[0];

    const imgUrl = URL.createObjectURL(img);
    const validType = isValidFileType(img && img.name.toLowerCase(), 'image');
    if (!validType) {
      toast.error(t('Not a valid image type'));
      return;
    }
    if (e.target.name === 'profileImg') {
      setCropperImg({
        imgUrl,
        imgName: img.name,
        aspect: profileAspect,
        callBack: profileUpload,
        maxWidth: MAX_PROFILE_SIZES.width,
        maxHeight: MAX_PROFILE_SIZES.height,
      });
      handleShowCropper();
    } else if (e.target.name === 'bannerImg') {
      setCropperImg({
        imgUrl,
        imgName: img.name,
        aspect: bannerAspect,
        callBack: bannerUpload,
        maxWidth: MAX_BANNER_SIZES.width,
        maxHeight: MAX_BANNER_SIZES.height,
      });
      handleShowCropper();
    }
    e.target.value = '';
  };
  const updateImg = async (img: any, name: string) => {
    if (img) {
      const tempImg = img;
      if (name === 'profile') {
        setProfileImg(tempImg);
      } else {
        setBannerImg(tempImg);
      }
    } else {
      if (name === 'profile') {
        setProfileFile(null);
        setProfileImg(null);
      } else {
        setBannerFile(null);
        setBannerImg(null);
      }
    }
  };
  // function compairEmailfn(email?: any) {
  //   if (formRef?.current) {

  //     if (email == formRef?.current.values.email) {

  //       setEmailButtonDisabled(true)

  //     } else {

  //       setEmailButtonDisabled(false)

  //     }
  //   }

  // }
  const getUser = async (res?: any) => {
    let tempUser = null;
    let tempurl = window.location.search;
    const searchParams = await new URLSearchParams(tempurl);
    const tempuserId = searchParams.get('userId');

    let inputId = tempuserId ? [tempuserId] : [];

    if (res) {
      tempUser = await res.get_user_details(inputId);
    } else {
      tempUser = await auth.actor.get_user_details(inputId);
    }

    if (tempUser?.ok) {
      setemail(tempUser?.ok[1]?.email[0]);

      if (!tempuserId) {
        setUser(tempUser.ok[1]);
        // compairEmailfn(tempUser.ok[1]?.email)
        setCurrentGender(tempUser.ok[1].gender[0] ?? 'Male');
        updateImg(tempUser.ok[1].profileImg[0], 'profile');
        updateImg(tempUser.ok[1].bannerImg[0], 'banner');
        setIsOwner(tempUser.ok[2]);
        let profile_ImgId = getIdFromUrl(tempUser.ok[1].profileImg[0]);
        setProfileImgId(profile_ImgId);
      } else {
        if (userAuth.userPerms?.adminManagement) {
          setUser(tempUser.ok[1]);
          setCurrentGender(tempUser.ok[1].gender[0] ?? 'Male');
          updateImg(tempUser.ok[1].profileImg[0], 'profile');
          updateImg(tempUser.ok[1].bannerImg[0], 'banner');
          setIsOwner(tempUser.ok[2]);
          let profile_ImgId = getIdFromUrl(tempUser.ok[1].profileImg[0]);
          setProfileImgId(profile_ImgId);
        } else {
          logger(
            { tempuserId, user: userAuth.userPerms?.adminManagement },
            'profileDetailuser'
          );
          if (userAuth.userPerms?.adminManagement == false) {
            router.replace('/');
          }
        }
      }
    }
  };
  const otpValues = {
    otp: '',
  };

  const otpSchema = object().shape({
    otp: number()
      .required(t('OTP is required'))
      .test(
        'non-negative',
        'OTP must be a non-negative number',
        (value: any) => {
          // Check if the value is a non-negative number
          return parseInt(value) >= 0;
        }
      ),
  });
  const resendOtp = async () => {
    setIsSendingOtp(true);
    try {
      let tempPath = window.location.origin;
      let formValuesemail;
      if (formRef?.current) {
        formValuesemail = formRef.current.values.email;
        logger(formValuesemail, 'Current form values:');
      }
      const response = await instance.post('auth/resend_profile_email_opt', {
        email: formValuesemail,
        baseUrl: tempPath,
        lng: LANG,
      });

      setIsTimerActive(true);
      setRemainingTime(30);
      if (typeof window !== 'undefined') {
        localStorage.setItem('isTimerActive', 'true');
        localStorage.setItem('remainingTime', '30');
      }
    } catch (error) {
      toast.error(t('Error while authenticating'));
      logger(error);
    }
    setIsSendingOtp(false);
  };
  useEffect(() => {
    if (auth.state === 'initialized') {
      getUser();
    } else {
      methods.initAuth().then(async (res) => {
        getUser(res.actor);
        if (!res.success) {
          // toast.error('Your session has expired please log in again', {
          //   autoClose: 1900,
          // });
          // setTimeout(() => {
          //   router.push('/');
          // }, 3000);
        } else {
        }
      });
      logger('User not authenticated');
    }
  }, []);
  useEffect(() => {
    if (auth.state === 'anonymous') {
      setIsOwner(false);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
    }
  }, [auth]);
  useEffect(() => {
    const getIdentity = async () => {
      if (auth.client) {
        const con = await auth.client.isAuthenticated();
        if (con) {
          const identity = await auth.client.getIdentity();
          setIsAuthenticated(true);
          setIdentity(identity);
        } else {
          router.replace('/');
          setIsAuthenticated(false);
        }
      }
    };
    getIdentity();
  }, [auth.client]);
  React.useEffect(() => {
    let timer: any;
    if (isTimerActive) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            setIsTimerActive(false);
            // setIsLoading(false);
            if (typeof window !== 'undefined') {
              localStorage.setItem('isTimerActive', 'false');
            }
            return 0;
          }
          if (typeof window !== 'undefined') {
            localStorage.setItem('remainingTime', (prevTime - 1).toString());
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isTimerActive');
        localStorage.removeItem('remainingTime');
      }
    };
  }, [isTimerActive]);



  return (
    <main id='main'>
      {isAuthenticated && (
        <>
          {cropperImg && (
            <ImageCropper
              show={showCropper}
              handleClose={handleHideCropper}
              cropperProps={cropperImg}
            />
          )}
          <>
            <Modal show={showModal} centered onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>OTP Verification</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={otpValues}
                  validationSchema={otpSchema}
                  onSubmit={async (values, actions) => {
                    await verifyOtp(values, actions);
                  }}
                >
                  {({
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    isValid,
                    dirty,
                  }) => (
                    <FormikForm className='flex w-full flex-col items-center justify-center'>
                      <p>
                        {t('OTP has been sent to')} {otpEmail ?? ''}{' '}
                        {t('Please verify.')}
                      </p>
                      
                      <Field name='otp'>
                        {({ field, formProps }: any) => (
                          <Form.Group
                            className='mb-2'
                            controlId='exampleForm.ControlInput1'
                          >
                            {/* <Form.Label>OTP</Form.Label> */}
                            <Form.Control
                              type='number'
                              placeholder={t('Enter OTP')}
                              value={field.value}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              onInput={handleChange}
                              name='otp'
                            />
                          </Form.Group>
                        )}
                      </Field>
                      <div className='text-danger mb-2'>
                        <ErrorMessage
                          className='Mui-err'
                          name='otp'
                          component='div'
                        />
                      </div>
                      <div className='d-flex justify-content-end gap-4'>
                        <Button
                          onClick={resendOtp}
                          disabled={isTimerActive || isSendingOtp}
                          className='default-btn'
                        >
                          {isTimerActive ? (
                            `Resend code in  ${remainingTime}`
                          ) : isSendingOtp ? (
                            <Spinner size='sm' />
                          ) : (
                            t('Resend code')
                          )}
                        </Button>
                        <Button
                          className='publish-btn'
                          disabled={isVerifying}
                          type='submit'
                        >
                          {isVerifying ? <Spinner size='sm' /> : t('Verify')}
                        </Button>
                      </div>
                    </FormikForm>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>

            <div className='main-inner home'>
              <div className='section' id='top'>
            
                <Row>
                  {/* <Col xl='12' lg='12' md='12'>
                    <div className='flex-div'>
                      <h2>Edit profile</h2>
                      <Button
                        className='reg-btn blue empty'
                        onClick={() => formRef.current?.handleSubmit()}
                        disabled={isFormSubmitting}
                      >
                        {isFormSubmitting ? (
                          <Spinner
                            animation='border'
                            // variant='secondary'
                            // size='sm'
                            style={{
                              width: '1.2rem',
                              height: '1.2rem',
                              borderWidth: '0.2rem',
                            }}
                          />
                        ) : (
                          'Save'
                        )}
                      </Button>
                    </div>
                    <div className='spacer-20'/>
                  </Col> */}
                  <Col xl='12' lg='12' md='12'>
                    <div className='pbg-pnl text-left'>
                      <Form>
                        <Form.Group>
                          <Row>
                            <Col className='mb-4' xl='12'>
                              <Form.Label>{t('Change Cover Photo')}</Form.Label>
                              <input
                                id='bannerImgId'
                                className='d-none'
                                onChange={handleImageChange}
                                name='bannerImg'
                                type='file'
                              />
                              <div className='full-div'>
                                <div className='edit-banner-cntnr'>
                                  {/* <Image src={pic} alt='Pic' /> */}
                                  <div
                                    className='img-catch'
                                    // style={{
                                    //   aspectRatio: bannerAspect,
                                    // }}
                                  >
                                    {bannerFile ? (
                                      <Image
                                        fill={true}
                                        src={tempBannerImg.imgUrl}
                                        alt='Banner'
                                      />
                                    ) : (
                                      <Image
                                        src={
                                          bannerImg ? bannerImg : defaultBanner
                                        }
                                        alt='Banner'
                                        fill={true}
                                      />
                                    )}
                                  </div>
                                  <Form.Label htmlFor='bannerImgId'>
                                    <i className='fa fa-edit' />{' '}
                                    {t('edit picture')}
                                  </Form.Label>
                                </div>
                              </div>
                            </Col>
                            <Col className='mb-4' xl='12'>
                              <Form.Label>
                                {t('Change Profile Picture')}
                              </Form.Label>
                              <input
                                id='profileImg'
                                className='d-none'
                                // value={profileFile}
                                // onChange={(e) => handleImageChange(e)}
                                //  value={}
                                onChange={handleImageChange}
                                name='profileImg'
                                type='file'
                              />

                              <div className='full-div'>
                                <div className='edit-picture-cntnr'>
                                  {/* <Image src={pic} alt='Pic' /> */}
                                  <div
                                    style={{
                                      width: 200,
                                      aspectRatio: profileAspect,
                                      position: 'relative',
                                    }}
                                  >
                                    {profileFile ? (
                                      <Image
                                        fill={true}
                                        src={tempImg.imgUrl}
                                        alt='Profile'
                                      />
                                    ) : (
                                      <Image
                                        src={profileImg ? profileImg : girl}
                                        fill={true}
                                        alt='Profile'
                                      />
                                    )}
                                  </div>

                                  <Form.Label htmlFor='profileImg'>
                                    <i className='fa fa-edit' />{' '}
                                    {t('edit picture')}
                                  </Form.Label>
                                </div>
                                <div />
                              </div>
                            </Col>
                          </Row>
                        </Form.Group>
                      </Form>
                    </div>
                    <Formik
                      initialValues={initialUser}
                      enableReinitialize={true}
                      validationSchema={userSchema}
                      innerRef={formRef}
                      onSubmit={async (values, { resetForm }) => {
                        try {
                          if (localStorage.getItem('status') === 'stats') {
                            setIsFormSubmitting(true);
                            setTimeout(() => {
                              localStorage.setItem('status', 'false');
                            }, 2000);
                          } else {
                            if (user?.email[0] !== values.email) {
                              window.scrollTo(200, 300);
                              return toast.error(t('please verify your email'));
                            }
                          }
                        } catch (error) {}

                        if (auth.state !== 'initialized') return;
                        let fileArray = null;
                        let bannerArray = null;
                        if (profileFile !== null) {
                          // fileArray = await fileToCanisterBinaryStoreFormat(
                          //   profileFile
                          // );
                          fileArray = BASE_IMG_URL + profileImgId;
                          logger({ profileImgId, fileArray }, 'tempuser21321');
                        }
                        if (bannerFile !== null) {
                          // bannerArray = await fileToCanisterBinaryStoreFormat(
                          //   bannerFile
                          // );
                          bannerArray = BASE_IMG_URL + bannerImgId;
                        }
                        logger(
                          { bannerArray, fileArray, profileImgId },
                          'sent emd'
                        );
                        let tempuser = {
                          name: values.name,
                          designation: values.designation,
                          email: values.email,
                          website: values.website,
                          dob: values.dob,
                          gender: currentGender,
                          facebook: values.facebook,
                          twitter: values.twitter,
                          instagram: values.instagram,
                          // linkdin: values.linkedin,
                          linkedin: values.linkedin,
                          authorInfo: values.authorInfo.trim(),
                          authorTitle: values.authorTitle.trim(),
                          authorDescription: values.authorDescription.trim(),
                          bannerImg: bannerArray ? [bannerArray] : [],
                          profileImg: fileArray ? [fileArray] : [],
                        };

                        let newUser = null;
                        if (userAuth.userPerms?.adminManagement && userId) {
                          logger('adminupdate', 'update');
                          let userPrincipal = Principal.fromText(userId);
                          newUser = await auth.actor.admin_update_user(
                            userPrincipal,
                            tempuser,
                            entryCanisterId
                          );
                        } else {
                          newUser = await auth.actor.update_user(
                            tempuser,
                            entryCanisterId
                          );
                          logger('userupdate', 'update');
                        }
                        logger(newUser);
                        if (newUser?.ok) {
                          setUser(newUser.ok[1]);
                          updateImg(newUser.ok[1].profileImg[0], 'profile');
                          updateImg(newUser.ok[1].bannerImg[0], 'banner');
                          // handleClose();
                          resetForm();
                          toast.success(t('Profile Updated Successfully'));
                          // setSubmitting(false);
                          setIsFormSubmitting(false);

                          window.scrollTo(0, 0);
                          if (userAuth.userPerms?.adminManagement && userId) {
                          } else {
                            router.push('/profile');
                          }
                        } else {
                          window.scrollTo(0, 0);
                          setIsFormSubmitting(false);
                          toast.error(newUser.err);
                        }
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        validateForm,
                        /* and other goodies */
                      }) => (
                        <FormikForm onSubmit={handleSubmit}>
                          <ScrollToError />
                          {/* <Field name='name'>
                          {({ field, formProps }: any) => (
                            <Form.Group className='mb-2' controlId='name'>
                              <h2>
                                Name <sup className='required'>Required</sup>
                              </h2>
                              <p>
                                What do you want to be known as? This can be
                                either you personally, or the name of a project
                                you’re looking to create
                              </p>
                              <Form.Control
                                type='text'
                                value={field.value}
                                onChange={handleChange}
                                placeholder='name'
                                maxLength={MAX_NAME_CHARACTERS}
                              />
                            </Form.Group>
                          )}
                        </Field> */}
                          {/* <div className='text-danger my-1'>
                          <ErrorMessage className="Mui-err"name='name' component='div' />
                        </div>
                        <Field name='bio'>
                          {({ field, formProps }: any) => (
                            <Form.Group className='mb-2' controlId='bio'>
                              <h2>
                                Bio <sup>Optional</sup>
                              </h2>
                              <p>
                                A brief summary of who you are. Accepts basic
                                markdown.
                              </p>
                              <Form.Control
                                as='textarea'
                                value={field.value}
                                onChange={handleChange}
                                placeholder='Message'
                                rows={3}
                                maxLength={MAX_BIO_CHARACTERS}
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <div className='text-danger my-1'>
                          <ErrorMessage className="Mui-err"name='bio' component='div' />
                        </div>
                        <Field name='externalLink'>
                          {({ field, formProps }: any) => (
                            <Form.Group
                              className='mb-2'
                              controlId='externalLink'
                            >
                              <h2>
                                External Link <sup>Optional</sup>
                              </h2>
                              <p>Add an external link to your profile.</p>
                              <Form.Control
                                type='text'
                                value={field.value}
                                onChange={handleChange}
                                placeholder='url'
                              />
                            </Form.Group>
                          )}
                        </Field>

                        <div className='text-danger my-1'>
                          <ErrorMessage className="Mui-err"name='externalLink' component='div' />
                        </div> */}
                          {/* <Button
                          className='submit-btn d-flex align-items-center justify-content-center'
                          type='submit'
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Spinner
                              animation='border'
                              // variant='secondary'
                              // size='sm'
                              style={{
                                width: '1.5rem',
                                height: '1.5rem',
                                borderWidth: '0.3rem',
                              }}
                            />
                          ) : (
                            ' Save Settings'
                          )}
                        </Button> */}
                      
                          <div className='pbg-pnl text-left'>
                            <div className='mb-4'>
                              <Field name='name'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    {/* {('Hi', field)} */}
                                    <Form.Label>{t('name')}</Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='name'
                                      placeholder={t('name')}
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='name'
                                  component='div'
                                />
                              </div>
                            </div>
                            <div className='mb-4'>
                              <Field name='designation'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    {/* {('Hi', field)} */}
                                    <Form.Label>{t('designation')}</Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='designation'
                                      placeholder={t('enter designation')}
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='designation'
                                  component='div'
                                />
                              </div>
                            </div>
                            <div className='mb-4'>
                              <Field name='email'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      {t('email (required)')}
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={(e) => {
                                        handleChange(e);
                                      }}
                                      onInput={(e) => {
                                        handleBlur(e);
                                      }}
                                      type='text'
                                      name='email'
                                      placeholder='Johndoe@example.com'
                                      disabled={emailFieldDisabled}
                                    />

                                    <Button
                                      className='mt-2'
                                      onClick={handleShow}
                                      disabled={emailButtonDisabled}
                                    >
                                      {buttonText}
                                    </Button>
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='email'
                                  component='div'
                                />
                              </div>
                            </div>
                            <div className='mb-4'>
                              <Field name='website'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>{t('website')}</Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='website'
                                      placeholder='https://example.com'
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='website'
                                  component='div'
                                />
                              </div>
                            </div>
                          </div>
                          <div className='pbg-pnl text-left'>
                            <div className='mb-4'>
                              <Field name='dob'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>{t('birth date')}</Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='date'
                                      name='dob'
                                      // max={new Date()}
                                      // max={new Date().toJSON().slice(0, 10)}
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='dob'
                                  component='div'
                                />
                              </div>
                            </div>
                            <Form.Label>{t('Gender')}</Form.Label>
                            <Row>
                              <Col xxl='12' xl='12' lg='12' md='12' sm='12'>
                                <ul className='btn-list gender'>
                                  <li>
                                    <Button
                                      className={`gender-btn ${
                                        currentGender === 'Male' ? 'active' : ''
                                      }`}
                                      onClick={() => setCurrentGender('Male')}
                                    >
                                      {t('male')}
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      className={`gender-btn ${
                                        currentGender === 'Female'
                                          ? 'active'
                                          : ''
                                      }`}
                                      onClick={() => setCurrentGender('Female')}
                                    >
                                      {t('female')}
                                    </Button>
                                  </li>
                                  <li>
                                    <Button
                                      className={`gender-btn ${
                                        currentGender === 'Non-binary'
                                          ? 'active'
                                          : ''
                                      }`}
                                      onClick={() =>
                                        setCurrentGender('Non-binary')
                                      }
                                    >
                                      {t('Non-binary')}
                                    </Button>
                                  </li>
                                </ul>
                              </Col>
                            </Row>
                          </div>
                          <div className='pbg-pnl text-left'>
                            <div className='mb-4'>
                              <Field name='facebook'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      {t('Facebook Profile URL')}{' '}
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='facebook'
                                      placeholder='https://'
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
                            </div>
                            <div className='mb-4'>
                              <Field name='twitter'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      {t('Twitter Profile URL')}{' '}
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='text'
                                      name='twitter'
                                      placeholder='https://'
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
                            </div>
                            <div className='mb-4'>
                              <Field name='instagram'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      {t('Telegram ID')}
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      name='instagram'
                                      type='text'
                                      placeholder='Enter Telegram ID'
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
                            </div>
                            <div className='mb-4'>
                              <Field name='linkedin'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      {t('LinkedIn Profile URL')}
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      name='linkedin'
                                      type='text'
                                      placeholder='https://'
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
                            </div>
                          </div>
                          {/* <div className='pbg-pnl text-left'>
                            <Field name='authorInfo'>
                              {({ field, formProps }: any) => (
                                <Form.Group className='mb-4'>
                                  <Form.Label>{t('Author’s Info')} </Form.Label>
                                  <Form.Control
                                    value={field.value}
                                    onChange={handleChange}
                                    name='linkedin'
                                    as='textarea'
                                    rows={3}
                                    placeholder='Neha Ali'
                                  />
                                </Form.Group>
                              )}
                            </Field>
                            <div className='text-danger my-1'>
                              <ErrorMessage
                                className='Mui-err'
                                name='linkedin'
                                component='div'
                              />
                            </div>
                          </div> */}
                          <div className='pbg-pnl text-left'>
                            <div className='mb-4'>
                              <Field name='authorInfo'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      {t('Author’s Info')}
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      name='authorInfo'
                                      as='textarea'
                                      rows={3}
                                      placeholder={t('Author,s Info')}
                                    />
                                  </Form.Group>
                                )}
                              </Field>{' '}
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  className='Mui-err'
                                  name='authorInfo'
                                  component='div'
                                />
                              </div>
                            </div>
                          </div>
                          <div className='pbg-pnl text-left'>
                            <div className='mb-4'>
                              <Field name='authorTitle'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      {t('Title to use for Author page')}
                                    </Form.Label>
                                    <Form.Control
                                      autoComplete='off'
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      name='authorTitle'
                                      type='text'
                                      placeholder={t('Title')}
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  name='authorTitle'
                                  component='div'
                                />
                              </div>
                            </div>
                            <div className='mb-4'>
                              <Field name='authorDescription'>
                                {({ field, formProps }: any) => (
                                  <Form.Group>
                                    <Form.Label>
                                      {t(
                                        'Meta description to use for Author pages'
                                      )}
                                    </Form.Label>
                                    <Form.Control
                                      as='textarea'
                                      name='authorDescription'
                                      rows={3}
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div className='text-danger mt-2'>
                                <ErrorMessage
                                  name='authorDescription'
                                  component='div'
                                />
                              </div>
                            </div>

                            <Button
                              className='submit-btn d-flex align-items-center justify-content-center'
                              type='submit'
                              disabled={isFormSubmitting}
                              style={{ maxWidth: '250px' }}
                            >
                              {isFormSubmitting ? (
                                <Spinner
                                  animation='border'
                                  // variant='secondary'
                                  // size='sm'
                                  style={{
                                    width: '1.5rem',
                                    height: '1.5rem',
                                    borderWidth: '0.3rem',
                                  }}
                                />
                              ) : (
                                t('Save Settings')
                              )}
                            </Button>
                          </div>
                        </FormikForm>
                      )}
                    </Formik>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        </>
      )}
    </main>
  );
}
