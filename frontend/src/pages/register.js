import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'admin'
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/register', form);
      alert('Usuario registrado correctamente');
      navigate('/');
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/fondo.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '30px',
          borderRadius: '10px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Registrarse</h2>
        <input
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          required
          style={{ marginBottom: '10px', padding: '10px' }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={{ marginBottom: '10px', padding: '10px' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
          style={{ marginBottom: '10px', padding: '10px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#B22222',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          Registrarme
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            padding: '10px',
            backgroundColor: '#888',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ⬅ Volver
        </button>
      </form>
    </div>
  );
}

export default Register;
