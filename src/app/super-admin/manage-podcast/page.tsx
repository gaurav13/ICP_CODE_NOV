'use client';
import React, { useEffect, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Head from 'next/head';
import { Row, Col, Table, Form, Button, Spinner, Modal } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import post1 from '@/assets/Img/Posts/small-post-10.png';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { getImage } from '@/components/utils/getImage';
import { EntrySizeMap } from '@/types/dashboard';
import { ConnectPlugWalletSlice } from '@/types/store';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import Tippy from '@tippyjs/react';
import { toast } from 'react-toastify';
import PodcastSVG from '@/components/podcastSVG/Podcastsvg';
import { fromNullable } from '@dfinity/utils';
import { handleAdminDeleteEntry } from '@/components/utils/admindeleteEntry';
import { openLink } from '@/components/utils/localStorage';
import { sendArticleEmail } from '@/components/utils/sendemail';
import {
  ADD_QUIZ_ROUTE_ADMIN,
  ADD_QUIZ_ROUTE_USER,
  ADD_SURVEY_ROUTE_ADMIN,
  ADD_SURVEY_ROUTE_USER,
  ALL_ARTICLES,
  ALL_QUIZ_ROUTE_USER,
  Podcast_DINAMIC_PATH,
  Podcast_STATIC_PATH,
} from '@/constant/routes';

function Article({
  article,
  handleRefetch,
}: {
  article: any;
  handleRefetch: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  rejectReason;
  const [action, setAction] = useState({
    status: true,
    id: '',
    isDeleting: false,
    userName: '',
    userId: '',
  });
  const [approving, setApproving] = useState(false);
  const router = useRouter();
  const location = usePathname();
  const { t, changeLocale } = useLocalization(LANG);
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
  let status = Object.keys(article.status)[0];

  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
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
    const approved = await entryActorDefault.approvePodcast(
      commentCanisterId,
      userCanisterId,
      action.id,
      action.status
    );
    if (approved.ok) {
      if (action.status) {
        // toast.success('Article approved');
        sendEmail(approved.ok[1].title, false, username);
      } else {
        // toast.success('Article rejected');
        sendEmail(approved.ok[1].title, true, username, reason);
      }
      handleClose();
      handleRefetch();
    } else {
      toast.error('Error while approving Podcast');
    }
    setApproving(false);
  };
  // send email to user when his article is approved or rejeckted
  const handleAdminDelete = async () => {
    if (auth.state !== 'initialized') {
      return toast.error(
        'To perform this action, kindly connect to Internet Identity.'
      );
    }
    if (!userAuth.userPerms?.articleManagement) {
      return toast.error('Not Allowed');
    }
    const defaultEntryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let data = { id: action.id, commentCanisterId, userCanisterId };
    handleAdminDeleteEntry({
      defaultEntryActor,
      setDeleting: setApproving,
      refetchfn: handleRefetch,
      handleClose,
      data,
    });
  };
  async function sendEmail(
    title: any,
    rejected: boolean,
    username?: string,
    reason?: string
  ) {
    const user = await userActor.get_user_details([action.userId]);
    if (user.ok) {
      if (user.ok[1].email.length != 0) {
        let email = user.ok[1].email[0];
        if (rejected) {
          let res = await sendArticleEmail({
            isApproving: false,
            email,
            name: username,
            articleTitle: title,
            contentType: 'Podcast',
            reason,
          });
          if (res) {
            toast.success(`Podcast rejected and email has been sent to user.`);
          }
        } else {
          let res = await sendArticleEmail({
            isApproving: true,
            email,
            name: username,
            articleTitle: title,
            contentType: 'Podcast',
          });
          if (res) {
            toast.success(`Podcast Approved and email has been sent to user.`);
          }
        }
      } else {
        rejected
          ? toast.success(
              `Podcast rejected , but no email is associated with the user to notify the reason of rejection.`
            )
          : toast.success(
              `Podcast approved, but no email is associated with the user to notify the reason of approval.`
            );
      }
    }
  }

  return (
    <>
      <tr>
        <td>
          <div className='d-flex align-items-start'>
            {/* {article.podcastVideoLink ? (
                 <Tippy
                 content={<p className='mb-0'>Podcast</p>}
               >
                <div
                  style={{
                   width:"30px",
                    height: "30px",
                    position: 'relative',
                    marginRight: 10,
                  }}
                >
                  <PodcastSVG/>
                </div>
                </Tippy>
              ) : (
                <Image src={post1} alt='Post' />
              )} */}
            <Tippy content={<p className='mb-0'>{t('podcast')}</p>}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  position: 'relative',
                  marginRight: 10,
                }}
              >
                <PodcastSVG />
              </div>
            </Tippy>
            <p style={{ maxWidth: 480 }}>
              {article.title.slice(0, 75)}
              {article.title.length > 75 && '...'}{' '}
              {article.isDraft && <span>| Draft </span>}
            </p>
          </div>
          {userAuth.userPerms?.articleManagement && (
            <div className='item-menu mt-1'>
              <Button
                onClick={() => {
                  openLink(
                    article.isStatic
                      ? `${Podcast_STATIC_PATH + article.entryId}`
                      : `${Podcast_DINAMIC_PATH + article.entryId}`
                  );
                }}
                className='text-primary ps-0'
              >
                {'View'}
              </Button>
              <span>|</span>
              <Button
                onClick={() => {
                  if (location == ALL_ARTICLES) {
                    router.push(`/add-article?draftId=${article.entryId}`);
                  } else {
                    openLink(`/add-article?draftId=${article.entryId}`);
                  }
                }}
                className='text-primary ps-1'
              >
                {' Edit'}
              </Button>
              {status !== 'rejected' && (
                <>
                  {' '}
                  {article?.isQuizId ? (
                    <Button
                      onClick={() => {
                        if (location == ALL_ARTICLES) {
                          router.push(
                            `${ALL_QUIZ_ROUTE_USER}?entryId=${article.entryId}`
                          );
                        } else {
                          openLink(
                            `/super-admin/manage-quiz?entryId=${article.entryId}`
                          );
                        }
                      }}
                      className='text-primary ps-0'
                    >
                      {'View Quiz'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (location == ALL_ARTICLES) {
                          router.push(
                            `${ADD_QUIZ_ROUTE_USER}?entryId=${article.entryId}`
                          );
                        } else {
                          openLink(
                            `${ADD_QUIZ_ROUTE_ADMIN}?entryId=${article.entryId}`
                          );
                        }
                      }}
                      className='text-primary ps-0'
                    >
                      {'Create Quiz'}
                    </Button>
                  )}
                  {article?.isSurveyId ? (
                    <Button
                      onClick={() => {
                        if (location == ALL_ARTICLES) {
                          router.push(`/all-survey?entryId=${article.entryId}`);
                        } else {
                          openLink(
                            `/super-admin/manage-survey?entryId=${article.entryId}`
                          );
                        }
                      }}
                      className='text-primary ps-0'
                    >
                      {'View Survey'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        if (location == ALL_ARTICLES) {
                          router.push(
                            `${ADD_SURVEY_ROUTE_USER}?entryId=${article.entryId}`
                          );
                        } else {
                          openLink(
                            `${ADD_SURVEY_ROUTE_ADMIN}?entryId=${article.entryId}`
                          );
                        }
                      }}
                      className='text-primary ps-0'
                    >
                      {'Create Survey'}
                    </Button>
                  )}
                </>
              )}
              <span>|</span>
              <Button
                onClick={() => {
                  handleShow();
                  setAction({
                    status: true,
                    isDeleting: true,
                    id: article.entryId,
                    userName: article.userName,
                    userId: article.userId,
                  });
                }}
                className='removeUl text-danger'
              >
                Delete
              </Button>
            </div>
          )}
        </td>
        <td>
          <Link
            href={`/profile?userId=${article.userId}`}
            target='_blank'
            className='removeUl'
          >
            <p>{article?.userName}</p>
          </Link>
        </td>
        <td>
          <Tippy
            content={
              article?.categories?.length > 0 ? (
                <div className='categories'>
                  {article.categories.map((category: string, index: number) => (
                    <p className='category' key={index}>
                      {category}
                      {!(index === article.categories.length - 1) && ', '}
                    </p>
                  ))}
                </div>
              ) : (
                ''
              )
            }
          >
            <p
              className='d-inline-block'
              onClick={() => {
                if (location == ALL_ARTICLES) {
                  router.push(
                    `/category-details?category=${article.categoriesId[0]}`
                  );
                } else {
                  window.open(
                    `/category-details?category=${article.categoriesId[0]}`
                  );
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {article.categories[0] + ' '}{' '}
              {article.categories.length > 1 &&
                '+' + (article.categories.length - 1) + ' more'}
            </p>
          </Tippy>
        </td>
        <td className='text-center'>
          {status == 'pending' && (
            <ul className='btn-list'>
              <li>
                <Button
                  onClick={() => {
                    setAction({
                      status: true,
                      id: article.entryId,
                      isDeleting: false,
                      userName: article.userName,
                      userId: article.userId,
                    });

                    handleShow();
                  }}
                  className='green'
                >
                  Approve
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => {
                    setAction({
                      status: false,
                      id: article.entryId,
                      isDeleting: false,
                      userName: article.userName,
                      userId: article.userId,
                    });

                    handleShow();
                  }}
                  className='red'
                >
                  Reject
                </Button>
              </li>
            </ul>
          )}
          {status === 'approved' && (
            <p className='text-start text-success'>Approved</p>
          )}
          {status === 'rejected' && (
            <p className='text-start text-danger'>Rejected</p>
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
            {action.isDeleting
              ? 'Delete'
              : action.status
              ? 'Approve'
              : 'Reject'}
          </h3>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to{' '}
            {action.isDeleting
              ? 'Delete'
              : action.status
              ? 'approve'
              : 'reject'}{' '}
            this Podcast ?
          </p>
          {!action.status && !action.isDeleting && (
            <Form.Group
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'
            >
              <Form.Label>Reason to reject the Podcast.</Form.Label>
              <Form.Control
                as='textarea'
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='publish-btn'
            onClick={(e) => {
              if (action.isDeleting) {
                handleAdminDelete();
              } else {
                if (action.status) {
                  handleApprove(action.id, false, action.userName);
                } else {
                  if (rejectReason.length < 20) {
                    toast.error('Input must be at least 20 characters long.');
                  } else if (rejectReason.length > 2000) {
                    toast.error('Input must be at least 2000 characters long.');
                  } else {
                    handleApprove(
                      action.id,
                      false,
                      action.userName,
                      rejectReason
                    );
                  }
                }
              }
            }}
          >
            {approving ? (
              <Spinner size='sm' />
            ) : action.isDeleting ? (
              'Delete'
            ) : action.status ? (
              'Approve'
            ) : (
              'Reject'
            )}
          </Button>
          <Button
            disabled={approving}
            className='default-btn'
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
function Items({
  currentItems,
  handleRefetch,
}: {
  currentItems: any;
  handleRefetch: () => void;
}) {
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <Col xl='12' lg='12'>
      <div className='full-div'>
        <div className='table-container lg'>
          <div className='table-inner-container'>
            <Table striped hover className='article-table'>
              <thead>
                <tr>
                  <th>
                    <p>
                      {/* {t('title')}{' '} */}
                      Title
                      <Image className='arw' src={arrows} alt='arrow' />
                    </p>
                  </th>
                  {/* <th>{t('author')}</th> */}
                  <th>Author</th>

                  {/* <th>{t('categories')}</th> */}
                  <th>Categories</th>

                  <th className='d-flex align-items-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((article: any, index: number) => {
                  return (
                    <Article
                      handleRefetch={handleRefetch}
                      article={article}
                      key={index}
                    />
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Col>
  );
}

const statuses = ['pending', 'approved', 'rejected'];

export default function PendingList() {
  const [entriesList, setEntriesList] = useState<any[]>([]);
  const [processedList, setProcessedList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [itemOffset, setItemOffset] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [userArticleList, setUserArticleList] = useState<any[]>([]);
  const [activeListName, setActiveListName] = useState('All');
  const [activeList, setActiveList] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userDraftList, setUserDraftList] = useState<any[]>([]);
  const [oldAuth, setOldAuth] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [forcePaginate, setForcePaginate] = useState(0);
  const { t, changeLocale } = useLocalization(LANG);

  const [showLoader, setShowLoader] = useState(true);
  // const [entriesSize, setEntriesSize] = useState(0);
  // const [userEnriesSize, setUserEnriesSize] = useState(0);
  const [entriesSize, setEntriesSize] = useState<any>({
    all: 0,
    user: 0,
    draft: 0,
  });
  const [settings, setSettings] = useState({
    type: 'All',
  });

  const router = useRouter();
  const pathName = usePathname();
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));

  const entryActorDefault = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  let status: {
    pending?: null;
    approved?: null;
    rejected?: null;
  } = { pending: null };
  switch (selectedStatus) {
    case 'pending':
      status = { pending: null };
      break;
    case 'approved':
      status = { approved: null };
      break;
    case 'rejected':
      status = { rejected: null };
      break;
    default:
      status = { pending: null };
  }

  let itemsPerPage = 20;
  const endOffset = itemOffset + itemsPerPage;
  const entrySizeMap: EntrySizeMap = {
    All: 'all',
    Minted: 'all',
    Draft: 'draft',
    Mine: 'user',
  };

  const entrySizeKey: string = entrySizeMap[activeListName] || 'all';
  const pageCount = Math.ceil(entriesSize[entrySizeKey] / itemsPerPage);

  async function getCategories() {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const resp = await entryActor.get_list_categories('', 0, 20, false);
    const categories = resp.entries;
    setCategories(categories);
  }
  const getRefinedList = async (tempEntriesList: any[]) => {
    if (tempEntriesList.length === 0) {
      return [];
    }
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    const refinedPromise = await Promise.all(
      tempEntriesList.map(async (entry: any) => {
        let image = null;
        if (entry[1].image) {
          image = getImage(entry[1].image[0]);
        }
        let isQuizId = null;
        let quiz = await entryActorDefault.getQuizIdsList_Of_article(entry[0]);
        if (quiz && quiz.length != 0) {
          isQuizId = quiz[0];
        }
        let isSurveyId = null;
        let survey = await entryActorDefault.getSurveyIdsList_Of_article(
          entry[0]
        );
        if (survey && survey.length != 0) {
          isSurveyId = quiz[0];
        }
        const userId = entry[1].user.toString();

        // const user = await userActor.get_user_details([userId]);
        // const user = await auth.actor.get_user_details([userId]);
        // let
        let categoryNames = await Promise.all(
          entry[1].category?.map(async (categoryId: string) => {
            let resp = await entryActorDefault.get_category(categoryId);
            let category: any = fromNullable(resp);
            let categoryName = 'No Category';
            if (category) {
              categoryName = category.name;
            }
            return categoryName;
          })
        );
        let newItem = {
          entryId: entry[0],
          creation_time: entry[1].creation_time,
          image: image,
          podcastVideoLink: entry[1].podcastVideoLink,
          categories: categoryNames,
          title: entry[1].title,
          isDraft: entry[1].isDraft,
          isPromoted: entry[1].isPromoted,
          userName: entry[1].userName,
          minters: entry[1].minters,
          userId,
          status: entry[1].status,
          pressRelease: entry[1].pressRelease,
          categoryId: entry[1]?.category,
          isStatic: entry[1].isStatic,
          isQuizId,
          isSurveyId,
        };
        // if (user.ok) {
        //   newItem.userName = user.ok[1].name ?? entry[1].userName;
        // }
        return newItem;
      })
    );

    return refinedPromise;
  };
  const getEntriesList = async (reset?: boolean) => {
    const categ = selectedCategory;

    if (
      !userAuth.userPerms?.articleManagement ||
      auth.state !== 'initialized' ||
      !identity
    ) {
      return [];
    }

    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    const resp = await entryActor.getReviewPodcast(
      categ,
      userCanisterId,
      status,
      reset ? '' : search,
      forcePaginate * itemsPerPage,
      itemsPerPage
    );
    let amount = parseInt(resp.amount);
    setEntriesSize((prev: any) => ({
      ...prev,
      ['all']: amount,
    }));
    const tempList = resp.entries;
    setEntriesList(tempList);
    return tempList;
  };

  const handlePageClick = async (event: any) => {
    setIsGetting(true);

    setForcePaginate(event.selected);

    let list: any = [];
    const newOffset = (event.selected * itemsPerPage) % entriesSize.all;
    const resp = await entryActorDefault.getReviewPodcast(
      selectedCategory,
      userCanisterId,
      status,
      search,
      newOffset,
      itemsPerPage
    );
    list = resp.entries;
    const tempList = await getRefinedList(list);
    setProcessedList(tempList);
    setIsGetting(false);
  };
  const handleTabChange = async (tab: string) => {
    // setIsGetting(true);
    // setSelectedCategory('All');
    // setActiveListName(tab);
    // setForcePaginate(0);
    // let list = [];
    // if (tab === 'All' || tab === 'Minted') {
    //   list = await getEntriesList('All');
    // } else if (tab === 'Mine') {
    //   // list = await getUserEntries(true, false, 'All');
    // } else if (tab === 'Draft') {
    //   list = await getEntriesList('All', true);
    // }
    // const tempList = await getRefinedList(list);
    // setProcessedList(tempList);
    // setIsGetting(false);
  };

  const filter = async (reset?: boolean) => {
    setForcePaginate(0);
    let list = [];
    // if (activeListName == 'All' || activeListName == 'Minted') {
    setIsGetting(true);
    list = await getEntriesList(reset);
    // } else if (activeListName === 'Mine') {
    //   list = await getUserEntries(true);
    // } else if (activeListName === 'Draft') {
    //   list = await getEntriesList('All', true);
    // }
    const tempRefList = await getRefinedList(list);
    setProcessedList(tempRefList);

    setIsGetting(false);
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filter();
    }
  };
  const handleRefetch = async () => {
    setForcePaginate(0);
    setIsGetting(true);
    let list = await getEntriesList();
    const tempRefList = await getRefinedList(list);
    setProcessedList(tempRefList);
    setIsGetting(false);
  };
  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    async function getEntry() {
      setIsGetting(true);
      let list = await getEntriesList();
      const tempRefList = await getRefinedList(list);
      setProcessedList(tempRefList);
      setIsGetting(false);
    }
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
        getEntry();
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [identity, pathName, userAuth, auth]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    userAuth.userPerms?.articleManagement &&
    !userAuth.isAdminBlocked && (
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <Head>
              <title>Hi</title>
            </Head>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className=''>
                    <Row>
                      <Col xl='8'>
                        <h1>
                          Podcast Management <i className='fa fa-arrow-right' />{' '}
                          <span>Pending Podcast</span>
                        </h1>
                        {/* <ul className='all-filters-list'>
                        <li>
                          <span>
                            <b>All</b>(0)
                          </span>
                        </li>
                        <li>
                          <Link href='/'>
                            <p>
                              <b>Minted article</b>
                            </p>
                            (1,658)
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <p>
                              <b>Pending</b>
                            </p>
                            (8)
                          </Link>
                        </li>
                        <li>
                          <Link href='/'>
                            <p>
                              <b>Drafts</b>
                            </p>
                            (1)
                          </Link>
                        </li>
                      </ul> */}
                      </Col>
                      <Col xl='6' lg='6' className='mb-lg-5 mb-0'>
                        <ul className='all-filters-list v2'>
                          {/* <li>
                          <span
                            onClick={() => handleTabChange('All')}
                            className={activeListName === 'All' ? 'active' : ''}
                          >
                            <p>Pe</p>({entriesSize.all})
                          </span>
                        </li> */}

                          {/* {auth.state === 'initialized' && (
                          <li>
                            <span
                              onClick={() => handleTabChange('Mine')}
                              className={
                                activeListName === 'Mine' ? 'active' : ''
                              }
                            >
                              <p> All </p>({entriesSize.user})
                            </span>
                          </li>
                        )} */}
                          {/* <li>
                          <span
                            onClick={() => handleTabChange('Minted')}
                            className={
                              activeListName === 'Minted' ? 'active' : ''
                            }
                          >
                            <p>Minted articles</p>({entriesSize.all})
                          </span>
                        </li> */}
                          {/* <li>
                            <Link href='/'>
                              <p>Pending</p>
                              (8)
                            </Link>
                          </li> */}

                          {/* {auth.state === 'initialized' && (
                      <li>
                        <span
                          onClick={() => handleTabChange('Draft')}
                          className={activeListName === 'Draft' ? 'active' : ''}
                        >
                          <p> Drafts </p>({entriesSize.draft})
                        </span>
                      </li>
                    )} */}
                        </ul>
                      </Col>
                      <Col xl='6' lg='6' className='mb-4'>
                        <div className='full-div text-right-md'>
                          <div>
                            {/* {auth.state === 'initialized' && (
                        <Button
                          className='default-btn'
                          onClick={() => router.push('/add-article')}
                        >
                          <i className='fa fa-plus'/> Create
                        </Button>
                      )} */}
                          </div>

                          <div>
                            <div className='search-post-pnl'>
                              <input
                                type='text'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t('Search podcast')}
                                onKeyDown={handleSearch}
                              />
                              {search.length >= 1 && (
                                <button
                                  onClick={(e: any) => {
                                    setSearch('');
                                    filter(true);
                                  }}
                                >
                                  <i className='fa fa-xmark mx-1' />
                                </button>
                              )}
                              <button onClick={() => filter()}>
                                <i className='fa fa-search' />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Col>

                      <Col xl='6' lg='12'>
                        <div className='full-div'>
                          <ul className='filter-list'>
                            <li>
                              <Form.Select
                                aria-label={t('all categories')}
                                value={selectedStatus}
                                onChange={(e) =>
                                  setSelectedStatus(e.target.value)
                                }
                              >
                                {statuses.map((category: string, index) => (
                                  <option value={category} key={index}>
                                    <span className='text-capitalize m-0'>
                                      {category.charAt(0).toUpperCase() +
                                        category.slice(1)}
                                    </span>
                                  </option>
                                ))}
                              </Form.Select>
                            </li>
                            <li>
                              <Form.Select
                                aria-label={t('all categories')}
                                value={selectedCategory}
                                onChange={(e) =>
                                  setSelectedCategory(e.target.value)
                                }
                              >
                                <option value={'All'}>All Categories</option>
                                {categories &&
                                  categories.map((category: any, index) => (
                                    <option value={category[0]} key={index}>
                                      {category[1].name}
                                    </option>
                                  ))}
                              </Form.Select>
                            </li>
                            <li>
                              <Button
                                className='publish-btn'
                                onClick={() => filter()}
                              >
                                Apply
                              </Button>
                            </li>
                          </ul>
                        </div>
                      </Col>
                      <Col xl='6' lg='12'>
                        <div className='pagination-container mystyle d-flex justify-content-center justify-content-md-end'>
                          {
                            <ReactPaginate
                              breakLabel='...'
                              nextLabel=''
                              onPageChange={handlePageClick}
                              pageRangeDisplayed={5}
                              pageCount={pageCount}
                              previousLabel=''
                              renderOnZeroPageCount={null}
                              forcePage={forcePaginate}
                            />
                          }
                        </div>
                      </Col>
                      {/* <Col xl='4' lg='6' md='6' sm='12'>
                      <div className='spacer-20'/>
                      <div className='full-div text-right-md'>
                        <div className='search-post-pnl'>
                          <input type='text' placeholder='Search Posts' />
                          <button>
                            <i className='fa fa-search'/>
                          </button>
                        </div>
                        <div className='spacer-20'/>
                      </div>
                    </Col>
                    <Row>
                      <Col xxl='6' xl='6' lg='12'>
                        <div className='flex-div-sm'>
                          <ul className='filter-list'>
                            <li>
                              <Form.Select aria-label='Rejected'>
                                <option>Rejected</option>
                                <option value='1'>Rejected</option>
                                <option value='2'>Approve</option>
                              </Form.Select>
                            </li>
                            <li>
                              <Form.Select aria-label='Categories'>
                                <option>Categories</option>
                                <option value='1'>Categories</option>
                                <option value='2'>Categories</option>
                              </Form.Select>
                            </li>
                            <li>
                              <Button className='reg-btn fill'>Apply</Button>
                            </li>
                          </ul>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col xl='6' lg='12'>
                        <div className='pagination-container'>
                          <ReactPaginate
                            breakLabel='...'
                            nextLabel=''
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel=''
                            renderOnZeroPageCount={null}
                          />
                        </div>
                      </Col>
                    </Row> */}
                      {isGetting || showLoader ? (
                        <div className='d-flex justify-content-center w-full'>
                          <Spinner />
                        </div>
                      ) : processedList.length > 0 ? (
                        <Items
                          currentItems={processedList}
                          handleRefetch={handleRefetch}
                        />
                      ) : (
                        <div className='d-flex justify-content-center w-ful'>
                          <h3>{t('No Podcast Found')}</h3>
                        </div>
                      )}
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </main>
      </>
    )
  );
}
