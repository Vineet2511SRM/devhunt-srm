import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { id } = useParams();
  return (
    <div className="page">
      <div className="container">
        <h1>📦 Project Detail</h1>
        <p className="text-muted">Project ID: {id}</p>
      </div>
    </div>
  );
};
export default ProjectDetail;
