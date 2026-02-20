import { useState, useRef } from "react";

const API = import.meta.env.VITE_API_URL;

const Home = () => {
  const [formData, setFormData] = useState({
    Age: "", Gender: "", Degree: "", Branch: "", CGPA: "",
    Internships: "", Projects: "", Coding_Skills: "",
    Communication_Skills: "", Aptitude_Test_Score: "",
    Soft_Skills_Rating: "", Certifications: "", Backlogs: ""
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Array of refs to manage focus transitions
  const inputRefs = useRef([]);

  const fieldConfigs = [
    { name: "Age", type: "number", placeholder: "Int: 18-30", min: 18, max: 30 },
    { name: "Gender", type: "select", options: ["Male", "Female"] },
    { name: "Degree", type: "select", options: ["B.Tech", "BE", "M.Tech", "BSc", "MCA"] },
    { name: "Branch", type: "select", options: ["CSE", "IT", "ECE", "EEE", "Mechanical", "Civil"] },
    { name: "CGPA", type: "number", placeholder: "Float: 0.00-10.00", step: "0.01", min: 0, max: 10 },
    { name: "Internships", type: "number", placeholder: "Int: 0-5", min: 0 },
    { name: "Projects", type: "number", placeholder: "Int: 0-10", min: 0 },
    { name: "Coding_Skills", type: "number", placeholder: "Rating: 1-10", min: 1, max: 10 },
    { name: "Communication_Skills", type: "number", placeholder: "Rating: 1-10", min: 1, max: 10 },
    { name: "Aptitude_Test_Score", type: "number", placeholder: "Score: 0-100", min: 0, max: 100 },
    { name: "Soft_Skills_Rating", type: "number", placeholder: "Rating: 1-5", min: 1, max: 5 },
    { name: "Certifications", type: "number", placeholder: "Count: 0-20", min: 0 },
    { name: "Backlogs", type: "number", placeholder: "Count: 0-10", min: 0 }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Move focus to next input on Enter key
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < fieldConfigs.length - 1) {
        inputRefs.current[index + 1].focus();
      } else {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      
      const cleanedData = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => {
          const config = fieldConfigs.find(f => f.name === k);
          return config.type === "number" ? [k, Number(v)] : [k, v];
        })
      );

      const res = await fetch(`${API}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(cleanedData)
      });
      
      const data = await res.json();
      setResult(data.prediction);
    } catch (err) {
      alert("System Offline: Ensure Flask is active.");
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
          {fieldConfigs.map((config, index) => (
            <div key={config.name} className="cyber-input-group">
              <label>{config.name.replace(/_/g, " ")}</label>
              
              {config.type === "select" ? (
                <select 
                  name={config.name} 
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={formData[config.name]} 
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  required
                >
                  <option value="">Select</option>
                  {config.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type="number"
                  name={config.name}
                  ref={(el) => (inputRefs.current[index] = el)}
                  placeholder={config.placeholder}
                  step={config.step || "1"}
                  min={config.min}
                  max={config.max}
                  value={formData[config.name]}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  required
                />
              )}
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