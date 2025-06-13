import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPanel() {
    const [actividades, setActividades] = useState([]);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        cupo: '',
        dia: '',
        horario: '',
        duracion: '',
        categoria: '',
        instructor: '',
        imagen: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const navigate = useNavigate();

    const diasSemana = [
        { value: 'lunes', label: 'Lunes' },
        { value: 'martes', label: 'Martes' },
        { value: 'miercoles', label: 'Miércoles' },
        { value: 'jueves', label: 'Jueves' },
        { value: 'viernes', label: 'Viernes' },
        { value: 'sabado', label: 'Sábado' },
        { value: 'domingo', label: 'Domingo' }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        // Verificar expiración del token
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convertir a milisegundos
        if (Date.now() >= expirationTime) {
            localStorage.removeItem('token');
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            navigate('/');
            return;
        }

        // Verificar si el usuario es administrador
        if (payload.rol !== 'administrador') {
            navigate('/actividades');
            return;
        }

        fetchActividades();
    }, [navigate]);

    const fetchActividades = async () => {
        try {
            const response = await axios.get('http://localhost:8080/actividades');
            setActividades(response.data);
        } catch (error) {
            console.error('Error al obtener actividades:', error);
            alert('Error al cargar las actividades');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Convertir campos numéricos a números
        const dataToSend = {
            ...formData,
            cupo: parseInt(formData.cupo, 10),
            duracion: parseInt(formData.duracion, 10)
        };

        try {
            if (editingId) {
                await axios.put(`http://localhost:8080/actividades/${editingId}`, dataToSend, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:8080/actividades', dataToSend, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            resetForm();
            fetchActividades();
        } catch (error) {
            console.error('Error al guardar actividad:', error);
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
                alert(`Error al guardar la actividad: ${error.response.data.error || 'Error desconocido'}`);
            } else {
                alert('Error al guardar la actividad');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            titulo: '',
            descripcion: '',
            cupo: '',
            dia: '',
            horario: '',
            duracion: '',
            categoria: '',
            instructor: '',
            imagen: ''
        });
        setEditingId(null);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido');
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen no debe superar los 5MB');
            return;
        }

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('imagen', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/actividades/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData(prev => ({ ...prev, imagen: response.data.url }));
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploadingImage(false);
        }
    };

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
                    <h1 style={{ color: '#B22222', margin: 0 }}>Panel de Administración</h1>
                    <button
                        onClick={() => navigate('/actividades')}
                        style={{
                            backgroundColor: '#666',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <span>←</span> Volver a Actividades
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Título:</label>
                        <input
                            type="text"
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Descripción:</label>
                        <textarea
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '100px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Cupo:</label>
                        <input
                            type="number"
                            value={formData.cupo}
                            onChange={(e) => setFormData({ ...formData, cupo: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Día:</label>
                        <select
                            value={formData.dia}
                            onChange={(e) => setFormData({ ...formData, dia: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        >
                            <option value="">Seleccionar día</option>
                            {diasSemana.map((dia) => (
                                <option key={dia.value} value={dia.value}>
                                    {dia.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Horario:</label>
                        <input
                            type="time"
                            value={formData.horario}
                            onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Duración (minutos):</label>
                        <input
                            type="number"
                            value={formData.duracion}
                            onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Categoría:</label>
                        <input
                            type="text"
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Instructor:</label>
                        <input
                            type="text"
                            value={formData.instructor}
                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Imagen de la actividad:</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploadingImage}
                                style={{ flex: 1 }}
                            />
                            {uploadingImage && <span>Subiendo imagen...</span>}
                        </div>
                        {formData.imagen && (
                            <div style={{ marginTop: '10px' }}>
                                <img
                                    src={`http://localhost:8080${formData.imagen}`}
                                    alt="Vista previa"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={uploadingImage}
                        style={{
                            backgroundColor: '#B22222',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {editingId ? 'Actualizar' : 'Crear'} Actividad
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                backgroundColor: '#666',
                                color: 'white',
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginLeft: '10px'
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </form>

                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ marginBottom: '15px' }}>Lista de Actividades</h2>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {actividades.map((actividad) => (
                            <div
                                key={actividad.id}
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '15px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    {actividad.imagen && (
                                        <img
                                            src={`http://localhost:8080${actividad.imagen}`}
                                            alt={actividad.titulo}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    )}
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0' }}>{actividad.titulo}</h3>
                                        <p style={{ margin: '0 0 5px 0' }}>{actividad.descripcion}</p>
                                        <p style={{ margin: '0 0 5px 0' }}><strong>Día:</strong> {actividad.dia}</p>
                                        <p style={{ margin: '0 0 5px 0' }}><strong>Horario:</strong> {actividad.horario}</p>
                                        <p style={{ margin: '0 0 5px 0' }}><strong>Duración:</strong> {actividad.duracion} minutos</p>
                                        <p style={{ margin: '0 0 5px 0' }}><strong>Cupo:</strong> {actividad.cupo}</p>
                                        <p style={{ margin: '0 0 5px 0' }}><strong>Categoría:</strong> {actividad.categoria}</p>
                                        <p style={{ margin: '0 0 5px 0' }}><strong>Instructor:</strong> {actividad.instructor}</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => {
                                            setFormData({
                                                titulo: actividad.titulo,
                                                descripcion: actividad.descripcion,
                                                cupo: actividad.cupo.toString(),
                                                dia: actividad.dia,
                                                horario: actividad.horario,
                                                duracion: actividad.duracion.toString(),
                                                categoria: actividad.categoria,
                                                instructor: actividad.instructor,
                                                imagen: actividad.imagen
                                            });
                                            setEditingId(actividad.id);
                                        }}
                                        style={{
                                            backgroundColor: '#B22222',
                                            color: 'white',
                                            padding: '8px 15px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '10px'
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
                                                try {
                                                    const token = localStorage.getItem('token');
                                                    await axios.delete(`http://localhost:8080/actividades/${actividad.id}`, {
                                                        headers: { Authorization: `Bearer ${token}` }
                                                    });
                                                    fetchActividades();
                                                } catch (error) {
                                                    console.error('Error al eliminar actividad:', error);
                                                    alert('Error al eliminar la actividad');
                                                }
                                            }
                                        }}
                                        style={{
                                            backgroundColor: '#666',
                                            color: 'white',
                                            padding: '8px 15px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel; 
