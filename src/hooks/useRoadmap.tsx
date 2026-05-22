import { useState, useEffect } from "react";
import type { RoadmapNodeRow } from "../lib/roadmapNodes";

/**
 * A very small stub of the real `useRoadmap` hook used in the project.
 * The original hook is missing from the repository, which caused TypeScript
 * errors in `AnimatedRoadmap.tsx`.  For the purposes of this exercise we
 * provide a minimal implementation that mimics the public API expected by the
 * component.
 *
 * The hook returns an array of nodes and the id of the currently selected
 * node.  In a real application this would likely come from a context or a
 * server‑side fetch.  Here we simply expose a static list so that the
 * component can render without runtime errors.
 */
export const useRoadmap = () => {
  const [nodes, setNodes] = useState<RoadmapNodeRow[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

  // Populate with dummy data on mount – this mirrors the shape used by
  // `RoadmapNode`.
  useEffect(() => {
    const dummy: RoadmapNodeRow[] = [
      {
        id: "1",
        user_id: "user-1",
        subject: "math",
        unit_code: "M1",
        unit_number: 1,
        unit_name: "Algebra",
        topic_name: "Intro",
        node_type: "learn",
        node_order: 1,
        scheduled_date: new Date().toISOString().split("T")[0],
        status: "unlocked",
        unlocks_after_node_id: null,
        science_method: null,
        why_now_text: null,
        completed_at: null,
        score_percent: null,
        source_node_id: null,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        user_id: "user-1",
        subject: "math",
        unit_code: "M1",
        unit_number: 1,
        unit_name: "Algebra",
        topic_name: "Basics",
        node_type: "learn",
        node_order: 2,
        scheduled_date: new Date().toISOString().split("T")[0],
        status: "locked",
        unlocks_after_node_id: null,
        science_method: null,
        why_now_text: null,
        completed_at: null,
        score_percent: null,
        source_node_id: null,
        created_at: new Date().toISOString(),
      },
    ];
    setNodes(dummy);
    setCurrentNodeId(dummy[0].id);
  }, []);

  return { nodes, currentNodeId };
};
