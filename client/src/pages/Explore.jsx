import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { ProjectCardSkeleton } from '../components/Skeleton.jsx';
import EmptyState from '../components/EmptyState.jsx';
import MetaTags from '../components/MetaTags.jsx';
import { getProjects } from '../services/projectService.js';
import { FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../styles/Explore.css';

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('trending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchInputRef = useRef(null);

  const categories = ['ALL', 'REACT', 'NODE.JS', 'AI/ML', 'WEB3'];

  useEffect(() => {
    fetchProjects();
  }, [search, selectedCategory, sortBy, page]);

  // Keep search state in sync with URL
  useEffect(() => {
    const query = searchParams.get('search');
    if (query !== null && query !== search) {
      setSearch(query);
    }
  }, [searchParams]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 6,
        sort: sortBy,
        ...(search && { search }),
        ...(selectedCategory !== 'ALL' && { category: selectedCategory }),
      };
      const { data } = await getProjects(params);
      setProjects(data.projects || []);
      setTotalPages(data.pages || 1);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    if (val) {
      setSearchParams({ search: val });
    } else {
      setSearchParams({});
    }
  };

  return (
    <Layout>
      <MetaTags
        title="Explore Projects — DevHunt SRM"
        description="Discover, search, filter, and upvote student and faculty projects created at SRM Institute of Science and Technology."
      />
      <div className="page" style={{ paddingTop: 0, paddingBottom: 64 }}>
        <div className="hero-kinetic-bg" style={{ padding: '48px 0 32px', marginBottom: 32 }}>
          <div className="container">
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                fontWeight: 800,
                color: '#dfe104',
                textTransform: 'uppercase',
                letterSpacing: '-0.05em',
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              EXPLORE
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', textTransform: 'uppercase', marginTop: 8, letterSpacing: '0.04em' }}>
              DISCOVER, UPVOTE &amp; CRITIQUE THE LATEST STUDENT INNOVATIONS ACROSS CAMPUS
            </p>
          </div>
        </div>

        <div className="container">
          {/* Search Bar Input */}
          <div style={{ position: 'relative', marginBottom: 28 }}>
            <FiSearch style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', color: '#a1a1aa' }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="SEARCH PROJECTS, TAGS..."
              value={search}
              onChange={handleSearchChange}
              autoFocus
              aria-label="Search projects"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '2px solid #3F3F46',
                padding: '12px 12px 12px 36px',
                color: '#fafafa',
                fontSize: '1.1rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                textTransform: 'uppercase',
                outline: 'none',
              }}
            />
          </div>

          {/* Category Filters & Sort Dropdown */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(1);
                  }}
                  className="brutal-border"
                  style={{
                    padding: '8px 20px',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    background: selectedCategory === cat ? '#dfe104' : 'transparent',
                    color: selectedCategory === cat ? '#09090b' : '#fafafa',
                    borderColor: selectedCategory === cat ? '#dfe104' : '#3F3F46',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>
              <span style={{ color: '#a1a1aa' }}>SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="brutal-border"
                style={{
                  background: '#09090b',
                  color: '#fafafa',
                  padding: '8px 16px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="trending">TRENDING ∨</option>
                <option value="newest">NEWEST ∨</option>
                <option value="upvotes">MOST UPVOTED ∨</option>
              </select>
            </div>
          </div>

          {/* Projects Grid with Skeletons and Empty State */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginBottom: 48 }}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <ProjectCardSkeleton key={n} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <EmptyState
              title="No projects found"
              description={search ? `No projects matched "${search}". Try clearing filters or searching for another keyword.` : "No projects published in this category yet."}
              actionText={search ? "Clear Search" : "Ship a Project"}
              actionLink={search ? undefined : "/submit"}
              onActionClick={search ? () => { setSearch(''); setSearchParams({}); } : undefined}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginBottom: 48 }}>
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="brutal-border"
                style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#fafafa', cursor: 'pointer', opacity: page === 1 ? 0.5 : 1 }}
              >
                <FiChevronLeft />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setPage(idx + 1)}
                  className="brutal-border"
                  style={{
                    width: 44,
                    height: 44,
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: page === idx + 1 ? '#dfe104' : '#09090b',
                    color: page === idx + 1 ? '#09090b' : '#fafafa',
                  }}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="brutal-border"
                style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#fafafa', cursor: 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
              >
                <FiChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
