import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import { createProject, updateProject, getProject } from '../services/projectService.js';
import { TECH_STACK_OPTIONS } from '../utils/constants.js';
import { toast } from 'react-hot-toast';
import { FiUploadCloud, FiZap, FiPlus, FiX } from 'react-icons/fi';

const SubmitProject = () => {
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web App');
  const [techStack, setTechStack] = useState([]);
  const [customTech, setCustomTech] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [screenshots, setScreenshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    document.title = isEditMode ? 'DEVHUNT SRM — EDIT PROJECT' : 'DEVHUNT SRM — SHIP YOUR WORK';
    
    if (isEditMode) {
      const fetchProject = async () => {
        setInitialLoading(true);
        try {
          const { data } = await getProject(id);
          const p = data.project;
          setTitle(p.title || '');
          setTagline(p.tagline || '');
          setDescription(p.description || '');
          setCategory(p.category || 'Web App');
          setTechStack(p.techStack || []);
          setGithubUrl(p.githubUrl || '');
          setLiveUrl(p.liveUrl || '');
          setScreenshots(p.screenshots || []);
        } catch (err) {
          toast.error('FAILED TO LOAD PROJECT DETAILS');
          navigate('/dashboard');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditMode, navigate]);

  const handleTechToggle = (tech) => {
    if (techStack.includes(tech)) {
      setTechStack(techStack.filter((t) => t !== tech));
    } else {
      setTechStack([...techStack, tech]);
    }
  };

  const handleAddCustomTech = (e) => {
    if (e.key === 'Enter' && customTech.trim()) {
      e.preventDefault();
      if (!techStack.includes(customTech.trim())) {
        setTechStack([...techStack, customTech.trim()]);
      }
      setCustomTech('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !tagline || !description) {
      return toast.error('PLEASE FILL IN TITLE, TAGLINE, AND DESCRIPTION');
    }

    if (techStack.length === 0) {
      return toast.error('SELECT AT LEAST ONE TECH STACK TAG');
    }

    setLoading(true);
    try {
      const projectData = {
        title,
        tagline,
        description,
        category,
        techStack,
        githubUrl,
        liveUrl,
        screenshots,
      };

      if (isEditMode) {
        await updateProject(id, projectData);
        toast.success('PROJECT UPDATED SUCCESSFULLY!');
        navigate(`/projects/${id}`);
      } else {
        const { data } = await createProject(projectData);
        toast.success('PROJECT SHIPPED SUCCESSFULLY! +10 BUILDER XP');
        navigate(`/projects/${data.project._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'FAILED TO SHIP PROJECT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page" style={{ paddingTop: 0 }}>
        {/* Top Ticker */}
        <div className="marquee-container" style={{ margin: 0 }}>
          <div className="marquee-content" style={{ fontSize: '1rem' }}>
            SHIP YOUR WORK // GAIN TRACTION // GET PEER FEEDBACK // EARN XP // CLIMB THE LEADERBOARD // SHIP YOUR WORK // GAIN TRACTION //
          </div>
        </div>

        <div className="container" style={{ maxWidth: 900, paddingTop: 48 }}>
          {/* Header */}
          <div style={{ marginBottom: 40, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 80, height: 80, border: '2px solid #3F3F46', marginBottom: 16, overflow: 'hidden', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/tech-node.png" alt="Tech Node" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.05em', lineHeight: 0.9 }}>
              {isEditMode ? 'EDIT YOUR ' : 'SHIP YOUR '}<span style={{ color: '#dfe104' }}>WORK</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', textTransform: 'uppercase', marginTop: 12 }}>
              {isEditMode ? 'UPDATE YOUR MVP DETAILS AND STAY RELEVANT.' : 'LAUNCH YOUR MVP TO THE SRM CAMPUS ECOSYSTEM WITH A SINGLE CLICK.'}
            </p>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} style={{ border: '2px solid #3F3F46', background: '#09090b', padding: 32, display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Title & Category */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                  PROJECT DESIGNATION *
                </label>
                <input
                  type="text"
                  className="kinetic-input"
                  placeholder="ENTER CODENAME..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                  SELECT MODULE TYPE
                </label>
                <select
                  className="kinetic-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Web App">WEB APP</option>
                  <option value="Mobile App">MOBILE APP</option>
                  <option value="AI/ML">AI / MACHINE LEARNING</option>
                  <option value="DevTool">DEVELOPER TOOL</option>
                  <option value="CLI">CLI TOOL</option>
                  <option value="Blockchain">BLOCKCHAIN / WEB3</option>
                  <option value="Other">OTHER</option>
                </select>
              </div>
            </div>

            {/* Tagline */}
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                ONE-LINE ELEVATOR PITCH *
              </label>
              <input
                type="text"
                className="kinetic-input"
                placeholder="BRIEF HIGH-LEVEL SUMMARY OF WHAT IT DOES..."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                DETAILED ARCHITECTURE &amp; OVERVIEW *
              </label>
              <textarea
                className="kinetic-input"
                rows={5}
                placeholder="EXPLAIN THE PROBLEM, TECH STACK, FEATURES, AND FUTURE ROADMAP..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Tech Stack Selection */}
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 8 }}>
                TECH STACK TAGS *
              </label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                {TECH_STACK_OPTIONS.map((tech) => (
                  <button
                    type="button"
                    key={tech}
                    onClick={() => handleTechToggle(tech)}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '6px 12px',
                      background: techStack.includes(tech) ? '#dfe104' : '#09090b',
                      color: techStack.includes(tech) ? '#09090b' : '#fafafa',
                      border: '2px solid #3F3F46',
                      cursor: 'pointer',
                    }}
                  >
                    {tech}
                  </button>
                ))}
              </div>

              <input
                type="text"
                className="kinetic-input"
                placeholder="TYPE CUSTOM TECH AND PRESS ENTER..."
                value={customTech}
                onChange={(e) => setCustomTech(e.target.value)}
                onKeyDown={handleAddCustomTech}
              />
            </div>

            {/* Repository & Deployment Links */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                  SOURCE CODE (GITHUB URL)
                </label>
                <input
                  type="url"
                  className="kinetic-input"
                  placeholder="HTTPS://GITHUB.COM/USER/REPO"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 6 }}>
                  LIVE DEMO / DEPLOYMENT URL
                </label>
                <input
                  type="url"
                  className="kinetic-input"
                  placeholder="HTTPS://MY-PROJECT.VERCEL.APP"
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Visual Assets (Screenshots Drop Zone) */}
            <div>
              <label style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#fafafa', display: 'block', marginBottom: 8 }}>
                VISUAL ASSETS (SCREENSHOTS)
              </label>

              <ImageUploader
                images={screenshots}
                onImagesChange={setScreenshots}
                maxImages={4}
              />
            </div>

            {/* Massive Action Button */}
            <button type="submit" disabled={loading || initialLoading} className="kinetic-button" style={{ height: 72, fontSize: '1.5rem', marginTop: 16 }}>
              {loading ? (isEditMode ? 'UPDATING PROJECT...' : 'SHIPPING PROJECT...') : (isEditMode ? 'UPDATE PROJECT' : 'SHIP IT 🚀')}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitProject;
