import { useEffect, useState } from "react";
import { Connection, Position } from "../types";
import { getElementCenter } from "../utils/helpers";

export const ConnectionLines: React.FC<{
    connections: Connection[];
}> = ({ connections }) => {
    const [paths, setPaths] = useState<{ from: Position; to: Position }[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [flag,setFlag] = useState<boolean>(false)

    const handleMouseOver = (index:number) => {
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

                    return {
                        from: fromPos,
                        to: toPos
                    };
                }
                return null;
            }).filter(Boolean) as { from: Position; to: Position }[];

            setPaths(newPaths);
        };

        updatePaths();

        // Update paths on window resize
        window.addEventListener('resize', updatePaths);
        
        // Also update paths periodically for a short time after mount
        // to handle any delayed rendering
        const interval = setInterval(updatePaths, 100);
        setTimeout(() => clearInterval(interval), 1000);

        return () => {
            window.removeEventListener('resize', updatePaths);
            clearInterval(interval);
        };
    }, [connections]);

    const generatePath = (from: Position, to: Position) => {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const distance = Math.hypot(dx, dy);
        
        const offset = Math.min(100, distance * 0.4);
        return `M ${from.x} ${from.y} 
                C ${from.x + offset} ${from.y},
                  ${to.x - offset} ${to.y},
                  ${to.x} ${to.y}`;
    };

    return (
        <svg 
        className="absolute inset-0 pointer-events-none z-50 w-full h-full" 
        // style={{ minHeight: '3000px' }}
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