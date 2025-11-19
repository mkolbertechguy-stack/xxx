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
  offset: number;
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
  textPadding: number = 200 // Increased space reserved for text labels
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
 * Calculate optimal text offset based on label characteristics and layout density
 */
export const calculateTextOffset = (
  labelLength: number,
  smallCircleRadius: number,
  totalItems: number,
  canvasWidth: number
): number => {
  // Base offset from circle edge
  const baseOffset = Math.max(15, smallCircleRadius * 0.2);
  
  // Scale with canvas size for better proportions
  const scaleOffset = canvasWidth / 120; // Responsive to canvas size
  
  // Additional spacing for longer labels to prevent crowding
  const lengthFactor = Math.min(labelLength / 25, 1.5);
  
  // Increase spacing when there are more items to prevent overlaps
  const densityFactor = Math.max(1, totalItems / 6);
  
  return Math.round(baseOffset + scaleOffset + (lengthFactor * 8) + (densityFactor * 5));
};

/**
 * Calculate text label position based on circle position and radial angle with enhanced spacing
 */
export const calculateTextPosition = (
  circleCenter: Point,
  smallCircleRadius: number,
  angle: number,
  labelLength: number = 10,
  totalItems: number = 5,
  canvasWidth: number = 1920
): TextPosition => {
  // Calculate dynamic text offset
  const textOffset = calculateTextOffset(labelLength, smallCircleRadius, totalItems, canvasWidth);
  
  // Normalize angle to 0-2π range
  const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  
  // Convert to degrees for easier logic
  const degrees = radiansToDegrees(normalizedAngle);
  
  // Determine if we're on the right side (0° to 180°) or left side (180° to 360°)
  const isRightSide = degrees >= 0 && degrees <= 180;
  
  // Fine-tune positioning for better visual balance
  let adjustedY = circleCenter.y;
  
  // For circles near the top/bottom, adjust positioning slightly to avoid crowding
  const isNearTop = degrees >= 315 || degrees <= 45;
  const isNearBottom = degrees >= 135 && degrees <= 225;
  
  if (isNearTop) {
    adjustedY -= 3; // Move text slightly up for top positions
  } else if (isNearBottom) {
    adjustedY += 3; // Move text slightly down for bottom positions
  }
  
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
  
  return {
    point: { x: textX, y: adjustedY },
    anchor,
    alignment,
    offset: textOffset
  };
};

/**
 * Calculate responsive font sizes based on circle size and label characteristics
 */
export const calculateFontSizes = (
  smallCircleRadius: number,
  labelLength: number,
  canvasWidth: number,
  totalItems: number
): { labelSize: number; numberSize: number } => {
  // Base font sizes scaled to canvas
  const baseLabelSize = Math.max(12, Math.min(18, canvasWidth / 110));
  const baseNumberSize = Math.max(14, Math.min(22, smallCircleRadius / 4.5));
  
  // Adjust label size based on length and density
  const lengthAdjustment = Math.max(0.75, 1 - (labelLength - 20) / 60);
  const densityAdjustment = Math.max(0.9, 1 - (totalItems - 5) / 20);
  
  return {
    labelSize: Math.round(baseLabelSize * lengthAdjustment * densityAdjustment),
    numberSize: Math.round(baseNumberSize)
  };
};

/**
 * Calculate the small circle radius based on large circle radius
 */
export const calculateSmallCircleRadius = (largeRadius: number): number => {
  return largeRadius / 4; // As specified: diameter = 1/4 of large circle diameter
};

/**
 * Split text into multiple lines for better readability
 */
export const wrapText = (text: string, maxCharsPerLine: number = 25): string[] => {
  if (text.length <= maxCharsPerLine) {
    return [text];
  }

  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        // Single word is too long, split it
        lines.push(word.substring(0, maxCharsPerLine));
        currentLine = word.substring(maxCharsPerLine);
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

/**
 * Calculate text bounds to prevent screen overflow
 */
export const calculateTextBounds = (
  textPosition: TextPosition,
  textLines: string[],
  fontSize: number,
  canvasWidth: number,
  canvasHeight: number
): TextPosition => {
  // Estimate text width (rough approximation)
  const maxLineLength = Math.max(...textLines.map(line => line.length));
  const estimatedTextWidth = maxLineLength * fontSize * 0.6; // Rough character width
  const textHeight = textLines.length * fontSize * 1.2; // Line height
  
  let adjustedX = textPosition.point.x;
  let adjustedY = textPosition.point.y;
  
  // Check horizontal bounds
  if (textPosition.anchor === 'start') {
    // Left-aligned text, check right boundary
    if (adjustedX + estimatedTextWidth > canvasWidth - 20) {
      adjustedX = canvasWidth - estimatedTextWidth - 20;
    }
  } else {
    // Right-aligned text, check left boundary
    if (adjustedX - estimatedTextWidth < 20) {
      adjustedX = estimatedTextWidth + 20;
    }
  }
  
  // Check vertical bounds
  const halfTextHeight = textHeight / 2;
  if (adjustedY - halfTextHeight < 20) {
    adjustedY = halfTextHeight + 20;
  } else if (adjustedY + halfTextHeight > canvasHeight - 20) {
    adjustedY = canvasHeight - halfTextHeight - 20;
  }
  
  return {
    ...textPosition,
    point: { x: adjustedX, y: adjustedY }
  };
};

/**
 * Enhanced text positioning with collision avoidance and boundary checking
 */
export const calculateEnhancedTextPosition = (
  circleCenter: Point,
  smallCircleRadius: number,
  angle: number,
  labelText: string,
  totalItems: number = 5,
  canvasWidth: number = 1920,
  canvasHeight: number = 1080,
  allCirclePositions: CirclePosition[] = []
): { position: TextPosition; lines: string[] } => {
  // Get base text position
  const basePosition = calculateTextPosition(
    circleCenter,
    smallCircleRadius,
    angle,
    labelText.length,
    totalItems,
    canvasWidth
  );
  
  // Wrap text into multiple lines
  const textLines = wrapText(labelText, 25);
  
  // Calculate font size (fixed size, no scaling)
  const fontSize = 16; // Fixed font size as requested
  
  // Adjust position to prevent screen overflow
  const adjustedPosition = calculateTextBounds(
    basePosition,
    textLines,
    fontSize,
    canvasWidth,
    canvasHeight
  );
  
  // Additional collision avoidance with other circles
  let finalPosition = adjustedPosition;
  
  // Check for collisions with other circles and adjust if needed
  for (const otherCircle of allCirclePositions) {
    if (otherCircle.center.x === circleCenter.x && otherCircle.center.y === circleCenter.y) {
      continue; // Skip self
    }
    
    const distance = Math.sqrt(
      Math.pow(finalPosition.point.x - otherCircle.center.x, 2) +
      Math.pow(finalPosition.point.y - otherCircle.center.y, 2)
    );
    
    // If text is too close to another circle, push it away
    if (distance < smallCircleRadius * 2.5) {
      const pushDirection = finalPosition.anchor === 'start' ? 1 : -1;
      finalPosition = {
        ...finalPosition,
        point: {
          x: finalPosition.point.x + (pushDirection * 30),
          y: finalPosition.point.y
        }
      };
    }
  }
  
  return {
    position: finalPosition,
    lines: textLines
  };
};