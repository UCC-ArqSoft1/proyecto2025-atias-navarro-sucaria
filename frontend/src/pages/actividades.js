import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Actividades() {
  const [actividades, setActividades] = useState([]);

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const res = await axios.get('http://localhost:8080/actividades');
        console.log("🎯 Actividades recibidas:", res.data);
        setActividades(res.data);
      } catch (err) {
        console.error("🚨 Error al obtener actividades:", err);
        alert('Error al obtener actividades');
      }
    };
    fetchActividades();
  }, []);

  const inscribirse = async (actividadId) => {
    try {
      const token = localStorage.getItem("token");
  
      const res = await axios.post(
        "http://localhost:8080/inscripciones",
        { actividad_id: actividadId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("✅ Inscripción exitosa");
    } catch (error) {
      console.error("❌ Error al inscribirse:", error);
      alert("No se pudo inscribir");
    }
  };
  

  return (
    <div>
      <h2>Lista de Actividades</h2>

      <pre style={{ textAlign: "left", background: "#eee", padding: "1rem" }}>
        {JSON.stringify(actividades, null, 2)}
      </pre>

      <ul>
  {actividades.map((act) => (
    <li key={act.ID}>
      <strong>{act.titulo}</strong> – {act.dia} a las {act.horario}
      <br />
      <button onClick={() => inscribirse(act.ID)}>Inscribirme</button>
    </li>
  ))}
</ul>



    </div>
  );
}

export default Actividades;
