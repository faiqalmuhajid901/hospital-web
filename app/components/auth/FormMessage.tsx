type FormMessageProps = {
  type?: "error" | "success" | "info";
  message?: string | null;
};

const toneClass = {
  error: "border-red-200 bg-red-50 text-red-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

export function FormMessage({ type = "info", message }: FormMessageProps) {
  if (!message) return null;

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${toneClass[type]}`}>
      {message}
    </div>
  );
}
