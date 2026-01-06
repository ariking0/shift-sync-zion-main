import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>Shift Schedule App</h1>
      <p>האפליקציה עלתה בהצלחה 🎉</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
