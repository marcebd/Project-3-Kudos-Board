import React from 'react';
import './BoardDetailsHeader.css'
function BoardDetailsHeader({ board }) {
    return (
        <div className='BoardDetailsHeader'>
            <img src={board.imgUrl} alt={board.title} className='boardImage' />
            <div className='boardInfo'>
                <h1 className='boardTitle'>{board.title}</h1>
                <h2 className='boardDescription'>{board.description}</h2>
                <p className='category'>Category: {board.category}</p>
            </div>
        </div>
    );
}

export default BoardDetailsHeader;
