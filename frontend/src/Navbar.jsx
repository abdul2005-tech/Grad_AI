import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth"; // Force refresh to clear state
  };

  return (
    <nav className="cyber-nav">
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src="/logo.svg" alt="logo" style={{ width: '30px', height: '30px' }} />
        GRAD<span>.AI</span>
      </div>

      <div className="nav-links" style={{ alignItems: 'center' }}>
        <Link to="/" className="nav-item">Prediction</Link>
        <Link to="/predictions" className="nav-item">History</Link>
        {/* Reset button styles to match the Link items exactly */}
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
            textTransform: 'uppercase'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;