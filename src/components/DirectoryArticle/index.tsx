'use client';
import { useState } from 'react';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';
import Tippy from '@tippyjs/react';
import post1 from '@/assets/Img/Posts/small-post-10.png';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import AddCompanyForm from '@/components/addCompanyForm/AddCompanyForm';
import logger from '@/lib/logger';
import { openLink } from '@/components/utils/localStorage';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import axios from 'axios';
import { usePathname } from 'next/navigation'
import { DIRECTORY_DINAMIC_PATH, DIRECTORY_STATIC_PATH } from '@/constant/routes';
export default function DirectoryArticle({
  article,
  handleRefetch,
}: {
  article: any;
  handleRefetch: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [action, setAction] = useState({
    status: true,
    id: '',
    userName: '',
    userId: '',
    isEdit: false,
    isDel: false,
    title: '',
    email: '',
  });
  const [approving, setApproving] = useState(false);
  const router = useRouter();
  const [showWeb3Model, setShowWeb3Model] = useState(false);
  const [directoryId, setDirectoryId] = useState(null);
  const [isError, setIsError] = useState(false);

  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
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
  let status =
    Object.keys(article[1].status)[0] == 'verfied' ? 'Verified' : 'Unverified';

  const handelEditmodel = () => {
    setShowWeb3Model(true);
  };
  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setApproving(false);
    setDirectoryId(null);
  };
  let handleWeb3modelclose = () => {
    setShowModal(false);
    setApproving(false);
    setDirectoryId(null);

    // setShowWeb3Model(false)
  };
  const handleApprove = async (
    id: any,
    rejected: boolean,
    username?: string,
    reason?: string
  ) => {
    setApproving(true);
    const entryActorDefault = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const approved = await entryActorDefault.verifyWeb3(
      action.id,
      userCanisterId,
      commentCanisterId,
      action.status
    );
    if (approved.ok) {
      if (action.status) {
        if (action.email != undefined) {
          try {
            let tempPath = window.location.origin;

            const response = await axios.post(
              `${process.env.BASE_URL}email/web3Verfication`,
              {
                email: action.email,
                name: action.userName,
                articleTitle: action.title,
                baseUrl: tempPath,
              }
            );
            if (response) {
              toast.success('Email has been sent to user.');

              // toast.success(response);
            }
          } catch (error) {
            // logger(error,"sdfsdfdfsaf")
            toast.error('There was an issue while sending email');
          }
        }
        toast.success(t('Web3 directory verify successfully.'));
      } else {

        toast.success(t('Web3 directory Unverify successfully.'));
      }
      handleClose();
      handleRefetch();
    } else {
      toast.error(t('Error while approving Web3 directory.'));
    }
    setApproving(false);
  };
  const handleDelete = async (
    id: any,
    rejected: boolean,
    username?: string,
    reason?: string
  ) => {
    setApproving(true);
    const entryActorDefault = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const approved = await entryActorDefault.delete_web3(
      action.id,
      userCanisterId,
      commentCanisterId
    );
    if (approved.ok) {
      if (action.isDel) {
        if (action.email != undefined) {
          try {
            let tempPath = window.location.origin;

            const response = await axios.post(
              `${process.env.BASE_URL}email/web3Rejection`,
              {
                email: action.email,
                name: action.userName,
                articleTitle: action.title,
                baseUrl: tempPath,
                reason: rejectReason
              }
            );
            if (response) {
              toast.success('Email has been sent to user.');

              // toast.success(response);
            }
          } catch (error) {
            // logger(error,"sadfdsffdsf")
            toast.error('There was an issue while sending email');
          }
        }
        toast.success('Web3 directory deleted successfully.');
      } else {
        toast.success('Web3 directory deleted successfully.');
      }
      handleClose();
      handleRefetch();
    } else {
      toast.error('Error while deleting Web3 directory.');
    }
    setApproving(false);
  };
  let reFetchfn = () => {
    handleClose();
    handleRefetch();
  };

  return (
    <>
      <tr>
        <td>
          <Link href={'#'} className='removeUl'>
            <div className='d-flex align-items-start'>
              <div className='item-menu mt-1'>
                {' '}
                {article[1].companyLogo ? (
                  <div
                    style={{
                      minWidth: 89,
                      height: 46,
                      position: 'relative',
                      marginRight: 10,
                    }}
                  >
                    <Image
                      src={article[1].companyLogo}
                      fill
                      sizes='(max-width: 2000px) 89px,46px'
                      alt='Post'
                    />
                  </div>
                ) : (
                  <Image src={post1} alt='Post' />
                )}
                <div className='item-menu mt-1'>
                  <Button
                    className='removeUl text-primary'
                    onClick={() => {
                      handleShow();
                      logger(article[1]?.email, 'adfdsafsadfsdaf');
                      setAction({
                        status: true,
                        id: article[0],
                        isEdit: true,
                        userName: article[1].founderName,
                        userId: article[1].user.toString(),
                        isDel: false,
                        title: article[1].company,
                        email: article[1]?.email,
                      });
                    }}
                  >
                    {'Edit'}{' '}
                  </Button>
                  <span>|</span>
                  <Button
                    onClick={() => {
                      openLink(article[1].isStatic ? `${DIRECTORY_STATIC_PATH + article[0]}` : `${DIRECTORY_DINAMIC_PATH+article[0]}`)
                    }}
                    className='removeUl text-primary'
                  >
                    {t('View')}
                  </Button>
                  <span>|</span>
                  <Button
                    onClick={() => {
                      handleShow();
                      setAction({
                        status: true,
                        id: article[0],
                        isEdit: false,
                        userName: article[1].founderName,
                        userId: article[1].user.toString(),
                        isDel: true,
                        title: article[1].company,
                        email: article[1]?.email,
                      });
                    }}
                    className='removeUl text-danger'
                  >
                    {t('Delete')}
                  </Button>
                
                 
                </div>
              </div>

              <p
                style={{ maxWidth: 480 }}
                onClick={() => openLink(article[1].isStatic ? `${DIRECTORY_STATIC_PATH + article[0]}` : `${DIRECTORY_DINAMIC_PATH+article[0]}`)}
              >
                {article[1].company.slice(0, 30)}
                {article[1].company.length > 30 && '...'}{' '}
              </p>
            </div>
          </Link>
        </td>
        <td>
          <Link href='#' target='_blank' className='removeUl disabled-link'>
            <p>{article[1].founderName}</p>
          </Link>
        </td>
        <td>
          <Tippy content={article[1].catagory}>
            <p
              className='d-inline-block'
              onClick={() =>
                router.push(
                  `/category-details?category=${article[1].catagoryId}`
                )
              }
              style={{ cursor: 'pointer' }}
            >
              {article[1].catagory}
            </p>
          </Tippy>
        </td>
        <td className='text-center'>
          {status == 'Unverified' ? (
            <ul className='btn-list'>
              <li>
                <Button
                  onClick={() => {
                    setAction({
                      status: true,
                      id: article[0],
                      userName: article[1].founderName,
                      userId: article[1].user.toString(),
                      isEdit: false,
                      isDel: false,
                      title: article[1].company,
                      email: article[1]?.email,
                    });

                    handleShow();
                  }}
                  className='green'
                >
                  {t('Verify')}
                </Button>
              </li>
            </ul>
          ) : (
            <ul className='btn-list'>
              <li>
                <span className='green ps-0'>{t('Verified')}</span>
              </li>
            </ul>
          )}
        </td>
      </tr>
      <Modal
        show={showModal}
        // size='md'
        centered
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <h3 className='text-center'>
            {action.isEdit
              ? 'Edit'
              : action.isDel
                ? 'Delete'
                : action.status
                  ? 'Verify'
                  : 'Unverify'}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <p>
            {t('Are you sure you want to')}{' '}
            {action.isEdit ? t("edit") : action.isDel ? t('delete') : action.status ? t('verify') : t('unverify')}{' '}
            {t('this Web3 directory?')}

          </p>
          {action.isDel && (
            <>
              <Form.Group
                className='mb-3'
                controlId='exampleForm.ControlTextarea1'
              >
                <Form.Label>

                  Reason to delete the Web3 directory.


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
            onClick={(e) => {
              if (action.isDel) {

                setIsError(false);
                if (rejectReason.length < 20) {
                  setIsError(true);
                  return;
                } else if (rejectReason.length > 2000) {
                  setIsError(true);
                  return;
                }

                handleDelete(action.id, action.status, action.userName);
              } else if (action.isEdit) {
                setApproving(true);
                setDirectoryId(article[0]);

                logger(article[0], 'adsfsadfsa32234');
                // handelEditmodel()
              } else {
                handleApprove(action.id, action.status, action.userName);
              }
            }}
          >
            {approving ? (
              <Spinner size='sm' />
            ) : action.isEdit ? "Edit" : action.isDel ? (
              t('Delete')
            ) : action.status ? (
              t('Verify')
            ) : (
              t('Unverify')
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
      {directoryId && <AddCompanyForm
        showWeb3Model={showWeb3Model}
        setShowWeb3Model={setShowWeb3Model}
        directoryId={directoryId}
        reFetchfn={reFetchfn}
        handleWeb3modelclose={handleWeb3modelclose}
      />}
    </>
  );
}
