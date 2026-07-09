import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const steps = [
  "Ingesting latest squad data...",
  "Running 10,000 Monte Carlo iterations...",
  "Calculating match probabilities...",
  "Generating AI commentary..."
];

const ProcessingState: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= steps.length) return;

    // Simulate each step taking a random amount of time between 300ms and 600ms
    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, 400 + Math.random() * 200);

    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="bg-white/5 border border-white/10 text-primary-cyan rounded-2xl rounded-bl-none p-4 max-w-[85%]">
      <div className="flex items-center gap-2 mb-3">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="font-semibold">Processing</span>
      </div>
      <div className="space-y-2 text-sm text-gray-300 font-mono">
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
