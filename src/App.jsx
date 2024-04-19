import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const App = () => {
  const [notification, setNotification] = useState(null);
  const [socket, setSocket] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cantidad: '',
    producto: '',
    telefono: ''
  });

  useEffect(() => {
    const newSocket = new WebSocket('ws://44.195.122.178:4000');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log('Conexión WebSocket establecida correctamente');
    };

    newSocket.onmessage = handleWebSocketMessage;

    window.addEventListener('beforeunload', handleCloseWebSocket);

    return () => {
      handleCloseWebSocket();
      window.removeEventListener('beforeunload', handleCloseWebSocket);
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEnviarPagos = async () => {
    try {
      const response = await axios.post('http://44.223.213.83:3001/pagos', formData);
      console.log('Pago enviado correctamente:', response.data);
      setNotification({
        message: `Hola ${formData.nombre}, tu pago por el producto ${formData.producto} ha sido realizado`
      });
      setTimeout(() => {
        setNotification(null);
      }, 10000);
    } catch (error) {
      console.error('Error al enviar el pago:', error);
    }
  };

  const handleWebSocketMessage = (event) => {
    const data = JSON.parse(event.data);
    setNotification(data);

    setTimeout(() => {
      setNotification(null);
    }, 10000);
  };

  const handleCloseWebSocket = () => {
    if (socket) {
      socket.close();
    }
  };

  return (
    <div className="app-container">
      <h1>Realizar Pago de producto</h1>
      {notification && (
        <div className="notification">
          {notification.message}
        </div>
      )}
      <div className="pagos-form">
        <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} />
        <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleInputChange} />
        <input type="text" name="cantidad" placeholder="Cantidad" value={formData.cantidad} onChange={handleInputChange} />
        <input type="text" name="producto" placeholder="Producto" value={formData.producto} onChange={handleInputChange} />
        <input type="text" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleInputChange} />
        <button onClick={handleEnviarPagos}>Enviar</button>
      </div>
    </div>
  );
};

export default App;
