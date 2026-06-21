import { Routes, Route, Navigate } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Footer from "./components/Footer.tsx";
import { useEffect } from "react";
import PageLoading from "./components/PageLoading.tsx";
import Join from "./pages/Join.tsx";
import Navbar from "./components/Navbar.tsx";
import About from "./pages/About.tsx";
import Practice from "./pages/Practice.tsx";
import Contact from "./pages/Contact.tsx";
import axios from "./services/axios.ts";
import { useThemeStore } from "./store/useThemeStore.ts";
import useAuthentication from "./hooks/useAuthentication.tsx";
import Donate from "./pages/Donate.tsx";
import Settings from "./pages/Settings.tsx";
import Host from "./pages/Host.tsx";
import EnterUsername from "./pages/EnterUsername.tsx";
import { useState } from "react";

export default function App() {
  const { user, setUser, loading, checkAuthentication } = useAuthentication();
  const [revalidating, setRevalidating] = useState(false);
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuthentication();

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        setRevalidating(true);
        checkAuthentication().finally(() => setRevalidating(false));
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");

      setUser(null);
    } catch (err: any) {
      setUser(null);
      console.error(err);
    }
  }

  if (loading) {
    return (
      <PageLoading />
    )
  }

  return (
    <div data-theme={theme} className="overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Footer><Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout} loading={loading}><Home /></Navbar></Footer>} />
        <Route path="/register" element={!Boolean(user) || user?.username === undefined || user?.email === undefined ? (<Footer><Register /></Footer>) : <Navigate to={"/"} />} />
        <Route path="/login" element={!Boolean(user) || user?.username === undefined || user?.email === undefined ? <Footer><Login /></Footer> : <Navigate to={"/"} />} />
        <Route path="/join" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout} loading={loading}><Join /></Navbar>} />
        <Route path="/about" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout} loading={loading}><Footer><About /></Footer></Navbar>} />
        <Route path="/practice" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout} loading={loading}><Practice /></Navbar>} />
        <Route path="/contact" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout} loading={loading}><Footer><Contact /></Footer></Navbar>} />
        <Route path="/donate" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout} loading={loading}><Footer><Donate /></Footer></Navbar>} />
        <Route path="/settings" element={!Boolean(user) ? <Navigate to={"/login"} /> : <Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout} loading={loading}><Footer><Settings /></Footer></Navbar>} />
        <Route path="/room" element={<Navbar username={user?.username} isAuthenticated={Boolean(user)} handleLogout={handleLogout} loading={loading}><Footer><Host /></Footer></Navbar>} />
        <Route path="/username" element={<Footer><EnterUsername /></Footer>} />
      </Routes>
    </div>
  )
}