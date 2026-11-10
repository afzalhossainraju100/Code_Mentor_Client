import { LuChevronLeft } from 'react-icons/lu'
import { Link, useParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/PageState'
import { PracticeWorkspace } from '../components/PracticeWorkspace'
import { useApi } from '../hooks/useApi'
import type { ChallengeDetail } from '../types'

export function PracticePage() {
  const { challengeId = '' } = useParams()
  const { data, error, loading, reload } = useApi<{ challenge: ChallengeDetail }>(`/api/v1/challenges/${encodeURIComponent(challengeId)}`)

  return (
    <>
      <Link to="/challenges" className="mb-5 inline-flex items-center gap-1 text-sm text-ink-400 hover:text-ink-100">
        <LuChevronLeft aria-hidden="true" /> All challenges
      </Link>
      {loading ? (
        <LoadingState label="Loading challenge…" />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data ? (
        // key resets all workspace state when moving to another challenge (e.g. the twin).
        <PracticeWorkspace key={data.challenge.id} challenge={data.challenge} />
      ) : null}
    </>
  )
}
