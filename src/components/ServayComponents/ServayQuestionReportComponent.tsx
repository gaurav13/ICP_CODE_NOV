import { array, number, object, string } from 'yup';
import { toast } from 'react-toastify';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Button, Table, Modal, Spinner } from 'react-bootstrap';
import { FormikProps, FormikValues } from 'formik';
import { useRouter } from 'next/navigation';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import logger from '@/lib/logger';
import AddServayQuestionForm from '@/components/addQuestionForm/addServayQuestionForm';
import { sliceString } from '@/constant/helperfuntions';
import Tippy from '@tippyjs/react';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname } from 'next/navigation'
export default React.memo(function ServayQuestionReportComponent({
  servayQuestionReportList,
}: {
  servayQuestionReportList: any[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizId, setQuizId] = useState('');
  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { identity } = useConnectPlugWalletStore((state) => ({
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });


  const location = usePathname();
  let language;
 
  const changeLang = () => {
    if (LANG === 'jp') {
      if(location){
      language = location.includes('super-admin/') ?'en' : 'jp';
      }
    }
    else{
      language = "en"
    }
  };
  const funcCalling = changeLang()
  const { t, changeLocale } = useLocalization(language);

  return (
    <>
      <Col xl='12' lg='12' md='12'>
        <div className='full-div'>
          <div className='table-container lg'>
            <div className='table-inner-container'>
              <Table striped hover className='article-table'>
                <thead>
                  <tr>
                    <th>
                      <p>{t('User')}</p>
                    </th>
                    <th>
                      <p>{t('Suggestion')}</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {servayQuestionReportList &&
                    servayQuestionReportList.map((item: any, index: number) => {
                      logger(item, 'sasadjkgdfdsfasd');

                      if (item?.userSuggestion?.trim() == '') {
                        return;
                      }
                      return (
                        <tr key={index}>
                          <td className='category-item'>
                            <p>{sliceString(item?.userName, 0, 20)}</p>{' '}
                          </td>
                          <td>
                            <Tippy
                              content={
                                <div>
                                  <p className='m-0'>
                                    {item?.userSuggestion ?? ''}
                                  </p>
                                </div>
                              }
                            >
                              <p className={`status`}>
                                {sliceString(item?.userSuggestion, 0, 40)}
                              </p>
                            </Tippy>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </Col>
    </>
  );
});
