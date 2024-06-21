import React, { useState, useEffect } from 'react';
import Board from './Board';
import BoardModal from './BoardModal';

function BoardContainer() {
    const [boards, setBoards] = useState([]);
    const [isBoardModalOpen, setBoardModalOpen] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('recent');
    const categories = ['All', 'celebration', 'thankyou', 'inspiration', 'jokes', 'AITA'];

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/boards`)
            .then(response => response.json())
            .then(data => setBoards(data))
            .catch(error => console.error('Error fetching boards:', error));
    };

    const handleOpenModal = () => {
        setBoardModalOpen(true);
    };

    const handleCloseModal = () => {
        setBoardModalOpen(false);
    };

    const handleCreateBoard = (newBoard) => {
        setBoards(prevBoards => [...prevBoards, newBoard]);
        handleCloseModal();
    };

    const handleDeleteBoard = (boardId) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/boards/${boardId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
        })
        .catch(error => console.error('Error deleting board:', error));
    };

    const filteredBoards = boards.filter(board =>
        (categoryFilter === 'All' || board.category === categoryFilter) &&
        (board.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         board.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const sortedBoards = filteredBoards.sort((a, b) => {
        if (sortCriteria === 'recent') {
            return b.id - a.id; // Sort by descending ID for most recent
        } else if (sortCriteria === 'alphabetical') {
            return a.title.localeCompare(b.title); // Sort alphabetically by title
        }
        return 0;
    });

    const boardCards = sortedBoards.map(board => (
        <Board
            key={board.id}
            id={board.id}
            imgUrl={board.imgUrl}
            title={board.title}
            description={board.description}
            author={board.author}
            onDelete={handleDeleteBoard}
        />
    ));

    return (
        <div className='BoardContainer'>
            <input
                type="text"
                placeholder="Search boards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
                    <option value="recent">Most Recent</option>
                    <option value="alphabetical">Alphabetical</option>
                </select>
                {boardCards}
                <button onClick={handleOpenModal}>Create Board</button>
                {isBoardModalOpen && <BoardModal closeModal={handleCloseModal} onCreateBoard={handleCreateBoard} />}
            </div>
        );
    }

    export default BoardContainer;
