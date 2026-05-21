import { motion } from "framer-motion";

interface Props {
  position: number;
}

export const Avatar: React.FC<Props> = ({ position }) => {
  return (
    <motion.div
      className="absolute left-1/2 transform -translate-x-1/2"
      style={{ top: `${position * 200 + 50}px` }}
      animate={{ y: position * 200 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <span role="img" aria-label="avatar" className="text-2xl">🚶‍♂️</span>
    </motion.div>
  );
};
