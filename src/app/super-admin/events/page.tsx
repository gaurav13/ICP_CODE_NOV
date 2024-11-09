'use client';
import React, { useEffect, useState } from 'react';
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
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import { EntrySizeMap } from '@/types/dashboard';
import { ConnectPlugWalletSlice } from '@/types/store';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import { toast } from 'react-toastify';
import { fromNullable } from '@dfinity/utils';
import getVariant from '@/components/utils/getEventStatus';
import { utcToLocal, utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { ListEvent } from '@/types/article';
import { openLink } from '@/components/utils/localStorage';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { Event_DINAMIC_PATH, Event_STATIC_PATH } from '@/constant/routes';

function Article({
  article,
  handleRefetch,
}: {
  article: any;
  handleRefetch: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [isdeleting, setIsdeleting] = useState(false);

  const [rejectReason, setRejectReason] = useState('');
  const [action, setAction] = useState({
    status: true,
    id: '',
    isDeleting: false,
  });
  const router = useRouter();

  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
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
    setIsdeleting(true);

    try {
      let resp = await defaultEntryActor.delete_event(
        action.id,
        userCanisterId,
        commentCanisterId
      );
      if (resp.ok) {
        toast.success('Event Deleted Successfully');
        handleRefetch();
        handleClose();
      } else {
        toast.error('Event not found');
      }
      setIsdeleting(false);
    } catch (error) {
      toast.error('Something went wrong');
      setIsdeleting(false);
      handleClose();
    }
  };

  return (
    <>
      <tr>
        <td>
          <div className='d-flex align-items-start'>
            {article[1].image ? (
              <div
                style={{
                  minWidth: 89,
                  height: 46,
                  position: 'relative',
                  marginRight: 10,
                }}
              >
                <Image
                  src={article[1].image}
                  fill
                  sizes='(max-width: 2000px) 89px,46px'
                  alt='Post'
                />
              </div>
            ) : (
              <Image src={post1} alt='Post' />
            )}
            {/* <Tippy content={<p className='mb-0'>Podcast</p>}>
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
            </Tippy> */}
            <p style={{ maxWidth: 480 }}>
              {article[1].title.slice(0, 75)}
              {article[1].title.length > 75 && '...'}{' '}
            </p>
          </div>
          {/* <div className='item-menu  ms-4 mt-1'>
            <Button
              onClick={() => {
                openLink(`/event-details?eventId=${article[0]}`);
              }}
              className='text-primary ps-0'
            >
              {'View'}
            </Button>
          </div> */}
        </td>
        {/* <td>
          <Link href='#' style={{ pointerEvents: 'none' }} className='removeUl'>
            <p>{article[1]?.organiser}</p>
          </Link>
        </td> */}
        <td>
          <Link href='#' style={{ pointerEvents: 'none' }} className='removeUl'>
            <p>{article[1]?.date}</p>
          </Link>
        </td>
        <td>
          <p
            className='d-inline-block'
            onClick={() =>
              router.push(
                `/category-details?category=${article[1].category[0]}`
              )
            }
            style={{ cursor: 'pointer' }}
          >
            {article[1].categoryName + ' '}{' '}
          </p>
        </td>
        <td className='text-center'>
          {userAuth.userPerms?.articleManagement && (
            <div className='item-menu d-flex mt-1'>
              <Button
                onClick={() => {
                  router.push(`/super-admin/add-event?eventId=${article[0]}`);
                }}
                className='text-primary ps-0'
              >
                {'Edit'}
              </Button>
              <span className='mt-1'>|</span>
              <Button
                onClick={() => {
                  handleShow();
                  setAction({
                    status: true,
                    isDeleting: true,
                    id: article[0],
                  });
                }}
                className='removeUl text-danger'
              >
                Delete
              </Button>
              <span className='mt-1'>|</span>

              <Button
                onClick={() => {
                  openLink(
                    article[1].isStatic
                      ? `${Event_STATIC_PATH + article[0]}`
                      : `${Event_DINAMIC_PATH + article[0]}`
                  );
                }}
                className='ps-2 text-primary ps-0'
              >
                {'View'}
              </Button>
            </div>
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
            this Event ?
          </p>
          {!action.status && !action.isDeleting && (
            <Form.Group
              className='mb-3'
              controlId='exampleForm.ControlTextarea1'
            >
              <Form.Label>Reason to reject the Event.</Form.Label>
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
              }
            }}
          >
            {isdeleting ? (
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
            disabled={isdeleting}
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
                      Title <Image className='arw' src={arrows} alt='arrow' />
                    </p>
                  </th>
                  {/* <th>Organiser</th> */}
                  <th>Date</th>
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

const EVENTS_LEGNTH = 8;
export default function PendingList() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const [topEvents, setTopEvents] = useState<null | ListEvent[]>();
  const [articlesList, setArticlesList] = useState<any>([]);
  const [pressReleaseList, setPressReleaseList] = useState<any>([]);
  const [moreEvents, setMoreEvents] = useState(false);
  const [eventAmount, setEventAmount] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [status, setStatus] = useState('all');
  const [previewEvents, setPreviewEvents] = useState<null | ListEvent[]>();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<{ month: string | number }>({
    month: '',
  });
  const [forcePaginate, setForcePaginate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [eventSize, setEventSize] = useState(0);

  const [ccVals, setCcVals] = useState({
    country: '',
    city: '',
  });
  const router = useRouter();
  let itemsPerPage = 8;
  const pageCount = Math.ceil(eventSize / itemsPerPage);
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  // sending the customstatus just sets the preview events
  async function getEvents(
    reset?: boolean,
    more?: number,
    customStatus?: string
  ) {
    let searched = reset ? '' : search;
    let month = filters.month ? [filters.month] : [];
    let queryStatus = customStatus ?? status;
    const country = ccVals.country == '' ? [] : [ccVals.country];
    const city = ccVals.city == '' ? [] : [ccVals.city];
    const startFrom = more ?? startIndex;
    const length = customStatus ? 4 : EVENTS_LEGNTH;
    let statusVariant = getVariant(queryStatus);
    let tags = "";

    setIsLoading(true);

    const resp = await entryActor.get_upcoming_events(
      searched,
      startFrom,
      length,
      statusVariant,
      month,
      country,
      city,
      tags
    );
    const unEvents = resp.entries;
    const amount = resp.amount;
    let entriessize = parseInt(amount);

    setEventSize(entriessize);

    if (unEvents.length > 0) {
      for (let event = 0; event < unEvents.length; event++) {
        const unEvent = unEvents[event][1];
        let categoryId = unEvent?.category[0];
        const image = getImage(unEvent.image);
        const date = utcToLocalAdmin(unEvent.date.toString(), 'MMM D, YYYY');
        unEvent.date = date;
        unEvent.image = image;
        let resp = await entryActor.get_category(categoryId);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
        }
        unEvent.categoryName = categoryName;
      }
      setTopEvents(unEvents);
    } else {
      setTopEvents(null);
    }
    setIsLoading(false);
  }
  async function getMoreEvents() {
    if (startIndex + EVENTS_LEGNTH <= eventAmount) {
      setStartIndex((prev) => prev + EVENTS_LEGNTH);
      getEvents(false, startIndex + EVENTS_LEGNTH);
    }
  }
  const handlePageClick = async (event: any) => {
    setIsLoading(true);

    setForcePaginate(event.selected);

    let list: any = [];
    const newOffset = (event.selected * itemsPerPage) % eventSize;
    setStartIndex(newOffset);
    // getEvents();
    setIsLoading(false);
  };

  function handleCChange(cc: string, value: string) {
    setCcVals((prev) => {
      return { ...prev, [cc]: value };
    });
  }
  function handleFilterChange(filter: string, value: string) {
    setFilters((prev) => {
      return { ...prev, [filter]: parseInt(value) };
    });
  }

  const handleSearch = (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (e) {
      if (e.key === 'Enter') {
        setStartIndex(0);
        getEvents(false, 0);
      }
    } else {
      setStartIndex(0);
      getEvents(false, 0);
    }
  };
  function handleStatusChange(e: any) {
    setStatus(e.target.value);
    setStartIndex(0);
  }
  useEffect(() => {
    getEvents();
  }, [status, ccVals, filters, startIndex]);

  useEffect(() => {
    async function getEntry() {
      setIsLoading(true);
      getEvents();
      setIsLoading(false);
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
  }, [identity, userAuth, auth]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  const { t, changeLocale } = useLocalization(LANG);
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
                          Events Management <i className='fa fa-arrow-right' />{' '}
                          <span>All Events</span>
                        </h1>
                      </Col>
                      <Col xl='6' lg='6' className='mb-lg-5 mb-0'>
                        <ul className='all-filters-list v2' />
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
                                placeholder='Search event'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearch}
                              />
                              {search.length >= 1 && (
                                <button
                                  onClick={() => {
                                    setSearch('');
                                    getEvents(true, 0);
                                  }}
                                >
                                  <i className='fa fa-xmark mx-1' />
                                </button>
                              )}
                              <button onClick={() => handleSearch()}>
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
                                aria-label='All Categories'
                                value={status}
                                onChange={handleStatusChange}
                              >
                                <option value={'all'}>All Events</option>
                                <option value={'upcoming'}>
                                  Upcoming Events
                                </option>
                                <option value='past'>Past Events</option>
                                <option value='ongoing'>Ongoing Events</option>
                              </Form.Select>
                            </li>
                            {/* <li>
                              <Button
                                className='publish-btn'
                                onClick={() => handleSearch()}
                              >
                                Apply
                              </Button>
                            </li> */}
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

                      {isLoading ? (
                        <div className='d-flex justify-content-center w-full'>
                          <Spinner />
                        </div>
                      ) : topEvents && topEvents.length > 0 ? (
                        <Items
                          currentItems={topEvents}
                          handleRefetch={handleSearch}
                        />
                      ) : (
                        <div className='d-flex justify-content-center w-ful'>
                          <h3>No Events Found</h3>
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
