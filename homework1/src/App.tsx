
import { DrumKit } from './components/DrumKit';
import styles from './App.module.css';

function App() {
  return (
    <main className={styles.app}>
      <header className={styles.siteHeader}>
        <p className={styles.brand}>BEAT//LAB</p>
        <span className={styles.version}>STUDIO / 01</span>
      </header>

      <h1 className={styles.pageTitle}>
        MAKE SOME NOISE<span>.</span>
      </h1>

      <DrumKit />

      <footer className={styles.footer}>
        <p>React 19 · Web Audio API · Accessible by design</p>
        <p>UIT — Lab 03 Homework 1</p>
      </footer>
    </main>
  );
}

export default App;