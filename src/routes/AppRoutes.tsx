import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { LoadingState } from '../components/PageState'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AuthLayout } from '../layout/AuthLayout'
import { DashboardLayout } from '../layout/DashboardLayout'
import { PublicLayout } from '../layout/PublicLayout'
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage'
import { HomePage } from '../pages/HomePage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { SignupPage } from '../pages/SignupPage'

// Signed-in pages are loaded on demand, so the landing page stays fast.
const DashboardPage = lazy(() => import('../pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const ChallengesPage = lazy(() => import('../pages/ChallengesPage').then((module) => ({ default: module.ChallengesPage })))
const PracticePage = lazy(() => import('../pages/PracticePage').then((module) => ({ default: module.PracticePage })))
const RecoveryPlanPage = lazy(() => import('../pages/RecoveryPlanPage').then((module) => ({ default: module.RecoveryPlanPage })))
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })))

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Routes>
        {/* Public marketing pages */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Authentication */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Signed-in learner app */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/practice/:challengeId" element={<PracticePage />} />
            <Route path="/plan" element={<RecoveryPlanPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  )
}
