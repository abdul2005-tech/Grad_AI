import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  
  // Refs for keyboard navigation
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField === "submit") {
        handleSubmit(e); // Auto-clicks button
      } else {
        nextField.current.focus(); // Moves to next input
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    // Clean URL to avoid double slashes
    const url = `${API.replace(/\/+$/, '')}/${isLogin ? "login" : "register"}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (isLogin && data.access_token) {
        localStorage.setItem("token", data.access_token);
        window.location.href = "/"; 
      } else {
        alert(data.msg || "Success! Please log in.");
        if (!isLogin) setIsLogin(true);
      }
    } catch (err) {
      alert("Server connection failed");
    }
  };

  return (
    <main className="content-grid">
      <aside className="hero-side">
        <div className="badge">SECURE ACCESS</div>
        <h1>System <br />{isLogin ? "Entry" : "Registry"}.</h1>
        <p>Enter credentials to access the placement prediction engine.</p>
      </aside>

      <section className="form-side">
        <form className="cyber-form" onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
          <div className="cyber-input-group">
            <label>Username</label>
            <input 
              name="username" 
              ref={usernameRef}
              onChange={handleChange} 
              onKeyDown={(e) => handleKeyDown(e, passwordRef)} 
              required 
              autoFocus
            />
          </div>
          <div className="cyber-input-group" style={{marginTop: '20px'}}>
            <label>Password</label>
            <input 
              name="password" 
              type="password" 
              ref={passwordRef}
              onChange={handleChange} 
              onKeyDown={(e) => handleKeyDown(e, "submit")} 
              required 
            />
          </div>
          <button type="submit" className="cyber-btn">
            {isLogin ? "INITIATE_SESSION" : "CREATE_ACCOUNT"}
          </button>
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="nav-item"
            style={{background: 'none', border: 'none', marginTop: '20px', cursor: 'pointer', textAlign: 'center'}}
          >
            {isLogin ? "Need access? Register" : "Have access? Login"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Auth;