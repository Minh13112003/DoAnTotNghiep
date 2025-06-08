import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaUser, FaReply, FaThumbsUp, FaFlag, FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import './CommentSection.css';
import slugify from '../Helper/Slugify';
import Cookies from 'js-cookie';
import  {UpComment, UpdateComment, DeleteComment, GetComment} from '../apis/commentAPI';
import { UpReport } from '../apis/reportAPI';
import { toast } from 'react-toastify';


const CommentSection = ({ movieId, movieTitle }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyText, setReplyText] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState();
    const [userData, setUserData] = useState(null);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportContent, setReportContent] = useState('');
    const [reportLoading, setReportLoading] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);

    useEffect(() => {
        const token = Cookies.get('accessToken');
        const username = Cookies.get('username');
        const user = JSON.parse(localStorage.getItem('userData'));
        setIsLoggedIn(!!token);
        setUserData(user);
        setUserName(username);
        fetchComments();
    }, [movieId]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const slugTitle = slugify(movieTitle);
            // const response = await axios.get(`http://localhost:5285/api/comment/GetCommentBySlugTitle/${slugTitle}`);
            const response = await GetComment(slugTitle);
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
            const token = Cookies.get('accessToken');
            if (!token) {
                setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
                return;
            }

            const slugTitle = slugify(movieTitle);
            const payload = {
                slugTitle: slugTitle,
                content: newComment
            }
            // await axios.post('http://localhost:5285/api/comment/AddComment', {
            //     slugTitle: slugTitle,
            //     content: newComment,
            //     parentId: null
            // }, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });
            await UpComment(payload);
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
        setSelectedCommentId(commentId);
        setShowReportModal(true);
    };

    const handleReportSubmit = async () => {
        if (!reportContent.trim()) {
            setError('Vui lòng nhập nội dung báo cáo');
            return;
        }

        setReportLoading(true);
        try {

            const payload = {
                idComment: selectedCommentId,
                content: reportContent
            };
            const response = await UpReport(payload);
            
            if (response.status !== 200) {
                throw new Error('Failed to send report');
            }

            toast.success('Cảm ơn bạn đã báo cáo!');
            setShowReportModal(false);
            setReportContent('');
            setSelectedCommentId(null);
        } catch (error) {
            console.error('Error sending report:', error);
            setError('Có lỗi xảy ra khi gửi báo cáo');
        } finally {
            setReportLoading(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;

        try {
            
            // await axios.delete(`http://localhost:5285/api/comment/DeleteComment/${commentId}`, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });
            await DeleteComment(commentId);
            fetchComments();
        } catch (err) {
            setError('Không thể xóa bình luận. Vui lòng thử lại sau.');
        }
    };

    const handleEdit = async (commentId) => {
        if (!editText.trim()) return;

        try {
            
            // await axios.put(`http://localhost:5285/api/comment/UpdateComment`, {
            //     IdComment: commentId,
            //     Content: editText
            // }, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });
            const payload = {
                IdComment : commentId,
                Content: editText
            }
            await UpdateComment(payload);
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
        setEditingComment(comment.idComment);
        setEditText(comment.content);
    };

    // Render một bình luận và các phản hồi của nó
    const renderComment = (comment, isReply = false) => {
        const isOwner = userData && userName === comment.idUserName;
        
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

            {/* Modal Báo cáo */}
            <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Báo cáo bình luận</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Nội dung báo cáo</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={reportContent}
                                onChange={(e) => setReportContent(e.target.value)}
                                placeholder="Nhập nội dung báo cáo của bạn..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReportModal(false)}>
                        Hủy
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleReportSubmit}
                        disabled={reportLoading}
                    >
                        {reportLoading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Đang gửi...
                            </>
                        ) : (
                            'Gửi báo cáo'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CommentSection;