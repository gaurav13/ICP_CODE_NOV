import React, { useState } from 'react';
import { Button, Col, Form, Modal, Spinner, Table } from 'react-bootstrap';
import Image from 'next/image';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { utcToLocal, utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { ListUser } from '@/types/profile';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { toast } from 'react-toastify';
import instance from '@/components/axios';
import axios from 'axios';
import { ID_CARD_Aspect, profileAspect } from '@/constant/sizes';
import placeholder from '@/assets/Img/id-placeholder.png';
import { openLink } from '@/components/utils/localStorage';
import { classNames } from 'react-easy-crop/helpers';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { USER_ACTIVITES_DASHBOARD } from '@/constant/routes';
export function UsersList({
  currentItems,
  handleRefetch,
  isVerificationList,
}: {
  currentItems: any[];
  handleRefetch: () => void;
  isVerificationList?: boolean;
}) {
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState({
    status: true,
    id: '',
    name: '',
    isverify: false,
    verifyStatus: false,
    email: '',
    image: null,
  });
  const [approving, setApproving] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isError, setIsError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const [buttonClassName, setButtonClassName] = useState('');

  const handleButtonClick = (className: React.SetStateAction<string>) => {
    setButtonClassName(className);
  };

  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));

  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  const router = useRouter();

  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setImageLoading(true)
  };
  const handleBlock = async () => {
    setApproving(true);
    if (action.status) {
      const blocked = await userActor.block_user(action.id, commentCanisterId);
      if (blocked.ok) {
        handleRefetch();
        toast.success(blocked.ok[0]);

        handleClose();
      } else {
        toast.error(blocked.err);
      }
    } else {
      const unblocked = await userActor.unBlock_user(
        action.id,
        commentCanisterId
      );
      if (unblocked.ok) {
        handleRefetch();
        toast.success(unblocked.ok[0]);

        handleClose();
      } else {
        toast.error(unblocked.err);
      }
    }
    setApproving(false);
  };
  let handleImageLoaded=()=>{
    setImageLoading(false)
  }
  const handleVerifyUser = async () => {
    setApproving(true);
    if (action.verifyStatus) {
      const blocked = await userActor.verify_user(action.id, commentCanisterId);
      if (blocked?.ok) {
        if (action?.email != undefined) {
          try {
            let tempPath = window.location.origin;
            const response = await axios.post(
              `${process.env.BASE_URL}email/userverification`,
              {
                email: action.email,
                name: action.name,
                baseUrl: tempPath,
              }
            );
            if (response) {
              toast.success('Email has been sent to user.');
            }
          } catch (error) {
            toast.error(t('There was an issue while sending email'));
          }
        }
        handleRefetch();
        toast.success(blocked?.ok[0]);
        handleClose();
      } else {
        toast.error(blocked?.err);
      }
    } else {
      const unblocked = await userActor.un_verify_user(
        action.id,
        commentCanisterId
      );
      if (unblocked?.ok) {
        if (action.email != undefined) {
          try {
            let tempPath = window.location.origin;

            const response = await axios.post(
              `${process.env.BASE_URL}email/userUnverification`,
              {
                email: action.email,
                name: action.name,
                reason: rejectReason,
                baseUrl: tempPath,
              }
            );
            if (response) {
              toast.success('Email has been sent to user.');

              // toast.success(response);
            }
          } catch (error) {
            toast.error(t('There was an issue while sending email'));
          }
        }
        handleRefetch();
        if (buttonClassName === 'reject') {
          // toast.success(unblocked?.ok[0]);
          toast.success(t('User Rejected'));
        } else {
          toast(t('User Unverified'));
        }

        handleClose();
      } else {
        toast.error(unblocked?.err);
      }
    }
    setApproving(false);
  };
  // const tooltipRef = useRef<HTMLDivElement | null>(null);
  // const boxRef = useRef<HTMLDivElement | null>(null);
  // const [showTip, setShowTip] = useState(false);

  // const { styles, attributes } = usePopper(boxRef.current, tooltipRef.current);
  const { t, changeLocale } = useLocalization(LANG);
  /**
   * copyPrincipal use to copy the string
   * @param id 
   */
  const copyPrincipal = (id:string) => {
    window.navigator.clipboard.writeText(id);
    toast.success(t('Address copied to clipboard'), { autoClose: 1000 });
  };
  return (
    <>
      <Col xl='12' lg='12'>
        <div className='full-div'>
          <div className='table-container lg'>
            <div className='table-inner-container'>
              <Table striped hover className='article-table'>
                <thead>
                  <tr>
                    <th>
                      <p>{t('name')}</p>
                    </th>
                    <th>
                      <p>Email</p>
                    </th>
                    <th>
                      <p>Wallet Address</p>
                    </th>
                    <th>
                      <p>
                        Joining Date{' '}
                        <Image className='arw' src={arrows} alt='arrow' />
                      </p>
                    </th>
                    {!isVerificationList && <>
                    <th >
                      <p>Claimed Reward</p>
                    </th>
                    <th >
                      <p>unClaimed Reward</p>
                    </th>
                    <th >
                      <p>Tokens</p>
                    </th></>}
                    <th className='d-flex align-items-center justify-content-center'>
                      <p>Action</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((user: ListUser) => (
                    <tr>
                      <td>
                        <div className='userListActivitybtn'>

                        
                        <div
                          className='d-inline-flex align-items-start'
                          style={{ cursor: 'pointer' }}
                          onClick={()=>{
                            router.push(`/profile/?userId=${user[0]}`)
                          }}
                        >
                          {user[1].name[0] ?? ''}
                        </div>
                        <Link href={`${USER_ACTIVITES_DASHBOARD}?userId=${user[0]}`}>View Activities</Link>
                        </div>
                      </td>
                      <td>{user[1].email[0] ?? 'no email'}</td>
                      <td>{user[0]?.slice(0,10)}...{user[0]?.slice(-10)}   <i
                          onClick={()=>copyPrincipal(user[0])}
                          className='fa fa-lg fa-copy '
                          style={{
                            cursor: 'pointer',
                            fontSize: 15,
                            color: 'black',
                          }}
                        /></td>
                      <td>
                        {utcToLocalAdmin(
                          user[1].joinedFrom.toString(),
                          'DD-MM-YYYY'
                        )}
                      </td>
{!isVerificationList && <>
  <td><div className='d-flex align-items-center justify-content-center'>{user[1]?.claimedReward ?? '0'}</div></td>
  <td><div className='d-flex align-items-center justify-content-center'>{user[1]?.unclaimedReward ?? '0'}</div></td>
  <td><div className='d-flex align-items-center justify-content-center'>{user[1]?.tokens ?? '0'}</div></td>




</>}

                      {isVerificationList ? (
                        <td className='text-center'>
                          <ul className='btn-list d-flex justify-content-center'>
                            {!user[1]?.isVerified ? ( //here is unverify user list
                              <>
                                <li className='me-0'>
                                  <Button
                                    onClick={() => {
                                      setAction({
                                        status: false,
                                        id: user[0],
                                        name: user[1].name[0],
                                        isverify: true,
                                        verifyStatus: true,
                                        email: user[1]?.email[0],
                                        image: user[1]?.identificationImage[0],
                                      });
                                      handleShow();
                                      handleButtonClick('verify');
                                    }}
                                    className='green verify'
                                  >
                                    Verify
                                  </Button>
                                </li>
                                <li className='me-0'>
                                  <Button
                                    onClick={() => {
                                      setAction({
                                        status: false,
                                        id: user[0],
                                        name: user[1].name[0],
                                        isverify: true,
                                        verifyStatus: false,
                                        email: user[1]?.email[0],
                                        image: user[1]?.identificationImage[0],
                                      });
                                      handleShow();
                                      handleButtonClick('reject');
                                    }}
                                    className='red reject'
                                  >
                                    Reject
                                  </Button>
                                </li>
                              </>
                            ) : (
                              <li className='me-0'>
                                <Button
                                  onClick={() => {
                                    setAction({
                                      status: false,
                                      id: user[0],
                                      name: user[1].name[0],
                                      isverify: true,
                                      verifyStatus: false,
                                      email: user[1]?.email[0],
                                      image: user[1]?.identificationImage[0],
                                    });
                                    handleShow();
                                    handleButtonClick('unverify');
                                  }}
                                  className='red unverify'
                                >
                                  unverify
                                </Button>
                              </li>
                            )}
                          </ul>
                        </td>
                      ) : (
                        <td className=''>
                          <ul>

                            {user[1].isBlocked ? (
                              <i
                                className='fa fa-unlock ms-3'
                                style={{
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  setAction({
                                    status: false,
                                    id: user[0],
                                    name: user[1].name[0],
                                    isverify: false,
                                    verifyStatus: false,
                                    email: user[1]?.email[0],
                                    image: null,
                                  });
                                  handleShow();
                                }}
                              />
                            ) : (
                              <i
                                className='fa fa-ban ms-3'
                                style={{
                                  cursor: 'pointer',
                                }}
                                onClick={() => {
                                  setAction({
                                    status: true,
                                    id: user[0],
                                    name: user[1].name[0],
                                    isverify: false,
                                    verifyStatus: false,
                                    email: user[1]?.email[0],
                                    image: null,
                                  });
                                  handleShow();
                                }}
                              />
                            )}
                            <i
                              className='fa fa-pencil ms-3'
                              style={{
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                openLink(`/profile-details?userId=${user[0]}`);
                              }}
                            />
                          </ul>
                        </td>
                      )}
                    </tr>
                  ))}
                  <Modal
                    show={showModal}
                    // size='md'
                    centered
                    onHide={handleClose}
                  >
                    <Modal.Header closeButton>
                      <h3 className='text-center'>
                        {/* {buttonClassName === "reject"
                          ? action.isverify
                            ? action.verifyStatus
                              ? 'Verify'
                              : 'Reject'
                            : action.status
                              ? 'Block'
                              : 'UnBlock'
                          : buttonClassName === "unverify"
                            ? action.isverify
                              ? action.verifyStatus
                                ? 'Verify'
                                : 'Unverify'
                              : action.status
                                ? 'Block'
                                : 'UnBlock'
                                  :''} */}

                        {action.isverify
                          ? action.verifyStatus
                            ? 'Verify'
                            : buttonClassName === 'unverify'
                            ? 'Unverify'
                            : 'Reject'
                          : action.status
                          ? 'Block'
                          : 'UnBlock'}

                        {/* {action.isverify
                          ? action.verifyStatus
                            ? 'Verify'
                            : 'Unverify'
                          : action.status
                            ? 'Block'
                            : 'UnBlock'} */}
                      </h3>
                    </Modal.Header>
                    <Modal.Body>
                      <p>
                        {t('Are you sure you want to')}{' '}
                        {/* {buttonClassName === "reject"
                          ? action.isverify
                            ? action.verifyStatus
                              ? 'Verify'
                              : 'Reject'
                            : action.status
                              ? 'Block'
                              : 'UnBlock'
                          : buttonClassName === "unverify"
                            ? action.isverify
                              ? action.verifyStatus
                                ? 'Verify'
                                : 'Unverify'
                              : action.status
                                ? 'Block'
                                : 'UnBlock'
                                : buttonClassName === "verify"
                                ? action.isverify
                                  ? action.verifyStatus
                                    ? 'Verify'
                                    : 'UnVerify'
                                  : action.status
                                    ? 'Block'
                                    : 'UnBlock'
                                  :''} */}
                        {action.isverify
                          ? action.verifyStatus
                            ? t('Verify')
                            : buttonClassName === 'unverify'
                            ? t('Unverify')
                            : t('Reject')
                          : action.status
                          ? t('Block')
                          : t('UnBlock')}{' '}
                        {/* {action.isverify
                          ? action.verifyStatus
                            ? 'Verify'
                            : 'Reject'
                          : action.status
                            ? 'Block'
                            : 'UnBlock'}{' '} */}
                        {action.name}?
                      </p>
                      {action.isverify && (
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
                                aspectRatio: ID_CARD_Aspect,
                              }}
                            >
{imageLoading && <Image
                                  src={placeholder}
                                  alt='Banner'
                                  fill={true}
                                />}
                            {action?.image? <Image
                                  fill={true}
                                  className='h'
                                  src={action?.image}
                                  alt='Banner'
                                  onLoad={handleImageLoaded}
                                />:<Image
                                src={placeholder}
                                alt='Banner'
                                fill={true}
                              />
                              
                              
                              }
                            </div>
                          </div>
                        </div>
                      )}
                      {action.isverify && !action.verifyStatus && (
                        <>
                          <Form.Group
                            className='mb-3'
                            controlId='exampleForm.ControlTextarea1'
                          >
                            <Form.Label>
                              {buttonClassName === 'unverify'
                                ? 'Reason to unverify the user verification.'
                                : ' Reason to reject the user verification.'}
                            </Form.Label>
                            <Form.Control
                              as='textarea'
                              rows={2}
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                            />
                          </Form.Group>
                          <div className='text-danger mb-2'>
                            {rejectReason.length < 20 && isError && (
                              <p>Input must be at least 20 characters long.</p>
                            )}
                            {rejectReason.length > 2000 && isError && (
                              <p>
                                Input must be at least 2000 characters long.
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        className='publish-btn'
                        onClick={() => {
                          if (action.isverify) {
                            if (!action.verifyStatus) {
                              setIsError(false);
                              if (rejectReason.length < 20) {
                                setIsError(true);
                                return;
                              } else if (rejectReason.length > 2000) {
                                setIsError(true);
                                return;
                              }
                            }
                            handleVerifyUser();
                          } else {
                            handleBlock();
                          }
                        }}
                      >
                        {approving ? (
                          <Spinner size='sm' />
                        ) : action.isverify ? (
                          action.verifyStatus ? (
                            'Verify'
                          ) : buttonClassName === 'unverify' ? (
                            'Unverify'
                          ) : (
                            'Reject'
                          )
                        ) : action.status ? (
                          'Block'
                        ) : (
                          'UnBlock'
                        )}
                      </Button>
                      <Button
                        disabled={approving}
                        className='default-btn'
                        onClick={handleClose}
                      >
                        {t('Cancel')}
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
}
