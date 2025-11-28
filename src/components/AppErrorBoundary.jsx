import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(p){ super(p); this.state = { hasError:false, info:null }; }
  static getDerivedStateFromError(){ return { hasError:true }; }
  componentDidCatch(error, info){ this.setState({ info: String(error) }); }
  render(){
    if(this.state.hasError){
      return (
        <div className="min-h-screen grid place-items-center bg-slate-100">
          <div className="max-w-xl bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold">Щось пішло не так</h2>
            <p className="text-slate-500 mt-2">Перезавантажте сторінку або спробуйте пізніше.</p>
            {this.state.info && (
              <pre className="mt-3 text-xs text-slate-500 whitespace-pre-wrap">{this.state.info}</pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
