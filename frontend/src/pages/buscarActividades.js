import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BuscarActividades() {
  const [id, setId] = useState('');
  const [actividad, setActividad] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // 👈 para navegar hacia atrás

  const buscarPorId = async () => {
    if (!id) {
      setError('Por favor, ingresa un ID');
      setActividad(null);
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/actividades/${id}`);
      setActividad(res.data);
      setError('');
    } catch (err) {
      setError('Actividad no encontrada.');
      setActividad(null);
    }
  };

  return (
    <div>
      <h2>Buscar Actividad por ID</h2>

      <input
        type="number"
        placeholder="Ingresa el ID de la actividad"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={buscarPorId}>Buscar</button>

      <button 
        onClick={() => navigate('/actividades')} 
        style={{ marginLeft: '10px' }}
      >
        🔙 Volver a actividades
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {actividad && (
        <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '10px' }}>
          <h3>{actividad.titulo}</h3>
          <p>{actividad.descripcion}</p>
          <p><strong>Día:</strong> {actividad.dia}</p>
          <p><strong>Horario:</strong> {actividad.horario}</p>
          <p><strong>Duración:</strong> {actividad.duracion} minutos</p>
          <p><strong>Cupo:</strong> {actividad.cupo}</p>
          <p><strong>Categoría:</strong> {actividad.categoria}</p>
          <p><strong>Instructor:</strong> {actividad.instructor}</p>
        </div>
      )}
    </div>
  );
}

export default BuscarActividades;
