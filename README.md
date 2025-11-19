# Circle Diagram Layout

A React + TypeScript + SVG implementation of a circular diagram component for the Zapdeck case study. This component intelligently scales within a given slide area and dynamically lays out elements with proper text positioning.

![Circle Diagram Example](docs/example.png)

## Features

- ✅ **Fixed Canvas**: 1920 x 1080 pixel SVG canvas
- ✅ **Scalable Design**: Large circle optimally sized within available space
- ✅ **Dynamic Layout**: Supports 2-9 items with even distribution
- ✅ **Smart Text Positioning**: Intelligent label placement based on radial position
- ✅ **Clockwise Numbering**: Sequential numbering starting from 12 o'clock
- ✅ **TypeScript**: Full type safety and modern React patterns
- ✅ **Clean Architecture**: Modular design with separated geometry utilities

## Geometric Strategy

### Circle Positioning

The implementation uses a mathematical approach to position elements:

1. **Large Circle Sizing**: 
   - Calculates optimal radius based on canvas dimensions minus text padding
   - Formula: `radius = min(width - 2*padding, height - 2*padding) / 2`
   - Default text padding: 150px to accommodate labels

2. **Small Circle Distribution**:
   - Small circles positioned evenly around the large circle's circumference
   - Each small circle has diameter = 1/4 of large circle diameter (as specified)
   - Angular distribution: `angleStep = 2π / itemCount`
   - Starting angle: -π/2 (12 o'clock position)

3. **Position Calculation**:
   ```typescript
   x = centerX + largeRadius * cos(angle)
   y = centerY + largeRadius * sin(angle)
   ```

### Text Label Positioning Rule

The text positioning follows a consistent rule based on radial position:

- **Right Side (0° to 180°)**: 
  - Label positioned to the RIGHT of the circle
  - Text is LEFT-aligned (`text-anchor="start"`)
  - Prevents text from overlapping the diagram center

- **Left Side (180° to 360°)**:
  - Label positioned to the LEFT of the circle  
  - Text is RIGHT-aligned (`text-anchor="end"`)
  - Maintains visual balance and readability

This approach ensures optimal text readability while avoiding complex collision detection, as the labels naturally spread outward from the center.

## Project Structure

```
src/
├── components/
│   └── CircleDiagram.tsx      # Main diagram component
├── utils/
│   └── geometry.ts            # Geometric calculation utilities
├── App.tsx                    # Demo application with examples
├── App.css                    # Styling
└── index.tsx                  # React entry point
```

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd circle-diagram-layout
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

## Usage

### Basic Usage

```typescript
import CircleDiagram, { CircleDiagramItem } from './components/CircleDiagram';

const items: CircleDiagramItem[] = [
  { id: '1', label: 'Renewable energies and charging infrastructure' },
  { id: '2', label: 'Digital Transformation' },
  { id: '3', label: 'Robotics' },
  { id: '4', label: 'Bio technology' },
  { id: '5', label: 'Future mobility and autonomous driving' }
];

function MyComponent() {
  return (
    <CircleDiagram 
      items={items}
      width={1920}
      height={1080}
    />
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CircleDiagramItem[]` | Required | Array of items to display (2-9 items) |
| `width` | `number` | `1920` | SVG canvas width in pixels |
| `height` | `number` | `1080` | SVG canvas height in pixels |
| `className` | `string` | `''` | Additional CSS class name |

### CircleDiagramItem Interface

```typescript
interface CircleDiagramItem {
  id: string;    // Unique identifier
  label: string; // Display text
}
```

## Demo Examples

The application includes comprehensive demo scenarios showcasing various use cases:

1. **Technology Trends (5 items)** - Matches the original mockup exactly with realistic tech labels
2. **Short Labels (3 items)** - Minimal configuration with concise labels
3. **Mixed Length Labels (6 items)** - Variety in label lengths testing text positioning
4. **Long Labels (7 items)** - Complex project phase names testing collision handling
5. **Dense Layout (9 items)** - Maximum capacity with development lifecycle phases
6. **Minimal Configuration (2 items)** - Edge case testing with basic setup

Each scenario demonstrates different aspects of the layout algorithm and text positioning logic. You can also test with custom items using the interactive form.

## Technical Implementation Details

### Geometry Utilities (`src/utils/geometry.ts`)

- `calculateLargeCircleRadius()` - Determines optimal large circle size
- `calculateCirclePositions()` - Computes small circle positions
- `calculateTextPosition()` - Determines text label placement
- `calculateSmallCircleRadius()` - Calculates small circle size (1/4 ratio)

### Component Architecture

- **CircleDiagram**: Main React component with SVG rendering
- **Error Handling**: Validates item count (2-9 range)
- **Responsive**: Maintains aspect ratio and positioning
- **Accessible**: Proper SVG structure with semantic elements

### Styling Approach

- **Professional Visual Design**: Modern gradient backgrounds with subtle shadows
- **Color Consistency**: Unified blue gradient theme (#2196F3 to #1976D2)
- **Typography Hierarchy**: Responsive font sizing with proper visual hierarchy
- **Interactive Elements**: Enhanced focus states and hover effects
- **Brand Integration**: Subtle branding footer with professional presentation

### Enhanced Layout Decisions

- **Dynamic Text Positioning**: Intelligent offset calculation based on circle count
- **Collision Avoidance**: Smart spacing prevents text overlap in dense configurations
- **Responsive Sizing**: Text and elements scale appropriately for different scenarios
- **Visual Balance**: Consistent spacing maintains professional appearance across all configurations

## Browser Compatibility

- Modern browsers supporting ES6+ and SVG
- React 18+ compatible
- TypeScript 4.9+ support

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

### Code Quality

- Full TypeScript implementation
- ESLint configuration included
- Modular architecture with clear separation of concerns
- Comprehensive error handling

## Limitations & Future Enhancements

### Current Limitations
- No collision avoidance for overlapping text (as specified in requirements)
- Fixed canvas size (responsive scaling not required per spec)
- No hover effects or interactivity (slides don't support these)

### Potential Enhancements
- Dynamic canvas sizing
- Text wrapping for very long labels
- Custom color schemes
- Animation transitions
- Export functionality (PNG/SVG)

## License

This project is created for the Zapdeck case study evaluation.

---

**Implementation Time**: ~4 hours as suggested
**Technologies**: React 18, TypeScript 4.9, SVG, CSS3
**Approach**: Mathematical geometry calculations with clean component architecture