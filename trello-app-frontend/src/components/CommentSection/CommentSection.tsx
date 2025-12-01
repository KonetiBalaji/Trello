import React, { useState, useEffect } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { Comment } from '../../types';
import { formatDateTime } from '../../utils/dateFormatter';
import './CommentSection.css';

interface CommentSectionProps {
  taskId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ taskId }) => {
  const { getComments, addComment } = useTasks();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const fetchedComments = await getComments(taskId);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addComment(taskId, newComment);
      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      <h4>Comments</h4>
      
      <form onSubmit={handleSubmit} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
          className="comment-input"
        />
        <button type="submit" disabled={submitting || !newComment.trim()} className="comment-submit-btn">
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      <div className="comments-list">
        {loading ? (
          <div className="loading">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="no-comments">No comments yet</div>
        ) : (
          comments.map(comment => (
            <div key={comment.commentId} className="comment-item">
              <div className="comment-header">
                <span className="comment-user">{comment.userId}</span>
                <span className="comment-date">{formatDateTime(comment.createdAt)}</span>
              </div>
              <div className="comment-content">{comment.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;

