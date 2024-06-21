import {useState} from 'react';


function Card({title, message, creator, GIFUrl, id, onDelete}) {
    return(
        <div className='card'>
            <h3>{title}</h3>
            <p>{message}</p>
            <p>Creator: {creator}</p>
            {GIFUrl && <img src={GIFUrl} alt={title} />}
            <button onClick={() => onDelete(id)}>Delete Card</button>
        </div>
    )

}

export default Card;
