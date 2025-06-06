import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/actividades', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/login', {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      alert('Login exitoso');
      navigate('/actividades', { replace: true });
    } catch (err) {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div
      style={{
        backgroundImage: "url('/fondo.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0px 0px 10px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '350px'
        }}
      >
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Iniciar sesión</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          style={{ display: 'block', marginBottom: '10px', width: '100%', padding: '8px' }}
        />

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#B22222',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Ingresar
        </button>

        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <Link to="/register" style={{ color: '#B22222' }}>
            ¿No tenés cuenta? Registrate acá
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
