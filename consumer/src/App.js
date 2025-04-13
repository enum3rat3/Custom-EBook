import { useEffect, useState } from 'react'
import { useKeycloak } from '@react-keycloak/web'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import Home from './Components/Home/Home'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'

import Login from './Components/Login/Login'
import ProtectedRoute from './Utils/ProtectedRoute'
import Order from './Components/Order/Order'
import BookList from './Components/BookList/BookList'
import ChunkList from './Components/ChunkList/ChunkList'
import Cart from './Components/Cart/Cart'

function App () {
 
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/books' element={<BookList/>}/>
          <Route exact path='/book/:id' element={<ChunkList/>}/>
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/cart' element={<ProtectedRoute element={<Cart/>}/>} />
          <Route exact path='/orders' element={<ProtectedRoute element={<Order/>}/>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
