import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RoadmapNode } from "./RoadmapNode";
import { Avatar } from "./Avatar";
import { useRoadmap } from "../hooks/useRoadmap";

export const AnimatedRoadmap = () => {
  const { nodes, currentNodeId } = useRoadmap();
  const [avatarPos, setAvatarPos] = useState(0);

  useEffect(() => {
    const idx = nodes.findIndex(n => n.id === currentNodeId);
    setAvatarPos(idx);
  }, [currentNodeId, nodes]);

  return (
    <div className="relative w-full h-[80vh] overflow-y-auto scroll-smooth" style={{ background: "url(/road.png) no-repeat center center", backgroundSize: "cover" }}>
      {nodes.map((node, i) => (
        <RoadmapNode key={node.id} node={node} isCurrent={i === avatarPos} />
      ))}
      <Avatar position={avatarPos} />
    </div>
  );
};
