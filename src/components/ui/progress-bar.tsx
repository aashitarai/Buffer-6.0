import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  label?: string;
}

export function ProgressBar({ value, max, className, label }: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);
  
  // Calculate the number of filled blocks (8px each)
  const totalBlocks = 20; // Total number of blocks in the progress bar
  const filledBlocks = Math.round((value / max) * totalBlocks);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="pixel-font">{label}</span>
          <span className="pixel-font">{percentage}%</span>
        </div>
      )}
      <div className="pixel-progress-bg">
        <div
          className="pixel-progress-fill"
          style={{ width: `${(filledBlocks / totalBlocks) * 100}%` }}
        />
      </div>
    </div>
  );
}