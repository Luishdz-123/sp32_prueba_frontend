import React, { useState, useEffect } from 'react';

function App() {
  const [mensaje, setMensaje] = useState('');
  const [sucursal, setSucursal] = useState('');

  // Esto "lee" el código QR cuando abres la página
  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    const macDesdeQR = parametros.get('mac');
    
    if (macDesdeQR) {
      setSucursal(macDesdeQR); // Usa la MAC del QR que escaneaste
    } else {
      setSucursal('9c:cc:01:82:09:60'); // MAC de prueba por si entras sin QR
    }
  }, []);

  const enviarPedido = async (e) => {
    e.preventDefault();
    const respuesta = await fetch('https://pruebasp32.onrender.com/api/orden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        device_id: sucursal,
        mensaje: mensaje 
      })
    });

    if (respuesta.ok) {
      alert('¡Pedido enviado!');
      setMensaje('');
    } else {
      alert('Error al enviar el pedido');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: 'auto', background: '#1e293b', color: '#fff', borderRadius: '8px' }}>
      <h2>Sistema de Pedidos</h2>
      <p style={{ color: '#10b981' }}>Enviando a MAC: {sucursal}</p>
      <form onSubmit={enviarPedido}>
        <textarea 
          rows="4" 
          value={mensaje} 
          onChange={(e) => setMensaje(e.target.value)} 
          placeholder="Escribe el pedido aquí..." 
          required 
          style={{ width: '100%', padding: '8px', margin: '10px 0' }}
        ></textarea><br/>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#10b981', color: '#fff', border: 'none' }}>
          Enviar a Cocina
        </button>
      </form>
    </div>
  );
}

export default App;