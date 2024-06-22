import { useState, useEffect } from 'react';
import './Card.css'
function Card({ title, message, creator, GIFUrl, id, onDelete, upvotes, onUpvote }) {
    const [localUpvotes, setLocalUpvotes] = useState(upvotes || 0);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3000/cards/${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.upvotes) {
                    setLocalUpvotes(data.upvotes);
                }
            })
            .catch(error => console.error('Error fetching card details:', error));
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
            setLocalUpvotes(data.upvotes);
            if (onUpvote) {
                onUpvote(id, data.upvotes);
            }
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
                <h3 className='title'>{title}</h3>
                <p className='message'>{message}</p>
                <p className='creator'>Creator: {creator}</p>
                {GIFUrl && <img src={GIFUrl} alt={title} />}
                <p className='upvotes'>Upvotes: {upvotes}</p>
                <button onClick={toggleComments} className='comments'>{showComments ? 'Hide' : 'View'} Comments</button>
                {showComments && (
                    <div className='commentSection'>
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <p key={comment.id} className='comment'>{comment.author}: {comment.content}</p>
                            ))
                        ) : (
                            <p className='comment'>Be the first to comment</p>
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
            <div className='buttons'>
                <button onClick={() => onDelete(id)} className='delCard'>Delete Card</button>
                <button onClick={handleUpvote} className='upvoteButton'>upvote</button>
            </div>
        </div>
    );
}

export default Card;
