'use client';

// src/components/TopLoader.tsx (or your preferred location)
import * as React from "react";
import { Progress } from "@/components/ui/progress"; // Adjust import path if needed

interface TopLoaderProps {
  isLoading: boolean;
}

const TopLoader: React.FC<TopLoaderProps> = ({ isLoading }) => {
  const [progress, setProgress] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let visibilityTimer: NodeJS.Timeout | null = null;

    if (isLoading) {
      setIsVisible(true); // Make loader visible immediately
      setProgress(10); // Start with a small initial progress

      // Simulate progress increase
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            // Don't let simulated progress reach 100%
            // It should only reach 100% when isLoading becomes false
            return prev;
          }
          // Simulate slower progress towards the end
          const diff = Math.random() * 10;
          return Math.min(prev + diff, 90);
        });
      }, 400); // Adjust interval for desired speed
    } else {
      // If loading finished
      if (timer) {
        clearInterval(timer); // Clear the simulation interval
      }

      // If it was previously visible (meaning loading just finished)
      if (isVisible) {
        setProgress(100); // Jump to 100%

        // Hide the loader after a short delay so user sees it complete
        visibilityTimer = setTimeout(() => {
          setIsVisible(false);
          // Optional: Reset progress for next time after it's hidden
          setTimeout(() => setProgress(0), 300); // Delay reset after fade out
        }, 500); // Keep it visible at 100% for 500ms
      }
    }

    // Cleanup function
    return () => {
      if (timer) clearInterval(timer);
      if (visibilityTimer) clearTimeout(visibilityTimer);
    };
  }, [isLoading, isVisible]); // Rerun effect when isLoading changes

  if (!isVisible) {
    return null; // Don't render anything if not visible
  }

  return (
    <div
      style={{
        position: 'fixed', // Or 'sticky' if within a specific scroll container
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 50, // Ensure it's above most other content
        height: '4px', // Or adjust height as needed
        transition: 'opacity 0.3s ease-in-out', // For smooth fade out
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Progress
        value={progress}
        className="w-full h-full rounded-none" // Make it span full width and height, remove rounding
        // Optional: Add custom styling via className if needed
        // e.g., className="w-full h-1 [&>div]:bg-blue-500"
      />
    </div>
  );
};

export default TopLoader;
