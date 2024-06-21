import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BoardDetailsHeader from './BoardDetailsHeader'
import CardContainer from './CardContainer';
import Footer from './Footer';

function BoardDetailsScreen() {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    useEffect(() => {
        fetch(`http://localhost:3000/boards/${id}`)
            .then(response => response.json())
            .then(data => setBoard(data))
            .catch(error => console.error('Error fetching board details:', error));
    }, [id]);
    if (!board) {
        return <div>Loading...</div>;
    }
    return (
        <>
            <BoardDetailsHeader board={board} />
            <CardContainer boardId={id} />
            <Footer />
        </>
    );
}
export default BoardDetailsScreen;
