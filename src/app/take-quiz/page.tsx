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
import { Button, Col, Form, Modal, Spinner } from 'react-bootstrap';
import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';
import Link from 'next/link';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { formatTime, handleGoBack, IndexToChar } from '@/lib/utils';
import { canisterId as userCanisterId } from '@/dfx/declarations/user';

import ProgressBar from 'react-bootstrap/ProgressBar';
import logger from '@/lib/logger';
import { QUIZ } from '@/constant/routes';
type Question = {
  title: string;
  correctAnswer: number;
};
export default function Takequiz() {
  const { t, changeLocale } = useLocalization(LANG);
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

  const [duration, setDuration] = useState<any>(null);

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

  const handleOptionSelect = (
    questionTitle: string,
    correctAnswerIndex: number
  ) => {
    // Check if an answer with the same title already exists
    const existingAnswerIndex = answers.findIndex(
      (answer) => answer.title === questionTitle
    );

    if (existingAnswerIndex !== -1) {
      setSelectedOptionIndex(correctAnswerIndex);

      // Replace the existing answer with the new one
      setAnswers((prevAnswers) => [
        ...prevAnswers.slice(0, existingAnswerIndex),
        { title: questionTitle, correctAnswer: correctAnswerIndex },
        ...prevAnswers.slice(existingAnswerIndex + 1),
      ]);
    } else {
      setSelectedOptionIndex(correctAnswerIndex);
      let tempAns = answers.length;
      let tempQuestions = questions.length;

      var pers = ((tempAns + 1) / tempQuestions) * 100;
      setPersentage(pers);
      setSliderWidth(pers - 4);
      logger({ pers, tempAns, tempQuestions }, 'asdfsadfsdfsd');
      // Add a new answer if no existing answer found
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        { title: questionTitle, correctAnswer: correctAnswerIndex },
      ]);
    }
  };
  const handleNextClick = () => {
    // Increment current question index if it's not the last question
    if (currentQuestionIndex < questions.length - 1) {
      const titleOfPreQuestion = questions[currentQuestionIndex + 1].title;
      const existingAnswerIndex = answers.find(
        (answer) => answer.title === titleOfPreQuestion
      );
      if (existingAnswerIndex) {
        setSelectedOptionIndex(existingAnswerIndex?.correctAnswer);
      } else {
        setSelectedOptionIndex(null);
      }

      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousClick = () => {
    if (currentQuestionIndex > 0) {
      const titleOfPreQuestion = questions[currentQuestionIndex - 1].title;
      const existingAnswerIndex = answers.find(
        (answer) => answer.title === titleOfPreQuestion
      );
      if (existingAnswerIndex) {
        setSelectedOptionIndex(existingAnswerIndex?.correctAnswer);
      } else {
        setSelectedOptionIndex(null);
      }

      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };
  let handleSubmitClick = async () => {
    if (answers && Id) {
      setloading(true);
      setDisabledAllBtns(true);

      let tempans = [...answers];
      let abc = tempans.map((e) => {
        return { title: e.title, correctAnswer: [`${e.correctAnswer + 1}`] };
      });

      try {
        let responce = await entryActor.validateQuiz(
          Id,
          remaningMint,
          abc,
          userCanisterId
        );
        if (responce?.ok) {
          let score = parseInt(responce?.ok[1]);
          let totalQuestion = questions.length;
          let status = parseInt(responce?.ok[2]);
          let persentage = (score / totalQuestion) * 100;
          let points = parseInt(responce?.ok[3]);
          qsetQuizResult({ score, status, persentage, totalQuestion, points });
        }
      } catch (error) {}
    }
  };

  const getQuestions = async () => {
    const Question = await entryActor.getQuestionsOfQuiz(Id);
    // setData[Question]
    if (Question?.ok) {
      let questions = Question?.ok[1];
      let tempDuration = parseInt(Question?.ok[0][0].duration);

      setDuration(tempDuration);
      setQuestions(questions);
    } else {
      setQuestions(null);
      router.back();
    }
  };

  useEffect(() => {
    if (duration) {
      var count = 0;

      const intervalId = setInterval(() => {
        let result = formatTime(duration * 60 - count);
        setRemaningTime(result);
        let remMint = Math.floor((duration * 60 - count) / 60);
        setRemaningMint(remMint);
        if (duration * 60 <= count) {
          handleSubmitClick();
          clearInterval(intervalId);
          setDisabledAllBtns(true);
        } else {
          ++count;
        }
      }, 1000);

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [duration]);

  useEffect(() => {
    if (quizResult) {
      setShowModal(true);
    }
  }, [quizResult]);

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
            {questions && questions.length != 0 && (
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
                      <li>
                        <Button>
                          <Image src={stopwatch} alt='cross' />
                          {remaningTime}
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
                  {/* <div className='bar'>
                    <ProgressBar animated now={persentage} />
                  </div> */}
                </div>
                <div className='spacer-50' />

                <div className='question-div'>
                  <Image src={mark} alt='amrk' />

                  <h2>{questions[currentQuestionIndex]?.title}</h2>
                </div>

                <h3>{t('Select 1 correct answer')}</h3>
                <div className='spacer-40' />
                <ul className='answer-list'>
                  {questions[currentQuestionIndex]?.options.map(
                    (e: string, index: number) => {
                      return (
                        <li
                          key={index}
                          onClick={() =>
                            handleOptionSelect(
                              questions[currentQuestionIndex]?.title,
                              index
                            )
                          }
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
                          selectedOptionIndex == null
                        }
                        onClick={handleNextClick}
                      >
                        {t('Next')}
                      </Button>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <Modal
        show={showModal}
        centered
        onHide={() => {
          setShowModal(false);
          router.push(QUIZ);
        }}
      >
        {quizResult && (
          <Modal.Body className='resultPannel'>
            <div>
              <h2>{t('Result')}</h2>
            </div>
            <div>
              {' '}
              {quizResult.score} {t('of')} {quizResult.totalQuestion}
            </div>
            <div>{quizResult.persentage}%</div>
            <div>
              <b>{t('Status')}</b>
            </div>
            <div>
              <span>{quizResult.status == 1 ? t('Pass') : t('Fail')}</span>
            </div>
            <div>
              <b>{t('Coins win')}</b>
            </div>
            <div>
              <span>{quizResult.points}</span>
            </div>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button
            onClick={() => {
              router.back();
            }}
          >
            {t('Back to Quizzes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
