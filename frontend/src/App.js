// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Actividades from './pages/actividades';
import AdminPanel from './pages/adminPanel';
import BuscarActividades from './pages/buscarActividades';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/buscar-actividad" element={<BuscarActividades />} />
      </Routes>
    </Router>
  );
}

export default App;
