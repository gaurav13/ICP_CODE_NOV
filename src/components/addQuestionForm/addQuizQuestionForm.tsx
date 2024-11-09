import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Form, Button, Table, Modal, Spinner } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, FormikProps, FormikValues } from 'formik';
import { array, number, object, string } from 'yup';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { makeEntryActor } from '@/dfx/service/actor-locator';

import { toast } from 'react-toastify';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import useLocalization from '@/lib/UseLocalization';
import { usePathname } from 'next/navigation';
import { LANG } from '@/constant/language';
import ReactPaginate from 'react-paginate';
import logger from '@/lib/logger';
import useSearchParamsHook from '@/components/utils/searchParamsHook';

export default function AddQuestionForm({
  quizId,
  showModal,
  handleClose,
  reGetFn,
  data,
  buttontext,
}: {
  buttontext?: string;
  quizId: any;
  showModal: any;
  handleClose: any;
  reGetFn: any;
  data?: any;
}) {
  let initialQuestion = {
    title: '',
    answer: [],
    options: ['', '', '', ''],
  };
  const [isLoading, setIsLoading] = useState(false);
  const [quizQuestionId, setQuizQuestionId] = useState('');
  const [quizQuestionList, setQuizQuestionList] = useState<any>([]);
  const [forcePaginate, setForcePaginate] = useState(0);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const isQuizId = searchParams.get('quizId');
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
      if (location) {
        language = location.includes('super-admin/') ? 'en' : 'jp';
      }
    } else {
      language = 'en';
    }
  };

  const { t, changeLocale } = useLocalization(language);
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const validationSchema = object().shape({
    title: string()
      .required(t('Title is required'))
      .min(1, t("title can't be less then 5 charactor"))
      .max(150, t("title can't be more then 150 charactor"))
      .test(
        'unique',
        'Question already exists with this title',
        function (value) {
          // Check if the title already exists in the quizQuestionList
          const isAlready = quizQuestionList.some(
            (e: any) => e.title === value
          );
          // Return false if title exists to trigger the validation error
          return !isAlready;
        }
      ),
    answer: array().required(t('At least one answer must be selected'))
      .min(1, t('At least one answer must be selected'))
      .max(1, t('Only 1 answer can be selected')),
    options1: string()
      .required(t('Option 1 is required'))
      // .min(5, t("Option 1 can't be less then 5 charactor"))
      .max(150, t("Option 1 can't be more then 150 charactor")),
    options2: string()
      .required(t('Option 2 is required'))
      // .min(5, t("Option 2 can't be less then 5 charactor"))
      .max(150, t("Option 2 can't be more then 150 charactor")),
    options3: string()
      .required(t('Option 3 is required'))
      // .min(5, t("Option 3 can't be less then 5 charactor"))
      .max(150, t("Option 3 can't be more then 150 charactor")),
    options4: string()
      .required(t('Option 4 is required'))
      // .min(5, t("Option 4 can't be less then 5 charactor"))
      .max(150, t("Option 4 can't be more then 150 charactor")),
  });

  const initialValues = {
    title: '',
    answer: [],
    options1: '',
    options2: '',
    options3: '',
    options4: '',
  };
  const answerList = [
    { label: 'Option A', value: '1' },
    { label: 'Option B', value: '2' },
    { label: 'Option C', value: '3' },
    { label: 'Option D', value: '4' },
  ];
  let handleAddQuestion = async (values: any) => {
    setIsLoading(true);
   
    try {
      let tempQuestion = {
        title: values.title,
        correctAnswer: values.answer,
        options: [
          values.options1,
          values.options2,
          values.options3,
          values.options4,
        ],
      };
          

      if (isQuizId && quizQuestionId != '') {
        let newQuizAdd = await entryActor.updateQuestion(
          isQuizId,
          quizQuestionId,
          tempQuestion,
          userCanisterId
        );
        setIsLoading(false);
        if (newQuizAdd?.ok) {
          toast.success(t('Question updated successfully successfully.'));
          if (reGetFn) {
            reGetFn();
          }
        } else {
          toast.error(t(newQuizAdd?.err[0]));
        }
      } else {
        let unique=quizQuestionList.filter(
          (e: any) => e.title != tempQuestion.title
        );
        let allQuestion = [...unique,tempQuestion].filter((e)=>e.title.trim()!="");

        let newQuizAdd = await entryActor.addMultipleQuestions(
          quizId,
          allQuestion,
          userCanisterId
        );

        setIsLoading(false);
        if (newQuizAdd?.ok) {
          toast.success(t('Question created successfully.'));
          formikRef?.current?.resetForm();
          // form?.resetForm();
          if (reGetFn) {
            reGetFn();
          }
        } else {
       
          toast.error(t(newQuizAdd?.err[0]));
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(t('There is an error while adding question.'));
    }
  };

  let nextbtn = async (values:any) => {
   
      if (values) {
        let tempQuestion = {
          title: values?.title,
          correctAnswer: values.answer,
          options: [
            values.options1,
            values.options2,
            values.options3,
            values.options4,
          ],
        };
        let isTitleSame = quizQuestionList?.filter((e: any) => {
          if (e?.title != values?.title) {
            return true;
          }
        });
        let newArray = [...isTitleSame, tempQuestion];
        setForcePaginate(newArray.length);
        setQuizQuestionList((pre: any) => newArray);
        formikRef?.current?.resetForm();
      
    }
  };


  useEffect(() => {
    if (data && formikRef?.current) {
      let form = formikRef?.current;

      form?.setFieldValue('title', data.title);
      form?.setFieldValue('answer', data.answer);
      form?.setFieldValue('options1', data.options[0]);
      form?.setFieldValue('options2', data.options[1]);
      form?.setFieldValue('options3', data.options[2]);
      form?.setFieldValue('options4', data.options[3]);
      setQuizQuestionId(data.id);
    }
  }, [data]);
  useEffect(() => {
    changeLang();
  }, []);

  return (
    <>
      <Modal show={showModal} centered onHide={handleClose} backdrop='static'>

        <Modal.Header closeButton>
          <h3 className='text-center'>
            <b>{isQuizId? t("Edit"):t("Add")} Questions</b>
          </h3>
          
        </Modal.Header>
        <h4 className='text-end me-3 mt-1'>
            <b>
              {forcePaginate} / {quizQuestionList.length}
            </b>
          </h4>
        <Modal.Body className='pt-0'>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formikRef}
            enableReinitialize
            onSubmit={(values) => {
              nextbtn(values)
              // handleAddQuestion(values);
              // addQuestionToList(values)
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Row>
                    <Col>
                      <Field name='title'>
                        {({ field, formProps }: any) => (
                          <Form.Group className='mb-2'>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              as='textarea'
                              className='texta'
                              name='title'
                              value={values.title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder='Enter Question Title'
                            />
                            {/* <Form.Control
                              type='text'
                              name='title'
                              value={values.title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder='Enter Question Title'
                            /> */}
                          </Form.Group>
                        )}
                      </Field>
                      <div className='text-danger mb-2'>
                        <ErrorMessage
                          className='Mui-err'
                          name='title'
                          component='div'
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <Field name='options1'>
                        {({ field, formProps }: any) => (
                          <Form.Group className='mb-2'>
                            <Form.Label>Option (a)</Form.Label>

                            <Form.Control
                              type='text'
                              name='options1'
                              value={values.options1}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={'Enter option A'}
                            />
                          </Form.Group>
                        )}
                      </Field>
                      <div className='text-danger mb-2'>
                        <ErrorMessage
                          className='Mui-err'
                          name='options1'
                          component='div'
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Field name='options2'>
                        {({ field, formProps }: any) => (
                          <Form.Group className='mb-2'>
                            <Form.Label>Option (b)</Form.Label>

                            <Form.Control
                              type='text'
                              name='options2'
                              value={values.options2}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={'Enter option B'}
                            />
                          </Form.Group>
                        )}
                      </Field>
                      <div className='text-danger mb-2'>
                        <ErrorMessage
                          className='Mui-err'
                          name='options2'
                          component='div'
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Field name='options3'>
                        {({ field, formProps }: any) => (
                          <Form.Group className='mb-2'>
                            <Form.Label>Option (c)</Form.Label>

                            <Form.Control
                              type='text'
                              name='options3'
                              value={values.options3}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={'Enter option C'}
                            />
                          </Form.Group>
                        )}
                      </Field>
                      <div className='text-danger mb-2'>
                        <ErrorMessage
                          className='Mui-err'
                          name='options3'
                          component='div'
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Field name='options4'>
                        {({ field, formProps }: any) => (
                          <Form.Group className='mb-2'>
                            <Form.Label>Option (d)</Form.Label>

                            <Form.Control
                              type='text'
                              name='options4'
                              value={values.options4}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={'Enter option D'}
                            />
                          </Form.Group>
                        )}
                      </Field>
                      <div className='text-danger mb-2'>
                        <ErrorMessage
                          className='Mui-err'
                          name='options4'
                          component='div'
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div>
                        <Form.Label>Correct Answer</Form.Label>
                        <div className='selectAnswerSelection'>
                          {answerList.map((option) => (
                            <div key={option.value}>
                              <label>
                                <Field
                                  type='checkbox'
                                  name='answer'
                                  value={option.value}
                                />
                                <span>{option.label}</span>
                              </label>
                            </div>
                          ))}
                        </div>
                        {/* Display validation error message if any */}
                        <div className='text-danger mb-2'>
                          <ErrorMessage
                            className='Mui-err'
                            name='answer'
                            component='div'
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Row>
                <div className='submitQuestionBtn'>
                  <div className='flex-div'>
                   
                <div className='pagination-container mystyle d-flex  '>
                        {/* <ReactPaginate
                      breakLabel='...'
                      nextLabel=''
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={1}
                      pageCount={quizQuestionList.length}
                      previousLabel=''
                      renderOnZeroPageCount={null}
                      forcePage={forcePaginate}
                    /> */}
                         {!isQuizId && <ul>
                    {/* <li className="previous" onClick={previousbtn}><a className=""></a></li> */}
<span className='questionCount'>{forcePaginate}</span> <span className='ms-1'>of {quizQuestionList.length}</span>
<Button className='customeIcon_plusicon' type='submit'>
<i className="fa fa-plus" aria-hidden="true"/> {t("Add")}
</Button>
                    {/* <li className="customeIcon_plusicon" onClick={nextbtn}> </li> */}
                   
                    </ul>}
                  
                    </div>
                    <div>
                      <Button
                        className='publish-btn me-2'
                     onClick={()=>{
                      if(isQuizId){
                        let form= formikRef?.current;
                        form?.handleSubmit();
                        if(form?.dirty && form?.isValid){
                          handleAddQuestion(formikRef?.current?.values)
  
                        }
                      }else{
                        handleAddQuestion(formikRef?.current?.values)

                      }
                    

                     }}
                        disabled={isLoading}
                      >
                        {/* Add */}
                        {isLoading ? (
                      <Spinner size='sm' />
                    ) : isQuizId ? (
                      'Save'
                    ) : (
                      t("Save All Questions")
                    )}
                      </Button>
                   
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}
