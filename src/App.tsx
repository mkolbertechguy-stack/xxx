import React, { useState } from 'react';
import CircleDiagram, { CircleDiagramItem } from './components/CircleDiagram';
import './App.css';

// Demo data sets showcasing various use cases and label lengths
const demoDataSets: { [key: string]: CircleDiagramItem[] } = {
  'Technology Trends (5 items) - Matches Mockup': [
    { id: '1', label: 'Renewable energies and charging infrastructure' },
    { id: '2', label: 'Digital Transformation' },
    { id: '3', label: 'Robotics' },
    { id: '4', label: 'Bio technology' },
    { id: '5', label: 'Future mobility and autonomous driving' }
  ],
  'Short Labels (3 items)': [
    { id: '1', label: 'AI' },
    { id: '2', label: 'ML' },
    { id: '3', label: 'Data' }
  ],
  'Mixed Length Labels (6 items)': [
    { id: '1', label: 'Marketing and Customer Acquisition Strategies' },
    { id: '2', label: 'Product Development' },
    { id: '3', label: 'Sales' },
    { id: '4', label: 'Operations Management' },
    { id: '5', label: 'HR' },
    { id: '6', label: 'Financial Planning and Analysis' }
  ],
  'Long Labels (7 items)': [
    { id: '1', label: 'Comprehensive Requirements Analysis and Documentation' },
    { id: '2', label: 'System Architecture Design and Planning' },
    { id: '3', label: 'Implementation and Development Phase' },
    { id: '4', label: 'Testing, Quality Assurance, and Validation' },
    { id: '5', label: 'Deployment and Production Release' },
    { id: '6', label: 'Monitoring and Performance Analysis' },
    { id: '7', label: 'Maintenance and Continuous Improvement' }
  ],
  'Dense Layout (9 items)': [
    { id: '1', label: 'Strategy' },
    { id: '2', label: 'Planning' },
    { id: '3', label: 'Design' },
    { id: '4', label: 'Development' },
    { id: '5', label: 'Testing' },
    { id: '6', label: 'Deployment' },
    { id: '7', label: 'Monitoring' },
    { id: '8', label: 'Optimization' },
    { id: '9', label: 'Maintenance' }
  ],
  'Minimal Configuration (2 items)': [
    { id: '1', label: 'Primary Option with Detailed Description' },
    { id: '2', label: 'Alternative Solution Approach' }
  ]
};

const App: React.FC = () => {
  const [selectedDataSet, setSelectedDataSet] = useState<string>('Technology Trends (5 items) - Matches Mockup');
  const [customItems, setCustomItems] = useState<string>('');
  const [useCustom, setUseCustom] = useState<boolean>(false);

  const getCurrentItems = (): CircleDiagramItem[] => {
    if (useCustom && customItems.trim()) {
      const labels = customItems.split('\n').filter(label => label.trim());
      return labels.map((label, index) => ({
        id: `custom-${index + 1}`,
        label: label.trim()
      }));
    }
    return demoDataSets[selectedDataSet] || [];
  };

  const currentItems = getCurrentItems();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Circle Diagram Layout</h1>
        <p>Zapdeck Case Study - React + TypeScript + SVG Implementation</p>
      </header>

      <main className="App-main">
        <div className="controls">
          <div className="control-group">
            <label htmlFor="dataset-select">Choose Demo Dataset:</label>
            <select
              id="dataset-select"
              value={selectedDataSet}
              onChange={(e) => {
                setSelectedDataSet(e.target.value);
                setUseCustom(false);
              }}
              disabled={useCustom}
            >
              {Object.keys(demoDataSets).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={useCustom}
                onChange={(e) => setUseCustom(e.target.checked)}
              />
              Use Custom Items
            </label>
          </div>

          {useCustom && (
            <div className="control-group">
              <label htmlFor="custom-items">Custom Items (one per line, 2-9 items):</label>
              <textarea
                id="custom-items"
                value={customItems}
                onChange={(e) => setCustomItems(e.target.value)}
                placeholder="Enter one item per line..."
                rows={6}
                cols={50}
              />
            </div>
          )}
        </div>

        <div className="diagram-info">
          <p>
            <strong>Current Configuration:</strong> {currentItems.length} items
            {currentItems.length < 2 || currentItems.length > 9 ? 
              ' (⚠️ Must be between 2-9 items)' : ' ✓'}
          </p>
        </div>

        <div className="diagram-container">
          <CircleDiagram 
            items={currentItems}
            width={1920}
            height={1080}
          />
        </div>

        <div className="features-info">
          <h2>Implementation Features</h2>
          <ul>
            <li>✅ Fixed SVG canvas: 1920 x 1080 pixels</li>
            <li>✅ Large circle centered with optimal sizing</li>
            <li>✅ Small circles (diameter = 1/4 of large circle) on circumference</li>
            <li>✅ Even distribution around the circle</li>
            <li>✅ Clockwise numbering starting from top</li>
            <li>✅ Smart text positioning based on radial angle</li>
            <li>✅ Right side (0°-180°): Labels right of circle, left-aligned</li>
            <li>✅ Left side (180°-360°): Labels left of circle, right-aligned</li>
            <li>✅ Supports 2-9 items as specified</li>
            <li>✅ Clean TypeScript implementation with proper types</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default App;