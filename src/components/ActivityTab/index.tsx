'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Tab, Nav, Table, Spinner } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import comment from '@/assets/Img/Icons/icon-writer.png';
import { useConnectPlugWalletStore } from '@/store/useStore';
import logger from '@/lib/logger';
import proimg from '@/assets/Img/promoted-icon.png';
import {
  makeCommentActor,
  makeEntryActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import ExportPost from '@/components/ExportPost/ExportPost';
import { Activity, RefinedActivity } from '@/types/profile';
import pressicon from '@/assets/Img/Icons/icon-press-release.png';
import { utcToLocal } from '@/components/utils/utcToLocal';
import ReactPaginate from 'react-paginate';
import Tippy from '@tippyjs/react';
import PodcastSVG from '@/components/podcastSVG/Podcastsvg';
import { profileAspect } from '@/constant/sizes';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';

import {
  ARTICLE_DINAMIC_PATH,
  ARTICLE_STATIC_PATH,
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
  Podcast_DINAMIC_PATH,
  Podcast_STATIC_PATH,
} from '@/constant/routes';
import { Principal } from '@dfinity/principal';
export default function ActivityTab({isAdmin,userId,userName}: {isAdmin?:boolean,userId?:string,userName?:string}) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [myActivity, setMyActivity] = useState<RefinedActivity[]>([]);
  const [tempmyActivity, setTempMyActivity] = useState<any>([]);

  const [forcePaginate, setForcePaginate] = useState(0);
  const { t, changeLocale } = useLocalization(LANG);

  const { auth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    identity: state.identity,
  }));
  const activityActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const userActor = makeUserActor({
    agentOptions: {
      identity,
    },
  });
  let itemsPerPage = 10;

  const pageCount = Math.ceil(tempmyActivity.length / itemsPerPage);

  let currentItems = myActivity;
  const refineActivity = (activity: Activity): RefinedActivity => {
    const refinedActivity: RefinedActivity = {
      message: '',
      time: '',
      date: '',
      title: '',
      target: '',
      isPromoted: false,
      pressRelease: false,
      isPodcast: false,
      isWeb3: false,
      shoudRoute: false,
      isStatic: false,
    };

    if (activity.activity_type.hasOwnProperty('subscribe')) {
      const translatedMessage = isAdmin?'You subscribed to a User':t('You subscribed to a User');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
    } else if (activity.activity_type.hasOwnProperty('create_podcats')) {
      const translatedMessage = isAdmin?'You created a Podcast':t('You created a Podcast');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.isPodcast = true;
    } else if (activity.activity_type.hasOwnProperty('create_pressRelease')) {
      const translatedMessage = isAdmin?'You created a Press Release':t('You created a Press Release');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.pressRelease = true;
      refinedActivity.isStatic = activity.isStatic;
    } else if (activity.activity_type.hasOwnProperty('like_web3')) {
      const translatedMessage = isAdmin?'You liked a Company':t('You liked a Company');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.isWeb3 = true;
      refinedActivity.isStatic = activity.isStatic;
    } else if (activity.activity_type.hasOwnProperty('create_web3')) {
      const translatedMessage = isAdmin?'You created a Company':t('You created a Company');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.isWeb3 = true;
      refinedActivity.isStatic = activity.isStatic;
    } else if (activity.activity_type.hasOwnProperty('comment')) {
      const translatedMessage = isAdmin?'You commented on an Article':t('You commented on an Article');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.isStatic = activity.isStatic;
    } else if (activity.activity_type.hasOwnProperty('comment_podcats')) {
      const translatedMessage = isAdmin?'You commented on a Podcast':t('You commented on a Podcast');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.isPodcast = true;
      refinedActivity.isStatic = activity.isStatic;
    } else if (activity.activity_type.hasOwnProperty('delete_podcats')) {
      const translatedMessage = isAdmin?'You deleted a Podcast':t('You deleted a Podcast');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.isPodcast = true;
      refinedActivity.isStatic = activity.isStatic;
    } else if (activity.activity_type.hasOwnProperty('delete_article')) {
      const translatedMessage = isAdmin?'You deleted an Article':t('You deleted an Article');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.isStatic = activity.isStatic;
    } else if (activity.activity_type.hasOwnProperty('delete_pressRelease')) {
      const translatedMessage = isAdmin?'You deleted a Press Release':t('You deleted a Press Release');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.isStatic = activity.isStatic;
      refinedActivity.pressRelease = true;
    } else if (activity.activity_type.hasOwnProperty('comment_pressRelease')) {
      const translatedMessage = isAdmin?'You commented on a Press Release':t('You commented on a Press Release');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.pressRelease = true;
      refinedActivity.isStatic = activity.isStatic;
    } else if (activity.activity_type.hasOwnProperty('promote')) {
      const translatedMessage = isAdmin?'You promoted an article':t('You promoted an article');
      refinedActivity.message = translatedMessage ?? 'Error';
      refinedActivity.title = activity.title;
      refinedActivity.pressRelease = false;
      refinedActivity.isPodcast = false;
      refinedActivity.isPromoted = true;
      refinedActivity.isStatic = activity.isStatic;
    } else if (activity.activity_type.hasOwnProperty('like')) {
      if (activity.isPodcast) {
        const translatedMessage = isAdmin?'You liked a Podcast':t('You liked a Podcast');
        refinedActivity.message = translatedMessage ?? 'Error';
        refinedActivity.title = activity.title;
        refinedActivity.isPodcast = true;
        refinedActivity.isStatic = activity.isStatic;
      } else {
        if (activity.pressRelease) {
          const translatedMessage = isAdmin?'You liked a Press Release':t('You liked a Press Release');
          refinedActivity.message = translatedMessage ?? 'Error';
          refinedActivity.title = activity.title;
          refinedActivity.pressRelease = true;
          refinedActivity.isStatic = activity.isStatic;
        } else {
          const translatedMessage = isAdmin?'You liked an Article':t('You liked an Article');
          refinedActivity.message = translatedMessage ?? 'Error';
          refinedActivity.title = activity.title;
          refinedActivity.isStatic = activity.isStatic;
        }
      }
    } else if (activity.activity_type.hasOwnProperty('create')) {
      const translatedMessage1 = isAdmin?'You Promoted an Article':t('You Promoted an Article');
      const translatedMessage2 = isAdmin?'You created an Article':t('You created an Article');
      refinedActivity.message = activity.isPromoted
        ? translatedMessage1
        : translatedMessage2;
      refinedActivity.title = activity.title;
      refinedActivity.isStatic = activity.isStatic;
    }

    refinedActivity.isWeb3 = activity.isWeb3;
    // refinedActivity.isPodcast=activity.isPodcast;

    refinedActivity.target = activity.target;
    refinedActivity.isPromoted = activity.isPromoted;
    // refinedActivity.pressRelease = activity.pressRelease;
    refinedActivity.time = utcToLocal(activity.time.toString(), 'hh:mm A');
    refinedActivity.date = utcToLocal(activity.time.toString(), 'DD-MM-yyyy');
    refinedActivity.shoudRoute = activity.shoudRoute;
    return refinedActivity;
  };
  let paginatedActivities = async (
    startIndex: any = 0,
    tempmyActivity: any
  ) => {
    let activities = tempmyActivity.slice(startIndex, startIndex + 10);

    for (const activity of activities) {
      if (activity.activity_type.hasOwnProperty('subscribe')) {
        let user = await userActor.get_user_details([activity.target]);
        if (user.ok) {
          activity.title = user.ok[1].name;
        }
      } else if (
        activity.activity_type.hasOwnProperty('create_web3') ||
        activity.activity_type.hasOwnProperty('like_web3')
      ) {
        let entry = await entryActor.getWeb3(activity.target);
        if (entry.length > 0) {
          activity.title = entry[0].company;
          activity.isWeb3 = true;
          activity.shoudRoute = true;
          activity.isStatic = entry[0].isStatic;
        } else {
          // activity.title = 'not-found';
          activity.isWeb3 = true;
          activity.shoudRoute = false;
        }
      } else {
        let entry = await entryActor.getEntry(activity.target);
        if (entry.length > 0) {
          activity.title = entry[0].title;
          activity.isPromoted = entry[0].isPromoted;
          activity.pressRelease = entry[0].pressRelease;
          activity.isPodcast = entry[0].isPodcast;
          activity.shoudRoute = true;
          activity.isStatic = entry[0].isStatic;

          // if (entry[0].)
        } else {
          // activity.title = 'not-found';
          if (activity.activity_type.hasOwnProperty('comment_pressRelease')) {
            activity.pressRelease = true;
            activity.isPromoted = false;
          } else if (activity.activity_type.hasOwnProperty('comment_podcats')) {
            activity.isPodcast = true;
            activity.isPromoted = false;
          } else if (activity.activity_type.hasOwnProperty('comment_podcats')) {
            activity.isPodcast = true;
            activity.isPromoted = false;
          } else if (activity.activity_type.hasOwnProperty('promote')) {
            activity.pressRelease = false;
            activity.isPodcast = false;
            activity.isPromoted = true;
          } else {
            activity.pressRelease = false;

            activity.isPromoted = false;
          }
          activity.shoudRoute = false;
        }
      }
    }
    let refinedActivities: [RefinedActivity] = activities.map(
      (activity: Activity) => {
        return refineActivity(activity);
      }
    );
    setIsLoading(false);
    setMyActivity(refinedActivities);
  };

  const getActivities = async () => {
    const myActivities = await activityActor.getActivities();
 

    if (myActivities.ok) {
      let activities = myActivities.ok[0];
      setTempMyActivity(activities);
      paginatedActivities(0, activities);
    } else {
      setIsLoading(false);
    }
  };
  const getActivitiesDashboard = async (userId:string) => {
    let userPrincipal=Principal.fromText(userId)
    const myActivities = await activityActor.getActivitiesDashboard(userPrincipal,userCanisterId);
 

    if (myActivities.ok) {
      let activities = myActivities.ok[0];
      setTempMyActivity(activities);
      paginatedActivities(0, activities);
    } else {
      setIsLoading(false);
    }
  };
  const handlePageClick = async (event: any) => {
    setForcePaginate(event.selected);
    let startIndex = event.selected * itemsPerPage;
    paginatedActivities(startIndex, tempmyActivity);
  };

  useEffect(() => {
   
    if (auth.state === 'initialized') {
      if(isAdmin && userId){
        getActivitiesDashboard(userId)
      }else{

        getActivities();
      }
    }
  }, [auth]);

  let openLink = (link: any) => {
    router.push(link);
  };
  return (
    <div>
      <div
        className='profile-comment-pnl m-0 p-0'
        style={{ boxShadow: 'none' }}
      >
        {currentItems?.length > 0 ? (
          <div className='table-container'>
            <div className='table-container-inner '>
              <Table className={`activity-table small mb-0 ${isAdmin?"article-table table table-striped table-hover":""}`}>
                <thead>
                  <tr>
                    <th>
                      <p>{t('Activities')}</p>
                    </th>
                    <th>
                      <p>{t('date')}</p>
                    </th>
                    <th>
                      <p>{t('Time')}</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((activity: RefinedActivity, index) => (
                    <tr key={index}>
                      <td>
                        <div className='d-inline-flex align-items-start'>
                          {userName}{activity.message.slice(isAdmin?3:0) ?? ''}
                          {activity.isPromoted && (
                            <Tippy
                              content={
                                <p className='mb-0'>{t('Promoted Article')}</p>
                              }
                            >
                              <Image
                                src={proimg}
                                alt='promoted icon'
                                height={15}
                                width={15}
                                className='ms-1 mx-2 mt-1'
                              />
                            </Tippy>
                          )}
                          {activity?.pressRelease && (
                            <Tippy
                              content={
                                <p className='mb-0'> {t('Press Release')}</p>
                              }
                            >
                              <Image
                                src={pressicon}
                                alt='pressicon'
                                className='ms-1'
                                style={{ width: 22, height: 22 }}
                              />
                            </Tippy>

                            // <span className='publish-btn table-btn'>
                            //   promotedIcon
                            // </span>
                          )}
                          {activity?.isPodcast && (
                            <Tippy content={<p className='mb-0'>{t('podcast')}</p>}>
                              <div
                                className='position-relative ms-1'
                                style={{
                                  aspectRatio: profileAspect,
                                  width: '20px',
                                }}
                              >
                                <PodcastSVG />
                              </div>
                            </Tippy>

                            // <span className='publish-btn table-btn'>
                            //   promotedIcon
                            // </span>
                          )}
                          <Link
                            onClick={(e) => {
                              e.preventDefault();
                              if (activity.shoudRoute) {
                                if (
                                  activity.message == 'You subscribed to a User' || activity.message == "あなたはユーザー登録をしました"
                                ) {
                                  openLink(
                                    `/profile?userId=${activity.target}`
                                  );
                                } else if (activity.isPodcast) {
                                  openLink(
                                    activity.isStatic
                                      ? `${Podcast_STATIC_PATH + activity.target
                                      }`
                                      : `${Podcast_DINAMIC_PATH+activity.target}`
                                  );
                                } else if (activity.isWeb3) {
                                  openLink(
                                    activity.isStatic
                                      ? `${DIRECTORY_STATIC_PATH +
                                      activity.target
                                      }`
                                      : `${DIRECTORY_DINAMIC_PATH+activity.target}`
                                  );
                                } else {
                                  openLink(
                                    activity.isStatic
                                      ? `${ARTICLE_STATIC_PATH + activity.target
                                      }`
                                      : `${ARTICLE_DINAMIC_PATH+activity.target}`
                                  );
                                }
                              }
                            }}
                            href='#'
                            className='ms-1'
                            style={{
                              cursor: activity.shoudRoute
                                ? 'pointer'
                                : 'not-allowed',
                            }}
                          >
                            {' '}
                            {activity.title.length < 20
                              ? activity.title
                              : `${activity.title.slice(0, 30)}...`}
                          </Link>
                        </div>
                      </td>
                      <td>{activity.date ?? ''}</td>
                      <td>{activity.time ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        ) : (
          <div className='my-3'>
            {isLoading ? (
              <Spinner />
            ) : (
              <p className='h5 m-0'>{t('No Recent Activity Found')}</p>
            )}
          </div>
        )}
      </div>
      <div className='d-flex justify-content-end mt-2'>
        <div className='pagination-container' style={{ width: 'auto' }}>
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
      </div>
    </div>
  );
}
