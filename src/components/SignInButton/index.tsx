'use client';
import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import * as React from 'react';
import icpimage from '@/assets/Img/coin-image.png';
// import { Modal } from 'flowbite-react';
import { usePathname, useRouter } from 'next/navigation';
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
import { ConnectPlugWalletSlice, UserAuth } from '@/types/store';
import logger from '@/lib/logger';
import { canisterId as ledgerCanisterId } from '@/dfx/declarations/icp_ledger_canister';
import { makeLedgerCanister } from '@/dfx/service/actor-locator';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Tippy from '@tippyjs/react';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
  FormikHelpers,
} from 'formik';
import { E8S, GAS_FEE } from '@/constant/config';
import * as yup from 'yup';
import { number, object, string } from 'yup';
import instance from '@/components/axios';
import LoginForm from '@/components/LoginForm';
import SignInForm from '@/components/SignInForm';
import { STRONG_PASSWORD, STRONG_PASSWORD_SMS } from '@/constant/validations';
import { EMAIL_VALIDATE } from '@/constant/regulerExpression';

export default function SignInButton({
  hideRewards,
  hideUser,
  isPodcastLink
}: {
  hideRewards?: boolean;
  hideUser?: boolean;
  isPodcastLink?:boolean
}) {
  const storedIsTimerActive = localStorage.getItem('isTimerActive') === 'true';
  const storedRemainingTime =
    parseInt(localStorage.getItem('remainingTime') as string, 10) || 30;

  const [show, setShow] = React.useState<boolean | undefined>();
  const [isLoggin, setIsLoggin] = React.useState<boolean>(false);
  const [isRegistering, setIsRegistering] = React.useState<boolean>(false);
  const [isRegister, setisRegister] = React.useState(false);
  const [verify, setVerify] = React.useState(false);
  const [otpEmail, setOtpEmail] = React.useState<string | undefined>();
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isTimerActive, setIsTimerActive] = React.useState(storedIsTimerActive);
  const [remainingTime, setRemainingTime] = React.useState(storedRemainingTime);
  const { t, changeLocale } = useLocalization(LANG);
  const [userEmail , setUserEmail] = React.useState<string | undefined>(undefined)
  const [isSendingOtp, setIsSendingOtp] = React.useState(false);
  const token = localStorage.getItem('token');
  const email = localStorage.getItem("email")
  const pathname = usePathname();
  const { auth, emailConnected, setEmailConnected } = useConnectPlugWalletStore(
    (state) => ({
      auth: (state as ConnectPlugWalletSlice).auth,
      setEmailConnected: (state as ConnectPlugWalletSlice).setEmailConnected,
      emailConnected: (state as ConnectPlugWalletSlice).emailConnected,
    })
  );
  const router = useRouter();
  const location = usePathname();
  const signInValues = {
    email: '',
    password: '',
    confirm: '',
  };
  const signInSchema = object().shape({
    email: string()
      .required(t('Email is required'))
      .trim()
      .matches(
        EMAIL_VALIDATE,
        t('Invalid Email')
      ),
    password: string()
      .min(6, STRONG_PASSWORD_SMS)
      .required(t('Password is required'))
      .matches(STRONG_PASSWORD, STRONG_PASSWORD_SMS),
    confirm: string()
      .oneOf([yup.ref('password')], t('Passwords must match'))
      .required(t('Confirm password is required')),
  });
  const loginValues = {
    email: '',
    password: '',
  };
  const loginSchema = object().shape({
    email: string()
      .required(t('Email is required'))
      .trim()
      .matches(
        EMAIL_VALIDATE,
        t('Invalid Email')
      ),
    password: string()
      .min(6, t('Password must be at least 6 characters'))
      .required(t('Password is required')),
  });
  const otpValues = {
    otp: '',
  };

  const otpSchema = object().shape({
    otp: string()
      .required(t('OTP is required'))
      .trim()
      .matches(/^\d{6}$/, t('Invalid OTP')),
  });

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setIsLoggin(false);
    setIsRegistering(false);
    setisRegister(false);
    setVerify(false);
  };
  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem("email")
    setEmailConnected(false);
  };

  React.useEffect(() => {
    if (token && email) {

      setEmailConnected(true);
      setUserEmail(email !== null ? email : undefined);

    } else {
      setEmailConnected(false);
    }
  }, [token]);
  React.useEffect(() => {
    let timer: any;
    if (isTimerActive) {
      timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            setIsTimerActive(false);
            // setIsLoading(false);
            localStorage.setItem('isTimerActive', 'false');
            return 0;
          }
          localStorage.setItem('remainingTime', (prevTime - 1).toString());
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
      localStorage.removeItem('isTimerActive');
      localStorage.removeItem('remainingTime');
    };
  }, [isTimerActive]);
  return (
    <>
        {emailConnected ? (  
                              //  <Tippy
                              //         content={
                              //           <div>
                              //             <p className='mb-0'>
                              //             {userEmail}
                              //             </p>
                              //           </div>
                              //         }
                              //       >
                              //         <span className='ps-1'>
                              //           <i className='fa fa-circle-info' />
                              //         </span>
                              //       </Tippy>

                              <input type="text" value={userEmail} disabled
                                 className='me-2 d-none d-md-block'
                                   />
                                  ) :""}
      
      <Button
        className={isPodcastLink?"reg-btn big  signinbtninpodcast":`link-btn ${hideUser ? '' : ''} ${
          hideRewards ? 'hide-on-desktop' : ''
        }`}
        disabled={isLoggin}
        onClick={emailConnected ? logout : handleShow}
      >
       {emailConnected ? t('Sign out') : t('Sign In')}
      </Button>
      
    
      
      <Modal centered show={show} onHide={handleClose} onClose={handleClose}>
        <Modal.Header closeButton className=''>
          <h5 className='mb-0'>{isRegister ? t('Sign Up') : t('Sign In')}</h5>
        </Modal.Header>
        <Modal.Body>
          <div className=''>
            {isRegister ? (
              <SignInForm
                setisRegister={setisRegister}
                handleClose={handleClose}
                isRegister={isRegister}
              />
            ) : (
              <LoginForm
                setisRegister={setisRegister}
                handleClose={handleClose}
                isRegister={isRegister}
              />
            )}
          </div>
        </Modal.Body>
      </Modal>
      
      
    </>
  );
}
