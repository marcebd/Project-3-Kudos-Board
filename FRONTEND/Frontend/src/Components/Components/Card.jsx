import { useState, useEffect } from 'react';

function Card({ title, message, creator, GIFUrl, id, onDelete, upvotes: initialUpvotes }) {
    const [upvotes, setUpvotes] = useState(initialUpvotes || 0);

    useEffect(() => {
        fetch(`http://localhost:3000/cards/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.upvotes) {
                    setUpvotes(data.upvotes);
                }
            })
            .catch(error => console.error('Error fetching card details:', error));
    }, [id]);

    const handleUpvote = () => {
        fetch(`http://localhost:3000/cards/${id}/upvote`, {
            method: 'PATCH'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setUpvotes(data.upvotes);
        })
        .catch(error => console.error('Error updating upvotes:', error));
    };

    return (
        <div className='card'>
            <div className='cardInfo'>
                <h3>{title}</h3>
                <p>{message}</p>
                <p>Creator: {creator}</p>
                {GIFUrl && <img src={GIFUrl} alt={title} />}
                <p>Likes: {upvotes}</p>
            </div>
            <button onClick={() => onDelete(id)}>Delete Card</button>
            <button onClick={handleUpvote}>Like</button>
        </div>
    );
}

export default Card;
