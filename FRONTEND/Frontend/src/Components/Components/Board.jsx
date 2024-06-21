import React from 'react';
import { useNavigate } from 'react-router-dom';
function Board({ id, imgUrl, title, description, author, onDelete }) {
    const navigate = useNavigate();
    const handleBoardClick = () => {
        navigate(`/boards/${id}`);
    };
    return (
        <div className='board'>
            <div className='boardInformation' onClick={handleBoardClick}>
                <img src={imgUrl} alt={title} className='boardImage' />
                <h1>{title}</h1>
                <p>{description}</p>
                <p>{author}</p>
            </div>
            <button onClick={() => onDelete(id)}>Delete Board</button>
        </div>
    );
}

export default Board;
