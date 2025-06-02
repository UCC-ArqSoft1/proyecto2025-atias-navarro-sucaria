// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Actividades from './pages/actividades';
import MisActividades from './pages/misActividades';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/mis-actividades" element={<MisActividades />} />
      </Routes>
    </Router>
  );
}

export default App;
