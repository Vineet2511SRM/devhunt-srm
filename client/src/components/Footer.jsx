import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-background border-t-2 border-[#3F3F46] w-full py-8 mt-auto z-10 relative">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--font-size-md)', textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
          DEVHUNT SRM
        </div>

        <nav style={{ display: 'flex', gap: 'var(--space-6)', fontSize: 'var(--font-size-xs)', fontWeight: 700, textTransform: 'uppercase' }}>
          <Link to="/explore" style={{ color: 'var(--color-text-secondary)' }}>EXPLORE</Link>
          <Link to="/leaderboard" style={{ color: 'var(--color-text-secondary)' }}>LEADERBOARD</Link>
          <Link to="/submit" style={{ color: 'var(--color-text-secondary)' }}>SUBMIT PROJECT</Link>
          <Link to="/login" style={{ color: 'var(--color-text-secondary)' }}>LOGIN</Link>
        </nav>

        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
          © {new Date().getFullYear()} DEVHUNT SRM
        </div>
      </div>
    </footer>
  );
};

export default Footer;
