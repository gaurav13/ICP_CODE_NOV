'use client';
import React, { useCallback, useEffect, useState } from 'react';
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
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import { EntrySizeMap } from '@/types/dashboard';
import { ConnectPlugWalletSlice } from '@/types/store';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import Tippy from '@tippyjs/react';
import promotedIcon from '@/assets/Img/promoted-icon.png';
import { toast } from 'react-toastify';
import pressicon from '@/assets/Img/Icons/icon-press-release.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  approvedArticleMessage,
  rejectedArticleMessage,
} from '@/constant/emailmessage';
import { fromNullable } from '@dfinity/utils';
import getCategories from '@/components/utils/getCategories';
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
  ARTICLE_DINAMIC_PATH,
  ARTICLE_STATIC_PATH,
  USERPROFILELINK,
} from '@/constant/routes';
import { MAX_REJECTREASON, MIN_REJECTREASON } from '@/constant/sizes';
import { utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { ADMIN_DATE_FORMATE, ADMIN_TIME_FORMATE } from '@/constant/DateFormates';
import { debounce } from '@/lib/utils';
type Action={
  id:string;
  approve : boolean
}
function Article({
  item,
  handleRefetch,
  t,
  isAdmin
}: {
  item: any;
  handleRefetch: () => void;
  t:any,
  isAdmin:boolean
}) {
  const [showModal, setShowModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  rejectReason;
  const [requestId, setRequestId] = useState<Action | null>(null);
  const [approving, setApproving] = useState(false);
  const location = usePathname();
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
  };
  const handleApprove = async (
    id: any,
  ) => {
    setApproving(true);
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    const approved = await userActor.token_request_approve(id);
    if (approved.ok) {
      toast.success('Approve successfully.');
      handleClose();
      handleRefetch();
      setRequestId(null)

    } else {
      toast.error('Error while sending tokens');
      setRequestId(null)

    }
    setRequestId(null)
    setApproving(false);

  };

  const handleReject = async (
    id: any,
  ) => {
    setApproving(true);
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    const approved = await userActor.token_request_reject(id);
    if (approved.ok) {
      toast.error('Rejected successfully.');

      handleClose();
      handleRefetch();
      setRequestId(null)

    } else {
      toast.error('Error while sending tokens');
      setRequestId(null)

    }
    setRequestId(null)
    setApproving(false);

  };
 
  const copyPrincipal = (id:string) => {
    window.navigator.clipboard.writeText(id);
    toast.success(t('Address copied to clipboard'), { autoClose: 1000 });
  };
  return (
    <>
      <tr>
      <td>
        <div>
        <Link
                          href={USERPROFILELINK + item?.userId}
                          target='_blank'
                          className='myUserLink myclor'
                        >
                         {item?.userId?.slice(0,10)}...{item?.userId?.slice(-10)}
                        </Link>
                          <i
                          onClick={()=>copyPrincipal(item?.wallet)}
                          className='fa fa-lg fa-copy '
                          style={{
                            cursor: 'pointer',
                            fontSize: 15,
                            color: 'black',
                          }}
                        />

        </div>
                       
                      </td>
       <td>
{item?.date}
       </td>
       <td>
{item?.time}
       </td>
       <td>
{item?.amount}
       </td>
       <td>
{item?.transectionFee}
       </td>
       <td>
{item?.status}
       </td>
       <td className='text-center'>
      
            <ul className='btn-list'>
              <li>
                <Button
                disabled={!(item?.status == 'pending' && isAdmin )}
                  onClick={() => {
                    setRequestId({id:item.entryId,approve:true});

                    handleShow();
                  }}
                  className='green'
                >
                  Approve
                </Button>
              </li>
              <li>
                <Button
                disabled={!(item?.status == 'pending' && isAdmin )}
                  onClick={() => {
                    setRequestId({id:item.entryId,approve:false});

                    handleShow();
                  }}
                  className='red'
                >
                  Reject
                </Button>
              </li>
           
            </ul>
     
       
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
          {requestId?.approve? "Approving":"Rejecting"} Request
          </h3>
        </Modal.Header>
        <Modal.Body>
          <p>
          {requestId?.approve?"Are you sure you want to send tokens to user?":"Are you sure you want to reject the request?"}
          </p>
      
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='publish-btn'
            onClick={(e) => {
                if (requestId?.approve) {
                  handleApprove(
                    requestId?.id
                   
                  );
                }else{
                  handleReject(
                    requestId?.id
                   
                  );
                }
              
            }}
          >
            {approving ? (
              <Spinner size='sm' />
            ) :
              
           (requestId?.approve?  'Approve':"Reject")
           }
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
  t,
  isAdmin
}: {
  currentItems: any;
  handleRefetch: () => void;
  t:any,
  isAdmin:boolean
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
                      {t('User')}
            
                      <Image className='arw' src={arrows} alt='arrow' />
                    </p>
                  </th>
              
                  <th> {t('Date')}</th>
                  <th> {t('Time')}</th>

    
                  <th> {t('Amount')}</th>
                  <th> {t('Fee')}</th>

                  <th> {t('Status')}</th>

                {isAdmin &&   <th> {t('Action')}</th>}

                </tr>
              </thead>
              <tbody>
                {currentItems.map((item: any, index: number) => {
                  return (
                    <Article
                      handleRefetch={handleRefetch}
                      item={item}
                      key={index}
                      t={t}
                      isAdmin={isAdmin}
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

export default function PendingTokensClaimsList({isAdmin}:{isAdmin:boolean}) {
  const [entriesList, setEntriesList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [itemOffset, setItemOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState<number>(0);

  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [forcePaginate, setForcePaginate] = useState(0);

  const location = usePathname();
  let language;

  const changeLang = () => {
    if (LANG === 'jp') {
      if (location) {
        language = location.includes('super-admin/') ? 'en' : 'jp';
      }
    } else {
      language = 'en';
    }
  };
  const funcCalling = changeLang();
  const { t, changeLocale } = useLocalization(language);
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



  const pageCount = Math.ceil(total/ itemsPerPage);

  const getRefinedList =  (tempEntriesList: any[]) => {
    if (tempEntriesList.length === 0) {
      return [];
    }
    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });

      let newArray=tempEntriesList.map((item: any) => {
        let id=item[0];
        let entry=item[1];
        let tempTime = utcToLocalAdmin(entry.creation_time.toString(), ADMIN_TIME_FORMATE);
        let tempdate  = utcToLocalAdmin(entry.creation_time.toString(), ADMIN_DATE_FORMATE);
        let tokens = parseInt(entry.tokens);
        let transectionFee = parseInt(entry.transectionFee);

        let status=Object.keys(entry.status)[0];
        let userid=entry.user.toString()
        let newItem = {
          entryId: id,
        amount:tokens,
     time:tempTime,
     date:tempdate,
     userId:userid,
     status,
     transectionFee
        };
      
        return newItem;
      })
    

    return newArray;
  };
  const getTokenClaimsRequests = async ({reset,forcePaginate,searched}:{reset?: boolean,forcePaginate:number,searched:string}) => {
try{


    setIsGetting(true)

    const userActor = makeUserActor({
      agentOptions: {
        identity,
      },
    });
let userId:any=[]

    const resp = await userActor.getTokensClaimedRequests(
      reset ? '' : search,
      forcePaginate * itemsPerPage,
      itemsPerPage,
      status,
      userId
    );

    let amount = parseInt(resp.amount);
    setTotal(amount);
    const tempList = resp.entries;
    let refined=getRefinedList(tempList);
logger(refined,"gsadfhgdsafdsafsafad")

    setEntriesList(refined);
    setIsGetting(false)
  } catch (error) {
    logger(error,"gsadfhgdsafdsafsafad")
    setIsGetting(false)
  }

  };

  const handlePageClick = async (event: any) => {
    setForcePaginate(event.selected);
    getTokenClaimsRequests({reset:false,forcePaginate:event.selected,searched:""})

  };


  const filter = async (reset?: boolean) => {
    setForcePaginate(0);
    getTokenClaimsRequests({reset:reset,forcePaginate:0,searched:""})
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      filter();
    }
  };
  const handleRefetch = async () => {
    setForcePaginate(0);
    setIsGetting(true);
    // let list = await getEntriesList();
    // const tempRefList = await getRefinedList(list);
    // setProcessedList(tempRefList);
    setIsGetting(false);
  };


  const debouncedFetchResults = useCallback(debounce(getTokenClaimsRequests, 500), []);

  useEffect(() => {
  
    if (auth.state === 'initialized') {
        debouncedFetchResults({reset:false,forcePaginate:0,searched:""});
     
    } else if (auth.state === 'anonymous') {
      isAdmin &&  router.replace('/super-admin');
    }
  }, [identity, pathName, userAuth, auth]);


  return (
 
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
          
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className=''>
                    <Row>
                     
                      <Col xl='6' lg='6' className='mb-lg-5 mb-0'>
                        <ul className='all-filters-list v2'>
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
                              <Button
                                className='publish-btn'
                                onClick={() => filter()}
                              >
                                Apply
                              </Button>
                            </li>
                          </ul>
                        </ul>
                      </Col>
                      <Col xl='6' lg='6' className='mb-4'>
                        <div className='full-div text-right-md'>
                          

                          <div>
                            <div className='search-post-pnl'>
                              <input
                                type='text'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder='Search Record'
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
                      {isGetting  ? (
                        <div className='d-flex justify-content-center w-full'>
                          <Spinner />
                        </div>
                      ) : entriesList.length > 0 ? (
                        <Items
                          currentItems={entriesList}
                          handleRefetch={handleRefetch}
                          t={t}
                          isAdmin={isAdmin}
                        />
                      ) : (
                        <div className='d-flex justify-content-center w-ful'>
                          <h3>No Record Found</h3>
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
    
  );
}
