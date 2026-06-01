import { useEffect, useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * App-styled confirmation dialog, used in place of the native window.confirm()
 * (which renders the ugly "An embedded page at … says" browser box). Promise-based
 * so call-sites stay simple:  if (await confirmDialog({ ... })) { ... }
 */
export interface ConfirmOpts {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

let openImpl: ((opts: ConfirmOpts) => void) | null = null;
let resolver: ((v: boolean) => void) | null = null;

export function confirmDialog(opts: ConfirmOpts): Promise<boolean> {
  return new Promise((resolve) => {
    // Fallback to native confirm only if the host hasn't mounted (shouldn't happen).
    if (!openImpl) { resolve(window.confirm(opts.description || opts.title || "Are you sure?")); return; }
    resolver = resolve;
    openImpl(opts);
  });
}

export function ConfirmHost() {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<ConfirmOpts>({});

  useEffect(() => {
    openImpl = (o) => { setOpts(o); setOpen(true); };
    return () => { openImpl = null; };
  }, []);

  const finish = (v: boolean) => {
    setOpen(false);
    const r = resolver; resolver = null;
    r?.(v);
  };

  return (
    <AlertDialog open={open} onOpenChange={(o) => { if (!o) finish(false); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{opts.title || "Are you sure?"}</AlertDialogTitle>
          {opts.description && <AlertDialogDescription className="whitespace-pre-line">{opts.description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => finish(false)}>{opts.cancelText || "Cancel"}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => finish(true)}
            className={opts.destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
          >
            {opts.confirmText || "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
