import { ReactNode } from "react";

// SIA is a school tool — all features are unlocked for all users.
export const RequirePro = ({ children }: { children: ReactNode; featureName?: string }) => {
  return <>{children}</>;
};
