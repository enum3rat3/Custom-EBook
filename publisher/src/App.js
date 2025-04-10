import { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import BookList from './Components/BookList/BookList'
import NewBook from './Components/NewBook/NewBook'
import Home from './Components/Home/Home'

function App () {
  const { keycloak } = useKeycloak()

  if (keycloak.authenticated) {
    console.log(keycloak.tokenParsed)
    const roles = keycloak.tokenParsed?.realm_access?.roles || []
    console.log(roles)
    console.log(keycloak.token)
    if (roles.includes('publisher')) {
      return (
        <>
          <Navbar />
          <Home/>
          <Footer />
        </>
      )
    } else {
      // keycloak.logout()
      return <h1>Access Denied</h1>
    }
  }

  return <button onClick={() => keycloak.login()}>Login</button>
}

export default App
