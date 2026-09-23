import { useState } from "react";
import LessonHeader from "../components/LessonHeader";
import LessonProgress from "../components/LessonProgress";
import CodeChallenge from "../components/CodeChallenge";
import Quiz, {
   type QuizQuestion,
} from "../components/Quiz";
import Control from "../components/Control";
import Metric from "../components/Metric";

type FSMState =
   | "GREEN"
   | "YELLOW"
   | "ALL_RED"
   | "RED";

/* =========================================================
   MODULE 04 — FINITE STATE MACHINES
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
         "The current state is GREEN and TIMER DONE becomes 1, but no clock edge occurs. What happens?",
      options: [
         "The current state immediately becomes YELLOW",
         "The next state becomes YELLOW, but the current state stays GREEN",
         "The current state becomes RED",
         "The FSM resets",
      ],
      correctAnswer: 1,
      explanation:
         "The combinational next-state logic can calculate YELLOW immediately, but the state register does not capture that value until a rising clock edge.",
   },
   {
      question:
         "What is the job of the state register?",
      options: [
         "Calculate the next state",
         "Store the current state",
         "Generate the clock",
         "Calculate setup slack",
      ],
      correctAnswer: 1,
      explanation:
         "The state register stores the FSM's current state and updates it on the active clock edge.",
   },
   {
      question:
         "What happens when TIMER DONE = 0 in this FSM?",
      options: [
         "The FSM automatically moves to GREEN",
         "The next state remains equal to the current state",
         "The state becomes undefined",
         "The clock stops",
      ],
      correctAnswer: 1,
      explanation:
         "The next-state logic begins with next_state = current_state. A transition is selected only when timer_done is asserted.",
   },
   {
      question:
         "Why is this traffic-light controller a Moore-style FSM?",
      options: [
         "Its outputs are determined by the current state",
         "It has four states",
         "It uses a 100 MHz clock",
         "It uses nonblocking assignments",
      ],
      correctAnswer: 0,
      explanation:
         "In a Moore FSM, outputs are determined by the current state. Here the traffic-light outputs correspond to the stored state.",
   },
];

/* =========================================================
   MAIN LESSON
   ========================================================= */

