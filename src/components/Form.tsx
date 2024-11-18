"use client";

export function Form({
  children,
  action,
  state,
  className,
}: {
  children: React.ReactNode;
  action: (formData: FormData) => void; // Updated type to only accept void
  state: ActionResult;
  className?: string;
}) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    action(formData); // Call action directly
  };
  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      <p className="my-3 text-red-400">{state.error}</p>
      {/* Removed state handling since action is now void */}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
  success: boolean;
}
