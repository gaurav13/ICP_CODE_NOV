'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import mark from '@/assets/Img/questionmark.png';
import cross from '@/assets/Img/icon-cross.png';
import stopwatch from '@/assets/Img/icon-stopwatch.png';
import checkmark from '@/assets/Img/icon-checkmark.png';
import { makeUserActor, makeEntryActor } from '@/dfx/service/actor-locator';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useConnectPlugWalletStore } from '@/store/useStore';
import { usePathname, useRouter } from 'next/navigation';
import { Button, Col, Form, Modal, Spinner, Toast } from 'react-bootstrap';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Link from 'next/link';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { formatTime, handleGoBack, IndexToChar } from '@/lib/utils';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';
import { Title } from 'chart.js';
import { toast } from 'react-toastify';
import logger from '@/lib/logger';
type Question = {
  textBoxValue: any;
  title: string;
  correctAnswer: number;
};
export default function Takequiz() {
  const [isGetting, setIsGetting] = useState(true);
  const { t, changeLocale } = useLocalization(LANG);
  const [textBoxValue, setTextBoxValue] = useState('');
  const [questions, setQuestions] = useState<any>(null);
  const urlparama = useSearchParamsHook();
  const [answers, setAnswers] = useState<Question[]>([]); // State to store answers
  const [persentage, setPersentage] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);

  const searchParams = new URLSearchParams(urlparama);
  const Id = searchParams.get('id');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remaningTime, setRemaningTime] = useState<any>('00:00');
  const [remaningMint, setRemaningMint] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null
  );  

  const [loading, setloading] = useState(false);
  const [disabledAllBtns, setDisabledAllBtns] = useState(false);
  const [quizResult, qsetQuizResult] = useState<any>(null);
  const [Index, setIndex] = useState<any>(null);
  const [indices, setIndices] = useState<any[]>([]);
  const [duration, setDuration] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[][]>([]);

  const { auth, userAuth, identity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    identity: (state as ConnectPlugWalletSlice).identity,
  }));
  const router = useRouter();
  const entryActor = makeEntryActor({
    agentOptions: {
      identity,
    },
  });
  const toggleOption = (questionIndex: number, optionIndex: number) => {
    const updatedOptions = [...selectedOptions];
    if (updatedOptions[questionIndex] === undefined) {
      updatedOptions[questionIndex] = [];
    }
    const selectedOptionIndex =
      updatedOptions[questionIndex].indexOf(optionIndex);
    if (selectedOptionIndex !== -1) {
      updatedOptions[questionIndex].splice(selectedOptionIndex, 1); 
    } else {
      updatedOptions[questionIndex].push(optionIndex); 
    }
    setSelectedOptions(updatedOptions);
  };

  const updateIndices = (index: number) => {
    setIndices((prevIndices) => [...prevIndices, index]);
  };

  const handleOptionSelect = (
    questionTitle: string,
    correctAnswerIndex: number,
    e: string
  ) => {

    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.title === questionTitle
    );

    if (existingAnswerIndex !== -1) {
      setSelectedOptionIndex(correctAnswerIndex);

      // Replace the existing answer with the new one
      setAnswers((prevAnswers) => [
        ...prevAnswers.slice(0, existingAnswerIndex),
        {
          title: questionTitle,
          correctAnswer: correctAnswerIndex,
          textBoxValue :textBoxValue,
        },
        ...prevAnswers.slice(existingAnswerIndex + 1),
      ]);
    } else {
      setSelectedOptionIndex(correctAnswerIndex);
      let tempAns = answers.length;
      let tempQuestions = questions.length;

      var pers = ((tempAns + 1) / tempQuestions) * 100;
      setPersentage(pers);
      setSliderWidth(pers - 4);
      // Add a new answer if no existing answer found
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        {
          title: questionTitle,
          correctAnswer: correctAnswerIndex,
          textBoxValue: textBoxValue,
        },
      ]);
    }
  };
  const handleNextClick = () => {
    setIsGetting(true);
   
    if (currentQuestionIndex < questions.length - 1) {
      questions[currentQuestionIndex].textBoxValue=textBoxValue;
      setTextBoxValue("")
      const titleOfPreQuestion = questions[currentQuestionIndex + 1]
      const existingAnswerIndex = answers.find(
        (answer) => answer.title === titleOfPreQuestion.title
      );
      if (existingAnswerIndex) {
        setIndex(currentQuestionIndex+1)
        setSelectedOptionIndex(existingAnswerIndex?.correctAnswer);
        setTextBoxValue(titleOfPreQuestion.textBoxValue)
      } else {
        setSelectedOptionIndex(null);
        setIndex(null);
      }

      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
    setIsGetting(false);
  };

  const handlePreviousClick = () => {
    setIsGetting(true);
    if (currentQuestionIndex > 0) {
      questions[currentQuestionIndex].textBoxValue=textBoxValue;
      const titleOfPreQuestion = questions[currentQuestionIndex - 1];
      const existingAnswerIndex = answers.find(
        (answer) => answer.title === titleOfPreQuestion.title
      );
      if (existingAnswerIndex) {
        setIndex(currentQuestionIndex-1)
        setTextBoxValue(titleOfPreQuestion.textBoxValue)

        setSelectedOptionIndex(existingAnswerIndex?.correctAnswer);
      } else {
        setSelectedOptionIndex(null);
      }

      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
    setIsGetting(false);
  };

  let handleSubmitClick = async () => {
    if (Id) {
      setloading(true);
      setDisabledAllBtns(true);

      let tempans = [...answers];
      let abc = tempans.map((e, questionIndex) => {
        
        return {
          title: questions[questionIndex]?.title,
          selectedOption: [questions[questionIndex]?.options[answers[questionIndex]?.correctAnswer]],
          seggestion: questions[questionIndex]?.textBoxValue ?? "",
        };
      });
      try {
        let responce = await entryActor.saveUserResponseToServay(
          Id,
          abc,
          userCanisterId
        );

        if (responce?.ok) {
        
          toast.success("Reward has been sent to you.")
          setloading(false);
          router.back();
       
        
        }
      } catch (error) {
      }
    }
  };

  const getQuestions = async () => {
    setIsGetting(true);
    const Question = await entryActor.getQuestionsOfSurvey(Id);
    // setData[Question]
    if (Question?.ok) {
      let questions = Question?.ok[1];

      setQuestions(questions);
    } else {
      router.back();
      setQuestions(null);
    }
    setIsGetting(false);
  };



  useEffect(() => {
    if (auth.state === 'initialized') {
      if (Id) {
        getQuestions();
      }
    } else if (auth.state === 'anonymous') {
      router.replace('/');
    }
  }, [auth, Id]);
  return (
    <> 
      <main id='main'>
        <div className='main-inner detail-inner-Pages pri-term-pnl'>
          <div> <Button className='customeIcon_plusicon ms-3' onClick={()=>handleGoBack(router)}>
<i className="fa fa-arrow-left" aria-hidden="true"/> {t("Go back")}
</Button></div>
          <div className='inner-content text-center'>
         
            {isGetting ? (
    
              <div className='d-flex justify-content-center w-full'>
              <Spinner />
             </div>
            ) : (
            (questions && questions.length) != 0 && (
              <div className='takequizbox'>
                <div className='bar-pnl'>
                  <div className='option-bar'>
                    <Button>
                      <Image src={cross} alt='cross' />
                    </Button>
                    <ul>
                      <li>
                        <Button>
                          <Image src={checkmark} alt='cross' />{' '}
                          {persentage ? Math.round(persentage) : 0}%
                        </Button>
                      </li>
                    </ul>
                  </div>
                  <div className='bar'>
                    <span style={{ left: `${sliderWidth}%` }}>
                      {answers ? answers.length : 0}/
                      {questions ? questions.length : 0}
                    </span>
                  </div>
                </div>
                <div className='spacer-50' />

                <div className='question-div'>
                  <Image src={mark} alt='amrk' />

                  <h2>{questions && questions[currentQuestionIndex]?.title}</h2>
                </div>

                <h3>{t('Select 1 correct answer')}</h3>
                <div className='spacer-40' />
                <ul className='answer-list'>
                  {questions && questions[currentQuestionIndex]?.options.map(
                    (e: string, index: number) => {
                      return (
                        <li
                          key={index}
                          onClick={() => {
                            handleOptionSelect(
                              questions[currentQuestionIndex]?.title,
                              index,
                              e
                            );
                            setIndex(index);
                          }}
                        >
                                <Button
                            className={`${
                              selectedOptionIndex == index ? 'active' : ''
                            }`}
                          >
                            <h6>
                              <span>{IndexToChar(index)}</span>
                            </h6>
                            <div>
                              <p>{e}</p>
                              <span />
                            </div>
                          </Button>
                          
                        </li>
                      );
                    }
                  )}
                </ul>

                {parseInt(questions && questions[currentQuestionIndex]?.ifSelected) ===
                Index ? (
                  <Col xl='12' className='text-left'>
                    <Form className='w-100' style={{ maxWidth: '100%' }}>
                      <Form.Group
                        className='mb-3'
                        controlId='exampleForm.ControlTextarea1'
                      >
                        <Form.Label>
                          { questions && questions[currentQuestionIndex]?.options[Index]}
                        </Form.Label>
                        <Form.Control
                          as='textarea'
                          placeholder='Add Suggestions..'
                          rows={5}
                          value={textBoxValue}
                          onChange={(e) => setTextBoxValue(e.target.value)}
                        />
                         {textBoxValue.trim().length === 0 &&  (
                      <Form.Text className="text-danger">
                       This field cannot be empty.
                      </Form.Text>
                          )}
                      </Form.Group>
                    </Form>
                  </Col>
                ) : (
                  ''
                )}

                <div className='spacer-20' />

                <div className='spacer-40' />

                <ul className='btn-list'>
                  <li>
                    <Button
                      className='quiz-btn'
                      disabled={currentQuestionIndex === 0 || disabledAllBtns}
                      onClick={handlePreviousClick}
                    >
                      {t('Back')}
                    </Button>
                  </li>
                  <li>
                    {currentQuestionIndex === questions.length - 1 &&
                    answers.length == questions.length ? (
                      <Button
                        className='quiz-btn'
                        disabled={loading || disabledAllBtns}
                        onClick={handleSubmitClick}
                      >
                        {loading ? (
                          <span>
                            <Spinner />
                          </span>
                        ) : (
                          t('Submit')
                        )}
                      </Button>
                    ) : (
                      <Button
                        className='quiz-btn'
                        disabled={
                          currentQuestionIndex === questions.length - 1 ||
                          disabledAllBtns ||
                          selectedOptionIndex == null ||
                          textBoxValue.trim().length === 0 && parseInt(questions[currentQuestionIndex]?.ifSelected) ===
                          Index
                        }
                        onClick={handleNextClick}
                      >
                        {t('Next')}
                      </Button>
                    )}
                  </li>
                </ul>
              </div>
            )
             )}
            {/* <button className='' onClick={getQuestions}>show data in console</button> */}
          </div>
        </div>
      </main>
   
   
    </>
  );
}
