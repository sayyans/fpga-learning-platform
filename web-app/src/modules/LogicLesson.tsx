import { useState } from "react";
import LessonHeader from "../components/LessonHeader";
import LessonProgress from "../components/LessonProgress";
import CodeChallenge from "../components/CodeChallenge";
import Quiz, {
   type QuizQuestion,
} from "../components/Quiz";

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
         "What determines the output of a combinational circuit?",
      options: [
         "Only the previous output",
         "The current input values",
         "A rising clock edge",
         "The FPGA clock frequency",
      ],
      correctAnswer: 1,
      explanation:
         "Combinational logic produces outputs from its current inputs. It does not need stored state or a clock edge.",
   },
   {
      question:
         "For a 2:1 multiplexer, SELECT = 0. Which input reaches the output in our design?",
      options: [
         "Input A",
         "Input B",
         "Both inputs",
         "Neither input",
      ],
      correctAnswer: 0,
      explanation:
         "Our Verilog uses 'select ? b : a'. When select is 0, the false branch is chosen, so the output is A.",
   },
   {
      question:
         "If A = 1 and B = 0, what is A XOR B?",
      options: ["0", "1", "A", "Undefined"],
      correctAnswer: 1,
      explanation:
         "XOR outputs 1 when its two inputs are different. Since A = 1 and B = 0, the XOR output is 1.",
   },
];

