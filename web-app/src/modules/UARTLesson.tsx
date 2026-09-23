import { useState } from "react";
import LessonHeader from "../components/LessonHeader";
import LessonProgress from "../components/LessonProgress";
import CodeChallenge from "../components/CodeChallenge";
import Quiz, {
   type QuizQuestion,
} from "../components/Quiz";
import Metric from "../components/Metric";

type UARTBit = {
   label: string;
   value: number;
};

/* =========================================================
   MODULE 05 — UART
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
         "What logic level does the UART TX line use while idle?",
      options: [
         "0",
         "1",
         "It alternates",
         "It is undefined",
      ],
      correctAnswer: 1,
      explanation:
         "The UART transmitter holds TX high while idle. A frame begins by driving the line low for the start bit.",
   },
   {
      question:
         "In what order are the eight data bits transmitted by this UART design?",
      options: [
         "D7 through D0",
         "D0 through D7",
         "All eight simultaneously",
         "The order changes with each byte",
      ],
      correctAnswer: 1,
      explanation:
         "The transmitter indexes data_reg starting at bit 0, so UART data is transmitted least-significant bit first: D0 through D7.",
   },
   {
      question:
         "What is the purpose of baud_counter?",
      options: [
         "Store the transmitted byte",
         "Choose the current data bit",
         "Hold each UART bit for the required number of FPGA clock cycles",
         "Generate the start bit value",
      ],
      correctAnswer: 2,
      explanation:
         "The FPGA clock is much faster than the UART baud rate. baud_counter counts FPGA clock cycles so each serial bit remains on TX for the required bit period.",
   },
   {
      question:
         "Which hardware block stores the byte while it is being transmitted?",
      options: [
         "bit_index",
         "baud_counter",
         "data_reg",
         "current_state",
      ],
      correctAnswer: 2,
      explanation:
         "data_reg stores the 8-bit byte. bit_index chooses which stored bit is currently being placed on TX.",
   },
];

/* =========================================================
   MAIN LESSON
   ========================================================= */

