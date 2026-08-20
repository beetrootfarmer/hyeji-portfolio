import { useEffect, useState } from 'react';
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

// Force-graph drag/pinch interactions don't work well on small touch
// screens, so mobile is list-view only — the toggle itself is hidden there.
function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= breakpoint,
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handleChange = () => setIsMobile(mql.matches);
    handleChange();
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return isMobile;
}

function App() {
  const [view, setView] = useState<ViewMode>('list');
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) setView('list');
  }, [isMobile]);

  return (
    <>
      <Cursor />
      <LocaleToggle />
      {!isMobile && <ViewToggle view={view} onChange={setView} />}

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
