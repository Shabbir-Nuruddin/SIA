import { ReactNode } from "react";

/**
 * SIA is a school-provided tool — every feature is unlocked for all users.
 * This used to gate features behind a Pro subscription; it is now a pass-through.
 */
export const RequirePro = ({ children }: { children: ReactNode; featureName?: string }) => {
  return <>{children}</>;
};
