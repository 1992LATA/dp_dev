import React from 'react'
import './Navbar.css'
export const Navbar = () => {
  return (
    <header className = "header"  >
	<a href = "/" className = "logo">NHT</a>
	
	<nav className = 'Navbar'>
      <a href ='/' > Business Process  </a>	 {/* These are all the tables business process Collection Documents*/}
	  <a href ='/' > Collections  </a>
	  <a href ='/' > Documents </a>
	</nav>
	
	
	</header>
  )
}
export default Navbar