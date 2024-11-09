'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Button, Spinner, Modal, Form } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import calander from '@/assets/Img/Icons/icon-calander.png';
import achievements from '@/assets/Img/achievements.png';
import girl from '@/assets/Img/Icons/icon-girl-1.png';
import placeholder from '@/assets/Img/id-placeholder.png';
import defaultBanner from '@/assets/Img/default-banner.jpg';
import article from '@/assets/Img/Icons/icon-article-1.png';
import Cup from '@/assets/Img/Icons/icon-cup-2.png';
import { useConnectPlugWalletStore, useThemeStore } from '@/store/useStore';
import authMethods from '@/lib/auth';
import { User } from '@/types/profile';
import { getImage, getImageById } from '@/components/utils/getImage';
import iconcoin from '@/assets/Img/coin-image.png';
import { toast } from 'react-toastify';
import { RiAlarmWarningFill } from 'react-icons/ri';
import { utcToLocal } from '@/components/utils/utcToLocal';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import ProfileTabs from '@/components/ProfileTabs';
import {
  makeSubscriberActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { Principal } from '@dfinity/principal';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import TwitterSVGIcon from '@/components/twitterIconSVG/TwitterSVGIcon';
import logger from '@/lib/logger';
import UserLeaderboard from '@/components/UserLeaderboard/UserLeaderboard';
import { E8S } from '@/constant/config';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import getCroppedImg from '@/components/Cropper/cropImage';
import resizeImage from '@/components/utils/resizeImage';
import {
  MAX_ARTICLE_FEATURED_SIZES,
  profileAspects,
  MAX_PROFILE_SIZESs,
  PROFILE_COMPLETE_SIZE,
} from '@/constant/sizes';
import uploadImage from '@/components/utils/uploadImage';
import { BASE_IMG_URL, isValidFileType } from '@/constant/image';
import { CropperProps } from '@/types/cropper';
import ImageCropper from '@/components/Cropper';
import ProfileBoard from '@/components/ProfileBoard/ProfileBoard';

export default function Profiles() {
  const router = useRouter();
  const { t, changeLocale } = useLocalization(LANG);
  const [animatedElements, setAnimatedElements] = useState([]);
  const [requesting, setRequesting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [profileCompletePer, setProfileCompletePer] = useState(0);

  const [user, setUser] = useState<User | null>();
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const userId = searchParams.get('userId');
  const [profileImg, setProfileImg] = useState<string | null>();
  const [bannerImg, setBannerImg] = useState<string | null>();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [totallReward, setTotallReward] = useState(0);
  const [username, setUserName] = useState<string | null>();
  const [tempIdentityImage, setTempIdentityImage] = useState({
    imgUrl: '',
  });

  const [identityImgId, setIdentityImgId] = useState<string | null>();
  const [identityFile, setIdentityFile] = useState<File | null>();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isVerificationRequested, setIsVerificationRequested] = useState(false);

  const [cropperImg, setCropperImg] = useState<CropperProps | undefined>();
  const [showCropper, setShowCropper] = useState(false);
  // const [authorId, setAuthorId] = useState<any[]>();
  const [NotFound, setNotFound] = useState<boolean>(false);
  const { isBlack } = useThemeStore((state) => ({
    isBlack: state.isBlack,
  }));

  const handleClose = () => {};
  const { auth, setAuth, setIdentity, identity, principal ,userAuth,tokensBalance} =
    useConnectPlugWalletStore((state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      setIdentity: state.setIdentity,
      identity: state.identity,
      principal: state.principal,
      userAuth: state.userAuth,
      tokensBalance: state.tokensBalance
    }));
  const methods = authMethods({
    useConnectPlugWalletStore,
    setIsLoading,
    handleClose,
  });

  const handleShow = () => {
    if (user?.isVerificationRequested) {
      return toast.info(t('Verification request is pending'));
    }
    setShowModal(true);
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  let myreward = (tempRewards: any) => {
    let allAmount = 0;
    for (let i = 0; i < tempRewards.length; i++) {
      const reward = tempRewards[i];
      const amount = parseInt(reward.amount);
      allAmount += amount;
    }
    setTotallReward(allAmount);
  };
  const updateImg = async (img: any, name: string) => {
    if (img) {
      const tempImg = await getImageById(img);
      if (name === 'profile') {
        setProfileImg(tempImg);
      } else {
        setBannerImg(tempImg);
      }
    } else {
      if (name === 'profile') {
        // setProfileFile(null);
        setProfileImg(null);
      } else {
        // setBannerFile(null);
        setBannerImg(null);
      }
    }
  };
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
    if (tempUser.ok) {
      setUserName(tempUser.ok[1]?.name[0]);
      logger(tempUser.ok[1], 'dsfdsafasdfsad');
      setUser(tempUser.ok[1]);
      updateImg(tempUser.ok[1].profileImg[0], 'profile');
      updateImg(tempUser.ok[1].bannerImg[0], 'banner');
      myreward(tempUser.ok[1].rewards);
      if (tempUser.ok[1]?.isVerificationRequested) {
        setIsVerificationRequested(true);
      }

      setIsOwner(tempUser.ok[2]);
    }
  };
  const getSubscriber = async () => {
    const authorId = Principal.fromText(userId as string);

    const subscriberActor = makeSubscriberActor({
      agentOptions: {
        identity,
      },
    });
    const tempSub = await subscriberActor.isSubscriber(authorId);
    setIsSubscribed(tempSub);
  };
  const handleSubscribe = async () => {
    if (auth.state !== 'initialized') {
      return toast.error(
        t('To perform this action, kindly connect to Internet Identity.')
      );
    }
    const authorId = Principal.fromText(userId as string);
    try {
      setIsSubscribing(true);

      const subscriberActor = makeSubscriberActor({
        agentOptions: {
          identity,
        },
      });
      const subed = await subscriberActor.addSubscriber(
        authorId,
        userCanisterId,
        commentCanisterId,
        username
      );
      await getSubscriber();
      setIsSubscribing(false);
    } catch (error) {
      setIsSubscribing(false);
    }
  };
  let copyProfileLink = (e: any) => {
    e.preventDefault();
    let profileLink = `${window.location.origin}/profile?userId=${principal}`;
    window.navigator.clipboard.writeText(profileLink);
    toast.success(t('Copied successfully.'));
  };
  const handleVerify = async () => {
    if (!identityFile) {
      return toast.error(t('Please upload your identity card'));
    }
    setRequesting(true);

    try {
      let identityUrl = BASE_IMG_URL + identityImgId;
      let verify = await auth.actor.request_verification(identityUrl);
      if (verify?.ok) {
        toast.success(t('Verification request sent successfully'));
        setIsVerificationRequested(true);
        handleModalClose();
      } else {
        toast.error(t('Failed to send verification request'));
      }
      setRequesting(false);
    } catch (error) {
      setRequesting(false);
      logger(error, 'error');
    }
  };
  const handleShowCropper = () => {
    setShowCropper(true);
  };
  const handleHideCropper = () => {
    setShowCropper(false);
  };
  const identityUpload = async (
    imgUrl: string,
    imgName: string,
    pixels: any,
    rotation: number = 0
  ) => {
    const croppedImage = await getCroppedImg(imgUrl, imgName, pixels, rotation);
    if (!croppedImage) return;
    const resizedBanner = await resizeImage(
      croppedImage,
      MAX_PROFILE_SIZESs.width,
      MAX_PROFILE_SIZESs.height
    );
    const newUrl = URL.createObjectURL(resizedBanner);

    // return response.data;
    setTempIdentityImage({
      imgUrl: newUrl,
    });
    const imgId = await uploadImage(resizedBanner);
    setIdentityImgId(imgId);
    setIdentityFile(resizedBanner);
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
    setCropperImg({
      imgUrl,
      imgName: img.name,
      aspect: profileAspects,
      callBack: identityUpload,
      maxWidth: MAX_PROFILE_SIZESs.width,
      maxHeight: MAX_PROFILE_SIZESs.height,
    });
    handleShowCropper();
    e.target.value = '';
  };
  useEffect(() => {
    if (auth.state === 'initialized') {
      getUser();
    } else {
      methods.initAuth().then(async (res: any) => {
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
    }
  }, []);
  useEffect(() => {
    if (auth.state === 'anonymous') {
      setIsSubscribed(false);
      setIsOwner(false);
      // setIsOwner(false);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
    }
  }, [auth, userId]);
  useEffect(() => {
    if (identity && userId) {
      getSubscriber();
    }
  }, [identity]);
  useEffect(() => {
    const getIdentity = async () => {
      if (auth.client) {
        const con = await auth.client.isAuthenticated();
        if (con) {
          const identity = await auth.client.getIdentity();
          // const principal = await identity.getDelegation().toJSON().publicKey;
          // logger({ identity, principal }, 'WE GOT THIS BOZO');
          setIsAuthenticated(true);
          setIdentity(identity);
        } else {
          if (!userId) {
            let tempurl = window.location.search;
            const searchParams = await new URLSearchParams(tempurl);
            const tempuserId = searchParams.get('userId');
            if (!tempuserId) {
              router.replace('/');
              setIsAuthenticated(false);
            }
          } else {
            auth.actor
              .get_user_details([userId])
              .then(() => {
                setIsAuthenticated(true);
              })
              .catch(() => {
                setNotFound(true);
              });
          }
        }
      }
    };
    getIdentity();
  }, [auth.client]);
useEffect(() => {
  if (auth.state === 'initialized') {
    if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
      setIsAdmin(true)

 
  } else if (auth.state === 'anonymous') {
setIsAdmin(false)
  }}
 } ,[identity, userAuth, auth]);
 function isEmpty(params:any) {
  if(params?.length >2){
    return true;
  }else{
    return false;
  }
}
 let setCompletedProfile=()=>{
  if(user){
    let numberCount=0;
    if(isEmpty(user?.authorDescription[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['authorDescription']
    };
    if(isEmpty(user?.authorTitle[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['authorTitle']
    }
    if(isEmpty(user?.authorInfo[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['authorInfo']
    }
    if(user?.bannerImg && user?.bannerImg.length>0){
      numberCount+=PROFILE_COMPLETE_SIZE['bannerImg']
    }
    if(user?.profileImg && user?.profileImg.length>0){
      numberCount+=PROFILE_COMPLETE_SIZE['profileImg']
    }
    if(isEmpty(user?.designation[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['designation']
    }
    if(isEmpty(user?.dob[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['dob']
    }
    if(isEmpty(user?.email[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['email']
    }
    if(isEmpty(user?.facebook[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['facebook']
    }
    if(isEmpty(user?.linkedin[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['linkedin']
    }

    if(isEmpty(user?.twitter[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['twitter']
    }
    if(isEmpty(user?.website[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['website']
    }
    if(isEmpty(user?.instagram[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['instagram']
    }
    if(isEmpty(user?.name[0])){
      numberCount+=PROFILE_COMPLETE_SIZE['name']
    }
    setProfileCompletePer(numberCount)

  }
 }
useEffect(() => {
  setCompletedProfile()
  
},[user])
  // router.push('/route')
  return (
    <>
      <main id='main' className={isBlack ? 'black' : ''}>
        {isAuthenticated && !NotFound && (
          <>
            {cropperImg && (
              <ImageCropper
                show={showCropper}
                handleClose={handleHideCropper}
                cropperProps={cropperImg}
              />
            )}
            <div className='main-inner'>
              <Head>
                <title>{t('Hi')}</title>
              </Head>
              <div className='inner-content'>
                <Row>
                  <Col xxl='10' xl='12' lg='12' md='12'>
                    <div className='profile-detail'>
                      <div className='profile-detail-body'>
                        <div className='pr-banner'>
                          <div
                          // className='banner-pnl'
                          // style={{ minHeight: 432 }}
                          >
                            <Image
                              src={bannerImg ? bannerImg : defaultBanner}
                              fill={true}
                              alt='Banner'
                            />
                          </div>
                        </div>
                        <div className='flex-div-sm'>
                          <div className='profile-info'>
                            <div className='img-pnl'>
                              {/* <Image src={girl} alt='girl' /> */}
                              <div className='img'>
                                <Image
                                  src={profileImg ? profileImg : girl}
                                  fill={true}
                                  alt='Profile'
                                />
                              </div>
                            </div>
                            <div className='txt-pnl'>
                              <h2 className='mb-1'>
                                {user ? user.name : 'User Name'}{' '}
                                {isOwner && (
                                  <Link
                                    href='/profile-details'
                                    className='text-black'
                                  >
                                    <i className='fa fa-pencil' />
                                  </Link>
                                )}
                              </h2>
                              <p className='m-0'>
                                {user ? user.designation : ''}{' '}
                                {/* CEO of NFTStudio24 */}
                              </p>
                            </div>
                          </div>
                          <div className='edit-profile'>
                            <ul>
                              {isOwner ? (
                                <>
                                  {isVerificationRequested ? (
                                    user?.isVerified ? (
                                      <li>
                                        <Button className='no_style'>
                                          {t('Verified')}{' '}
                                          <Image
                                            width={20}
                                            height={20}
                                            alt='Verification Image'
                                            src='/images/verifiedicon.png'
                                            className=''
                                          />
                                        </Button>
                                      </li>
                                    ) : (
                                      <li>
                                        <Button className='no_style'>
                                          <i
                                            className='fa fa-clock-o'
                                            aria-hidden='true'
                                          />{' '}
                                          {t('Verification Pending')}
                                        </Button>
                                      </li>
                                    )
                                  ) : (
                                    <li>
                                      <Button onClick={handleShow}>
                                        <Image
                                          width={20}
                                          height={20}
                                          alt='Verification Image'
                                          src='/images/verify.png'
                                          className='icon-img'
                                        />{' '}
                                        {t('Request Verification')}
                                      </Button>
                                    </li>
                                  )}
                                  <li>
                                    <Link href='/profile-details'>
                                      <i className='fa fa-edit' />
                                      {t('Edit your Profile')}
                                    </Link>
                                  </li>
                                </>
                              ) : (
                                <li>
                                  <Button
                                    className={isSubscribed ? 'active' : ''}
                                    disabled={isSubscribing}
                                    onClick={handleSubscribe}
                                  >
                                    {isSubscribing ? (
                                      <Spinner size='sm' />
                                    ) : isSubscribed ? (
                                      <>
                                        <i className='fa fa-check' />{' '}
                                        {t('Subscribed')}
                                      </>
                                    ) : (
                                      t('Subscribe')
                                    )}
                                  </Button>
                                </li>
                              )}
                              <li>
                                <Link href='#' onClick={copyProfileLink}>
                                  <i className='fa fa-share-alt' />
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className='flex-div-xs '>
                          {/* <h1>2</h1> */}
                          <div className='description'>
                            {user ? user.authorInfo : 'Author Info'}{' '}
                          </div>
                          <div className='socials d-flex justify-content-center'>
                            {user && user?.website[0]?.length > 0 ? (
                              <Link target='_blank' href={user?.website[0]}>
                                {/* <i className='fa fa-instagram'/> */}
                                <i className='fa fa-globe' />
                              </Link>
                            ) : (
                              ''
                            )}
                            {user && user?.instagram[0]?.length > 0 ? (
                              <Link target='_blank' href={user?.instagram[0]}>
                                <i className='fa fa-instagram' />
                              </Link>
                            ) : (
                              ''
                            )}
                            {user && user?.facebook[0]?.length > 0 ? (
                              <Link target='_blank' href={user?.facebook[0]}>
                                <i className='fa fa-facebook-f' />
                              </Link>
                            ) : (
                              ''
                            )}
                            {user && user?.twitter[0]?.length > 0 ? (
                              <Link target='_blank' href={user?.twitter[0]}>
                                {/* <i className='fa-brands fa-x-twitter '/> */}
                                <TwitterSVGIcon color='blue' />
                              </Link>
                            ) : (
                              ''
                            )}
                            {user && user?.linkedin[0]?.length > 0 ? (
                              <Link target='_blank' href={user?.linkedin[0]}>
                                <i className='fa fa-linkedin' />
                              </Link>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>
                        <p>
                          {}
                          <Image src={calander} alt='calander' />{' '}
                          {t('Joined from')}{' '}
                          {user
                            ? utcToLocal(
                                user.joinedFrom.toString(),
                                'MMMM Do, YYYY'
                              )
                            : ''}
                        </p>
                      </div>
                    </div>
                  </Col>
                  {profileCompletePer!=100 && <Col  xxl='10' xl='12' lg='12' md='12'>
                  <ProfileBoard userName={user ? user.name : 'User Name'} completedProfile={profileCompletePer}/>
                 
                  </Col>}
                  <div className='spacer-40' />
                  <Col xxl='10' xl='12' lg='12' md='12' className='p-0'>
                    <div className='profile-content-pnl'>
                      <div className='heding left-side'>
                        <h4>
                          <Image src={article} alt='Article' />
                          {t('Activities')}
                        </h4>
                        {isOwner && (
                          <div className='welcome-create-post'>
                            <div className='flex-div-xs'>
                              <p>{t('welcome')}</p>
                              <p>
                                {t('Learn about NS24')}{' '}
                                <Image src={iconcoin} alt='coin' />
                              </p>
                            </div>
                            <div className='spacer-10' />
                            <Button
                              href='/add-article'
                              className='cerate-post-btn'
                            >
                              {t('create post')}
                            </Button>
                          </div>
                        )}
                        {/* <ul className='tabs-list'>
                        <li>
                          <Link href='#' className='active'>
                            Reviews
                          </Link>
                        </li>
                        <li>
                          <Link href='#'>Comments</Link>
                        </li>
                        <li>
                          <Link href='#'>Favorite Posts</Link>
                        </li>
                        <li>
                          <Link href='#'>Favorite product Communities</Link>
                        </li>
                      </ul> */}
                        <ProfileTabs
                          userId={
                            userId
                              ? Principal.fromText(userId)
                              : identity
                              ? identity.getPrincipal()
                              : null
                          }
                          isOwner={isOwner}
                          isAdmin= {isAdmin}
                        />
                      </div>
                      <div className='right-side'>
                        {isOwner && (
                          <div>
                            <div className='heding'>
                              <h4>
                                <Image src={Cup} alt='Cup' /> {t('Achievement')}
                              </h4>
                            </div>
                            {/* <Image src={achievements} alt='achievements' /> */}
                            <UserLeaderboard
                              totallReward={tokensBalance}
                              userImg={profileImg}
                              userId={
                                identity ? identity?._principal?.toString() : ''
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </>
        )}
        {NotFound && (
          <section className='bg-white'>
            {/* <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'> */}
            <div className='pagenotfound'>
              <div>
                <RiAlarmWarningFill
                  size={60}
                  className='drop-shadow-glow animate-flicker text-red-500'
                />
                <h1 className='mt-8 text-4xl md:text-6xl'>User Not Found</h1>
                <Link href='/'>Back to home</Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Modal
        show={showModal}
        // size='md'
        centered
        onHide={handleModalClose}
      >
        <Modal.Header closeButton>
          <h3 className='text-center'>{t('Request Verification')}</h3>
        </Modal.Header>
        <Modal.Body>
          <p>
            {t(
              'Please provide an image of your identity card to verify your account.'
            )}
          </p>
          <input
            id='identityImg'
            className='d-none'
            onChange={handleImageChange}
            name='identityImg'
            type='file'
          />
          <div className='d-flex w-100 justify-content-center'>
            <div
              className='edit-banner-cntnr'
              style={{
                maxWidth: 300,
                width: '100%',
              }}
            >
              {/* <Image src={pic} alt='Pic' /> */}
              <div
                className='img-catch'
                style={{
                  aspectRatio: profileAspects,
                }}
              >
                {identityFile ? (
                  <Image
                    fill={true}
                    src={tempIdentityImage.imgUrl}
                    alt='Banner'
                  />
                ) : (
                  <Image src={placeholder} alt='Banner' fill={true} />
                )}
              </div>
            </div>
          </div>
          <Form.Label htmlFor='identityImg' className='d-block text-center'>
            <i className='fa fa-edit' /> {t('upload your identity card')}
          </Form.Label>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='publish-btn'
            disabled={!identityFile}
            onClick={handleVerify}
          >
            {requesting ? <Spinner size='sm' /> : t('Send')}
          </Button>
          <Button
            disabled={requesting}
            className='default-btn'
            onClick={handleModalClose}
          >
            {t('Cancel')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
