import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BuscarActividades() {
  const [id, setId] = useState('');
  const [actividad, setActividad] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <div
      style={{
        backgroundImage: "url('/fondo_actividades.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '40px'
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          padding: '30px',
          borderRadius: '10px',
          maxWidth: '600px',
          margin: '0 auto',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)'
        }}
      >
        <h2>Buscar Actividad por ID</h2>

        <input
          type="number"
          placeholder="Ingresa el ID de la actividad"
          value={id}
          onChange={(e) => setId(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            maxWidth: '400px',
            marginBottom: '10px'
          }}
        />

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={buscarPorId}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Buscar
          </button>

          <button
            onClick={() => navigate('/actividades')}
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔙 Volver
          </button>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {actividad && (
          <div style={{
            marginTop: '20px',
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '6px',
            backgroundColor: '#f9f9f9'
          }}>
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
    </div>
  );
}

export default BuscarActividades;
