interface QuickActionChipsProps {
  onChipHover: (chip: string) => void;
  onChipLeave: () => void;
  onChipClick: (chip: string) => void;
}

const chips = [
  "Simulate Group A",
  "Predict Winner",
  "Best 3rd Place Scenarios"
];

const QuickActionChips: React.FC<QuickActionChipsProps> = ({ onChipHover, onChipLeave, onChipClick }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 relative z-10 mt-6">
      <div className="flex flex-nowrap items-center justify-start md:justify-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {chips.map((chip, index) => (
          <button 
            key={index}
            onMouseEnter={() => onChipHover(chip)}
            onMouseLeave={onChipLeave}
            onClick={() => onChipClick(chip)}
            className="shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full bg-bg-1 border border-white/5 hover:border-primary-cyan/50 hover:bg-primary-cyan/10 text-gray-300 text-sm transition-all shadow-sm"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionChips;
