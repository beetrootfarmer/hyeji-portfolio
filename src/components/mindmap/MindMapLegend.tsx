import { useLocale } from '../../i18n/LocaleContext';
import './MindMapLegend.css';

const text = {
  en: {
    career: 'Career (filled)',
    project: 'Project (outline)',
    education: 'Education',
    skill: 'Skill',
    pinned: 'Pinned',
    showRelations: 'Show relation links',
  },
  ko: {
    career: '경력 (채움)',
    project: '프로젝트 (테두리)',
    education: '학력',
    skill: '스킬',
    pinned: '고정됨',
    showRelations: '관계 링크 보기',
  },
} as const;

interface MindMapLegendProps {
  showRelations: boolean;
  onToggleRelations: () => void;
}

export function MindMapLegend({ showRelations, onToggleRelations }: MindMapLegendProps) {
  const { locale } = useLocale();
  const t = text[locale];

  return (
    <div className="mindmap-legend">
      <ul>
        <li>
          <span className="mindmap-legend-swatch swatch-career" />
          {t.career}
        </li>
        <li>
          <span className="mindmap-legend-swatch swatch-project" />
          {t.project}
        </li>
        <li>
          <span className="mindmap-legend-swatch swatch-education" />
          {t.education}
        </li>
        <li>
          <span className="mindmap-legend-swatch swatch-skill" />
          {t.skill}
        </li>
        <li>
          <span className="mindmap-legend-swatch swatch-pinned" />
          {t.pinned}
        </li>
      </ul>
      <button type="button" data-cursor-hover data-active={showRelations} onClick={onToggleRelations}>
        {t.showRelations}
      </button>
    </div>
  );
}
