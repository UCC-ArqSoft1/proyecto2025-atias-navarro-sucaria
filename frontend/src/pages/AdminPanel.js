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
        instructor: ''
    });
    const [editingId, setEditingId] = useState(null);
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

        // Verificar si el usuario es administrador
        const payload = JSON.parse(atob(token.split('.')[1]));
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
            instructor: ''
        });
        setEditingId(null);
    };

    const handleEdit = (actividad) => {
        setFormData({
            titulo: actividad.titulo,
            descripcion: actividad.descripcion,
            cupo: actividad.cupo.toString(),
            dia: actividad.dia,
            horario: actividad.horario,
            duracion: actividad.duracion.toString(),
            categoria: actividad.categoria,
            instructor: actividad.instructor
        });
        setEditingId(actividad.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
            return;
        }

        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8080/actividades/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchActividades();
        } catch (error) {
            console.error('Error al eliminar actividad:', error);
            alert('Error al eliminar la actividad');
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
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

            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2 style={{ margin: 0 }}>{editingId ? 'Editar Actividad' : 'Nueva Actividad'}</h2>
                    {editingId && (
                        <button
                            onClick={resetForm}
                            style={{
                                backgroundColor: '#666',
                                color: 'white',
                                padding: '8px 15px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Cancelar Edición
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Título"
                            value={formData.titulo}
                            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <textarea
                            placeholder="Descripción"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px', minHeight: '100px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="number"
                            placeholder="Cupo"
                            value={formData.cupo}
                            onChange={(e) => setFormData({ ...formData, cupo: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <select
                            value={formData.dia}
                            onChange={(e) => setFormData({ ...formData, dia: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        >
                            <option value="">Seleccione un día</option>
                            {diasSemana.map(dia => (
                                <option key={dia.value} value={dia.value}>
                                    {dia.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="time"
                            value={formData.horario}
                            onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="number"
                            placeholder="Duración (en minutos)"
                            value={formData.duracion}
                            onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                            required
                            min="1"
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Categoría"
                            value={formData.categoria}
                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Instructor"
                            value={formData.instructor}
                            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                            required
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                    </div>
                    <button
                        type="submit"
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
                </form>
            </div>

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
                            <div>
                                <button
                                    onClick={() => handleEdit(actividad)}
                                    style={{
                                        backgroundColor: '#4CAF50',
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
                                    onClick={() => handleDelete(actividad.id)}
                                    style={{
                                        backgroundColor: '#f44336',
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
    );
}

export default AdminPanel; 