import React from 'react';
import './Board.css'
import { useNavigate } from 'react-router-dom';
function Board({ id, imgUrl, title, description, author, onDelete }) {
    const navigate = useNavigate();
    const handleBoardClick = () => {
        navigate(`/boards/${id}`);
    };
    return (
        <div className='board'>
            <div className='boardInformation' onClick={handleBoardClick}>
                <img src={imgUrl} alt={title} className='boardImag' />
                <h1>{title}</h1>
                <p className='description'>{description}</p>
                <p className='author'>{author}</p>
            </div>
            <button onClick={() => onDelete(id)} className='delBoard'>Delete Board</button>
        </div>
    );
}

export default Board;
