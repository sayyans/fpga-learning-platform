import { useState } from "react";
import "./App.css";

import Sidebar, {
   type Module,
} from "./components/Sidebar";

import LogicLesson from "./modules/LogicLesson";
import RegisterLesson from "./modules/RegisterLesson";
import CounterLesson from "./modules/CounterLesson";
import FSMLesson from "./modules/FSMLesson";
import UARTLesson from "./modules/UARTLesson";
import MemoryLesson from "./modules/MemoryLesson";
import SynthesisLesson from "./modules/SynthesisLesson";
import TimingLesson from "./modules/TimingLesson";

const moduleInfo: Record<
   Module,
   {
      number: string;
      category: string;
   }
> = {
   logic: {
      number: "01",
      category: "COMBINATIONAL LOGIC",
   },

   registers: {
      number: "02",
      category: "SEQUENTIAL LOGIC",
   },

   counters: {
      number: "03",
      category: "SEQUENTIAL LOGIC",
   },

   fsm: {
      number: "04",
      category: "CONTROL SYSTEMS",
   },

   uart: {
      number: "05",
      category: "DIGITAL COMMUNICATION",
   },

   memory: {
      number: "06",
      category: "DATAPATH DESIGN",
   },

   synthesis: {
      number: "07",
      category: "FPGA WORKFLOW",
   },

   timing: {
      number: "08",
      category: "FPGA WORKFLOW",
   },
};

function App() {
   const [activeModule, setActiveModule] =
      useState<Module>("logic");

   const current =
      moduleInfo[activeModule];

   return (
      <div className="platform">
         <Sidebar
            activeModule={activeModule}
            setActiveModule={setActiveModule}
         />

         <main className="app">
            <div className="app-module-context">
               <div className="app-module-context-left">
                  <span>
                     MODULE {current.number}
                  </span>

                  <i />

                  <span>
                     {current.category}
                  </span>
               </div>

               <div className="app-module-context-right">
                  <span>FPGA LAB</span>

                  <div className="app-status-dot" />

                  <strong>
                     INTERACTIVE LEARNING
                  </strong>
               </div>
            </div>

            <div
               className="module-content"
               key={activeModule}
            >
               {activeModule === "logic" && (
                  <LogicLesson />
               )}

               {activeModule === "registers" && (
                  <RegisterLesson />
               )}

               {activeModule === "counters" && (
                  <CounterLesson />
               )}

               {activeModule === "fsm" && (
                  <FSMLesson />
               )}

               {activeModule === "uart" && (
                  <UARTLesson />
               )}

               {activeModule === "memory" && (
                  <MemoryLesson />
               )}

               {activeModule === "synthesis" && (
                  <SynthesisLesson />
               )}

               {activeModule === "timing" && (
                  <TimingLesson />
               )}
            </div>
         </main>
      </div>
   );
}

export default App;