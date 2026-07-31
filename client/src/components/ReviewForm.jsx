import { useState } from 'react';
import StarRating from './StarRating.jsx';
import { createReview } from '../services/reviewService.js';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';

const ReviewForm = ({ projectId, onReviewSubmitted, onReviewAdded }) => {
  const [ratings, setRatings] = useState({
    uiux: 5,
    codeQuality: 5,
    idea: 5,
  });
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pros.trim() || !cons.trim()) {
      toast.error('Please fill in both Pros and Cons sections.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview(projectId, {
        ratings,
        pros: pros.trim(),
        cons: cons.trim(),
        suggestion: suggestion.trim(),
      });
      toast.success('Review posted! 🎉');
      setPros('');
      setCons('');
      setSuggestion('');
      if (onReviewSubmitted) onReviewSubmitted();
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to submit review.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: 'var(--space-8)' }}>
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--space-6)' }}>
        Leave Structured Peer Review 🧪
      </h3>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {/* Star Rating Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', background: 'var(--color-bg-input)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              UI / UX Design
            </label>
            <StarRating
              value={ratings.uiux}
              onChange={(val) => setRatings((prev) => ({ ...prev, uiux: val }))}
              size={18}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Code Quality
            </label>
            <StarRating
              value={ratings.codeQuality}
              onChange={(val) => setRatings((prev) => ({ ...prev, codeQuality: val }))}
              size={18}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Innovation / Idea
            </label>
            <StarRating
              value={ratings.idea}
              onChange={(val) => setRatings((prev) => ({ ...prev, idea: val }))}
              size={18}
            />
          </div>
        </div>

        {/* Pros */}
        <div className="form-group">
          <label htmlFor="pros" style={{ color: 'var(--color-success)', fontWeight: 600 }}>
            What did you like about this project? (Pros) *
          </label>
          <textarea
            id="pros"
            className="form-input"
            rows={3}
            placeholder="Clean UI layout, responsive components, smooth animations..."
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            required
          />
        </div>

        {/* Cons */}
        <div className="form-group">
          <label htmlFor="cons" style={{ color: 'var(--color-error)', fontWeight: 600 }}>
            Where can it be improved? (Cons) *
          </label>
          <textarea
            id="cons"
            className="form-input"
            rows={3}
            placeholder="Mobile navigation menu overlaps, form validation is missing..."
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            required
          />
        </div>

        {/* Suggestion */}
        <div className="form-group">
          <label htmlFor="suggestion" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
            Suggestions for Future Versions (Optional)
          </label>
          <textarea
            id="suggestion"
            className="form-input"
            rows={2}
            placeholder="Add dark mode toggle, integrate webhooks..."
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-lg" style={{ alignSelf: 'flex-start' }}>
          {isSubmitting ? 'Posting...' : <><FiSend /> Submit Review</>}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
