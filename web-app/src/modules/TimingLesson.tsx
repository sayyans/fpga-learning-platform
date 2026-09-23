import { useState } from "react";
import LessonHeader from "../components/LessonHeader";
import LessonProgress from "../components/LessonProgress";
import CodeChallenge from "../components/CodeChallenge";
import Quiz, {
   type QuizQuestion,
} from "../components/Quiz";

/* =========================================================
   MODULE 08 — TIMING ANALYSIS
   ========================================================= */

type TimingDesign =
   | "counter"
   | "fsm"
   | "uart"
   | "memory";

type TimingInfo = {
   name: string;
   slack: number;
   period: number;
   description: string;
};

const steps = [
   { id: "learn", label: "Learn" },
   { id: "visualize", label: "Visualize" },
   { id: "experiment", label: "Experiment" },
   { id: "code", label: "Code" },
   { id: "quiz", label: "Quiz" },
];

const timingData: Record<
   TimingDesign,
   TimingInfo
> = {
   counter: {
      name: "Counter",
      slack: 8.66,
      period: 10,
      description:
         "The 4-bit counter comfortably satisfies the 10 ns clock-period requirement.",
   },

   fsm: {
      name: "Finite State Machine",
      slack: 8.745,
      period: 10,
      description:
         "The FSM state and transition logic satisfy the 100 MHz setup-timing requirement.",
   },

   uart: {
      name: "UART Transmitter",
      slack: 5.933,
      period: 10,
      description:
         "The larger UART transmitter has less timing margin than the smaller examples, but still satisfies the 10 ns requirement.",
   },

   memory: {
      name: "Memory & Datapath",
      slack: 6.362,
      period: 10,
      description:
         "The memory and accumulator datapath also satisfies the 100 MHz setup-timing requirement.",
   },
};

const quizQuestions: QuizQuestion[] = [
   {
      question:
         "A setup path has positive slack. What does that mean?",
      options: [
         "The analyzed setup requirement was satisfied",
         "The clock stopped",
         "The path contains no registers",
         "The design has a timing violation",
      ],
      correctAnswer: 0,
      explanation:
         "Positive setup slack means the analyzed path satisfied its setup timing requirement with margin remaining.",
   },
   {
      question:
         "What clock frequency corresponds to a 10 ns clock period?",
      options: [
         "10 MHz",
         "50 MHz",
         "100 MHz",
         "1000 MHz",
      ],
      correctAnswer: 2,
      explanation:
         "Frequency is the inverse of period. A 10 ns period corresponds to 100 MHz.",
   },
   {
      question:
         "What does create_clock -period 10.000 tell TimeQuest?",
      options: [
         "Generate a physical 100 MHz clock",
         "Analyze the specified clock with a 10 ns period requirement",
         "Add a 10 ns delay to every register",
         "Run the RTL Viewer",
      ],
      correctAnswer: 1,
      explanation:
         "The SDC command defines a timing constraint for analysis. It does not generate the physical clock signal.",
   },
   {
      question:
         "What does negative setup slack indicate?",
      options: [
         "Extra timing margin",
         "The analyzed setup requirement was not satisfied",
         "The FPGA has no combinational logic",
         "The design cannot be synthesized",
      ],
      correctAnswer: 1,
      explanation:
         "Negative setup slack indicates that the analyzed data path failed to satisfy its required setup timing.",
   },
];

/* =========================================================
   MAIN LESSON
   ========================================================= */

