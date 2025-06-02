import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [misActividades, setMisActividades] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Traer todas las actividades
        const actividadesRes = await axios.get('http://localhost:8080/actividades');
        setActividades(actividadesRes.data);
        console.log("🎯 Actividades recibidas:", actividadesRes.data);

        // Traer actividades a las que estoy inscripto
        const misActRes = await axios.get('http://localhost:8080/mis-actividades', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMisActividades(misActRes.data.map(act => act.id));
        console.log("📌 Mis actividades:", misActRes.data);

      } catch (err) {
        console.error("🚨 Error al obtener actividades o inscripciones:", err);
        alert('Error al cargar actividades');
      }
    };

    fetchData();
  }, []);

  const inscribirse = async (actividadId) => {
    try {
      const token = localStorage.getItem("token");
      setLoadingId(actividadId);
      console.log("➡ Enviando:", { actividad_id: actividadId });


      await axios.post(
        "http://localhost:8080/inscripciones",
        { actividad_id: actividadId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMisActividades((prev) => [...prev, actividadId]);
      alert("✅ Inscripción exitosa");
    } catch (error) {
      console.error("❌ Error al inscribirse:", error);
      alert("❌ No se pudo inscribir");
    } finally {
      setLoadingId(null);
    }
  };

  const cancelarInscripcion = async (actividadId) => {
    try {
      const token = localStorage.getItem("token");
      setLoadingId(actividadId);

      await axios.delete(`http://localhost:8080/inscripciones/${actividadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMisActividades((prev) => prev.filter((id) => id !== actividadId));
      alert("❎ Inscripción cancelada");
    } catch (error) {
      console.error("❌ Error al cancelar inscripción:", error);
      alert("❌ No se pudo cancelar la inscripción");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div>
      <h2>Lista de Actividades</h2>

      <ul>
        {actividades.map((act) => {
          const id = Number(act.id);
          const yaInscripto = misActividades.includes(id);

          return (
            <li key={id}>
              <strong>{act.titulo}</strong> – {act.dia} a las {act.horario}
              <br />
              {yaInscripto ? (
                <button
                  onClick={() => cancelarInscripcion(id)}
                  disabled={loadingId === id}
                >
                  {loadingId === id ? "Cancelando..." : "Cancelar inscripción"}
                </button>
              ) : (
                <button
                  onClick={() => inscribirse(id)}
                  disabled={loadingId === id}
                >
                  {loadingId === id ? "Inscribiendo..." : "Inscribirme"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Actividades;