function FSMLesson() {
   const [currentStep, setCurrentStep] = useState(0);

   const [currentState, setCurrentState] =
      useState<FSMState>("GREEN");

   const [timerDone, setTimerDone] =
      useState(false);

   const [reset, setReset] = useState(false);

   const [quizCompleted, setQuizCompleted] =
      useState(
         () =>
            localStorage.getItem(
               "fpga-module-fsm"
            ) === "complete"
      );

   const [explanation, setExplanation] = useState(
      "The controller begins in GREEN. Assert TIMER DONE and press CLOCK ↑ to transition to the next state."
   );

   const getNextState = (
      state: FSMState
   ): FSMState => {
      if (!timerDone)
         return state;

      switch (state) {
         case "GREEN":
            return "YELLOW";

         case "YELLOW":
            return "ALL_RED";

         case "ALL_RED":
            return "RED";

         case "RED":
            return "GREEN";
      }
   };

   const previewNextState: FSMState = reset
      ? "GREEN"
      : getNextState(currentState);

   const toggleReset = () => {
      const next = !reset;
      setReset(next);

      if (next) {
         setExplanation(
            `RESET changed to 1. The current state is still ${currentState} because reset is synchronous. On the next rising edge, the state register will load GREEN.`
         );
      } else {
         setExplanation(
            `RESET changed to 0. The FSM can resume normal state transitions on the next rising clock edge.`
         );
      }
   };

   const toggleTimerDone = () => {
      const next = !timerDone;
      setTimerDone(next);

      if (next) {
         const nextState =
            getNextStateWithTimer(
               currentState,
               true
            );

         setExplanation(
            `TIMER DONE changed to 1. Next-state logic now calculates ${nextState}, but the current state remains ${currentState} until CLOCK ↑.`
         );
      } else {
         setExplanation(
            `TIMER DONE changed to 0. Next state returns to ${currentState}, so the FSM will hold its current state on the next clock edge.`
         );
      }
   };

   const clockEdge = () => {
      const previous = currentState;

      if (reset) {
         setCurrentState("GREEN");

         setExplanation(
            `Rising edge detected. RESET = 1, so the state register loads GREEN. ${previous} → GREEN.`
         );

         return;
      }

      if (!timerDone) {
         setExplanation(
            `Rising edge detected. TIMER DONE = 0, so the FSM remains in ${currentState}.`
         );

         return;
      }

      const next =
         getNextState(currentState);

      setCurrentState(next);

      setExplanation(
         `Rising edge detected. TIMER DONE = 1, so the state register captures the next state. ${currentState} → ${next}.`
      );
   };

   const green =
      currentState === "GREEN";

   const yellow =
      currentState === "YELLOW";

   const red =
      currentState === "RED" ||
      currentState === "ALL_RED";

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
         <LessonHeader badge="Control Logic" />

         <section className="intro">
            <p className="section-label">
               MODULE 04 · GUIDED LESSON
            </p>

            <h2>Finite State Machine</h2>

            <p>
               Learn how an FPGA controller stores its
               current state, calculates what should happen
               next, updates state on a clock edge, and
               generates outputs from that state.
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
                     What is a finite state machine?
                  </h3>

                  <p>
                     An FSM is a digital controller that
                     remembers which state it is currently
                     in and uses inputs to determine which
                     state should come next.
                  </p>
               </div>

               <div className="learning-cards">
                  <LearningCard
                     number="01"
                     title="Current State"
                     text="A state register remembers where the controller is right now."
                  />

                  <LearningCard
                     number="02"
                     title="Next-State Logic"
                     text="Combinational logic examines the current state and inputs to calculate what should come next."
                  />

                  <LearningCard
                     number="03"
                     title="Output Logic"
                     text="The current state determines which outputs the controller should produce."
                  />
               </div>

               <div className="fsm-learning-flow">
                  <div>
                     <span>INPUT</span>
                     <strong>timer_done</strong>
                  </div>

                  <span>→</span>

                  <div>
                     <span>COMBINATIONAL</span>
                     <strong>Next-State Logic</strong>
                  </div>

                  <span>→</span>

                  <div className="fsm-learning-highlight">
                     <span>SEQUENTIAL</span>
                     <strong>State Register</strong>
                     <small>CLOCK ↑</small>
                  </div>

                  <span>→</span>

                  <div>
                     <span>COMBINATIONAL</span>
                     <strong>Output Logic</strong>
                  </div>
               </div>

               <div className="concept-comparison">
                  <div>
                     <span className="section-label">
                        CURRENT STATE
                     </span>

                     <strong>Where am I now?</strong>

                     <p>
                        Stored in the state register and
                        preserved between clock edges.
                     </p>
                  </div>

                  <div>
                     <span className="section-label">
                        NEXT STATE
                     </span>

                     <strong>
                        Where should I go next?
                     </strong>

                     <p>
                        Calculated by combinational logic
                        from the current state and inputs.
                     </p>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     THE THREE-PART MODEL
                  </span>

                  <p>
                     When explaining an FSM, think:
                     <strong>
                        {" "}
                        state register → next-state logic →
                        output logic.
                     </strong>
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
                     Visualize current vs. next state
                  </h3>

                  <p>
                     Toggle TIMER DONE and watch the
                     calculated next state. The current
                     state does not change until CLOCK ↑.
                  </p>
               </div>

               <div className="fsm-visual-controls">
                  <Control
                     title="TIMER DONE"
                     value={
                        timerDone ? "1" : "0"
                     }
                     active={timerDone}
                     onClick={toggleTimerDone}
                  />

                  <div className="control">
                     <span>FSM TYPE</span>
                     <button className="active">
                        MOORE
                     </button>
                  </div>
               </div>

               <FSMVisualization
                  currentState={currentState}
                  previewNextState={
                     previewNextState
                  }
                  green={green}
                  yellow={yellow}
                  red={red}
                  clockEdge={clockEdge}
               />

               <div className="fsm-state-comparison">
                  <div>
                     <span>CURRENT STATE</span>

                     <strong>
                        {currentState}
                     </strong>

                     <small>
                        stored in register
                     </small>
                  </div>

                  <div className="runtime-arrow">
                     →
                  </div>

                  <div>
                     <span>NEXT STATE</span>

                     <strong>
                        {previewNextState}
                     </strong>

                     <small>
                        combinational result
                     </small>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     OBSERVE
                  </span>

                  <p>
                     Set TIMER DONE = 1 without pressing
                     CLOCK. NEXT STATE changes, but CURRENT
                     STATE and the traffic-light output stay
                     associated with the stored state.
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
                     Run the traffic-light controller
                  </h3>

                  <p>
                     Use the complete FSM simulator to move
                     through the state sequence and test
                     hold and reset behavior.
                  </p>
               </div>

               {/* ORIGINAL SIMULATOR PRESERVED */}

               <section className="simulator guided-fsm-simulator">
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
                        title="TIMER DONE"
                        value={
                           timerDone ? "1" : "0"
                        }
                        active={timerDone}
                        onClick={toggleTimerDone}
                     />

                     <div className="control">
                        <span>FSM TYPE</span>

                        <button className="active">
                           MOORE
                        </button>
                     </div>
                  </div>

                  <FSMVisualization
                     currentState={currentState}
                     previewNextState={
                        previewNextState
                     }
                     green={green}
                     yellow={yellow}
                     red={red}
                     clockEdge={clockEdge}
                  />
               </section>

               {/* ORIGINAL LIVE EXPLANATION PRESERVED */}

               <section className="details fsm-state-details">
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
                           TIMER DONE{" "}
                           <b>
                              {timerDone
                                 ? "1"
                                 : "0"}
                           </b>
                        </span>

                        <span>
                           STATE{" "}
                           <b>
                              {currentState}
                           </b>
                        </span>

                        <span>
                           NEXT{" "}
                           <b>
                              {previewNextState}
                           </b>
                        </span>
                     </div>

                     <div className="concept-box">
                        <span className="section-label">
                           KEY CONCEPT
                        </span>

                        <p>
                           The state register remembers the
                           current state. Combinational
                           next-state logic decides what
                           should come next. The state itself
                           changes only when the register
                           captures that value on a rising
                           clock edge.
                        </p>
                     </div>
                  </article>

                  <article className="panel register-experiment-list">
                     <p className="section-label">
                        TRY THESE EXPERIMENTS
                     </p>

                     <h3>
                        Prove the FSM behavior
                     </h3>

                     <Experiment
                        number="01"
                        title="Preview a transition"
                        text="Set TIMER DONE = 1 without clocking. NEXT STATE should change while CURRENT STATE stays the same."
                     />

                     <Experiment
                        number="02"
                        title="Capture the transition"
                        text="Press CLOCK ↑ with TIMER DONE = 1. CURRENT STATE should become the previously calculated next state."
                     />

                     <Experiment
                        number="03"
                        title="Hold a state"
                        text="Set TIMER DONE = 0 and press CLOCK ↑. The controller should remain in its current state."
                     />

                     <Experiment
                        number="04"
                        title="Complete the cycle"
                        text="Follow GREEN → YELLOW → ALL_RED → RED → GREEN."
                     />

                     <Experiment
                        number="05"
                        title="Test synchronous reset"
                        text="Turn RESET on. The current state should not become GREEN until CLOCK ↑ occurs."
                     />
                  </article>
               </section>
            </section>
         )}

         {/* =========================================
             STEP 4 — CODE + HARDWARE + QUARTUS
         ========================================= */}

         {currentStep === 3 && (
            <section className="guided-step">
               <div className="guided-step-heading">
                  <span>STEP 04</span>

                  <h3>
                     Connect the FSM to RTL
                  </h3>

                  <p>
                     Now identify the state register and
                     combinational next-state logic in the
                     Verilog that Quartus synthesized.
                  </p>
               </div>

               <section className="details guided-code-explanation">
                  {/* ORIGINAL RTL PRESERVED */}

                  <article className="panel">
                     <p className="section-label">
                        VERILOG RTL
                     </p>

                     <h3>FSM Implementation</h3>

                     <pre>{`// State register
always @(posedge clk) begin
   if (reset)
      current_state <= GREEN_STATE;
   else
      current_state <= next_state;
end

// Next-state logic
always @(*) begin
   next_state = current_state;

   case (current_state)
      GREEN_STATE:
         if (timer_done)
            next_state = YELLOW_STATE;

      YELLOW_STATE:
         if (timer_done)
            next_state = ALL_RED_STATE;

      ALL_RED_STATE:
         if (timer_done)
            next_state = RED_STATE;

      RED_STATE:
         if (timer_done)
            next_state = GREEN_STATE;

      default:
         next_state = GREEN_STATE;
   endcase
end`}</pre>
                  </article>

                  <article className="panel explanation">
                     <p className="section-label">
                        READ THE RTL
                     </p>

                     <h3>
                        Separate storage from decisions
                     </h3>

                     <div className="fsm-rtl-parts">
                        <RTLPart
                           number="1"
                           title="State Register"
                           code="always @(posedge clk)"
                           text="Stores current_state. This is sequential logic."
                        />

                        <RTLPart
                           number="2"
                           title="Next-State Logic"
                           code="always @(*)"
                           text="Calculates next_state. This is combinational logic."
                        />

                        <RTLPart
                           number="3"
                           title="Output Logic"
                           code="current_state → outputs"
                           text="The Moore outputs are determined from the stored current state."
                        />
                     </div>
                  </article>
               </section>

               <CodeChallenge
                  title="Change the GREEN transition"
                  instructions="Modify the GREEN_STATE transition so TIMER DONE sends the FSM directly from GREEN_STATE to RED_STATE instead of YELLOW_STATE."
                  starterCode={`always @(*) begin
   next_state = current_state;

   case (current_state)
      GREEN_STATE:
         if (timer_done)
            next_state = YELLOW_STATE;

      YELLOW_STATE:
         if (timer_done)
            next_state = ALL_RED_STATE;

      ALL_RED_STATE:
         if (timer_done)
            next_state = RED_STATE;

      RED_STATE:
         if (timer_done)
            next_state = GREEN_STATE;

      default:
         next_state = GREEN_STATE;
   endcase
end`}
                  solutionChecks={[
                     "GREEN_STATE:",
                     "if (timer_done)",
                     "next_state = RED_STATE;",
                  ]}
                  successMessage="Correct. You changed the next-state decision for GREEN. The state register itself did not need to change — it still captures whatever next_state the combinational logic calculates."
               />

               {/* ORIGINAL ARCHITECTURE PRESERVED */}

               <section className="fsm-architecture guided-fsm-architecture">
                  <p className="section-label">
                     HARDWARE ARCHITECTURE
                  </p>

                  <h3>
                     How the FSM maps to hardware
                  </h3>

                  <div className="architecture-flow">
                     <div className="architecture-block">
                        <span>INPUT</span>
                        <strong>
                           timer_done
                        </strong>
                     </div>

                     <span className="architecture-arrow">
                        →
                     </span>

                     <div className="architecture-block">
                        <span>COMBINATIONAL</span>
                        <strong>
                           Next-State Logic
                        </strong>
                     </div>

                     <span className="architecture-arrow">
                        →
                     </span>

                     <div className="architecture-block architecture-highlight">
                        <span>SEQUENTIAL</span>
                        <strong>
                           State Register
                        </strong>
                        <small>posedge clk</small>
                     </div>

                     <span className="architecture-arrow">
                        →
                     </span>

                     <div className="architecture-block">
                        <span>COMBINATIONAL</span>
                        <strong>
                           Output Logic
                        </strong>
                     </div>
                  </div>
               </section>

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
                        Synthesized and timing-analyzed
                        for an Intel Cyclone V
                        5CGXFC7C6U19C7 FPGA using
                        Quartus Prime.
                     </p>
                  </div>

                  <div className="metrics">
                     <Metric
                        value="4"
                        label="Registers"
                     />

                     <Metric
                        value="6"
                        label="I/O Pins"
                     />

                     <Metric
                        value="100 MHz"
                        label="Clock Constraint"
                     />

                     <Metric
                        value="+8.745 ns"
                        label="Setup Slack"
                     />
                  </div>
               </section>

               {/* ORIGINAL TIMING RESULT PRESERVED */}

               <section className="timing-note timing-success">
                  <p className="section-label">
                     TIMEQUEST TIMING ANALYSIS
                  </p>

                  <h3>
                     Timing requirement met ✓
                  </h3>

                  <p>
                     A 10 ns clock constraint specifies a
                     100 MHz clock. TimeQuest reported
                     +8.745 ns of setup slack for this
                     implementation. Positive setup slack
                     means the analyzed path satisfies the
                     specified setup timing requirement.
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
                     Finish the module by checking whether
                     you can distinguish current state,
                     next state, state storage, and Moore
                     output behavior.
                  </p>
               </div>

               <Quiz
                  questions={quizQuestions}
                  onComplete={(score) => {
                     if (
                        score ===
                        quizQuestions.length
                     ) {
                        setQuizCompleted(true);

                        localStorage.setItem(
                           "fpga-module-fsm",
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
                           Finite State Machines
                           complete
                        </h3>

                        <p>
                           You can now explain the
                           relationship between current
                           state, next-state logic, the
                           state register, and Moore
                           outputs.
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
   FSM VISUALIZATION
   ========================================================= */

function FSMVisualization({
   currentState,
   previewNextState,
   green,
   yellow,
   red,
   clockEdge,
}: {
   currentState: FSMState;
   previewNextState: FSMState;
   green: boolean;
   yellow: boolean;
   red: boolean;
   clockEdge: () => void;
}) {
   return (
      <div className="fsm-lab">
         <div className="state-diagram">
            <StateNode
               label="GREEN"
               code="00"
               active={
                  currentState === "GREEN"
               }
            />

            <div className="state-arrow">
               <span>timer_done</span>
               <b>→</b>
            </div>

            <StateNode
               label="YELLOW"
               code="01"
               active={
                  currentState === "YELLOW"
               }
            />

            <div className="state-arrow">
               <span>timer_done</span>
               <b>→</b>
            </div>

            <StateNode
               label="ALL RED"
               code="10"
               active={
                  currentState === "ALL_RED"
               }
            />

            <div className="state-arrow">
               <span>timer_done</span>
               <b>→</b>
            </div>

            <StateNode
               label="RED"
               code="11"
               active={
                  currentState === "RED"
               }
            />
         </div>

         <div className="fsm-return">
            <span>
               RED → GREEN when timer_done = 1
            </span>
         </div>

         <div className="fsm-runtime">
            <div>
               <span>CURRENT STATE</span>
               <strong>{currentState}</strong>
            </div>

            <div className="runtime-arrow">
               →
            </div>

            <div>
               <span>NEXT STATE</span>
               <strong>{previewNextState}</strong>
            </div>
         </div>

         <div className="traffic-light">
            <div
               className={`light red-light ${
                  red ? "light-on" : ""
               }`}
            />

            <div
               className={`light yellow-light ${
                  yellow ? "light-on" : ""
               }`}
            />

            <div
               className={`light green-light ${
                  green ? "light-on" : ""
               }`}
            />
         </div>

         <button
            className="clock-button"
            onClick={clockEdge}
         >
            CLOCK ↑
         </button>
      </div>
   );
}

/* =========================================================
   SUPPORTING COMPONENTS
   ========================================================= */

function StateNode({
   label,
   code,
   active,
}: {
   label: string;
   code: string;
   active: boolean;
}) {
   return (
      <div
         className={`state-node ${
            active ? "state-active" : ""
         }`}
      >
         <span>{code}</span>
         <strong>{label}</strong>

         {active && <small>CURRENT</small>}
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

function RTLPart({
   number,
   title,
   code,
   text,
}: {
   number: string;
   title: string;
   code: string;
   text: string;
}) {
   return (
      <div className="fsm-rtl-part">
         <span>{number}</span>

         <div>
            <strong>{title}</strong>
            <code>{code}</code>
            <p>{text}</p>
         </div>
      </div>
   );
}

/* =========================================================
   HELPER
   ========================================================= */

function getNextStateWithTimer(
   state: FSMState,
   timerDone: boolean
): FSMState {
   if (!timerDone)
      return state;

   switch (state) {
      case "GREEN":
         return "YELLOW";

      case "YELLOW":
         return "ALL_RED";

      case "ALL_RED":
         return "RED";

      case "RED":
         return "GREEN";
   }
}

export default FSMLesson;