import React from 'react';
import {useState} from 'react';


function Board({imgUrl, title}) {

    return(
        <div className='board'>
            <img src={imgUrl} className='boardImage'/>
            <h1>{title}</h1>
        </div>
    )

}

export default Board;
