'use client';
import Image from 'next/image';
import arrows from '@/assets/Img/Icons/icon-arrows.png';
import { Col, Table } from 'react-bootstrap';
import DirectoryArticle from '@/components/DirectoryArticle';
import logger from '@/lib/logger';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname } from 'next/navigation'
export default function DirectoryItems({
  currentItems,
  handleRefetch,
}: {
  currentItems: any;
  handleRefetch: () => void;
}) {
  const location = usePathname();
  let language;

  const changeLang = () => {
    if (LANG === 'jp') {
      language = location.includes('super-admin/') ? 'en' : 'jp';
    }
    else{
      language = "en"
    }
  };
  const funcCalling = changeLang()
  const { t, changeLocale } = useLocalization(language);
  logger(currentItems, 'currentItems5423');
  return (
    <Col xl='12' lg='12'>
      <div className='full-div'>
        <div className='table-container lg'>
          <div className='table-inner-container'>
            <Table striped hover className='article-table'>
              <thead>
                <tr>
                  <th>
                    <p>
                     {t('Company')}<Image className='arw' src={arrows} alt='arrow' />
                    </p>
                  </th>
                  <th>{t('Founder')}</th>
                  <th>{t('categories')}</th>
                  <th className='d-flex align-items-center'>{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((article: any, index: number) => {
                  return (
                    <DirectoryArticle
                      handleRefetch={handleRefetch}
                      article={article}
                      key={index}
                    />
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Col>
  );
}
