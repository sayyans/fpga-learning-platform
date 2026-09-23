import { useState } from "react";
import LessonHeader from "../components/LessonHeader";
import LessonProgress from "../components/LessonProgress";
import CodeChallenge from "../components/CodeChallenge";
import Quiz, {
   type QuizQuestion,
} from "../components/Quiz";
import Control from "../components/Control";
import Metric from "../components/Metric";

/* =========================================================
   MODULE 03 — COUNTERS
   ========================================================= */

const steps = [
   { id: "learn", label: "Learn" },
   { id: "visualize", label: "Visualize" },
   { id: "experiment", label: "Experiment" },
   { id: "code", label: "Code" },
   { id: "quiz", label: "Quiz" },
];

const quizQuestions: QuizQuestion[] = [
   {
      question:
         "The counter currently stores 0101. ENABLE = 0 and a rising clock edge occurs. What happens?",
      options: [
         "The count becomes 0110",
         "The count becomes 0100",
         "The count stays 0101",
         "The count becomes 0000",
      ],
      correctAnswer: 2,
      explanation:
         "When ENABLE is 0, the counter does not assign a new value to count, so the register keeps its previously stored value.",
   },
   {
      question:
         "The counter is 1111 and counts UP on the next rising edge. What value is stored next?",
      options: [
         "1111",
         "0000",
         "10000",
         "1110",
      ],
      correctAnswer: 1,
      explanation:
         "This is a 4-bit counter. Its maximum value is 1111 (15), so incrementing once more wraps around to 0000.",
   },
   {
      question:
         "Why does the counter feed its current value back into its arithmetic logic?",
      options: [
         "To generate the FPGA clock",
         "Because the next count depends on the current count",
         "To make the design combinational",
         "To control the number of FPGA pins",
      ],
      correctAnswer: 1,
      explanation:
         "The next count is calculated from the currently stored count. For example, count + 1 requires the current count value as an input to the arithmetic logic.",
   },
   {
      question:
         "If RESET = 1, ENABLE = 1, and a rising edge occurs, which operation has priority?",
      options: [
         "Increment",
         "Decrement",
         "Enable",
         "Reset",
      ],
      correctAnswer: 3,
      explanation:
         "RESET is checked first in the if/else structure, so it has priority. The counter loads 0000 regardless of ENABLE or DIRECTION.",
   },
];

/* =========================================================
   MAIN LESSON
   ========================================================= */

