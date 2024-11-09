import { makeEntryActor } from '@/dfx/service/actor-locator';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { number, object, string } from 'yup';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { utcToLocalAdmin } from '@/components/utils/utcToLocal';
import { Row, Col, Form, Button, Table, Modal, Spinner } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, FormikProps, FormikValues } from 'formik';
import AddQuestionForm from '@/components/addQuestionForm/addQuizQuestionForm';
import AddServayQuestionForm from '@/components/addQuestionForm/addServayQuestionForm';
import { usePathname, useRouter } from 'next/navigation';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { QUIZ_SURVEY_TITLE_SLICE } from '@/constant/sizes';
export default function ServayQuestionListComponent({
  servayId,
  servayQuestionList,
  reGetFn,
}: {
  servayId: any;
  servayQuestionList: any[];
  reGetFn: any;
}) {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [btntext, setBtntext] = useState('Add');
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [multipleDeleteQuestions, setMultipleDeleteQuestions] = useState(false);
  const [servayQuestionId, setServayQuestionId] = useState({
    servayId: '',
    questionId: '',
  });
  const [survayId, setServayId] = useState({
    servayId: '',
  });
  const location = usePathname();
  let language;
  const changeLang = () => {
    if (LANG === 'jp') {
      if (location) {
        language = location.includes('super-admin/') ? 'en' : 'jp';
      }
    } else {
      language = 'en';
    }
  };
  const funcCalling = changeLang();
  const { t, changeLocale } = useLocalization(language);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initQuestion, setInitQuestion] = useState<any>(null);
  const { identity } = useConnectPlugWalletStore((state) => ({
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const handleClose = () => {
    setShowModal(false);

    setInitQuestion(null);
  };
  const handleOpen = () => {
    setShowModal(true);
  };
  const handleDeleteModleClose = () => {
    setShowDeleteModal(false);
    setServayQuestionId({ servayId: '', questionId: '' });
  };
  const handleDeleteModleOpen = () => {
    setShowDeleteModal(true);
  };
  const toggleQuestionSelection = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };
  let handleDeleteQuizQuestion = async () => {
    setIsLoading(true);
    try {
      let deletedRes = await entryActor.deleteServayQuestion(
        servayQuestionId.servayId,
        servayQuestionId.questionId,
        userCanisterId
      );
      handleDeleteModleClose();
      setIsLoading(false);
      if (deletedRes?.ok) {
        toast.success(t('Question deleted successfully.'));
        if (reGetFn) {
          reGetFn();
        }
      } else {
        toast.error(deletedRes?.err[0]);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(t('There is an error while deleting Survey.'));
    }
  };
  let handleDeleteQuizMultipleQuestions = async () => {
    setShowDeleteModal(true);
    setMultipleDeleteQuestions(true);
  };
  let handleDeleteQuizQuestions = async () => {
    setIsLoading(true);
    try {
      let deletedRes = await entryActor.deleteSurveyQuestions(
        survayId.servayId,
        selectedQuestions,
        userCanisterId
      );
      handleDeleteModleClose();
      setIsLoading(false);
      if (deletedRes?.ok) {
        toast.success(t('Questions deleted successfully.'));
        if (reGetFn) {
          reGetFn();
        }
      } else {
        toast.error(deletedRes?.err[0]);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(t('There is an error while deleting Survey.'));
    }
  };


  return (
    <>
      <Col xl='12' lg='12' md='12'>
        <div className='full-div'>
          <div className='table-container lg'>
            <div className='table-inner-container'>
              {
                <div className='d-flex justify-content-end mb-2'>
                  <Button
                    className={`btn deleteAllbtn ${
                      selectedQuestions?.length <= 0 ? 'disabled' : ''
                    }`}
                    onClick={handleDeleteQuizMultipleQuestions}
                  >
                    {t('Delete')} <span>{selectedQuestions?.length}</span>
                  </Button>
                </div>
              }
              <Table striped hover className='article-table'>
                <thead>
                  <tr>
                    <th>
                      <p>{t('Title')}</p>
                    </th>
                    <th>
                      <p>{t('Created on')}</p>
                    </th>

                    <th className='centercls'>
                      <p>{t('Action')}</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {servayQuestionList &&
                    servayQuestionList.map((item: any) => {
                      let id = item.title;
                      let createdAt = '';

                      if (item?.creation_time) {
                        createdAt = utcToLocalAdmin(
                          item?.creation_time.toString(),
                          'DD-MM-yyyy'
                        );
                      }

                      return (
                        <tr
                          key={id}
                          className={
                            selectedQuestions.includes(id) ? 'selected' : ''
                          }
                        >
                          <td className='category-item'>
                            <p>
                              {item.title.length > QUIZ_SURVEY_TITLE_SLICE
                                ? item.title.slice(0, QUIZ_SURVEY_TITLE_SLICE) +
                                  '...'
                                : item.title}
                            </p>{' '}
                          </td>
                          <td>{createdAt}</td>

                          <td className='centercls'>
                            {' '}
                            <Button
                              className='text-primary ps-0'
                              onClick={() => {
                                if (location == '/survey-questions') {
                                  router.push(
                                    `/analyze?SurveyId=${servayId}&questionId=${id}`
                                  );
                                } else {
                                  router.push(
                                    `/super-admin/analyze?SurveyId=${servayId}&questionId=${id}`
                                  );
                                }
                              }}
                            >
                              {t('Analyze')}
                            </Button>
                            <Button
                              className='text-primary ps-0'
                              onClick={() => {
                                handleOpen();
                                setServayQuestionId({
                                  questionId: id,
                                  servayId,
                                });
                                setBtntext('Update');
                                setInitQuestion({
                                  title: item.title,
                                  ifSelected: item.ifSelected,
                                  options: item.options,
                                  id,
                                });
                              }}
                            >
                              {t('Edit')}
                            </Button>
                            <Button
                              onClick={() => {
                                handleDeleteModleOpen();
                                setServayQuestionId({
                                  questionId: id,
                                  servayId,
                                });
                              }}
                              className='text-danger ps-0'
                            >
                              {t('Delete')}
                            </Button>
                            <input
                              type='checkbox'
                              className='text-danger'
                              checked={selectedQuestions.includes(id)}
                              onChange={() => {
                                toggleQuestionSelection(id);
                                setServayId({ servayId });
                              }}
                            />
                            {/* <label>
                           {selectedQuestions.includes(id) ? 'Deselect' : 'Select'}
                            </label> */}
                            {/* <Button className='text-danger'
                    onClick={() => {
                      toggleQuestionSelection(id);
                      setServayId({
                        servayId,
                      });
                    }}
                  >
                    {selectedQuestions.includes(id) ? 'Deselect' : 'Select'}
                  </Button> */}
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
      <AddServayQuestionForm
        buttontext={btntext}
        servayId={servayQuestionId.servayId}
        showModal={showModal}
        handleClose={handleClose}
        reGetFn={reGetFn}
        data={initQuestion}
      />

      <Modal show={showDeleteModal} centered onHide={handleDeleteModleClose}>
        <Modal.Header>
          <h3 className='text-center'>
            {multipleDeleteQuestions
              ? t('Are you sure you want to delete these questions.')
              : t('Are you sure you want to delete this question')}
          </h3>
        </Modal.Header>
        <Modal.Footer>
          {multipleDeleteQuestions ? (
            <Button
              className='publish-btn me-2'
              onClick={() => {
                handleDeleteQuizQuestions();
                setMultipleDeleteQuestions(false);
              }}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size='sm' /> : t('Delete')}
            </Button>
          ) : (
            <Button
              className='publish-btn me-2'
              onClick={handleDeleteQuizQuestion}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size='sm' /> : t('Delete')}
            </Button>
          )}
          <Button
            className='default-btn'
            onClick={handleDeleteModleClose}
            disabled={isLoading}
          >
            {t('Cancel')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
