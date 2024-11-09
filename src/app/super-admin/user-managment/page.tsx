'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Spinner } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeTokenCanister, makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { UsersList } from '@/components/UsersList';
import { ConnectPlugWalletSlice } from '@/types/store';
import { Principal } from '@dfinity/principal';
type User= {
  [key: string]: number;
}
export default function UserManagment() {
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [search, setSearch] = useState('');
  const [forcePaginate, setForcePaginate] = useState(0);
  const [usersSize, setUsersSize] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const router = useRouter();
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
  let tokenActor =  makeTokenCanister({
    agentOptions: {
      identity,
    },
  });
/*
getUsersList use to get user list 
@params {reset?:boolean}
@return users list
  */
  const getUsersList = async (reset?: boolean) => {
    if (!identity || auth.state !== 'initialized') {
      return [];
    }
    const tempList = await userActor.get_authorized_users(
      reset ? '' : search,
      forcePaginate * itemsPerPage,
      itemsPerPage
    );
    if (tempList) {
      // if (tempList[1])

      const refinedList = await getRefinedList(tempList.users);
      setUsersList(refinedList);
      setUsersSize(parseInt(tempList.amount));

    }
    return tempList;
  };
  /*
getRefinedList use to refined user list 
@params {tempUsersList}
@return refined user list
  */
  const getRefinedList = async (tempUsersList: any[]) => {
    if (tempUsersList.length === 0) {
      return [];
    }
 let usersBalce:User={};   
    let useridsList:string[]=[]
    const refinedPromise = await Promise.all(
      tempUsersList.map((item: any) => {
        const id = item[0].toString();
        useridsList.push(id);
        item[1].claimedReward=parseInt(item[1].claimedReward) ?? 0;
        item[1].unclaimedReward=parseInt(item[1].unclaimedReward) ?? 0;

        return {
          0: id,
          1: item[1],
        };
      })
    );
   let usersBalance=await tokenActor.users_balance(useridsList);
 
    if(usersBalance){
       usersBalce = usersBalance.reduce((acc: User, [key, value]:any) => {
        acc[key] = parseInt(value) ?? 0;
        return acc;
      }, {});
      
      
    }
       
      refinedPromise.map((user:any)=>{

       user[1].tokens=usersBalce[user[0]]
      })
    return refinedPromise;
  };

  let itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  // const currentItems = usersList.slice(itemOffset, endOffset);
  // logger(currentItems, 'Entries That we are shownig');

  const pageCount = Math.ceil(usersSize / itemsPerPage);

  // Invoke when user click to request another page.
  const handlePageClick = async (event: any) => {
    setForcePaginate(event.selected);
    setIsGetting(true);
    const newOffset = (event.selected * itemsPerPage) % usersSize;
    // setItemOffset(newOffset);
    const newItems = usersList.slice(newOffset, newOffset + itemsPerPage);
    const tempList = await userActor.get_authorized_users(
      search,
      newOffset,
      itemsPerPage
    );
    if (tempList) {
      // if (tempList[1])

      const refinedList = await getRefinedList(tempList.users);
      setUsersList(refinedList);
      // setUsersSize(parseInt(tempList.amount));
    }
    setIsGetting(false);
  };
  const filter = async (reset?: boolean) => {
    setIsGetting(true);
    setForcePaginate(0);
    await getUsersList(reset);
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
    await getUsersList();
    setIsGetting(false);
  };
  useEffect(() => {
    // if(!userAuth.isAdminBlocked){
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.userManagement && !userAuth.isAdminBlocked) {
        setIsGetting(true);
        getUsersList();
        setIsGetting(false);
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth]);

  return userAuth.userPerms?.userManagement && !userAuth.isAdminBlocked ? (
    <>
      <main id='main' className='dark'>
        <div className='main-inner admin-main'>
         
          <div className='section admin-inner-pnl' id='top'>
            <Row>
              <Col xl='12' lg='12'>
                <div className=''>
                  <Row>
                    <Col xl='8' lg='6' md='6'>
                      <h1>User list</h1>
                    </Col>
                    <Col xl='4' lg='6' md='6' className='my-2'>
                      <div className='full-div text-right-md'>
                        <div className='search-post-pnl'>
                          <input
                            type='text'
                            placeholder='Search Users'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                          />
                          {search.length >= 1 && (
                            <button
                              onClick={() => {
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
                    </Col>
                    <Row>
                      <Col xl='12' lg='12' className='mt-3 text-right'>
                        <div className='pagination-container mystyle d-flex justify-content-center justify-content-md-end'>
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
                      </Col>
                    </Row>
                    {isGetting ? (
                      <div className='d-flex justify-content-center mt-5 w-full'>
                        <Spinner />
                      </div>
                    ) : usersList.length > 0 ? (
                      <UsersList
                        currentItems={usersList}
                        handleRefetch={handleRefetch}
                        // className={"minwidht"}
                      />
                    ) : (
                      <div className='mt-4'>
                        <p className='fs-5 mt-4 text-center'>No user found</p>
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
  ) : (
    <></>
  );
}
