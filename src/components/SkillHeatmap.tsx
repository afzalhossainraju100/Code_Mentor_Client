import type { AnalyticsData } from '../types'

function tone(rate: number | null) {
  if (rate === null) return 'bg-ink-800 text-ink-500'
  if (rate >= 75) return 'bg-emerald-400/25 text-emerald-200'
  if (rate >= 50) return 'bg-amber-400/20 text-amber-200'
  return 'bg-rose-400/20 text-rose-200'
}

/** Skill Heatmap: success rate per topic and difficulty. Strong = green, weak = red. */
export function SkillHeatmap({ rows }: { rows: AnalyticsData['skillHeatmap'] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] border-separate border-spacing-1.5 text-sm">
        <thead>
          <tr className="text-xs text-ink-400">
            <th scope="col" className="text-left font-medium">Topic</th>
            <th scope="col" className="font-medium">Easy</th>
            <th scope="col" className="font-medium">Medium</th>
            <th scope="col" className="font-medium">Hard</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.topic}>
              <th scope="row" className="pr-2 text-left font-medium text-ink-200">{row.label}</th>
              {row.cells.map((cell) => (
                <td
                  key={cell.difficulty}
                  className={`rounded-lg px-2 py-2.5 text-center font-semibold tabular-nums ${tone(cell.successRate)}`}
                  title={cell.attempts ? `${cell.passed}/${cell.attempts} submissions passed` : 'No attempts yet'}
                >
                  {cell.successRate === null ? '—' : `${cell.successRate}%`}
                  <span className="block text-[10px] font-normal opacity-70">{cell.attempts ? `${cell.attempts} ${cell.attempts === 1 ? 'try' : 'tries'}` : 'untried'}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 flex flex-wrap gap-3 text-[11px] text-ink-500">
        <span className="flex items-center gap-1"><span className="size-2.5 rounded bg-emerald-400/40" /> strong ≥75%</span>
        <span className="flex items-center gap-1"><span className="size-2.5 rounded bg-amber-400/40" /> developing</span>
        <span className="flex items-center gap-1"><span className="size-2.5 rounded bg-rose-400/40" /> weak &lt;50%</span>
      </p>
    </div>
  )
}