function CounterLesson() {
   const [currentStep, setCurrentStep] = useState(0);

   const [count, setCount] = useState(0);
   const [reset, setReset] = useState(false);
   const [enable, setEnable] = useState(true);

   const [direction, setDirection] =
      useState<"up" | "down">("up");

   const [quizCompleted, setQuizCompleted] =
      useState(
         () =>
            localStorage.getItem(
               "fpga-module-counters"
            ) === "complete"
      );

   const [explanation, setExplanation] = useState(
      "Press CLOCK ↑ to simulate a rising clock edge."
   );

   const binaryCount = count
      .toString(2)
      .padStart(4, "0");

   const toggleReset = () => {
      const next = !reset;
      setReset(next);

      if (next) {
         setExplanation(
            `RESET changed to 1. COUNT is still ${binaryCount} because reset is synchronous. Press CLOCK ↑ to apply it.`
         );
      } else {
         setExplanation(
            `RESET changed to 0. Normal counter operation can resume on the next rising edge.`
         );
      }
   };

   const toggleEnable = () => {
      const next = !enable;
      setEnable(next);

      setExplanation(
         next
            ? "ENABLE changed to 1. The counter can update on the next rising clock edge."
            : `ENABLE changed to 0. The counter will hold ${binaryCount} on rising clock edges.`
      );
   };

   const toggleDirection = () => {
      const next =
         direction === "up" ? "down" : "up";

      setDirection(next);

      setExplanation(
         `DIRECTION changed to ${next.toUpperCase()}. The count will ${
            next === "up" ? "increment" : "decrement"
         } on the next enabled rising edge.`
      );
   };

   const clockEdge = () => {
      if (reset) {
         setCount(0);

         setExplanation(
            "Rising edge detected. RESET is asserted, so the register loads 0000."
         );

         return;
      }

      if (!enable) {
         setExplanation(
            `Rising edge detected. ENABLE is off, so the register holds ${binaryCount}.`
         );

         return;
      }

      if (direction === "up") {
         const next = (count + 1) & 0xf;

         setCount(next);

         setExplanation(
            `Rising edge detected. ENABLE is on and DIRECTION is UP, so ${binaryCount} increments to ${next
               .toString(2)
               .padStart(4, "0")}.`
         );
      } else {
         const next = (count - 1 + 16) & 0xf;

         setCount(next);

         setExplanation(
            `Rising edge detected. ENABLE is on and DIRECTION is DOWN, so ${binaryCount} decrements to ${next
               .toString(2)
               .padStart(4, "0")}.`
         );
      }
   };

   const nextStep = () => {
      if (currentStep < steps.length - 1)
         setCurrentStep(currentStep + 1);
   };

   const previousStep = () => {
      if (currentStep > 0)
         setCurrentStep(currentStep - 1);
   };

   return (
      <>
         <LessonHeader badge="Sequential Logic" />

         <section className="intro">
            <p className="section-label">
               MODULE 03 · GUIDED LESSON
            </p>

            <h2>Configurable 4-Bit Counter</h2>

            <p>
               Build on registers by adding arithmetic,
               feedback, enable control, and direction
               selection. Then connect the behavior to
               synthesized FPGA hardware.
            </p>
         </section>

         <LessonProgress
            steps={steps}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
         />

         {/* =========================================
             STEP 1 — LEARN
         ========================================= */}

         {currentStep === 0 && (
            <section className="guided-step">
               <div className="guided-step-heading">
                  <span>STEP 01</span>

                  <h3>
                     A counter is a register with logic
                     around it
                  </h3>

                  <p>
                     The register stores the current count.
                     Arithmetic logic calculates the next
                     value, and a feedback path sends the
                     stored count back into that calculation.
                  </p>
               </div>

               <div className="learning-cards">
                  <LearningCard
                     number="01"
                     title="Store"
                     text="A 4-bit register stores the current count from 0000 through 1111."
                  />

                  <LearningCard
                     number="02"
                     title="Calculate"
                     text="Arithmetic logic adds or subtracts one from the current count."
                  />

                  <LearningCard
                     number="03"
                     title="Control"
                     text="RESET, ENABLE, and DIRECTION determine what happens on the next rising edge."
                  />
               </div>

               <div className="counter-learning-flow">
                  <div className="counter-flow-block">
                     <span>CURRENT COUNT</span>
                     <strong>0101</strong>
                     <small>stored in register</small>
                  </div>

                  <span className="counter-flow-arrow">
                     →
                  </span>

                  <div className="counter-flow-block counter-flow-logic">
                     <span>ARITHMETIC</span>
                     <strong>+ 1</strong>
                     <small>calculate next value</small>
                  </div>

                  <span className="counter-flow-arrow">
                     →
                  </span>

                  <div className="counter-flow-block">
                     <span>NEXT COUNT</span>
                     <strong>0110</strong>
                     <small>captured on CLOCK ↑</small>
                  </div>
               </div>

               <div className="counter-feedback">
                  <span>↖</span>

                  <div>
                     <strong>Feedback path</strong>

                     <p>
                        After the new value is stored, it
                        becomes the current count used to
                        calculate the following value.
                     </p>
                  </div>
               </div>

               <div className="concept-comparison">
                  <div>
                     <span className="section-label">
                        REGISTER
                     </span>

                     <strong>
                        Q ← external D
                     </strong>

                     <p>
                        The register lesson captured a value
                        supplied at its D input.
                     </p>
                  </div>

                  <div>
                     <span className="section-label">
                        COUNTER
                     </span>

                     <strong>
                        COUNT ← COUNT ± 1
                     </strong>

                     <p>
                        The counter calculates its next value
                        using its own current state.
                     </p>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     KEY IDEA
                  </span>

                  <p>
                     A counter combines sequential storage
                     with combinational arithmetic. The
                     register remembers the current count;
                     logic calculates what should be stored
                     next.
                  </p>
               </div>
            </section>
         )}

         {/* =========================================
             STEP 2 — VISUALIZE
         ========================================= */}

         {currentStep === 1 && (
            <section className="guided-step">
               <div className="guided-step-heading">
                  <span>STEP 02</span>

                  <h3>
                     Visualize the counter datapath
                  </h3>

                  <p>
                     Follow the stored count through the
                     arithmetic logic and back into the
                     register.
                  </p>
               </div>

               <div className="counter-datapath">
                  <div className="datapath-register">
                     <span>REGISTER</span>

                     <strong>{binaryCount}</strong>

                     <small>
                        current state · {count}
                     </small>
                  </div>

                  <div className="datapath-connection">
                     <span>Q</span>
                     <div />
                     <strong>→</strong>
                  </div>

                  <div className="datapath-alu">
                     <span>ARITHMETIC</span>

                     <strong>
                        {direction === "up"
                           ? "+ 1"
                           : "− 1"}
                     </strong>

                     <small>
                        {direction.toUpperCase()}
                     </small>
                  </div>

                  <div className="datapath-connection">
                     <span>NEXT</span>
                     <div />
                     <strong>→</strong>
                  </div>

                  <div className="datapath-mux">
                     <span>CONTROL</span>

                     <strong>MUX</strong>

                     <small>
                        reset / enable
                     </small>
                  </div>
               </div>

               <div className="counter-feedback-path">
                  <span>FEEDBACK</span>

                  <div>
                     COUNT returns to the arithmetic input
                     after each clock edge
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     WHAT QUARTUS SEES
                  </span>

                  <p>
                     When synthesized, this RTL becomes a
                     combination of a register, arithmetic
                     logic, selection logic, and feedback —
                     not a software variable being repeatedly
                     executed.
                  </p>
               </div>
            </section>
         )}

         {/* =========================================
             STEP 3 — EXPERIMENT
         ========================================= */}

         {currentStep === 2 && (
            <section className="guided-step">
               <div className="guided-step-heading">
                  <span>STEP 03</span>

                  <h3>
                     Control the counter
                  </h3>

                  <p>
                     Use the original FPGA Lab simulator to
                     explore RESET, ENABLE, DIRECTION, and
                     4-bit wraparound.
                  </p>
               </div>

               {/* ORIGINAL SIMULATOR PRESERVED */}

               <section className="simulator guided-counter-simulator">
                  <div className="controls">
                     <Control
                        title="RESET"
                        value={
                           reset ? "ON" : "OFF"
                        }
                        active={reset}
                        onClick={toggleReset}
                     />

                     <Control
                        title="ENABLE"
                        value={
                           enable ? "ON" : "OFF"
                        }
                        active={enable}
                        onClick={toggleEnable}
                     />

                     <Control
                        title="DIRECTION"
                        value={direction.toUpperCase()}
                        active={direction === "up"}
                        onClick={toggleDirection}
                     />
                  </div>

                  <div className="counter-area">
                     <div className="register">
                        <span className="register-label">
                           COUNT [3:0]
                        </span>

                        <strong>
                           {binaryCount}
                        </strong>

                        <span className="decimal">
                           DECIMAL {count}
                        </span>
                     </div>

                     <button
                        className="clock-button"
                        onClick={clockEdge}
                     >
                        CLOCK ↑
                     </button>
                  </div>
               </section>

               {/* ORIGINAL EXPLANATION PRESERVED */}

               <section className="details counter-state-details">
                  <article className="panel explanation">
                     <p className="section-label">
                        CURRENT CLOCK EDGE
                     </p>

                     <h3>
                        What just happened?
                     </h3>

                     <p>{explanation}</p>

                     <div className="signal-status">
                        <span>
                           RESET{" "}
                           <b>
                              {reset ? "1" : "0"}
                           </b>
                        </span>

                        <span>
                           ENABLE{" "}
                           <b>
                              {enable ? "1" : "0"}
                           </b>
                        </span>

                        <span>
                           DIRECTION{" "}
                           <b>
                              {direction === "up"
                                 ? "1"
                                 : "0"}
                           </b>
                        </span>

                        <span>
                           COUNT{" "}
                           <b>{binaryCount}</b>
                        </span>
                     </div>

                     <div className="concept-box">
                        <span className="section-label">
                           CONTROL PRIORITY
                        </span>

                        <p>
                           RESET is checked first. If RESET
                           is 0, ENABLE determines whether
                           the count may change. If ENABLE
                           is 1, DIRECTION determines whether
                           the counter increments or
                           decrements.
                        </p>
                     </div>
                  </article>

                  <article className="panel register-experiment-list">
                     <p className="section-label">
                        TRY THESE EXPERIMENTS
                     </p>

                     <h3>
                        Prove the behavior
                     </h3>

                     <Experiment
                        number="01"
                        title="Disable the counter"
                        text="Turn ENABLE off and press CLOCK several times. COUNT should hold its current value."
                     />

                     <Experiment
                        number="02"
                        title="Count down"
                        text="Turn ENABLE on, switch DIRECTION to DOWN, and observe the value decrement on each rising edge."
                     />

                     <Experiment
                        number="03"
                        title="Test reset"
                        text="Turn RESET on without clocking. The stored count should remain unchanged until CLOCK ↑."
                     />

                     <Experiment
                        number="04"
                        title="Find wraparound"
                        text="Count upward through 1111 and observe the next value wrap to 0000."
                     />
                  </article>
               </section>

               <div className="experiment-challenge">
                  <span className="section-label">
                     4-BIT CHALLENGE
                  </span>

                  <h3>
                     Why does 1111 + 1 become 0000?
                  </h3>

                  <p>
                     Four bits can represent only 16
                     combinations: decimal 0 through 15.
                     There is no fifth stored bit in COUNT,
                     so incrementing 1111 wraps the 4-bit
                     result back to 0000.
                  </p>

                  <strong>
                     CURRENT COUNT: {binaryCount} ={" "}
                     {count}
                  </strong>
               </div>
            </section>
         )}

         {/* =========================================
             STEP 4 — CODE + QUARTUS
         ========================================= */}

         {currentStep === 3 && (
            <section className="guided-step">
               <div className="guided-step-heading">
                  <span>STEP 04</span>

                  <h3>
                     Connect the counter to RTL
                  </h3>

                  <p>
                     Now trace the simulator behavior back
                     to the actual Verilog synthesized in
                     Quartus.
                  </p>
               </div>

               <section className="details guided-code-explanation">
                  {/* ORIGINAL RTL PRESERVED */}

                  <article className="panel">
                     <p className="section-label">
                        VERILOG RTL
                     </p>

                     <h3>
                        Counter Implementation
                     </h3>

                     <pre>{`module counter_demo (
   input wire clk,
   input wire reset,
   input wire enable,
   input wire direction,
   output reg [3:0] count
);

always @(posedge clk) begin
   if (reset)
      count <= 4'b0000;
   else if (enable) begin
      if (direction)
         count <= count + 1'b1;
      else
         count <= count - 1'b1;
   end
end

endmodule`}</pre>
                  </article>

                  <article className="panel explanation">
                     <p className="section-label">
                        READ THE RTL
                     </p>

                     <h3>
                        Follow the priority
                     </h3>

                     <div className="rtl-priority">
                        <Priority
                           number="1"
                           title="RESET?"
                           text="If asserted, load 0000."
                        />

                        <Priority
                           number="2"
                           title="ENABLE?"
                           text="If disabled, retain the current count."
                        />

                        <Priority
                           number="3"
                           title="DIRECTION?"
                           text="Choose increment or decrement."
                        />
                     </div>

                     <div className="concept-box">
                        <span className="section-label">
                           FEEDBACK
                        </span>

                        <p>
                           Both arithmetic expressions use
                           <strong> count </strong>
                           itself. The currently stored value
                           therefore feeds the logic that
                           calculates its next value.
                        </p>
                     </div>
                  </article>
               </section>

               <CodeChallenge
                  title="Convert it to an up-counter"
                  instructions="Modify the design so it always counts upward when ENABLE = 1. Remove the direction input and direction decision while preserving RESET and ENABLE."
                  starterCode={`module counter_challenge (
   input wire clk,
   input wire reset,
   input wire enable,
   input wire direction,
   output reg [3:0] count
);

always @(posedge clk) begin
   if (reset)
      count <= 4'b0000;
   else if (enable) begin
      if (direction)
         count <= count + 1'b1;
      else
         count <= count - 1'b1;
   end
end

endmodule`}
                  solutionChecks={[
                     "else if (enable)",
                     "count <= count + 1'b1;",
                  ]}
                  successMessage="Correct. With the direction selection removed, the enabled counter has one next-state operation: current COUNT + 1."
               />

               {/* ORIGINAL QUARTUS RESULTS PRESERVED */}

               <section className="quartus guided-quartus">
                  <div>
                     <p className="section-label">
                        REAL FPGA IMPLEMENTATION
                     </p>

                     <h3>
                        Quartus Prime Synthesis
                     </h3>

                     <p>
                        Synthesized for an Intel Cyclone V
                        5CGXFC7C6U19C7 FPGA using Quartus
                        Prime.
                     </p>
                  </div>

                  <div className="metrics">
                     <Metric
                        value="4"
                        label="Registers"
                     />

                     <Metric
                        value="4"
                        label="ALMs"
                     />

                     <Metric
                        value="100 MHz"
                        label="Clock Constraint"
                     />

                     <Metric
                        value="+8.66 ns"
                        label="Setup Slack"
                     />
                  </div>
               </section>

               <div className="counter-quartus-flow">
                  <div>
                     <span>VERILOG</span>
                     <strong>COUNT ± 1</strong>
                  </div>

                  <span>→</span>

                  <div>
                     <span>RTL VIEWER</span>
                     <strong>
                        Arithmetic + MUX
                     </strong>
                  </div>

                  <span>→</span>

                  <div>
                     <span>REGISTER</span>
                     <strong>4 Bits</strong>
                  </div>

                  <span>→</span>

                  <div>
                     <span>FEEDBACK</span>
                     <strong>Q → Logic</strong>
                  </div>
               </div>

               <section className="timing-note">
                  <p className="section-label">
                     TIMEQUEST TIMING
                  </p>

                  <h3>
                     Setup requirement met ✓
                  </h3>

                  <p>
                     With a 10 ns clock constraint
                     corresponding to 100 MHz, this design
                     produced +8.66 ns of setup slack in the
                     Quartus timing analysis.
                  </p>
               </section>
            </section>
         )}

         {/* =========================================
             STEP 5 — QUIZ
         ========================================= */}

         {currentStep === 4 && (
            <section className="guided-step">
               <div className="guided-step-heading">
                  <span>STEP 05</span>

                  <h3>
                     Check your understanding
                  </h3>

                  <p>
                     Finish the module by checking your
                     understanding of feedback, enable
                     control, wraparound, reset priority,
                     and counter RTL.
                  </p>
               </div>

               <Quiz
                  questions={quizQuestions}
                  onComplete={(score) => {
                     if (
                        score === quizQuestions.length
                     ) {
                        setQuizCompleted(true);

                        localStorage.setItem(
                           "fpga-module-counters",
                           "complete"
                        );

                        window.dispatchEvent(
                           new Event(
                              "fpga-progress-updated"
                           )
                        );
                     }
                  }}
               />

               {quizCompleted && (
                  <div className="module-complete-card">
                     <span>✓</span>

                     <div>
                        <p className="section-label">
                           MODULE COMPLETE
                        </p>

                        <h3>
                           Counters complete
                        </h3>

                        <p>
                           You can now explain how a counter
                           combines a register, arithmetic
                           logic, feedback, and control
                           signals.
                        </p>
                     </div>
                  </div>
               )}
            </section>
         )}

         {/* =========================================
             NAVIGATION
         ========================================= */}

         <div className="lesson-navigation">
            <button
               className="lesson-nav-secondary"
               onClick={previousStep}
               disabled={currentStep === 0}
            >
               ← PREVIOUS
            </button>

            <div>
               <span>
                  {currentStep + 1} / {steps.length}
               </span>
            </div>

            {currentStep < steps.length - 1 ? (
               <button
                  className="lesson-nav-primary"
                  onClick={nextStep}
               >
                  NEXT:{" "}
                  {steps[
                     currentStep + 1
                  ].label.toUpperCase()}{" "}
                  →
               </button>
            ) : (
               <button
                  className="lesson-nav-primary"
                  onClick={() => setCurrentStep(0)}
               >
                  REVIEW LESSON ↻
               </button>
            )}
         </div>
      </>
   );
}

/* =========================================================
   SUPPORTING COMPONENTS
   ========================================================= */

function LearningCard({
   number,
   title,
   text,
}: {
   number: string;
   title: string;
   text: string;
}) {
   return (
      <div className="learning-card">
         <span>{number}</span>
         <strong>{title}</strong>
         <p>{text}</p>
      </div>
   );
}

function Experiment({
   number,
   title,
   text,
}: {
   number: string;
   title: string;
   text: string;
}) {
   return (
      <div className="register-experiment">
         <span>{number}</span>

         <div>
            <strong>{title}</strong>
            <p>{text}</p>
         </div>
      </div>
   );
}

function Priority({
   number,
   title,
   text,
}: {
   number: string;
   title: string;
   text: string;
}) {
   return (
      <div className="priority-item">
         <span>{number}</span>

         <div>
            <strong>{title}</strong>
            <p>{text}</p>
         </div>
      </div>
   );
}

export default CounterLesson;