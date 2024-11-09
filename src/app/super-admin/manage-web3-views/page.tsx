'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Table, Form, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import loader from '@/assets/Img/Icons/icon-loader.png';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import post1 from '@/assets/Img/Posts/small-post-10.png';
import post2 from '@/assets/Img/Posts/small-post-11.png';
import post3 from '@/assets/Img/Posts/small-post-12.png';
import post4 from '@/assets/Img/Posts/small-post-13.png';
import post5 from '@/assets/Img/Posts/small-post-14.png';
import post6 from '@/assets/Img/Posts/small-post-15.png';
import ReactPaginate from 'react-paginate';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import SearchArticlesList from '@/components/SearchArticlesList';
import { ConnectPlugWalletSlice } from '@/types/store';

export default function ArticleList() {
  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const router = useRouter();

  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.articleManagement && !userAuth.isAdminBlocked) {
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth]);

  return (
    userAuth.userPerms?.articleManagement &&
    !userAuth.isAdminBlocked && (
      <>
        <main id='main' className='dark'>
          <div className='main-inner admin-main'>
            <div className='section admin-inner-pnl' id='top'>
              <Row>
                <Col xl='12' lg='12'>
                  <div className='ms-4'>
                    <Row>
                      <Col xl='10' lg='8' md='12'>
                        <h1>
                          Web3 Management{' '}
                          <i
                            style={{ marginLeft: '5px', marginRight: '5px' }}
                            className='fa fa-arrow-right'
                          />{' '}
                          <span>Manage Web3 Views</span>
                        </h1>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </div>
            <SearchArticlesList views={true} isCompany={true} />
          </div>
        </main>
      </>
    )
  );
}
