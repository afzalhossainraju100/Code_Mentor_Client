// TEMPORARY TEST HARNESS (deleted before commit): real pages with a fake signed-in user.
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '../src/index.css'
import { UserContext } from '../src/auth/authContext'
import { DashboardLayout } from '../src/layout/DashboardLayout'
import { AnalyticsPage } from '../src/pages/AnalyticsPage'
import { ChallengesPage } from '../src/pages/ChallengesPage'
import { DashboardPage } from '../src/pages/DashboardPage'
import { PracticePage } from '../src/pages/PracticePage'
import { RecoveryPlanPage } from '../src/pages/RecoveryPlanPage'
import type { User } from 'firebase/auth'

const user = { uid: 'preview-user', email: 'learner@example.com', displayName: 'Preview Learner', photoURL: null } as unknown as User
const value = { user, loading: false, profile: { uid: 'preview-user', email: 'learner@example.com', displayName: 'Preview Learner', photoURL: null }, storage: 'mongodb' as const, syncProfile: async () => {} }

createRoot(document.getElementById('root')!).render(
  <UserContext.Provider value={value}>
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/practice/:challengeId" element={<PracticePage />} />
          <Route path="/plan" element={<RecoveryPlanPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </UserContext.Provider>,
)
