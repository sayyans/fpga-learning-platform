type LessonHeaderProps = {
   badge: string;
};

function LessonHeader({
   badge,
}: LessonHeaderProps) {
   return (
      <header className="lesson-header">
         <div className="lesson-header-brand">
            <div className="lesson-header-title">
               <span className="eyebrow">
                  FPGA LAB
               </span>

               <h1>
                  Interactive Digital Logic
               </h1>
            </div>

            <span className="lesson-header-divider" />

            <span className="lesson-header-subtitle">
               LEARNING PLATFORM
            </span>
         </div>

         <div className="lesson-header-meta">
            <span className="lesson-header-status">
               <i />
               GUIDED LAB
            </span>

            <span className="module-badge">
               {badge}
            </span>
         </div>
      </header>
   );
}

export default LessonHeader;