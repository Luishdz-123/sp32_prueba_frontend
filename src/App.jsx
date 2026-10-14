import React, { useState, useEffect } from 'react';

function App() {
  const [mensaje, setMensaje] = useState('');
  const [sucursalMac, setSucursalMac] = useState('');
  const [nombreSucursal, setNombreSucursal] = useState('Cargando sucursal...');

  useEffect(() => {
    // 1. Lee la MAC del parámetro QR de la URL
    const parametros = new URLSearchParams(window.location.search);
    const macDesdeQR = parametros.get('mac') || '9c:cc:01:82:09:60'; // MAC por defecto si no hay QR
    
    setSucursalMac(macDesdeQR);

    // 2. Opcional: Consultar el nombre real de la sucursal desde tu API (o dejar un fallback amigable)
    // Para simplificar y garantizar que funcione al 100% mañana, mapeamos el nombre según la MAC:
    if (macDesdeQR === '9c:cc:01:82:09:60') {
      setNombreSucursal('Sucursal Centro Test');
    } else if (macDesdeQR === '98:c3:77:8f:9e:28') {
      setNombreSucursal('Sucursal Chalco Test');
    } else {
      setNombreSucursal('Sucursal: ' + macDesdeQR);
    }
  }, []);

  const enviarPedido = async (e) => {
    e.preventDefault();
    const respuesta = await fetch('https://pruebasp32.onrender.com/api/orden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        device_id: sucursalMac, // Envía la MAC por detrás para que el ESP32 correcto la reciba
        mensaje: mensaje 
      })
    });

    if (respuesta.ok) {
      alert('¡Pedido enviado con éxito!');
      setMensaje('');
    } else {
      alert('Error al enviar el pedido');
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: 'auto', background: '#1e293b', color: '#fff', borderRadius: '8px', fontFamily: 'sans-serif', marginTop: '50px' }}>
      <h2>Sistema de Pedidos - Cocina</h2>
      <h3 style={{ color: '#10b981', marginBottom: '20px' }}>📍 {nombreSucursal}</h3>
      <form onSubmit={enviarPedido}>
        <textarea 
          rows="4" 
          value={mensaje} 
          onChange={(e) => setMensaje(e.target.value)} 
          placeholder="Escribe el pedido (ej. 2 Tortas ahogadas)..." 
          required 
          style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
        ></textarea><br/>
        <button type="submit" style={{ width: '100%', padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          Enviar a Cocina
        </button>
      </form>
    </div>
  );
}

export default App;
