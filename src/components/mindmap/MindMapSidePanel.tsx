import { motion } from 'framer-motion';
import type { MindmapNode } from '../../data/mindmap/types';
import { useLocale } from '../../i18n/LocaleContext';
import './MindMapSidePanel.css';

const text = {
  en: { close: 'Close detail panel' },
  ko: { close: '상세 패널 닫기' },
} as const;

interface MindMapSidePanelProps {
  node: MindmapNode;
  onClose: () => void;
}

const TYPE_LABEL = {
  en: { root: 'Profile', career: 'Career', project: 'Project', skill: 'Skill', education: 'Education' },
  ko: { root: '프로필', career: '경력', project: '프로젝트', skill: '스킬', education: '학력' },
} as const;

export function MindMapSidePanel({ node, onClose }: MindMapSidePanelProps) {
  const { locale } = useLocale();
  const t = text[locale];
  const detail = node.detail;

  return (
    <motion.div
      className="mindmap-panel"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1, transition: { delay: 0.12, duration: 0.28, ease: 'easeOut' as const } }}
      exit={{ x: '100%', opacity: 0, transition: { duration: 0.2, ease: 'easeIn' as const } }}
      onClick={(event) => event.stopPropagation()}
    >
      <button type="button" className="mindmap-panel-close" data-cursor-hover onClick={onClose} aria-label={t.close}>
        ×
      </button>

      <span className="mindmap-panel-eyebrow">{TYPE_LABEL[locale][node.type]}</span>
      {detail?.period && <span className="mindmap-panel-period">{detail.period}</span>}
      <h3 className="mindmap-panel-title">{node.label}</h3>

      {detail?.summary && <p className="mindmap-panel-summary">{detail.summary}</p>}

      {detail?.images && detail.images.length > 0 && (
        <img className="mindmap-panel-image" src={detail.images[0]} alt={node.label} />
      )}

      {detail?.bullets && detail.bullets.length > 0 && (
        <ul className="mindmap-panel-bullets">
          {detail.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}

      {node.tags.length > 0 && (
        <ul className="mindmap-panel-tags">
          {node.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}

      {detail?.links && detail.links.length > 0 && (
        <div className="mindmap-panel-links">
          {detail.links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" data-cursor-hover>
              {l.label} ↗
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}
