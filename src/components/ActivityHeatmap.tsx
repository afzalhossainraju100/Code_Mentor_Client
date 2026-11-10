import type { AnalyticsData } from '../types'

function cellColor(attempts: number) {
  if (attempts === 0) return 'bg-ink-800'
  if (attempts === 1) return 'bg-brand-500/30'
  if (attempts <= 3) return 'bg-brand-500/55'
  if (attempts <= 5) return 'bg-brand-400/80'
  return 'bg-brand-300'
}

/** GitHub-style daily activity grid for the last 12 weeks. */
export function ActivityHeatmap({ activity }: { activity: AnalyticsData['activity'] }) {
  const firstWeekday = activity.length ? new Date(`${activity[0].date}T00:00:00`).getDay() : 0
  const cells: (AnalyticsData['activity'][number] | null)[] = [...Array<null>(firstWeekday).fill(null), ...activity]
  const total = activity.reduce((sum, day) => sum + day.attempts, 0)
  const activeDays = activity.filter((day) => day.attempts > 0).length

  return (
    <div>
      <div
        role="img"
        aria-label={`${total} submissions on ${activeDays} days in the last 12 weeks`}
        className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-1"
        style={{ gridAutoColumns: 'minmax(10px, 1fr)' }}
      >
        {cells.map((day, index) =>
          day ? (
            <span
              key={day.date}
              className={`aspect-square rounded-[3px] ${cellColor(day.attempts)}`}
              title={`${new Date(`${day.date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: ${day.attempts} submission${day.attempts === 1 ? '' : 's'}, ${day.solved} passed`}
            />
          ) : (
            <span key={`pad-${index}`} />
          ),
        )}
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-ink-500">
        <span>{total} submissions · {activeDays} active days</span>
        <span className="flex items-center gap-1" aria-hidden="true">
          Less
          {[0, 1, 2, 4, 6].map((value) => <span key={value} className={`size-2.5 rounded-[3px] ${cellColor(value)}`} />)}
          More
        </span>
      </div>
    </div>
  )
}
