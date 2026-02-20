import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
const Predictions = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If not logged in → redirect
    if (!token) {
      alert("Please login first");
      navigate("/auth");
      return;
    }

    // Fetch prediction history from backend
    fetch(`${API}//history`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(() => alert("Error fetching history"));
  }, []);

  return (
    <div className="history-container">
      <h2 className="history-title">// PREDICTION_LOGS</h2>

      {history.length === 0 ? (
        <p className="no-data">No predictions yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Result</th>
              </tr>
            </thead>

            <tbody>
              {history.map((item, index) => (
                <tr key={index}>
                  <td>{new Date(item.date).toLocaleString()}</td>
                  <td
                    className={
                      item.result === "Placed"
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {item.result}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Predictions;