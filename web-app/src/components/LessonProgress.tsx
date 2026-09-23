type LessonStep = {
   id: string;
   label: string;
};

type LessonProgressProps = {
   steps: LessonStep[];
   currentStep: number;
   setCurrentStep: (step: number) => void;
};

function LessonProgress({
   steps,
   currentStep,
   setCurrentStep,
}: LessonProgressProps) {
   return (
      <div className="lesson-progress">
         <div className="lesson-progress-top">
            <span>LEARNING PROGRESS</span>

            <strong>
               STEP {currentStep + 1} / {steps.length}
            </strong>
         </div>

         <div className="lesson-steps">
            {steps.map((step, index) => (
               <button
                  key={step.id}
                  className={`lesson-step ${
                     index === currentStep
                        ? "lesson-step-active"
                        : ""
                  } ${
                     index < currentStep
                        ? "lesson-step-complete"
                        : ""
                  }`}
                  onClick={() => setCurrentStep(index)}
               >
                  <span>
                     {index < currentStep ? "✓" : index + 1}
                  </span>

                  <strong>{step.label}</strong>
               </button>
            ))}
         </div>
      </div>
   );
}

export default LessonProgress;