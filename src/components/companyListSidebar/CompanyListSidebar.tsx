import { getImage } from '@/components/utils/getImage';
import { profileAspect } from '@/constant/sizes';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { fromNullable } from '@dfinity/utils';
import tempimg from '@/assets/Img/Icons/icon-podcast-1.png';
import Image from 'next/image';
import React, { use, useEffect, useState } from 'react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Link from 'next/link';
import { DIRECTORY_DINAMIC_PATH, DIRECTORY_STATIC_PATH } from '@/constant/routes';
import { siteConfig } from '@/constant/config';

export default function CompanyListSidebar({
  contentLength,
}: {
  contentLength?: number;
}) {
  const { t, changeLocale } = useLocalization(LANG);
  const { auth, setAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: state.auth,
    setAuth: state.setAuth,
    identity: state.identity,
  }));
  let [companies, setCompanies] = useState<any>([]);
  let [loading, setLoading] = useState<any>([]);

  let getAllWeb3List = async (searchString = '') => {
    logger(searchString, 'searchString');
    const entryActor = makeEntryActor({
      agentOptions: {
        identity,
      },
    });

    let TempDirectory = null;
    let amount = contentLength ? contentLength : 3;
    let tempWeb3 = await entryActor.getWeb3ListOfAllUsers('All', '', 0, amount);

    if (tempWeb3?.web3List?.length != 0) {
      let web3array = tempWeb3.web3List;

      for (let dirc = 0; dirc < web3array.length; dirc++) {
        let resp = await entryActor.get_category(web3array[dirc][1].catagory);
        let category: any = fromNullable(resp);
        let categoryName = 'No Category';
        if (category) {
          categoryName = category.name;
        }
        web3array[dirc][1].catagory = categoryName;
        if (web3array[dirc][1].companyLogo) {
          web3array[dirc][1].companyLogo = await getImage(
            web3array[dirc][1].companyLogo
          );
        } else {
          web3array[dirc][1].companyLogo = tempimg;
        }
      }
      TempDirectory = web3array.sort(
        (f: any, l: any) => Number(l[1].likes) - Number(f[1].likes)
      );
    }
    if (TempDirectory) {
      setCompanies(TempDirectory);
    } else {
      setCompanies([]);
    }
    setLoading(false);
    logger(tempWeb3, 'tempWeb3432');
  };
  useEffect(() => {
    getAllWeb3List();
  }, [identity]);
  return (
    <ul className='follow-list wbg'>
      {loading
        ? ''
        : companies.lenght != 0 &&
          companies.map((entry: any) => {
            return (
              <li key={entry[0]}>
                <div className='user-panel'>
                  <div
                    className='img-pnl position-relative'
                    style={{ aspectRatio: profileAspect, width: '60px' }}
                  >
                    <Image src={entry[1].companyLogo} fill alt='Arb' />
                  </div>
                  <div className='txty-pnl'>
                    <Link href={entry[1].isStatic? `${DIRECTORY_STATIC_PATH +entry[0]}`:`${DIRECTORY_DINAMIC_PATH+entry[0]}`}>
                      <h4>{entry[1]?.company}</h4>
                    </Link>
                    <p>{entry[1]?.shortDescription}</p>
                    <Link
                      href={siteConfig.twitterLink}
                      className='follow-btn'
                    >
                      +{t('Follow')}
                    </Link>
                  </div>
                </div>
              </li>
            ); 
          })}
    </ul>
  );
}
