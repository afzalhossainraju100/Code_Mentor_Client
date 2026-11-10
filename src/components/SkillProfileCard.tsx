import { LuBadgeCheck, LuBug, LuGauge, LuTarget } from 'react-icons/lu'
import type { Insight, SkillProfile, TopicMastery } from '../types'
import { MasteryBars } from './MasteryBars'
import { MentorInsight } from './MentorInsight'
import { StatCard } from './StatCard'

type SkillProfileCardProps = {
  profile: Pick<SkillProfile, 'skillScore' | 'bugsFixed' | 'weakTopics'> &
    Partial<Pick<SkillProfile, 'verifiedConcepts' | 'totalConcepts'>> & {
      mastery: Pick<TopicMastery, 'topic' | 'label' | 'mastery' | 'started'>[]
    }
  insight: Insight
  demo?: boolean
}

/** "My Programming Skill Profile": score, bugs fixed, weak topics, concept mastery and mentor insight. */
export function SkillProfileCard({ profile, insight, demo = false }: SkillProfileCardProps) {
  const showVerified = profile.verifiedConcepts !== undefined
  return (
    <section className="card p-5 sm:p-6" aria-labelledby="skill-profile-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="skill-profile-title" className="text-lg font-bold text-ink-100">My Programming Skill Profile</h2>
        {demo && <span className="chip">Demo</span>}
      </div>

      <div className={`mt-5 grid gap-3 ${showVerified ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-3'}`}>
        <StatCard label="Skill Score" value={`${profile.skillScore}%`} icon={<LuGauge />} hint="Average mastery across all five topics." />
        <StatCard label="Bugs Fixed" value={profile.bugsFixed} icon={<LuBug />} tone="good" />
        <StatCard label="Weak Topics" value={profile.weakTopics} icon={<LuTarget />} tone={profile.weakTopics ? 'warn' : 'default'} hint="Started topics with mastery below 50%." />
        {showVerified && (
          <StatCard label="Verified Concepts" value={`${profile.verifiedConcepts}/${profile.totalConcepts}`} icon={<LuBadgeCheck />} hint="Concepts proven by solving two different bugs." />
        )}
      </div>

      <h3 className="mt-7 mb-4 text-base font-bold text-ink-100">Concept Mastery</h3>
      <MasteryBars items={profile.mastery} />

      <div className="mt-6 border-t border-ink-700 pt-5">
        <MentorInsight insight={insight} />
      </div>
    </section>
  )
}
