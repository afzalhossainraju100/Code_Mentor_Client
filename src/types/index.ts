// Shapes of the data returned by the Code Mentor API.

export type Difficulty = 'easy' | 'medium' | 'hard'
export type ChallengeStatus = 'new' | 'attempted' | 'solved'
export type ConceptStatus = 'not-started' | 'learning' | 'solved-once' | 'verified' | 'needs-review'
export type TestCategory = 'logic' | 'boundary'

export type ChallengeSummary = {
  id: string
  title: string
  topic: string
  topicLabel: string
  concept: string
  conceptName: string
  difficulty: Difficulty
  estMinutes: number
  status: ChallengeStatus
}

export type ChallengeDetail = Omit<ChallengeSummary, 'status'> & {
  entry: string
  description: string
  starterCode: string
  hintCount: number
  examples: { id: string; args: unknown[]; expected: unknown; category: TestCategory }[]
  hiddenTests: { id: string; args: unknown[]; category: TestCategory }[]
  status: ChallengeStatus
  attempts: number
  conceptStatus: ConceptStatus
}

export type Hint = {
  level: number
  kind: 'clue' | 'concept' | 'direction'
  title: string
  text: string
  lesson: string | null
  source: 'static' | 'ai'
}

export type GradedTest = {
  id: string
  visible: boolean
  category: TestCategory
  passed: boolean
  timedOut: boolean
  error: { name: string; message: string; line?: number | null } | null
  actualType: string | null
  expectedType: string
  args?: unknown[]
  expected?: string
  actual?: string | null
}

export type VerificationCheck = {
  key: 'syntax' | 'runtime' | 'logic' | 'boundary' | 'output'
  label: string
  status: 'pass' | 'fail' | 'skipped'
  detail: string
}

export type GradeResult = {
  passed: boolean
  testsPassed: number
  testsTotal: number
  syntaxError: { message: string; line: number | null } | null
  missingEntry: boolean
  failureKind: string | null
  checks: VerificationCheck[]
  tests: GradedTest[]
  diagnostics: string[]
}

export type TopicMastery = {
  topic: string
  label: string
  started: boolean
  mastery: number
  attempts: number
  solved: number
  total: number
}

export type Recommendation = {
  challengeId: string
  title: string
  topic: string
  topicLabel: string
  concept: string
  conceptName: string
  difficulty: Difficulty
  estMinutes: number
  reason: string
  reasons: string[]
}

export type SubmissionResponse = {
  attemptId: string
  attemptNumber: number
  result: GradeResult
  explanation: string | null
  lesson: string | null
  verification: {
    status: 'verified' | 'pending'
    message: string
    twin?: { challengeId: string; title: string; difficulty: Difficulty }
  } | null
  mastery: TopicMastery
  next: Recommendation | null
}

export type PlanItem = {
  challengeId: string
  title: string
  topic: string
  topicLabel: string
  concept: string
  conceptName: string
  difficulty: Difficulty
  estMinutes: number
  kind: 'warm-up' | 'review' | 'verify' | 'focus' | 'stretch'
  reason: string
  done: boolean
}

export type DailyPlan = {
  date: string
  focus: string
  totalMinutes: number
  completed: number
  items: PlanItem[]
}

export type Insight = { tone: 'neutral' | 'warning' | 'positive'; text: string; basedOn: string }

export type Evidence = {
  attemptId: string
  challengeId: string
  challengeTitle: string
  createdAt: string
  failureKind: string | null
  diagnostic: string | null
  testsPassed: number
  testsTotal: number
  codeExcerpt: string
}

export type Weakness = {
  concept: string
  topic: string
  label: string
  conceptName: string
  lesson: string
  score: number
  severity: 'high' | 'medium' | 'low'
  confidence: 'high' | 'medium' | 'low'
  trend: 'improving' | 'steady' | 'struggling'
  attempts: number
  fails: number
  repeatedChallenges: number
  challengeCount: number
  hintsUsed: number
  lastSeenAt: string
  evidence: Evidence[]
}

export type SkillProfile = {
  skillScore: number
  bugsFixed: number
  weakTopics: number
  weakTopicLabels: string[]
  streak: number
  submissions: number
  verifiedConcepts: number
  totalConcepts: number
  mastery: TopicMastery[]
}

export type DashboardData = {
  profile: SkillProfile
  insight: Insight
  plan: DailyPlan
  recommendation: Recommendation | null
  topWeakness: Weakness | null
}

export type ConceptInfo = {
  concept: string
  name: string
  topic: string
  status: ConceptStatus
  solved: number
  total: number
}

export type AnalyticsData = {
  stats: {
    submissions: number
    successRate: number | null
    challengesAttempted: number
    bugsFixed: number
    firstTryRate: number | null
    avgSolveTimeSec: number | null
    hintDependency: number | null
    hintsUsed: number
    repeatedMistakes: number
    activeDays: number
    currentStreak: number
    longestStreak: number
  }
  activity: { date: string; attempts: number; solved: number }[]
  topics: (TopicMastery & { successRate: number | null; trend: number })[]
  skillHeatmap: {
    topic: string
    label: string
    cells: { difficulty: Difficulty; attempts: number; passed: number; successRate: number | null }[]
  }[]
  dna: { key: string; label: string; value: number | null; description: string }[]
  concepts: ConceptInfo[]
  weaknesses: Weakness[]
  recentAttempts: {
    id: string
    challengeId: string
    title: string
    topic: string
    difficulty: Difficulty
    passed: boolean
    failureKind: string | null
    testsPassed: number
    testsTotal: number
    hintsUsed: number
    timeSpentSec: number
    createdAt: string
  }[]
}

export type ReviewItem = {
  concept: string
  label: string
  conceptName: string
  topic: string
  dueDate: string
  due: boolean
  stage: number
  stages: number
  lastMistakeDaysAgo: number
}

export type PlanData = { plan: DailyPlan; reviews: ReviewItem[] }
