'use client';
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeTokenCanister, makeUserActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { TOKEN_MINTER_PER_PAGE } from '@/constant/sizes';
import { utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { canisterId as tokenCanisterId } from '@/dfx/declarations/token_canister';
import { Principal } from '@dfinity/principal';
import { debounce } from '@/lib/utils';
import TableItemOfMinter from '@/components/transections/TableOfMinter';
import { ADMIN_DATE_FORMATE, ADMIN_TIME_FORMATE } from '@/constant/DateFormates';
import logger from '@/lib/logger';

export default function ListOfMinters({ btnRef }: { btnRef: any }) {
  const [processedList, setProcessedList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [search, setSearch] = useState('');
  const [forcePaginate, setForcePaginate] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const { t, changeLocale } = useLocalization(LANG);
  const [entriesSize, setEntriesSize] = useState<number>(0);
  const router = useRouter();
  const pathName = usePathname();
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  let userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });

  const pageCount = Math.ceil(entriesSize / TOKEN_MINTER_PER_PAGE);
  let refinedData = (listTrans: any[]) => {
    if (!listTrans || listTrans?.length <= 0 || !Array.isArray(listTrans))
      return [];
    let mapData = listTrans.map((e: any) => {
      let item = e[1];
      let useId=item?.wallet.toString()
      item.wallet =useId;
      item.time = utcToLocalAdmin(item.creation_time.toString(), ADMIN_TIME_FORMATE);
      item.date = utcToLocalAdmin(item.creation_time.toString(), ADMIN_DATE_FORMATE);
      item.tokens = parseInt(item.tokens);

      return item;
    });
    return mapData;
  };
  const handlePageClick = async (event: any) => {
    setForcePaginate(event.selected);
    const newOffset = event.selected;
    getTokenMinter(newOffset);
  };

  let getTokenMinter = async (startIndex: number, userId?: Principal) => {
    setIsGetting(true);
    let data = await userActor.getListOfMinters(
      userId ?? [],
      startIndex,
      TOKEN_MINTER_PER_PAGE,
      tokenCanisterId
    );
    if (data) {
      let listTotal = Number(data?.total) ?? 0;
      setEntriesSize(listTotal);
      let refinedminters = refinedData(data?.minters);
      setProcessedList(refinedminters);
    }
    setIsGetting(false);
  };
  useImperativeHandle(btnRef, () => ({
    handleReFetch() {
      getTokenMinter(0);
    },
  }));
  const debouncedFetchResults = useCallback(debounce(getTokenMinter,1500), [identity]);

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.adminManagement && !userAuth.isAdminBlocked) {
    debouncedFetchResults(0);
  
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/');
    }
  }, [identity, pathName, userAuth, auth]);

  return (
    userAuth.userPerms?.adminManagement &&
    !userAuth.isAdminBlocked && (
      <>
        <div className='main-inner admin-main'>
          <div className='section admin-inner-pnl' id='top'>
            <Row>
              <Col xl='12' lg='12'>
                <div className=''>
                  <Row>
                    <Col xl='8'>
                      <h1>Token minting history </h1>
                    </Col>
                    <Col xl='6' lg='6' className='mb-lg-5 mb-0'>
                      <ul className='all-filters-list v2'></ul>
                    </Col>
                   

                 
                    {isGetting || showLoader ? (
                      <div className='d-flex justify-content-center w-full'>
                        <Spinner />
                      </div>
                    ) : processedList.length > 0 ? (
                      <TableItemOfMinter currentItems={processedList} />
                    ) : (
                      <div className='d-flex justify-content-center w-ful'>
                        <h3>No Record Found</h3>
                      </div>
                    )}
                       <Col lg='12'>
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
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  );
}
