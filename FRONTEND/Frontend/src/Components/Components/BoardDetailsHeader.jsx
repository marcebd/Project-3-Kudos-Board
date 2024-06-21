import React from 'react';

function BoardDetailsHeader({ board }) {
    return (
        <div>
            <h1>{board.title}</h1>
            <p>{board.description}</p>
            <p>Category: {board.category}</p>
        </div>
    );
}

export default BoardDetailsHeader;
