import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [misActividades, setMisActividades] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [filtro, setFiltro] = useState('');
  const [actividadExpandida, setActividadExpandida] = useState(null);
  const [errores, setErrores] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("⛔ No hay token: redirigiendo a login");
      navigate("/login");
      return;
    }

    // Verificar si el usuario es administrador
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(payload.rol === 'administrador');
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }

    const fetchData = async () => {
      try {
        const actividadesRes = await axios.get('http://localhost:8080/actividades');
        setActividades(actividadesRes.data);
        const misActRes = await axios.get('http://localhost:8080/mis-actividades', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMisActividades(misActRes.data.map(act => act.id));
      } catch (err) {
        console.error("🚨 Error al obtener actividades:", err.response?.data || err.message);
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
      setErrores((prev) => ({ ...prev, [actividadId]: null }));
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
      const mensaje = error.response?.data?.error || "❌ No se pudo inscribir";
      setErrores((prev) => ({ ...prev, [actividadId]: mensaje }));
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
      setErrores((prev) => ({ ...prev, [actividadId]: null }));
      setLoadingId(actividadId);
      await axios.delete(`http://localhost:8080/inscripciones/${actividadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMisActividades((prev) => prev.filter((id) => id !== actividadId));
      alert("❎ Inscripción cancelada");
    } catch (error) {
      const mensaje = error.response?.data?.error || "❌ No se pudo cancelar";
      setErrores((prev) => ({ ...prev, [actividadId]: mensaje }));
    } finally {
      setLoadingId(null);
    }
  };

  const toggleDetalle = (id) => {
    setActividadExpandida((prev) => (prev === id ? null : id));
  };

  const actividadesFiltradas = actividades.filter((act) => {
    const buscar = filtro.toLowerCase();
    return (
      act.titulo.toLowerCase().includes(buscar) ||
      act.categoria.toLowerCase().includes(buscar) ||
      act.dia.toLowerCase().includes(buscar)
    );
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("/fondo_actividades.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '1200px',
        margin: '0 auto',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ color: '#B22222', margin: 0 }}>Actividades</h1>
          <div>
            {isAdmin && (
              <Link
                to="/admin"
                style={{
                  backgroundColor: '#B22222',
                  color: 'white',
                  padding: '10px 20px',
                  textDecoration: 'none',
                  borderRadius: '4px'
                }}
              >
                Panel de Administración
              </Link>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            alert("Sesión cerrada");
            navigate("/");
          }}
          style={{
            backgroundColor: "#888",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          🔒 Cerrar sesión
        </button>

        <h2 style={{ marginBottom: '20px' }}>Lista de Actividades</h2>

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

        <input
          type="text"
          placeholder="Buscar por título, categoría o día..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{
            display: 'block',
            marginTop: '10px',
            marginBottom: '20px',
            padding: '8px',
            width: '100%',
            maxWidth: '400px'
          }}
        />

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {actividadesFiltradas.map((act) => {
            const id = Number(act.id);
            const yaInscripto = misActividades.includes(id);
            const estaExpandida = actividadExpandida === id;
            const error = errores[id];

            return (
              <li key={id} style={{ marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {act.imagen && (
                    <img
                      src={`http://localhost:8080${act.imagen}`}
                      alt={act.titulo}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  )}
                  <div>
                    <strong>{act.titulo}</strong> – {act.dia} a las {act.horario}
                    <br />
                    {yaInscripto ? (
                      <button onClick={() => cancelarInscripcion(id)} disabled={loadingId === id}>
                        {loadingId === id ? "Cancelando..." : "Cancelar inscripción"}
                      </button>
                    ) : (
                      <button onClick={() => inscribirse(id)} disabled={loadingId === id}>
                        {loadingId === id ? "Inscribiendo..." : "Inscribirme"}
                      </button>
                    )}
                    <button onClick={() => toggleDetalle(id)} style={{ marginLeft: '10px' }}>
                      {estaExpandida ? "Ocultar detalles" : "Ver detalles"}
                    </button>
                    {error && (
                      <div style={{ color: 'red', marginTop: '5px' }}>
                        ⚠️ {error}
                      </div>
                    )}
                    {estaExpandida && (
                      <div style={{ marginTop: '5px', paddingLeft: '10px' }}>
                        <p><strong>Descripción:</strong> {act.descripcion}</p>
                        <p><strong>Duración:</strong> {act.duracion} minutos</p>
                        <p><strong>Cupo:</strong> {act.cupo} personas</p>
                        <p><strong>Categoría:</strong> {act.categoria}</p>
                        <p><strong>Instructor:</strong> {act.instructor}</p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Actividades;
