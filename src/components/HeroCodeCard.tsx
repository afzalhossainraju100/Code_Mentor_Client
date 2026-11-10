import { motion } from 'motion/react'
import { LuCircleCheck, LuCircleX, LuLightbulb } from 'react-icons/lu'
import { CodeView } from './CodeView'

const SAMPLE = `function sumTo(n) {
  let total = 0
  for (let i = 1; i < n; i++) {
    total += i
  }
  return total
}`

/** Decorative preview of the practice workspace for the landing page. */
export function HeroCodeCard() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-6 rounded-4xl bg-linear-to-tr from-brand-600/25 via-transparent to-sky-500/10 blur-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="card relative p-4 shadow-2xl shadow-black/40"
      >
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-ink-300">Challenge · Sum from 1 to N</span>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">Easy</span>
        </div>
        <CodeView code={SAMPLE} errorLine={3} lineCounts={{ 2: 1, 3: 1, 4: 4, 6: 1 }} />
        <div className="mt-3 grid gap-2 font-mono text-xs sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg border border-rose-400/25 bg-rose-400/5 px-3 py-2 text-rose-200">
            <LuCircleX aria-hidden="true" /> sumTo(5) → 10, expected 15
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/5 px-3 py-2 text-emerald-200">
            <LuCircleCheck aria-hidden="true" /> Syntax · Runs safely
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative mt-4 max-w-xs rounded-xl border border-amber-400/30 bg-ink-900/95 p-3.5 shadow-xl sm:absolute sm:right-6 sm:-bottom-24 sm:mt-0"
      >
        <p className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-amber-300 uppercase">
          <LuLightbulb aria-hidden="true" /> Hint 1 · Where to look
        </p>
        <p className="mt-1 text-sm text-ink-200">Line 4 ran only 4 times. Which number never gets added?</p>
      </motion.div>
    </div>
  )
}
