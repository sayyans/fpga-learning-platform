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
   MODULE 02 — REGISTERS
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
         "D changes from 0011 to 1010, but no rising clock edge occurs. What happens to Q?",
      options: [
         "Q immediately becomes 1010",
         "Q becomes 0000",
         "Q keeps its previously stored value",
         "Q becomes undefined",
      ],
      correctAnswer: 2,
      explanation:
         "Changing D alone does not update the register. Q keeps its stored value until a rising clock edge occurs.",
   },
   {
      question:
         "RESET becomes 1, but no rising clock edge occurs. What happens in this register design?",
      options: [
         "Q immediately becomes 0000",
         "Q keeps its current value",
         "Q copies D",
         "The clock stops",
      ],
      correctAnswer: 1,
      explanation:
         "RESET is checked inside always @(posedge clk), so this is a synchronous reset. RESET takes effect when the next rising clock edge occurs.",
   },
   {
      question:
         "What does Q represent in a register?",
      options: [
         "The value waiting to be stored",
         "The clock frequency",
         "The value currently stored",
         "The reset signal",
      ],
      correctAnswer: 2,
      explanation:
         "D is the input value waiting to be captured. Q represents the value currently stored by the register.",
   },
   {
      question:
         "Why is <= used for q inside this clocked always block?",
      options: [
         "It is the normal choice for modeling sequential register updates",
         "It converts decimal numbers to binary",
         "It generates the FPGA clock",
         "It makes q combinational",
      ],
      correctAnswer: 0,
      explanation:
         "Nonblocking assignments (<=) are used for clocked sequential logic so register updates are modeled as occurring together after the triggering clock edge.",
   },
];

