import React, { useState, useEffect } from "react";

import './App.css';
import axios from 'axios';
import Line from './Components/Line';
import TablePersonalizate from './Components/Table';
import { Button } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Stack } from 'react-bootstrap';


function App() {

  const [show, setShow] = useState(false);

  const [time, setTime] = useState([]);
  const [price, setPrice] = useState([]);

  const [timePredicted, setTimePredicted] = useState([]);
  const [pricePredicted, setPricePredicted] = useState([]);
  const [dataPredicted, setDataPredicted] = useState([]);

  const [numPredictions, setNumPredictions] = useState(0);
  

  const toggleShow = () => setShow(!show);

  
  const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const dias_semana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function createData(date, price) {
    return { date, price };
  }

  const calculate = () => {
    toggleShow();
    if (numPredictions > 0 && !show) {
      getPredictionValues();

      timePredicted.forEach(element => {
        console.log("do = " + element);
      });
    }
  }

  const petitionInitial = async () => {
    await axios.get("https://api-btc-prediction.herokuapp.com/get-data-historic-btc")
      .then(response => {
        var timeAux = [];
        var priceAux = [];

        var data = response.data.Close;
        for (const property in data) {
          timeAux.push(property);
          priceAux.push(data[property]);
        }

        setTime(timeAux);
        setPrice(priceAux);

      })

  }

  const getPredictionValues = async () => {

    axios.post('https://api-btc-prediction.herokuapp.com/get-prediction?num_times=' + numPredictions)
      .then(response => {
        var timeAux = [];
        var priceAux = [];
        var tablaValues = [];

        var data = response.data.Close;
        for (const property in data) {
          var datePrice = new Date(property);
          var dateConfigurated = dias_semana[datePrice.getDay()] +", "+datePrice.getDate()+" de "+meses[datePrice.getMonth()]+" de "+datePrice.getUTCFullYear()
          +"  Hora: "+datePrice.getHours()+":"+datePrice.getMinutes()
          timeAux.push(property);
          priceAux.push(data[property]);
          tablaValues.push(createData(dateConfigurated,data[property]));
        }

        
        setTimePredicted(timeAux);
        setPricePredicted(priceAux);

        setDataPredicted(tablaValues);
      })

  }



  useEffect(() => {
    petitionInitial();
  }, [])

  const data = {
    labels: time,
    datasets: [
      {
        label: 'Precio del Bitcoin en USD',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: price
      }
    ]
  };


  const predictData = {
    labels: timePredicted,
    datasets: [
      {
        label: 'Predicción del Precio del Bitcoin',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: pricePredicted
      }
    ]
  };



  return (
    <div className="App">

      <header >
        <Card className="bg-dark text-white">
          <Card.Img src="btc.png" alt="Card image" />
          <Card.ImgOverlay>
            <Card.Title><h2>Prediccion del Precio del Bitcoin</h2></Card.Title>
            <Card.Text>
              Las criptomonedas se encuentran entre las monedas digitales más confiables y seguras de la actualidad.
            </Card.Text>
          </Card.ImgOverlay>
        </Card>
      </header>

      <div class="mb-3">
        <Line dataApi={data} />
      </div>

      <div>
        <h2>Generar Predicciones por Horas</h2>
      </div>

      <div class="container">
      <Card body>Se predeciran los valores correspondientes al 2022</Card>
      </div>
      <br></br>
      <div class="container">
        <Stack gap={2} className="col-md-5 mx-auto">
          <input type="text" onChange={event => setNumPredictions(event.target.value)}
            placeholder="Introduzca el numero de horas a predecir" />
          

          {show &&
            <Button type="button" variant="warning" onClick={() => calculate()}>Borrar y Calcular Nuevamente</Button>
          }
          {!show &&
            <Button type="button" variant="outline-primary" onClick={() => calculate()}>Calcular</Button>
          }

        </Stack>

        <div class="container">
          {show &&
            <Line dataApi={predictData} />
          }
        </div>
        <br></br>

        <br></br>
        <div>
          {show &&
            <h3>Tabla de Datos con las Predicciones Generadas</h3>
          }
        </div>
        <br></br>
        <br></br>
        <div class="container">
          {show &&
            <TablePersonalizate data={dataPredicted}/>
          }
        </div>

      </div>
      <br></br>
      
      <br></br>
      <br></br>
      <footer class="border-top text-muted">
        <div class="container">
          &copy; 2022 - Realizado por Omar Sanmartin y Johanna Montaño
        </div>
      </footer>

    </div>
  );
}

export default App;
