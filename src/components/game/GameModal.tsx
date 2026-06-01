import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";
import StudyTycoon from "./StudyTycoon";

export default function GameModal({
  open,
  onOpenChange,
  reason,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  reason?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            Break Arcade
            {reason && <span className="text-xs font-normal text-muted-foreground ml-1">· {reason}</span>}
          </DialogTitle>
        </DialogHeader>
        <StudyTycoon showLeaderboard />
      </DialogContent>
    </Dialog>
  );
}
