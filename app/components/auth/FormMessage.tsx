import styles from "./FormMessage.module.css";


type FormMessageType =
  | "error"
  | "success"
  | "info";


type FormMessageProps = {
  type?: FormMessageType;
  message?: string | null;
};


const toneClasses: Record<
  FormMessageType,
  string
> = {
  error: styles.error,
  success: styles.success,
  info: styles.info,
};


export function FormMessage({
  type = "info",
  message,
}: FormMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`${styles.message} ${toneClasses[type]}`}
    >
      {message}
    </div>
  );
}