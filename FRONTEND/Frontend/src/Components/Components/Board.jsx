import React from 'react';

function Board({ id, imgUrl, title, description, author, onDelete }) {
    return (
        <div className='board'>
            <div className='boardInformation'>
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
