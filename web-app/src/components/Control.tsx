type ControlProps = {
   title: string;
   value: string;
   active: boolean;
   onClick: () => void;
};

function Control({
   title,
   value,
   active,
   onClick,
}: ControlProps) {
   return (
      <div className="control">
         <span>{title}</span>

         <button
            className={active ? "active" : ""}
            onClick={onClick}
         >
            {value}
         </button>
      </div>
   );
}

export default Control;