import {useState, useEffect} from 'react';
import Board from './Board';


function BoardContainer() {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        fetchBoards ();
    }, []);

    const fetchBoards = () => {
        fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/boards'`)
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

    return(
        <div className='BoardContainer'>
            <Board />
        </div>
    )

}

export default BoardContainer;
