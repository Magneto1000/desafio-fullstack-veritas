import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // Novos estados para a edição
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTasks(data || []);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ title: newTaskTitle }),
    });
    setNewTaskTitle('');
    fetchTasks();
  };

  const moveTask = async (id, newStatus) => {
    await fetch(`${API_URL}?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}?id=${id}`, {
      method: 'DELETE',
    });
    fetchTasks();
  };

  // Bloco de Lógica das Edições
  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) {
      setEditingId(null);
      return;
    }
    await fetch(`${API_URL}?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title: editingText }),
    });
    setEditingId(null);
    fetchTasks();
  };

  const renderColumn = (title, status) => {
    const columnTasks = tasks.filter((task) => task.status === status);
    
    return (
      <div className="column">
        <h2>{title}</h2>
        <div className="task-list">
          {columnTasks.map((task) => (
            <div key={task.id} className="task-card">
              
              {/* Modo de Edição vs Modo de Visualização */}
              {editingId === task.id ? (
                <div className="edit-mode">
                  <input 
                    type="text" 
                    value={editingText} 
                    onChange={(e) => setEditingText(e.target.value)}
                    autoFocus
                  />
                  <button onClick={() => saveEdit(task.id)}>Salvar</button>
                  <button onClick={() => setEditingId(null)} className="delete-btn">Cancelar</button>
                </div>
              ) : (
                <>
                  <p>{task.title}</p>
                  <div className="task-actions">
                    {status !== 'TODO' && (
                      <button onClick={() => moveTask(task.id, getPreviousStatus(status))}>{'<'}</button>
                    )}
                    
                    <button onClick={() => startEditing(task)} style={{ backgroundColor: '#ff9900' }}>Editar</button>
                    <button onClick={() => deleteTask(task.id)} className="delete-btn">X</button>
                    
                    {status !== 'DONE' && (
                      <button onClick={() => moveTask(task.id, getNextStatus(status))}>{'>'}</button>
                    )}
                  </div>
                </>
              )}

            </div>
          ))}
        </div>
      </div>
    );
  };

  const getNextStatus = (status) => status === 'TODO' ? 'DOING' : 'DONE';
  const getPreviousStatus = (status) => status === 'DONE' ? 'DOING' : 'TODO';

  return (
    <div className="kanban-board">
      <h1>Kanban Veritas</h1>
      
      <form onSubmit={addTask} className="add-task-form">
        <input 
          type="text" 
          placeholder="Nova tarefa..." 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button type="submit">Adicionar</button>
      </form>

      <div className="columns-container">
        {renderColumn('A Fazer', 'TODO')}
        {renderColumn('Em Progresso', 'DOING')}
        {renderColumn('Concluídas', 'DONE')}
      </div>
    </div>
  );
}

export default App;