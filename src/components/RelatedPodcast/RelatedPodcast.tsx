import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import smallpost1 from '@/assets/Img/Posts/Small-Post-4.png';
import logger from '@/lib/logger';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { makeEntryActor, makeUserActor } from '@/dfx/service/actor-locator';
import { getImage, iframeimgThumbnail } from '@/components/utils/getImage';
import { ARTICLE_FEATURED_IMAGE_ASPECT } from '@/constant/sizes';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { Podcast_DINAMIC_PATH, Podcast_STATIC_PATH } from '@/constant/routes';
import useLocalization from "@/lib/UseLocalization"
import { LANG } from '@/constant/language';
interface MyComponentProps {
  catagorytype: string[];
}

let RelatedPodcast: React.FC<MyComponentProps> = ({ catagorytype }) => {
  const [entriesByCategory, setEntriesByCategory] = useState([]);

  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const podcastId = searchParams.get('podcastId');
  const [isLoading, setIsLoading] = useState(true);

  const { identity } = useConnectPlugWalletStore((state) => ({
    identity: state.identity,
  }));
  const getEntriesList = async (selectedCategory?: string) => {
    setIsLoading(true)
    const categ = selectedCategory;
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const userAcotr = makeUserActor({
      agentOptions: {
        identity,
      },
    });
    //  dataType for below function 
// 1 =pressRelease
// 2 =podcast
// 3 =article

    const resp = await entryActor.getUniqueDataList(categ, false, '', 0, 4,2);
    const tempList = resp.entries;
    let filterd = tempList.filter((e: any) => e[0] != podcastId);
    let tempentries = [];
    if (filterd.length > 3) {
      const firstitems = filterd.slice(0, 3);
      tempentries = firstitems;
      // setEntriesByCategory(firstitems);
    } else {
      tempentries = filterd;
      // setEntriesByCategory(filterd);
    }
    if (tempentries.length != 0) {
      setEntriesByCategory(tempentries);
      setIsLoading(false)
      return tempList;
    }
  };
  useEffect(() => {
    if (catagorytype) {
      getEntriesList(catagorytype[0]);
    }
  }, [catagorytype, podcastId]);
  const { t, changeLocale } = useLocalization(LANG);
  return (
    <>
      {entriesByCategory.length == 0 && !isLoading && (
        <div className=''>
          <p className='fs-5 text-center'>No related Podcast</p>
        </div>
      )}
      {entriesByCategory &&
        entriesByCategory.map((entry: any, index) => {
          let dateformat = (t: any) => {
            const date = new Date(Number(t));
            return date.toDateString();
          };
          let image = null;
          if (entry[1].podcastVideoLink != '') {
            image = iframeimgThumbnail(entry[1].podcastVideoLink);
          }
          if (entry[1].podcastImg.length != 0) {
            image = getImage(entry[1].podcastImg[0]);
          }
          return (
            <div className='related-post' key={index}>
              <div className='related-post-inner'>
                <div className='img-pnl'>
                  <Link
                    href={entry[1]?.isStatic?`${Podcast_STATIC_PATH+entry[0]}`:`${Podcast_DINAMIC_PATH+entry[0]}`}
                    className='img-wrapper'
                    style={{ aspectRatio: ARTICLE_FEATURED_IMAGE_ASPECT }}
                  >
                    <Image
                      src={image ? image : smallpost1}
                      // style={{height:"194px",width: "259px"}}
                      fill
                      alt='Post'
                    />
                    {/* <div
                      dangerouslySetInnerHTML={{ __html: entry[1].podcastVideoLink }}
                      style={{ height: '100%', width: '100%',pointerEvents:"none" }}
                    /> */}
                  </Link>
                </div>
                <div className='txt-pnl'>
                  <Link
                    href={entry[1]?.isStatic?`${Podcast_STATIC_PATH+entry[0]}`:`${Podcast_DINAMIC_PATH+entry[0]}`}
                    className='rmLine'
                  >
                    {entry[1].title}
                  </Link>
                  <span>
                    <Link
                      href={`/profile?userId=${entry[1].user.toString()}`}
                      className='rmLine'
                    >
                    {t('By')} {entry[1].userName}
                    </Link>
                  </span>
                  <span>{dateformat(entry[1].creation_time)}</span>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};
export default RelatedPodcast;
