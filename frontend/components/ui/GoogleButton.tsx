import { FcGoogle } from "react-icons/fc";

type GoogleButtonProps = {
  onClick: () => void;
  label?: string;
}

export default function GoogleButton({ onClick, label = "Continue with Google" }: GoogleButtonProps) {
  return (
    <button type="button" className="google-btn" onClick={onClick}>
      <FcGoogle size={20} />
      <span>{label}</span>
    </button>
  );
}