'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Row, Col, Table, Button, Spinner, Modal } from 'react-bootstrap';
import { usePathname, useRouter } from 'next/navigation';
import { useConnectPlugWalletStore } from '@/store/useStore';
import {
  makeCommentActor,
  makeEntryActor,
  makeUserActor,
} from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import NavBarDash from '@/components/DashboardNavbar/NavDash';
import SideBarDash from '@/components/SideBarDash/SideBarDash';
import { ConnectPlugWalletSlice, UserPermissions } from '@/types/store';
import ReactPaginate from 'react-paginate';
import proimg from '@/assets/Img/promoted-icon.png';
import Tippy from '@tippyjs/react';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { Principal } from '@dfinity/principal';
import {
  Activity,
  AdminActivity,
  RefinedActivity,
  RefinedAdminActivity,
} from '@/types/profile';
import { utcToLocal, utcToLocalAdmin } from '@/components/utils/utcToLocal';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { canisterId as commentCanisterId } from '@/dfx/declarations/comment';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { openLink } from '@/components/utils/localStorage';
import {
  ARTICLE_DINAMIC_PATH,
  ARTICLE_STATIC_PATH,
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
  Event_DINAMIC_PATH,
  Event_STATIC_PATH,
  Podcast_DINAMIC_PATH,
  Podcast_STATIC_PATH,
} from '@/constant/routes';

