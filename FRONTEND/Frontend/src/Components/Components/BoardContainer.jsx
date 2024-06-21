import { useState, useEffect } from 'react';
import Board from './Board';
import BoardModal from './BoardModal';

function BoardContainer() {
    const [boards, setBoards] = useState([]);
    const [isBoardModalOpen, setBoardModalOpen] = useState(false);

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
        .catch(error => {
            console.error('Error deleting board:', error);
        });
    };

    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/boards`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setBoards(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching boards:', error);
            });
    };

    const boardCards = boards.map(board => (
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
            {boardCards}
            <button onClick={handleOpenModal}>Create Board</button>
            {isBoardModalOpen && <BoardModal closeModal={handleCloseModal} onCreateBoard={handleCreateBoard} />}
        </div>
    );
}

export default BoardContainer;
