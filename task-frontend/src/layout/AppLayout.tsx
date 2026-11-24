import { Outlet } from 'react-router'
import Layout from '../components/Layout.tsx'

// Route-ийн бүрхүүл: Layout-ийн дотор хуудас бүрийг (Outlet) харуулна.
function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default AppLayout
