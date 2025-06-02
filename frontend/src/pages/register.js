import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ nombre: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/register', form);
      alert('Usuario registrado correctamente');
    } catch (err) {
      alert('Error al registrar');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrarse</h2>
      <input name="nombre" onChange={handleChange} placeholder="Nombre" required />
      <input name="email" type="email" onChange={handleChange} placeholder="Email" required />
      <input name="password" type="password" onChange={handleChange} placeholder="Contraseña" required />
      <button type="submit">Registrarme</button>
    </form>
  );
}

export default Register;