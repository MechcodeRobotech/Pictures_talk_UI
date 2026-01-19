import './App.css'
import { SignedIn, SignedOut, SignIn, UserButton } from '@clerk/clerk-react'
import { Navigate, Route, Routes, Link } from 'react-router-dom'

function LoginPage() {
  return (
    <main>
      <SignedIn>
        <Navigate to="/" replace />
      </SignedIn>
      <SignedOut>
        <SignIn />
      </SignedOut>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <header>
            <SignedOut>
              <Link to="/login">Log in</Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
