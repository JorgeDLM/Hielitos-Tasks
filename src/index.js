import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import App from './App';
import './index.css';
import './css/Default.sass'
import "./css/iconos.css";
import 'bootstrap/dist/css/bootstrap.css'
import UsuarioState from "./Components/Admin/context/UsuarioState";



ReactDOM.render(
  <BrowserRouter>
    <div className="backgroundColor">
      <UsuarioState>
          <App />
      </UsuarioState>
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
