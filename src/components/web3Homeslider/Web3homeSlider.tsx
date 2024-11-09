import React, { useEffect, useState } from 'react';
import 'slick-carousel/slick/slick.css';
import Slider from 'react-slick';
import Link from 'next/link';
import Image from 'next/image';
import logger from '@/lib/logger';
import { useRouter } from 'next/navigation';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { getImage } from '@/components/utils/getImage';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { fromNullable } from '@dfinity/utils';
import { formatLikesCount } from '@/components/utils/utcToLocal';
import tempimg from '@/assets/Img/banner-1.png';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import {
  DIRECTORY_DINAMIC_PATH,
  DIRECTORY_STATIC_PATH,
} from '@/constant/routes';
export default function Web3HomeSlider({ category }: { category?: any }) {
  const { t, changeLocale } = useLocalization(LANG);
  let [trendingDirectries, setTrendingDirectries] = useState([]);
  let [categoryName, setCategoryName] = useState<any>(null);

  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));
  const router = useRouter();
  let getWeb3ByCategory = async (catagoryId: string) => {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    const defaultEntryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let TempDirectory = [];
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers(
      catagoryId,
      '',
      0,
      10
    );

    // logger(tempWeb3, 'tempWeb3tt');
    if (tempWeb3?.web3List?.length != 0) {
      // let web3array = tempWeb3.web3List.filter((e:string)=>e[0]!=directoryId);

      let web3array = tempWeb3.web3List;
      for (let dirc = 0; dirc < web3array.length; dirc++) {
        let resp = await defaultEntryActor.get_category(
          web3array[dirc][1].catagory
        );
        let category: any = fromNullable(resp);
        logger(web3array[dirc][1], 'tempWeb3tt43');

        if (category) {
          web3array[dirc][1].categoryName = category.categoryName;
        }

        web3array[dirc][1].companyBanner = await getImage(
          web3array[dirc][1].companyBanner
        );
        web3array[dirc][1].founderImage = await getImage(
          web3array[dirc][1].founderImage
        );
        web3array[dirc][1].companyLogo = await getImage(
          web3array[dirc][1].companyLogo
        );
      }
      TempDirectory = web3array;
    }
    return TempDirectory;
  };
  let getDirectoriesTopCategories = async (category: any) => {
    const result = await getWeb3ByCategory(category);

    setTrendingDirectries(result);

    logger(result, 'listCatagory');
  };
  var Directory = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 5000,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 1800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };
  async function categoryNamefn(cat: string) {
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });
    let resp = await entryActor.get_category(cat);
    let resCategory: any = fromNullable(resp);
    let categoryName = null;
    if (resCategory) {
      categoryName = resCategory.name;
    }
    setCategoryName(categoryName);
  }
  useEffect(() => {
    if (category && category != '') {
      getDirectoriesTopCategories(category);
      categoryNamefn(category);
    } else {
      getDirectoriesTopCategories('All');
    }
  }, [category]);

  let openArticleLink = (entryLink: any) => {
    router.push(entryLink);
  };
  return (
    <>
      {trendingDirectries.length != 0 ? (
        <Slider {...Directory}>
          {trendingDirectries.map((entry: any) => {
            return (
              <div className='Post-padding' key={entry[0]}>
                <Link
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();

                    openArticleLink(
                      entry[1].isStatic
                        ? `${DIRECTORY_STATIC_PATH + entry[0]}`
                        : `${
                            entry.length != 0
                              ? DIRECTORY_DINAMIC_PATH + entry[0]
                              : DIRECTORY_DINAMIC_PATH + '#'
                          }`
                    );
                  }}
                  className='Product-post direc'
                  style={{ maxWidth: '370px' }}
                >
                  <div className='Product-post-inner'>
                    <div className='img-pnl homeslider'>
                      {/* <Image
                  src={'/images/b-b.png'}
                  width={213}
                  height={133}
                  alt='Blockza'
                /> */}
                      <Image
                        src={entry[1]?.companyBanner ?? tempimg}
                        alt='founder image'
                        height={100}
                        width={100}
                        style={{ height: '100%', width: '100%' }}
                      />
                    </div>
                    <div className='text-pnl'>
                      <div className='d-flex'>
                        <div className='logo-img'>
                          <Image
                            src={entry[1]?.companyLogo ?? '/images/l-b.png'}
                            width={15}
                            height={16}
                            alt='Blockza'
                          />
                        </div>
                        <div className='heading-txt-pnl'>
                          <h3>
                            {entry[1]?.company.length > 15
                              ? `${entry[1]?.company.slice(0, 15)}...`
                              : entry[1]?.company ?? ''}
                          </h3>
                          <p style={{ minHeight: 84 }}>
                            {entry[1]?.shortDescription.length > 50
                              ? `${entry[1]?.shortDescription.slice(0, 50)}...`
                              : entry[1]?.shortDescription ?? ''}
                          </p>
                        </div>
                      </div>
                      <ul>
                        <li>
                          {formatLikesCount(Number(entry[1]?.totalCount)) ?? 0}
                          <span>{t('Posts')}</span>
                        </li>
                        <li>
                          {formatLikesCount(Number(entry[1]?.views)) ?? 0}
                          <span>{t('Views')}</span>
                        </li>
                        <li>
                          {formatLikesCount(Number(entry[1]?.likes)) ?? 0}
                          <span>{t('Likes')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='txt-pnl' style={{ height: '135px' }}>
                    <p style={{ overflow: 'hidden', height: '40px' }}>
                      <i>
                        {/* {entry[1]?.founderDetail.length > 50
                        ? `${entry[1]?.founderDetail.slice(0, 50)}...`
                        : entry[1]?.founderDetail ?? ''} */}
                        {entry[1]?.founderDetail}
                      </i>
                    </p>
                    <div className='img-pnl'>
                      <Image
                        src={entry[1]?.founderImage ?? '/images/l-n.png'}
                        width={20}
                        height={20}
                        alt='Girl'
                      />

                      <div>
                        <h5>{entry[1]?.founderName ?? ''}</h5>
                        <p>{t('Founder')}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </Slider>
      ) : (
        <h6 className='text-center'>
          {t('No Related Company found')}{' '}
          {categoryName ? `${t('ON')} ${categoryName} ${t('Category')}` : ''}
        </h6>
      )}
    </>
  );
}
