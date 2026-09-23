import { useState } from "react";
import LessonHeader from "../components/LessonHeader";
import LessonProgress from "../components/LessonProgress";
import Quiz, {
   type QuizQuestion,
} from "../components/Quiz";

/* =========================================================
   MODULE 07 — SYNTHESIS & RTL
   ========================================================= */

type Design =
   | "register"
   | "counter"
   | "fsm"
   | "uart"
   | "memory";

type DesignInfo = {
   name: string;
   subtitle: string;
   rtl: string;
   hardware: string[];
   alms: string;
   registers: string;
   pins: string;
   description: string;
};

const steps = [
   { id: "learn", label: "Learn" },
   { id: "visualize", label: "Visualize" },
   { id: "experiment", label: "Experiment" },
   { id: "code", label: "Code" },
   { id: "quiz", label: "Quiz" },
];

const designs: Record<
   Design,
   DesignInfo
> = {
   register: {
      name: "Register",
      subtitle: "Sequential Storage",

      rtl: `always @(posedge clk) begin
   if (reset)
      q <= 4'b0000;
   else
      q <= d;
end`,

      hardware: [
         "Input D Bus",
         "Reset Selection",
         "4-Bit Register",
         "Output Q Bus",
      ],

      alms: "3",
      registers: "4",
      pins: "10",

      description:
         "Quartus synthesized the clocked assignment into four storage elements with reset-selection logic.",
   },

   counter: {
      name: "Counter",
      subtitle: "Arithmetic + Feedback",

      rtl: `always @(posedge clk) begin
   if (reset)
      count <= 4'b0000;
   else if (enable) begin
      if (direction)
         count <= count + 1'b1;
      else
         count <= count - 1'b1;
   end
end`,

      hardware: [
         "4-Bit Register",
         "Adder / Subtractor",
         "Control MUXes",
         "Feedback Path",
      ],

      alms: "4",
      registers: "4",
      pins: "8",

      description:
         "The counter adds arithmetic and feedback around the register so the next value depends on the stored current value.",
   },

   fsm: {
      name: "Finite State Machine",
      subtitle: "Control Logic",

      rtl: `case (current_state)

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

endcase`,

      hardware: [
         "State Register",
         "Transition Logic",
         "Output Decode",
         "Control MUXes",
      ],

      alms: "N/A",
      registers: "4",
      pins: "6",

      description:
         "Quartus converted the behavioral state transitions into state storage plus combinational transition and output logic.",
   },

   uart: {
      name: "UART TX",
      subtitle: "Integrated Digital System",

      rtl: `reg [7:0] data_reg;
reg [2:0] bit_index;
reg [9:0] baud_counter;
reg [1:0] current_state;

tx <= data_reg[bit_index];

if (baud_counter == CLKS_PER_BIT - 1)
   baud_counter <= 0;`,

      hardware: [
         "UART FSM",
         "Baud Counter",
         "Bit Counter",
         "Data Register",
         "Comparators",
         "MUX Network",
         "TX Control",
      ],

      alms: "24",
      registers: "27",
      pins: "13",

      description:
         "The UART combines registers, counters, state logic, comparisons, and multiplexers into a larger synthesized RTL network.",
   },

   memory: {
      name: "Memory & Datapath",
      subtitle: "Storage + Arithmetic",

      rtl: `reg [7:0] memory [0:3];

always @(posedge clk) begin
   if (write_enable)
      memory[address] <= data_in;
end

always @(posedge clk) begin
   if (reset)
      accumulator <= 8'b00000000;
   else if (add_enable)
      accumulator <= accumulator + data_out;
end`,

      hardware: [
         "Memory Structure",
         "Address Selection",
         "8-Bit Adder",
         "Accumulator Register",
         "Feedback Path",
      ],

      alms: "19",
      registers: "40",
      pins: "30",

      description:
         "Quartus recognized the memory structure and synthesized a datapath containing memory access, arithmetic, storage, and feedback.",
   },
};

