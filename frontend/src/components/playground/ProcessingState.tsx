import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';

const steps = [
  "Ingesting latest squad data...",
  "Running 10,000 Monte Carlo iterations...",
  "Calculating match probabilities...",
  "Generating AI commentary..."
];

interface ProcessingStateProps {
  isCompleted?: boolean;
}

const ProcessingState: React.FC<ProcessingStateProps> = ({ isCompleted = false }) => {
  const [currentStep, setCurrentStep] = useState(isCompleted ? steps.length : 0);
  const [isExpanded, setIsExpanded] = useState(!isCompleted);

  useEffect(() => {
    if (isCompleted) {
      setCurrentStep(steps.length);
      setIsExpanded(false);
      return;
    }
    
    if (currentStep >= steps.length) return;

    // Simulate each step taking a random amount of time between 300ms and 600ms
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 400 + Math.random() * 200);

    return () => clearTimeout(timer);
  }, [currentStep, isCompleted]);

  if (isCompleted && !isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 rounded-full px-3 py-1.5 text-xs transition-colors mb-2"
      >
        <CheckCircle2 size={14} className="text-primary-cyan" />
        <span>View thought process</span>
        <ChevronRight size={14} />
      </button>
    );
  }

  return (
    <div className={`bg-white/5 border border-white/10 text-primary-cyan rounded-2xl px-3 py-2 max-w-[92%] ${isCompleted ? 'mb-2' : 'rounded-bl-none'}`}>
      <div 
        className={`flex items-center justify-between gap-2 mb-2 ${isCompleted ? 'cursor-pointer' : ''}`}
        onClick={() => isCompleted && setIsExpanded(false)}
      >
        <div className="flex items-center gap-2">
          {isCompleted ? <CheckCircle2 className="w-4 h-4 text-primary-cyan" /> : <Loader2 className="w-4 h-4 animate-spin" />}
          <span className="font-semibold text-[10px] md:text-xs">{isCompleted ? 'Processing Complete' : 'Processing'}</span>
        </div>
        {isCompleted && <ChevronDown size={14} className="text-gray-400" />}
      </div>
      <div className="space-y-1 text-[10px] md:text-xs text-gray-300 font-mono">
        <AnimatePresence>
          {steps.slice(0, currentStep + 1).map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-2"
            >
              <span className="text-gray-500 mt-0.5">•</span>
              <span>{step}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProcessingState;
