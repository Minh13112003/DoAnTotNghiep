import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaReply, FaThumbsUp, FaFlag, FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import './CommentSection.css';
import slugify from '../Helper/Slugify';

const CommentSection = ({ movieId, movieTitle }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyText, setReplyText] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const user = JSON.parse(localStorage.getItem('userData'));
        setIsLoggedIn(!!token);
        setUserData(user);
        fetchComments();
    }, [movieId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const slugTitle = slugify(movieTitle);
            const response = await axios.get(`http://localhost:5285/api/comment/GetCommentBySlugTitle/${slugTitle}`);
            setComments(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Lỗi khi tải bình luận:', err);
            setError('Không thể tải bình luận. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            setError('Vui lòng nhập nội dung bình luận');
            return;
        }

        if (!isLoggedIn) {
            setError('Vui lòng đăng nhập để bình luận');
            return;
        }

        try {
            const token = localStorage.getItem('userToken');
            if (!token) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
                return;
            }

            const slugTitle = slugify(movieTitle);
            await axios.post('http://localhost:5285/api/comment/AddComment', {
                slugTitle: slugTitle,
                content: newComment,
                parentId: null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewComment('');
            setError('');
            setSuccessMessage('Bình luận đã được đăng thành công!');
            fetchComments();
        } catch (err) {
            console.error('Lỗi khi đăng bình luận:', err);
            if (err.response) {
                setError(err.response.data || 'Không thể đăng bình luận. Vui lòng thử lại sau.');
            } else {
                setError('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
            }
        }
    };

    const handleReply = async (parentId) => {
        if (!replyText[parentId] || !replyText[parentId].trim()) return;

        try {
            const token = localStorage.getItem('userToken');
            await axios.post('http://localhost:5285/api/comments', {
                movieId,
                content: replyText[parentId],
                parentId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setReplyText({...replyText, [parentId]: ''});
            setReplyingTo(null);
            fetchComments();
        } catch (err) {
            setError('Không thể trả lời bình luận. Vui lòng thử lại sau.');
        }
    };

    const handleLike = async (commentId) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.post(`http://localhost:5285/api/comments/${commentId}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComments();
        } catch (err) {
            setError('Không thể thích bình luận. Vui lòng thử lại sau.');
        }
    };

    const handleReport = async (commentId) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.post(`http://localhost:5285/api/comments/${commentId}/report`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Bình luận đã được báo cáo.');
        } catch (err) {
            setError('Không thể báo cáo bình luận. Vui lòng thử lại sau.');
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`http://localhost:5285/api/comment/DeleteComment/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchComments();
        } catch (err) {
            setError('Không thể xóa bình luận. Vui lòng thử lại sau.');
        }
    };

    const handleEdit = async (commentId) => {
        if (!editText.trim()) return;

        try {
            const token = localStorage.getItem('userToken');
            await axios.put(`http://localhost:5285/api/comment/UpdateComment`, {
                IdComment: commentId,
                Content: editText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEditingComment(null);
            setEditText('');
            fetchComments();
            setSuccessMessage('Sửa bình luận thành công!');
            setTimeout(() => setSuccessMessage(''), 2000);
        } catch (err) {
            setError('Không thể chỉnh sửa bình luận. Vui lòng thử lại sau.');
        }
    };

    const startEditing = (comment) => {
        setEditingComment(comment.id);
        setEditText(comment.content);
    };

    // Render một bình luận và các phản hồi của nó
    const renderComment = (comment, isReply = false) => {
        const isOwner = userData && userData.userName === comment.idUserName;
        
        return (
            <Card key={comment.idComment} className={`mb-3 ${isReply ? 'ms-5' : ''}`}>
                <Card.Body>
                    <div className="d-flex align-items-start">
                        <div className="comment-avatar">
                            <FaUser size={24} />
                        </div>
                        <div className="ms-3 flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <h6 className="mb-1 fw-bold">{comment.idUserName}</h6>
                                <small className="text-muted">{comment.timeComment}</small>
                            </div>
                            
                            {editingComment === comment.idComment ? (
                                <Form className="mt-2">
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                        />
                                    </Form.Group>
                                    <div className="d-flex gap-2 mt-2">
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            onClick={() => handleEdit(comment.idComment)}
                                        >
                                            Lưu
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => setEditingComment(null)}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </Form>
                            ) : (
                                <p className="mb-2">{comment.content}</p>
                            )}
                            
                            <div className="d-flex gap-3 mt-2">
                                <Button 
                                    variant="link" 
                                    className="p-0 text-primary" 
                                    onClick={() => handleLike(comment.id)}
                                    disabled={!isLoggedIn}
                                >
                                    <FaThumbsUp className="me-1" /> {comment.likes || 0}
                                </Button>
                                
                                <Button 
                                    variant="link" 
                                    className="p-0 text-secondary"
                                    onClick={() => setReplyingTo(replyingTo === comment.idComment ? null : comment.idComment)}
                                    disabled={!isLoggedIn}
                                >
                                    <FaReply className="me-1" /> Trả lời
                                </Button>
                                
                                <Button 
                                    variant="link" 
                                    className="p-0 text-danger"
                                    onClick={() => handleReport(comment.idComment)}
                                    disabled={!isLoggedIn}
                                >
                                    <FaFlag className="me-1" /> Báo cáo
                                </Button>
                                
                                {isOwner && (
                                    <>
                                        <Button 
                                            variant="link" 
                                            className="p-0 text-warning"
                                            onClick={() => startEditing(comment)}
                                        >
                                            <FaEdit className="me-1" /> Sửa
                                        </Button>
                                        <Button 
                                            variant="link" 
                                            className="p-0 text-danger"
                                            onClick={() => handleDelete(comment.idComment)}
                                        >
                                            <FaTrash className="me-1" /> Xóa
                                        </Button>
                                    </>
                                )}
                            </div>
                            
                            {replyingTo === comment.id && (
                                <Form className="mt-3">
                                    <Form.Group>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            placeholder="Viết phản hồi của bạn..."
                                            value={replyText[comment.id] || ''}
                                            onChange={(e) => setReplyText({...replyText, [comment.id]: e.target.value})}
                                        />
                                    </Form.Group>
                                    <div className="d-flex gap-2 mt-2">
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            onClick={() => handleReply(comment.id)}
                                        >
                                            Gửi phản hồi
                                        </Button>
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => setReplyingTo(null)}
                                        >
                                            Hủy
                                        </Button>
                                    </div>
                                </Form>
                            )}
                            
                            {/* Hiển thị các phản hồi */}
                            {comment.replies && comment.replies.map(reply => renderComment(reply, true))}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        );
    };

    return (
        <div className="comment-section mt-5">
            <h3 className="mb-4">Bình luận về "{movieTitle}"</h3>
            
            {error && <Alert variant="danger">{error}</Alert>}
            
            {successMessage && (
                <Alert variant="success" className="mt-2">{successMessage}</Alert>
            )}
            
            {isLoggedIn ? (
                <Form onSubmit={handleCommentSubmit} className="mb-4">
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Viết bình luận của bạn..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </Form.Group>
                    <Button type="submit" className="mt-2">Đăng bình luận</Button>
                </Form>
            ) : (
                <Alert variant="info">
                    Vui lòng <a href="/tai-khoan/auth">đăng nhập</a> để bình luận.
                </Alert>
            )}
            
            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Đang tải...</span>
                    </Spinner>
                </div>
            ) : (
                <>
                    <h5 className="mb-3">{comments.length} bình luận</h5>
                    {comments.filter(c => !c.parentId).map(comment => (
                        <React.Fragment key={comment.id}>
                            {renderComment(comment)}
                        </React.Fragment>
                    ))}
                </>
            )}
        </div>
    );
};

export default CommentSection;