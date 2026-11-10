import { useMemo } from 'react'
import { highlightLines } from '../lib/highlight'
import { CodeTokens } from './CodeTokens'

type CodeViewProps = {
  code: string
  /** Line currently executing (visualizer) */
  activeLine?: number | null
  /** Line with a bug or error */
  errorLine?: number | null
  /** How many times each line ran (visualizer heat) */
  lineCounts?: Record<number, number>
  className?: string
}

/** Read-only, syntax-highlighted code with line numbers. */
export function CodeView({ code, activeLine, errorLine, lineCounts, className = '' }: CodeViewProps) {
  const lines = useMemo(() => highlightLines(code), [code])
  const maxCount = lineCounts ? Math.max(1, ...Object.values(lineCounts)) : 1

  return (
    <div className={`code-scroll overflow-auto rounded-xl border border-ink-700 bg-ink-950 py-3 font-mono text-[13px] leading-6 ${className}`}>
      <table className="w-full border-collapse">
        <tbody>
          {lines.map((tokens, index) => {
            const line = index + 1
            const active = line === activeLine
            const error = line === errorLine
            const count = lineCounts?.[line]
            return (
              <tr key={line} className={active ? 'bg-brand-400/15' : error ? 'bg-rose-400/10' : undefined} aria-current={active ? 'step' : undefined}>
                <td className={`w-1 border-l-2 ${active ? 'border-brand-300' : error ? 'border-rose-400' : 'border-transparent'}`} />
                <td className={`w-10 pr-3 text-right align-top tabular-nums select-none ${active ? 'text-brand-200' : 'text-ink-500'}`}>{line}</td>
                <td className="pr-4 whitespace-pre text-ink-100">
                  <CodeTokens tokens={tokens} />
                </td>
                {lineCounts && (
                  <td className="w-14 pr-3 text-right align-top select-none">
                    {count ? (
                      <span
                        className="rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-brand-200"
                        style={{ backgroundColor: `rgb(139 120 246 / ${0.12 + 0.45 * (count / maxCount)})` }}
                        title={`Line ${line} ran ${count} time${count === 1 ? '' : 's'}`}
                      >
                        ×{count}
                      </span>
                    ) : null}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
