import logoImg from "@/assets/mmr-logo.png";

interface Props { size?: number; showWord?: boolean; className?: string; }

// Make Me Revise logo — uses the brand mark (MMR with rising arrow + checkmark).
// Component name kept as ApexLogo to avoid touching every import site.
export const ApexLogo = ({ size = 32, showWord = true, className = "" }: Props) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    <div
      className="rounded-md overflow-hidden bg-white flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <img
        src={logoImg}
        alt="Make Me Revise logo"
        className="w-full h-full object-cover"
        style={{ objectPosition: "center 18%", transform: "scale(2.3)" }}
      />
    </div>
    {showWord && (
      <span className="font-extrabold tracking-tight text-base leading-none">
        Make Me Revise
      </span>
    )}
  </div>
);
