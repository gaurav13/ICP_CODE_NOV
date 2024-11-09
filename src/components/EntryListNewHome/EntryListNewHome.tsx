import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import parse from 'html-react-parser';
import promotedIcon from '@/assets/Img/promoted-icon.png';
import pressicon from '@/assets/Img/Icons/icon-press-release.png';
import iconthumb from '@/assets/Img/Icons/icon-thumb.png';
import iconmessage from '@/assets/Img/Icons/icon-comment.png';
import { useRouter } from 'next/navigation';
import Tippy from '@tippyjs/react';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { ARTICLE_DINAMIC_PATH, ARTICLE_STATIC_PATH } from '@/constant/routes';
import { makeCommentActor, makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { useConnectPlugWalletStore } from '@/store/useStore';
import logger from '@/lib/logger';
import { getImage } from '@/components/utils/getImage';
import { fromNullable } from '@dfinity/utils';
import iconbnb from '@/assets/Img/icon-bnb.png';
import iconrss from '@/assets/Img/Icons/icon-rss.png';

export default React.memo(function EntryListNewHome({

  connectModel,
  categoryId,
  categoryName
}: {
  connectModel: any;
  categoryId:string;
  categoryName:string;

}) {
  const { auth, setAuth, identity, principal } = useConnectPlugWalletStore(
    (state) => ({
      auth: state.auth,
      setAuth: state.setAuth,
      identity: state.identity,
      principal: state.principal,
    })
  );
  const [entries, setEntries] = useState<any>([]);

  let router = useRouter();
  let openArticleLink = (articleLink: any) => {
    router.push(articleLink);

  };
  /*
   * makeEntryActor use to create an entry actor
   * params {agentOptions: {
      identity,
    },}
   */
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
    /*
   * makeUserActor use to create an user actor
   * params {agentOptions: {
      identity,
    },}
   */
  const userAcotr = makeUserActor({
    agentOptions: {
      identity,
    },
  });
    /*
   * makeCommentActor use to create an comment actor
   * params {agentOptions: {
      identity,
    },}
   */
  const commentsActor = makeCommentActor({
    agentOptions: {
      identity,
    },
  });
  let refineEntries = async (entriesList: any) => {
    logger(entriesList, 'entriesList22');
  
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
 
    for (let entry = 0; entry < entriesList.length; entry++) {
      let newUser = null;
      let TempDirectory = null;
      var authorId = entriesList[entry][1].user.toString();
      newUser = await userAcotr.get_user_details([authorId]);
      const comments = await commentsActor.getComments(entriesList[entry][0]);
      let resp = await entryActor.get_category(
        entriesList[entry][1].category[0]
      );
      let category: any = fromNullable(resp);
      let categoryName = 'No Category';
      let categoryLogo: any = iconbnb;
      if (category) {
        categoryName = category.name;
        if (category?.logo) {
          categoryLogo = getImage(category.logo);
        }
      }
      if (entriesList[entry][1].isCompanySelected) {
        let directoryGet = await entryActor.getWeb3(
          entriesList[entry][1].companyId
        );
        if (directoryGet.length != 0) {
          directoryGet[0].companyBanner = await getImage(
            directoryGet[0].companyBanner
          );
          directoryGet[0].founderImage = await getImage(
            directoryGet[0].founderImage
          );
          directoryGet[0].companyLogo = await getImage(
            directoryGet[0].companyLogo
          );
          TempDirectory = directoryGet;
        }
        logger(TempDirectory, 'TempDirectory2');
      }
      if (comments.ok) {
        // setArticleComments(comments.ok[0]);
        let tempComments = comments.ok[0];

        let tempComment = tempComments[0];
        let commenterId = tempComment.user;
        let authorDetails = await userAcotr.get_user_name(commenterId);
        if (authorDetails[0]?.image.length > 0) {
          tempComment.image = await getImage(authorDetails[0].image[0]);
        } else {
          tempComment.image = false;
        }
        logger({ authorDetails }, 'Name of comments');
        tempComment.author = authorDetails[0].name;
        tempComment.comments = tempComments.length;
        entriesList[entry][1].comment = tempComment;
        // logger({ Comment: comments.ok[0], identity }, 'THEM DOMMENTS');
      }
      if (newUser.ok) {
        if (newUser.ok[1].profileImg.length != 0) {
          newUser.ok[1].profileImg = await getImage(
            newUser.ok[1].profileImg[0]
          );
        }
        entriesList[entry][1].userId = authorId;
        entriesList[entry][1].user = newUser.ok[1];
      }
      entriesList[entry][1].image[0] = await getImage(
        entriesList[entry][1].image[0]
      );
      entriesList[entry][1].directory = TempDirectory;
      entriesList[entry][1].categoryName = categoryName;
      entriesList[entry][1].categoryLogo = categoryLogo;
    }
    return entriesList;
  };
  /**
   * getEntries use to article, podcasts and pressrelease created on given category id
   * @param category | null
   */
  const getEntries = async (category: string | null) => {
    try {
 

      const tempEntries = await entryActor.getAllEntries(category);
      if (tempEntries.length > 5) {
        const filteredEntries = tempEntries.slice(0, 5);
        let refined = await refineEntries(filteredEntries);
    
        let [bcaa, ...restEntries] = refined;
        setEntries(restEntries);
        // setLoading(false);
      } else if (tempEntries.length != 0) {
        let refined = await refineEntries(tempEntries);

        let [bcaa, ...restEntries] = refined;
        setEntries(restEntries);

        // setLoading(false);
      } else {
        // setLoading(false);
      }

    } catch (err) {
      // setLoading(false);
    }
  };
  const { t, changeLocale } = useLocalization(LANG);

  useEffect(() => {
    getEntries(categoryId)
  
  
  }, [categoryId])
  
  return (
    <>
    {entries && entries.length!=0 && <><Col
                    xl='12'
                    lg='12'
                    md='12'
                    className='heding'
                    id='blockchain'
                  >
                    <h2>
                      <Image src={iconrss} alt='RSS' /> {t(categoryName)}
                    </h2>
                    <div className='spacer-20' />
                  </Col>
                  <div className='homeCategoryEntries'>

    
      { entries.map((ent: any) => {
        return (
          <>
          
          <Col xxl='3' xl='6' lg='6' md='6' sm='6' key={ent[0]}>
            <div className='general-post new'>
              <div
                className='img-wrapper'
                style={{
                  aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT,
                }}
              >
                <Image
                  src={ent[1].image[0]}
                  className='mb-2'
                  alt={ent[1].caption ?? 'general post'}
                  // width={100}
                  fill
                  // height={100}
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    openArticleLink(
                      ent[1].isStatic
                        ? `${ARTICLE_STATIC_PATH + ent[0]}`
                        : `${
                            ent[0].length != 0
                              ? ARTICLE_DINAMIC_PATH + ent[0]
                              : ARTICLE_DINAMIC_PATH + '#'
                          }`
                    )
                  }
                />
              </div>

              <div className='txt-pnl'>
                <div className='spacer-10' />
                <Link
                  href={
                    ent[1].isStatic
                      ? `${ARTICLE_STATIC_PATH + ent[0]}`
                      : `${
                          ent[0].length != 0
                            ? ARTICLE_DINAMIC_PATH + ent[0]
                            : ARTICLE_DINAMIC_PATH + '#'
                        }`
                  }
                  target='_self'
                >
                  <h6>
                    {ent[1].isPromoted ? (
                      <Tippy
                        content={
                          <p className='mb-0'>{t('Promoted Article')}</p>
                        }
                      >
                        <Image
                          src={promotedIcon}
                          alt='promoted'
                          style={{ width: 20, height: 20 }}
                        />
                      </Tippy>
                    ) : // <span className='publish-btn table-btn'>
                    //   promotedIcon
                    // </span>
                    ent[1].pressRelease ? (
                      <Tippy
                        content={<p className='mb-0'>{t('Press Release')}</p>}
                      >
                        <Image
                          src={pressicon}
                          alt='promoted'
                          style={{ width: 20, height: 20 }}
                        />
                      </Tippy>
                    ) : (
                      <></>
                    )}{' '}
                    {ent[1].title.length > 60
                      ? `${ent[1].title.slice(0, 60)}...`
                      : ent[1].title}
                  </h6>
                </Link>
                <p
                  className='elipscls'
                  style={{
                    maxHeight: '48px',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    openArticleLink(
                      ent[1].isStatic
                        ? `${ARTICLE_STATIC_PATH + ent[0]}`
                        : `${
                            ent[0].length != 0
                              ? ARTICLE_DINAMIC_PATH + ent[0]
                              : ARTICLE_DINAMIC_PATH + '#'
                          }`
                    )
                  }
                >
                  {ent[1]?.seoExcerpt}
                  {/* {ent[1]?.seoExcerpt.length>65? `${ent[1]?.seoExcerpt.slice(0,65)}...`:ent[1]?.seoExcerpt ?? ''} */}
                </p>
                <ul className='thumb-list flex'>
                  <li>
                    <a href='#' onClick={connectModel}>
                      <Image src={iconthumb} alt='Icon Thumb' />{' '}
                      {Number(ent[1].likes) != 0
                        ? formatLikesCount(Number(ent[1].likes))
                        : 0}
                    </a>

                    <a
                      className='web-view-display'
                      href='#'
                      onClick={connectModel}
                    >
                      <Image src={iconmessage} alt='Icon Comment' />
                      {ent[1]?.comment?.comments ?? 0} {t('Comments')}
                    </a>
                  </li>
                  <li>
                    <Link href={`#`} onClick={connectModel} className='ms-1'>
                      <div className='viewbox'>
                        <i className='fa fa-eye fill blue-icon fa-lg me-1' />
                        {t('Views')}
                        <span className='mx-1'>|</span>

                        {Number(ent[1].views) != 0
                          ? formatLikesCount(Number(ent[1].views))
                          : 0}
                      </div>
                    </Link>
                    <a
                      className='mobile-view-display mobile-cmnt-btn ss'
                      href='#'
                      onClick={connectModel}
                    >
                      <Image src={iconmessage} alt='Icon Comment' />
                      {ent[1]?.comment?.comments ?? 0}
                      {t('Comments')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          </>
        );
      })}
              </div>
      </>
}
    </>
  );
});
