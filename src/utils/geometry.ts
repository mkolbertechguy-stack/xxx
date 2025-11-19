/**
 * Geometric utility functions for circle diagram layout
 */

export interface Point {
  x: number;
  y: number;
}

export interface CirclePosition {
  center: Point;
  angle: number; // in radians
  number: number;
}

export interface TextPosition {
  point: Point;
  anchor: 'start' | 'end'; // SVG text-anchor values
  alignment: 'left' | 'right';
}

/**
 * Convert degrees to radians
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Convert radians to degrees
 */
export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Calculate the optimal large circle radius that fits within the canvas
 * while leaving space for text labels
 */
export const calculateLargeCircleRadius = (
  canvasWidth: number,
  canvasHeight: number,
  textPadding: number = 150 // Space reserved for text labels
): number => {
  const availableWidth = canvasWidth - 2 * textPadding;
  const availableHeight = canvasHeight - 2 * textPadding;
  return Math.min(availableWidth, availableHeight) / 2;
};

/**
 * Calculate positions for small circles evenly distributed around the large circle
 */
export const calculateCirclePositions = (
  centerX: number,
  centerY: number,
  largeRadius: number,
  count: number,
  startAngle: number = -Math.PI / 2 // Start at top (12 o'clock)
): CirclePosition[] => {
  const positions: CirclePosition[] = [];
  const angleStep = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    const angle = startAngle + i * angleStep;
    const x = centerX + largeRadius * Math.cos(angle);
    const y = centerY + largeRadius * Math.sin(angle);
    
    positions.push({
      center: { x, y },
      angle: angle,
      number: i + 1
    });
  }

  return positions;
};

/**
 * Calculate text label position based on circle position and radial angle
 */
export const calculateTextPosition = (
  circleCenter: Point,
  smallCircleRadius: number,
  angle: number,
  textOffset: number = 15
): TextPosition => {
  // Normalize angle to 0-2π range
  const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  
  // Convert to degrees for easier logic
  const degrees = radiansToDegrees(normalizedAngle);
  
  // Determine if we're on the right side (0° to 180°) or left side (180° to 360°)
  const isRightSide = degrees >= 0 && degrees <= 180;
  
  let textX: number;
  let anchor: 'start' | 'end';
  let alignment: 'left' | 'right';
  
  if (isRightSide) {
    // Right side: position text to the right of the circle, left-aligned
    textX = circleCenter.x + smallCircleRadius + textOffset;
    anchor = 'start';
    alignment = 'left';
  } else {
    // Left side: position text to the left of the circle, right-aligned
    textX = circleCenter.x - smallCircleRadius - textOffset;
    anchor = 'end';
    alignment = 'right';
  }
  
  // Vertically center the text with the circle
  const textY = circleCenter.y;
  
  return {
    point: { x: textX, y: textY },
    anchor,
    alignment
  };
};

/**
 * Calculate the small circle radius based on large circle radius
 */
export const calculateSmallCircleRadius = (largeRadius: number): number => {
  return largeRadius / 4; // As specified: diameter = 1/4 of large circle diameter
};