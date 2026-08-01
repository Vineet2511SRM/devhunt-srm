import StarRating from './StarRating.jsx';
import { getInitials, timeAgo } from '../utils/helpers.js';
import { FiThumbsUp, FiAlertCircle, FiStar } from 'react-icons/fi';

const ReviewCard = ({ review }) => {
  if (!review) return null;

  const { reviewer = {}, ratings = {}, overallScore = 0, pros, cons, suggestion, createdAt } = review;

  return (
    <div className="glass-card review-card animate-slide-up">
      <div className="review-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div className="user-avatar" style={{ width: 38, height: 38 }}>
            {reviewer.avatar ? (
              <img
                src={reviewer.avatar}
                alt={reviewer.name}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              getInitials(reviewer.name)
            )}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
              {reviewer.name || 'Anonymous Peer'}
            </div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              Lvl {reviewer.level || 1} Tester • {timeAgo(createdAt)}
            </div>
          </div>
        </div>

        {/* Overall Star Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <StarRating value={overallScore} readOnly size={16} />
          <span style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', color: 'var(--color-star)' }}>
            {overallScore.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Breakdown Scores */}
      <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
        <span>UI/UX: <strong>{ratings.uiux || 0}★</strong></span>
        <span>Code Quality: <strong>{ratings.codeQuality || 0}★</strong></span>
        <span>Innovation: <strong>{ratings.idea || 0}★</strong></span>
      </div>

      {/* Structured Feedback Blocks */}
      {pros && (
        <div className="review-feedback-block feedback-pros">
          <strong style={{ color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <FiThumbsUp /> Pros:
          </strong>{' '}
          {pros}
        </div>
      )}

      {cons && (
        <div className="review-feedback-block feedback-cons">
          <strong style={{ color: 'var(--color-error)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <FiAlertCircle /> Areas for Improvement:
          </strong>{' '}
          {cons}
        </div>
      )}

      {suggestion && (
        <div className="review-feedback-block feedback-suggestion">
          <strong style={{ color: 'var(--color-accent)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <FiStar /> Suggestion:
          </strong>{' '}
          {suggestion}
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
