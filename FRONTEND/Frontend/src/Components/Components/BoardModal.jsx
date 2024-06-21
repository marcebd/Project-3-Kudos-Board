import { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import './BoardContainer.css'

function BoardModal({ closeModal, onCreateBoard }) {
    const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
    const giphyFetch = new GiphyFetch(apiKey);
    const [imgUrl, setImgUrl] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('celebration');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [images, setImages] = useState([]);
    const [showSelectedImage, setShowSelectedImage] = useState(false);

    const categories = [
        { label: 'Celebration', value: 'celebration' },
        { label: 'Thank You', value: 'thankyou' },
        { label: 'Inspiration', value: 'inspiration' },
        { label: 'Jokes', value: 'jokes' },
        { label: 'AITA', value: 'AITA' }
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_ADDRESS}/boards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    imgUrl,
                    title,
                    category,
                    description,
                    author
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const newBoard = await response.json();
            console.log('Board created:', newBoard);
            onCreateBoard(newBoard);
            closeModal();
        } catch (error) {
            console.error('Error creating board:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchGiphyImages(searchTerm, true);
    };

    const fetchGiphyImages = async (searchTerm, newSearch = false) => {
        try {
            const { data } = await giphyFetch.search(searchTerm, { limit: 10 });
            setImages(data);
            setShowSelectedImage(false);
        } catch (error) {
            console.error('Error fetching Giphy images:', error);
        }
    };

    const handleImageSelect = (image) => {
        setImgUrl(image.images.fixed_height.url);
        setShowSelectedImage(true);
    };

    return (
        <div className='modal'>
        <form onSubmit={handleSubmit} className="modalForm">
            <label className="titleLabel">
                Board Name:
                <input
                    type='text'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="titleInput"
                />
            </label>
            <label className="categoryLabel">
                Category:
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="categorySelect">
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </label>
            <label className="descriptionLabel">
                Description:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter a description for the board"
                    className="messageTextarea"
                />
            </label>
            <label className="authorLabel">
                Author:
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter the author's name"
                    className="creatorInput"
                />
            </label>
            <label className="searchLabel">
                Search Giphy Image:
                <input
                    type='text'
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="searchInput"
                />
                <button onClick={handleSearchSubmit} className="searchButton">Search</button>
            </label>
            <div className="gifContainer">
                {showSelectedImage ? (
                    <div className="selectedGifContainer">
                        <img
                            src={imgUrl}
                            alt="Selected"
                            className="selectedGif"
                        />
                    </div>
                ) : (
                    <div className="imagesDisplay">
                        {images.map((image) => (
                            <img
                                key={image.id}
                                src={image.images.fixed_height.url}
                                alt={image.title}
                                onClick={() => handleImageSelect(image)}
                                className="gifImage"
                            />
                        ))}
                    </div>
                )}
            </div>
            <button type='submit' className="createCardButton">Submit</button>
            <button onClick={closeModal} className="cancelButton">Cancel</button>
        </form>
    </div>
    );
}

export default BoardModal;
