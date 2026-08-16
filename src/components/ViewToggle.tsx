import { useLocale } from '../i18n/LocaleContext';
import './ViewToggle.css';

export type ViewMode = 'list' | 'mindmap';

const text = {
  en: { list: 'LIST', mindmap: 'MAP' },
  ko: { list: '리스트', mindmap: '마인드맵' },
} as const;

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  const { locale } = useLocale();
  const t = text[locale];

  return (
    <div className="view-toggle">
      <button
        type="button"
        data-cursor-hover
        data-active={view === 'list'}
        onClick={() => onChange('list')}
      >
        {t.list}
      </button>
      <span>/</span>
      <button
        type="button"
        data-cursor-hover
        data-active={view === 'mindmap'}
        onClick={() => onChange('mindmap')}
      >
        {t.mindmap}
      </button>
    </div>
  );
}
