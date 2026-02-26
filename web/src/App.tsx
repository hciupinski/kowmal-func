import React from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate, useLocation} from 'react-router-dom';
import {AnimatePresence, motion} from 'motion/react';
import Header from './components/Header/Header';
import ContactForm from './components/ContactForm/ContactForm';
import Footer from './components/Footer/Footer';
import AdminUpload from './components/AdminUpload/AdminUpload';
import './App.scss';
import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Products from './components/Products/Products';
import Admin from './components/Admin/Admin';
import NotAuthorized from './components/NotAuthorized/NotAuthorized';

const RouteTransition: React.FC<{children: React.ReactNode}> = ({children}) => (
  <motion.div
    initial={{opacity: 0, y: 16}}
    animate={{opacity: 1, y: 0}}
    exit={{opacity: 0, y: -12}}
    transition={{duration: 0.32, ease: 'easeOut'}}
    className="h-full"
  >
    {children}
  </motion.div>
);

const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/gallery" replace />} />
        <Route path="/gallery" element={<RouteTransition><Products /></RouteTransition>} />
        <Route path="/contact" element={<RouteTransition><ContactForm /></RouteTransition>} />
        <Route path="/login" element={<RouteTransition><Login /></RouteTransition>} />
        <Route path="/not-authorized" element={<RouteTransition><NotAuthorized /></RouteTransition>} />
        <Route path="/admin" element={<ProtectedRoute element={<RouteTransition><Admin /></RouteTransition>} />}>
          <Route path="upload" element={<RouteTransition><AdminUpload /></RouteTransition>} />
          <Route path="" element={<Navigate to="upload" />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="appShell">
        <Header />
        <main className="contentShell">
          <div className="contentWrap">
            <AppRoutes />
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