const quizQuestions: QuizQuestion[] = [
   {
      question:
         "What is the main purpose of synthesis?",
      options: [
         "Execute Verilog one line at a time",
         "Translate synthesizable HDL into hardware logic",
         "Generate the FPGA clock",
         "Run the web simulator",
      ],
      correctAnswer: 1,
      explanation:
         "Synthesis interprets synthesizable HDL as a description of hardware and translates it into logic structures such as registers, multiplexers, arithmetic units, and control logic.",
   },
   {
      question:
         "What hardware would you expect from always @(posedge clk)?",
      options: [
         "Sequential storage such as registers",
         "Only combinational gates",
         "A physical clock generator",
         "No hardware",
      ],
      correctAnswer: 0,
      explanation:
         "A clocked always block describes sequential behavior. Quartus therefore infers storage elements such as registers.",
   },
   {
      question:
         "Why does a counter contain a feedback path?",
      options: [
         "To send its output to an FPGA pin",
         "Because the next count depends on the currently stored count",
         "To create a new clock",
         "Because all Verilog requires feedback",
      ],
      correctAnswer: 1,
      explanation:
         "The next counter value is calculated from the current stored value, so the register output feeds back into the arithmetic that calculates its next input.",
   },
   {
      question:
         "Why might the final FPGA hardware not look like a literal line-by-line drawing of the Verilog?",
      options: [
         "Quartus ignores the HDL",
         "Synthesis and fitting can optimize the hardware while preserving the intended logic",
         "RTL Viewer only displays software",
         "Verilog cannot describe physical hardware",
      ],
      correctAnswer: 1,
      explanation:
         "Quartus can optimize and transform logic while preserving its intended behavior, so the resulting structure is not necessarily a one-to-one drawing of every HDL statement.",
   },
];

/* =========================================================
   MAIN LESSON
   ========================================================= */

