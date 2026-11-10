import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Navigation } from '../components/Navigation'

/** Marketing pages: top navigation, page content, footer. */
export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
