const STEPS = [
  { title: 'Get a buggy challenge', text: 'Picked for your level and your weakest concept. You know the symptom, but not yet the cause.' },
  { title: 'Investigate like a debugger', text: 'Run the examples, replay the code step by step, and open a hint only when you are stuck.' },
  { title: 'Pass the hidden tests', text: 'Your fix must handle boundaries and inputs you have never seen, not just the examples.' },
  { title: 'Prove you understand', text: 'Solve a twin challenge on the same idea. Your profile and tomorrow’s plan update automatically.' },
]

export function HowItWorks() {
  return (
    <ol className="grid gap-4 md:grid-cols-4">
      {STEPS.map((step, index) => (
        <li key={step.title} className="relative rounded-2xl border border-ink-700 bg-ink-900/60 p-5">
          <span className="grid size-9 place-items-center rounded-full bg-brand-400 text-sm font-extrabold text-ink-950">{index + 1}</span>
          <h3 className="mt-4 font-bold text-ink-100">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-400">{step.text}</p>
        </li>
      ))}
    </ol>
  )
}
