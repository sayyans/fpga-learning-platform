import { useEffect, useState } from "react";

export type Module =
   | "logic"
   | "registers"
   | "counters"
   | "fsm"
   | "uart"
   | "memory"
   | "synthesis"
   | "timing";

type SidebarProps = {
   activeModule: Module;
   setActiveModule: (module: Module) => void;
};

const modules: {
   id: Module;
   number: string;
   name: string;
   shortName: string;
   group: string;
}[] = [
   {
      id: "logic",
      number: "01",
      name: "Logic & Multiplexers",
      shortName: "Logic",
      group: "FOUNDATIONS",
   },
   {
      id: "registers",
      number: "02",
      name: "Registers",
      shortName: "Registers",
      group: "FOUNDATIONS",
   },
   {
      id: "counters",
      number: "03",
      name: "Counters",
      shortName: "Counters",
      group: "FOUNDATIONS",
   },
   {
      id: "fsm",
      number: "04",
      name: "Finite State Machines",
      shortName: "FSM",
      group: "FOUNDATIONS",
   },
   {
      id: "uart",
      number: "05",
      name: "UART",
      shortName: "UART",
      group: "INTERFACES",
   },
   {
      id: "memory",
      number: "06",
      name: "Memory & Datapaths",
      shortName: "Memory",
      group: "INTERFACES",
   },
   {
      id: "synthesis",
      number: "07",
      name: "Synthesis & RTL",
      shortName: "Synthesis",
      group: "FPGA WORKFLOW",
   },
   {
      id: "timing",
      number: "08",
      name: "Timing Analysis",
      shortName: "Timing",
      group: "FPGA WORKFLOW",
   },
];

const groups = [
   "FOUNDATIONS",
   "INTERFACES",
   "FPGA WORKFLOW",
];

function Sidebar({
   activeModule,
   setActiveModule,
}: SidebarProps) {
   const [completedModules, setCompletedModules] =
      useState<Module[]>([]);

   const loadProgress = () => {
      const completed = modules
         .filter(
            (module) =>
               localStorage.getItem(
                  `fpga-module-${module.id}`
               ) === "complete"
         )
         .map((module) => module.id);

      setCompletedModules(completed);
   };

   useEffect(() => {
      loadProgress();

      window.addEventListener(
         "fpga-progress-updated",
         loadProgress
      );

      return () => {
         window.removeEventListener(
            "fpga-progress-updated",
            loadProgress
         );
      };
   }, []);

   const progress =
      (completedModules.length /
         modules.length) *
      100;

   const activeIndex =
      modules.findIndex(
         (module) =>
            module.id === activeModule
      );

   const renderModule = (
      module: (typeof modules)[number]
   ) => {
      const active =
         activeModule === module.id;

      const complete =
         completedModules.includes(
            module.id
         );

      return (
         <button
            key={module.id}
            className={`nav-item ${
               active ? "active-nav" : ""
            } ${
               complete
                  ? "completed-nav"
                  : ""
            }`}
            onClick={() =>
               setActiveModule(module.id)
            }
            aria-current={
               active ? "page" : undefined
            }
         >
            <div className="nav-module-number">
               {complete ? (
                  <span className="nav-number-check">
                     ✓
                  </span>
               ) : (
                  <span>
                     {module.number}
                  </span>
               )}
            </div>

            <div className="nav-module-copy">
               <strong>
                  {module.name}
               </strong>

               <span>
                  MODULE {module.number}
               </span>
            </div>

            <div className="nav-module-state">
               {active && (
                  <span className="nav-active-dot" />
               )}
            </div>
         </button>
      );
   };

   return (
      <aside className="sidebar">
         <div className="sidebar-top">
            <div className="brand">
                <div className="brand-icon">
                <svg
                    className="brand-circuit-icon"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    {/* central FPGA / logic chip */}
                    <rect
                        x="10"
                        y="10"
                        width="12"
                        height="12"
                        rx="2"
                    />

                    {/* left traces */}
                    <path d="M3 8H7V13H10" />
                    <path d="M3 16H10" />
                    <path d="M3 24H7V19H10" />

                    {/* right traces */}
                    <path d="M22 13H25V8H29" />
                    <path d="M22 16H29" />
                    <path d="M22 19H25V24H29" />

                    {/* connection nodes */}
                    <circle cx="3" cy="8" r="1.3" />
                    <circle cx="3" cy="16" r="1.3" />
                    <circle cx="3" cy="24" r="1.3" />

                    <circle cx="29" cy="8" r="1.3" />
                    <circle cx="29" cy="16" r="1.3" />
                    <circle cx="29" cy="24" r="1.3" />

                    {/* chip core */}
                    <circle
                        cx="16"
                        cy="16"
                        r="2"
                        className="brand-circuit-core"
                    />
                </svg>
                </div>

               <div className="brand-copy">
                  <strong>
                     FPGA LAB
                  </strong>

                  <span>
                     DIGITAL SYSTEMS
                  </span>
               </div>
            </div>

            <div className="sidebar-course-meta">
               <span>
                  INTERACTIVE COURSE
               </span>

               <strong>
                  8 MODULES
               </strong>
            </div>
         </div>

         <nav className="sidebar-nav">
            {groups.map((group) => (
               <div
                  className="nav-group"
                  key={group}
               >
                  <div className="nav-heading">
                     <span>{group}</span>

                     <i />
                  </div>

                  <div className="nav-group-modules">
                     {modules
                        .filter(
                           (module) =>
                              module.group ===
                              group
                        )
                        .map(renderModule)}
                  </div>
               </div>
            ))}
         </nav>

         <div className="sidebar-footer">
            <div className="sidebar-progress-heading">
               <div>
                  <span>
                     LEARNING PATH
                  </span>

                  <strong>
                     {completedModules.length ===
                     modules.length
                        ? "COMPLETE"
                        : "IN PROGRESS"}
                  </strong>
               </div>

               <b>
                  {completedModules.length}/
                  {modules.length}
               </b>
            </div>

            <div className="progress">
               <div
                  style={{
                     width: `${progress}%`,
                  }}
               />
            </div>

            <div className="sidebar-progress-meta">
               <span>
                  {Math.round(progress)}%
               </span>

               <span>
                  MODULE{" "}
                  {String(
                     activeIndex + 1
                  ).padStart(2, "0")}{" "}
                  / 08
               </span>
            </div>
         </div>
      </aside>
   );
}

export default Sidebar;