import { Link } from "react-router-dom";
import { Clock, Mail } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/contexts/AuthContext";

const SIA_LOGO = "https://sia.ae/wp-content/uploads/2022/03/cropped-sia-sub-logo-2-270x270.png";
const SCHOOL_NAME = import.meta.env.VITE_SCHOOL_NAME ?? "Scholars International Academy";

const PendingApproval = () => {
  const { profile, signOut } = useAuth();
  const role = profile?.role ?? "teacher";

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-5"
      style={{ background: "#F7F7F5", fontFamily: "'Source Sans 3', 'Inter', sans-serif" }}
    >
      <SEO title="Account Pending — SIA Smart Revision" path="/auth/pending-approval" noindex />

      <div
        className="w-full max-w-md rounded-2xl p-10 text-center"
        style={{ background: "#fff", boxShadow: "0 2px 32px rgba(27,42,74,0.10)" }}
      >
        <img
          src={SIA_LOGO}
          alt="SIA"
          className="h-16 w-16 rounded-full object-contain mx-auto mb-6 bg-white shadow"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />

        <div
          className="inline-flex items-center justify-center h-14 w-14 rounded-full mx-auto mb-5"
          style={{ background: "#FEF3C7" }}
        >
          <Clock className="h-7 w-7" style={{ color: "#D97706" }} />
        </div>

        <h1
          className="text-2xl font-bold mb-3"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#1B2A4A" }}
        >
          Your account is awaiting approval
        </h1>

        <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
          Your request to join as a{" "}
          <span className="font-semibold capitalize" style={{ color: "#1B2A4A" }}>{role}</span> has been received.
          A member of {SCHOOL_NAME} administration will review and activate your account shortly.
        </p>

        <div
          className="flex items-center gap-3 p-4 rounded-xl text-sm mb-8"
          style={{ background: "#EEF2FF", color: "#1B2A4A" }}
        >
          <Mail className="h-4 w-4 shrink-0" />
          <span>
            If you have questions, contact{" "}
            <a href="mailto:admissions@sia.ae" className="font-semibold underline">
              admissions@sia.ae
            </a>
          </span>
        </div>

        <div className="flex gap-3">
          <Link
            to="/"
            className="flex-1 py-2.5 rounded-full text-sm font-semibold text-center transition-all border"
            style={{ borderColor: "#E5E7EB", color: "#374151" }}
          >
            Back to Home
          </Link>
          <button
            onClick={signOut}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={{ background: "#1B2A4A", color: "#fff" }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval;
