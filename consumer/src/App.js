import { useEffect, useState } from 'react'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { useKeycloak } from '@react-keycloak/web'
import BookList from './components/BookList/BookList'

function App () {
  const { keycloak } = useKeycloak()

  if (keycloak.authenticated) {
    const roles = keycloak.tokenParsed?.realm_access?.roles || []
    console.log(roles)
    console.log(keycloak.token);
    if (roles.includes('consumer')) {
      return (
        <>
            <Navbar/>
           <BookList/>
            <Footer/>
        </>
      )
    } else {
      keycloak.logout()
      return <h1>Access Denied</h1>
    }
  }

  return <button onClick={() => keycloak.login()}>Login</button>
}

export default App


