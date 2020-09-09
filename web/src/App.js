import React, { useEffect, useState } from 'react';
import LineChart from './components/LineChart';
import './App.css';

function App() {
  let [data, setData] = useState([{ id: "Moisture", data: [] }]);

  useEffect(() => {
    fetch('http://localhost:8080/data').then(resp => resp.json()).then(data => setData([{ id: "Moisture", data: data.map(elem => ({ x: elem.date, y: elem.data })) }]));
  }, []);

  const width = window.innerWidth > 1800 ? window.innerWidth / 1.7 : window.innerWidth / 1.2;
  return (
    <div className="wrapper">
      <LineChart data={data} width={width} height={400} />
    </div>
  );
}

export default App;
