import { Link } from 'react-router-dom';
import { FiGithub, FiHeart } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          © 2026 <strong>DevHunt SRM</strong>. Built with{' '}
          <FiHeart style={{ color: 'var(--color-error)', verticalAlign: 'middle' }} /> by SRM student developers.
        </div>

        <div className="footer-links">
          <Link to="/explore">Explore</Link>
          <Link to="/leaderboard">Leaderboard</Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <FiGithub /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
