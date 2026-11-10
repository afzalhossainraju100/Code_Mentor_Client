import { LuMinus, LuTrendingDown, LuTrendingUp } from 'react-icons/lu'
import { masteryColor } from '../lib/format'
import type { AnalyticsData } from '../types'

/** Topic-wise improvement: mastery, success rate and the change over the last 7 days. */
export function TopicProgress({ topics }: { topics: AnalyticsData['topics'] }) {
  return (
    <ul className="space-y-4">
      {topics.map((topic) => {
        const TrendIcon = topic.trend > 0 ? LuTrendingUp : topic.trend < 0 ? LuTrendingDown : LuMinus
        const trendColor = topic.trend > 0 ? 'text-emerald-300' : topic.trend < 0 ? 'text-rose-300' : 'text-ink-500'
        return (
          <li key={topic.topic}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-semibold text-ink-100">{topic.label}</span>
              <span className="flex items-center gap-3 text-xs text-ink-400">
                <span>{topic.solved}/{topic.total} solved</span>
                <span>{topic.successRate === null ? '—' : `${topic.successRate}% pass`}</span>
                <span className={`flex w-14 items-center justify-end gap-1 font-semibold ${trendColor}`} title="Change in mastery over the last 7 days">
                  <TrendIcon aria-hidden="true" /> {topic.trend > 0 ? `+${topic.trend}` : topic.trend}
                </span>
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
                <div className={`h-full rounded-full ${masteryColor(topic.mastery, topic.started)}`} style={{ width: `${topic.mastery}%` }} />
              </div>
              <span className="w-10 text-right text-xs font-semibold tabular-nums text-ink-300">{topic.started ? `${topic.mastery}%` : '—'}</span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
