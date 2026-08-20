import { useLocale } from '../../i18n/LocaleContext';
import './MindMapSearchBar.css';

const text = {
  en: { placeholder: 'Search name or tag…', tags: 'Tags', clear: 'Clear' },
  ko: { placeholder: '이름 또는 태그 검색…', tags: '태그', clear: '초기화' },
} as const;

interface MindMapSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  allTags: string[];
  activeTags: Set<string>;
  onToggleTag: (tag: string) => void;
  showTags: boolean;
  onToggleShowTags: () => void;
  onClear: () => void;
  hasFilter: boolean;
}

export function MindMapSearchBar({
  value,
  onChange,
  allTags,
  activeTags,
  onToggleTag,
  showTags,
  onToggleShowTags,
  onClear,
  hasFilter,
}: MindMapSearchBarProps) {
  const { locale } = useLocale();
  const t = text[locale];

  return (
    <div className="mindmap-search">
      <div className="mindmap-search-row">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t.placeholder}
          data-cursor-hover
          className="mindmap-search-input"
        />
        <button type="button" data-cursor-hover data-active={showTags} onClick={onToggleShowTags}>
          {t.tags}
        </button>
        {hasFilter && (
          <button type="button" data-cursor-hover className="mindmap-search-clear" onClick={onClear}>
            {t.clear}
          </button>
        )}
      </div>

      {showTags && (
        <ul className="mindmap-search-tags">
          {allTags.map((tag) => (
            <li key={tag}>
              <button type="button" data-cursor-hover data-active={activeTags.has(tag)} onClick={() => onToggleTag(tag)}>
                {tag}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
