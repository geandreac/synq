import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import WorkspaceDetails from './WorkspaceDetails';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const data = await api.workspaces.list();
      setWorkspaces(data.workspaces);
    } catch (err) {
      console.error('Failed to fetch workspaces');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    try {
      await api.workspaces.create(newWorkspaceName);
      setNewWorkspaceName('');
      setIsModalOpen(false);
      fetchWorkspaces();
    } catch (err) {
      alert('Erro ao criar workspace');
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">SYNQ</div>
        <nav className="sidebar-nav">
          <button className="nav-item active">Workspaces</button>
          <button className="nav-item">Calendário</button>
          <button className="nav-item">Configurações</button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user?.name || 'Usuário'}</span>
          </div>
          <button onClick={logout} className="btn-logout">Sair</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {selectedWorkspace ? (
          <WorkspaceDetails 
            workspace={selectedWorkspace} 
            onBack={() => setSelectedWorkspace(null)} 
          />
        ) : (
          <>
            <header className="main-header">
              <h2>Seus Workspaces</h2>
              <button onClick={() => setIsModalOpen(true)} className="btn-create">
                + NOVO WORKSPACE
              </button>
            </header>

            {loading ? (
              <div className="loading-state">Carregando...</div>
            ) : (
              <div className="workspace-grid">
                {workspaces.map(ws => (
                  <div key={ws.id} className="workspace-card">
                    <h3>{ws.name}</h3>
                    <p>Criado em {new Date(ws.createdAt).toLocaleDateString()}</p>
                    <button 
                        className="btn-open"
                        onClick={() => setSelectedWorkspace(ws)}
                    >
                        ABRIR WORKSPACE
                    </button>
                  </div>
                ))}
                {workspaces.length === 0 && (
                  <div className="empty-state">
                    Nenhum workspace encontrado. Crie um para começar.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal Criar Workspace */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Novo Workspace</h3>
            <form onSubmit={handleCreateWorkspace}>
              <input 
                type="text" 
                placeholder="Nome do Workspace"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                required
                autoFocus
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-primary">Criar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
