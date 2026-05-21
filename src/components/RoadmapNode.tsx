import { motion } from "framer-motion";
import type { RoadmapNodeRow } from "../lib/roadmapNodes";

interface Props {
  node: RoadmapNodeRow;
  isCurrent: boolean;
}

export const RoadmapNode: React.FC<Props> = ({ node, isCurrent }) => {
  const statusClass = {
    locked: "bg-gray-200 text-gray-500",
    unlocked: "bg-blue-100 text-blue-800",
    in_progress: "bg-blue-200 text-blue-900",
    complete: "bg-green-200 text-green-800",
    skipped: "bg-yellow-200 text-yellow-800",
  }[node.status];

  return (
    <motion.div
      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto my-4 ${statusClass}`}
      animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 1, repeat: Infinity }}
    >
      <span className="text-sm font-medium">{node.topic_name?.slice(0, 2)}</span>
    </motion.div>
  );
};
