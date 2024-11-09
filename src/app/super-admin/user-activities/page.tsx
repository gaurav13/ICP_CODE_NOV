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
import ActivityTab from '@/components/ActivityTab';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { fromNullable } from '@dfinity/utils';
import Link from 'next/link';
type User= {
  [key: string]: number;
}
export default function UserManagment() {

  const router = useRouter();
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const [name, setName] = useState<string | null>("")
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const userId = searchParams.get('userId');
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  let getuserName=(userId:string)=>{
    let userPrin=Principal.fromText(userId);
    let username=userActor.get_user_name_only(userPrin);
    if(username)setName(username);
  }

  useEffect(() => {
    if(userId){

      getuserName(userId)

    }
  }, [userId])
  
  useEffect(() => {
    // if(!userAuth.isAdminBlocked){
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.userManagement && !userAuth.isAdminBlocked) {

      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth]);

  return userAuth.userPerms?.userManagement && !userAuth.isAdminBlocked ? (
    <main id='main' className='dark'>
        <div className='main-inner admin-main'>
        
        <div className='section admin-inner-pnl' id='top'>
        <Row>
            <Col className='activitesTableTop'><h5>Activities of</h5><Link href={`/profile/?userId=${userId}`}>{name}</Link></Col>
          </Row>
             {userId &&  <ActivityTab isAdmin={true} userId={userId} userName={name ?? ""}/>}
              </div>
              </div>
      </main>
 
  ) : (
    <></>
  );
}
