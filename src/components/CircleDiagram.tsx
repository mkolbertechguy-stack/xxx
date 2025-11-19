import React from 'react';
import {
  calculateLargeCircleRadius,
  calculateSmallCircleRadius,
  calculateCirclePositions,
  calculateTextPosition,
  TextPosition
} from '../utils/geometry';

export interface CircleDiagramItem {
  id: string;
  label: string;
}

export interface CircleDiagramProps {
  items: CircleDiagramItem[];
  width?: number;
  height?: number;
  className?: string;
}

const CircleDiagram: React.FC<CircleDiagramProps> = ({
  items,
  width = 1920,
  height = 1080,
  className = ''
}) => {
  // Validate item count
  if (items.length < 2 || items.length > 9) {
    return (
      <div className={`circle-diagram-error ${className}`}>
        <p>Error: Circle diagram supports 2-9 items. Current count: {items.length}</p>
      </div>
    );
  }

  // Calculate dimensions and positions
  const centerX = width / 2;
  const centerY = height / 2;
  const largeRadius = calculateLargeCircleRadius(width, height);
  const smallRadius = calculateSmallCircleRadius(largeRadius);
  
  // Calculate positions for small circles
  const circlePositions = calculateCirclePositions(
    centerX,
    centerY,
    largeRadius,
    items.length
  );

  // Calculate text positions for each circle
  const textPositions: TextPosition[] = circlePositions.map(circle =>
    calculateTextPosition(circle.center, smallRadius, circle.angle)
  );

  return (
    <div className={`circle-diagram ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ border: '1px solid #e0e0e0' }}
      >
        {/* Large circle outline */}
        <circle
          cx={centerX}
          cy={centerY}
          r={largeRadius}
          fill="none"
          stroke="#333"
          strokeWidth="2"
        />
        
        {/* Small circles and labels */}
        {circlePositions.map((circle, index) => {
          const textPos = textPositions[index];
          const item = items[index];
          
          return (
            <g key={item.id}>
              {/* Small circle */}
              <circle
                cx={circle.center.x}
                cy={circle.center.y}
                r={smallRadius}
                fill="#2196F3"
                stroke="#1976D2"
                strokeWidth="2"
              />
              
              {/* Circle number */}
              <text
                x={circle.center.x}
                y={circle.center.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize="16"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
              >
                {circle.number}
              </text>
              
              {/* Text label */}
              <text
                x={textPos.point.x}
                y={textPos.point.y}
                textAnchor={textPos.anchor}
                dominantBaseline="central"
                fill="#333"
                fontSize="14"
                fontFamily="Arial, sans-serif"
              >
                {item.label}
              </text>
            </g>
          );
        })}
        
        {/* Debug info (optional - can be removed) */}
        <text
          x="10"
          y="30"
          fill="#666"
          fontSize="12"
          fontFamily="Arial, sans-serif"
        >
          Items: {items.length} | Large radius: {Math.round(largeRadius)}px | Small radius: {Math.round(smallRadius)}px
        </text>
      </svg>
    </div>
  );
};

export default CircleDiagram;