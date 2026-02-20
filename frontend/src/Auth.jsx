import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Create refs for the inputs
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Handle "Enter" key navigation
  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent accidental form submission on the first field
      if (nextField === "submit") {
        handleSubmit(e); // Trigger login/register if Enter is pressed on password
      } else if (nextField) {
        nextField.current.focus(); // Focus password field if Enter is pressed on username
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const url = `${API}/${isLogin ? "login" : "register"}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!isLogin) {
        alert("Success! Now log in.");
        setIsLogin(true);
      } else if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        window.location.href = "/";
      } else {
        alert(data.msg || "Error");
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
              ref={usernameRef} // Attach ref
              onChange={handleChange} 
              onKeyDown={(e) => handleKeyDown(e, passwordRef)} // Move to password
              required 
              autoFocus
            />
          </div>
          <div className="cyber-input-group" style={{marginTop: '20px'}}>
            <label>Password</label>
            <input 
              name="password" 
              type="password" 
              ref={passwordRef} // Attach ref
              onChange={handleChange} 
              onKeyDown={(e) => handleKeyDown(e, "submit")} // Click button
              required 
            />
          </div>
          <button type="submit" className="cyber-btn">
            {isLogin ? "INITIATE_SESSION" : "CREATE_ACCOUNT"}
          </button>
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            style={{background: 'none', border: 'none', color: '#888', marginTop: '20px', cursor: 'pointer'}}
          >
            {isLogin ? "Need access? Register" : "Have access? Login"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Auth;