function UARTLesson() {
   const [currentStep, setCurrentStep] =
      useState(0);

   const [input, setInput] = useState("A");
   const [frame, setFrame] =
      useState<UARTBit[]>([]);
   const [activeBit, setActiveBit] =
      useState(-1);
   const [busy, setBusy] = useState(false);

   const [quizCompleted, setQuizCompleted] =
      useState(
         () =>
            localStorage.getItem(
               "fpga-module-uart"
            ) === "complete"
      );

   const character =
      input.length > 0 ? input[0] : "A";

   const byte =
      character.charCodeAt(0) & 0xff;

   const binary = byte
      .toString(2)
      .padStart(8, "0");

   const buildFrame = () => {
      const dataBits: UARTBit[] = [];

      for (let i = 0; i < 8; i++) {
         dataBits.push({
            label: `D${i}`,
            value: (byte >> i) & 1,
         });
      }

      return [
         { label: "IDLE", value: 1 },
         { label: "START", value: 0 },
         ...dataBits,
         { label: "STOP", value: 1 },
      ];
   };

   const transmit = async () => {
      if (busy)
         return;

      const nextFrame = buildFrame();

      setFrame(nextFrame);
      setBusy(true);
      setActiveBit(0);

      for (
         let i = 0;
         i < nextFrame.length;
         i++
      ) {
         setActiveBit(i);

         await new Promise((resolve) =>
            setTimeout(resolve, 350)
         );
      }

      setActiveBit(-1);
      setBusy(false);
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
         <LessonHeader badge="Serial Communication" />

         <section className="intro">
            <p className="section-label">
               MODULE 05 · GUIDED LESSON
            </p>

            <h2>UART Transmitter</h2>

            <p>
               Combine registers, counters, finite state
               machines, and timing to convert an 8-bit
               parallel value into a serial UART frame.
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
                     From parallel data to serial data
                  </h3>

                  <p>
                     Inside the FPGA, a byte exists as eight
                     bits at once. UART sends those bits
                     across a single TX wire one bit at a
                     time.
                  </p>
               </div>

               <div className="learning-cards">
                  <LearningCard
                     number="01"
                     title="Load"
                     text="The transmitter stores the 8-bit byte in data_reg."
                  />

                  <LearningCard
                     number="02"
                     title="Serialize"
                     text="bit_index selects D0 through D7 one at a time, least-significant bit first."
                  />

                  <LearningCard
                     number="03"
                     title="Time"
                     text="baud_counter keeps each bit on the TX line for the required UART bit period."
                  />
               </div>

               <div className="uart-learning-frame">
                  <UARTLearnBit
                     label="IDLE"
                     value="1"
                     detail="line waits high"
                  />

                  <span>→</span>

                  <UARTLearnBit
                     label="START"
                     value="0"
                     detail="frame begins"
                  />

                  <span>→</span>

                  <UARTLearnBit
                     label="DATA"
                     value="D0...D7"
                     detail="LSB first"
                  />

                  <span>→</span>

                  <UARTLearnBit
                     label="STOP"
                     value="1"
                     detail="frame ends"
                  />
               </div>

               <div className="uart-previous-lessons">
                  <p className="section-label">
                     PREVIOUS LESSONS WORKING TOGETHER
                  </p>

                  <div>
                     <div>
                        <span>02</span>
                        <strong>REGISTER</strong>
                        <p>Stores the byte.</p>
                     </div>

                     <div>
                        <span>03</span>
                        <strong>COUNTER</strong>
                        <p>Tracks bits and timing.</p>
                     </div>

                     <div>
                        <span>04</span>
                        <strong>FSM</strong>
                        <p>
                           Controls the transmission
                           sequence.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     KEY IDEA
                  </span>

                  <p>
                     UART is not a completely new kind of
                     hardware. It combines the digital
                     building blocks from the previous
                     modules into a larger system.
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
                     Build the serial frame
                  </h3>

                  <p>
                     Enter a character and inspect the byte
                     before transmitting it. Notice that the
                     displayed byte and the transmission
                     order are not written in the same
                     direction.
                  </p>
               </div>

               <div className="uart-byte-builder">
                  <div>
                     <span className="section-label">
                        CHARACTER
                     </span>

                     <input
                        className="uart-character-input"
                        value={input}
                        maxLength={1}
                        onChange={(event) =>
                           setInput(
                              event.target.value
                           )
                        }
                     />
                  </div>

                  <div className="uart-byte-step">
                     <span>BYTE (HEX)</span>

                     <strong>
                        0x
                        {byte
                           .toString(16)
                           .toUpperCase()
                           .padStart(2, "0")}
                     </strong>
                  </div>

                  <div className="uart-byte-arrow">
                     →
                  </div>

                  <div className="uart-byte-step">
                     <span>BINARY</span>
                     <strong>{binary}</strong>
                  </div>
               </div>

               <div className="uart-frame-section guided-uart-frame">
                  <p className="section-label">
                     SERIAL FRAME
                  </p>

                  <div className="uart-frame">
                     {buildFrame().map(
                        (bit, index) => (
                           <div
                              key={`${bit.label}-${index}`}
                              className="uart-bit"
                           >
                              <span>
                                 {bit.label}
                              </span>

                              <strong>
                                 {bit.value}
                              </strong>
                           </div>
                        )
                     )}
                  </div>

                  <div className="uart-direction">
                     TRANSMISSION ORDER →
                  </div>
               </div>

               <div className="uart-bit-order">
                  <div>
                     <span>
                        STORED BYTE
                     </span>

                     <strong>
                        {binary}
                     </strong>

                     <small>
                        D7 → D0 when written
                     </small>
                  </div>

                  <div className="runtime-arrow">
                     →
                  </div>

                  <div>
                     <span>
                        UART DATA ORDER
                     </span>

                     <strong>
                        {buildFrame()
                           .slice(2, 10)
                           .map(
                              (bit) =>
                                 bit.value
                           )
                           .join("")}
                     </strong>

                     <small>
                        D0 → D7 transmitted
                     </small>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     LSB FIRST
                  </span>

                  <p>
                     The first UART data bit is D0, the
                     least-significant bit of the stored
                     byte. The transmitter then advances
                     through D1, D2, and so on until D7.
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
                     Transmit a UART frame
                  </h3>

                  <p>
                     Use the original UART simulator and
                     watch the TX line move through IDLE,
                     START, D0–D7, and STOP.
                  </p>
               </div>

               {/* ORIGINAL SIMULATOR PRESERVED */}

               <UARTSimulator
                  input={input}
                  setInput={setInput}
                  byte={byte}
                  binary={binary}
                  frame={frame}
                  activeBit={activeBit}
                  busy={busy}
                  buildFrame={buildFrame}
                  transmit={transmit}
               />

               <div className="uart-live-explanation">
                  <div>
                     <span className="section-label">
                        CURRENT TRANSMISSION
                     </span>

                     <h3>
                        {activeBit >= 0
                           ? frame[activeBit]
                                ?.label
                           : "IDLE"}
                     </h3>

                     <p>
                        {getUARTExplanation(
                           frame,
                           activeBit,
                           busy
                        )}
                     </p>
                  </div>

                  <div className="signal-status">
                     <span>
                        TX{" "}
                        <b>
                           {activeBit >= 0
                              ? frame[
                                   activeBit
                                ]?.value
                              : 1}
                        </b>
                     </span>

                     <span>
                        BUSY{" "}
                        <b>
                           {busy ? "1" : "0"}
                        </b>
                     </span>

                     <span>
                        BIT{" "}
                        <b>
                           {activeBit >= 0
                              ? frame[
                                   activeBit
                                ]?.label
                              : "IDLE"}
                        </b>
                     </span>
                  </div>
               </div>

               <div className="register-experiment-list uart-experiments">
                  <p className="section-label">
                     TRY THESE EXPERIMENTS
                  </p>

                  <h3>
                     Follow the serial behavior
                  </h3>

                  <Experiment
                     number="01"
                     title="Watch idle"
                     text="Before TRANSMIT is pressed, verify that TX is 1 and BUSY is 0."
                  />

                  <Experiment
                     number="02"
                     title="Find the start bit"
                     text="Press TRANSMIT and watch TX become 0 when START is highlighted."
                  />

                  <Experiment
                     number="03"
                     title="Follow D0 through D7"
                     text="Compare each highlighted data bit with the LSB-first data sequence shown in the frame."
                  />

                  <Experiment
                     number="04"
                     title="Try another byte"
                     text="Enter a different character and observe how the eight data bits change while START and STOP remain the same."
                  />
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
                     Connect UART behavior to RTL
                  </h3>

                  <p>
                     Identify the register, counters, FSM,
                     and timing logic that work together to
                     generate the serial TX waveform.
                  </p>
               </div>

               <section className="details guided-code-explanation">
                  {/* ORIGINAL RTL PRESERVED */}

                  <article className="panel">
                     <p className="section-label">
                        VERILOG RTL
                     </p>

                     <h3>
                        UART TX Architecture
                     </h3>

                     <pre>{`localparam CLKS_PER_BIT = 868;

localparam IDLE_STATE  = 2'b00;
localparam START_STATE = 2'b01;
localparam DATA_STATE  = 2'b10;
localparam STOP_STATE  = 2'b11;

reg [7:0] data_reg;
reg [2:0] bit_index;
reg [9:0] baud_counter;
reg [1:0] current_state;

// DATA state
tx <= data_reg[bit_index];

if (baud_counter == CLKS_PER_BIT - 1) begin
   baud_counter <= 0;

   if (bit_index == 3'b111)
      current_state <= STOP_STATE;
   else
      bit_index <= bit_index + 1'b1;
end`}</pre>
                  </article>

                  {/* ORIGINAL BUILDING BLOCKS PRESERVED */}

                  <article className="panel explanation">
                     <p className="section-label">
                        HARDWARE BUILDING BLOCKS
                     </p>

                     <h3>
                        Previous lessons working together
                     </h3>

                     <div className="uart-building-blocks">
                        <div>
                           <span>
                              REGISTER
                           </span>

                           <strong>
                              data_reg[7:0]
                           </strong>

                           <p>
                              Stores the byte being
                              transmitted.
                           </p>
                        </div>

                        <div>
                           <span>
                              COUNTER
                           </span>

                           <strong>
                              bit_index
                           </strong>

                           <p>
                              Tracks data bits D0 through
                              D7.
                           </p>
                        </div>

                        <div>
                           <span>FSM</span>

                           <strong>
                              current_state
                           </strong>

                           <p>
                              Controls IDLE, START, DATA,
                              and STOP.
                           </p>
                        </div>

                        <div>
                           <span>TIMING</span>

                           <strong>
                              baud_counter
                           </strong>

                           <p>
                              Holds each UART bit for
                              approximately 868 FPGA clock
                              cycles.
                           </p>
                        </div>
                     </div>
                  </article>
               </section>

               <div className="uart-timing-math">
                  <div>
                     <span className="section-label">
                        CLOCK
                     </span>
                     <strong>
                        100,000,000 Hz
                     </strong>
                  </div>

                  <span>÷</span>

                  <div>
                     <span className="section-label">
                        BAUD
                     </span>
                     <strong>115,200</strong>
                  </div>

                  <span>≈</span>

                  <div className="uart-timing-result">
                     <span className="section-label">
                        CLOCKS / BIT
                     </span>
                     <strong>868</strong>
                  </div>
               </div>

               <div className="concept-box guided-concept">
                  <span className="section-label">
                     WHY 868?
                  </span>

                  <p>
                     100,000,000 ÷ 115,200 is approximately
                     868.06. This implementation uses
                     CLKS_PER_BIT = 868, so baud_counter
                     controls how long each serial bit
                     remains on TX.
                  </p>
               </div>

               <CodeChallenge
                  title="Change the baud rate"
                  instructions="Assume the FPGA clock remains 100 MHz. Modify CLKS_PER_BIT for a 9600 baud UART. Use the nearest whole number of FPGA clock cycles."
                  starterCode={`// 100 MHz FPGA clock
// Current UART rate: 115200 baud

localparam CLKS_PER_BIT = 868;

// Change CLKS_PER_BIT for 9600 baud.`}
                  solutionChecks={[
                     "CLKS_PER_BIT = 10417",
                  ]}
                  successMessage="Correct. 100,000,000 / 9,600 ≈ 10,416.67, which rounds to approximately 10,417 FPGA clock cycles per UART bit."
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
                        UART TX synthesized and
                        timing-analyzed for an Intel
                        Cyclone V 5CGXFC7C6U19C7 FPGA.
                     </p>
                  </div>

                  <div className="metrics">
                     <Metric
                        value="24"
                        label="ALMs"
                     />

                     <Metric
                        value="27"
                        label="Registers"
                     />

                     <Metric
                        value="13"
                        label="I/O Pins"
                     />

                     <Metric
                        value="115200"
                        label="Baud Rate"
                     />

                     <Metric
                        value="100 MHz"
                        label="Clock Constraint"
                     />

                     <Metric
                        value="+5.933 ns"
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
                     100 MHz timing requirement met ✓
                  </h3>

                  <p>
                     The UART transmitter was constrained
                     with a 10 ns clock period. TimeQuest
                     reported +5.933 ns setup slack,
                     indicating that the analyzed setup
                     timing requirement is satisfied.
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
                     understanding of UART framing, LSB-first
                     transmission, stored data, and
                     baud-rate timing.
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
                           "fpga-module-uart",
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

                        <h3>UART complete</h3>

                        <p>
                           You can now explain how registers,
                           counters, an FSM, and baud timing
                           work together to serialize an
                           8-bit byte.
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
   ORIGINAL UART SIMULATOR
   ========================================================= */

function UARTSimulator({
   input,
   setInput,
   byte,
   binary,
   frame,
   activeBit,
   busy,
   buildFrame,
   transmit,
}: {
   input: string;
   setInput: (value: string) => void;
   byte: number;
   binary: string;
   frame: UARTBit[];
   activeBit: number;
   busy: boolean;
   buildFrame: () => UARTBit[];
   transmit: () => void;
}) {
   return (
      <section className="simulator uart-simulator guided-uart-simulator">
         <div className="uart-input-area">
            <div>
               <span className="section-label">
                  TRANSMIT CHARACTER
               </span>

               <input
                  className="uart-character-input"
                  value={input}
                  maxLength={1}
                  onChange={(event) =>
                     setInput(event.target.value)
                  }
               />
            </div>

            <div className="uart-byte-info">
               <span>BYTE (HEX)</span>

               <strong>
                  0x
                  {byte
                     .toString(16)
                     .toUpperCase()
                     .padStart(2, "0")}
               </strong>
            </div>

            <div className="uart-byte-info">
               <span>BINARY</span>
               <strong>{binary}</strong>
            </div>

            <button
               className="uart-transmit"
               onClick={transmit}
               disabled={busy}
            >
               {busy
                  ? "TRANSMITTING..."
                  : "TRANSMIT"}
            </button>
         </div>

         <div className="uart-status-row">
            <div>
               <span>TX LINE</span>

               <strong>
                  {activeBit >= 0
                     ? frame[activeBit]?.value
                     : 1}
               </strong>
            </div>

            <div>
               <span>BUSY</span>
               <strong>
                  {busy ? "1" : "0"}
               </strong>
            </div>

            <div>
               <span>BAUD RATE</span>
               <strong>115200</strong>
            </div>

            <div>
               <span>CLOCK</span>
               <strong>100 MHz</strong>
            </div>
         </div>

         <div className="uart-frame-section">
            <p className="section-label">
               UART FRAME
            </p>

            <div className="uart-frame">
               {(frame.length > 0
                  ? frame
                  : buildFrame()
               ).map((bit, index) => (
                  <div
                     key={`${bit.label}-${index}`}
                     className={`uart-bit ${
                        index === activeBit
                           ? "uart-bit-active"
                           : ""
                     }`}
                  >
                     <span>{bit.label}</span>
                     <strong>{bit.value}</strong>
                  </div>
               ))}
            </div>

            <div className="uart-direction">
               TRANSMISSION ORDER →
            </div>
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

function UARTLearnBit({
   label,
   value,
   detail,
}: {
   label: string;
   value: string;
   detail: string;
}) {
   return (
      <div className="uart-learn-bit">
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

function getUARTExplanation(
   frame: UARTBit[],
   activeBit: number,
   busy: boolean
) {
   if (!busy || activeBit < 0) {
      return "The transmitter is idle. TX rests at logic 1 while no frame is being transmitted.";
   }

   const bit = frame[activeBit];

   if (!bit)
      return "Waiting for the next UART bit.";

   if (bit.label === "IDLE") {
      return "The serial line begins in its idle-high condition before the frame starts.";
   }

   if (bit.label === "START") {
      return "The start bit drives TX low, marking the beginning of the UART frame.";
   }

   if (bit.label === "STOP") {
      return "The stop bit drives TX high, completing the UART frame.";
   }

   return `${bit.label} is currently being transmitted with TX = ${bit.value}. UART sends the byte least-significant bit first.`;
}

export default UARTLesson;