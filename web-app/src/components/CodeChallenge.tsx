import { useState } from "react";

type CodeChallengeProps = {
   title: string;
   instructions: string;
   starterCode: string;
   solutionChecks: string[];
   successMessage: string;
};

function CodeChallenge({
   title,
   instructions,
   starterCode,
   solutionChecks,
   successMessage,
}: CodeChallengeProps) {
   const [code, setCode] = useState(starterCode);
   const [result, setResult] = useState<
      "idle" | "success" | "error"
   >("idle");

   const checkCode = () => {
      const normalized = code
         .replace(/\s+/g, " ")
         .toLowerCase();

      const passed = solutionChecks.every((check) =>
         normalized.includes(check.toLowerCase())
      );

      setResult(passed ? "success" : "error");
   };

   const resetCode = () => {
      setCode(starterCode);
      setResult("idle");
   };

   return (
      <div className="code-challenge">
         <div className="code-challenge-header">
            <div>
               <p className="section-label">
                  RTL CODE CHALLENGE
               </p>

               <h3>{title}</h3>

               <p>{instructions}</p>
            </div>

            <span>VERILOG</span>
         </div>

         <textarea
            className="rtl-editor"
            value={code}
            spellCheck={false}
            onChange={(event) => {
               setCode(event.target.value);
               setResult("idle");
            }}
         />

         <div className="code-challenge-actions">
            <button
               className="editor-secondary-button"
               onClick={resetCode}
            >
               RESET CODE
            </button>

            <button
               className="quiz-primary-button"
               onClick={checkCode}
            >
               CHECK SOLUTION
            </button>
         </div>

         {result === "success" && (
            <div className="code-result code-result-success">
               <strong>✓ Challenge passed</strong>
               <p>{successMessage}</p>
            </div>
         )}

         {result === "error" && (
            <div className="code-result code-result-error">
               <strong>Not quite yet</strong>

               <p>
                  The expected RTL structure wasn't found.
                  Review the task and try modifying the code
                  again.
               </p>
            </div>
         )}

         <p className="editor-note">
            FPGA Lab checks the expected learning concepts in
            this challenge. This browser editor does not compile
            or synthesize the Verilog.
         </p>
      </div>
   );
}

export default CodeChallenge;