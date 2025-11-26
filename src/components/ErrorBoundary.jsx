import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state = { hasError:false, err:null }; }
  static getDerivedStateFromError(err){ return { hasError:true, err }; }
  componentDidCatch(err, info){ console.error("UI_ERROR", err, info); }

  render(){
    if (this.state.hasError) {
      const devMsg = import.meta.env?.DEV && (this.state.err?.message || String(this.state.err));
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-md w-full bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Щось пішло не так</h2>
            <p className="text-sm text-slate-600">
              {devMsg || "Оновіть сторінку або спробуйте пізніше."}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
