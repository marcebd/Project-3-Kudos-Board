import { useState } from 'react';
import { GiphyFetch } from '@giphy/js-fetch-api';

function BoardModal({ closeModal }) {
    const apiKey = import.meta.env.VITE_GIPHY_API_KEY;
    const giphyFetch = new GiphyFetch(apiKey);
    const [imgUrl, setImgUrl] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('celebration');
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

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Board imgUrl:', imgUrl);
        console.log('Board title:', title);
        console.log('Board category:', category);
        closeModal();
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
            <form onSubmit={handleSubmit}>
                <label>
                    Board Name:
                    <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>
                <label>
                    Category:
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Search Giphy Image:
                    <input
                        type='text'
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button onClick={handleSearchSubmit}>Search</button>
                </label>
                {showSelectedImage ? (
                <div>
                    <img
                        src={imgUrl}
                        alt="Selected"
                        style={{ maxWidth: '100%', display: 'block', margin: 'auto' }}
                    />
                </div>
            ) : (
                <div>
                    {images.map((image) => (
                        <img
                            key={image.id}
                            src={image.images.fixed_height.url}
                            alt={image.title}
                            onClick={() => handleImageSelect(image)}
                            style={{ cursor: 'pointer', margin: '10px' }}
                        />
                    ))}
                </div>
            )}
                            <button type='submit'>Submit</button>
                            <button onClick={closeModal}>Cancel</button>
                        </form>
                    </div>
                );
}

export default BoardModal;
