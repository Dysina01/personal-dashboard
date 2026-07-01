interface Props {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      <p className="text-headline font-medium text-text-primary">{title}</p>
      {description && (
        <p className="text-callout text-text-muted max-w-xs">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 h-12 px-6 rounded-btn bg-accent text-white text-body font-medium active:scale-[0.97] transition-transform duration-instant"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
