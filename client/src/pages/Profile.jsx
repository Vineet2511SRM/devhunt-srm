import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams();
  return (
    <div className="page">
      <div className="container">
        <h1>👤 Profile</h1>
        <p className="text-muted">User ID: {id}</p>
      </div>
    </div>
  );
};
export default Profile;
