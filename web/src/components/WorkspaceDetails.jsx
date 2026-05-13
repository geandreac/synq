import { useState, useEffect } from 'react';
import { api } from '../services/api';
import KanbanView from './KanbanView';
import './WorkspaceDetails.css';

const WorkspaceDetails = ({ workspace, onBack }) => {
  const [members, setMembers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('boards'); // 'boards' or 'members'
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState(null);
  const [newBoardName, setNewBoardName] = useState('');
  const [selectedBoard, setSelectedBoard] = useState(null);

  useEffect(() => {
    fetchData();
  }, [workspace.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [membersData, boardsData] = await Promise.all([
        api.workspaces.listMembers(workspace.id),
        api.boards.listByWorkspace(workspace.id)
      ]);
      setMembers(membersData.members);
      setBoards(boardsData.boards);
    } catch (err) {
      console.error('Erro ao buscar dados do workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      await api.boards.create(newBoardName, workspace.id);
      setNewBoardName('');
      fetchData();
    } catch (err) {
      alert('Erro ao criar quadro');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteStatus({ type: 'info', message: 'Convidando...' });
    try {
      await api.workspaces.inviteMember(workspace.id, inviteEmail);
      setInviteStatus({ type: 'success', message: 'Membro convidado com sucesso!' });
      setInviteEmail('');
      fetchMembers();
    } catch (err) {
      setInviteStatus({ type: 'error', message: err.message });
    }
  };

  if (selectedBoard) {
    return (
        <KanbanView 
            board={selectedBoard} 
            onBack={() => setSelectedBoard(null)} 
        />
    );
  }

  return (
    <div className="workspace-details">
      <header className="details-header">
        <button onClick={onBack} className="btn-back">← VOLTAR</button>
        <h2>{workspace.name}</h2>
      </header>

      <nav className="details-tabs">
        <button 
            className={activeTab === 'boards' ? 'active' : ''} 
            onClick={() => setActiveTab('boards')}
        >
            QUADROS (KANBAN)
        </button>
        <button 
            className={activeTab === 'members' ? 'active' : ''} 
            onClick={() => setActiveTab('members')}
        >
            MEMBROS
        </button>
      </nav>

      {activeTab === 'boards' ? (
        <section className="boards-section">
            <div className="section-title-row">
                <h3>Fluxos de Trabalho</h3>
                <form onSubmit={handleCreateBoard} className="invite-form">
                    <input 
                        type="text" 
                        placeholder="nome do quadro" 
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-accent">CRIAR QUADRO</button>
                </form>
            </div>

            <div className="board-grid">
                {boards.map(board => (
                    <div key={board.id} className="board-mini-card">
                        <h4>{board.name}</h4>
                        <button 
                            className="btn-open-board"
                            onClick={() => setSelectedBoard(board)}
                        >
                            VISUALIZAR
                        </button>
                    </div>
                ))}
                {boards.length === 0 && (
                    <div className="empty-state">Nenhum quadro criado neste workspace.</div>
                )}
            </div>
        </section>
      ) : (
        <section className="members-section">
            <div className="section-title-row">
                <h3>Equipe Colaborativa</h3>
                <form onSubmit={handleInvite} className="invite-form">
                    <input 
                        type="email" 
                        placeholder="e-mail do colaborador" 
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-accent">CONVIDAR</button>
                </form>
            </div>
            
            {inviteStatus && (
                <div className={`status-msg ${inviteStatus.type}`}>
                    {inviteStatus.message}
                </div>
            )}

            {loading ? (
              <p>Carregando membros...</p>
            ) : (
              <table className="members-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Cargo</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.email}</td>
                      <td><span className={`badge ${member.role.toLowerCase()}`}>{member.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </section>
      )}
    </div>
  );
};

export default WorkspaceDetails;
