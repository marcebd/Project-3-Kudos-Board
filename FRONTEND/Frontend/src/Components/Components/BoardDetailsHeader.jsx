import React from 'react';

function BoardDetailsHeader({ board }) {
    return (
        <div>
            <img src={board.imgUrl} alt={board.title} className='boardImage' />
            <h1>{board.title}</h1>
            <h2>{board.description}</h2>
            <p>Category: {board.category}</p>
        </div>
    );
}

export default BoardDetailsHeader;
