import { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import BookList from './Components/BookList/BookList'
import NewBook from './Components/NewBook/NewBook'
import Home from './Components/Home/Home'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import ChunkList from './Components/ChunkList/ChunkList'
import ProtectedRoute from './Utils/ProtectedRoute'
import Login from './Components/Login/Login'

function App () {
  // const { keycloak } = useKeycloak()

  // if (keycloak.authenticated) {
  //   console.log(keycloak.tokenParsed)
  //   const roles = keycloak.tokenParsed?.realm_access?.roles || []
  //   console.log(roles)
  //   console.log(keycloak.token)
  //   if (roles.includes('publisher')) {
  //     return (
  //       <>
  //         <Navbar />
  //         <Home/>
  //         <Footer />
  //       </>
  //     )
  //   } else {
  //     // keycloak.logout()
  //     return <h1>Access Denied</h1>
  //   }
  // }

  // return <button onClick={() => keycloak.login()}>Login</button>
  const { keycloak } = useKeycloak()
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route
            exact
            path='/publish'
            element={<ProtectedRoute element={<NewBook />} />}
          />
          <Route
            exact
            path='/my-books'
            element={<ProtectedRoute element={<BookList />} />}
          />
          <Route
            exact
            path='/my-book/:id'
            element={<ProtectedRoute element={<ChunkList />} />}
          />
          <Route exact path='/login' element={<Login />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
