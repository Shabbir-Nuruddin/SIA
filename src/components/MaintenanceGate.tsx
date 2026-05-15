import { ReactNode } from "react";

/**
 * Maintenance mode is OFF. This component is now a passthrough so any
 * authenticated user can access the app. Kept as an export to avoid
 * breaking imports.
 */
export const MaintenanceGate = ({ children }: { children: ReactNode }) => <>{children}</>;
export default MaintenanceGate;
