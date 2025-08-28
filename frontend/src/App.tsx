import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/Footer.tsx";
import { useEffect } from "react";
import PageLoading from "./components/PageLoading.tsx";
import Join from "./pages/Join.tsx";
import Room from "./pages/Room.tsx";
import Navbar from "./components/Navbar.tsx";
import About from "./pages/About.tsx";
import Practice from "./pages/Practice.tsx";
import Contact from "./pages/Contact.tsx";
import axios from "./services/axios.ts";
import { useState } from "react";

export default function App() {
  const [user, setUser] = useState<{ email: string, username: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/auth")

        if (response.data.success) {
          setUser(response.data.user)
        } else {
          setUser(null)
        }
      } catch (err: any) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await axios.post("/auth/logout");

      if (response.data.success) {
        console.log("Successfully logged out");
        setUser(null);
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <PageLoading />
    )
  }

  return (
    <div data-theme="light">
      <Routes>
        <Route path="/" element={<Footer><Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout}><Home /></Navbar></Footer>} />
        <Route path="/register" element={!Boolean(user) ? (<Footer><Register /></Footer>) : <Navigate to={"/"} />} />
        <Route path="/login" element={!Boolean(user) ? <Footer><Login /></Footer> : <Navigate to={"/"} />} />
        <Route path="/join" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout}><Join /></Navbar>} />
        <Route path="/room/:code" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout}><Room /></Navbar>} />
        <Route path="/about" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout}><Footer><About /></Footer></Navbar>} />
        <Route path="/practice" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout}><Practice /></Navbar>} />
        <Route path="/contact" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout}><Footer><Contact /></Footer></Navbar>} />
      </Routes>
    </div>
  )
}