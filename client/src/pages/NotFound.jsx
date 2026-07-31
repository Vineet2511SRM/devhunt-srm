import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="animate-slide-up">
        <h1 style={{ fontSize: 'var(--font-size-5xl)', marginBottom: 'var(--space-4)' }}>
          4<span className="text-gradient">0</span>4
        </h1>
        <p className="text-muted" style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-8)' }}>
          Oops! This page doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          🚀 Back to Home
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
