'use client';
import AddQuizComponent from '@/components/QuizListComponent/AddQuizComponent';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname } from 'next/navigation';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
export default function Page() {
    const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  let quizId = searchParams.get('quizId');
  const location = usePathname();
  let language;

  const changeLang = () => {
    if (LANG === 'jp') {
      language = location?.includes('super-admin/') ? 'en' : 'jp';
    } else {
      language = 'en';
    }
  };
  const funcCalling = changeLang();
  const { t, changeLocale } = useLocalization(language);
  return (
    <>
      <main id='main' className='dark'>
        <div className='main-inner admin-main'>
          <div className='section admin-inner-pnl' id='top'>
            <Row>
              <Col xl='9' lg='12' className='text-left'>
                <h1>{quizId?t('Edit Quiz'):t('Add Quiz')}</h1>
                <div className='spacer-20' />
                <AddQuizComponent />
              </Col>
            </Row>
            <div className='mt-4' />
          </div>
        </div>
      </main>
    </>
  );
}
