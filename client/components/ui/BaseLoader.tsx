import { Loader2 } from "lucide-react";

interface BaseLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function BaseLoader({ message, fullScreen = false }: BaseLoaderProps) {
  const containerClass = fullScreen
    ? "flex h-screen items-center justify-center bg-slate-50"
    : "flex items-center justify-center min-h-[400px]";

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        {message && (
          <p className="text-sm font-secondary text-slate-500">{message}</p>
        )}
      </div>
    </div>
  );
}
