import type { Locale } from '../../i18n/LocaleContext';
import { mindmapKo } from './mindmap.ko';
import { mindmapEn } from './mindmap.en';
import type { MindmapData } from './types';

const mindmapByLocale: Record<Locale, MindmapData> = {
  ko: mindmapKo,
  en: mindmapEn,
};

export function getMindmapData(locale: Locale): MindmapData {
  return mindmapByLocale[locale];
}

export type { MindmapData, MindmapNode, MindmapEdge, MindmapNodeDetail, MindmapLink } from './types';
