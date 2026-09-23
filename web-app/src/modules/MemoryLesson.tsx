import { useState } from "react";
import LessonHeader from "../components/LessonHeader";
import LessonProgress from "../components/LessonProgress";
import CodeChallenge from "../components/CodeChallenge";
import Quiz, {
   type QuizQuestion,
} from "../components/Quiz";
import Metric from "../components/Metric";

/* =========================================================
   MODULE 06 — MEMORY & DATAPATHS
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
         "Memory address 10 contains decimal 20. If ADDRESS = 10, what appears on data_out?",
      options: [
         "10",
         "20",
         "2",
         "The accumulator value",
      ],
      correctAnswer: 1,
      explanation:
         "The address selects one memory location. Address 10 selects memory[2], which contains decimal 20.",
   },
   {
      question:
         "The accumulator contains 10 and data_out is 20. ADD ENABLE = 1, but no rising clock edge has occurred. What is stored in the accumulator?",
      options: [
         "10",
         "20",
         "30",
         "0",
      ],
      correctAnswer: 0,
      explanation:
         "The adder can already calculate 10 + 20 = 30, but the accumulator is sequential storage. It remains 10 until a rising clock edge captures the result.",
   },
   {
      question:
         "Which part of this datapath is combinational?",
      options: [
         "The accumulator register",
         "The clock",
         "The adder",
         "The stored accumulator state",
      ],
      correctAnswer: 2,
      explanation:
         "The adder calculates its output directly from its current inputs. The accumulator is sequential because it stores its result on a clock edge.",
   },
   {
      question:
         "Why did Quartus report 0 dedicated block-memory bits for this design?",
      options: [
         "The Verilog does not contain memory",
         "Quartus failed to synthesize the design",
         "The memory is very small and was implemented without a dedicated block-memory resource",
         "The memory exists only in the web simulator",
      ],
      correctAnswer: 2,
      explanation:
         "The RTL contains a 4 × 8 memory, but this is only 32 bits. Quartus recognized the memory structure while implementing this small storage without consuming a dedicated FPGA block-memory resource.",
   },
];

/* =========================================================
   MAIN LESSON
   ========================================================= */

