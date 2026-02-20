import { useState } from "react";

const Home = () => {
  const [formData, setFormData] = useState({
    Age: "", Gender: "", Degree: "", Branch: "", CGPA: "",
    Internships: "", Projects: "", Coding_Skills: "",
    Communication_Skills: "", Aptitude_Test_Score: "",
    Soft_Skills_Rating: "", Certifications: "", Backlogs: ""
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          ...Object.fromEntries(
            Object.entries(formData).map(([k, v]) =>
              ["Gender", "Degree", "Branch"].includes(k)
                ? [k, v]
                : [k, Number(v)]
            )
          )
        })
      });
      const data = await res.json();
      setResult(data.prediction);

      

    } catch (err) {
      alert("Backend not connected!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="content-grid">
      <aside className="hero-side">
        <div className="badge">AI PREDICTION ENGINE</div>
        <h1>Future <br />Outcome <br />Simulator.</h1>
        <p>Analyze academic metrics using calibrated neural datasets.</p>
        {result && (
          <div className={`cyber-result ${result === "Placed" ? "success" : "warning"}`}>
            <small>CALCULATION COMPLETE</small>
            <div className="result-value">{result}</div>
          </div>
        )}
      </aside>

      <section className="form-side">
        <form className="cyber-form" onSubmit={handleSubmit}>
          {Object.keys(formData).map((key) => (
            <div key={key} className="cyber-input-group">
              <label>{key.replace(/_/g, " ")}</label>
              <input
                type={["Gender", "Degree", "Branch"].includes(key) ? "text" : "number"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <button type="submit" className="cyber-btn" disabled={loading}>
            {loading ? "INITIALIZING..." : "EXECUTE_ANALYSIS"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Home;