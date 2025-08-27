import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/Footer.tsx";
import { useEffect } from "react";
import PageLoading from "./components/PageLoading.tsx";
import useAuthentication from "./hooks/useAuthentication.tsx";
import Join from "./pages/Join.tsx";
import Room from "./pages/Room.tsx";
import Navbar from "./components/Navbar.tsx";
import About from "./pages/About.tsx";
import Practice from "./pages/Practice.tsx";
import Contact from "./pages/Contact.tsx";

export default function App(){
  const { loading, user, checkAuthentication } = useAuthentication();

  useEffect(() => {
    checkAuthentication();
  }, [])

  const isAuthenticated = Boolean(user);

  if (loading) {
    return (
      <PageLoading/>
    )
  }

  return (
    <div data-theme="light">
      <Routes>
        <Route path="/" element={<Footer><Navbar><Home/></Navbar></Footer>}/>
        <Route path="/register" element={!isAuthenticated ? (<Footer><Register/></Footer>) : <Navigate to={"/"}/>}/>
        <Route path="/login" element={!isAuthenticated ? <Footer><Login/></Footer> : <Navigate to={"/"}/>} />
        <Route path="/join" element={<Navbar><Join/></Navbar>}/>
        <Route path="/room/:code" element={<Navbar><Room/></Navbar>}/>
        <Route path="/about" element={<Navbar><Footer><About/></Footer></Navbar>}/>
        <Route path="/practice" element={<Navbar><Practice/></Navbar>}/>
        <Route path="/contact" element={<Navbar><Footer><Contact/></Footer></Navbar>}/>
      </Routes>
    </div>
  )
}