function MemoryLesson() {
   const [currentStep, setCurrentStep] =
      useState(0);

   const [memory, setMemory] =
      useState([5, 10, 20, 40]);

   const [address, setAddress] =
      useState(0);

   const [dataIn, setDataIn] =
      useState(0);

   const [writeEnable, setWriteEnable] =
      useState(false);

   const [addEnable, setAddEnable] =
      useState(false);

   const [reset, setReset] =
      useState(false);

   const [accumulator, setAccumulator] =
      useState(0);

   const [quizCompleted, setQuizCompleted] =
      useState(
         () =>
            localStorage.getItem(
               "fpga-module-memory"
            ) === "complete"
      );

   const [explanation, setExplanation] =
      useState(
         "Select a memory address, then use WRITE or ADD and press CLOCK ↑ to move data through the datapath."
      );

   const dataOut = memory[address];

   const combinationalResult =
      (accumulator + dataOut) & 0xff;

   const addressBinary = address
      .toString(2)
      .padStart(2, "0");

   const toggleWriteEnable = () => {
      const next = !writeEnable;

      setWriteEnable(next);

      setExplanation(
         next
            ? `WRITE ENABLE changed to 1. DATA IN = ${dataIn} is ready to be written to address ${addressBinary} on the next rising clock edge.`
            : "WRITE ENABLE changed to 0. Memory writes are disabled."
      );
   };

   const toggleAddEnable = () => {
      const next = !addEnable;

      setAddEnable(next);

      setExplanation(
         next
            ? `ADD ENABLE changed to 1. The adder currently calculates ${accumulator} + ${dataOut} = ${combinationalResult}, but the accumulator will not store it until CLOCK ↑.`
            : `ADD ENABLE changed to 0. The accumulator will hold ${accumulator} unless RESET is asserted.`
      );
   };

   const toggleReset = () => {
      const next = !reset;

      setReset(next);

      setExplanation(
         next
            ? `RESET changed to 1. The accumulator is still ${accumulator} because reset is synchronous. Press CLOCK ↑ to load 0.`
            : "RESET changed to 0. Normal accumulator operation can resume on the next rising edge."
      );
   };

   const selectAddress = (
      nextAddress: number
   ) => {
      setAddress(nextAddress);

      const selectedValue =
         memory[nextAddress];

      const result =
         (accumulator +
            selectedValue) &
         0xff;

      setExplanation(
         `ADDRESS changed to ${nextAddress
            .toString(2)
            .padStart(
               2,
               "0"
            )}. data_out immediately becomes ${selectedValue}, so the combinational adder result becomes ${accumulator} + ${selectedValue} = ${result}.`
      );
   };

   const clockEdge = () => {
      const oldAccumulator =
         accumulator;

      /*
       * Memory write and accumulator update are
       * separate clocked processes in the RTL.
       */
      if (writeEnable) {
         const nextMemory = [...memory];

         nextMemory[address] =
            dataIn & 0xff;

         setMemory(nextMemory);
      }

      if (reset) {
         setAccumulator(0);

         setExplanation(
            `Rising edge detected. RESET = 1, so the accumulator register loads 0.${
               writeEnable
                  ? ` WRITE ENABLE was also 1, so ${dataIn & 0xff} was written to memory address ${addressBinary}.`
                  : ""
            }`
         );

         return;
      }

      if (addEnable) {
         const nextAccumulator =
            (accumulator +
               dataOut) &
            0xff;

         setAccumulator(
            nextAccumulator
         );

         setExplanation(
            `Rising edge detected. Address ${addressBinary} outputs ${dataOut}. The adder calculates ${oldAccumulator} + ${dataOut} = ${nextAccumulator}, and the accumulator captures the result.${
               writeEnable
                  ? ` WRITE ENABLE was also 1, so memory address ${addressBinary} was updated to ${dataIn & 0xff}.`
                  : ""
            }`
         );

         return;
      }

      if (writeEnable) {
         setExplanation(
            `Rising edge detected. WRITE ENABLE = 1, so ${dataIn & 0xff} was written to memory address ${addressBinary}.`
         );

         return;
      }

      setExplanation(
         `Rising edge detected, but no write, add, or reset operation was requested. The accumulator remains ${accumulator}.`
      );
   };

   const setMemoryValue = (
      index: number,
      value: number
   ) => {
      const next = [...memory];

      next[index] = Math.max(
         0,
         Math.min(255, value || 0)
      );

      setMemory(next);
   };

   const nextStep = () => {
      if (
         currentStep <
         steps.length - 1
      )
         setCurrentStep(
            currentStep + 1
         );
   };

   const previousStep = () => {
      if (currentStep > 0)
         setCurrentStep(
            currentStep - 1
         );
   };

   return (
      <>
         <LessonHeader badge="Memory & Datapaths" />

         <section className="intro">
            <p className="section-label">
               MODULE 06 · GUIDED LESSON
            </p>

            <h2>Memory & Datapath</h2>

            <p>
               Follow data from an addressed memory
               location through combinational arithmetic
               and into a sequential accumulator register.
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
                     What is a datapath?
                  </h3>

                  <p>
                     A datapath is the hardware that stores,
                     selects, transforms, and moves data.
                     Here, memory supplies a value, an adder
                     transforms it, and an accumulator stores
                     the result.
                  </p>
               </div>

               <div className="learning-cards">
                  <LearningCard
                     number="01"
                     title="Select"
                     text="ADDRESS chooses one of four 8-bit memory locations."
                  />

                  <LearningCard
                     number="02"
                     title="Calculate"
                     text="The selected data_out value enters an 8-bit adder with the current accumulator."
                  />

                  <LearningCard
                     number="03"
                     title="Store"
                     text="The accumulator captures the adder result only on an enabled rising clock edge."
                  />
               </div>

               <div className="memory-learning-flow">
                  <FlowBlock
                     label="ADDRESS"
                     value="00–11"
                     detail="select location"
                  />

                  <span>→</span>

                  <FlowBlock
                     label="MEMORY"
                     value="4 × 8"
                     detail="stored values"
                  />

                  <span>→</span>

                  <FlowBlock
                     label="DATA OUT"
                     value="8 bits"
                     detail="selected value"
                  />

                  <span>→</span>

                  <FlowBlock
                     label="ADDER"
                     value="ACC + DATA"
                     detail="combinational"
                  />

                  <span>→</span>

                  <FlowBlock
                     label="ACCUMULATOR"
                     value="8 bits"
                     detail="CLOCK ↑"
                     highlight
                  />
               </div>

               <div className="concept-comparison">
                  <div>
                     <span className="section-label">
                        COMBINATIONAL
                     </span>

                     <strong>
                        data_out + adder result
                     </strong>

                     <p>
                        These respond to their current
                        inputs without waiting for a clock
                        edge.
                     </p>
                  </div>

                  <div>
                     <span className="section-label">
                        SEQUENTIAL
                     </span>

                     <strong>
                        memory write + accumulator
                     </strong>

                     <p>
                        These update stored state on a
                        rising clock edge.
                     </p>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     KEY IDEA
                  </span>

                  <p>
                     Data can flow through combinational
                     logic before a register stores the
                     result. Calculating a value and storing
                     a value are two different hardware
                     events.
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
                     Follow a value through the datapath
                  </h3>

                  <p>
                     Select different memory addresses and
                     watch data_out and the adder result
                     change immediately. The accumulator
                     stays unchanged.
                  </p>
               </div>

               <div className="memory-visual-address">
                  <span className="section-label">
                     SELECT ADDRESS
                  </span>

                  <div className="address-buttons">
                     {[0, 1, 2, 3].map(
                        (item) => (
                           <button
                              key={item}
                              className={
                                 address ===
                                 item
                                    ? "memory-control-active"
                                    : ""
                              }
                              onClick={() =>
                                 selectAddress(
                                    item
                                 )
                              }
                           >
                              {item
                                 .toString(2)
                                 .padStart(
                                    2,
                                    "0"
                                 )}
                           </button>
                        )
                     )}
                  </div>
               </div>

               <div className="memory-visual-path">
                  <div className="memory-visual-block">
                     <span>
                        MEMORY[
                        {addressBinary}]
                     </span>

                     <strong>
                        {dataOut}
                     </strong>

                     <small>
                        selected value
                     </small>
                  </div>

                  <div className="memory-path-arrow">
                     <span>
                        data_out
                     </span>
                     <strong>→</strong>
                  </div>

                  <div className="memory-visual-block">
                     <span>ADDER</span>

                     <strong>
                        {accumulator} +{" "}
                        {dataOut}
                     </strong>

                     <small>
                        combinational
                     </small>
                  </div>

                  <div className="memory-path-arrow">
                     <span>result</span>
                     <strong>→</strong>
                  </div>

                  <div className="memory-visual-block memory-result-block">
                     <span>RESULT</span>

                     <strong>
                        {
                           combinationalResult
                        }
                     </strong>

                     <small>
                        available now
                     </small>
                  </div>

                  <div className="memory-path-arrow">
                     <span>CLOCK ↑</span>
                     <strong>→</strong>
                  </div>

                  <div className="memory-visual-block memory-acc-block">
                     <span>
                        ACCUMULATOR
                     </span>

                     <strong>
                        {accumulator}
                     </strong>

                     <small>
                        stored value
                     </small>
                  </div>
               </div>

               <div className="memory-before-after">
                  <div>
                     <span>
                        CALCULATED NOW
                     </span>

                     <strong>
                        {
                           combinationalResult
                        }
                     </strong>
                  </div>

                  <span>≠</span>

                  <div>
                     <span>
                        STORED NOW
                     </span>

                     <strong>
                        {accumulator}
                     </strong>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     OBSERVE
                  </span>

                  <p>
                     Changing ADDRESS can immediately change
                     data_out and the calculated result.
                     The accumulator does not automatically
                     follow that result because it is a
                     register.
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
                     Control the complete datapath
                  </h3>

                  <p>
                     Use the original FPGA Lab simulator to
                     read memory, write memory, perform an
                     addition, and capture the result.
                  </p>
               </div>

               <section className="simulator memory-simulator guided-memory-simulator">
                  <div className="memory-control-row">
                     <div>
                        <span>
                           ADDRESS
                        </span>

                        <div className="address-buttons">
                           {[0, 1, 2, 3].map(
                              (item) => (
                                 <button
                                    key={
                                       item
                                    }
                                    className={
                                       address ===
                                       item
                                          ? "memory-control-active"
                                          : ""
                                    }
                                    onClick={() =>
                                       selectAddress(
                                          item
                                       )
                                    }
                                 >
                                    {item
                                       .toString(
                                          2
                                       )
                                       .padStart(
                                          2,
                                          "0"
                                       )}
                                 </button>
                              )
                           )}
                        </div>
                     </div>

                     <div>
                        <span>
                           DATA IN
                        </span>

                        <input
                           type="number"
                           min="0"
                           max="255"
                           value={dataIn}
                           onChange={(
                              event
                           ) =>
                              setDataIn(
                                 Math.max(
                                    0,
                                    Math.min(
                                       255,
                                       Number(
                                          event
                                             .target
                                             .value
                                       )
                                    )
                                 )
                              )
                           }
                        />
                     </div>

                     <ToggleButton
                        title="WRITE ENABLE"
                        value={
                           writeEnable
                        }
                        onClick={
                           toggleWriteEnable
                        }
                     />

                     <ToggleButton
                        title="ADD ENABLE"
                        value={addEnable}
                        onClick={
                           toggleAddEnable
                        }
                     />

                     <ToggleButton
                        title="RESET"
                        value={reset}
                        onClick={
                           toggleReset
                        }
                     />
                  </div>

                  {/* ORIGINAL DATAPATH PRESERVED */}

                  <div className="datapath-workspace">
                     <div className="memory-bank">
                        <p className="section-label">
                           4 × 8 MEMORY
                        </p>

                        {[0, 1, 2, 3].map(
                           (item) => (
                              <div
                                 key={item}
                                 className={`memory-cell ${
                                    address ===
                                    item
                                       ? "memory-cell-selected"
                                       : ""
                                 }`}
                                 onClick={() =>
                                    selectAddress(
                                       item
                                    )
                                 }
                              >
                                 <span>
                                    {item
                                       .toString(
                                          2
                                       )
                                       .padStart(
                                          2,
                                          "0"
                                       )}
                                 </span>

                                 <input
                                    type="number"
                                    min="0"
                                    max="255"
                                    value={
                                       memory[
                                          item
                                       ]
                                    }
                                    onClick={(
                                       event
                                    ) =>
                                       event.stopPropagation()
                                    }
                                    onChange={(
                                       event
                                    ) =>
                                       setMemoryValue(
                                          item,
                                          Number(
                                             event
                                                .target
                                                .value
                                          )
                                       )
                                    }
                                 />

                                 <small>
                                    0x
                                    {memory[
                                       item
                                    ]
                                       .toString(
                                          16
                                       )
                                       .toUpperCase()
                                       .padStart(
                                          2,
                                          "0"
                                       )}
                                 </small>
                              </div>
                           )
                        )}
                     </div>

                     <div className="datapath-arrow">
                        <span>
                           data_out
                        </span>

                        <strong>→</strong>

                        <b>
                           {dataOut}
                        </b>
                     </div>

                     <div className="adder-block">
                        <span>8-BIT</span>
                        <strong>+</strong>
                        <small>ADDER</small>
                     </div>

                     <div className="datapath-arrow">
                        <span>result</span>

                        <strong>→</strong>

                        <b>
                           {
                              combinationalResult
                           }
                        </b>
                     </div>

                     <div className="accumulator-block">
                        <span>
                           ACCUMULATOR
                        </span>

                        <strong>
                           {accumulator}
                        </strong>

                        <small>
                           {accumulator
                              .toString(2)
                              .padStart(
                                 8,
                                 "0"
                              )}
                        </small>
                     </div>
                  </div>

                  <div className="datapath-equation">
                     <span>
                        COMBINATIONAL RESULT
                     </span>

                     <strong>
                        {accumulator} +{" "}
                        {dataOut} ={" "}
                        {
                           combinationalResult
                        }
                     </strong>

                     <p>
                        The adder can calculate this value
                        now, but the accumulator only stores
                        it on a rising clock edge when ADD
                        ENABLE is asserted.
                     </p>
                  </div>

                  <div className="memory-clock-area">
                     <button
                        className="clock-button"
                        onClick={clockEdge}
                     >
                        CLOCK ↑
                     </button>
                  </div>
               </section>

               <section className="details memory-state-details">
                  <article className="panel explanation">
                     <p className="section-label">
                        CURRENT CLOCK EDGE
                     </p>

                     <h3>
                        What just happened?
                     </h3>

                     <p>
                        {explanation}
                     </p>

                     <div className="signal-status">
                        <span>
                           ADDRESS{" "}
                           <b>
                              {
                                 addressBinary
                              }
                           </b>
                        </span>

                        <span>
                           DATA OUT{" "}
                           <b>
                              {dataOut}
                           </b>
                        </span>

                        <span>
                           RESULT{" "}
                           <b>
                              {
                                 combinationalResult
                              }
                           </b>
                        </span>

                        <span>
                           ACC{" "}
                           <b>
                              {
                                 accumulator
                              }
                           </b>
                        </span>
                     </div>

                     <div className="concept-box">
                        <span className="section-label">
                           KEY CONCEPT
                        </span>

                        <p>
                           The address selects a memory
                           location. Its value becomes
                           data_out and feeds the adder.
                           The adder is combinational,
                           while the accumulator is
                           sequential.
                        </p>
                     </div>
                  </article>

                  <article className="panel register-experiment-list">
                     <p className="section-label">
                        TRY THESE EXPERIMENTS
                     </p>

                     <h3>
                        Prove the datapath behavior
                     </h3>

                     <Experiment
                        number="01"
                        title="Read memory"
                        text="Change ADDRESS without pressing CLOCK. Watch data_out change immediately."
                     />

                     <Experiment
                        number="02"
                        title="Calculate without storing"
                        text="Select a memory value and observe the adder result. ACC should remain unchanged."
                     />

                     <Experiment
                        number="03"
                        title="Capture the result"
                        text="Turn ADD ENABLE on and press CLOCK ↑. ACC should capture the previously calculated result."
                     />

                     <Experiment
                        number="04"
                        title="Write memory"
                        text="Choose an address and DATA IN value, enable WRITE, and press CLOCK ↑ to update that location."
                     />

                     <Experiment
                        number="05"
                        title="Test feedback"
                        text="Leave ADD ENABLE on and press CLOCK repeatedly. Each new ACC value feeds the next addition."
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

                  <h3>
                     Connect the datapath to RTL
                  </h3>

                  <p>
                     Separate the synchronous memory write,
                     combinational memory read, and
                     synchronous accumulator into their
                     hardware roles.
                  </p>
               </div>

               <section className="details guided-code-explanation">
                  {/* ORIGINAL RTL PRESERVED */}

                  <article className="panel">
                     <p className="section-label">
                        VERILOG RTL
                     </p>

                     <h3>
                        Memory & Accumulator
                     </h3>

                     <pre>{`reg [7:0] memory [0:3];

// Memory write
always @(posedge clk) begin
   if (write_enable)
      memory[address] <= data_in;
end

// Memory read
always @(*) begin
   data_out = memory[address];
end

// Accumulator datapath
always @(posedge clk) begin
   if (reset)
      accumulator <= 8'b00000000;
   else if (add_enable)
      accumulator <= accumulator + data_out;
end`}</pre>
                  </article>

                  <article className="panel explanation">
                     <p className="section-label">
                        READ THE RTL
                     </p>

                     <h3>
                        Three hardware behaviors
                     </h3>

                     <div className="memory-rtl-parts">
                        <RTLPart
                           number="1"
                           title="Memory Write"
                           code="always @(posedge clk)"
                           text="WRITE ENABLE controls a synchronous update to memory[address]."
                        />

                        <RTLPart
                           number="2"
                           title="Memory Read"
                           code="always @(*)"
                           text="Changing ADDRESS immediately selects the value placed on data_out."
                        />

                        <RTLPart
                           number="3"
                           title="Accumulator"
                           code="always @(posedge clk)"
                           text="ADD ENABLE allows the accumulator register to capture ACC + data_out."
                        />
                     </div>
                  </article>
               </section>

               <CodeChallenge
                  title="Change the datapath operation"
                  instructions="Modify the accumulator so ADD ENABLE causes it to subtract data_out instead of adding data_out. Keep the reset behavior unchanged."
                  starterCode={`always @(posedge clk) begin
   if (reset)
      accumulator <= 8'b00000000;
   else if (add_enable)
      accumulator <= accumulator + data_out;
end`}
                  solutionChecks={[
                     "else if (add_enable)",
                     "accumulator <= accumulator - data_out;",
                  ]}
                  successMessage="Correct. The accumulator still stores a new value on the rising clock edge, but the combinational arithmetic feeding that next value is now subtraction."
               />

               {/* ORIGINAL SYNTHESIZED DATAPATH */}

               <section className="fsm-architecture guided-memory-architecture">
                  <p className="section-label">
                     SYNTHESIZED DATAPATH
                  </p>

                  <h3>
                     How data moves through the hardware
                  </h3>

                  <div className="architecture-flow">
                     <div className="architecture-block">
                        <span>
                           STORAGE
                        </span>

                        <strong>
                           4 × 8 Memory
                        </strong>

                        <small>
                           address →
                           data_out
                        </small>
                     </div>

                     <span className="architecture-arrow">
                        →
                     </span>

                     <div className="architecture-block">
                        <span>
                           COMBINATIONAL
                        </span>

                        <strong>
                           8-Bit Adder
                        </strong>

                        <small>
                           ACC + data_out
                        </small>
                     </div>

                     <span className="architecture-arrow">
                        →
                     </span>

                     <div className="architecture-block architecture-highlight">
                        <span>
                           SEQUENTIAL
                        </span>

                        <strong>
                           Accumulator
                        </strong>

                        <small>
                           posedge clk
                        </small>
                     </div>

                     <span className="architecture-arrow">
                        ↺
                     </span>
                  </div>
               </section>

               {/* ORIGINAL QUARTUS RESULTS */}

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
                        5CGXFC7C6U19C7 FPGA.
                     </p>
                  </div>

                  <div className="metrics">
                     <Metric
                        value="19"
                        label="ALMs"
                     />

                     <Metric
                        value="40"
                        label="Registers"
                     />

                     <Metric
                        value="30"
                        label="I/O Pins"
                     />

                     <Metric
                        value="0"
                        label="Block Memory Bits"
                     />

                     <Metric
                        value="100 MHz"
                        label="Clock Constraint"
                     />

                     <Metric
                        value="+6.362 ns"
                        label="Setup Slack"
                     />
                  </div>
               </section>

               <section className="timing-note">
                  <p className="section-label">
                     MEMORY INFERENCE
                  </p>

                  <h3>
                     RTL memory vs. FPGA resource mapping
                  </h3>

                  <p>
                     Quartus recognized the memory structure
                     in the synthesized RTL, while the final
                     implementation reported zero dedicated
                     block-memory bits. This small 32-bit
                     memory was implemented without
                     consuming a dedicated FPGA block-memory
                     resource.
                  </p>
               </section>

               <section className="timing-note timing-success">
                  <p className="section-label">
                     TIMEQUEST TIMING ANALYSIS
                  </p>

                  <h3>
                     100 MHz timing requirement met ✓
                  </h3>

                  <p>
                     The design was constrained with a
                     10 ns clock period. TimeQuest reported
                     +6.362 ns of setup slack, indicating
                     that the analyzed setup timing
                     requirement is satisfied.
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
                     you can follow data through memory,
                     combinational arithmetic, and
                     sequential storage.
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
                           "fpga-module-memory",
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
                           Memory & Datapaths complete
                        </h3>

                        <p>
                           You can now follow data from an
                           addressed memory location through
                           combinational arithmetic and into
                           sequential storage.
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

function ToggleButton({
   title,
   value,
   onClick,
}: {
   title: string;
   value: boolean;
   onClick: () => void;
}) {
   return (
      <div className="memory-toggle">
         <span>{title}</span>

         <button
            className={
               value
                  ? "memory-control-active"
                  : ""
            }
            onClick={onClick}
         >
            {value ? "ON" : "OFF"}
         </button>
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

function FlowBlock({
   label,
   value,
   detail,
   highlight = false,
}: {
   label: string;
   value: string;
   detail: string;
   highlight?: boolean;
}) {
   return (
      <div
         className={`memory-flow-block ${
            highlight
               ? "memory-flow-highlight"
               : ""
         }`}
      >
         <span>{label}</span>
         <strong>{value}</strong>
         <small>{detail}</small>
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
      <div className="memory-rtl-part">
         <span>{number}</span>

         <div>
            <strong>{title}</strong>
            <code>{code}</code>
            <p>{text}</p>
         </div>
      </div>
   );
}

export default MemoryLesson;