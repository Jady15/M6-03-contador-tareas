import React, { useState, useEffect, useMemo } from 'react';
import './ContadorTareas.css';

function ContadorTareas() {
  // Inicializar tareas desde localStorage
  const [tareas, setTareas] = useState(() => {
    try {
      const tareasGuardadas = localStorage.getItem('tareas');
      return tareasGuardadas ? JSON.parse(tareasGuardadas) : [];
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      return [];
    }
  });
  
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [duracion, setDuracion] = useState('');
  const [filtro, setFiltro] = useState('todas');

  // Guardar tareas en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem('tareas', JSON.stringify(tareas));
    } catch (error) {
      console.error('Error al guardar tareas en localStorage:', error);
    }
  }, [tareas]);

  // Calcular tiempo total con useMemo
  const tiempoTotal = useMemo(() => {
    return tareas.reduce((total, tarea) => total + Number(tarea.duracion), 0);
  }, [tareas]);

  // Filtrar tareas con useMemo
  const tareasFiltradas = useMemo(() => {
    return tareas.filter(tarea => {
      if (filtro === 'todas') return true;
      if (filtro === 'mas30') return tarea.duracion > 30;
      return true;
    });
  }, [tareas, filtro]);

  // Agregar una nueva tarea
  const agregarTarea = () => {
    if (nuevaTarea && !isNaN(duracion) && duracion !== '') {
      const nuevaTareaObj = {
        id: Date.now(),
        nombre: nuevaTarea,
        duracion: parseInt(duracion),
        timestamp: Date.now()
      };
      setTareas([...tareas, nuevaTareaObj]);
      setNuevaTarea('');
      setDuracion('');
    } else {
      alert('Por favor, ingrese un nombre y una duración válida.');
    }
  };

  return (
    <div className="contenedor-tareas">
      <h1>Contador de Tareas</h1>
      <div>
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Nombre de la tarea"
        />
        <input
          type="number"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          placeholder="Duración en minutos"
        />
        <button className="boton-agregar" onClick={agregarTarea}>Agregar tarea</button>
      </div>

      <div>
        <label>Filtrar tareas: </label>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option value="todas">Todas</option>
          <option value="mas30">Más de 30 minutos</option>
        </select>
      </div>

      <h2>Tareas</h2>
      <ul>
        {tareasFiltradas.map((tarea) => (
          <li key={tarea.id}>{tarea.nombre}: {tarea.duracion} minutos</li>
        ))}
      </ul>

      <h3>Total de tiempo: {tiempoTotal} minutos</h3>
    </div>
  );
}

export default ContadorTareas;