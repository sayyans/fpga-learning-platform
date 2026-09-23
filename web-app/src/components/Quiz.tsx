import { useState } from "react";

export type QuizQuestion = {
   question: string;
   options: string[];
   correctAnswer: number;
   explanation: string;
};

type QuizProps = {
   questions: QuizQuestion[];
   onComplete?: (score: number) => void;
};

function Quiz({
   questions,
   onComplete,
}: QuizProps) {
   const [questionIndex, setQuestionIndex] =
      useState(0);

   const [selectedAnswer, setSelectedAnswer] =
      useState<number | null>(null);

   const [score, setScore] = useState(0);
   const [finished, setFinished] = useState(false);

   const question = questions[questionIndex];

   const answerQuestion = (index: number) => {
      if (selectedAnswer !== null)
         return;

      setSelectedAnswer(index);

      if (index === question.correctAnswer) {
         setScore((current) => current + 1);
      }
   };

   const nextQuestion = () => {
      const finalScore =
         score +
         (selectedAnswer === question.correctAnswer
            ? 0
            : 0);

      if (questionIndex === questions.length - 1) {
         setFinished(true);

         if (onComplete)
            onComplete(finalScore);

         return;
      }

      setQuestionIndex((current) => current + 1);
      setSelectedAnswer(null);
   };

   const restartQuiz = () => {
      setQuestionIndex(0);
      setSelectedAnswer(null);
      setScore(0);
      setFinished(false);
   };

   if (finished) {
      return (
         <div className="quiz-card quiz-finished">
            <p className="section-label">
               QUIZ COMPLETE
            </p>

            <h3>
               {score} / {questions.length}
            </h3>

            <p>
               {score === questions.length
                  ? "Perfect score — module complete."
                  : "Review the explanations and try again if you want to improve your score."}
            </p>

            <button
               className="quiz-primary-button"
               onClick={restartQuiz}
            >
               RETAKE QUIZ
            </button>
         </div>
      );
   }

   const correct =
      selectedAnswer === question.correctAnswer;

   return (
      <div className="quiz-card">
         <div className="quiz-header">
            <div>
               <p className="section-label">
                  CHECK YOUR UNDERSTANDING
               </p>

               <span>
                  QUESTION {questionIndex + 1} /{" "}
                  {questions.length}
               </span>
            </div>

            <strong>
               SCORE {score}
            </strong>
         </div>

         <h3>{question.question}</h3>

         <div className="quiz-options">
            {question.options.map((option, index) => {
               let className = "quiz-option";

               if (selectedAnswer !== null) {
                  if (index === question.correctAnswer)
                     className += " quiz-option-correct";
                  else if (index === selectedAnswer)
                     className += " quiz-option-wrong";
               }

               return (
                  <button
                     key={option}
                     className={className}
                     onClick={() =>
                        answerQuestion(index)
                     }
                  >
                     <span>
                        {String.fromCharCode(65 + index)}
                     </span>

                     {option}
                  </button>
               );
            })}
         </div>

         {selectedAnswer !== null && (
            <div
               className={`quiz-feedback ${
                  correct
                     ? "quiz-feedback-correct"
                     : "quiz-feedback-wrong"
               }`}
            >
               <strong>
                  {correct
                     ? "✓ Correct"
                     : "✕ Not quite"}
               </strong>

               <p>{question.explanation}</p>

               <button
                  className="quiz-primary-button"
                  onClick={nextQuestion}
               >
                  {questionIndex ===
                  questions.length - 1
                     ? "FINISH QUIZ"
                     : "NEXT QUESTION →"}
               </button>
            </div>
         )}
      </div>
   );
}

export default Quiz;