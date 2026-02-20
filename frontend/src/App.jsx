import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import Predictions from "./Predictions";
import Auth from "./Auth";
import PrivateRoute from "./PrivateRoute";

function App() {
  // Using a key-based approach on the Router or a wrapper ensures 
  // the app re-evaluates the token on navigation.
  return (
    <Router>
      <Routes>
        {/* Auth page should NOT show the Navbar */}
        <Route path="/auth" element={<Auth />} />

        {/* Home Route */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Navbar />
              <Home />
            </PrivateRoute>
          }
        />

        {/* Predictions Route */}
        <Route
          path="/predictions"
          element={
            <PrivateRoute>
              <Navbar />
              <Predictions />
            </PrivateRoute>
          }
        />

        {/* Redirect any unknown routes to home or auth */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;