import React from 'react';
import LineChart from './components/LineChart';
import './App.css';

function App() {
  const data =
    [
      {
        id: 'Moisture',
        data: [
          { x: '2018-01-01', y: 734 },
          { x: '2018-01-02', y: 710 },
          { x: '2018-01-03', y: 682 },
          { x: '2018-01-04', y: 620 },
          { x: '2018-01-05', y: 590 },
          { x: '2018-01-06', y: 734 },
          { x: '2018-01-07', y: 705 },
          { x: '2018-01-08', y: 690 },
          { x: '2018-01-09', y: 690 },
          { x: '2018-01-10', y: 600 },
          { x: '2018-01-11', y: 690 },
          { x: '2018-01-12', y: 690 },
          { x: '2018-01-13', y: 700 },
          { x: '2018-01-14', y: 690 },
        ],
      }
    ];

  const width = window.innerWidth > 1800 ? window.innerWidth / 1.7 : window.innerWidth / 1.2;
  return (
    <div className="wrapper">
      <h1 className="header">Begonia Maculata</h1>
      <LineChart data={data} width={width} height={400} />
    </div>
  );
}

export default App;
