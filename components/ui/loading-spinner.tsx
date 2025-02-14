interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ text = "Loading...", size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary dark:border-blue-500 rounded-full animate-spin duration-1000 border-t-transparent"></div>
      </div>
      {text && (
        <p className="text-gray-500 dark:text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}
