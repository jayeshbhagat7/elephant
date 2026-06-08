import type { Tag } from '../types/elephant'
import { TAG_COLORS } from '../utils/tagColors'

interface Props {
  tag: Tag
  size?: 'sm' | 'xs'
}

export function TagPill({ tag, size = 'sm' }: Props) {
  const { bg, text, border } = TAG_COLORS[tag]
  const padding = size === 'xs' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium font-mono tracking-tight
        ${bg} ${text} ${border} ${padding}`}
    >
      {tag}
    </span>
  )
}
