import { useMemo, type KeyboardEvent } from 'react'
import { highlightLines } from '../lib/highlight'
import { CodeTokens } from './CodeTokens'

type CodeEditorProps = {
  value: string
  onChange: (value: string) => void
  errorLine?: number | null
  fileName?: string
}

const INDENT = '  '

/**
 * Lightweight code editor: a transparent textarea on top of a highlighted copy of the code.
 * Both share one grid cell, so they always have the same size and scroll together.
 * Tab inserts two spaces; Enter keeps the indentation of the current line.
 */
export function CodeEditor({ value, onChange, errorLine, fileName = 'solution.js' }: CodeEditorProps) {
  const lines = useMemo(() => highlightLines(value), [value])

  function insert(textarea: HTMLTextAreaElement, text: string) {
    textarea.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, 'end')
    onChange(textarea.value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    const textarea = event.currentTarget
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      insert(textarea, INDENT)
    } else if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault()
      const before = textarea.value.slice(0, textarea.selectionStart)
      const currentLine = before.slice(before.lastIndexOf('\n') + 1)
      const indent = currentLine.match(/^\s*/)?.[0] ?? ''
      const extra = /[{([]\s*$/.test(currentLine) ? INDENT : ''
      insert(textarea, `\n${indent}${extra}`)
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-950 focus-within:border-brand-400/70">
      <div className="flex h-9 items-center justify-between border-b border-ink-800 px-3 text-[11px] text-ink-400">
        <span className="flex gap-1.5" aria-hidden="true">
          <i className="size-2.5 rounded-full bg-rose-400/80" />
          <i className="size-2.5 rounded-full bg-amber-400/80" />
          <i className="size-2.5 rounded-full bg-emerald-400/80" />
        </span>
        <span className="font-mono">{fileName}</span>
        <span>JavaScript</span>
      </div>

      <div className="code-scroll flex max-h-140 min-h-65 overflow-auto font-mono text-[13px] leading-6">
        <div aria-hidden="true" className="sticky left-0 z-10 shrink-0 bg-ink-950 py-3 pr-3 pl-2 text-right text-ink-500 tabular-nums select-none">
          {lines.map((_, index) => (
            <div key={index} className={index + 1 === errorLine ? 'rounded bg-rose-400/20 px-1 text-rose-200' : 'px-1'}>
              {index + 1}
            </div>
          ))}
        </div>

        <div className="grid min-w-0 flex-1">
          <pre aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 m-0 py-3 pr-6 whitespace-pre text-ink-100">
            {lines.map((tokens, index) => (
              <div key={index} className={index + 1 === errorLine ? 'bg-rose-400/10' : undefined}>
                <CodeTokens tokens={tokens} />
              </div>
            ))}
          </pre>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            wrap="off"
            rows={1}
            aria-label="Code editor"
            className="col-start-1 row-start-1 m-0 resize-none overflow-hidden border-0 bg-transparent py-3 pr-6 whitespace-pre text-transparent caret-brand-300 outline-none selection:bg-brand-400/35"
            style={{ tabSize: 2 }}
          />
        </div>
      </div>
    </div>
  )
}