function LogicLesson() {
   const [currentStep, setCurrentStep] = useState(0);

   const [a, setA] = useState(0);
   const [b, setB] = useState(1);
   const [select, setSelect] = useState(0);

    const [quizCompleted, setQuizCompleted] =
    useState(
        () =>
            localStorage.getItem(
                "fpga-module-logic"
            ) === "complete"
    );

   const andOut = a & b;
   const orOut = a | b;
   const xorOut = a ^ b;
   const notA = a ? 0 : 1;
   const muxOut = select === 0 ? a : b;

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
         <LessonHeader badge="Combinational Logic" />

         <section className="intro">
            <p className="section-label">
               MODULE 01 · GUIDED LESSON
            </p>

            <h2>Logic & Multiplexers</h2>

            <p>
               Learn how combinational circuits calculate
               outputs directly from their current inputs,
               then experiment with the hardware, modify RTL,
               and test your understanding.
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
                  <h3>What is combinational logic?</h3>

                  <p>
                     Combinational circuits calculate their
                     outputs directly from the input values
                     they are receiving right now.
                  </p>
               </div>

               <div className="learning-cards">
                  <LearningCard
                     number="01"
                     title="Inputs"
                     text="Binary signals enter the circuit as 0 or 1."
                  />

                  <LearningCard
                     number="02"
                     title="Logic"
                     text="Logic gates perform operations such as AND, OR, XOR, and NOT."
                  />

                  <LearningCard
                     number="03"
                     title="Outputs"
                     text="The result changes when the current inputs change."
                  />
               </div>

               <div className="concept-comparison">
                  <div>
                     <span className="section-label">
                        COMBINATIONAL
                     </span>

                     <strong>
                        Input → Logic → Output
                     </strong>

                     <p>
                        No stored previous state is required.
                     </p>
                  </div>

                  <div>
                     <span className="section-label">
                        SEQUENTIAL
                     </span>

                     <strong>
                        Input + State + Clock → Output
                     </strong>

                     <p>
                        Registers and state machines can store
                        information between clock edges.
                     </p>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     KEY IDEA
                  </span>

                  <p>
                     If A or B changes in a combinational
                     circuit, the resulting logic output can
                     change without waiting for a clock edge.
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
                  <h3>See the logic gates</h3>

                  <p>
                     Start with A = {a} and B = {b}. The same
                     two inputs can produce different results
                     depending on the logic operation.
                  </p>
               </div>

               <div className="logic-controls">
                  <BitControl
                     label="INPUT A"
                     value={a}
                     onClick={() => setA(a ? 0 : 1)}
                  />

                  <BitControl
                     label="INPUT B"
                     value={b}
                     onClick={() => setB(b ? 0 : 1)}
                  />
               </div>

               <div className="gate-grid guided-gate-grid">
                  <Gate
                     name="AND"
                     expression="A & B"
                     value={andOut}
                  />

                  <Gate
                     name="OR"
                     expression="A | B"
                     value={orOut}
                  />

                  <Gate
                     name="XOR"
                     expression="A ^ B"
                     value={xorOut}
                  />

                  <Gate
                     name="NOT A"
                     expression="~A"
                     value={notA}
                  />
               </div>

               <div className="logic-truth-section guided-truth">
                  <div>
                     <p className="section-label">
                        TRUTH TABLE
                     </p>

                     <h3>Current input combination</h3>

                     <p>
                        The highlighted row follows your A and
                        B inputs.
                     </p>
                  </div>

                  <div className="truth-table">
                     <div className="truth-header">
                        <span>A</span>
                        <span>B</span>
                        <span>AND</span>
                        <span>OR</span>
                        <span>XOR</span>
                     </div>

                     {[
                        [0, 0],
                        [0, 1],
                        [1, 0],
                        [1, 1],
                     ].map(([x, y]) => {
                        const active =
                           a === x && b === y;

                        return (
                           <div
                              key={`${x}-${y}`}
                              className={`truth-row ${
                                 active
                                    ? "truth-row-active"
                                    : ""
                              }`}
                           >
                              <span>{x}</span>
                              <span>{y}</span>
                              <span>{x & y}</span>
                              <span>{x | y}</span>
                              <span>{x ^ y}</span>
                           </div>
                        );
                     })}
                  </div>
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
                  <h3>Experiment with a multiplexer</h3>

                  <p>
                     A multiplexer selects one of several
                     possible inputs and connects the selected
                     input to its output.
                  </p>
               </div>

               <div className="logic-controls">
                  <BitControl
                     label="INPUT A"
                     value={a}
                     onClick={() => setA(a ? 0 : 1)}
                  />

                  <BitControl
                     label="INPUT B"
                     value={b}
                     onClick={() => setB(b ? 0 : 1)}
                  />

                  <BitControl
                     label="MUX SELECT"
                     value={select}
                     onClick={() =>
                        setSelect(select ? 0 : 1)
                     }
                  />
               </div>

               <div className="guided-mux-card">
                  <p className="section-label">
                     2:1 MULTIPLEXER
                  </p>

                  <div className="mux-visual">
                     <div className="mux-inputs">
                        <div
                           className={
                              select === 0
                                 ? "mux-wire mux-wire-active"
                                 : "mux-wire"
                           }
                        >
                           <span>A</span>
                           <strong>{a}</strong>
                           <div className="wire-line" />
                        </div>

                        <div
                           className={
                              select === 1
                                 ? "mux-wire mux-wire-active"
                                 : "mux-wire"
                           }
                        >
                           <span>B</span>
                           <strong>{b}</strong>
                           <div className="wire-line" />
                        </div>
                     </div>

                     <div className="mux-block">
                        <span>2:1</span>
                        <strong>MUX</strong>
                        <small>SEL = {select}</small>
                     </div>

                     <div className="mux-output">
                        <div className="wire-line" />

                        <div>
                           <span>Y</span>
                           <strong>{muxOut}</strong>
                        </div>
                     </div>
                  </div>

                  <div className="mux-explanation">
                     <span>SELECT = {select}</span>

                     <strong>
                        Y = {select === 0 ? "A" : "B"} ={" "}
                        {muxOut}
                     </strong>

                     <p>
                        {select === 0
                           ? "SELECT is 0, so input A is connected to the output."
                           : "SELECT is 1, so input B is connected to the output."}
                     </p>
                  </div>
               </div>

               <div className="experiment-challenge">
                  <span className="section-label">
                     TRY THIS
                  </span>

                  <h3>Can you produce Y = 1?</h3>

                  <p>
                     Change A, B, and SELECT until the
                     multiplexer output becomes 1. Notice that
                     changing the unselected input does not
                     affect Y.
                  </p>

                  <strong>
                     CURRENT OUTPUT: Y = {muxOut}
                  </strong>
               </div>
            </section>
         )}

         {/* =========================================
             STEP 4 — CODE
         ========================================= */}

         {currentStep === 3 && (
            <section className="guided-step">
               <div className="guided-step-heading">
                  <span>STEP 04</span>
                  <h3>Describe the hardware in Verilog</h3>

                  <p>
                     Now connect the visual multiplexer to its
                     RTL representation.
                  </p>
               </div>

               <div className="details guided-code-explanation">
                  <article className="panel">
                     <p className="section-label">
                        ORIGINAL RTL
                     </p>

                     <h3>2:1 Multiplexer</h3>

                     <pre>{`assign mux_out = select ? b : a;`}</pre>
                  </article>

                  <article className="panel explanation">
                     <p className="section-label">
                        READ THE RTL
                     </p>

                     <h3>Conditional operator</h3>

                     <p>
                        The expression asks whether
                        <strong> select </strong>
                        is true.
                     </p>

                     <div className="concept-box">
                        <p>
                           select = 1 → choose B
                           <br />
                           select = 0 → choose A
                        </p>
                     </div>
                  </article>
               </div>

               <CodeChallenge
                  title="Reverse the MUX selection"
                  instructions="Modify the assignment so SELECT = 1 chooses A and SELECT = 0 chooses B."
                  starterCode={`module mux_challenge (
   input wire a,
   input wire b,
   input wire select,
   output wire mux_out
);

   assign mux_out = select ? b : a;

endmodule`}
                  solutionChecks={[
                     "assign mux_out = select ? a : b;",
                  ]}
                  successMessage="Exactly. You reversed the two data choices, so SELECT = 1 now chooses A while SELECT = 0 chooses B."
               />
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
                     Finish the module with a short knowledge
                     check covering combinational logic, gates,
                     and multiplexers.
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
                           "fpga-module-logic",
                           "complete"
                        );

                        window.dispatchEvent(
                            new Event("fpga-progress-updated")
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
                           Logic & Multiplexers complete
                        </h3>

                        <p>
                           You've completed the first FPGA Lab
                           learning module.
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

function BitControl({
   label,
   value,
   onClick,
}: {
   label: string;
   value: number;
   onClick: () => void;
}) {
   return (
      <div className="logic-control">
         <span>{label}</span>

         <button
            className={
               value ? "logic-bit-active" : ""
            }
            onClick={onClick}
         >
            {value}
         </button>
      </div>
   );
}

function Gate({
   name,
   expression,
   value,
}: {
   name: string;
   expression: string;
   value: number;
}) {
   return (
      <div
         className={`gate-card ${
            value ? "gate-card-active" : ""
         }`}
      >
         <span>{expression}</span>
         <strong>{name}</strong>
         <b>{value}</b>
      </div>
   );
}

export default LogicLesson;