function TimingLesson() {
   const [currentStep, setCurrentStep] =
      useState(0);

   const [selected, setSelected] =
      useState<TimingDesign>("uart");

   const [demoPeriod, setDemoPeriod] =
      useState(10);

   const [demoDelay, setDemoDelay] =
      useState(7);

   const [quizCompleted, setQuizCompleted] =
      useState(
         () =>
            localStorage.getItem(
               "fpga-module-timing"
            ) === "complete"
      );

   const design = timingData[selected];

   /*
    * Simplified educational timing model.
    * Real TimeQuest analysis includes additional
    * timing quantities and constraints.
    */
   const demoSlack =
      demoPeriod - demoDelay;

   const timingMet =
      demoSlack >= 0;

   const frequencyMHz =
      demoPeriod > 0
         ? 1000 / demoPeriod
         : 0;

   const nextStep = () => {
      if (
         currentStep <
         steps.length - 1
      ) {
         setCurrentStep(
            currentStep + 1
         );
      }
   };

   const previousStep = () => {
      if (currentStep > 0) {
         setCurrentStep(
            currentStep - 1
         );
      }
   };

   return (
      <>
         <LessonHeader badge="FPGA Workflow" />

         <section className="intro">
            <p className="section-label">
               MODULE 08 · GUIDED LESSON
            </p>

            <h2>Timing Analysis</h2>

            <p>
               Learn how TimeQuest checks whether
               data can travel through FPGA logic
               and satisfy the timing requirement
               at a destination register.
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
                     Can the hardware keep up
                     with the clock?
                  </h3>

                  <p>
                     Synthesis tells us what
                     hardware will be built.
                     Timing analysis asks whether
                     signals can travel through
                     that hardware quickly enough
                     to satisfy the timing
                     constraints.
                  </p>
               </div>

               <div className="learning-cards">
                  <LearningCard
                     number="01"
                     title="Launch"
                     text="A source register launches stored data into the combinational path."
                  />

                  <LearningCard
                     number="02"
                     title="Travel"
                     text="The data propagates through combinational FPGA logic."
                  />

                  <LearningCard
                     number="03"
                     title="Capture"
                     text="The destination register must receive the data in time to satisfy setup timing."
                  />
               </div>

               <section className="timing-equation-card guided-timing-equation">
                  <div>
                     <p className="section-label">
                        CORE IDEA
                     </p>

                     <h3>
                        Required Time −
                        Arrival Time = Slack
                     </h3>

                     <p>
                        Setup slack tells us
                        how much timing margin
                        remains after an analyzed
                        path is compared with its
                        required timing.
                     </p>
                  </div>

                  <div className="slack-status-examples">
                     <div className="slack-positive">
                        <span>
                           POSITIVE SLACK
                        </span>

                        <strong>
                           +2.4 ns
                        </strong>

                        <small>
                           Timing requirement met ✓
                        </small>
                     </div>

                     <div className="slack-negative">
                        <span>
                           NEGATIVE SLACK
                        </span>

                        <strong>
                           −0.8 ns
                        </strong>

                        <small>
                           Timing violation
                        </small>
                     </div>
                  </div>
               </section>

               <div className="timing-concept-grid">
                  <div>
                     <span>
                        CLOCK PERIOD
                     </span>

                     <strong>
                        10 ns
                     </strong>

                     <p>
                        Time between repeating
                        clock edges.
                     </p>
                  </div>

                  <div>
                     <span>
                        FREQUENCY
                     </span>

                     <strong>
                        100 MHz
                     </strong>

                     <p>
                        A 10 ns period corresponds
                        to 100 million cycles per
                        second.
                     </p>
                  </div>

                  <div>
                     <span>
                        SETUP SLACK
                     </span>

                     <strong>
                        + = MET
                     </strong>

                     <p>
                        Positive setup slack means
                        the analyzed setup
                        requirement was satisfied.
                     </p>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     KEY IDEA
                  </span>

                  <p>
                     Functional correctness is not
                     enough. An FPGA design also
                     has to satisfy its timing
                     requirements.
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
                     Follow a setup path
                  </h3>

                  <p>
                     For a register-to-register
                     setup path, data is launched
                     from one register, travels
                     through combinational logic,
                     and is captured by another
                     register.
                  </p>
               </div>

               <div className="timing-visual-path">
                  <div className="timing-visual-register">
                     <span>
                        SOURCE REGISTER
                     </span>

                     <strong>
                        REG A
                     </strong>

                     <small>
                        LAUNCH
                     </small>
                  </div>

                  <div className="timing-visual-comb">
                     <span>
                        COMBINATIONAL PATH
                     </span>

                     <div className="timing-gate-flow">
                        <b>LOGIC</b>
                        <i>→</i>
                        <b>MUX</b>
                        <i>→</i>
                        <b>ADDER</b>
                     </div>

                     <small>
                        propagation delay
                     </small>
                  </div>

                  <div className="timing-visual-register">
                     <span>
                        DESTINATION REGISTER
                     </span>

                     <strong>
                        REG B
                     </strong>

                     <small>
                        CAPTURE
                     </small>
                  </div>
               </div>

               <div className="timing-visual-clock">
                  <div>
                     <span>
                        LAUNCH EDGE
                     </span>

                     <strong>↑</strong>
                  </div>

                  <div className="timing-period-line">
                     <span>
                        CLOCK PERIOD
                     </span>

                     <strong>
                        10 ns
                     </strong>
                  </div>

                  <div>
                     <span>
                        REQUIRED CAPTURE
                     </span>

                     <strong>↑</strong>
                  </div>
               </div>

               <section className="details">
                  <article className="panel explanation">
                     <p className="section-label">
                        SETUP TIMING
                     </p>

                     <h3>
                        What is TimeQuest checking?
                     </h3>

                     <p>
                        For a register-to-register
                        setup path, data is launched
                        from a source register,
                        travels through combinational
                        logic, and must arrive at the
                        destination register in time
                        for the required capture
                        edge.
                     </p>

                     <div className="concept-box">
                        <span className="section-label">
                           POSITIVE SLACK
                        </span>

                        <p>
                           Positive setup slack
                           means the analyzed path
                           satisfied its setup
                           requirement with timing
                           margin remaining.
                        </p>
                     </div>
                  </article>

                  <article className="panel explanation">
                     <p className="section-label">
                        TIMING VIOLATION
                     </p>

                     <h3>
                        What if slack is negative?
                     </h3>

                     <p>
                        Negative setup slack means
                        the analyzed data path did
                        not satisfy its required
                        setup timing.
                     </p>

                     <div className="concept-box">
                        <span className="section-label">
                           POSSIBLE RESPONSES
                        </span>

                        <p>
                           Designers may reduce
                           combinational path depth,
                           pipeline a datapath,
                           change the architecture,
                           review constraints, or
                           target a slower clock
                           requirement depending on
                           the design.
                        </p>
                     </div>
                  </article>
               </section>
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
                     Experiment with timing
                  </h3>

                  <p>
                     Use a simplified timing model
                     to see how the required clock
                     period and path delay affect
                     timing margin.
                  </p>
               </div>

               <div className="timing-demo-disclaimer">
                  <span>
                     CONCEPTUAL MODEL
                  </span>

                  <p>
                     This interactive lab uses
                     CLOCK PERIOD − PATH DELAY as
                     a simplified teaching model.
                     The real TimeQuest results
                     shown below come from Quartus
                     timing analysis.
                  </p>
               </div>

               {/* ORIGINAL INTERACTIVE LAB */}

               <section className="timing-lab guided-timing-lab">
                  <div className="timing-lab-header">
                     <div>
                        <p className="section-label">
                           INTERACTIVE TIMING LAB
                        </p>

                        <h3>
                           Experiment with the
                           clock period
                        </h3>

                        <p>
                           Adjust the required
                           clock period and
                           simulated path delay
                           to see how the
                           simplified setup slack
                           changes.
                        </p>
                     </div>

                     <div
                        className={`timing-result-badge ${
                           timingMet
                              ? "timing-result-pass"
                              : "timing-result-fail"
                        }`}
                     >
                        <span>
                           {timingMet
                              ? "TIMING MET"
                              : "VIOLATION"}
                        </span>

                        <strong>
                           {demoSlack >= 0
                              ? "+"
                              : ""}
                           {demoSlack.toFixed(
                              2
                           )}{" "}
                           ns
                        </strong>
                     </div>
                  </div>

                  <div className="timing-controls-grid">
                     <TimingControl
                        label="CLOCK PERIOD"
                        value={demoPeriod}
                        unit="ns"
                        min={2}
                        max={20}
                        step={0.5}
                        onChange={
                           setDemoPeriod
                        }
                     />

                     <TimingControl
                        label="DATA PATH DELAY"
                        value={demoDelay}
                        unit="ns"
                        min={1}
                        max={15}
                        step={0.5}
                        onChange={
                           setDemoDelay
                        }
                     />

                     <div className="timing-calculated-value">
                        <span>
                           CLOCK FREQUENCY
                        </span>

                        <strong>
                           {frequencyMHz.toFixed(
                              1
                           )}
                        </strong>

                        <small>
                           MHz
                        </small>
                     </div>
                  </div>

                  <div className="timing-path">
                     <div className="timing-register">
                        <span>
                           SOURCE
                        </span>

                        <strong>
                           REG A
                        </strong>

                        <small>
                           launch
                        </small>
                     </div>

                     <div className="timing-path-line">
                        <div
                           className={
                              timingMet
                                 ? "timing-delay-bar"
                                 : "timing-delay-bar timing-delay-fail"
                           }
                           style={{
                              width: `${Math.min(
                                 100,
                                 (demoDelay /
                                    demoPeriod) *
                                    100
                              )}%`,
                           }}
                        />

                        <span>
                           combinational path ·{" "}
                           {demoDelay.toFixed(
                              1
                           )}{" "}
                           ns
                        </span>
                     </div>

                     <div className="timing-register">
                        <span>
                           DESTINATION
                        </span>

                        <strong>
                           REG B
                        </strong>

                        <small>
                           capture
                        </small>
                     </div>
                  </div>

                  <div className="timing-math">
                     <div>
                        <span>
                           REQUIRED
                        </span>

                        <strong>
                           {demoPeriod.toFixed(
                              2
                           )}{" "}
                           ns
                        </strong>
                     </div>

                     <span>−</span>

                     <div>
                        <span>
                           PATH DELAY
                        </span>

                        <strong>
                           {demoDelay.toFixed(
                              2
                           )}{" "}
                           ns
                        </strong>
                     </div>

                     <span>=</span>

                     <div
                        className={
                           timingMet
                              ? "timing-math-result pass"
                              : "timing-math-result fail"
                        }
                     >
                        <span>
                           SLACK
                        </span>

                        <strong>
                           {demoSlack >= 0
                              ? "+"
                              : ""}
                           {demoSlack.toFixed(
                              2
                           )}{" "}
                           ns
                        </strong>
                     </div>
                  </div>
               </section>

               <div className="register-experiment-list timing-experiment-list">
                  <p className="section-label">
                     TRY THESE EXPERIMENTS
                  </p>

                  <h3>
                     Find the timing boundary
                  </h3>

                  <Experiment
                     number="01"
                     title="Create margin"
                     text="Set the clock period to 10 ns and the path delay below 10 ns. The simplified model produces positive slack."
                  />

                  <Experiment
                     number="02"
                     title="Reach zero slack"
                     text="Make the path delay equal to the clock period. The simplified model reaches 0 ns of margin."
                  />

                  <Experiment
                     number="03"
                     title="Create a violation"
                     text="Make the path delay larger than the period. Slack becomes negative."
                  />

                  <Experiment
                     number="04"
                     title="Increase frequency"
                     text="Reduce the clock period and watch the calculated clock frequency rise while the available timing margin becomes harder to satisfy."
                  />
               </div>
            </section>
         )}

         {/* =========================================
             STEP 4 — CODE / SDC
         ========================================= */}

         {currentStep === 3 && (
            <section className="guided-step">
               <div className="guided-step-heading">
                  <span>STEP 04</span>

                  <h3>
                     Tell TimeQuest what
                     timing is required
                  </h3>

                  <p>
                     Static timing analysis needs
                     constraints. In FPGA Lab, the
                     clock requirement was defined
                     using an SDC create_clock
                     command.
                  </p>
               </div>

               {/* ORIGINAL SDC CONTENT */}

               <section className="sdc-section">
                  <article className="panel">
                     <p className="section-label">
                        SYNOPSYS DESIGN
                        CONSTRAINT
                     </p>

                     <h3>
                        Defining the clock
                     </h3>

                     <pre>{`create_clock -name clk -period 10.000 [get_ports {clk}]`}</pre>

                     <p className="sdc-description">
                        This tells TimeQuest that
                        the clk input has a period
                        of 10 ns.
                     </p>
                  </article>

                  <article className="panel explanation">
                     <p className="section-label">
                        PERIOD → FREQUENCY
                     </p>

                     <h3>
                        10 ns = 100 MHz
                     </h3>

                     <div className="frequency-equation">
                        <span>
                           f = 1 / T
                        </span>

                        <strong>
                           1 / 10 ns =
                           100 MHz
                        </strong>
                     </div>

                     <p>
                        The constraint describes
                        the timing requirement.
                        It does not generate the
                        physical clock signal.
                     </p>
                  </article>
               </section>

               <CodeChallenge
                  title="Change the clock requirement"
                  instructions="Modify the SDC constraint so TimeQuest analyzes clk with a 20 ns period instead of 10 ns. Keep the clock name and port unchanged."
                  starterCode={`create_clock -name clk -period 10.000 [get_ports {clk}]`}
                  solutionChecks={[
                     "create_clock",
                     "-name clk",
                     "-period 20.000",
                     "[get_ports {clk}]",
                  ]}
                  successMessage="Correct. A 20 ns clock period corresponds to 50 MHz. You changed the timing requirement — you did not create a physical clock."
               />

               {/* REAL RESULTS PRESERVED */}

               <section className="real-timing-results guided-real-timing">
                  <div>
                     <p className="section-label">
                        REAL TIMEQUEST RESULTS
                     </p>

                     <h3>
                        FPGA Lab timing results
                     </h3>

                     <p>
                        These setup-slack values
                        were recorded from the
                        actual Quartus Prime
                        projects built for
                        FPGA Lab.
                     </p>
                  </div>

                  <div className="timing-design-tabs">
                     {(
                        Object.keys(
                           timingData
                        ) as TimingDesign[]
                     ).map((key) => (
                        <button
                           key={key}
                           className={
                              selected ===
                              key
                                 ? "timing-design-active"
                                 : ""
                           }
                           onClick={() =>
                              setSelected(
                                 key
                              )
                           }
                        >
                           <span>
                              {
                                 timingData[
                                    key
                                 ].name
                              }
                           </span>

                           <strong>
                              +
                              {timingData[
                                 key
                              ].slack.toFixed(
                                 3
                              )}{" "}
                              ns
                           </strong>
                        </button>
                     ))}
                  </div>

                  <div className="selected-timing-result">
                     <div className="selected-timing-main">
                        <span>
                           SELECTED DESIGN
                        </span>

                        <strong>
                           {design.name}
                        </strong>

                        <p>
                           {
                              design.description
                           }
                        </p>
                     </div>

                     <TimingMetric
                        label="CLOCK PERIOD"
                        value={`${design.period} ns`}
                     />

                     <TimingMetric
                        label="CLOCK"
                        value="100 MHz"
                     />

                     <TimingMetric
                        label="SETUP SLACK"
                        value={`+${design.slack.toFixed(
                           3
                        )} ns`}
                        success
                     />

                     <TimingMetric
                        label="STATUS"
                        value="MET ✓"
                        success
                     />
                  </div>
               </section>

               <section className="timing-results-table guided-timing-table">
                  <p className="section-label">
                     COMPARISON
                  </p>

                  <h3>
                     Measured setup slack
                  </h3>

                  <div className="timing-table">
                     <div className="timing-table-header">
                        <span>
                           DESIGN
                        </span>
                        <span>
                           PERIOD
                        </span>
                        <span>
                           FREQUENCY
                        </span>
                        <span>
                           SETUP SLACK
                        </span>
                        <span>
                           STATUS
                        </span>
                     </div>

                     <TimingRow
                        name="Counter"
                        period="10 ns"
                        frequency="100 MHz"
                        slack="+8.660 ns"
                     />

                     <TimingRow
                        name="FSM"
                        period="10 ns"
                        frequency="100 MHz"
                        slack="+8.745 ns"
                     />

                     <TimingRow
                        name="UART TX"
                        period="10 ns"
                        frequency="100 MHz"
                        slack="+5.933 ns"
                     />

                     <TimingRow
                        name="Memory / Datapath"
                        period="10 ns"
                        frequency="100 MHz"
                        slack="+6.362 ns"
                     />
                  </div>
               </section>

               <section className="timing-note timing-success">
                  <p className="section-label">
                     FPGA LAB
                  </p>

                  <h3>
                     All recorded designs met
                     100 MHz setup timing ✓
                  </h3>

                  <p>
                     The Counter, FSM, UART
                     transmitter, and Memory /
                     Datapath examples all
                     produced positive setup
                     slack under their 10 ns
                     clock constraints.
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
                     Final FPGA Lab check
                  </h3>

                  <p>
                     Complete the final module by
                     checking your understanding
                     of clock constraints, setup
                     paths, frequency, and slack.
                  </p>
               </div>

               <Quiz
                  questions={quizQuestions}
                  onComplete={(score) => {
                     if (
                        score ===
                        quizQuestions.length
                     ) {
                        setQuizCompleted(
                           true
                        );

                        localStorage.setItem(
                           "fpga-module-timing",
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
                  <div className="module-complete-card final-module-complete">
                     <span>✓</span>

                     <div>
                        <p className="section-label">
                           FPGA LAB COMPLETE
                        </p>

                        <h3>
                           All 8 modules completed
                        </h3>

                        <p>
                           You progressed from
                           combinational logic and
                           registers through
                           counters, FSMs, UART,
                           datapaths, synthesis,
                           and FPGA timing
                           analysis.
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
               disabled={
                  currentStep === 0
               }
            >
               ← PREVIOUS
            </button>

            <div>
               <span>
                  {currentStep + 1} /{" "}
                  {steps.length}
               </span>
            </div>

            {currentStep <
            steps.length - 1 ? (
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
                  onClick={() =>
                     setCurrentStep(0)
                  }
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

function TimingControl({
   label,
   value,
   unit,
   min,
   max,
   step,
   onChange,
}: {
   label: string;
   value: number;
   unit: string;
   min: number;
   max: number;
   step: number;
   onChange: (value: number) => void;
}) {
   return (
      <div className="timing-control">
         <div>
            <span>{label}</span>

            <strong>
               {value.toFixed(1)}{" "}
               {unit}
            </strong>
         </div>

         <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) =>
               onChange(
                  Number(
                     event.target.value
                  )
               )
            }
         />
      </div>
   );
}

function TimingMetric({
   label,
   value,
   success = false,
}: {
   label: string;
   value: string;
   success?: boolean;
}) {
   return (
      <div
         className={`timing-metric ${
            success
               ? "timing-metric-success"
               : ""
         }`}
      >
         <span>{label}</span>
         <strong>{value}</strong>
      </div>
   );
}

function TimingRow({
   name,
   period,
   frequency,
   slack,
}: {
   name: string;
   period: string;
   frequency: string;
   slack: string;
}) {
   return (
      <div className="timing-table-row">
         <strong>{name}</strong>
         <span>{period}</span>
         <span>{frequency}</span>

         <span className="timing-table-pass">
            {slack}
         </span>

         <span className="timing-table-pass">
            MET ✓
         </span>
      </div>
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

export default TimingLesson;