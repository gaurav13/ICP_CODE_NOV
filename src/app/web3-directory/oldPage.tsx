'use client';
import React, { useEffect, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { Row, Col, Breadcrumb, Dropdown } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import arb from '@/assets/Img/Icons/arb.png';
import blockchain1 from '@/assets/Img/sidebar-icons/icon-blockchain-1.png';
import Defi1 from '@/assets/Img/sidebar-icons/icon-defi-1.png';
import Doa1 from '@/assets/Img/sidebar-icons/icon-dao-1.png';
import NFt1 from '@/assets/Img/sidebar-icons/icon-nft-1.png';
import Metaverse1 from '@/assets/Img/sidebar-icons/icon-metavers-1.png';
import Game1 from '@/assets/Img/sidebar-icons/icon-games-1.png';

import Coins1 from '@/assets/Img/Icons/icon-coins-2.png';
import directory2 from '@/assets/Img/Icons/icon-coins-1.png';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { User } from '@/types/profile';
import { getImage } from '@/components/utils/getImage';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import DirectorySlider from '@/components/DirectorySlider/oldDirectorySlider';
import CompanySlider from '@/components/CompanySlider/CompanySlider';
import useSearchParamsHook from '@/components/utils/searchParamsHook';

export default function article() {
  const { t, changeLocale } = useLocalization(LANG);
  const [userImg, setUserImg] = useState<string | null>();
  const [user, setUser] = useState<User | null>();
  const [featuredImage, setFeaturedImage] = useState<string | null>();
  const [entry, setEntry] = useState<any>();
  const [userId, setUserId] = useState();
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const articleId = searchParams.get('articleId');
  const promote = searchParams.get('promoted');
  const router = useRouter();

  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));

  // logger();

  const updateImg = async (img: any, name: string) => {
    if (img) {
      const tempImg = await getImage(img);
      if (name === 'user') setUserImg(tempImg);
      else {
        setFeaturedImage(tempImg);
      }
    } else {
      // setProfileFile(null);
      if (name === 'user') setUserImg(null);
      else {
        setFeaturedImage(null);
      }
    }
  };

  const getUser = async () => {
    let newUser = null;

    newUser = await auth.actor.get_user_details([userId]);
    if (newUser.ok) {
      setUser(newUser.ok[1]);
      updateImg(newUser.ok[1].profileImg[0], 'user');
    }
  };

  const getEntry = async () => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    if (articleId) {
      const tempEntry = await entryActor.getEntry(articleId);
      // const promted = await entryActor.getPromotedEntries();
      // logger(promted, 'PROMTED ENTRIES');
      logger(tempEntry, 'entries');
      if (tempEntry[0] && tempEntry[0].isDraft) {
        return router.push(`/add-article?draftId=${articleId}`);
      }
      let tempUser = tempEntry[0].user?.toString();
      setUserId(tempUser);
      updateImg(tempEntry[0].image, 'feature');

      setEntry(tempEntry[0]);
      logger(tempEntry[0], 'Entries fetched from canister');
    }
  };

  const likeEntry = async () => {
    return new Promise(async (resolve, reject) => {
      if (!entry || !userId) reject('NO Entry or user ID provided');
      const entryActor = makeEntryActor({
        agentOptions: {
          identity,
        },
      });

      entryActor
        .likeEntry(articleId, userCanisterId, commentCanisterId)
        .then(async (entry: any) => {
          logger(entry);

          await getEntry();
          resolve(entry);
        })
        .catch((err: any) => {
          logger(err);
          reject(err);
        });
    });
  };
  useEffect(() => {
    if (auth.state == 'anonymous' || auth.state === 'initialized') getEntry();
  }, [articleId, auth, promote]);
  useEffect(() => {
    if (userId && auth.actor) {
      getUser();
    }
  }, [userId, auth.actor]);

  // router.push('/route')
  return (
    <>
      <main id='main'>
        <div className='main-inner web-page'>
          <div className='inner-content'>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link href='/'>
                      <i className='fa fa-home' />
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item href='#'>
                    <Link
                      href={`/category-detail?category=${entry?.category[0]}`}
                    >
                      shery
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>{entry?.title ?? ''}</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col xl='8' lg='8'>
                <h2>
                  <b>{t('Uncover and Explore')}</b>{' '}
                  {t('innovation WEB3 Companies and their Leaders')}
                </h2>
              </Col>
              <Col xl='4' lg='4' className='text-right'>
                <div className='search-pnl small'>
                  <input
                    className='form-control'
                    placeholder={t('find events')}
                    type='text'
                  />
                  <button>
                    <i className='fa fa-search' aria-hidden='true' />
                  </button>
                </div>
                <div className='spacer-50' />
                <div className='spacer-50' />
              </Col>

              <Col xl='12' lg='12'>
                <h3>
                  <Image src={arb} alt='Arb' /> {t('Trending')} {t('Companies')}
                </h3>
              </Col>
              <Col xl='12' lg='12'>
                <CompanySlider />
              </Col>
              <Col xl='12' lg='12'>
                <div className='flex-details-pnl'>
                  <div className='left-side-pnl'>
                    <div className='spacer-50' />
                    <Link href='#' className='reg-btn'>
                      {t('FAQ')}
                    </Link>
                    <div className='spacer-20' />
                    <Dropdown>
                      <Dropdown.Toggle
                        variant='success'
                        className='fill'
                        id='dropdown-basic'
                      >
                        {t('All Company')}
                        <i className='fa fa-angle-down' />
                      </Dropdown.Toggle>
                      {/* 
                      <Dropdown.Menu>
                        <Dropdown.Item href='#/action-1'>
                          Trending
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>
                          Trending
                        </Dropdown.Item>
                      </Dropdown.Menu> */}
                    </Dropdown>
                    <div className='spacer-20' />
                    <ul className='tab-blue-list'>
                      <li>
                        <Link className='active' href='#'>
                          <i className='fa fa-angle-right' />{' '}
                          {t('Search for People')}
                        </Link>
                      </li>
                      <li>
                        <Link href='#'>
                          <i className='fa fa-angle-right' />{' '}
                          {t('search companies')}
                        </Link>
                      </li>
                    </ul>
                    <Link href='#' className='reg-btn trans'>
                      {t('Submit your Listing')}
                    </Link>
                  </div>

                  <div className='right-detail-pnl'>
                    <div className='slide-cntnr'>
                      <h3>
                        <Image src={blockchain1} alt='Infinity' /> Web 3
                        Blockchain
                      </h3>
                      <div className='slid-bg'>
                        <DirectorySlider />
                      </div>
                    </div>
                    <div className='slide-cntnr'>
                      <h3>
                        <Image src={directory2} alt='Infinity' /> Crypto
                      </h3>
                      <div className='slid-bg yelow'>
                        <DirectorySlider />
                      </div>
                    </div>
                    <div className='slide-cntnr'>
                      <h3>
                        <Image src={Defi1} alt='Infinity' /> Defi
                      </h3>
                      <div className='slid-bg'>
                        <DirectorySlider />
                      </div>
                    </div>
                    <div className='slide-cntnr'>
                      <h3>
                        <Image src={Doa1} alt='Infinity' /> Dao
                      </h3>
                      <div className='slid-bg yelow'>
                        <DirectorySlider />
                      </div>
                    </div>
                    <div className='slide-cntnr'>
                      <h3>
                        <Image src={NFt1} alt='Infinity' /> NFT
                      </h3>
                      <div className='slid-bg'>
                        <DirectorySlider />
                      </div>
                    </div>
                    <div className='slide-cntnr'>
                      <h3>
                        <Image src={Metaverse1} alt='Infinity' />{' '}
                        {t('Metaverse')}
                        {t('Directory')}
                      </h3>
                      <div className='slid-bg yelow'>
                        <DirectorySlider />
                      </div>
                    </div>
                    <div className='slide-cntnr '>
                      <h3>
                        <Image src={Game1} alt='Infinity' /> Blockchain Game
                      </h3>
                      <div className='slid-bg'>
                        <DirectorySlider />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </main>
    </>
  );
}
// export const getStaticPaths = async () => {
//   // const paths = getAllArticleIds(); // Implement this function to get all article IDs
//   return {
//     paths,
//     fallback: true, // or false if you want to return a 404 page for unknown IDs
//   };
// };

// export const getStaticProps = async ({ params }) => {
//   // const article = await getArticleById(params.articleId);
//   return {
//     props: {
//       // article,
//     },
//   };
// };
