import React, { useState, useEffect } from 'react';
import Card from './Card';
import CardModal from './CardModal';

function CardContainer({ boardId }) {
    const [cards, setCards] = useState([]);
    const [sortedCards, setSortedCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortCriteria, setSortCriteria] = useState('upvotes');

    useEffect(() => {
        fetchCards();
    }, [boardId]);

    useEffect(() => {
        const sorted = [...cards].sort((a, b) => {
            if (sortCriteria === 'upvotes') {
                return b.upvotes - a.upvotes;
            } else if (sortCriteria === 'alphabetical') {
                return a.title.localeCompare(b.title);
            }
            return 0;
        });
        setSortedCards(sorted);
    }, [cards, sortCriteria]);
    const fetchCards = () => {
        fetch(`http://localhost:3000/boards/${boardId}/cards`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const cardsWithNumericUpvotes = data.cards.map(card => ({
                    ...card,
                    upvotes: Number(card.upvotes)
                }));
                setCards(cardsWithNumericUpvotes);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching cards:', error);
                setError(error.message);
                setLoading(false);
            });
    };

    const handleCreateCard = (newCard) => {
        setCards(prevCards => {
            const updatedCards = [...prevCards, newCard];
            return updatedCards.sort((a, b) => {
                if (sortCriteria === 'upvotes') {
                    return b.upvotes - a.upvotes;
                } else if (sortCriteria === 'alphabetical') {
                    return a.title.localeCompare(b.title);
                }
                return 0;
            });
        });
    };

    const handleDeleteCard = (cardId) => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/cards/${cardId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            setCards(prevCards => prevCards.filter(card => card.id !== cardId));
        })
        .catch(error => {
            console.error('Error deleting card:', error);
        });
    };

    const handleUpvoteChange = (cardId, newUpvotes) => {
        setCards(cards => cards.map(card => {
            if (card.id === cardId) {
                return { ...card, upvotes: newUpvotes };
            }
            return card;
        }));
    };
    const cardElements = sortedCards.map(card => (
        <Card
            key={card.id}
            id={card.id}
            title={card.title}
            message={card.message}
            creator={card.creator}
            GIFUrl={card.GIFUrl}
            upvotes={card.upvotes}
            onDelete={handleDeleteCard}
            onUpvote={handleUpvoteChange}
        />
    ));

    if (loading) return <div>Loading cards...</div>;
    if (error) return <div>Error fetching cards: {error}</div>;

    return (
        <div className='cardContainer'>
            <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
                <option value="upvotes">Upvotes</option>
                <option value="alphabetical">Alphabetically</option>
            </select>
            <button onClick={() => setIsModalOpen(true)}>Create Card</button>
            {isModalOpen && (
                <CardModal
                    boardId={boardId}
                    onClose={() => setIsModalOpen(false)}
                    onCreateCard={handleCreateCard}
                />
            )}
            {cardElements}
        </div>
    );
}

export default CardContainer;
