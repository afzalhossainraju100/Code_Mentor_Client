import { motion } from 'motion/react'
import type { IconType } from 'react-icons'
import { LuBug, LuCalendarCheck, LuDna, LuFingerprint, LuLightbulb, LuRepeat, LuScanEye, LuShieldCheck } from 'react-icons/lu'

const FEATURES: { icon: IconType; title: string; text: string }[] = [
  {
    icon: LuBug,
    title: 'Personalized Bug Challenge Engine',
    text: 'You get code that already has a bug. Your past performance decides whether it is easy, medium or hard, and repeated slips in a topic bring a new kind of bug in that same topic.',
  },
  {
    icon: LuShieldCheck,
    title: 'Intelligent Code Verification',
    text: 'Your fix runs against hidden tests that check syntax, logic, boundary conditions and output format. Passing the examples is not enough: it must work for new inputs too.',
  },
  {
    icon: LuScanEye,
    title: 'Visual Bug Execution Analyzer',
    text: 'Replay your code line by line. Watch every variable change and see how many times each loop line ran, so logical errors become visible.',
  },
  {
    icon: LuFingerprint,
    title: 'Weakness Fingerprint',
    text: 'Failed attempts, repeated mistakes, solving time and hint usage become a personal profile, such as “Loop Boundary Problem”, each backed by evidence from your own code.',
  },
  {
    icon: LuLightbulb,
    title: 'Progressive Hint Mentor',
    text: 'Never the corrected code. First a clue about where to look, then the concept, then a specific direction. Hint use is tracked so you never become dependent on it.',
  },
  {
    icon: LuRepeat,
    title: 'Real Understanding Verification',
    text: 'After a fix you get a twin challenge on the same concept with different code. Solve both and the concept is verified, which separates real learning from guessing.',
  },
  {
    icon: LuDna,
    title: 'Learning DNA & Analytics',
    text: 'Daily activity, success rate, repeated mistakes, speed, hint dependency and topic progress, plus a skill heatmap that shows exactly where you are strong or weak.',
  },
  {
    icon: LuCalendarCheck,
    title: 'Adaptive Recovery Plan',
    text: 'A personal 10–15 minute session every day. Old mistakes return at spaced intervals; improve and it gets harder, struggle and it rebuilds your foundation.',
  },
]

export function FeatureGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map(({ icon: Icon, title, text }, index) => (
        <motion.article
          key={title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
          className="card group p-5 transition-colors hover:border-brand-400/40"
        >
          <div className="flex items-center justify-between">
            <span className="grid size-10 place-items-center rounded-xl border border-ink-600 bg-ink-800 text-brand-300 transition-colors group-hover:border-brand-400/50">
              <Icon size={19} aria-hidden="true" />
            </span>
            <span className="font-mono text-xs text-ink-500">0{index + 1}</span>
          </div>
          <h3 className="mt-4 font-bold text-ink-100">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-400">{text}</p>
        </motion.article>
      ))}
    </div>
  )
}
