'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Row, Col, Spinner, Form, Button, Modal } from 'react-bootstrap';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  makeEntryActor,
  makeLedgerCanister,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { ConnectPlugWalletSlice } from '@/types/store';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import useLocalization from '@/lib/UseLocalization';
import { canisterId as entryCanisterId } from '@/dfx/declarations/entry';
import { LANG } from '@/constant/language';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikProps,
  FormikValues,
} from 'formik';
import {  number, object } from 'yup';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import { Principal } from '@dfinity/principal';
import { E8S, GAS_FEE } from '@/constant/config';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import updateBalance from '@/components/utils/updateBalance';
import updateTokensBalance from '@/components/utils/updateTokensBalance';
import axios from 'axios';
import { debounce } from '@/lib/utils';
import { MAXDOLLAR } from '@/constant/sizes';
  /**

BuyNFTStudio24Tokens page use to Buy NFTStudio24 Tokens allow user to enter tokens amount and show tokens price in ICP  

@param null
@returns  render page
*/
export default function BuyNFTStudio24Tokens() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [oneNftCoin, setOneNftCoin] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tokensAmount, setTokensAmount] = useState(0);
  const [IcpRate, setIcpRate] = useState(0);
  const location = usePathname();
  let gasFee = GAS_FEE / E8S;
  const { auth, userAuth, identity,setBalance , tokenSymbol , setTokensBalance} = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth, 
    tokenSymbol:(state as ConnectPlugWalletSlice).tokenSymbol, 
    identity: (state as ConnectPlugWalletSlice).identity,
    setTokensBalance:state.setTokensBalance,
    setBalance: state.setBalance,


  }));

  const { t, changeLocale } = useLocalization(LANG);

  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const pathname = usePathname();
  const feeValues = {
    userId: '',
    amount: '',
  };
    /**

function handleModalClose use to close the react bootstrape model

@param null
@returns Bool
*/
  const handleModalClose = () => {
    if (isSubmitting) {
      return false;
    }
    setShowModal(false);
  };
  const feeSchema = object().shape({
    amount: number()
      .min(1, t("Dollar amount is required"))
      .required(t("Dollar amount is required"))
      .max(MAXDOLLAR, t(`Dollar value cannot be greater than ${MAXDOLLAR}`))
   
      
    // Add a custom test to check the sum
  });
  let entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
 
  const sendReward = async (val: any) => {
    setTokensAmount(val.amount)
    setShowModal(true);
  };
        /**

function handleTransaction to approve icp token form user

@param approvingPromotionE8S
@returns null
*/
  const handlePromote = async (approvingPromotionE8S:number) => {
 
    entryActor
      .buyNFTStudio24Tokens(userCanisterId,approvingPromotionE8S,tokensAmount)
      .then((res: any) => {
        toast.success(t('Your article has been promoted successfuly'));
        updateTokensBalance({ identity, auth, setTokensBalance });
        updateBalance({ identity, auth, setBalance });

        setIsSubmitting(false);
     
        handleModalClose();
      })
      .catch((err: string) => {
        setIsSubmitting(false);
      });
  };
      /**

function requiredIE8Sfn use to get requiredE8S value of icp

@param null
@returns if error then return error else null
*/
  function requiredIE8Sfn(promotion:number,gasInE8s:number) {
   return promotion*E8S + (gasInE8s*2);
  }
      /**

function handleTransaction to give allownce icp token form user

@param null
@returns if error then return error else null
*/
  const handleTransaction = async () => {

    try {
      setIsSubmitting(true);
 
      let ledgerActor = await makeLedgerCanister({
        agentOptions: {
          identity,
        },
      });
      let acc: any = AccountIdentifier.fromPrincipal({
        principal: identity.getPrincipal(),
        // subAccount: identity.getPrincipal(),
      });

      let balance = await ledgerActor.account_balance({
        account: acc.bytes,
      });

      // let promotedICP = (reward / 100) * promotionValues.icp;
      // let promotionE8S = (tokensAmount/oneNftCoin) * E8S;
      let promotion=(1/IcpRate)*tokensAmount
      let balanceICP = parseInt(balance.e8s) / E8S;
      let gasInE8s = GAS_FEE;

  
      let requiredIE8S = requiredIE8Sfn(promotion,gasInE8s);

      let approvingPromotionE8S = Math.trunc(promotion*E8S + gasInE8s)

      if (balance.e8s < requiredIE8S) {
        // setConfirmTransaction(false);
        setIsSubmitting(false);
        return toast.error(
          `${t(
            'Insufficient balance to Blockza tokens. Current Balance'
          )} ${balanceICP} ${t(
            t('please transfer assets to your wallet to buy Blockza tokens.')
          )}`
        );
      }

      if (!entryCanisterId) return toast.error(t('Error in transaction'));
      let entryPrincipal = Principal.fromText(entryCanisterId);

      let approval = await ledgerActor.icrc2_approve({
        amount: approvingPromotionE8S,
        spender: {
          owner: entryPrincipal,
          subaccount: [],
        },
        fee: [GAS_FEE],
        memo: [],
        from_subaccount: [],
        created_at_time: [],
        expected_allowance: [],
        expires_at: [],
      });
      logger(approval,"approvalapproval")
      if (approval.Ok) {
        logger({approval},"approvalapprovalok")
        setTimeout(() => {
          handlePromote(approvingPromotionE8S);
        }, 100);
      }
    } catch (e) {
      setIsSubmitting(false);
    }
  };
 
  const oneNftstudioCoin = async () => {
    const oneCoinVal = await userActor.get_NFT24Coin();
    let tokensInOneIcp = Number(oneCoinVal);
    setOneNftCoin(tokensInOneIcp);
  };
  
 async  function getRateOfIcp() {    
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd`,
  );
  logger(response,"response")

  if(response?.status ==200){
    setIcpRate(response?.data?.["internet-computer"]?.usd)
    // return response?.data?.["internet-computer"]?.usd
  }
    
  }
  const debouncedFetchResults = useCallback(debounce(getRateOfIcp, 500), []);

  useEffect(() => {
    if (auth.state === 'initialized') {
      oneNftstudioCoin();
      debouncedFetchResults()
    } else if (auth.state === 'anonymous') {
      router.replace('/');
    }
  }, [userAuth, auth, pathname]);
  useEffect(() => {
    if (location.startsWith("/buy-tokens") && !location.endsWith('/')) {
     router.push(`/buy-tokens/`);
   }
     }, [])
  return (
    <>
      <main id='main' className='dark'>
        <div className='main-inner admin-main'>
          <div className='section admin-inner-pnl' id='top'>
            <Row>
              <Col xl='12' lg='12'>
                <div className=''>
                  <Row className='mb-5'>
                    <Col xl='8' lg='6' md='6'>
                      <h1>{t('Buy Tokens')}</h1>
                      
                      
                      <span>1$  ≈ {(1/IcpRate).toFixed(6)} ≈ {oneNftCoin} {tokenSymbol}</span>
                    </Col>
                  </Row>
                  <div>
                    <Formik
                      initialValues={feeValues}
                      validationSchema={feeSchema}
                      enableReinitialize
                      innerRef={formikRef}
                      onSubmit={async (values) => {
                        sendReward(values);
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
                          <Row>
                            <Col xl='3' lg='6' md='6'>
                              <Field name='amount'>
                                {({ field, formProps }: any) => (
                                  <Form.Group
                                    className='mb-3'
                                    controlId='formBasicEmail'
                                  >
                                    <Form.Label>
                                      {t('Dollar Amount')}
                                      <Tippy
                                        content={
                                          <div>
                                            <p className='mb-0'>
                                            {t("Enter amount in dollar")}
                                        
                                            </p>
                                          </div>
                                        }
                                      >
                                        <span className='ps-1'>
                                          <i className='fa fa-circle-info'/>
                                        </span>
                                      </Tippy>
                                    </Form.Label>
                                    <Form.Control
                                      value={field.value}
                                      onChange={handleChange}
                                      onInput={handleBlur}
                                      type='number'
                                      name='amount'
                                      placeholder={t("Enter amount in dollar")}
                                    />
                                  </Form.Group>
                                )}
                              </Field>
                              <div
                                style={{ height: 35 }}
                                className='text-danger mt-2'
                              >
                                <ErrorMessage
                                  className='Mui-err'
                                  name='amount'
                                  component='div'
                                />
                              </div>
                            </Col>
                            <Row>
                              <Col xs='4'>
                                <Button
                                  disabled={isLoading}
                                  className='publish-btn'
                                  type='submit'
                                >
                                  {isLoading ? <Spinner size='sm' /> : 'Apply'}
                                </Button>
                              </Col>
                            </Row>
                          </Row>
                        </FormikForm>
                      )}
                    </Formik>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </main>
      <Modal show={showModal} centered onHide={handleModalClose}>
        <Modal.Body>
          <div className='flex-div connect-heading-pnl mb-3'>
            {/* <i className='fa fa-question-circle-o'></i> */}
            <p></p>
            <p className='text-bold h5 fw-bold m-0'>
              {t('Confirm Transaction')}
            </p>
            {/* <i onClick={handleModalClose} className='fa fa-close'></i> */}
            <i
              style={{
                cursor: 'pointer',
              }}
              onClick={handleModalClose}
              className='fa fa-close'
            ></i>
            {/* <Button
          className='close-btn'
        ></Button> */}
          </div>
          <div>
            <p className='text-secondary'>
              Are you sure you want to buy {tokensAmount*oneNftCoin} tokens with{' '}
              {(((1/IcpRate)*tokensAmount)+ ((GAS_FEE * 2) / E8S)).toFixed(6)} {' '}
              {t('ICP')}?
            </p>
            <p className=' d-flex  justify-content-between mb-0'>
              <span>{t('Original amount')}</span>{' '}
              <span className='text-secondary'>
                {((1/IcpRate)*tokensAmount).toFixed(6)} ICP
              </span>
            </p>
            <p className='d-flex justify-content-between mb-1'>
              {/* <span
                    style={{
                      border: '2px',
                    }}
                  > */}
              <span>{t('Transaction fee:')}</span>{' '}
              <span className='text-secondary'>
                { ((GAS_FEE * 2) / E8S)} ICP
              </span>
              {/* </span> */}
            </p>
            <div
              style={{
                height: 1,
                backgroundColor: 'gray',
                width: '100%',
              }}
            ></div>
            <p className=' d-flex justify-content-between mt-1 mb-0'>
              <span> </span>{' '}
              <span className='text-secondary'>
              {(((1/IcpRate)*tokensAmount)+ ((GAS_FEE * 2) / E8S)).toFixed(6)}{' '}
                ICP
              </span>
            </p>
          </div>
          <div className='d-flex justify-content-center mt-2'>
            <Button
              className='publish-btn w-100 mt-2 py-2'
              disabled={isSubmitting}
              onClick={handleTransaction}
              // type='submit'
            >
              {isSubmitting ? <Spinner size='sm' /> : t('Confirm')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