interface TrackingUser {
  name: string;
  id: string;
}
export default function TrackAdmin() {

  const { t, changeLocale } = useLocalization(LANG);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isGetting, setIsGetting] = useState(true);
  const [search, setSearch] = useState('');
  const [forcePaginate, setForcePaginate] = useState(0);
  const [usersSize, setUsersSize] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [itemOffset, setItemOffset] = useState(0);
  const [activityForcePaginate, setActivityForcePaginate] = useState(0);
  const [trackUser, setTrackUser] = useState<null | TrackingUser>(null);
  const [isGettingActivity, setIsGettingActivity] = useState(false);
  const [userActivity, setUserActivity] = useState<[RefinedAdminActivity] | []>(
    []
  );
  const [activitiesSize, setActivitiesSize] = useState(0);
  const [tempActivities, setTempActivities] = useState([]);

  const [tracebtnactive, setTraceBtnActive] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState({ status: true, id: '', name: '' });
  const [approving, setApproving] = useState(false);

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
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const activityActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
  let itemsPerPage = 4;
  let activitiesPerPage = 10;

  const getUsersList = async () => {
    const tempList = await userActor.get_subAdmin_users(
      search,
      forcePaginate * itemsPerPage,
      itemsPerPage
    );
    if (tempList) {
      // if (tempList[1])
      logger(tempList, 'tempList');

      const refinedList = await getRefinedList(tempList.users);
      setUsersList(refinedList);
      setUsersSize(parseInt(tempList.amount));

      logger(refinedList, 'Users List fetched from canister');
    }
    return tempList;
  };
  const getRefinedList = async (tempUsersList: any[]) => {
    if (tempUsersList.length === 0) {
      return [];
    }
    const refinedPromise = await Promise.all(
      tempUsersList.map((item: any) => {
        const id = item[0].toString();
        return {
          0: id,
          1: item[1],
        };
      })
    );

    return refinedPromise;
  };
  const refineActivity = (activity: AdminActivity): RefinedAdminActivity => {
    if (!trackUser) {
      return {
        message: '',
        time: '',
        date: '',
        target: activity.target,
        name: '',
        isPromoted: false,
        shoudRoute: false,
        creationType: 'Content',
        isStatic: false,
      };
    }
    const refinedActivity: RefinedAdminActivity = {
      message: '',
      time: '',
      date: '',
      target: '',
      name: '',
      isPromoted: false,
      shoudRoute: false,
      isStatic: false,
     };
    if (activity.activity_type.hasOwnProperty('block')) {
      refinedActivity.message = `${trackUser.name} blocked a User`;
      refinedActivity.name = activity.name;
      refinedActivity.target = `${window.location.origin}/profile?userId=${activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('unBlock')) {
      refinedActivity.message = `${trackUser.name} unBlocked a User`;
      refinedActivity.name = activity.name;
      refinedActivity.target = `${window.location.origin}/profile?userId=${activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('approve')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = activity.isPromoted;

      if (activity.creationType == 'Podcast') {
        refinedActivity.message = `${trackUser.name} approved a ${activity.creationType}`;
        refinedActivity.target = activity.isStatic
          ? `${Podcast_STATIC_PATH + activity.target}`
          : `${
              window.location.origin + Podcast_DINAMIC_PATH + activity.target
            }`;
      } else if (activity.creationType == 'Press Release') {
        refinedActivity.message = `${trackUser.name} approved a ${activity.creationType}`;
        refinedActivity.target = activity.isStatic
          ? `${ARTICLE_STATIC_PATH + activity.target}`
          : `${
              window.location.origin + ARTICLE_DINAMIC_PATH + activity.target
            }`;
      } else {
        refinedActivity.message = `${trackUser.name} approved an ${activity.creationType}`;
        refinedActivity.target = activity.isStatic
          ? `${ARTICLE_STATIC_PATH + activity.target}`
          : `${
              window.location.origin + ARTICLE_DINAMIC_PATH + activity.target
            }`;
      }
    } else if (activity.activity_type.hasOwnProperty('reject')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = activity.isPromoted;
      if (activity.creationType == 'Podcast') {
        refinedActivity.message = `${trackUser.name} rejected a ${activity.creationType}`;
        refinedActivity.target = activity.isStatic
          ? `${Podcast_STATIC_PATH + activity.target}`
          : `${
              window.location.origin + Podcast_DINAMIC_PATH + activity.target
            }`;
      } else if (activity.creationType == 'Press Release') {
        refinedActivity.message = `${trackUser.name} rejected a ${activity.creationType}`;
        refinedActivity.target = activity.isStatic
          ? `${ARTICLE_STATIC_PATH + activity.target}`
          : `${
              window.location.origin + ARTICLE_DINAMIC_PATH + activity.target
            }`;
      } else {
        refinedActivity.message = `${trackUser.name} rejected an ${activity.creationType}`;
        refinedActivity.target = activity.isStatic
          ? `${ARTICLE_STATIC_PATH + activity.target}`
          : `${
              window.location.origin + ARTICLE_DINAMIC_PATH + activity.target
            }`;
      }
    } else if (activity.activity_type.hasOwnProperty('editViews')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = activity.isPromoted;
      if (activity.creationType == 'Podcast') {
        refinedActivity.message = `${trackUser.name}  edited views of a ${activity.creationType}`;
        refinedActivity.target = activity.isStatic
          ? `${Podcast_STATIC_PATH + activity.target}`
          : `${
              window.location.origin + Podcast_DINAMIC_PATH + activity.target
            }`;
      } else if (activity.creationType == 'Press Release') {
        refinedActivity.message = `${trackUser.name}  edited views of a ${activity.creationType}`;
        refinedActivity.target = activity.isStatic
          ? `${ARTICLE_STATIC_PATH + activity.target}`
          : `${
              window.location.origin + ARTICLE_DINAMIC_PATH + activity.target
            }`;
      } else {
        refinedActivity.message = `${trackUser.name} edited views of an ${activity.creationType}`;
        refinedActivity.target = activity.isStatic
          ? `${ARTICLE_STATIC_PATH + activity.target}`
          : `${
              window.location.origin + ARTICLE_DINAMIC_PATH + activity.target
            }`;
      }
    } else if (activity.activity_type.hasOwnProperty('edit_web3')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = false;
      refinedActivity.message = `${trackUser.name} edited a web3 directory`;
      refinedActivity.target = activity.isStatic
        ? `${DIRECTORY_STATIC_PATH + activity.target}`
        : `${
            window.location.origin + DIRECTORY_DINAMIC_PATH + activity.target
          }`;
    } else if (activity.activity_type.hasOwnProperty('verify_web3')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = false;
      refinedActivity.message = `${trackUser.name} verified a web3 directory`;
      refinedActivity.target = activity.isStatic
        ? `${DIRECTORY_STATIC_PATH + activity.target}`
        : `${
            window.location.origin + DIRECTORY_DINAMIC_PATH + activity.target
          }`;
    } else if (activity.activity_type.hasOwnProperty('delete_web3')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = false;
      refinedActivity.message = `${trackUser.name} deleted a web3 directory`;
      refinedActivity.target = activity.isStatic
        ? `${DIRECTORY_STATIC_PATH + activity.target}`
        : `${
            window.location.origin + DIRECTORY_DINAMIC_PATH + activity.target
          }`;
    } else if (activity.activity_type.hasOwnProperty('editWeb3Views')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = false;
      refinedActivity.message = `${trackUser.name} edited views of a web3 directory`;
      refinedActivity.target = activity.isStatic
        ? `${DIRECTORY_STATIC_PATH + activity.target}`
        : `${
            window.location.origin + DIRECTORY_DINAMIC_PATH + activity.target
          }`;
    } else if (activity.activity_type.hasOwnProperty('delete_category')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = false;
      refinedActivity.message = `${trackUser.name} deleted a category`;
      refinedActivity.target = `${window.location.origin}/category-details?category=${activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('add_category')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = false;
      refinedActivity.message = `${trackUser.name} added a category`;
      refinedActivity.target = `${window.location.origin}/category-details?category=${activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('edit_category')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = false;
      refinedActivity.message = `${trackUser.name} edited a category`;
      refinedActivity.target = `${window.location.origin}/category-details?category=${activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('add_event')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = false;
      refinedActivity.message = `${trackUser.name} added an Event`;
      refinedActivity.target = activity.isStatic
        ? `${Event_STATIC_PATH + activity.target}`
        : `${window.location.origin + Event_DINAMIC_PATH + activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('delete_article')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = activity.isPromoted;
      refinedActivity.message = `${trackUser.name} deleted an article`;
      refinedActivity.target = activity.isStatic
        ? `${ARTICLE_STATIC_PATH + activity.target}`
        : `${window.location.origin + ARTICLE_DINAMIC_PATH + activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('delete_pressRelease')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = activity.isPromoted;
      refinedActivity.message = `${trackUser.name} deleted a Press Release`;
      refinedActivity.target = activity.isStatic
        ? `${ARTICLE_STATIC_PATH + activity.target}`
        : `${window.location.origin + ARTICLE_DINAMIC_PATH + activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('delete_podcats')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = activity.isPromoted;
      refinedActivity.message = `${trackUser.name} deleted a Podcast`;
      refinedActivity.target = activity.isStatic
        ? `${Podcast_STATIC_PATH + activity.target}`
        : `${window.location.origin + Podcast_DINAMIC_PATH + activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('edit_event')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = false;
      refinedActivity.message = `${trackUser.name} edited an Event`;
      refinedActivity.target = activity.isStatic
        ? `${Event_STATIC_PATH + activity.target}`
        : `${window.location.origin + Event_DINAMIC_PATH + activity.target}`;
    } else if (activity.activity_type.hasOwnProperty('delete_event')) {
      refinedActivity.name = activity.name;
      refinedActivity.isPromoted = false;
      refinedActivity.message = `${trackUser.name} deleted an Event`;
      refinedActivity.target = activity.isStatic
        ? `${Event_STATIC_PATH + activity.target}`
        : `${window.location.origin + Event_DINAMIC_PATH + activity.target}`;
    }
    refinedActivity.time = utcToLocalAdmin(activity.time.toString(), 'hh:mm A');
    refinedActivity.date = utcToLocalAdmin(
      activity.time.toString(),
      'DD-MM-yyyy'
    );

    refinedActivity.shoudRoute = activity.shoudRoute;
    return refinedActivity;
  };
  

  const handleActivityPageClick = async (event: any) => {
    setIsGettingActivity(true);

    let startIndex = event.selected * activitiesPerPage;
    if (tempActivities.length < startIndex + 10) {
      let sliced = tempActivities.slice(startIndex);

      let refinedActivity = await paginatedEntriesRefine(sliced);
      setUserActivity(refinedActivity);
      setIsGettingActivity(false);
    } else {
      let sliced = tempActivities.slice(startIndex, startIndex + 10);
      let refinedActivity = await paginatedEntriesRefine(sliced);
      setUserActivity(refinedActivity);
      setIsGettingActivity(false);
    }

    // setActivityForcePaginate(event.selected);
  };
  const endOffset = itemOffset + itemsPerPage;
  // const currentItems = usersList.slice(itemOffset, endOffset);
  // logger(currentItems, 'Entries That we are shownig');

  const pageCount = Math.ceil(usersSize / itemsPerPage);
  const activityPageCount = Math.ceil(activitiesSize / activitiesPerPage);
  // let endIndex =
  //   forcePaginate === 0
  //     ? activitiesPerPagesdfsdf
  //     : (forcePaginate * activitiesPerPage) % myActivity.length;

  let currentItems = userActivity;

  // Invoke when user click to request another page.
  const handlePageClick = async (event: any) => {
    setForcePaginate(event.selected);
    setIsGetting(true);
    const newOffset = (event.selected * itemsPerPage) % usersSize;
    // setItemOffset(newOffset);
    // const newItems = usersList.slice(newOffset, newOffset + itemsPerPage);
    const tempList = await userActor.get_subAdmin_users(
      search,
      newOffset,
      itemsPerPage
    );
    if (tempList) {
      // if (tempList[1])
      logger(tempList, 'tempList');
      const refinedList = await getRefinedList(tempList.users);
      logger({ refinedList, tempList, search, itemsPerPage, newOffset });
      setUsersList(refinedList);
      // setUsersSize(parseInt(tempList.amount));
    }
    setIsGetting(false);
  };
  const filter = async () => {
    setIsGetting(true);
    setForcePaginate(0);
    await getUsersList();
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
  let paginatedEntriesRefine = async (activities: any) => {
    for (let activit = 0; activit < activities.length; activit++) {
      if (
        activities[activit].activity_type.hasOwnProperty('block') ||
        activities[activit].activity_type.hasOwnProperty('unBlock')
      ) {
        let user = await userActor.get_user_details([
          activities[activit].target,
        ]);
        if (user.ok) activities[activit].name = user.ok[1].name[0];
      }
      if (activities[activit].activity_type.hasOwnProperty('editViews')) {
        const tempEntry = await entryActor.getEntry(activities[activit].target);
        let creationType = 'Content';
        if (tempEntry[0]?.pressRelease) {
          creationType = 'Press Release';
        } else if (tempEntry[0]?.isPodcast) {
          creationType = 'Podcast';
        } else {
          creationType = 'Article';
        }

        if (tempEntry && tempEntry.length != 0) {
          activities[activit].creationType = creationType;
          activities[activit].name = tempEntry[0].title;
          activities[activit].isPromoted = tempEntry[0].isPromoted;
          activities[activit].shoudRoute = true;
          activities[activit].isStatic = tempEntry[0].isStatic;
        } else {
          activities[activit].creationType = creationType;
          activities[activit].shoudRoute = false;
          activities[activit].name = activities[activit].title;
          activities[activit].isPromoted = false;
          activities[activit].isStatic = false;
        }
      }

      if (
        activities[activit].activity_type.hasOwnProperty('reject') ||
        activities[activit].activity_type.hasOwnProperty('approve')
      ) {
        const tempEntry = await entryActor.getEntry_admin(
          activities[activit].target
        );
        logger(tempEntry, 'asdfdsafdsafsd');

        let creationType = 'Content';
        if (tempEntry && tempEntry.length != 0) {
          if (tempEntry[0]?.pressRelease) {
            creationType = 'Press Release';
          } else if (tempEntry[0]?.isPodcast) {
            creationType = 'Podcast';
          } else {
            creationType = 'Article';
          }
          activities[activit].creationType = creationType;
          activities[activit].name = tempEntry[0].title;
          activities[activit].isPromoted = tempEntry[0].isPromoted;
          activities[activit].shoudRoute = true;
          activities[activit].isStatic = tempEntry[0].isStatic;
        } else {
          activities[activit].shoudRoute = false;
          activities[activit].name = activities[activit].title;
          activities[activit].isPromoted = false;
          activities[activit].creationType = creationType;
          activities[activit].isStatic = false;
        }
      }
      if (
        activities[activit].activity_type.hasOwnProperty('edit_web3') ||
        activities[activit].activity_type.hasOwnProperty('delete_web3') ||
        activities[activit].activity_type.hasOwnProperty('editWeb3Views') ||
        activities[activit].activity_type.hasOwnProperty('verify_web3')
      ) {
        let tempEntry = await entryActor.getWeb3_for_admin(
          activities[activit].target,
          userCanisterId
        );
        if (tempEntry && tempEntry.length != 0) {
          // logger(tempEntry,"tempEntrysdfsdfasdf")
          activities[activit].name = tempEntry[0].company;
          activities[activit].isPromoted = false;
          activities[activit].shoudRoute = true;
          activities[activit].isStatic = tempEntry[0].isStatic;
        } else {
          activities[activit].name = activities[activit].title;
          activities[activit].isPromoted = false;
          activities[activit].shoudRoute = false;
        }
      }
      if (
        activities[activit].activity_type.hasOwnProperty('delete_category') ||
        activities[activit].activity_type.hasOwnProperty('add_category') ||
        activities[activit].activity_type.hasOwnProperty('edit_category')
      ) {
        let tempEntry = await entryActor.get_category(
          activities[activit].target
        );
        if (tempEntry && tempEntry.length != 0) {
          activities[activit].name = tempEntry[0].name;
          activities[activit].isPromoted = false;
          activities[activit].shoudRoute = true;
        } else {
          activities[activit].name = activities[activit].title;
          activities[activit].isPromoted = false;
          activities[activit].shoudRoute = false;
        }
      }
      if (
        activities[activit].activity_type.hasOwnProperty('add_event') ||
        activities[activit].activity_type.hasOwnProperty('edit_event') ||
        activities[activit].activity_type.hasOwnProperty('delete_event')
      ) {
        let tempEntry = await entryActor.get_event(activities[activit].target);
        if (tempEntry && tempEntry.length != 0) {
          // logger(tempEntry,"tempEntrysdfsdfasdf")

          activities[activit].name = tempEntry[0].title;
          activities[activit].isPromoted = false;
          activities[activit].shoudRoute = true;
          activities[activit].isStatic = tempEntry[0].isStatic;
        } else {
          activities[activit].name = activities[activit].title;
          activities[activit].isPromoted = false;
          activities[activit].shoudRoute = false;
        }

      }
      if (
        activities[activit].activity_type.hasOwnProperty('delete_article') ||
        activities[activit].activity_type.hasOwnProperty('delete_podcats') ||
        activities[activit].activity_type.hasOwnProperty('delete_pressRelease')
      ) {
        const tempEntry = await entryActor.getEntry(activities[activit].target);
        if (tempEntry && tempEntry.length != 0) {
          activities[activit].name = tempEntry[0].title;
          activities[activit].isPromoted = tempEntry[0].isPromoted;
          activities[activit].shoudRoute = true;
          activities[activit].isStatic = tempEntry[0].isStatic;
        } else {
          activities[activit].name = activities[activit].title;
          activities[activit].isPromoted = false;
          activities[activit].shoudRoute = false;
          activities[activit].isStatic = false;
        }
       
      }
    }
    let refinedActivity: [RefinedAdminActivity] = activities.map(
      (activity: AdminActivity) => {
        return refineActivity(activity);
      }
    );
    return refinedActivity;
  };
  


  const getAdminActivity = async () => {
    setIsGettingActivity(true);
    if (trackUser) {
      const userPrincipal = Principal.fromText(trackUser.id);
      const activity = await activityActor.getAdminActivities(
        userPrincipal,
        userCanisterId,
       
      );
   
      if (activity.ok) {
       
        let activities = activity.ok[0];
      
        if (activities.length > 10) {
          setActivitiesSize(activities.length);
          setTempActivities(activities);
          let sliced = activities.slice(0, 10);
          let refinedActivity = await paginatedEntriesRefine(sliced);
          setUserActivity(refinedActivity);
        } else {
          setActivitiesSize(activities.length);
          setTempActivities(activities);
          let refinedActivity = await paginatedEntriesRefine(activities);
          setUserActivity(refinedActivity);
        }
      } else {
        setActivitiesSize(0);
        setTempActivities([]);
        setUserActivity([]);
      }
      logger({ activity, trackUser }, 'activeee');
    }
    setIsGettingActivity(false);
  };
  const handleShow = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const handleBlock = async () => {
    setApproving(true);
    logger(action, 'action');
    if (action.status) {
      const blocked = await userActor.block_sub_admin(
        action.id,
        commentCanisterId
      );
      logger(blocked);
      if (blocked.ok) {
        handleRefetch();
        toast.success(blocked.ok[0]);
        handleClose();
      } else {
        toast.error(blocked.err);
      }
    } else {
      const unblocked = await userActor.unBlock_sub_admin(
        action.id,
        commentCanisterId
      );
      logger(unblocked);
      if (unblocked.ok) {
        handleRefetch();
        toast.success(unblocked.ok[0]);
        handleClose();
      } else {
        toast.error(unblocked.err);
      }
    }
    setApproving(false);
  };
  useEffect(() => {
    if (userAuth.userPerms?.adminManagement) {
      getAdminActivity();
    }
    // const activities = await activityActor.getActivity();
  }, [trackUser]);
  useEffect(() => {
    if (auth.state === 'initialized') {
      if (userAuth.userPerms?.adminManagement && !userAuth.isAdminBlocked) {
        setIsGetting(true);
        const timer = setTimeout(() => {
          getUsersList();
          setIsGetting(false);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        router.replace('/super-admin');
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/super-admin');
    }
  }, [userAuth, auth]);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return userAuth.userPerms?.adminManagement && !userAuth.isAdminBlocked ? (
    <>
      <main id='main' className='dark'>
        <div className='main-inner admin-main'>
          <div className='section admin-inner-pnl' id='top'>
            <Row>
              <Col xl='12' lg='12'>
                <div className=''>
                  <Row>
                    <Col xl='12' lg='12' md='12' sm='12'>
                      <h1>
                        Admin Management
                        <i className='fa fa-arrow-right ms-2' />{' '}
                        <span>Track Admin</span>
                      </h1>
                      <div className='spacer-40' />
                    </Col>
                    <Col xl='6' lg='6' md='6' sm='12'>
                      <div className='spacer-10' />
                      <h5>Select Admin you want to track.</h5>
                    </Col>
                    <Col xl='6' lg='6' md='6' sm='12' className='mt-2'>
                      <div className='full-div text-right-md'>
                        <div className='search-post-pnl'>
                          <input
                            type='text'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                            placeholder='Search Admin'
                          />
                          {search.length >= 1 && (
                            <button onClick={() => setSearch('')}>
                              <i className='fa fa-xmark mx-1' />
                            </button>
                          )}
                          <button onClick={filter}>
                            <i className='fa fa-search' />
                          </button>
                        </div>
                        <div className='spacer-20' />
                      </div>
                    </Col>
                    <Col xl='12' lg='12'>
                      <div className='full-div'>
                        <div className='table-container lg'>
                          <div className='table-inner-container'>
                            {isGetting || showLoader ? (
                              <div className='d-flex justify-content-center mt-5 w-full'>
                                <Spinner />
                              </div>
                            ) : usersList.length > 0 ? (
                              <Table className='article-table p-no'>
                                <thead>
                                  <tr>
                                    <th>
                                      <p>{t('name')}</p>
                                    </th>
                                    <th>
                                      <p>Wallet Address</p>
                                    </th>
                                    <th>
                                      <p>Rights</p>
                                    </th>
                                    <th />
                                  </tr>
                                </thead>
                                <tbody>
                                  {usersList.map((rawUser: any) => {
                                    let perms = [];
                                    let user = rawUser[1];
                                    if (
                                      user.role.hasOwnProperty('user_admin')
                                    ) {
                                      perms.push('User Management');
                                    } else if (
                                      user.role.hasOwnProperty('article_admin')
                                    ) {
                                      perms.push('Article Management');
                                    } else if (
                                      user.role.hasOwnProperty('sub_admin')
                                    ) {
                                      perms.push(
                                        'User Management',
                                        'Article Management'
                                      );
                                    }

                                    return (
                                      <tr key={rawUser[0]}>
                                        <td> {user.name[0] ?? ''}</td>
                                        <td>{rawUser[0] ?? ''}</td>
                                        <td>
                                          {' '}
                                          <Tippy
                                            content={
                                              <div>
                                                {perms.map((perm, index) => (
                                                  <span key={index}>
                                                    <span>{perm}</span>
                                                    {!(
                                                      index ===
                                                      perms.length - 1
                                                    ) && ', '}
                                                  </span>
                                                ))}
                                              </div>
                                            }
                                          >
                                            <p
                                              style={{
                                                color: 'rgb(133, 133, 133)',
                                              }}
                                            >
                                              {perms[0] + ' '}{' '}
                                              {perms.length > 1 &&
                                                '+' +
                                                  (perms.length - 1) +
                                                  ' more'}
                                            </p>
                                          </Tippy>
                                        </td>

                                        <td className='text-center'>
                                          {rawUser[1].isAdminBlocked ? (
                                            <Button
                                              className={`reg-btn2 me-2 trackbtn`}
                                              onClick={() => {
                                                setAction({
                                                  status: false,
                                                  id: rawUser[0],
                                                  name: user.name[0],
                                                });
                                                handleShow();
                                              }}
                                            >
                                              {' '}
                                              <i
                                                className='fa fa-unlock ms-0'
                                                style={{
                                                  cursor: 'pointer',
                                                }}
                                              />
                                            </Button>
                                          ) : (
                                            <Button
                                              className={`reg-btn2 me-2 trackbtn`}
                                              onClick={() => {
                                                setAction({
                                                  status: true,
                                                  id: rawUser[0],
                                                  name: user.name[0],
                                                });
                                                handleShow();
                                              }}
                                            >
                                              <i
                                                className='fa fa-ban ms-0'
                                                style={{
                                                  cursor: 'pointer',
                                                }}
                                              />
                                            </Button>
                                          )}
                                          <Button
                                            onClick={() => {
                                              setTrackUser({
                                                id: rawUser[0],
                                                name: user.name,
                                              });
                                              setTraceBtnActive(user.name);
                                            }}
                                            className={`reg-btn fill bg-fix trackbtn ms-1${
                                              tracebtnactive == user.name
                                                ? 'active'
                                                : ''
                                            }`}
                                          >
                                            Track
                                          </Button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  {/* <tr>
                                    <td>John Doe</td>
                                    <td>
                                      0x717d9eb1adb0BA02F8B012B046300b4c4cd3740a
                                    </td>
                                    <td>User Management +1</td>
                                    <td className='text-center'>
                                      <Button href='#' className='reg-btn fill'>
                                        Track
                                      </Button>
                                    </td>
                                  </tr> */}
                                  <Modal
                                    show={showModal}
                                    // size='md'
                                    centered
                                    onHide={handleClose}
                                  >
                                    <Modal.Header closeButton>
                                      <h3 className='text-center'>
                                        {action.status ? 'Block' : 'UnBlock'}
                                      </h3>
                                    </Modal.Header>
                                    <Modal.Body>
                                      <p>
                                        Are you sure you want to{' '}
                                        {action.status ? 'block' : 'unblock'}{' '}
                                        {action.name}?
                                      </p>
                                    </Modal.Body>
                                    <Modal.Footer>
                                      <Button
                                        className='publish-btn'
                                        onClick={handleBlock}
                                      >
                                        {approving ? (
                                          <Spinner size='sm' />
                                        ) : action.status ? (
                                          'Block'
                                        ) : (
                                          'UnBlock'
                                        )}
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
                                </tbody>
                              </Table>
                            ) : (
                              <div className='d-flex justify-content-center mt-5 w-full'>
                                <h4>No Admins found</h4>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col>
                      <div className='pagination-container mystyle d-flex justify-content-center justify-content-lg-end'>
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
                    <Col xl='12' lg='12' md='12' sm='12'>
                      <div className='spacer-20' />
                      {trackUser ? (
                        <h5>
                          Activities of <span>{trackUser.name}</span>
                        </h5>
                      ) : !isGetting && !showLoader && usersList.length > 0 ? (
                        <p className='h5 text-center'>
                          <p className='text-center'>
                            Please select an admin to track their activities
                          </p>
                        </p>
                      ) : null}
                    </Col>
                    {trackUser && (
                      <Col xl='12' lg='12'>
                        {isGettingActivity ? (
                          <div className='d-flex justify-content-center mt-5 w-full'>
                            <Spinner />
                          </div>
                        ) : currentItems && currentItems.length > 0 ? (
                          <div className='full-div'>
                            <div className='table-container lg'>
                              <div className='table-inner-container'>
                                <Table bordered className='article-table p-no'>
                                  <thead>
                                    <tr>
                                      <th>
                                        <p>{t('Activities')}</p>
                                      </th>
                                      <th>
                                        <p>{t('date')}</p>
                                      </th>
                                      <th>
                                        <p>Time</p>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {currentItems?.map(
                                      (
                                        activity: RefinedAdminActivity,
                                        index: number
                                      ) => (
                                        <tr key={index}>
                                          <td>
                                            {activity.message}{' '}
                                            {activity.isPromoted && (
                                              <Tippy
                                                content={
                                                  <p className='mb-0'>
                                                    Promoted article
                                                  </p>
                                                }
                                              >
                                                <Image
                                                  src={proimg}
                                                  alt='promoted icon'
                                                  height={15}
                                                  width={15}
                                                  className='mx-1'
                                                />
                                              </Tippy>
                                            )}
                                            <Link
                                              onClick={(e) => {
                                                e.preventDefault();
                                                if (activity.shoudRoute) {
                                                  openLink(activity.target);
                                                }
                                              }}
                                              href='#'
                                              style={{
                                                cursor: activity.shoudRoute
                                                  ? 'pointer'
                                                  : 'not-allowed',
                                              }}
                                            >
                                              {activity.name.length > 20
                                                ? `${activity.name.slice(
                                                    0,
                                                    20
                                                  )}...`
                                                : activity.name}
                                            </Link>
                                          </td>
                                          <td>{activity.date}</td>
                                          <td>{activity.time}</td>
                                        </tr>
                                      )
                                    )}
                                    {/* <tr>
                                    <td>John Doe Blocked @user _325</td>
                                    <td>23-11-2023</td>
                                    <td>12:31 PM</td>
                                  </tr> */}
                                  </tbody>
                                </Table>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className='text-center'>
                            No Activity Found for {trackUser.name}
                          </p>
                        )}
                      </Col>
                    )}
                    <div className='d-flex justify-content-end mt-2'>
                      <div
                        className='pagination-container'
                        style={{ width: 'auto' }}
                      >
                        <ReactPaginate
                          breakLabel='...'
                          nextLabel=''
                          onPageChange={handleActivityPageClick}
                          pageRangeDisplayed={5}
                          pageCount={activityPageCount}
                          previousLabel=''
                          renderOnZeroPageCount={null}
                          forcePage={activityForcePaginate}
                        />
                      </div>
                    </div>
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
