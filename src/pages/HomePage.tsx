import { motion } from 'motion/react'
import { LuArrowRight, LuBotOff, LuCircleCheck, LuFingerprint, LuRepeat } from 'react-icons/lu'
import { Link } from 'react-router-dom'
import { useUser } from '../auth/useUser'
import { FeatureGrid } from '../components/FeatureGrid'
import { HeroCodeCard } from '../components/HeroCodeCard'
import { HowItWorks } from '../components/HowItWorks'
import { SkillProfileCard } from '../components/SkillProfileCard'
import type { Insight } from '../types'

const DEMO_PROFILE = {
  skillScore: 72,
  bugsFixed: 18,
  weakTopics: 1,
  mastery: [
    { topic: 'variables', label: 'Variables', mastery: 90, started: true },
    { topic: 'conditions', label: 'Conditions', mastery: 78, started: true },
    { topic: 'loops', label: 'Loops', mastery: 35, started: true },
    { topic: 'functions', label: 'Functions', mastery: 55, started: true },
    { topic: 'arrays', label: 'Arrays', mastery: 70, started: true },
  ],
}

const DEMO_INSIGHT: Insight = {
  tone: 'warning',
  text: "You repeatedly make off-by-one errors in loops. You fixed 3 problems but needed hints in 2 of them. Today's practice will focus on loop boundaries.",
  basedOn: 'Illustrative feedback based on sample activity data.',
}

const STATS = [
  { value: '30', label: 'hand-made bug challenges' },
  { value: '5', label: 'core topics, 15 concepts' },
  { value: '3', label: 'step hint ladder' },
  { value: '0', label: 'answers handed to you' },
]

const DIFFERENCES = [
  { icon: LuBotOff, title: 'It will not just fix it for you', text: 'A chatbot hands you corrected code. Code Mentor makes you find the bug, with hints that point to the idea instead of the answer.' },
  { icon: LuRepeat, title: 'It checks real understanding', text: 'Hidden tests and twin challenges prove you understand the concept, not just this one piece of code.' },
  { icon: LuFingerprint, title: 'It remembers how you learn', text: 'Every attempt feeds your weakness profile and tomorrow’s plan. A chat window forgets you when you close it.' },
]

export function HomePage() {
  const { user } = useUser()
  const primaryCta = user ? { to: '/dashboard', label: 'Go to your dashboard' } : { to: '/signup', label: 'Start learning free' }

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute top-[-20%] left-[-10%] size-[640px] rounded-full bg-brand-600/15 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-4 pt-16 pb-24 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="chip border-brand-400/30 bg-brand-400/10 text-brand-200">
              <span className="size-1.5 rounded-full bg-brand-300 shadow-[0_0_10px] shadow-brand-300" /> Debugging practice for new coders
            </p>
            <h1 className="mt-6 text-4xl leading-[1.05] font-extrabold tracking-tight text-ink-100 sm:text-5xl lg:text-6xl">
              Learn to code by <span className="bg-linear-to-r from-brand-300 to-sky-300 bg-clip-text text-transparent">fixing real bugs.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">
              Code Mentor gives you broken code, guides you with hints that never spoil the answer, checks your fix with hidden tests,
              and builds a personal profile of what you need to practise next.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={primaryCta.to} className="btn-primary px-6 py-3 text-base">
                {primaryCta.label} <LuArrowRight aria-hidden="true" />
              </Link>
              <a href="#how-it-works" className="btn-secondary px-6 py-3 text-base">See how it works</a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-400">
              {['Free to use', 'Runs safely in your browser', 'Google or email sign-in'].map((item) => (
                <li key={item} className="flex items-center gap-1.5"><LuCircleCheck className="text-emerald-300" aria-hidden="true" /> {item}</li>
              ))}
            </ul>
          </motion.div>
          <HeroCodeCard />
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-ink-800 bg-ink-900/50">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-extrabold text-ink-100">{stat.value}</dd>
              <dd className="mt-1 text-sm text-ink-400">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Unique features</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-100 sm:text-4xl">Eight ways Code Mentor turns mistakes into skill</h2>
          <p className="mt-4 text-ink-400">Every feature works today with a transparent rule-based mentor. An AI layer can add natural-language coaching on top, but it is never required.</p>
        </div>
        <div className="mt-14">
          <FeatureGrid />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-ink-800 bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <div className="max-w-2xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-100 sm:text-4xl">Think like a debugger in four steps</h2>
          </div>
          <div className="mt-12">
            <HowItWorks />
          </div>
        </div>
      </section>

      {/* Skill profile demo */}
      <section id="profile-demo" className="mx-auto grid max-w-6xl grid-cols-1 scroll-mt-20 items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow">What you will see</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-100 sm:text-4xl">A skill profile built from your own code</h2>
          <p className="mt-4 leading-relaxed text-ink-400">
            Your Skill Score, bugs fixed and concept mastery update after every submission. The mentor insight explains, in plain words,
            which mistake you repeat and what today’s practice will focus on.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-300">
            {['Mastery rewards independent, first-try fixes more than hint-heavy ones', 'Weak concepts come back on a spaced-repetition schedule', 'Every weakness links to the real attempts behind it'].map((item) => (
              <li key={item} className="flex items-start gap-2"><LuCircleCheck className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" /> {item}</li>
            ))}
          </ul>
        </div>
        <SkillProfileCard profile={DEMO_PROFILE} insight={DEMO_INSIGHT} demo />
      </section>

      {/* Why not just a chatbot */}
      <section className="border-t border-ink-800 bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-ink-100 sm:text-4xl">Why not just ask a chatbot?</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {DIFFERENCES.map(({ icon: Icon, title, text }) => (
              <article key={title} className="card p-6">
                <Icon className="text-brand-300" size={22} aria-hidden="true" />
                <h3 className="mt-4 font-bold text-ink-100">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-brand-400/25 bg-linear-to-br from-brand-600/25 via-ink-900 to-ink-900 px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-100 sm:text-4xl">Your first bug is waiting.</h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-300">Three short warm-up challenges, about ten minutes. Your profile starts learning from the very first attempt.</p>
          <Link to={primaryCta.to} className="btn-primary mt-8 px-7 py-3 text-base">
            {primaryCta.label} <LuArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
