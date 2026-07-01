interface Props {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Something went wrong.",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <p className="text-callout text-text-muted">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-callout font-medium text-accent"
        >
          Try again
        </button>
      )}
    </div>
  );
}
