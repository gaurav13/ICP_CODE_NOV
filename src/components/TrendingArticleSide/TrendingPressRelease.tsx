import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import { Col } from 'react-bootstrap';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeCommentActor, makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import parse from 'html-react-parser';
import { formatLikesCount, utcToLocal } from '@/components/utils/utcToLocal';
import { Date_m_d_y_h_m } from '@/constant/DateFormates';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { ARTICLE_DINAMIC_PATH, ARTICLE_STATIC_PATH } from '@/constant/routes';

export default React.memo(function TrendingPressReleaseSide({
  isArticle,
}: {
  isArticle: boolean;
}) {
  let [entries, setEntries] = useState<any>([]);
  const { t, changeLocale } = useLocalization(LANG);
  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));
  const entryActorDefault = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const commentsActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
  let getTrendingAricle = async () => {
    let tempComments = 0;
    let result = [];
    let res = await entryActorDefault.trendingEntryItemSidebar(4);
    if (res.length != 0) {
      for (let index = 0; index < res.length; index++) {
        res[index][1].creation_time = utcToLocal(
          res[index][1].creation_time,
          Date_m_d_y_h_m
        );
        res[index][1].views = formatLikesCount(parseInt(res[index][1].views));
        const comments = await commentsActor.getComments(res[index][0]);
        if (comments.ok) {
          // logger(comments.ok, 'trendingEntryItemSidebar');

          res[index][1].comments = comments.ok[0].length;
        } else {
          res[index][1].comments = tempComments;
        }
      }
      result = res;
    }
    setEntries(result);
    logger(res, 'dg');
  };
  let getTrendingPressRelease = async () => {
    let tempComments = 0;
    let result = [];
    let res = await entryActorDefault.trendingPressReleaseItemSidebar(4);
    if (res.length != 0) {
      for (let index = 0; index < res.length; index++) {
        res[index][1].creation_time = utcToLocal(
          res[index][1].creation_time,
          Date_m_d_y_h_m
        );
        res[index][1].views = formatLikesCount(parseInt(res[index][1].views));

        const comments = await commentsActor.getComments(res[index][0]);
        if (comments.ok) {
          // logger(comments.ok, 'trendingEntryItemSidebar');

          res[index][1].comments = comments.ok[0].length;
        } else {
          res[index][1].comments = tempComments;
        }
      }
      result = res;
    }
    setEntries(result);
    logger(res, 'trendingEntryItemSidebar');
  };

  useEffect(() => {
    if (isArticle) {
      getTrendingAricle();
    } else {
      getTrendingPressRelease();
    }
  }, [isArticle]);

  return (
    <>
      {entries.length != 0 &&
        entries.map((entry: any) => {
          return (
            <Col xxl='12' xl='12' lg='12' md='12' sm='12' key={entry[0]}>
              <div className='general-post auto stories-wala'>
                <div className='txt-pnl'>
                  <span className='mobile-view-display  red-span'>
                    {entry[1].creation_time}
                  </span>
                  <Link
                    href={
                      entry[1].isStatic
                        ? `${ARTICLE_STATIC_PATH + entry[0]}`
                        : `${ARTICLE_DINAMIC_PATH + entry[0]}`
                    }
                  >
                    <h6 style={{ maxHeight: '20px', overflow: 'hidden' }}>
                      {entry[1].title}
                    </h6>
                  </Link>
                  <p className='web-view-display '>{entry[1].creation_time}</p>
                  <p
                    className='customstyle'
                    style={{ maxHeight: '45px', overflow: 'hidden' }}
                  >
                    {entry[1]?.seoExcerpt}
                  </p>
                  <ul className='thumb-list'>
                    <li className=''>
                      <Link
                        href={
                          entry[1].isStatic
                            ? `${ARTICLE_STATIC_PATH + entry[0]}`
                            : `${ARTICLE_DINAMIC_PATH + entry[0]}`
                        }
                      >
                        <Image src={iconthumb} alt='Icon Thumb' />{' '}
                        {formatLikesCount(Number(entry[1].likes))}
                      </Link>
                      <Link
                        href={
                          entry[1].isStatic
                            ? `${ARTICLE_STATIC_PATH + entry[0]}?route=comments`
                            : `${
                                ARTICLE_DINAMIC_PATH + entry[0]
                              }&route=comments`
                        }
                      >
                        <Image src={iconmessage} alt='Icon Comment' />{' '}
                        {entry[1].comments} {t('Comments')}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={
                          entry[1].isStatic
                            ? `${ARTICLE_STATIC_PATH + entry[0]}`
                            : `${ARTICLE_DINAMIC_PATH + entry[0]}`
                        }
                        className='ms-1'
                      >
                        <div className='viewbox'>
                          <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                          {t('Views')} <span className='mx-1'>|</span>
                          {entry[1].views ? entry[1].views : 0}
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          );
        })}
    </>
  );
});
