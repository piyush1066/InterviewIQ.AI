import React, { useState } from 'react'
import maleVideo from "../assets/Videos/male-ai.mp4"
import femaleVideo from "../assets/Videos/female-ai.mp4"
import 'react-circular-progressbar/dist/styles.css';
import Timer from './Timer';
import { FaPaperPlane } from "react-icons/fa"
import { motion } from "motion/react";
import { FaMicrophoneAlt } from "react-icons/fa";
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from "axios";
import { BsArrowLeft } from 'react-icons/bs'
import { FaMicrophoneSlash } from 'react-icons/fa'


function Step2Interview({ interviewData, onFinish: onFinish }) {

  const ServerUrl = "http://localhost:8000";
  const { interviewId, questions, userName } = interviewData
  const [answer, setAnswer] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;



  const [step, setStep] = useState(1);


  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const videoRef = useRef(null)

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      //trying known female voices first
      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        )

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }


      //trying known male voices first
      const maleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        )

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      //fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");


    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [])


  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;


  // speak function
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      //add natural pauses

      const humanText = text
        .replace(/,/g, ", ...")
        .replace(/\./g, ". ...");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      //Human like paccing 

      utterance.rate = 1;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
        videoRef.current?.play();
      };

      utterance.onend = () => {
        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);
        if (isMicOn) {
          startMic();
        }
        setSubtitle("");
        resolve();
      }

      setSubtitle("");

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    })
  };

  useEffect(() => {
    if (!selectedVoice) {
      return;
    }

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, its great to meet you today. I hope you are feeling confident and ready.`
        );

        await speakText(
          "I'll ask you few questions. Just answer naturally, and take your time. Let's begin."
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));

        //last question speak

        if (currentIndex === questions.length - 1) {
          await speakText(
            "Alright, this one might be a bit more challenging."
          );
        }

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }
    }

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex])

  useEffect(() => {
    setTimeLeft(currentQuestion?.timeLimit || 60);
  }, [currentIndex, currentQuestion?.timeLimit]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (isSubmitting) return;
    if (!currentQuestion) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0;
        }
        return prev - 1
      })
    }, 1000);
    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isSubmitting])

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;

  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch (error) {

      }
    }
  }

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };




  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic()
    setIsSubmitting(true)
    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken:
          currentQuestion.timeLimit - timeLeft,
      }, { withCredentials: true })

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, lets's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);

  }

  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result =await axios.post(ServerUrl + "/api/interview/finish",  {interviewId}, {withCredentials:true})
      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    if(isIntroPhase) return ;
    if(!currentQuestion) return ;

    if(timeLeft ===0 && !isSubmitting && !feedback){
      submitAnswer();
    }
  },[timeLeft]);

  useEffect(()=>{
    return ()=>{
       // Stop microphone recognition
      if(recognitionRef.current){
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      //stop AI voice
      window.speechSynthesis.cancel();
    };
  },[])


  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-7xl min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>

        {/* video section */}
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 lg:border-r border-gray-200'>
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              loop
              playsInline
              preload='auto'

              className='w-full h-auto object-cover'

            />
          </div>

          {/* {subtitle} */}

          {subtitle && (
            <div className='w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm '>
              <p className='text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed'>{subtitle}</p>
            </div>
          )}

          {/* timer area */}

          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-500'>Interview Status</span>

              {isAIPlaying && <span className='text-sm font-semibold text-emerald-600'>{isAIPlaying ? "AI Speaking" : ""}</span>}
            </div>


          </div>
          <div className='h-px bg-gray-200'></div>

          <div className='flex justify-center'>
            <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit || 60} />
          </div>

          <div className='h-px bg-gray-200'></div>

          <div className='grid grid-cols-2 gap-6 text-center'>
            <div>
              <span className='text-2xl font-bold text-emerald-600'>Question {currentIndex + 1}</span>
              <span className='text-xs text-gray-400'>Current Questions</span>
            </div>

            <div>
              <span className='text-2xl font-bold text-emerald-600'>{questions.length}</span>
              <span className='text-xs text-gray-400'>Total Questions</span>
            </div>

          </div>


        </div>

        {/* text section */}

        <div className='flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative'>
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>
            AI Smart Interview
          </h2>

          {!isIntroPhase && <div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'>
            <p className='text-xs sm:text-sm text-gray-400 mb-2'>
              Question {currentIndex + 1} of {questions.length}
            </p>

            <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed pr-16'>
              {currentQuestion?.question || "First Question"}
            </div>
          </div>}

          <div className='flex-1 flex flex-col bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden'>
            <div className='flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-gray-100'>
              <div>
                <p className='text-sm font-semibold text-gray-800'>Your Answer</p>
                <p className='text-xs text-gray-400'>Keep it clear, structured, and specific.</p>
              </div>

              <span className='shrink-0 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full'>
                {wordCount} words
              </span>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder='Type your answer here...'
              className='min-h-72 flex-1 w-full resize-none bg-gray-50 p-4 sm:p-6 outline-none text-gray-800 leading-relaxed placeholder:text-gray-400 focus:bg-white transition'
            />

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-t border-gray-100 bg-gray-50'>
              <p className='text-xs text-gray-500'>
                Answer naturally, then submit when you are ready.
              </p>
              {!feedback ? (<div className='flex items-center gap-3'>


                <motion.button
                  onClick={toggleMic}
                  whileTap={{ scale: 0.9 }}
                  className='bg-black text-white rounded-full p-3 flex items-center justify-center'>
                  {isMicOn ? <FaMicrophoneAlt className='text-lg' /> : <FaMicrophoneSlash size={20} />}
                </motion.button>


                <motion.button
                  type='button'
                  onClick={submitAnswer}
                  disabled={isSubmitting}
                  whileTap={{ scale: 0.9 }}

                  className=' flex  bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-2 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold justify-center gap-2'>
                  <FaPaperPlane className='text-xs translate-y-[6px]' />
                  Submit Answer
                </motion.button>
              </div>) : (
                <motion.div className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'>
                  <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>

                  <button
                    onClick={handleNext}
                    className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1'>Next Question <BsArrowLeft /></button>
                </motion.div>
              )}
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default Step2Interview
