import { useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import RecommendedBooks from './components/RecommendedBooks'
import { useApolloClient } from '@apollo/client'
import { useEffect } from 'react'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button>
          <Link to="/">authors</Link>
        </button>
        <button>
          <Link to="/books">books</Link>
        </button>
        {token && (
          <>
            <button>
              <Link to="/new-book">add book</Link>
            </button>
            <button>
              <Link to="/recommended-books">recommend</Link>
            </button>
            <button onClick={logout}>logout</button>
          </>
        )}
        {!token && (
          <button>
            <Link to="/login">login</Link>
          </button>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/new-book" element={token ? <NewBook /> : <Navigate replace to="/login" />} />
        <Route path="/recommended-books" element={token ? <RecommendedBooks /> : <Navigate replace to="/login" />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </div>
  )
}

export default App
