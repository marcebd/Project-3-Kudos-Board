import {useState, useEffect} from 'react';
import Board from './Board';
import BoardModal from './BoardModal';


function BoardContainer() {
    const [boards, setBoards] = useState([]);
    const [isBoardModalOpen, setBoardModalOpen] = useState(false);

    const handleOpenModal = () => {
        setBoardModalOpen(true);
    };
    const handleCloseModal = () => {
        setBoardModalOpen(false);
    };

    //Fetch boards from backend
    useEffect(() => {
        fetchBoards ();
    }, []);
    const fetchBoards = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/boards`)
        .then(response => {
            if(!response.ok) {
                throw new Error(`HTTP error! status: ' ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched boards:', data);
            setBoards(data);
        })
        .catch(error => {
            console.log('Error fetching boards:', error);
        });
    };

//Map the data to Board components
    const boardCards = boards.map(board => {
        return (
            <Board
            imgUrl={board.imgUrl}
            title={board.title}
        />)
    });

    return(
        <div className='BoardContainer'>
            {boardCards}
            <button onClick={handleOpenModal}>Create Board</button>
            {isBoardModalOpen && <BoardModal closeModal={handleCloseModal} />}
        </div>
    )

}

export default BoardContainer;
