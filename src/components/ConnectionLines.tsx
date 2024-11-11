import { useEffect, useState } from "react";
import { Connection, Position } from "../types";
import { getElementCenter } from "../utils/helpers";

export const ConnectionLines: React.FC<{
  connections: Connection[];
}> = ({ connections }) => {
  const [paths, setPaths] = useState<{ from: Position; to: Position }[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [flag, setFlag] = useState<boolean>(false)

  const handleMouseOver = (index: number) => {
    setHoveredIndex(index);
    setFlag(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setFlag(false);
  };

  useEffect(() => {
    const updatePaths = () => {
      const newPaths = connections.map(conn => {
        const fromEl = document.getElementById(conn.from);
        const toEl = document.getElementById(conn.to);

        if (fromEl && toEl) {
          const fromPos = getElementCenter(fromEl);
          const toPos = getElementCenter(toEl);

          if (fromPos?.x != null && fromPos?.y != null &&
            toPos?.x != null && toPos?.y != null) {
            return {
              from: fromPos,
              to: toPos
            };
          }
        }
        return null;
      }).filter(Boolean) as { from: Position; to: Position }[];

      setPaths(newPaths);
    };

    updatePaths();

    window.addEventListener('resize', updatePaths);

    const interval = setInterval(updatePaths, 100);
    setTimeout(() => clearInterval(interval), 1000);

    return () => {
      window.removeEventListener('resize', updatePaths);
      clearInterval(interval);
    };
  }, [connections]);

  const generatePath = (from: Position, to: Position) => {
    const distance = Math.abs(to.x - from.x);
    const heightDiff = Math.abs(to.y - from.y);

    if (distance < 100 && heightDiff < 100) {
        return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
    }

    if (100 < distance && distance < 200) {
        const midY = Math.max(from.y, to.y) + 100;
        const midX = (from.x + to.x) / 2;

        return `M ${from.x} ${from.y} 
                Q ${midX} ${midY},
                  ${to.x} ${to.y}`;
    }

    if (distance<50 && heightDiff > 200) {
      const controlY = from.y - 200;
      const midX = (from.x + to.x)/1.9;
  
      return `M ${from.x} ${from.y} 
              C ${midX} ${controlY},
                ${midX} ${controlY},
                ${to.x} ${to.y}`;
    }

    const verticalOffset = Math.max(100, heightDiff / 2);
    
    return `M ${from.x} ${from.y} 
            C ${from.x} ${from.y + verticalOffset},
              ${to.x} ${to.y - verticalOffset},
              ${to.x} ${to.y}`;
  };

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-50 w-full h-full"
      preserveAspectRatio="none"
    >
      {paths.map((path, index) => (
        <g
          key={index}
          onMouseOver={() => handleMouseOver(index)}
          onMouseLeave={handleMouseLeave}
          className="pointer-events-auto"
          onClick={() => setFlag(false)}
        >
          <path
            d={generatePath(path.from, path.to)}
            stroke="#0066FF4D"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          {(flag && hoveredIndex === index) && (
            <path
              d={generatePath(path.from, path.to)}
              stroke="#0066FF"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </g>
      ))}
    </svg>
  );
};