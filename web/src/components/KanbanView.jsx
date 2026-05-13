import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { api } from '../services/api';
import './KanbanView.css';

const KanbanView = ({ board, onBack }) => {
  const [columns, setColumns] = useState(board.lists || []);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [addingCardToList, setAddingCardToList] = useState(null); 
  const [newCardTitle, setNewCardTitle] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const handleUpdateCard = async (cardId, updates) => {
    try {
        await api.cards.update(cardId, updates);
        setColumns(columns.map(col => ({
            ...col,
            cards: col.cards.map(c => c.id === cardId ? { ...c, ...updates } : c)
        })));
        if (selectedCard?.id === cardId) {
            setSelectedCard({ ...selectedCard, ...updates });
        }
    } catch (err) {
        console.error('Erro ao atualizar cartão:', err);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = columns.find(c => c.id === source.droppableId);
    const destCol = columns.find(c => c.id === destination.droppableId);

    if (sourceCol === destCol) {
        const newCards = Array.from(sourceCol.cards);
        const [removed] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, removed);

        const orderedCards = newCards.map((c, i) => ({ ...c, order: i }));
        
        const newColumns = columns.map(col => 
            col.id === sourceCol.id ? { ...col, cards: orderedCards } : col
        );
        setColumns(newColumns);

        await api.cards.update(draggableId, { order: destination.index });
    } else {
        const sourceCards = Array.from(sourceCol.cards);
        const [removed] = sourceCards.splice(source.index, 1);
        
        const destCards = Array.from(destCol.cards);
        destCards.splice(destination.index, 0, removed);

        const newColumns = columns.map(col => {
            if (col.id === sourceCol.id) return { ...col, cards: sourceCards.map((c, i) => ({ ...c, order: i })) };
            if (col.id === destCol.id) return { ...col, cards: destCards.map((c, i) => ({ ...c, order: i })) };
            return col;
        });

        setColumns(newColumns);

        await api.cards.update(draggableId, { 
            listId: destination.droppableId, 
            order: destination.index 
        });
    }
  };

  const handleAddColumn = async (e) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;

    try {
        const response = await api.lists.create(newColumnName, board.id, columns.length);
        const newColumn = {
            ...response.list,
            cards: []
        };
        setColumns([...columns, newColumn]);
        setNewColumnName('');
        setIsAddingColumn(false);
    } catch (err) {
        alert('Erro ao criar coluna');
    }
  };

  const handleAddCard = async (e, listId) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
        const column = columns.find(c => c.id === listId);
        const order = (column.cards || []).length;
        const response = await api.cards.create(newCardTitle, listId, order);
        
        const updatedColumns = columns.map(col => {
            if (col.id === listId) {
                return {
                    ...col,
                    cards: [...(col.cards || []), response.card]
                };
            }
            return col;
        });

        setColumns(updatedColumns);
        setNewCardTitle('');
        setAddingCardToList(null);
    } catch (err) {
        alert('Erro ao criar cartão');
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-container">
        <header className="kanban-header">
          <button onClick={onBack} className="btn-back">← VOLTAR AO WORKSPACE</button>
          <h2>{board.name}</h2>
          <div className="kanban-actions">
              {!isAddingColumn ? (
                  <button 
                      className="btn-accent"
                      onClick={() => setIsAddingColumn(true)}
                  >+ NOVA COLUNA</button>
              ) : (
                  <form onSubmit={handleAddColumn} className="inline-form">
                      <input 
                          autoFocus
                          type="text" 
                          placeholder="Nome da coluna..." 
                          value={newColumnName}
                          onChange={(e) => setNewColumnName(e.target.value)}
                      />
                      <button type="submit" className="btn-save">SALVAR</button>
                      <button type="button" className="btn-cancel" onClick={() => setIsAddingColumn(false)}>✖</button>
                  </form>
              )}
          </div>
        </header>

        <div className="kanban-board">
          {columns.map(column => (
            <div key={column.id} className="kanban-column">
              <div className="column-header">
                <h3>{column.name}</h3>
                <button className="btn-dots">⋮</button>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div 
                    className="cards-container"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {column.cards && column.cards.sort((a,b) => a.order - b.order).map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <div 
                            className="kanban-card"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => setSelectedCard(card)}
                          >
                            <p className="card-title">{card.title}</p>
                            {card.dueDate && (
                                <span className="card-due-date">
                                    📅 {new Date(card.dueDate).toLocaleDateString()}
                                </span>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {addingCardToList === column.id ? (
                      <form onSubmit={(e) => handleAddCard(e, column.id)} className="card-form">
                          <textarea 
                              autoFocus
                              placeholder="Título do card..."
                              value={newCardTitle}
                              onChange={(e) => setNewCardTitle(e.target.value)}
                          />
                          <div className="form-actions">
                              <button type="submit" className="btn-save">ADICIONAR</button>
                              <button type="button" className="btn-cancel" onClick={() => setAddingCardToList(null)}>✖</button>
                          </div>
                      </form>
                    ) : (
                      <button 
                          className="btn-add-card"
                          onClick={() => setAddingCardToList(column.id)}
                      >+ ADICIONAR CARD</button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
          {columns.length === 0 && !isAddingColumn && (
              <div className="empty-board">
                  <p>Nenhuma coluna neste quadro.</p>
                  <button className="btn-accent" onClick={() => setIsAddingColumn(true)}>CRIAR PRIMEIRA COLUNA</button>
              </div>
          )}
        </div>
      </div>

      {/* Modal de Edição Editorial */}
      {selectedCard && (
          <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
              <div className="modal-content editorial-modal glass" onClick={e => e.stopPropagation()}>
                  <button className="modal-close" onClick={() => setSelectedCard(null)}>✖</button>
                  
                  <header className="modal-header">
                      <input 
                          className="editable-title"
                          value={selectedCard.title}
                          onChange={(e) => handleUpdateCard(selectedCard.id, { title: e.target.value })}
                      />
                      <div className="modal-meta">
                          <span className="meta-item">STATUS: <b>{columns.find(c => c.cards.some(card => card.id === selectedCard.id))?.name}</b></span>
                          <span className="meta-item">CRIADO EM: <b>{new Date(selectedCard.createdAt || Date.now()).toLocaleDateString()}</b></span>
                      </div>
                  </header>

                  <main className="modal-body">
                      <section className="modal-section">
                          <h4>DESCRIÇÃO</h4>
                          <textarea 
                              placeholder="Adicione uma descrição detalhada para este cartão..."
                              value={selectedCard.description || ''}
                              onChange={(e) => handleUpdateCard(selectedCard.id, { description: e.target.value })}
                          />
                      </section>
                  </main>

                  <footer className="modal-footer">
                      <button className="btn-delete" onClick={() => {
                          if(confirm('Deseja excluir este cartão?')) {
                              // Implementar exclusão
                              setSelectedCard(null);
                          }
                      }}>EXCLUIR CARTÃO</button>
                  </footer>
              </div>
          </div>
      )}
    </DragDropContext>
  );
};

export default KanbanView;
