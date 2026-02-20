import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    // This triggers the PrivateRoute to kick the user to /auth
    navigate("/auth");
  };

  return (
    <nav className="cyber-nav">
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.svg" alt="logo" style={{ width: '30px', height: '30px' }} />
        GRAD<span>.AI</span>
      </div>

      <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" className="nav-item">Prediction</Link>
        <Link to="/predictions" className="nav-item">History</Link>
        <button
          onClick={logout}
          className="nav-item"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            fontFamily: 'inherit',
            textTransform: 'uppercase',
            color: '#888'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;