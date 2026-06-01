import { useEffect, useState } from "react";

// Reads the player's prestige level (degrees earned by Graduating in the Break
// Arcade) from the saved game and shows it as a 🎓 badge on their avatar.
function readDegrees(): number {
  try { const r = JSON.parse(localStorage.getItem("mmr_tycoon_v3") || "{}"); return Math.floor(r.degrees || 0); } catch { return 0; }
}

export function PrestigeBadge({ className = "" }: { className?: string }) {
  const [deg, setDeg] = useState(readDegrees());
  useEffect(() => {
    const tick = () => setDeg(readDegrees());
    const id = setInterval(tick, 3000);
    window.addEventListener("mmr-degrees-change", tick);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(id);
      window.removeEventListener("mmr-degrees-change", tick);
      window.removeEventListener("focus", tick);
    };
  }, []);
  if (deg <= 0) return null;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 text-[9px] font-extrabold px-1 leading-none shadow ring-1 ring-amber-200/60 ${className}`}
      title={`${deg} degree${deg > 1 ? "s" : ""} earned by graduating in the Break Arcade — +${deg * 10}% bonus`}
    >
      🎓{deg}
    </span>
  );
}
