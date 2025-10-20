import reactLogo from './assets/react.svg'
import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import AuthComponent from '@features/Auth/AuthComponent'
import Homepage from "@features/Homepage/Homepage"
import Navbar from '@features/Navbar/NavbarComponent'
import Dashboard from '@features/Dashboard/Dashboard'
import { AuthProvider } from '@contexts/AuthContext'
import { OrganizationProvider } from '@contexts/OrganizationContext';
import NotFound from '@features/NotFound'


function Layout() {
  return(
    <>
      <Navbar/>
      <div data-component="layout" className="flex w-full max-w-[2040px] min-h-screen no-mt transition-all duration-500">
        <Outlet />
      </div>
    </>
  )
}
function App() {
  return (
    <AuthProvider>
      <div className='flex justify-center bg-primary text-primary max-w-full min-h-full overflow-x-auto box-border'>
        <Routes>
          <Route path="/" element={<Layout />}>
              <Route index element={<Homepage/>}/>
              <Route path="login" element={<AuthComponent/>}/>
              <Route path="signup" element={<AuthComponent/>}/>
              <Route path="reset-password" element={<AuthComponent/>}/>
              <Route path="reset-password/:resetToken" element={<AuthComponent/>}/>
              <Route path="dashboard" element={
                <OrganizationProvider>
                  <Dashboard/>
                </OrganizationProvider>
            }/>
          </Route>
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
