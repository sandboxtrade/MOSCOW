import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles.css";

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("MOSCOW render error", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="fatalScreen">
          <div className="fatalCard">
            <span className="panelEyebrow">MOSCOW · v0.3.14</span>
            <h1>Ошибка интерфейса</h1>
            <p>{this.state.error?.message || "UNKNOWN_RENDER_ERROR"}</p>
            <button type="button" onClick={() => window.location.reload()}>Перезагрузить</button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>,
);
