import React, { useState } from 'react';
import CircleDiagram, { CircleDiagramItem } from './components/CircleDiagram';
import './App.css';

// Demo data sets with varying numbers of items and label lengths
const demoDataSets: { [key: string]: CircleDiagramItem[] } = {
  'Technology Trends (5 items)': [
    { id: '1', label: 'Renewable energies and charging infrastructure' },
    { id: '2', label: 'Digital Transformation' },
    { id: '3', label: 'Robotics' },
    { id: '4', label: 'Bio technology' },
    { id: '5', label: 'Future mobility and autonomous driving' }
  ],
  'Simple Example (3 items)': [
    { id: '1', label: 'AI' },
    { id: '2', label: 'Machine Learning' },
    { id: '3', label: 'Data Science' }
  ],
  'Business Areas (6 items)': [
    { id: '1', label: 'Marketing and Customer Acquisition' },
    { id: '2', label: 'Product Development' },
    { id: '3', label: 'Sales' },
    { id: '4', label: 'Operations' },
    { id: '5', label: 'Human Resources' },
    { id: '6', label: 'Finance and Accounting' }
  ],
  'Project Phases (8 items)': [
    { id: '1', label: 'Requirements Analysis' },
    { id: '2', label: 'System Design' },
    { id: '3', label: 'Implementation' },
    { id: '4', label: 'Testing and Quality Assurance' },
    { id: '5', label: 'Deployment' },
    { id: '6', label: 'Monitoring' },
    { id: '7', label: 'Maintenance' },
    { id: '8', label: 'Documentation and Knowledge Transfer' }
  ],
  'Minimal (2 items)': [
    { id: '1', label: 'Option A' },
    { id: '2', label: 'Option B' }
  ],
  'Maximum (9 items)': [
    { id: '1', label: 'First' },
    { id: '2', label: 'Second' },
    { id: '3', label: 'Third' },
    { id: '4', label: 'Fourth' },
    { id: '5', label: 'Fifth' },
    { id: '6', label: 'Sixth' },
    { id: '7', label: 'Seventh' },
    { id: '8', label: 'Eighth' },
    { id: '9', label: 'Ninth' }
  ]
};

const App: React.FC = () => {
  const [selectedDataSet, setSelectedDataSet] = useState<string>('Technology Trends (5 items)');
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