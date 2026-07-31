import { Link } from 'react-router-dom';
import { FiArrowUp, FiStar, FiMessageSquare } from 'react-icons/fi';
import { getInitials } from '../utils/helpers.js';
import '../styles/ProjectCard.css';

const ProjectCard = ({ project }) => {
  if (!project) return null;

  const {
    _id,
    title,
    tagline,
    techStack = [],
    screenshots = [],
    upvoteCount = 0,
    avgRating = 0,
    reviewCount = 0,
    owner = {},
  } = project;

  const thumbnail = screenshots[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80';

  return (
    <div className="card-hover-invert brutal-border p-6 flex flex-col gap-4 animate-slide-up" style={{ padding: 'var(--space-6)' }}>
      {/* Screenshot Image Thumbnail */}
      <Link to={`/projects/${_id}`}>
        <img src={thumbnail} alt={title} className="project-card-image brutal-border" loading="lazy" />
      </Link>

      {/* Card Header & Upvote Pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 'var(--space-2)' }}>
        <div>
          <Link to={`/projects/${_id}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--font-size-lg)', textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
            {title}
          </Link>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginTop: '4px' }}>
            {tagline}
          </p>
        </div>

        {/* Upvote Pill with Heartbeat Animation */}
        <div className="brutal-border animate-heartbeat" style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', fontSize: '0.75rem', fontWeight: 800, background: '#09090b', color: '#dfe104' }}>
          <FiArrowUp />
          <span>{upvoteCount}</span>
        </div>
      </div>

      {/* Tech Stack Chips & Owner Footer */}
      <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '2px solid #3F3F46', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {techStack.slice(0, 3).map((tech, idx) => (
            <span key={idx} className="brutal-border" style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              {tech}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-star)' }}>
          <FiStar style={{ fill: 'var(--color-star)' }} />
          <span>{avgRating ? avgRating.toFixed(1) : 'NEW'}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
