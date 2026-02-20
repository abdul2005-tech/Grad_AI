import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://127.0.0.1:5000/${isLogin ? "login" : "register"}`;

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
        window.location.href = "/"; // Force refresh to update Navbar state
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
            <input name="username" onChange={handleChange} required />
          </div>
          <div className="cyber-input-group" style={{marginTop: '20px'}}>
            <label>Password</label>
            <input name="password" type="password" onChange={handleChange} required />
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