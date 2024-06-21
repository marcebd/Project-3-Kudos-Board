import {useState, useEffect} from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';

function CardModal({boardId, onClose, onCreateCard}) {
    const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
    const giphyFetch = new GiphyFetch(apiKey);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [creator, setCreator] = useState('');
    const [GIFUrl, setGIFUrl] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [gifs, setGifs] = useState([]);
    const [offset, setOffset] = useState(0);
    const limit = 10;

    const fetchGifs = async () => {
        const {data} = await giphyFetch.search(searchTerm, {offset, limit});
        if(offset === 0){
            setGifs(data);
        } else {
            setGifs(prev => [...prev, ...data]);
        }
    };

    useEffect(() => {
        if(searchTerm){
            fetchGifs();
        }
    }, [searchTerm, offset]);

    const handleScroll = (event) => {
        const {scrollTop, clienHeight, scrollHeight} = event.currentTarget;
        if(scrollHeight - scrollTop == clienHeight){
            setOffset(prevOffset => prevOffset + limit);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetch(`http://localhost:3000/boards/${boardId}/cards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, message, creator, GIFUrl, boardId })
        })
        .then(response => response.json())
        .then(data => {
            onCreateCard(data);
            onClose();
        })
        .catch(error => console.error('Error creating card:', error));
    };

    return (
        <div className='modal'>
            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter card title"
                        aria-label="Card Title"
                    />
                </label>
                <label>
                    Message:
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder='Enter card message'
                        aria-label="Card Message"
                    />
                </label>
                <label>
                    Creator:
                    <input
                        type="text"
                        value={creator}
                        onChange={(e) => setCreator(e.target.value)}
                        placeholder="Enter creator's name"
                        aria-label="Creator's Name"
                    />
                </label>
                <label>
                    Search Giphy Image:
                    <input
                        type='text'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        aria-label="Search Giphy Image"
                    />
                    <button type='button' onClick={fetchGifs}>Search</button>
                </label>
                <div onScroll={handleScroll} style={{ overflowY: 'auto', height: '400px' }}>
                    {gifs.map(gif => (
                        <img
                            key={gif.id}
                            src={gif.images.fixed_height.url}
                            alt={gif.title}
                            onClick={() => setGIFUrl(gif.images.fixed_height.url)}
                            style={{ cursor: 'pointer', margin: '10px' }}
                        />
                    ))}
                </div>
                {GIFUrl && (
                    <div>
                        <img src={GIFUrl} alt="Selected GIF" style={{ maxWidth: '100%', display: 'block', margin: 'auto' }} />
                    </div>
                )}
                <button type='submit'>Create Card</button>
                <button type='button' onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
}

export default CardModal;
