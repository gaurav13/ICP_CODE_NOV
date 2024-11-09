'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import Link from 'next/link';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeCommentActor, makeEntryActor } from '@/dfx/service/actor-locator';
import { fromNullable } from '@dfinity/utils';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import ConnectModal from '@/components/Modal';
import {
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
} from '@/constant/routes';
import ReactPaginate from 'react-paginate';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { debounce } from '@/lib/utils';
import tempimg from '@/assets/Img/banner-1.png';
import { useRouter } from 'next/navigation';
import { GLOBAL_SEARCH_ITEMS } from '@/constant/sizes';

function EntryItem({ entry, router }: { entry: any; router: any }) {
  const { t, changeLocale } = useLocalization(LANG);

  let openWeb3Link = (entryLink: any) => {
    router.push(entryLink);
  };

  return (
    <>
      <Col sm={6} md={4} xl={3} xxl={3} className='mb-3' key={entry[0]}>
        <Link
          href='#'
          onClick={(e) => {
            e.preventDefault();

            openWeb3Link(
              entry[1].isStatic
                ? `${DIRECTORY_STATIC_PATH + entry[0]}`
                : `${
                    entry.length != 0
                      ? DIRECTORY_DINAMIC_PATH + entry[0]
                      : DIRECTORY_DINAMIC_PATH + '#'
                  }`
            );
          }}
          className='Product-post direc'
        >
          <div className='Product-post-inner'>
            <div className='img-pnl'>
              {/* <Image
                  src={'/images/b-b.png'}
                  width={213}
                  height={133}
                  alt='Blockza'
                /> */}
              <Image
                src={entry[1]?.companyBanner ?? tempimg}
                alt='founder image'
                height={100}
                width={100}
                className='h-100-w-auto customeImg'
              />
            </div>
            <div className='text-pnl'>
              <div className='d-flex'>
                <div className='logo-img'>
                  <Image
                    src={entry[1]?.companyLogo ?? '/images/l-b.png'}
                    width={15}
                    height={16}
                    alt='Blockza'
                  />
                </div>
                <div className='heading-txt-pnl'>
                  <p style={{ fontWeight: 700, fontSize: '16px' }}>
                    {entry[1]?.company.length > 15
                      ? `${entry[1]?.company.slice(0, 15)}...`
                      : entry[1]?.company ?? ''}
                  </p>
                  <p className='shortDisc'>
                    {entry[1]?.shortDescription ?? ''}
                  </p>
                </div>
              </div>
              <ul>
                <li>
                  {formatLikesCount(Number(entry[1]?.totalCount)) ?? 0}
                  <span>{t('Posts')}</span>
                </li>
                <li>
                  {formatLikesCount(Number(entry[1]?.views)) ?? 0}
                  <span>{t('Views')}</span>
                </li>
                <li>
                  {formatLikesCount(Number(entry[1]?.likes)) ?? 0}
                  <span>{t('Likes')}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className='txt-pnl  mx-width-405' style={{ height: '135px' }}>
            <p style={{ overflow: 'hidden', height: '40px' }}>
              <i>
                {/* {entry[1]?.founderDetail.length > 50
                        ? `${entry[1]?.founderDetail.slice(0, 50)}...`
                        : entry[1]?.founderDetail ?? ''} */}
                {entry[1]?.founderDetail}
              </i>
            </p>
            <div className='img-pl'>
              <Image
                src={entry[1]?.founderImage ?? '/images/l-n.png'}
                width={20}
                height={20}
                alt='Girl'
              />
<div>
                    <h5>{(entry[1]?.founderName.length >15) ? `${entry[1]?.founderName?.slice(0,15)}...`:entry[1]?.founderName ?? ''}</h5>
                    <p>{t('Founder')}</p>
                  </div>
            
            </div>
          </div>
        </Link>
      </Col>
    </>
  );
}
export default function AllWeb3DirectoriesSearch({
  contentType,
  setIsData,
}: {
  contentType: string;
  setIsData: any;
}) {
  const [category, setCategory] = useState<any | undefined>();
  const [entries, setEntries] = useState<undefined | any[]>();
  const [entriesSize, setEntriesSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [forcePaginate, setForcePaginate] = useState(0);

  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const searchString = searchParams.get('q');
  const pageCount = Math.ceil(entriesSize / GLOBAL_SEARCH_ITEMS);
  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
  }));
  let router = useRouter();
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });

  /**
   * getAllWeb3List use for get entries
   * @parms (startIndex:number,str:string)
   * @return   null;
   */
  let getAllWeb3List = async (startIndex: number, str: string) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let TempDirectory = null;
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers(
      'All',
      str,
      startIndex,
      GLOBAL_SEARCH_ITEMS
    );
    let tempAmount = parseInt(tempWeb3?.amount);
    setEntriesSize(tempAmount);
    if (tempWeb3?.web3List?.length != 0) {
      let web3array = tempWeb3.web3List;
      let categoriesIds = [];
      for (let dirc = 0; dirc < web3array.length; dirc++) {
        let resp = await entryActor.get_category(web3array[dirc][1].catagory);
        categoriesIds.push(web3array[dirc][0]);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
        }
        web3array[dirc][1].catagory = categoryName;
        web3array[dirc][1].companyBanner = await getImage(
          web3array[dirc][1].companyBanner
        );
        web3array[dirc][1].founderImage = await getImage(
          web3array[dirc][1].founderImage
        );
        web3array[dirc][1].companyLogo = await getImage(
          web3array[dirc][1].companyLogo
        );
      }

      TempDirectory = web3array.sort(
        (f: any, l: any) => Number(l[1].likes) - Number(f[1].likes)
      );
    }
    if (!TempDirectory || (TempDirectory && TempDirectory?.lenght == 0)) {
      setIsData((pre: any) => ({ ...pre, Directories: false }));
    }
    if (TempDirectory) {
      setEntries(TempDirectory);
    } else {
      setEntries([]);
    }
  };
  /**
   * handlePageClick use to navigate page
   * @parms event
   * @return   null;
   */
  const handlePageClick = async (event: any) => {
    setIsLoading(true);
    setForcePaginate(event.selected);
    const newOffset = (event.selected * GLOBAL_SEARCH_ITEMS) % entriesSize;
    const tempEntries = await getAllWeb3List(newOffset, searchString ?? '');

    setIsLoading(false);
  };
  const { t, changeLocale } = useLocalization(LANG);
  /**
   * getNSetEntries use to get web3 directories
   * @parms search string
   * @return   null;
   */
  const getNSetEntries = async (str: string) => {
    setIsLoading(true);
    const tempEntries = await getAllWeb3List(0, str);
    setIsLoading(false);
  };
  const debouncedFetchResults = useCallback(debounce(getNSetEntries, 500), []);

  useEffect(() => {
    debouncedFetchResults(searchString ?? '');
  }, [searchString]);
  return (
    <>
      {entriesSize > 0 && !isLoading && (
        <div className='ps-4  d-flex justify-content-center'>
          <div className='event-innr w-100'>
            <Col xl='12' lg='12' md='12'>
              <div className='spacer-50' />
              <h2>{contentType}</h2>
              <div className='spacer-20' />
            </Col>
            <Col xl='12' lg='12' md='12'>
              <Row>
                <Col>
                  <Row>
                    {isLoading ? (
                      <div className='d-flex justify-content-center w-full'>
                        <Spinner />
                      </div>
                    ) : entries && entries.length != 0 ? (
                      entries.map((entry: any) => (
                        <EntryItem entry={entry} router={router} />
                      ))
                    ) : (
                      <p className='d-flex justify-content-center w-full'>
                        {t('No Web3 Directory Found')}{' '}
                      </p>
                    )}
                  </Row>
                  {entriesSize > GLOBAL_SEARCH_ITEMS && (
                    <Row>
                      <Col>
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
                    </Row>
                  )}
                </Col>
              </Row>
            </Col>
          </div>
        </div>
      )}
    </>
  );
}
