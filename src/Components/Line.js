import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Precio de BTC en dolares',
    },
  },
};

function App({dataApi}) {
  return (
    <div class="container">
        <br></br>
        <div class="row">
        <h3>Grafica Lineal Precio BTC</h3>
        </div>
        
        <Line data={dataApi} />
        <br></br>
    </div>
  );
}
export default App;