function SynthesisLesson() {
   const [currentStep, setCurrentStep] =
      useState(0);

   const [selected, setSelected] =
      useState<Design>("uart");

   const [prediction, setPrediction] =
      useState<Design | null>(null);

   const [revealed, setRevealed] =
      useState(false);

   const [quizCompleted, setQuizCompleted] =
      useState(
         () =>
            localStorage.getItem(
               "fpga-module-synthesis"
            ) === "complete"
      );

   const design = designs[selected];

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
               MODULE 07 · GUIDED LESSON
            </p>

            <h2>Synthesis & RTL</h2>

            <p>
               Discover how Quartus translates
               synthesizable Verilog into registers,
               arithmetic units, multiplexers, state
               logic, memory structures, and other
               physical FPGA resources.
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
                     From Verilog to hardware
                  </h3>

                  <p>
                     Writing HDL is only the beginning of
                     the FPGA workflow. Quartus must
                     translate the description into logic,
                     map that logic onto FPGA resources,
                     and verify whether the resulting
                     implementation satisfies timing.
                  </p>
               </div>

               <section className="synthesis-pipeline guided-synthesis-pipeline">
                  <p className="section-label">
                     FPGA DESIGN FLOW
                  </p>

                  <div className="pipeline-flow">
                     <PipelineBlock
                        number="01"
                        title="VERILOG"
                        text="Describe hardware behavior"
                     />

                     <span>→</span>

                     <PipelineBlock
                        number="02"
                        title="SYNTHESIS"
                        text="Translate RTL into logic"
                        active
                     />

                     <span>→</span>

                     <PipelineBlock
                        number="03"
                        title="FITTING"
                        text="Map logic onto FPGA resources"
                     />

                     <span>→</span>

                     <PipelineBlock
                        number="04"
                        title="TIMING"
                        text="Verify timing requirements"
                     />
                  </div>
               </section>

               <div className="learning-cards">
                  <LearningCard
                     number="01"
                     title="Describe"
                     text="Verilog describes the behavior and structure that the hardware must implement."
                  />

                  <LearningCard
                     number="02"
                     title="Infer"
                     text="Synthesis recognizes patterns such as registers, adders, multiplexers, counters, and state machines."
                  />

                  <LearningCard
                     number="03"
                     title="Implement"
                     text="Quartus maps and fits the synthesized logic into resources available inside the target FPGA."
                  />
               </div>

               <div className="synthesis-software-comparison">
                  <div>
                     <span className="section-label">
                        SOFTWARE
                     </span>

                     <strong>
                        Instructions execute
                     </strong>

                     <p>
                        A processor executes software
                        instructions over time.
                     </p>
                  </div>

                  <span>≠</span>

                  <div>
                     <span className="section-label">
                        HDL
                     </span>

                     <strong>
                        Hardware is described
                     </strong>

                     <p>
                        Synthesizable Verilog describes
                        logic that will exist as hardware.
                     </p>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     KEY IDEA
                  </span>

                  <p>
                     Verilog is not executed like an
                     ordinary software program. Synthesis
                     interprets synthesizable HDL as a
                     description of hardware that must be
                     built.
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
                     See behavior become structure
                  </h3>

                  <p>
                     Select one of the designs from the
                     previous modules and compare its source
                     RTL with the hardware structures
                     Quartus inferred.
                  </p>
               </div>

               <DesignTabs
                  selected={selected}
                  setSelected={(key) => {
                     setSelected(key);
                     setRevealed(false);
                  }}
               />

               <div className="synthesis-comparison">
                  <article className="synthesis-code">
                     <p className="section-label">
                        SOURCE RTL
                     </p>

                     <h3>
                        {design.name}
                     </h3>

                     <pre>
                        {design.rtl}
                     </pre>
                  </article>

                  <div className="synthesis-arrow">
                     <span>
                        QUARTUS
                     </span>

                     <strong>→</strong>

                     <small>
                        SYNTHESIS
                     </small>
                  </div>

                  <article className="hardware-result">
                     <p className="section-label">
                        INFERRED HARDWARE
                     </p>

                     <h3>
                        RTL Structure
                     </h3>

                     <div className="hardware-block-list">
                        {design.hardware.map(
                           (
                              block,
                              index
                           ) => (
                              <div
                                 key={
                                    block
                                 }
                                 className="hardware-mini-block"
                              >
                                 <span>
                                    {String(
                                       index +
                                          1
                                    ).padStart(
                                       2,
                                       "0"
                                    )}
                                 </span>

                                 <strong>
                                    {
                                       block
                                    }
                                 </strong>
                              </div>
                           )
                        )}
                     </div>
                  </article>
               </div>

               <div className="synthesis-explanation">
                  <span className="section-label">
                     WHAT QUARTUS DID
                  </span>

                  <p>
                     {design.description}
                  </p>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     RTL VIEWER
                  </span>

                  <p>
                     RTL Viewer lets you inspect the
                     structures Quartus inferred from HDL.
                     Registers, arithmetic, multiplexers,
                     state logic, memory structures, and
                     feedback paths become visible as
                     connected hardware blocks.
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
                     Compare synthesized designs
                  </h3>

                  <p>
                     Move between the FPGA Lab designs and
                     compare how different RTL patterns
                     produce different amounts and types of
                     hardware.
                  </p>
               </div>

               <DesignTabs
                  selected={selected}
                  setSelected={setSelected}
               />

               <section className="resource-comparison guided-resource-comparison">
                  <div>
                     <p className="section-label">
                        REAL SYNTHESIS RESULTS
                     </p>

                     <h3>
                        Design complexity
                     </h3>

                     <p>
                        These values come from the Quartus
                        compilation reports generated while
                        building the FPGA Lab hardware
                        examples.
                     </p>
                  </div>

                  <div className="resource-table">
                     <div className="resource-header">
                        <span>
                           DESIGN
                        </span>
                        <span>
                           ALMs
                        </span>
                        <span>
                           REGISTERS
                        </span>
                        <span>
                           PINS
                        </span>
                     </div>

                     <ResourceRow
                        name="Register"
                        alms="3"
                        registers="4"
                        pins="10"
                        active={
                           selected ===
                           "register"
                        }
                        onClick={() =>
                           setSelected(
                              "register"
                           )
                        }
                     />

                     <ResourceRow
                        name="Counter"
                        alms="4"
                        registers="4"
                        pins="8"
                        active={
                           selected ===
                           "counter"
                        }
                        onClick={() =>
                           setSelected(
                              "counter"
                           )
                        }
                     />

                     <ResourceRow
                        name="FSM"
                        alms="N/A"
                        registers="4"
                        pins="6"
                        active={
                           selected ===
                           "fsm"
                        }
                        onClick={() =>
                           setSelected(
                              "fsm"
                           )
                        }
                     />

                     <ResourceRow
                        name="UART TX"
                        alms="24"
                        registers="27"
                        pins="13"
                        active={
                           selected ===
                           "uart"
                        }
                        onClick={() =>
                           setSelected(
                              "uart"
                           )
                        }
                     />

                     <ResourceRow
                        name="Memory / Datapath"
                        alms="19"
                        registers="40"
                        pins="30"
                        active={
                           selected ===
                           "memory"
                        }
                        onClick={() =>
                           setSelected(
                              "memory"
                           )
                        }
                     />
                  </div>
               </section>

               <div className="synthesis-selected-stats">
                  <div>
                     <span>
                        SELECTED DESIGN
                     </span>
                     <strong>
                        {design.name}
                     </strong>
                  </div>

                  <div>
                     <span>ALMs</span>
                     <strong>
                        {design.alms}
                     </strong>
                  </div>

                  <div>
                     <span>
                        REGISTERS
                     </span>
                     <strong>
                        {
                           design.registers
                        }
                     </strong>
                  </div>

                  <div>
                     <span>PINS</span>
                     <strong>
                        {design.pins}
                     </strong>
                  </div>
               </div>

               <div className="register-experiment-list synthesis-experiments">
                  <p className="section-label">
                     INVESTIGATE
                  </p>

                  <h3>
                     Look for hardware patterns
                  </h3>

                  <Experiment
                     number="01"
                     title="Register → Counter"
                     text="Compare the register and counter. Both use four registers, but the counter adds arithmetic, control MUXes, and feedback."
                  />

                  <Experiment
                     number="02"
                     title="Counter → UART"
                     text="Compare a small counter with UART. UART combines multiple registers, counters, state logic, comparators, and control."
                  />

                  <Experiment
                     number="03"
                     title="Inspect Memory"
                     text="Notice that the memory/datapath example uses more stored state and also contains arithmetic and feedback."
                  />
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     IMPORTANT
                  </span>

                  <p>
                     Resource counts are implementation
                     results, not a simple measure of how
                     many lines of Verilog were written.
                     Hardware structure and synthesis
                     optimization determine the final
                     implementation.
                  </p>
               </div>
            </section>
         )}

         {/* =========================================
             STEP 4 — READ RTL
         ========================================= */}

         {currentStep === 3 && (
            <section className="guided-step">
               <div className="guided-step-heading">
                  <span>STEP 04</span>

                  <h3>
                     Predict hardware from RTL
                  </h3>

                  <p>
                     An FPGA engineer should be able to look
                     at synthesizable HDL and form a mental
                     picture of the hardware it describes.
                  </p>
               </div>

               <div className="rtl-prediction-card">
                  <div className="rtl-prediction-code">
                     <p className="section-label">
                        RTL CHALLENGE
                     </p>

                     <h3>
                        What hardware will this require?
                     </h3>

                     <pre>{`always @(posedge clk) begin
   if (reset)
      count <= 4'b0000;
   else if (enable)
      count <= count + 1'b1;
end`}</pre>
                  </div>

                  <div className="rtl-prediction-options">
                     <p className="section-label">
                        MAKE A PREDICTION
                     </p>

                     <PredictionButton
                        title="Register only"
                        selected={
                           prediction ===
                           "register"
                        }
                        onClick={() => {
                           setPrediction(
                              "register"
                           );
                           setRevealed(
                              false
                           );
                        }}
                     />

                     <PredictionButton
                        title="Register + arithmetic + feedback"
                        selected={
                           prediction ===
                           "counter"
                        }
                        onClick={() => {
                           setPrediction(
                              "counter"
                           );
                           setRevealed(
                              false
                           );
                        }}
                     />

                     <PredictionButton
                        title="FSM + output decoder"
                        selected={
                           prediction ===
                           "fsm"
                        }
                        onClick={() => {
                           setPrediction(
                              "fsm"
                           );
                           setRevealed(
                              false
                           );
                        }}
                     />

                     <button
                        className="prediction-reveal"
                        disabled={
                           prediction ===
                           null
                        }
                        onClick={() =>
                           setRevealed(
                              true
                           )
                        }
                     >
                        REVEAL HARDWARE
                     </button>
                  </div>
               </div>

               {revealed && (
                  <div
                     className={`prediction-result ${
                        prediction ===
                        "counter"
                           ? "prediction-correct"
                           : "prediction-wrong"
                     }`}
                  >
                     <span>
                        {prediction ===
                        "counter"
                           ? "✓"
                           : "×"}
                     </span>

                     <div>
                        <p className="section-label">
                           {
                              prediction ===
                              "counter"
                                 ? "CORRECT"
                                 : "TRY AGAIN"
                           }
                        </p>

                        <h3>
                           Register + arithmetic + feedback
                        </h3>

                        <p>
                           The clocked assignment requires
                           storage for count. The
                           expression count + 1 requires
                           arithmetic logic, and count is
                           fed back because its current
                           value is needed to calculate its
                           next value.
                        </p>
                     </div>
                  </div>
               )}

               <div className="rtl-pattern-grid">
                  <RTLPattern
                     code="always @(posedge clk)"
                     hardware="REGISTER"
                     text="A clocked process usually implies sequential storage."
                  />

                  <RTLPattern
                     code="a + b"
                     hardware="ADDER"
                     text="Arithmetic expressions require arithmetic logic."
                  />

                  <RTLPattern
                     code="condition ? a : b"
                     hardware="MUX"
                     text="Conditional data selection commonly becomes multiplexing logic."
                  />

                  <RTLPattern
                     code="case (state)"
                     hardware="CONTROL LOGIC"
                     text="State-dependent decisions become transition or decode logic."
                  />
               </div>

               <section className="details synthesis-details">
                  <article className="panel explanation">
                     <p className="section-label">
                        RTL VIEWER
                     </p>

                     <h3>
                        Behavior becomes structure
                     </h3>

                     <p>
                        RTL Viewer lets you inspect the
                        hardware structures Quartus inferred
                        from HDL. Registers, adders,
                        multiplexers, state logic, memory
                        structures, and feedback paths
                        become visible as connected hardware
                        blocks.
                     </p>

                     <div className="concept-box">
                        <span className="section-label">
                           IMPORTANT
                        </span>

                        <p>
                           Verilog is not executed like
                           ordinary software. Synthesis
                           interprets synthesizable HDL as
                           a description of hardware that
                           must be built.
                        </p>
                     </div>
                  </article>

                  <article className="panel explanation">
                     <p className="section-label">
                        OPTIMIZATION
                     </p>

                     <h3>
                        RTL is not a literal drawing
                     </h3>

                     <p>
                        Quartus can optimize and transform
                        the hardware while preserving the
                        intended logic. The final
                        implementation therefore may not
                        look like a one-to-one graphical
                        translation of every HDL statement.
                     </p>

                     <div className="concept-box">
                        <span className="section-label">
                           EXAMPLE
                        </span>

                        <p>
                           The Memory module used a 4 × 8
                           HDL memory array. RTL Viewer
                           recognized a memory structure,
                           while the final compilation
                           reported zero dedicated
                           block-memory bits.
                        </p>
                     </div>
                  </article>
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
                     you can connect Verilog patterns to
                     synthesized hardware and the Quartus
                     FPGA workflow.
                  </p>
               </div>

               <Quiz
                  questions={
                     quizQuestions
                  }
                  onComplete={(
                     score
                  ) => {
                     if (
                        score ===
                        quizQuestions.length
                     ) {
                        setQuizCompleted(
                           true
                        );

                        localStorage.setItem(
                           "fpga-module-synthesis",
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
                           Synthesis & RTL complete
                        </h3>

                        <p>
                           You can now connect common HDL
                           patterns to the hardware
                           structures Quartus synthesizes
                           from them.
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
               onClick={
                  previousStep
               }
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
   COMPONENTS
   ========================================================= */

function DesignTabs({
   selected,
   setSelected,
}: {
   selected: Design;
   setSelected: (
      design: Design
   ) => void;
}) {
   return (
      <div className="design-tabs">
         {(
            Object.keys(
               designs
            ) as Design[]
         ).map((key) => (
            <button
               key={key}
               className={
                  selected === key
                     ? "design-tab-active"
                     : ""
               }
               onClick={() =>
                  setSelected(key)
               }
            >
               <span>
                  {
                     designs[key]
                        .subtitle
                  }
               </span>

               <strong>
                  {
                     designs[key]
                        .name
                  }
               </strong>
            </button>
         ))}
      </div>
   );
}

function PipelineBlock({
   number,
   title,
   text,
   active = false,
}: {
   number: string;
   title: string;
   text: string;
   active?: boolean;
}) {
   return (
      <div
         className={`pipeline-block ${
            active
               ? "pipeline-block-active"
               : ""
         }`}
      >
         <span>{number}</span>
         <strong>{title}</strong>
         <small>{text}</small>
      </div>
   );
}

function ResourceRow({
   name,
   alms,
   registers,
   pins,
   active,
   onClick,
}: {
   name: string;
   alms: string;
   registers: string;
   pins: string;
   active: boolean;
   onClick: () => void;
}) {
   return (
      <div
         className={`resource-row ${
            active
               ? "resource-row-active"
               : ""
         }`}
         onClick={onClick}
         role="button"
         tabIndex={0}
         onKeyDown={(event) => {
            if (
               event.key ===
                  "Enter" ||
               event.key === " "
            ) {
               onClick();
            }
         }}
      >
         <strong>{name}</strong>
         <span>{alms}</span>
         <span>{registers}</span>
         <span>{pins}</span>
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

function PredictionButton({
   title,
   selected,
   onClick,
}: {
   title: string;
   selected: boolean;
   onClick: () => void;
}) {
   return (
      <button
         className={`prediction-option ${
            selected
               ? "prediction-option-selected"
               : ""
         }`}
         onClick={onClick}
      >
         {title}
      </button>
   );
}

function RTLPattern({
   code,
   hardware,
   text,
}: {
   code: string;
   hardware: string;
   text: string;
}) {
   return (
      <div className="rtl-pattern">
         <code>{code}</code>

         <span>→</span>

         <strong>{hardware}</strong>

         <p>{text}</p>
      </div>
   );
}

export default SynthesisLesson;