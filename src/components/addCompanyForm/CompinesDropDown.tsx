import AddCompanyForm from '@/components/addCompanyForm/AddCompanyForm';
import { WEB_ITEMS } from '@/constant/sizes';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Accordion, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

export default function CompinesDropDown({selectedCompany,setSelectedComany}:{selectedCompany:string,setSelectedComany:any}) {

  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const [Companies, setCompanies] = useState([]);
  const [web3Size, setweb3SizeSize] = useState(0);
  const [isGettingweb3, setIsGettingweb3] = useState(true);
  const [showWeb3Model, setShowWeb3Model] = useState(false);
  const [search, setSearch] = useState('');
  const [forcePaginate, setForcePaginate] = useState(0);
  const defaultEntryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  let pageCount = Math.ceil(web3Size / WEB_ITEMS);
  const handlePageClick = async (event: any) => {
    setIsGettingweb3(true);

    setForcePaginate(event.selected);
    // setItemOffset(newOffset);
    // if ()
    let list: any = [];
    const newOffset = (event.selected * WEB_ITEMS) % web3Size;

    const tempWeb3 = await defaultEntryActor.getWeb3List(
      '',
      search,
      newOffset,
      WEB_ITEMS
    );

    list = tempWeb3.web3List;
    setCompanies(list);
    const tempweb3Size = parseInt(tempWeb3.amount);

    setweb3SizeSize(tempweb3Size);

    setIsGettingweb3(false);
  };
  const web3ModelShow = () => setShowWeb3Model(true);

  let getWeb3List = async (searchString = '') => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    const tempWeb3 = await entryActor.getWeb3List(
      '',
      searchString,
      0,
      WEB_ITEMS
    );
    // const promted = await entryActor.getPromotedEntries();
    if (tempWeb3.web3List.length > 0) {
      setCompanies(tempWeb3.web3List);
      const tempweb3Size = parseInt(tempWeb3.amount);

      setweb3SizeSize(tempweb3Size);
      setIsGettingweb3;
    } else {
      setCompanies([]);
    }
    setIsGettingweb3(false);
  };
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === 'Enter') {
      e.preventDefault()
      getWeb3List(search);
    }
  };
  useEffect(() => {
    if (auth.state === 'initialized') {

        getWeb3List();
    
    } 
  }, [auth]);
  return (
    <>
        <Accordion defaultActiveKey={'1'}>
                  <Accordion.Item eventKey='1'>
                    <Accordion.Header>
                    company
                      <ul className='angle-list'>
                        <li>
                          <i className='fa fa-angle-up' />
                        </li>
                        <li>
                          <i className='fa fa-angle-down' />
                        </li>
                        <li>
                          <i className='fa fa-caret-up' />
                        </li>
                      </ul>
                    </Accordion.Header>
                    <Accordion.Body>
                      <div>
                        <div className='d-flex justify-content-center mb-2'>
                          <div
                            className='search-post-pnl'
                            style={{ maxWidth: '100%' }}
                          >
                            <input
                              type='text'
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              placeholder={"search companies"}
                              onKeyDown={handleSearch}
                            />
                            {search.length >= 1 && (
                              <button
                                onClick={(e: any) => {
                                  setSearch('');
                                  getWeb3List('');
                                }}
                              >
                                <i className='fa fa-xmark mx-1' />
                              </button>
                            )}
                            <button onClick={() => getWeb3List(search)}>
                              <i className='fa fa-search' />
                            </button>
                          </div>
                        </div>
                        {isGettingweb3 ? (
                          <div className='d-flex justify-content-center w-full'>
                            <Spinner />
                          </div>
                        ) : Companies.length > 0 ? (
                          Companies.map((Company: any, index) => (
                            <p
                              className={`category ps-1 ${
                                selectedCompany.includes(Company[0])
                                  ? 'active selectedBgClr'
                                  : ''
                              }`}
                              key={index}
                              onClick={() => {
                                if (selectedCompany.includes(Company[0])) {
                                  setSelectedComany('');
                                } else {
                                  setSelectedComany(`${Company[0]}`);
                                  // setSelectedCategory([]);
                                }
                              }}
                            >
                              {Company[1]?.company ?? ''}
                            </p>
                          ))
                        ) : (
                          <h6 className='mt-3 text-center'>
                            Company not found
                          </h6>
                        )}
                      </div>
                      <div className='pagination-container mystyle d-flex justify-content-end'>
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
                      </div>
                      <p className='fs-6 mb-0 mt-4 text-black'>
                        cant find your company?
                      </p>

                      <Link
                        href='#'
                        className='text-decoration-underline'
                        onClick={(e) => {
                          e.preventDefault();
                          web3ModelShow();
                        }}
                      >
                        register your company
                      </Link>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <AddCompanyForm
                  showWeb3Model={showWeb3Model}
                  setShowWeb3Model={setShowWeb3Model}
                  reFetchfn={getWeb3List}
                />
                </>
  )
}
