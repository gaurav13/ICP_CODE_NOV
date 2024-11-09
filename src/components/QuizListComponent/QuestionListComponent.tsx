'use client';
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
import logger from '@/lib/logger';
import AddQuestionForm from '@/components/addQuestionForm/addQuizQuestionForm';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import { usePathname } from 'next/navigation';
import { QUIZ_SURVEY_TITLE_SLICE } from '@/constant/sizes';
export default function QuizQuestionListComponent({
  quizId,
  QuizQuestionList,
  reGetFn,
}: {
  quizId: any;
  QuizQuestionList: any[];
  reGetFn: any;
}) {
  const [showModal, setShowModal] = useState(false);
  const [btntext, setBtntext] = useState('Add');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [multipleDeleteQuestions, setMultipleDeleteQuestions] = useState(false);
  const [quizQuestionId, setQuizQuestionId] = useState({
    quizId: '',
    questionId: '',
  });
  const [survayId, setServayId] = useState({
    quizId: '',
  });
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
    setQuizQuestionId({ quizId: '', questionId: '' });
  };
  const handleDeleteModleOpen = () => {
    setShowDeleteModal(true);
    setMultipleDeleteQuestions(true);
  };
  const toggleQuestionSelection: any = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  let handleDeleteQuizQuestion = async () => {
    setIsLoading(true);
    try {
      let deletedRes = await entryActor.deleteQuestion(
        quizQuestionId.quizId,
        quizQuestionId.questionId,
        userCanisterId
      );
      // logger({ deletedRes }, 'sdasdasds');
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
      toast.error(t('There is an error while deleting quiz.'));
      // logger(error, 'asdasdsadasdasd');
    }
  };
  let handleDeleteQuizMultipleQuestions = async () => {
    setShowDeleteModal(true);
    setMultipleDeleteQuestions(true);
  };
  let handleDeleteQuizQuestions = async () => {
    setIsLoading(true);
    try {
      let deletedRes = await entryActor.deletequizQuestions(
        survayId.quizId,
        selectedQuestions,
        userCanisterId
      );
      // logger({ deletedRes }, 'sdasdasds');
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
      toast.error(t('There is an error while deleting quiz.'));
      // logger(error, 'asdasdsadasdasd');
    }
  };
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

  return (
    <>
      <Col xl='12' lg='12' md='12'>
        <div className='full-div'>
          <div className='table-container lg'>
            <div className='table-inner-container'>
              {selectedQuestions.length > 0 ? (
                <div className='d-flex justify-content-end mb-2'>
                  <Button
                    className='btn deleteAllbtn'
                    onClick={handleDeleteQuizMultipleQuestions}
                  >
                    {t('Delete')} <span>{selectedQuestions?.length}</span>
                  </Button>
                </div>
              ) : (
                ''
              )}
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
                  {QuizQuestionList.map((item: any) => {
                    let id = item.title;
                    let createdAt = '';

                    if (item?.creation_time) {
                      createdAt = utcToLocalAdmin(
                        item?.creation_time.toString(),
                        'DD-MM-yyyy'
                      );
                    }

                    return (
                      <tr key={id}>
                        <td className='category-item'>
                          {item.title.length > QUIZ_SURVEY_TITLE_SLICE
                            ? item.title.slice(0, QUIZ_SURVEY_TITLE_SLICE) +
                              '...'
                            : item.title}{' '}
                        </td>
                        <td>{createdAt}</td>

                        <td className='centercls'>
                          <Button
                            className='text-primary ps-0'
                            onClick={() => {
                              handleOpen();
                              setBtntext('Update');
                              setInitQuestion({
                                title: item.title,
                                answer: item.correctAnswer,
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
                              setQuizQuestionId({ questionId: id, quizId });
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
                              setServayId({ quizId });
                            }}
                          />
                          {/* <label>
                           {selectedQuestions.includes(id) ? 'Deselect' : 'Select'}
                            </label> */}
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
      <AddQuestionForm
        buttontext={btntext}
        quizId={quizQuestionId.quizId}
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
