

const chips = [
  "Simulate Group A",
  "Predict Winner",
  "Best 3rd Place Scenarios",
  "Explain Tie-Breaking Rules"
];

const QuickActionChips: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8 max-w-3xl mx-auto px-4 relative z-10">
      {chips.map((chip, index) => (
        <button 
          key={index}
          className="px-5 py-2.5 rounded-full bg-bg-1 border border-white/5 hover:border-primary-cyan/50 hover:bg-primary-cyan/10 text-gray-300 text-sm transition-all shadow-sm"
        >
          {chip}
        </button>
      ))}
    </div>
  );
};

export default QuickActionChips;
