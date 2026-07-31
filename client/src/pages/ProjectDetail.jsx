import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import StarRating from '../components/StarRating.jsx';
import ReviewCard from '../components/ReviewCard.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import { getProject, upvoteProject } from '../services/projectService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getInitials } from '../utils/helpers.js';
import { toast } from 'react-hot-toast';
import { FiArrowUp, FiGithub, FiExternalLink, FiStar, FiUser, FiCalendar, FiCode } from 'react-icons/fi';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const { data } = await getProject(id);
      setProject(data.project);
      if (data.project?.title) {
        document.title = `DEVHUNT SRM — ${data.project.title.toUpperCase()}`;
      }
    } catch {
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      return toast.error('PLEASE LOG IN TO UPVOTE');
    }

    setUpvoting(true);
    try {
      const { data } = await upvoteProject(id);
      setProject((prev) => ({
        ...prev,
        upvotes: data.upvoted
          ? [...(prev.upvotes || []), user._id]
          : (prev.upvotes || []).filter((uId) => uId !== user._id),
        upvoteCount: data.upvoteCount,
      }));
      toast.success(data.message.toUpperCase());
    } catch (err) {
      toast.error(err.response?.data?.message || 'UPVOTE FAILED');
    } finally {
      setUpvoting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="page">
          <div className="container">
            <div className="brutal-border skeleton" style={{ height: 400 }} />
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="page text-center" style={{ paddingTop: 80 }}>
          <h2 style={{ textTransform: 'uppercase' }}>PROJECT NOT FOUND</h2>
          <Link to="/explore" className="acid-btn" style={{ marginTop: 20, display: 'inline-block' }}>
            BACK TO EXPLORE
          </Link>
        </div>
      </Layout>
    );
  }

  const {
    title,
    tagline,
    description,
    category,
    techStack = [],
    githubUrl,
    liveUrl,
    screenshots = [],
    upvotes = [],
    upvoteCount = 0,
    avgRating = 0,
    reviewCount = 0,
    reviews = [],
    owner = {},
  } = project;

  const hasUpvoted = isAuthenticated && upvotes.includes(user?._id);

  return (
    <Layout>
      <div className="page" style={{ paddingTop: 0 }}>
        {/* Giant Headline Title & Upvote Badge Header */}
        <div style={{ borderBottom: '2px solid #3F3F46', background: '#09090b', padding: '64px 0' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <span className="brutal-border" style={{ background: '#dfe104', color: '#09090b', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  {category}
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 10vw, 7.5rem)', fontWeight: 800, color: '#dfe104', textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: 0.85, marginBottom: 16 }}>
                {title}
              </h1>

              <p style={{ fontSize: '1.1rem', color: '#fafafa', textTransform: 'uppercase', letterSpacing: '0.02em', maxWidth: 800 }}>
                {tagline}
              </p>
            </div>

            {/* Upvote Box (Matching Stitch Screenshot 4 top-right yellow 1,248 box!) */}
            <button
              onClick={handleUpvote}
              disabled={upvoting}
              className="animate-heartbeat"
              style={{
                border: '2px solid #3F3F46',
                background: hasUpvoted ? '#dfe104' : '#09090b',
                color: hasUpvoted ? '#09090b' : '#fafafa',
                padding: '24px 36px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: hasUpvoted ? '0 0 35px #dfe104' : '0 0 25px rgba(223, 225, 4, 0.4)',
              }}
            >
              <FiArrowRight style={{ transform: 'rotate(-90deg)', fontSize: '1.5rem', marginBottom: 4 }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>
                {upvoteCount}
              </div>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', marginTop: 4 }}>
                {hasUpvoted ? 'UPVOTED' : 'UPVOTE'}
              </div>
            </button>
          </div>
        </div>

        {/* Gallery & Main Content Grid */}
        <div className="container" style={{ paddingTop: 48, paddingBottom: 64, display: 'grid', gridTemplateColumns: '12fr', gap: 48 }}>
          {/* Screenshot Lightbox */}
          {screenshots.length > 0 && (
            <div>
              <div style={{ border: '2px solid #3F3F46', height: 480, width: '100%', overflow: 'hidden', background: '#09090b' }}>
                <img src={screenshots[selectedImage]} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {screenshots.length > 1 && (
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  {screenshots.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        border: idx === selectedImage ? '2px solid #dfe104' : '2px solid #3F3F46',
                        width: 100,
                        height: 64,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2-Column Info & Sidebar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            {/* Left Column: About & Reviews */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {/* About Box */}
              <div style={{ border: '2px solid #3F3F46', background: '#09090b', padding: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, color: '#dfe104' }}>
                  ABOUT THIS PROJECT
                </h2>
                <p style={{ color: '#a1a1aa', lineHeight: 1.7, textTransform: 'uppercase', whiteSpace: 'pre-line' }}>
                  {description}
                </p>
              </div>

              {/* Leave Review & Comment Form */}
              {isAuthenticated ? (
                <div style={{ border: '2px solid #3F3F46', background: '#09090b', padding: 32 }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, color: '#dfe104' }}>
                    POST A COMMENT / REVIEW
                  </h2>
                  <ReviewForm projectId={id} onReviewAdded={fetchProject} />
                </div>
              ) : (
                <div style={{ border: '2px solid #3F3F46', background: '#09090b', padding: 32, textAlign: 'center' }}>
                  <p style={{ color: '#a1a1aa', textTransform: 'uppercase', marginBottom: 16 }}>
                    WANT TO COMMENT OR LEAVE A REVIEW FOR THIS PROJECT?
                  </p>
                  <Link to="/login" className="acid-btn" style={{ padding: '12px 24px' }}>
                    LOG IN TO COMMENT
                  </Link>
                </div>
              )}

              {/* Community Reviews List */}
              <div style={{ border: '2px solid #3F3F46', background: '#09090b', padding: 32 }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, color: '#dfe104' }}>
                  COMMUNITY REVIEWS ({reviews.length})
                </h2>

                {reviews.length === 0 ? (
                  <p style={{ color: '#a1a1aa', textTransform: 'uppercase' }}>NO REVIEWS YET. BE THE FIRST TO CRITIQUE!</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {reviews.map((rev) => (
                      <ReviewCard key={rev._id} review={rev} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Metadata & Tech Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* External Links */}
              <div style={{ border: '2px solid #3F3F46', background: '#09090b', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {liveUrl && (
                  <a href={liveUrl} target="_blank" rel="noreferrer" className="acid-btn" style={{ height: 52, fontSize: '0.9rem' }}>
                    <FiExternalLink /> LIVE DEMO
                  </a>
                )}
                {githubUrl && (
                  <a href={githubUrl} target="_blank" rel="noreferrer" className="acid-outline-btn" style={{ height: 52, fontSize: '0.9rem' }}>
                    <FiGithub /> SOURCE CODE
                  </a>
                )}
              </div>

              {/* Tech Stack Box */}
              <div style={{ border: '2px solid #3F3F46', background: '#09090b', padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, color: '#dfe104' }}>
                  TECH STACK
                </h3>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {techStack.map((tech, idx) => (
                    <span key={idx} className="brutal-border" style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Builder Info Box */}
              <div style={{ border: '2px solid #3F3F46', background: '#09090b', padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, color: '#dfe104' }}>
                  BUILDER CREDENTIALS
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="brutal-border" style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    {getInitials(owner.name)}
                  </div>
                  <div>
                    <Link to={`/profile/${owner._id}`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', textDecoration: 'underline' }}>
                      {owner.name}
                    </Link>
                    <p style={{ fontSize: '0.75rem', color: '#a1a1aa', textTransform: 'uppercase', marginTop: 2 }}>
                      LEVEL {owner.level || 1} BUILDER
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetail;
