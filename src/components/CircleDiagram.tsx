import React from 'react';
import {
  calculateLargeCircleRadius,
  calculateSmallCircleRadius,
  calculateCirclePositions,
  calculateTextPosition,
  calculateFontSizes,
  calculateEnhancedTextPosition,
  TextPosition,
  CirclePosition
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
  // Validate item count with professional error display
  if (items.length < 2 || items.length > 9) {
    return (
      <div className={`circle-diagram ${className}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: height }}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <rect width={width} height={height} fill="#f8f9fa" stroke="#e9ecef" strokeWidth="2" rx="8" />
          <text
            x={width / 2}
            y={height / 2 - 20}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#6c757d"
            fontSize="24"
            fontWeight="500"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Invalid Configuration
          </text>
          <text
            x={width / 2}
            y={height / 2 + 20}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#868e96"
            fontSize="16"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            Circle diagram supports 2-9 items. Current count: {items.length}
          </text>
        </svg>
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

  // Calculate enhanced text positions with multi-line support and collision avoidance
  const enhancedTextData = items.map((item, index) => {
    const circle = circlePositions[index];
    return calculateEnhancedTextPosition(
      circle.center,
      smallRadius,
      circle.angle,
      item.label,
      items.length,
      width,
      height,
      circlePositions
    );
  });

  return (
    <div className={`circle-diagram ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ 
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Background gradient */}
        <defs>
          <radialGradient id="backgroundGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8f9fa" />
          </radialGradient>
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
          </filter>
        </defs>
        
        {/* Background */}
        <rect width={width} height={height} fill="url(#backgroundGradient)" rx="8" />
        
        {/* Large circle outline with enhanced styling */}
        <circle
          cx={centerX}
          cy={centerY}
          r={largeRadius}
          fill="none"
          stroke="#495057"
          strokeWidth="3"
          strokeDasharray="none"
          filter="url(#dropShadow)"
          opacity="0.8"
        />
        
        {/* Small circles and labels */}
        {circlePositions.map((circle, index) => {
          const textData = enhancedTextData[index];
          const item = items[index];
          const fontSizes = calculateFontSizes(smallRadius, item.label.length, width, items.length);
          const fixedFontSize = 16; // Fixed font size as requested
          const lineHeight = fixedFontSize * 1.2;
          
          return (
            <g key={item.id}>
              {/* Drop shadow for small circle */}
              <circle
                cx={circle.center.x + 2}
                cy={circle.center.y + 2}
                r={smallRadius}
                fill="rgba(0,0,0,0.1)"
              />
              
              {/* Small circle with gradient */}
              <defs>
                <radialGradient id={`gradient-${index}`} cx="30%" cy="30%">
                  <stop offset="0%" stopColor="#42A5F5" />
                  <stop offset="100%" stopColor="#1976D2" />
                </radialGradient>
              </defs>
              <circle
                cx={circle.center.x}
                cy={circle.center.y}
                r={smallRadius}
                fill={`url(#gradient-${index})`}
                stroke="#1565C0"
                strokeWidth="2"
              />
              
              {/* Circle number with better typography */}
              <text
                x={circle.center.x}
                y={circle.center.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                fontSize={fontSizes.numberSize}
                fontWeight="600"
                fontFamily="system-ui, -apple-system, sans-serif"
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
              >
                {circle.number}
              </text>
              
              {/* Multi-line text label with fixed font size */}
              <text
                x={textData.position.point.x}
                y={textData.position.point.y - ((textData.lines.length - 1) * lineHeight) / 2}
                textAnchor={textData.position.anchor}
                fill="#2C3E50"
                fontSize={fixedFontSize}
                fontWeight="500"
                fontFamily="system-ui, -apple-system, sans-serif"
                style={{ 
                  textShadow: '0 1px 1px rgba(255,255,255,0.8)',
                  letterSpacing: '0.02em'
                }}
              >
                {textData.lines.map((line, lineIndex) => (
                  <tspan
                    key={lineIndex}
                    x={textData.position.point.x}
                    dy={lineIndex === 0 ? 0 : lineHeight}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
        
        {/* Subtle branding/info */}
        <text
          x={width - 10}
          y={height - 15}
          textAnchor="end"
          fill="#adb5bd"
          fontSize="11"
          fontFamily="system-ui, -apple-system, sans-serif"
          opacity="0.6"
        >
          {items.length} items • Circle Diagram Layout
        </text>
      </svg>
    </div>
  );
};

export default CircleDiagram;