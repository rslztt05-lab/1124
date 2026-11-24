import type { ReactNode } from 'react'
import Sidebar from './Sidebar.tsx'
import Topbar from './Topbar.tsx'

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="content">{children}</main>
      </div>
    </div>
  )
}

export default Layout
