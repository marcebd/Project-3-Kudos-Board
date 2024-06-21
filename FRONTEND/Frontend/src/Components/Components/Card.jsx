import {useState} from 'react';


function Card({title, message, creator, GIFUrl}) {

    return(
        <div className='card'>
            <h3>{title}</h3>
            <p>{message}</p>
            <p>Creator: {creator}</p>
            {GIFUrl && <img src={GIFUrl} alt={title} />}
        </div>
    )

}

export default Card;
