import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function CommentList({ videoId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchComments = async () => {
        try {
            const response = await api.get(`/comments/${videoId}?page=1&limit=20`);
            // Assuming response structure: { data: { docs: [...] }, ... } or similar based on standard backend
            // Let's inspect the response in console to be sure during dev
            console.log("Comments response:", response.data);

            if (response.data?.data?.docs) {
                setComments(response.data.data.docs);
            } else if (Array.isArray(response.data?.data)) {
                setComments(response.data.data);
            } else {
                setComments([]);
            }
        } catch (err) {
            console.error("Failed to fetch comments", err);
            // Don't show critical error for comments, just empty list maybe?
            // setError("Failed to load comments."); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (videoId) {
            fetchComments();
        }
    }, [videoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        if (!user) return alert("Please login to comment");

        try {
            const response = await api.post(`/comments/${videoId}`, { content: newComment });
            console.log("Add comment response:", response.data);

            // Add new comment to top of list
            // Assuming the response returns the created comment object in data.data
            const createdComment = response.data.data;
            if (createdComment) {
                // Manually populate owner if backend doesn't populate it fully immediately
                // typically backend *should* return populated, but let's see. 
                // We'll trust backend for now or mock it with current user
                if (!createdComment.owner) {
                    createdComment.owner = user;
                }
                setComments([createdComment, ...comments]);
                setNewComment("");
            }
        } catch (err) {
            console.error("Failed to post comment", err);
            alert("Failed to post comment");
        }
    };

    if (loading) return <div style={{ color: '#aaa', marginTop: '20px' }}>Loading comments...</div>;

    return (
        <div className="comments-section" style={{ marginTop: '24px', maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{comments.length} Comments</h3>

            {/* Add Comment Form */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <img
                    src={user?.avatar || "https://via.placeholder.com/40"}
                    alt="Current User"
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
                <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                    <input
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid #303030',
                            color: 'white',
                            padding: '8px 0',
                            fontSize: '0.95rem',
                            outline: 'none'
                        }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            style={{
                                backgroundColor: newComment.trim() ? '#3ea6ff' : '#272727',
                                color: newComment.trim() ? 'black' : '#717171',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '18px',
                                cursor: newComment.trim() ? 'pointer' : 'default',
                                fontWeight: '500'
                            }}
                        >
                            Comment
                        </button>
                    </div>
                </form>
            </div>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {comments.map(comment => (
                    <div key={comment._id} style={{ display: 'flex', gap: '16px' }}>
                        <img
                            src={comment.owner?.avatar || "https://via.placeholder.com/40"}
                            alt={comment.owner?.username}
                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        />
                        <div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>@{comment.owner?.username}</span>
                                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p style={{ fontSize: '0.95rem', margin: 0 }}>{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CommentList;
