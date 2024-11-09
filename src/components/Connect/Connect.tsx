'use client';

import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import * as React from 'react';
import icpimage from '@/assets/Img/coin-image.png';
// import { Modal } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { toast } from 'react-toastify';
import {
  Button,
  Form,
  Modal,
  Nav,
  NavDropdown,
  NavLink,
  Spinner,
} from 'react-bootstrap';
import { useConnectPlugWalletStore } from '@/store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import authMethods from '@/lib/auth';
import infinity from '@/assets/Img/Icons/infinity.png';
import iconuser1 from '@/assets/Img/Icons/icon-user-2.png';
import iconuser2 from '@/assets/Img/Icons/icon-user-1.png';
import blackbook from '@/assets/Img/Icons/blackbook.png';
import whitebok from '@/assets/Img/Icons/whitebook.png';

import cup from '@/assets/Img/Icons/icon-cup-1.png';
import cup1 from '@/assets/Img/Icons/icon-cup-3.png';
import userImg from '@/assets/Img/Icons/icon-user-3.png';
import user1 from '@/assets/Img/Icons/icon-user-2.png';
import feedback from '@/assets/Img/Icons/icon-feedback-3.png';
import feedback1 from '@/assets/Img/Icons/icon-feedback-1.png';
import setting from '@/assets/Img/Icons/icon-setting-3.png';
import setting1 from '@/assets/Img/Icons/icon-setting-2.png';
import gift from '@/assets/Img/Icons/icon-gift.png';
import { ConnectPlugWallet } from '@/components/utils/connection';
import iconbook from '@/assets/Img/Icons/icon-book.png';
import icongirl from '@/assets/Img/Icons/icon-girl-1.png';
import { User } from '@/types/profile';
import { getImage, getImageById } from '@/components/utils/getImage';
import { ConnectPlugWalletSlice, UserAuth } from '@/types/store';
import { canisterId as ledgerCanisterId } from '@/dfx/declarations/icp_ledger_canister';
import {
  makeLedgerCanister,
  makeTokenCanister,
} from '@/dfx/service/actor-locator';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import iconlogo from '@/assets/Img/Icons/icon-logo.png';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
} from 'formik';
import { E8S, GAS_FEE } from '@/constant/config';
import { number, object, string } from 'yup';
import instance from '@/components/axios';
import SignInButton from '@/components/SignInButton';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import { BUYTOKENS } from '@/constant/routes';
import ConfirmationModel from '@/components/Modal/ConfirmationModel';
import { MINIMUM_TOKEN_TRANSFER } from '@/constant/validations';
import GlobalSearch from '@/components/GlobalContent/SearchModal';
export default function Connect({
  hideRewards,
  hideUser,
  hide = false,
}: {
  hideRewards?: boolean;
  hideUser?: boolean;
  hide?: boolean;
}) {
  const [pText, setPText] = React.useState('nothing');
  const [show, setShow] = React.useState<boolean | undefined>();
  const [showTokenModle, setShowTokenModle] = React.useState<
    boolean | undefined
  >();
  const [plugConnected, setPlugConnected] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLoggin, setIsLoggin] = React.useState<boolean>(false);
  const [userId, setUserId] = React.useState<number | null>();
  const [isConnectLoading, setIsConnectLoading] =
    React.useState<boolean>(false);
  const [connected, setConnected] = React.useState(false);

  const [expanded, setExpanded] = React.useState(false);
  const [user, setUser] = React.useState<User | null>();
  const [profileImg, setProfileImg] = React.useState<string | null>();
  const [publicKey, setPublicKey] = React.useState<string | null>();
  const [userBalance, setUserBalance] = React.useState<undefined | number>();
  const [isTransfering, setIsTransfering] = React.useState(false);
  const [loginModalShow, setLoginModalShow] = React.useState(false);
  const pathname = usePathname();
  const route = pathname?.split('/')[1];
  const { t, changeLocale } = useLocalization(LANG);
  const {
    auth,
    userAuth,
    identity,
    principal,
    setIdentity,
    setPrincipal,
    setUserAuth,
    setAuth,
    reward,
    balance,
    tokensBalance,
    setReward,
    setBalance,
    setTokensBalance,
    setTokenSymbol,
    tokenSymbol,
  } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    setAuth: (state as ConnectPlugWalletSlice).setAuth,
    reward: (state as ConnectPlugWalletSlice).reward,
    balance: (state as ConnectPlugWalletSlice).balance,
    tokensBalance: (state as ConnectPlugWalletSlice).tokensBalance,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
    setIdentity: (state as ConnectPlugWalletSlice).setIdentity,
    setReward: (state as ConnectPlugWalletSlice).setReward,
    setBalance: (state as ConnectPlugWalletSlice).setBalance,
    setTokensBalance: (state as ConnectPlugWalletSlice).setTokensBalance,
    principal: (state as ConnectPlugWalletSlice).principal,
    setPrincipal: (state as ConnectPlugWalletSlice).setPrincipal,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
    setTokenSymbol: (state as ConnectPlugWalletSlice).setTokenSymbol,
    tokenSymbol: (state as ConnectPlugWalletSlice).tokenSymbol,
  }));
  const router = useRouter();
  const location = usePathname();
  const handleShow = () => setShow(true);
  const handleShowTokenModle = () => setShowTokenModle(true);
  const handleClose = () => {
    setShow(false);
    setIsLoggin(false);
  };
  const handleCloseTokenModle = () => {
    setShowTokenModle(false);
    setIsLoggin(false);
  };
  const methods = authMethods({
    useConnectPlugWalletStore,
    setIsLoading,
    handleClose,
  });
  const icpTokenName = async () => {
    if (auth.state !== 'initialized' || !identity) return;
    const tokenActor = makeTokenCanister({
      agentOptions: {
        identity,
      },
    });
    const tokenName = await tokenActor.icrc1_symbol();
    if (tokenName) {
      setTokenSymbol(tokenName);
    }
  };
  const initialTransferValues = {
    destination: '',
    amount: 0,
  };
  const gasFee = E8S / GAS_FEE;
  const gasFeeICP = gasFee / E8S;
  const transferSchema = object().shape({
    destination: string().test('min', t('Not a valid address'), (value) => {
      try {
        Principal.fromText(value as string);
        return true;
      } catch {
        return false;
      }
    }),
    amount: number()
      .test('min', t('Minimum 0.00000001 ICP can be sent.'), (value) => {
        if (value && value >= 0.00000001) {
          return true;
        } else {
          return false;
        }
      })
      .test(
        'min',
        t('Sorry, there are not enough funds in your account'),
        (value) => {
          if (balance && value) {
            let requiredICP = balance - gasFeeICP;
            if (requiredICP >= value) return true;
          } else if (!value) {
            return true;
          } else {
            return false;
          }
        }
      ),
  });
  const tokensTransferSchema = object().shape({
    destination: string().test('min', t('Not a valid address'), (value) => {
      try {
        Principal.fromText(value as string);
        return true;
      } catch {
        return false;
      }
    }),
    amount: number()
      .test(
        'min',
        `${t(`Minimum`)} ${MINIMUM_TOKEN_TRANSFER} ${tokenSymbol} ${t(
          'can be sent.'
        )})`,
        (value) => {
          if (value && value >= MINIMUM_TOKEN_TRANSFER) {
            return true;
          } else {
            return false;
          }
        }
      )
      .test(
        'min',
        t('Sorry, there are not enough funds in your account'),
        (value) => {
          if (tokensBalance && value) {
            if (tokensBalance >= value) return true;
          } else if (!value) {
            return true;
          } else {
            return false;
          }
        }
      ),
  });

  const verifyConnection = async () => {
    if (!window.ic) {
      return toast.error(t('Install Plug Wallet'));
    }
    const connected = false; //await window.ic.plug.isConnected();
    if (connected) {
      toast.success(t('Already connected'));
      setPlugConnected(true);
      handleClose();
      return;
    } else {
      const whitelist = [process.env.NEXT_PUBLIC_HELLO_CANISTER_ID];

      const host = 'http://127.0.0.1:4943';

      const onConnectionUpdate = async () => {};
      try {
        const publicKey = await window.ic.plug.requestConnect({
          whitelist,
          host,
          onConnectionUpdate,
          timeout: 50000,
        });
        setPlugConnected(true);
        handleClose();
      } catch {
        toast.error(t('Could not connect to plug wallet'));
      }
    }
  };

  const handleConnect = async () => {
    // await verifyConnection();
    setIsLoading(true);
    const { success, msg } = await ConnectPlugWallet();
    setIsLoading(false);

    if (success) {
      toast.success(msg);
      setPlugConnected(true);
      // router.push('/dashboard');
    } else {
      toast.error(msg);
    }
    // if (connected) {
    //   const principal = await window.ic.plug.getPrincipal();
    //   const publicAddr = principal.toString();

    //   axios
    //     .post(`auth/login`, {
    //       email: publicAddr,
    //       password: PASS_KEY,
    //     })
    //     .then((res) => {
    //       localStorage.setItem('token', res.data.data);
    //       // router.push('/dashboard');
    //     });
    // }
  };

  const disconnect = async () => {
    // if (getToken()) {
    //   localStorage.removeItem('token');
    // }

    const connect = await window.ic.plug.isConnected();
    if (connect) {
      window.ic.plug.disconnect();
    }
  };
  const connect = async () => {
    setLoginModalShow(false);
    setIsLoggin(true);
    const login = await methods.login();
  };
  const updateImg = async (img: any) => {
    if (img) {
      const tempImg = await getImageById(img);

      setProfileImg(tempImg);
    } else {
      // setProfileFile(null);
      setProfileImg(null);
    }
  };
  const copyPrincipal = () => {
    window.navigator.clipboard.writeText(principal);
    toast.success(t('Address copied to clipboard'), { autoClose: 1000 });
  };
  /**
  function getTokenBalance use to get token balance of user
   @return token balance 
   @perams null 
    **/
  const getTokenBalance = async () => {
    if (auth.state !== 'initialized' || !identity) return;
    let tokenActor = await makeTokenCanister({
      agentOptions: {
        identity,
      },
    });

    try {
      let myPrincipal = identity.getPrincipal();
      let res = await tokenActor.icrc1_balance_of({
        owner: myPrincipal,
        subaccount: [],
      });
      let balance = parseInt(res);

      setTokensBalance(balance);
    } catch (error) {}
  };
  /**
  function getBalance use to get icp balance of user
   
  @return icp balance 
   @perams null 
    **/
  const getBalance = async () => {
    if (auth.state !== 'initialized' || !identity) return;
    let ledgerActor = await makeLedgerCanister({
      agentOptions: {
        identity,
      },
    });

    try {
      let acc: any = AccountIdentifier.fromPrincipal({
        principal: identity.getPrincipal(),
        // subAccount: identity.getPrincipal(),
      });

      let res = await ledgerActor.account_balance({
        account: acc.bytes,
      });

      let balance = parseInt(res.e8s) / E8S;

      setBalance(balance);
      setUserBalance(balance);
    } catch (error) {}
  };
  const getUser = async (res?: any) => {
    let tempUser = null;
    let tempUserReward = null;
    let tempReward = [];

    if (res) {
      tempUser = await res.get_user_details([]);
      tempUserReward = await auth.actor.get_reward_of_user_count();
    } else {
      tempUser = await auth.actor.get_user_details([]);
      tempUserReward = await auth.actor.get_reward_of_user_count();
    }
    if (tempUserReward) {
      tempReward = tempUserReward;
    }
    if (tempUser.ok) {
      setUser(tempUser.ok[1]);
      // const unClaimedRewards = tempReward?.filter((reward: any) => {
      //   return !reward.isClaimed;
      // });

      let allAmount = Number(tempReward?.all) ?? 0;
      let claimedAmount = Number(tempReward?.claimed) ?? 0;
      let unClaimedAmount = Number(tempReward?.unclaimed) ?? 0;

      // .reduce((acc: number, obj: any) => acc + parseInt(obj.amount), 0);
      // let rewardsInICP = unClaimedRewards / E8S;

      setReward(unClaimedAmount ?? 0);

      if (tempUser.ok[1].isBlocked) {
        setUserAuth({ ...userAuth, status: tempUser.ok[1].isBlocked });
      }
      if (tempUser.ok[1].isAdminBlocked) {
        setUserAuth({
          ...userAuth,
          isAdminBlocked: tempUser.ok[1].isAdminBlocked,
        });
      }

      updateImg(tempUser.ok[1].profileImg[0]);
    }
  };
  const getII = async () => {
    const identity = await auth.client.getIdentity();
    const principal = await identity.getPrincipal();
    setPrincipal(principal.toString());
    setIdentity(identity);
  };
  const handleConnectClose = () => {
    setIsConnectLoading(false);
  };

  React.useEffect(() => {
    const getIdentity = async () => {
      if (auth.client) {
        const con = await auth.client.isAuthenticated();
        if (con) {
          const identity = await auth.client.getIdentity();

          setIdentity(identity);
          const pKey = await identity.getDelegation().toJSON().publicKey;
          setPublicKey(pKey);
        }
      }
    };
    getIdentity();
    icpTokenName();
  }, [auth.client]);

  React.useEffect(() => {
    if (auth.state === 'initialized') {
      getUser();
      getII();
    } else {
      methods.initAuth().then(async (res) => {
        if (res.success) {
          getUser(res.actor);
        }
      });
    }
  }, []);
  React.useEffect(() => {
    if (auth.state === 'anonymous') {
      // setIsOwner(false);
      setIdentity(null);
    } else if (auth.state !== 'initialized') {
    } else {
      getUser();
      getII();
    }
  }, [auth, pathname]);
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
    if (auth.state === 'initialized' && identity) {
      getBalance();
      getTokenBalance();
    }
  }, [auth, pathname, identity]);
  React.useEffect(() => {
    if (userAuth.status) {
      router.replace('/blocked');
    }
  }, [userAuth, pathname]);

  React.useEffect(() => {
    methods.initAuth();
  }, []);

  let confirmationModelOpen = () => {
    setLoginModalShow(true);
  };

  return (
    <>
      <ul className='side-btnlist'>
        <li>{route !== 'super-admin' && <GlobalSearch />}</li>
        {isLoading ? (
          <li className='remove'>
            <div className='loader-container'>
              <Spinner
                animation='border'
                variant='secondary'
                size='sm'
                className={`${hideUser ? '' : ''} ${
                  hideRewards ? 'hide-on-desktop' : ''
                }`}
              />
            </div>
          </li>
        ) : auth.state !== 'initialized' ? (
          route === 'super-admin' ? (
            <li className='remove'>
              <Button
                className={`link-btn ${hideUser ? '' : ''} ${
                  hideRewards ? 'hide-on-desktop' : ''
                }`}
                disabled={isLoggin}
                onClick={() => {
                  if (route === 'super-admin') {
                    confirmationModelOpen();
                  }
                }}
              >
                {isLoggin ? <Spinner size='sm' /> : 'Sign In'}
              </Button>
            </li>
          ) : (
            <>
              <Button
                onClick={confirmationModelOpen}
                className='connect-btn'
                disabled={isConnectLoading || connected}
              >
                <span>
                  <Image src={iconlogo} alt='Blockza' />
                </span>
                {isConnectLoading ? (
                  <Spinner size='sm' className='ms-4 text-primary' />
                ) : connected ? (
                  'Connected'
                ) : (
                  'Connect'
                )}
              </Button>

              <SignInButton />
            </>
          )
        ) : (
          <>
            {!hide && (
              <>
                <li className='remove'>
                  <Link
                    href='/reward'
                    className={`link-btn empty re ${
                      hideUser ? 'hide-on-mobile' : ''
                    } ${hideRewards ? 'hide-on-desktop' : ''}`}
                  >
                    {t('my rewards')}
                  </Link>
                </li>
                <li className='remove'>
                  <Nav.Link
                    href='#'
                    className={`link-btn empty ${
                      hideUser ? 'hide-on-mobile' : ''
                    } ${hideRewards ? 'hide-on-desktop' : ''}`}
                  >
                    <Image src={iconbook} alt='iconbook' />
                    {t('guide book')}
                  </Nav.Link>
                </li>
              </>
            )}
            <li>
              <Button
                onClick={confirmationModelOpen}
                className='connect-btn'
                disabled={isConnectLoading || connected}
              >
                <span>
                  <Image src={iconlogo} alt='Blockza' />
                </span>
                {isConnectLoading ? (
                  <Spinner size='sm' className='ms-4 text-primary' />
                ) : connected ? (
                  t('Connected')
                ) : (
                  t('Connect')
                )}
              </Button>
              <div
                className={`profile-btn ${hideUser ? '' : ''} ${
                  hideRewards ? 'hide-on-desktop' : ''
                }`}
              >
                <NavDropdown
                  onSelect={() => {}}
                  // active={true}
                  title={
                    <>
                      <div className='link-btn logedin'>
                        <div className='img-pnl'>
                          {/* <Image src={icongirl} alt='icongirl' /> */}
                          <div
                            style={{
                              position: 'relative',
                              margin: '0 auto',
                            }}
                          >
                            <Image
                              src={
                                user?.profileImg[0]
                                  ? `${user?.profileImg[0]}`
                                  : icongirl
                              }
                              className='backend-img'
                              fill={true}
                              alt='Profileicon'
                            />
                          </div>
                        </div>
                        <div className='txt-pnl'>
                          <h6 className={hide ? 'text-white' : ''}>
                            {user
                              ? user?.name.toString().length <= 8
                                ? user?.name
                                : `${user?.name.toString().slice(0, 8)}... `
                              : 'User Name'}
                          </h6>

                          <span>
                            <Image
                              src={infinity}
                              alt='icpimage'
                              style={{ height: '10px  ', width: '20px' }}
                            />{' '}
                            {balance ?? 0}
                          </span>
                        </div>
                      </div>
                    </>
                  }
                  id='basic-nav-dropdown'
                >
                  <NavDropdown.Item className='pr-link'>
                    <div>
                      <div
                        style={{
                          position: 'relative',
                          width: '60px',
                          margin: '0 auto',
                          height: '60px',
                        }}
                      >
                        <Image
                          src={
                            user?.profileImg[0]
                              ? `${user?.profileImg[0]}`
                              : icongirl
                          }
                          className='backend-img'
                          fill={true}
                          alt='Profileicon'
                        />
                      </div>
                    </div>
                    <div>
                      <h6>
                        {user
                          ? user?.name.toString().length >= 16
                            ? `${user?.name
                                .toString()
                                .slice(0, 17)} \n ${user?.name
                                .toString()
                                .slice(17)}`
                            : user?.name
                          : 'User Name'}
                      </h6>
                      <p>
                        {principal
                          ? principal?.slice(0, 5) +
                            '...' +
                            principal?.slice(-3)
                          : ''}{' '}
                        <i
                          onClick={copyPrincipal}
                          className='fa fa-lg fa-copy '
                          style={{
                            cursor: 'pointer',
                            fontSize: 15,
                            color: 'black',
                          }}
                        />
                      </p>
                    </div>
                    <div className='total-icp'>
                      <p>{t('Claimable Rewards')}</p>
                      <span>
                        <Image
                          src={icpimage}
                          alt='icpimage'
                          style={{ height: '21px', width: '21px' }}
                        />{' '}
                        {formatLikesCount(reward ?? 0)}
                      </span>
                    </div>
                    <div className='total-icp'>
                      <p>{t('icp token')}</p>
                      <span>
                        <Image
                          src={infinity}
                          alt='icpimage'
                          style={{ height: '10px  ', width: '20px' }}
                        />{' '}
                        {balance ?? 0}
                      </span>
                    </div>
                    <div className='total-icp'>
                      <p>{t('Blockza tokens')}</p>
                      <span>
                        <Image
                          src={icpimage}
                          alt='icpimage'
                          style={{ height: '21px', width: '21px' }}
                        />{' '}
                        {formatLikesCount(tokensBalance ?? 0)}
                      </span>
                    </div>
                  </NavDropdown.Item>
                  {!userAuth.status && (
                    <>
                      <NavDropdown.Item as={Link} href='/profile'>
                        <Image src={userImg} alt='user' />
                        <Image src={user1} alt='user' /> {t('My Profile')}
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        // onClick={async (e) => {
                        //   e.preventDefault();

                        //   let ledgerActor = await makeLedgerCanister({
                        //     agentOptions: {
                        //       identity,
                        //     },
                        //   });

                        //   let acc: any = AccountIdentifier.fromPrincipal({
                        //     principal: identity.getPrincipal(),
                        //     // subAccount: identity.getPrincipal(),
                        //   });
                        //   let poor = Principal.fromText(
                        //     'ovwuo-27fz4-mzoqt-civgm-otc2n-k37td-m4d2e-n35pq-6an4y-j7q7i-5qe'
                        //   );
                        //   let rich = Principal.fromText(
                        //     'dmy7a-ywgp6-wkwqw-rplzc-lbaqc-5ppsv-6och2-yh2mg-tnn4y-yz4su-lae'
                        //   );
                        //   let transfered = await ledgerActor.icrc2_transfer_from({
                        //     amount: 2000000,
                        //     created_at_time: [],
                        //     fee: [],
                        //     from: { owner: rich, subaccount: [] },
                        //     memo: [],
                        //     spender_subaccount: [],
                        //     to: { owner: poor, subaccount: [] },
                        //   });

                        // }}
                        href='/reward'
                        as={Link}
                      >
                        {/* <Link
                  // onClick={async () => {
                   
                  // }}
                  // }
                > */}
                        <Image src={cup} alt='cup' />
                        <Image src={cup1} alt='cup' />
                        {t('my rewards')}
                      </NavDropdown.Item>
                      <NavDropdown.Item href='/reward' as={Link}>
                        <Image src={blackbook} alt='iconbook' />
                        <Image src={whitebok} alt='iconbook' />{' '}
                        {t('guide book')}
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={handleShow}>
                        <Image
                          src={infinity}
                          alt='icpimage'
                          style={{ height: '10px  ', width: '20px' }}
                        />{' '}
                        <Image
                          src={infinity}
                          alt='icpimage'
                          style={{ height: '10px  ', width: '20px' }}
                        />{' '}
                        {t('transfer icp')}
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={handleShowTokenModle}>
                        <Image
                          src={icpimage}
                          alt='icpimage'
                          className='imageStyle'
                        />
                        <Image
                          src={icpimage}
                          alt='icpimage'
                          className='imageStyle'
                        />
                        {t('Transfer Tokens')}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} href='/subscribers'>
                        {' '}
                        <Image src={userImg} alt='user' />
                        <Image src={user1} alt='user' />
                        {t('my subscribers')}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} href='/profile-details'>
                        <Image src={setting} alt='setting' />
                        <Image src={setting1} alt='setting' /> {t('settings')}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} href='/'>
                        <Image src={feedback} alt='Feedback' />
                        <Image src={feedback1} alt='Feedback' />
                        {t('feedback')}
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} href={BUYTOKENS}>
                        <Image
                          src={icpimage}
                          alt='icpimage'
                          className='imageStyle'
                        />
                        <Image
                          src={icpimage}
                          alt='icpimage'
                          className='imageStyle'
                        />
                        {t('Buy Tokens')}
                      </NavDropdown.Item>

                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} href='/'>
                        <Image src={gift} alt='Feedback' />
                        <Image src={gift} alt='Feedback' />{' '}
                        {t('refer friends & collect rewards')}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </>
                  )}
                  <NavDropdown.Item
                    onClick={async () => {
                      await methods.logout();
                      await methods.initAuth();
                      if (userAuth.status) {
                        router.replace('/');
                      }
                    }}
                    className='disconnect-btn'
                  >
                    <i className='fa fa-sign-out' /> {t('Disconnect')}
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </li>

            {/* <Button
            className='connect-btn'
            style={buttonStyle ? { marginLeft: '10px' } : {}}
          >
            Create
          </Button> */}
          </>
        )}
      </ul>

      <Modal centered show={show} onHide={handleClose} onClose={handleClose}>
        <Modal.Header closeButton className=''>
          {t('transfer icp')}
        </Modal.Header>
        <Modal.Body>
          <div className=''>
            <Formik
              initialValues={initialTransferValues}
              // innerRef={formikRef}
              // enableReinitialize
              validationSchema={transferSchema}
              onSubmit={async (values, actions) => {
                // setPromotionValues({
                //   icp: values.ICP,
                //   // likes: values.likesCount,
                // });
                if (!identity) {
                  return;
                }
                try {
                  setIsTransfering(true);
                  let acc: any = AccountIdentifier.fromPrincipal({
                    principal: Principal.fromText(values.destination),
                    // subAccount: identity.getPrincipal(),
                  });
                  const ledgerActor = makeLedgerCanister({
                    agentOptions: {
                      identity,
                    },
                  });
                  let transfer = await ledgerActor.transfer({
                    to: acc.bytes,
                    fee: { e8s: GAS_FEE },
                    memo: 1,
                    amount: { e8s: values.amount * E8S },
                    from_subaccount: [],
                    created_at_time: [],
                  });

                  if (transfer.Ok) {
                    // setIsArticleDraft(false );
                    setIsTransfering(false);
                    handleClose();
                    toast.success(t('Transfer Successfull'));
                    getBalance();
                    getTokenBalance();
                    // setConfirmTransaction(false);
                  } else if (transfer.Err) {
                    toast.success(t('Error During Transaction'));

                    setIsTransfering(false);
                  }
                } catch (err) {}

                // setConfirmTransaction(true);
                // formikRef.current?.handleSubmit();
                // await uploadEntry(values, actions);
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
                <FormikForm
                  className='flex w-full flex-col items-center justify-center'
                  // onChange={(e) => handleImageChange(e)}
                >
                  <Field name='destination'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <div className='d-flex justify-content-between w-100'>
                          <Form.Label>{t('Destination')}</Form.Label>
                        </div>

                        <Form.Control
                          type='text'
                          placeholder={t('Destination')}
                          value={field.value}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name='destination'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='destination'
                      component='div'
                    />
                  </div>
                  <Field name='amount'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <div className='d-flex justify-content-between w-100'>
                          <Form.Label>{t('Amount')}</Form.Label>
                        </div>

                        <Form.Control
                          type='number'
                          placeholder={t('Amount')}
                          value={field.value}
                          onInput={handleBlur}
                          onChange={handleChange}
                          name='amount'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='amount'
                      component='div'
                    />
                  </div>
                  <div className='mt-3'>
                    <p className='m-0'>{t('Transaction Fee')} </p>
                    <p className='m-0'> {gasFeeICP}0000 ICP</p>
                  </div>
                  <div className='d-flex justify-content-end gap-4'>
                    <Button
                      className='publish-btn'
                      disabled={isTransfering}
                      onClick={handleClose}
                    >
                      {t('Cancel')}
                    </Button>
                    <Button
                      className='publish-btn'
                      disabled={isTransfering || !(isValid && dirty)}
                      type='submit'
                    >
                      {isTransfering ? <Spinner size='sm' /> : t('Transfer')}
                    </Button>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={handleClose}>Cancel</Button>
        </Modal.Footer> */}
      </Modal>
      <Modal
        centered
        show={showTokenModle}
        onHide={handleCloseTokenModle}
        onClose={handleCloseTokenModle}
      >
        <Modal.Header closeButton className=''>
          {t('Transfer Tokens')}
        </Modal.Header>
        <Modal.Body>
          <div className=''>
            <Formik
              initialValues={initialTransferValues}
              // innerRef={formikRef}
              // enableReinitialize
              validationSchema={tokensTransferSchema}
              onSubmit={async (values, actions) => {
                // setPromotionValues({
                //   icp: values.ICP,
                //   // likes: values.likesCount,
                // });
                if (!identity) {
                  return;
                }
                try {
                  setIsTransfering(true);

                  let principal = Principal.fromText(values.destination);

                  const tokenActor = makeTokenCanister({
                    agentOptions: {
                      identity,
                    },
                  });
                  let amount = Math.round(values.amount);
                  const record = {
                    to: {
                      owner: principal,
                      subaccount: [],
                    },
                    amount: amount,
                    created_at_time: [],
                    from_subaccount: [],
                    fee: [],
                    memo: [],
                  };
                  let transfer = await tokenActor.icrc1_transfer(record);
                  if (transfer.hasOwnProperty('Ok')) {
                    setIsTransfering(false);
                    handleCloseTokenModle();
                    toast.success(t('Transfer Successfull'));
                    getTokenBalance();
                  } else if (transfer.Err) {
                    toast.success(t('Error During Transaction'));
                    setIsTransfering(false);
                  } else {
                  }
                } catch (err) {}
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
                  <Field name='destination'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <div className='d-flex justify-content-between w-100'>
                          <Form.Label>{t('Destination')}</Form.Label>
                        </div>

                        <Form.Control
                          type='text'
                          placeholder={t('Destination')}
                          value={field.value}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          name='destination'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='destination'
                      component='div'
                    />
                  </div>
                  <Field name='amount'>
                    {({ field, formProps }: any) => (
                      <Form.Group
                        className='mb-2'
                        controlId='exampleForm.ControlInput1'
                      >
                        <div className='d-flex justify-content-between w-100'>
                          <Form.Label>{t('Amount')}</Form.Label>
                        </div>

                        <Form.Control
                          type='number'
                          placeholder={t('Amount')}
                          value={field.value}
                          onInput={handleBlur}
                          onChange={handleChange}
                          name='amount'
                        />
                      </Form.Group>
                    )}
                  </Field>
                  <div className='text-danger mb-2'>
                    <ErrorMessage
                      className='Mui-err'
                      name='amount'
                      component='div'
                    />
                  </div>
                  <div className='d-flex justify-content-end gap-4'>
                    <Button
                      className='publish-btn'
                      disabled={isTransfering}
                      onClick={handleCloseTokenModle}
                    >
                      {t('Cancel')}
                    </Button>
                    <Button
                      className='publish-btn'
                      disabled={isTransfering || !(isValid && dirty)}
                      type='submit'
                    >
                      {isTransfering ? <Spinner size='sm' /> : t('Transfer')}
                    </Button>
                  </div>
                </FormikForm>
              )}
            </Formik>
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
