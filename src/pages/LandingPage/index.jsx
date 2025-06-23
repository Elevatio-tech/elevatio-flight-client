import React from 'react'
import HeaderContact from '../../components/Contact/HeaderContact'
import Header from '../../components/Navbar/Header'
import Hero from '../../components/HeroSection/Hero'
import ElevatioServices from '../../components/ServicesOffered/ElevatioServices'
import WorldMap from '../../components/Extras/WorldMap'
import Footer from '../../components/Footer/Footer'

function LandingPage() {
  return (
    <div className='w-screen h-screen'>
       <HeaderContact/>
       <Header/>
       <Hero/>
       <ElevatioServices/>
       <WorldMap/>
       <Footer/>
    </div>
  )
}

export default LandingPage