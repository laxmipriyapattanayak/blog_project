import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logoutUser } from '../services/UserService'

const NavBar = () => {

  const navigate = useNavigate()
  const handleLogout = async() => {
    try {
      await logoutUser();
      navigate("/")
    } catch (error) {
      
    }
  }
  return (
    <nav>
        <Link to="/">Home</Link>
        <Link to="/blogs">Blogs</Link>
        <Link to="/create-blog">create blog</Link>
        <Link to="/register">register</Link>
        <Link to="/login">login</Link>
        <Link to="/profile">profile</Link>
        <Link to="/logout" onClick={handleLogout}>logout</Link>

    </nav>
  )
}

export default NavBar