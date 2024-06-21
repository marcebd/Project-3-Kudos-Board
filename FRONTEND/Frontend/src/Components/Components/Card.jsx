import { useState, useEffect } from 'react';

function Card({ title, message, creator, GIFUrl, id, onDelete, upvotes: initialUpvotes }) {
    const [upvotes, setUpvotes] = useState(initialUpvotes || 0);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');

    useEffect(() => {
        // Fetch the initial card details including upvotes
        fetch(`http://localhost:3000/cards/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.upvotes) {
                    setUpvotes(data.upvotes);
                }
            })
            .catch(error => console.error('Error fetching card details:', error));

        // Fetch comments if the comments section is open
        if (showComments) {
            fetch(`http://localhost:3000/cards/${id}/comments`)
                .then(response => response.json())
                .then(data => {
                    setComments(data);
                })
                .catch(error => console.error('Error fetching comments:', error));
        }
    }, [id, showComments]);

    const handleUpvote = () => {
        fetch(`http://localhost:3000/cards/${id}/upvote`, {
            method: 'PATCH'
        })
        .then(response => response.json())
        .then(data => {
            setUpvotes(data.upvotes);
        })
        .catch(error => console.error('Error updating upvotes:', error));
    };

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const handleAddComment = () => {
        if (!commentAuthor || !newComment) {
            alert("Please fill in both your name and a comment.");
            return;
        }

        const commentData = { author: commentAuthor, content: newComment };
        fetch(`http://localhost:3000/cards/${id}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(commentData)
        })
        .then(response => response.json())
        .then(data => {
            setComments(prevComments => [...prevComments, data]);
            setNewComment('');
            setCommentAuthor('');
        })
        .catch(error => console.error('Error adding comment:', error));
    };

    return (
        <div className='card'>
            <div className='cardInfo'>
                <h3>{title}</h3>
                <p>{message}</p>
                <p>Creator: {creator}</p>
                {GIFUrl && <img src={GIFUrl} alt={title} />}
                <p>Likes: {upvotes}</p>
                <button onClick={toggleComments}>{showComments ? 'Hide' : 'View'} Comments</button>
                {showComments && (
                    <div>
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <p key={comment.id}>{comment.author}: {comment.content}</p>
                            ))
                        ) : (
                            <p>Be the first to comment</p>
                        )}
                        <input
                            type="text"
                            placeholder="Your name"
                            value={commentAuthor}
                            onChange={(e) => setCommentAuthor(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button onClick={handleAddComment}>Post Comment</button>
                    </div>
                )}
            </div>
            <button onClick={() => onDelete(id)}>Delete Card</button>
            <button onClick={handleUpvote}>Like</button>
        </div>
    );
}

export default Card;
