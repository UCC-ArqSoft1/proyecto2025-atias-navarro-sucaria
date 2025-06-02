import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MisActividades() {
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    const fetchmisActividades = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/mis-actividades', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setActividades(res.data);
      } catch (err) {
        alert('Error al cargar tus actividades');
      }
    };
    fetchmisActividades();
  }, []);

  return (
    <div>
      <h2>Mis Actividades</h2>
      <ul>
        {actividades.map((a) => (
          <li key={a.id}>{a.nombre} - {a.dia}</li>
        ))}
      </ul>
    </div>
  );
}

export default MisActividades;