function RegisterLesson() {
   const [currentStep, setCurrentStep] = useState(0);

   const [d, setD] = useState([
      false,
      false,
      false,
      false,
   ]);

   const [q, setQ] = useState([
      false,
      false,
      false,
      false,
   ]);

   const [reset, setReset] = useState(false);

   const [quizCompleted, setQuizCompleted] =
      useState(
         () =>
            localStorage.getItem(
               "fpga-module-registers"
            ) === "complete"
      );

   const [explanation, setExplanation] = useState(
      "Change the D input, then press CLOCK ↑ to capture it in the register."
   );

   const bitsToString = (bits: boolean[]) =>
      bits.map((bit) => (bit ? "1" : "0")).join("");

   const dBinary = bitsToString(d);
   const qBinary = bitsToString(q);

   const dDecimal = parseInt(dBinary, 2);
   const qDecimal = parseInt(qBinary, 2);

   const toggleBit = (index: number) => {
      const next = [...d];
      next[index] = !next[index];

      setD(next);

      const nextBinary = bitsToString(next);

      setExplanation(
         `D changed to ${nextBinary}. Q is still ${qBinary} because no rising clock edge has occurred yet.`
      );
   };

   const toggleReset = () => {
      const nextReset = !reset;
      setReset(nextReset);

      if (nextReset) {
         setExplanation(
            `RESET changed to 1. Q is still ${qBinary} because this is a synchronous reset. Press CLOCK ↑ to apply the reset.`
         );
      } else {
         setExplanation(
            `RESET changed to 0. The register will capture D = ${dBinary} on the next rising clock edge.`
         );
      }
   };

   const clockEdge = () => {
      const previousQ = qBinary;

      if (reset) {
         setQ([false, false, false, false]);

         setExplanation(
            `Rising edge detected. RESET = 1, so the register loads 0000. Q changed from ${previousQ} → 0000.`
         );

         return;
      }

      setQ([...d]);

      setExplanation(
         `Rising edge detected. RESET = 0, so the register captures D = ${dBinary}. Q changed from ${previousQ} → ${dBinary}.`
      );
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
               MODULE 02 · GUIDED LESSON
            </p>

            <h2>4-Bit Register</h2>

            <p>
               Learn how a register stores binary data,
               visualize the relationship between D and Q,
               experiment with clock edges and reset behavior,
               modify the RTL, and test your understanding.
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

                  <h3>What does a register do?</h3>

                  <p>
                     A register stores binary information.
                     Unlike combinational logic, its output
                     depends on previously stored state.
                  </p>
               </div>

               <div className="learning-cards">
                  <LearningCard
                     number="01"
                     title="D — Data Input"
                     text="D represents the value waiting to be stored by the register."
                  />

                  <LearningCard
                     number="02"
                     title="Clock Edge"
                     text="The register captures its input when the specified clock edge occurs."
                  />

                  <LearningCard
                     number="03"
                     title="Q — Stored Output"
                     text="Q represents the value currently stored inside the register."
                  />
               </div>

               <div className="register-learning-flow">
                  <div>
                     <span>D</span>
                     <strong>1010</strong>
                     <small>waiting value</small>
                  </div>

                  <span className="register-learning-arrow">
                     →
                  </span>

                  <div className="register-learning-chip">
                     <span>4-BIT</span>
                     <strong>REGISTER</strong>
                     <small>posedge clk</small>
                  </div>

                  <span className="register-learning-arrow">
                     →
                  </span>

                  <div>
                     <span>Q</span>
                     <strong>0011</strong>
                     <small>stored value</small>
                  </div>
               </div>

               <div className="concept-comparison">
                  <div>
                     <span className="section-label">
                        BEFORE CLOCK ↑
                     </span>

                     <strong>D = 1010 · Q = 0011</strong>

                     <p>
                        D can change while Q keeps its
                        previously stored value.
                     </p>
                  </div>

                  <div>
                     <span className="section-label">
                        AFTER CLOCK ↑
                     </span>

                     <strong>D = 1010 · Q = 1010</strong>

                     <p>
                        On the rising edge, the register
                        captures D and updates Q.
                     </p>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     KEY IDEA
                  </span>

                  <p>
                     A register gives a digital system memory.
                     Changing D does not automatically change Q.
                     A clock edge controls when the new value is
                     stored.
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

                  <h3>Visualize D and Q</h3>

                  <p>
                     Change the D input below. Watch D and Q
                     separately and notice that Q does not
                     follow D immediately.
                  </p>
               </div>

               <RegisterSimulator
                  d={d}
                  qBinary={qBinary}
                  dDecimal={dDecimal}
                  qDecimal={qDecimal}
                  reset={reset}
                  toggleBit={toggleBit}
                  toggleReset={toggleReset}
                  clockEdge={clockEdge}
                  showControls={false}
               />

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     OBSERVE
                  </span>

                  <p>
                     Try changing several D bits without
                     pressing CLOCK ↑. D changes immediately,
                     but Q continues displaying the value
                     already stored in the register.
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

                  <h3>Experiment with clock and reset</h3>

                  <p>
                     Now use the complete register lab. Change
                     D, generate rising clock edges, and test
                     the synchronous reset.
                  </p>
               </div>

               <RegisterSimulator
                  d={d}
                  qBinary={qBinary}
                  dDecimal={dDecimal}
                  qDecimal={qDecimal}
                  reset={reset}
                  toggleBit={toggleBit}
                  toggleReset={toggleReset}
                  clockEdge={clockEdge}
                  showControls
               />

               {/* Existing live explanation preserved */}

               <section className="details register-state-details">
                  <article className="panel explanation">
                     <p className="section-label">
                        CURRENT STATE
                     </p>

                     <h3>What just happened?</h3>

                     <p>{explanation}</p>

                     <div className="signal-status">
                        <span>
                           RESET{" "}
                           <b>{reset ? "1" : "0"}</b>
                        </span>

                        <span>
                           D <b>{dBinary}</b>
                        </span>

                        <span>
                           Q <b>{qBinary}</b>
                        </span>
                     </div>

                     <div className="concept-box">
                        <span className="section-label">
                           KEY CONCEPT
                        </span>

                        <p>
                           D represents the value waiting to
                           be stored. Q represents the value
                           currently stored in the register.
                           Changing D alone does not change Q.
                        </p>
                     </div>
                  </article>

                  <article className="panel register-experiment-list">
                     <p className="section-label">
                        TRY THESE EXPERIMENTS
                     </p>

                     <h3>Prove the behavior</h3>

                     <Experiment
                        number="01"
                        title="Change D"
                        text="Change D without pressing CLOCK. Verify that Q stays unchanged."
                     />

                     <Experiment
                        number="02"
                        title="Capture D"
                        text="Press CLOCK ↑ and verify that Q becomes equal to D."
                     />

                     <Experiment
                        number="03"
                        title="Test reset"
                        text="Turn RESET on without clocking. Q should stay unchanged."
                     />

                     <Experiment
                        number="04"
                        title="Clock the reset"
                        text="With RESET still on, press CLOCK ↑. Q should become 0000."
                     />
                  </article>
               </section>
            </section>
         )}

         {/* =========================================
             STEP 4 — CODE + QUARTUS
         ========================================= */}

         {currentStep === 3 && (
            <section className="guided-step">
               <div className="guided-step-heading">
                  <span>STEP 04</span>

                  <h3>Connect behavior to RTL</h3>

                  <p>
                     The interactive register behavior comes
                     directly from the sequential structure
                     represented by this Verilog design.
                  </p>
               </div>

               {/* Existing Verilog content preserved */}

               <section className="details guided-code-explanation">
                  <article className="panel">
                     <p className="section-label">
                        VERILOG RTL
                     </p>

                     <h3>Register Implementation</h3>

                     <pre>{`module register_demo (
   input wire clk,
   input wire reset,
   input wire [3:0] d,
   output reg [3:0] q
);

always @(posedge clk) begin
   if (reset)
      q <= 4'b0000;
   else
      q <= d;
end

endmodule`}</pre>
                  </article>

                  <article className="panel explanation">
                     <p className="section-label">
                        READ THE RTL
                     </p>

                     <h3>Clocked sequential logic</h3>

                     <p>
                        <strong>
                           always @(posedge clk)
                        </strong>{" "}
                        means this block responds to the
                        rising edge of the clock.
                     </p>

                     <div className="concept-box">
                        <span className="section-label">
                           SYNCHRONOUS RESET
                        </span>

                        <p>
                           Reset is checked inside the
                           clocked block. Therefore RESET = 1
                           does not immediately clear Q. A
                           rising clock edge must occur.
                        </p>
                     </div>

                     <div className="concept-box">
                        <span className="section-label">
                           NONBLOCKING ASSIGNMENT
                        </span>

                        <p>
                           The register assignments use
                           <strong> &lt;= </strong>
                           because this is sequential,
                           clocked logic.
                        </p>
                     </div>
                  </article>
               </section>

               <CodeChallenge
                  title="Add a register enable"
                  instructions="Modify the register so Q captures D only when enable = 1. Add an enable input and an else-if condition before q <= d."
                  starterCode={`module register_challenge (
   input wire clk,
   input wire reset,
   input wire [3:0] d,
   output reg [3:0] q
);

always @(posedge clk) begin
   if (reset)
      q <= 4'b0000;
   else
      q <= d;
end

endmodule`}
                  solutionChecks={[
                     "input wire enable",
                     "else if (enable)",
                     "q <= d;",
                  ]}
                  successMessage="Nice. The register now captures D only when enable is asserted. If enable is 0, no assignment occurs in that clock cycle, so the register retains its stored value."
               />

               {/* Existing Quartus evidence preserved */}

               <section className="quartus guided-quartus">
                  <div>
                     <p className="section-label">
                        REAL FPGA IMPLEMENTATION
                     </p>

                     <h3>Quartus Prime Synthesis</h3>

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

                     <Metric value="3" label="ALMs" />

                     <Metric
                        value="10"
                        label="I/O Pins"
                     />

                     <Metric
                        value="100 MHz"
                        label="Clock Constraint"
                     />
                  </div>
               </section>

               {/* Existing timing note preserved */}

               <section className="timing-note">
                  <p className="section-label">
                     TIMING ANALYSIS
                  </p>

                  <h3>
                     Why isn't setup slack shown?
                  </h3>

                  <p>
                     This design does not contain an
                     internal register-to-register data path.
                     Since external input and output delays
                     were not specified, TimeQuest has no
                     constrained setup path to report for
                     this experiment.
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

                  <h3>Check your understanding</h3>

                  <p>
                     Finish the module by checking your
                     understanding of D, Q, clock edges,
                     synchronous reset, and sequential RTL.
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
                           "fpga-module-registers",
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

                        <h3>Registers complete</h3>

                        <p>
                           You can now explain the
                           relationship between D, Q, clock
                           edges, synchronous reset, and
                           sequential register RTL.
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
   REGISTER SIMULATOR
   ========================================================= */

function RegisterSimulator({
   d,
   qBinary,
   dDecimal,
   qDecimal,
   reset,
   toggleBit,
   toggleReset,
   clockEdge,
   showControls,
}: {
   d: boolean[];
   qBinary: string;
   dDecimal: number;
   qDecimal: number;
   reset: boolean;
   toggleBit: (index: number) => void;
   toggleReset: () => void;
   clockEdge: () => void;
   showControls: boolean;
}) {
   return (
      <section className="simulator guided-register-simulator">
         {showControls && (
            <div className="controls">
               <Control
                  title="RESET"
                  value={reset ? "ON" : "OFF"}
                  active={reset}
                  onClick={toggleReset}
               />

               <div className="control">
                  <span>CLOCK TYPE</span>
                  <button className="active">
                     RISING EDGE
                  </button>
               </div>

               <div className="control">
                  <span>WIDTH</span>
                  <button className="active">
                     4-BIT
                  </button>
               </div>
            </div>
         )}

         <div className="register-lab">
            <div className="data-side">
               <span className="register-label">
                  D INPUT [3:0]
               </span>

               <div className="bit-controls">
                  {d.map((bit, index) => (
                     <button
                        key={index}
                        className={`bit-button ${
                           bit ? "bit-on" : ""
                        }`}
                        onClick={() =>
                           toggleBit(index)
                        }
                     >
                        {bit ? "1" : "0"}
                     </button>
                  ))}
               </div>

               <span className="decimal">
                  DECIMAL {dDecimal}
               </span>
            </div>

            <div className="register-flow">
               <span>D</span>
               <div className="flow-line" />

               <div className="register-chip">
                  <span>4-BIT</span>
                  <strong>REGISTER</strong>
                  <small>posedge clk</small>
               </div>

               <div className="flow-line" />
               <span>Q</span>
            </div>

            <div className="data-side">
               <span className="register-label">
                  Q OUTPUT [3:0]
               </span>

               <strong className="register-output">
                  {qBinary}
               </strong>

               <span className="decimal">
                  DECIMAL {qDecimal}
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

export default RegisterLesson;