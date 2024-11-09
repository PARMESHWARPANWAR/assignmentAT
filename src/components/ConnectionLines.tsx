import { useEffect, useState } from "react";
import { Connection, Position } from "../types";
import { getElementCenter } from "../utils/helpers";

export const ConnectionLines: React.FC<{
    connections: Connection[];
}> = ({ connections }) => {
    const [paths, setPaths] = useState<{ from: Position; to: Position }[]>([]);

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

        // Initial update
        updatePaths();

        // Update on window resize
        window.addEventListener('resize', updatePaths);
        return () => window.removeEventListener('resize', updatePaths);
    }, [connections]);

    return (
        <svg
            className="absolute inset-0 pointer-events-none z-50"
            style={{ width: '100%', height: '100%' }}
        >
            {paths.map((path, index) => {
                const distance = Math.hypot(path.to.x - path.from.x, path.to.y - path.from.y);
                const curvePath =
                  distance < 150
                    ? `M ${path.from.x} ${path.from.y} L ${path.to.x} ${path.to.y}`
                    : `M ${path.from.x} ${path.from.y} Q ${(path.from.x + path.to.x) / 2} ${(path.from.y + path.to.y) / 2 + 50} ${path.to.x} ${path.to.y}`;
                
                return <g key={index}>
                    <path
                        d={curvePath}
                        stroke="#0066FF4D"
                        strokeWidth="10"
                        fill="none"
                        strokeLinecap="round"
                    />
                </g>
           })}
        </svg>
    );
};