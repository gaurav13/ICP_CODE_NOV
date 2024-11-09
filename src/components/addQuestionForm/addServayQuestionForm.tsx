import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Form, Button, Table, Modal, Spinner } from 'react-bootstrap';
import {
  Formik,
  Field,
  ErrorMessage,
  FormikProps,
  FormikValues,
  FieldArray,
} from 'formik';
import { array, number, object, string } from 'yup';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { makeEntryActor } from '@/dfx/service/actor-locator';
import { toast } from 'react-toastify';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { usePathname } from 'next/navigation';
import { LANG } from '@/constant/language';
import useLocalization from '@/lib/UseLocalization';
import useSearchParamsHook from '@/components/utils/searchParamsHook';

export default function AddServayQuestionForm({
  servayId,
  showModal,
  handleClose,
  reGetFn,
  data,
  buttontext,
}: {
  servayId: any;
  showModal: any;
  handleClose: any;
  reGetFn: any;
  data?: any;
  buttontext?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [ error , setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [servayQuestionId, setServayQuestionId] = useState('');
  const [quizQuestionList, setQuizQuestionList] = useState<any>([]);
  const [forcePaginate, setForcePaginate] = useState(0);
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const SurveyId = searchParams.get('SurveyId');
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
      // .min(5, t("title can't be less then 5 charactor"))
      .max(150, t("title can't be more then 150 charactor")).test('unique', 'Question already exists with this title', function(value) {
        // Check if the title already exists in the quizQuestionList
        const isAlready = quizQuestionList.some((e:any) => e.title === value);
        // Return false if title exists to trigger the validation error
        return !isAlready;
      }),
    options: array()
      .of(
        string()
          .required(t('Option is required'))
          .trim()
          .min(2, "Option can't be empty.")
          .max(150, "Option value can't be more then 150 charactor")
      )
      .min(1, t('At least one option is required'))
      .max(30, "options can't be more then 30"),
  });

  const initialValues = {
    title: '',
    takeUserInput: [],
    options: [''],
    checkboxValues: [''],
    selectedOption: -1,
  };

  let handleAddQuestion = async (values: any) => {
    setIsLoading(true);

    try {
      let selectedOpt: any = [];
      if (
        typeof values?.selectedCheckboxIndex === 'number' &&
        !isNaN(values?.selectedCheckboxIndex)
      ) {
        selectedOpt = [values?.selectedCheckboxIndex];
      }
      let tempUserQuestion = {
        title: values.title,
        ifSelected: selectedOpt,
        options: values.options,
      };
      if (servayId && servayQuestionId != '') {
        let newQuizAdd = await entryActor.updateServayQuestion(
          servayId,
          servayQuestionId,
          tempUserQuestion,
          userCanisterId
        );

        setIsLoading(false);
        if (newQuizAdd?.ok) {
          toast.success('Question updated successfully.');
          if (reGetFn) {
            reGetFn();
          }
        } else {
          toast.error(newQuizAdd?.err[0]);
        }
      } else {
        let unique=quizQuestionList.filter(
          (e: any) => e.title != tempUserQuestion.title
        );
        let tempUserQuestionsArray = [...unique,tempUserQuestion].filter((e)=>e.title.trim()!="");
        let newQuizAdd = await entryActor.addMultipleQuestionsToSurvey(
          servayId,
          tempUserQuestionsArray,
          userCanisterId
        );

        setIsLoading(false);
        if (newQuizAdd?.ok) {
          toast.success('Question created successfully.');
          let form = formikRef?.current;
          form?.resetForm();
          if (reGetFn) {
            reGetFn();
          }
        } else {
          toast.error(newQuizAdd?.err[0]);
        }
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('There is an error while adding question.');
    }
  };
  let nextbtn=async (values:any)=>{
            
      if(values){
        let selectedOpt: any = [];
        if (
          typeof values?.selectedCheckboxIndex === 'number' &&
          !isNaN(values?.selectedCheckboxIndex)
        ) {
          selectedOpt = [values?.selectedCheckboxIndex];
        }
        let tempUserQuestion = {
          title: values.title,
          ifSelected: selectedOpt,
          options: values.options,
        };
       let isTitleSame=quizQuestionList?.filter((e:any)=>{
        if(e?.title!=values?.title ){
  
             return true;
        };
    
       })
    let newArray=[...isTitleSame,tempUserQuestion]
    setForcePaginate(newArray.length)
        setQuizQuestionList((pre:any)=>newArray);
        formikRef?.current?.resetForm()
      
  
    }
    
      }
    
  useEffect(() => {
    if (data && formikRef?.current) {
      let form = formikRef?.current;
      var tempSelected = -1;
      if (data?.ifSelected.length != 0) {
        tempSelected = parseInt(data?.ifSelected);
      }
      form?.setFieldValue('title', data.title);
      form?.setFieldValue('selectedCheckboxIndex', tempSelected);
      form?.setFieldValue('options', data.options);
      setServayQuestionId(data.id);
    }
  }, [data]);
  useEffect(() => {
    changeLang();
  }, []);
  return (
    <>
      <Modal show={showModal} centered onHide={handleClose} backdrop='static'>
        <Modal.Header closeButton>
          <div className='flex-div'>
            <h3>
            <b>{SurveyId? t("Edit"):t("Add")} Questions  to Survey</b>
            </h3>
        
          </div>
        </Modal.Header>
   
        <h4 className='text-end me-3 mt-1'>
            <b>{forcePaginate} / {quizQuestionList.length}</b>
            </h4>
       
        <Modal.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formikRef}
            enableReinitialize
            onSubmit={(values) => {
              nextbtn(values)
              // handleAddQuestion(values);
              
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
                              type='text'
                              name='title'
                              value={values.title}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder='Enter Question Title'
                            />
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
                      <FieldArray
                        name='options'
                        render={({ insert, remove, push }) => (
                          <div>
                            {values.options.map(
                              (option: any, index: number) => (
                                <Row key={index}>
                                  <Col>
                                    <Form.Group className='mb-2'>
                                      <Form.Label>{`Option ${String.fromCharCode(
                                        65 + index
                                      )}`}</Form.Label>
                                      <Form.Control
                                        type='text'
                                        name={`options.${index}`}
                                        value={option}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder={`Enter Option ${String.fromCharCode(
                                          65 + index
                                        )}`}
                                      />
                                    </Form.Group>
                                    <Row>      <div className='text-danger mb-2'>  <ErrorMessage
                          className='Mui-err'
                          name={`options.${index}`}
                          component='div'
                        />
                      </div>
                  </Row>

                                  </Col>
                                  <Col
                                    className='addFieldbtnContainer '
                                    sm='3'
                                    ms='2'
                                    lg='2'
                                  >
                                    <i
                                      className='fa fa-plus-square'
                                      onClick={() => {
                                        push('');
                                        if (values.options.length === 0) {
                                          handleChange({
                                            target: {
                                              name: 'selectedOption',
                                              value: 0,
                                            },
                                          });
                                        }
                                      }}
                                    />

                                   <i
                                      className={`fa fa-minus-square ${index == 0?"disabled":""}`}
                                      onClick={() => {
                                        remove(index);
                                        if (values.selectedOption === index) {
                                          handleChange({
                                            target: {
                                              name: 'selectedOption',
                                              value: -1,
                                            },
                                          });
                                        } else if (
                                          values.selectedOption > index
                                        ) {
                                          handleChange({
                                            target: {
                                              name: 'selectedOption',
                                              value: values.selectedOption - 1,
                                            },
                                          });
                                        }
                                      }}
                                    />
                                  </Col>
                                  {option?.trim()?.length < 1 && error && (
                                    <div className='text-danger mb-2'>
                                      Option can't be empty.
                                    </div>
                                  )}
                                  {option?.trim()?.length > 150 && (
                                    <div className='text-danger mb-2'>
                                      Option can't be more then 150 charactor
                                    </div>
                                  )}
                                </Row>
                              )
                            )}
                          </div>
                        )}
                      />
                    </Col>
                  </Row>
            
                  <Row>
                    <Col>
                      <Form.Label>
                        Allow user to enter own suggestion when this field is
                        selected.
                      </Form.Label>
                      <FieldArray
                        name='options'
                        render={({ insert, remove, push }) => (
                          <div>
                            {values.options.map(
                              (option: any, index: number) => (
                                <Row key={index}>
                                  <Col>
                                    <Form.Group className='mb-2'>
                                      <Form.Check
                                        type='checkbox'
                                        id={`selectedCheckboxIndex.${index}`}
                                        label={`Option ${String.fromCharCode(
                                          65 + index
                                        )}`}
                                        name={`selectedCheckboxIndex.${index}`}
                                        checked={
                                          values.selectedCheckboxIndex === index
                                        }
                                        onChange={() => {
                                          if (
                                            values.selectedCheckboxIndex ===
                                            index
                                          ) {
                                            handleChange({
                                              target: {
                                                name: 'selectedCheckboxIndex',
                                                value: -1,
                                              },
                                            });
                                          } else {
                                            handleChange({
                                              target: {
                                                name: 'selectedCheckboxIndex',
                                                value: index,
                                              },
                                            });
                                          }
                                        }}
                                      />
                                    </Form.Group>
                                  </Col>
                                </Row>
                              )
                            )}
                          </div>
                        )}
                      />
                    </Col>
                  </Row>
                </Row>
                <div className='submitQuestionBtn'>
                  <div className='flex-div'>
                  <div>
                   <div className='pagination-container mystyle d-flex justify-content-end '>
                   
                   {!SurveyId && <ul>
                    {/* <li className="previous" onClick={previousbtn}><a className=""></a></li> */}
                    <span className='questionCount'>{forcePaginate}</span> <span className='ms-1'>of {quizQuestionList.length}</span>
                    <Button className='customeIcon_plusicon' type='submit'>
<i className="fa fa-plus" aria-hidden="true"/> {t("Add")}
</Button>
                    </ul>}
                  
                    </div>
                   </div>
                    <div>
                      <Button
                        className='publish-btn me-2'
                 
                        disabled={isLoading}
                        onClick={()=>{
                          if(SurveyId){
                            
                          
                         let form= formikRef?.current;
                         form?.handleSubmit();
                         if(form?.dirty && form?.isValid){
                           handleAddQuestion(formikRef?.current?.values)
                           
                         }
                        }else{
                          handleAddQuestion(formikRef?.current?.values)

                        }
                        }}
                      >
                        {isLoading ? (
                          <Spinner size='sm' />
                        ) : SurveyId ? (
                          t('Save')
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
