import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  isStreaming?: boolean;
  onComplete?: () => void;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, isStreaming = false, onComplete, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
      return;
    }

    setDisplayedText('');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, isStreaming, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {isStreaming && displayedText.length < text.length && (
        <span className="inline-block w-2 h-4 ml-1 bg-primary-cyan animate-pulse"></span>
      )}
    </span>
  );
};

export default TypewriterText;
