import { useState } from 'react';
import { Cursor } from './components/Cursor';
import { ScrollProgress } from './components/ScrollProgress';
import { LocaleToggle } from './components/LocaleToggle';
import { ViewToggle, type ViewMode } from './components/ViewToggle';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Footer } from './components/Footer';
import { MindMapView } from './components/mindmap/MindMapView';

function App() {
  const [view, setView] = useState<ViewMode>('list');

  return (
    <>
      <Cursor />
      <LocaleToggle />
      <ViewToggle view={view} onChange={setView} />

      <div style={{ display: view === 'list' ? 'contents' : 'none' }}>
        <ScrollProgress />
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Footer />
      </div>

      <div className="mindmap-page" style={{ display: view === 'mindmap' ? 'block' : 'none' }}>
        <MindMapView />
      </div>
    </>
  );
}

export default App;
