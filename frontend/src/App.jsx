import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Predictions from "./Predictions";
import Auth from "./Auth";
import PrivateRoute from "./PrivateRoute";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      {token && <Navbar />}

      <Routes>
        <Route path="/auth" element={<Auth />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/predictions"
          element={
            <PrivateRoute>
              <Predictions />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;