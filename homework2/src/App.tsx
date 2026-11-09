
import { PianoKeyboard } from './components/PianoKeyboard';
import './App.css';

function App() {
  return (
    <main className="app">
      <header className="app-header">
        <p>UIT · REACT 19 PRODUCTION LAB</p>
        <h1>POLYPHONIC PIANO STUDIO</h1>
      </header>

      <PianoKeyboard />

      <footer className="app-footer">
        Built with React 19, TypeScript and Web Audio API.
      </footer>
    </main>
  );
}

export default App;
