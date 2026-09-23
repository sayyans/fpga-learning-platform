type MetricProps = {
   value: string;
   label: string;
};

function Metric({ value, label }: MetricProps) {
   return (
      <div className="metric">
         <strong>{value}</strong>
         <span>{label}</span>
      </div>
   );
}

export default Metric;