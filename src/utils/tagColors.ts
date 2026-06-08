import type { Tag } from '../types/elephant'

export const TAG_COLORS: Record<Tag, { bg: string; text: string; border: string }> = {
  Finance:       { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
  Work:          { bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200' },
  Health:        { bg: 'bg-rose-50',     text: 'text-rose-700',    border: 'border-rose-200' },
  Learning:      { bg: 'bg-violet-50',   text: 'text-violet-700',  border: 'border-violet-200' },
  Personal:      { bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200' },
  Urgent:        { bg: 'bg-red-50',      text: 'text-red-700',     border: 'border-red-200' },
  Project:       { bg: 'bg-sky-50',      text: 'text-sky-700',     border: 'border-sky-200' },
  People:        { bg: 'bg-orange-50',   text: 'text-orange-700',  border: 'border-orange-200' },
  Uncategorized: { bg: 'bg-stone-100',   text: 'text-stone-500',   border: 'border-stone-200' },
}

// For React Flow graph nodes
export const TAG_NODE_COLOR: Record<Tag, string> = {
  Finance:       '#d1fae5',
  Work:          '#dbeafe',
  Health:        '#ffe4e6',
  Learning:      '#ede9fe',
  Personal:      '#fef3c7',
  Urgent:        '#fee2e2',
  Project:       '#e0f2fe',
  People:        '#ffedd5',
  Uncategorized: '#f5f5f4',
}
