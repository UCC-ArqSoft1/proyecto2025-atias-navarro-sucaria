import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [misActividades, setMisActividades] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("⛔ No hay token: redirigiendo a login");
      navigate("/login"); // Redirige si no hay token
      return;
    }

    const fetchData = async () => {
      try {
        // Traer todas las actividades (pública)
        const actividadesRes = await axios.get('http://localhost:8080/actividades');
        setActividades(actividadesRes.data);
        console.log("🎯 Actividades recibidas:", actividadesRes.data);

        // Traer actividades a las que estoy inscripto (requiere token)
        const misActRes = await axios.get('http://localhost:8080/mis-actividades', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMisActividades(misActRes.data.map(act => act.id));
        console.log("📌 Mis actividades:", misActRes.data);

      } catch (err) {
        console.error("🚨 Error al obtener actividades o inscripciones:", err.response?.data || err.message);
        alert('Error al cargar actividades');
      }
    };

    fetchData();
  }, [navigate]);

  const inscribirse = async (actividadId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No hay token. Iniciá sesión.");
      return;
    }

    try {
      setLoadingId(actividadId);

      await axios.post(
        "http://localhost:8080/inscripciones",
        { actividad_id: actividadId },
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setMisActividades((prev) => [...prev, actividadId]);
      alert("✅ Inscripción exitosa");
    } catch (error) {
      console.error("❌ Error al inscribirse:", error.response?.data || error.message);
      alert("❌ No se pudo inscribir");
    } finally {
      setLoadingId(null);
    }
  };

  const cancelarInscripcion = async (actividadId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No hay token. Iniciá sesión.");
      return;
    }

    try {
      setLoadingId(actividadId);

      await axios.delete(`http://localhost:8080/inscripciones/${actividadId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMisActividades((prev) => prev.filter((id) => id !== actividadId));
      alert("❎ Inscripción cancelada");
    } catch (error) {
      console.error("❌ Error al cancelar inscripción:", error.response?.data || error.message);
      alert("❌ No se pudo cancelar la inscripción");
    } finally {
      setLoadingId(null);
    }
  };
return (
  <div>
    <h2>Lista de Actividades</h2>

    <Link
  to="/buscar-actividad"
  style={{
    display: 'inline-block',
    padding: '8px 16px',
    backgroundColor: '#B22222',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    marginBottom: '20px',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer'
  }}
>
  🔎 Buscar Actividad por ID
</Link>

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
