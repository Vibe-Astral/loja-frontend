import { ClipLoader } from "react-spinners";

type LoadingButtonProps = {
  loading: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function LoadingButton({
  loading,
  children,
  variant = "primary",
  className = "",
  ...props
}: LoadingButtonProps) {
  const base =
    "px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 transition";

  const variants: Record<typeof variant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant]} ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
    >
      {loading && <ClipLoader size={16} color="#fff" />}
      {children}
    </button>
  );
}
