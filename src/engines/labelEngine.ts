import type { Tag } from '../types/elephant'

interface TagRule {
  tag: Tag
  pattern: RegExp
}

const TAG_RULES: TagRule[] = [
  {
    tag: 'Finance',
    pattern: /\b(gst|invoice|tax|salary|payment|bill|budget|expense|cost|money|bank|loan|emi|fund|cash|profit|loss|revenue|account|ledger|credit|debit|payroll|fee|charge|receipt|balance|finance|rupee|rs\.?|inr|paise|crore|lakh)\b/i,
  },
  {
    tag: 'Work',
    pattern: /\b(meeting|email|report|deadline|client|project|office|task|presentation|call|review|proposal|manager|team|work|job|hr|colleague|boss|target|kpi|followup|follow.up|sprint|standup|ticket|issue|deploy|release)\b/i,
  },
  {
    tag: 'Health',
    pattern: /\b(doctor|hospital|medicine|gym|workout|run|walk|diet|sleep|health|exercise|yoga|meditation|appointment|clinic|pharmacy|tablet|vitamin|pain|headache|fever|weight|fitness|mental|stress|rest|tired)\b/i,
  },
  {
    tag: 'Learning',
    pattern: /\b(book|read|course|study|learn|research|article|video|podcast|tutorial|skill|practice|training|class|exam|certificate|degree|note|chapter|concept|understand|explore)\b/i,
  },
  {
    tag: 'Personal',
    pattern: /\b(family|home|house|rent|grocery|shopping|friend|birthday|anniversary|vacation|travel|trip|marriage|wedding|festival|diwali|eid|holi|gift|party|cook|food|dinner|lunch|breakfast|chai|coffee)\b/i,
  },
  {
    tag: 'Urgent',
    pattern: /\b(urgent|asap|immediately|today|tonight|now|critical|emergency|deadline|overdue|pending|must|important|priority|aaj|abhi|jaldi|turant)\b/i,
  },
  {
    tag: 'Project',
    pattern: /\b(siteos|jbfinance|elephant|app|website|feature|bug|fix|build|design|database|api|server|deploy|github|supabase|code|develop|implement|module|component|ui|ux)\b/i,
  },
  {
    tag: 'People',
    pattern: /\b(call|message|whatsapp|contact|meet|discuss|tell|inform|remind|ask|reply|respond|notify|send|share|connect|introduce|refer|milton|jayesh)\b/i,
  },
]

export function inferTags(text: string): Tag[] {
  const matched = TAG_RULES
    .filter(rule => rule.pattern.test(text))
    .map(rule => rule.tag)

  return matched.length > 0 ? matched : ['Uncategorized']
}
