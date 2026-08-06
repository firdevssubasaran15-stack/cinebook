import { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { EMOTION_TAGS } from '@/constants/emotions';

const TAILWIND_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#f87171', '#fb923c', '#fbbf24', '#facc15', '#a3e635', '#4ade80', '#34d399', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6', '#fb7185'
];

export function useEmotionTags(options = { randomizeColors: false }) {
  const { t } = useLanguage();

  const tags = useMemo(() => {
    let baseTags = EMOTION_TAGS.map(tag => ({
      ...tag,
      // Attempt to translate, fallback to the tag's original label
      label: t(`emotionDiscovery.${tag.id}`) !== `emotionDiscovery.${tag.id}` 
        ? t(`emotionDiscovery.${tag.id}`) 
        : tag.label
    }));

    if (options.randomizeColors) {
      const shuffledColors = [...TAILWIND_COLORS].sort(() => 0.5 - Math.random());
      baseTags = baseTags.map((tag, index) => ({
        ...tag,
        randomColor: shuffledColors[index % shuffledColors.length]
      }));
    }

    return baseTags;
  }, [t, options.randomizeColors]);

  return { tags };
}
