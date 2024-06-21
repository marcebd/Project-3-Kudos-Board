import React, { useState, useEffect } from 'react';
import Card from './Card';
import CardModal from './CardModal';

function CardContainer({ boardId }) {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        fetchCards();
    }, [boardId]);

    const fetchCards = () => {
        fetch(`http://localhost:3000/boards/${boardId}/cards`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCards(data.cards);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
                setError(error.message);
                setLoading(false);
            });
    };

    const handleCreateCard = (newCard) => {
        setCards(prevCards => [...prevCards, newCard]);
    }

    if (loading) return <div>Loading cards...</div>;
    if (error) return <div>Error fetching cards: {error}</div>;

    return (
        <div className='cardContainer'>
            <button onClick={() => setIsModalOpen(true)}>CreateCard</button>
            {isModalOpen && (
                <CardModal
                    boardId={boardId}
                    onClose={() => setIsModalOpen(false)}
                    onCreateCard={handleCreateCard}
                />
            )}
            {cards.map(card => (
                <Card
                    key={card.id}
                    title={card.title}
                    message={card.message}
                    creator={card.creator}
                    GIFUrl={card.GIFUrl}
                />
            ))}
        </div>
    );
}

export default CardContainer;
