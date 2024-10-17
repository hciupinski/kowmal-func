import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import ContactForm from './components/ContactForm/ContactForm';
import Footer from './components/Footer/Footer';
import AdminUpload from './components/AdminUpload/AdminUpload';
import './App.scss';
import Login from "./components/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Products from "./components/Products/Products";
import Home from "./components/Home/Home";

const App: React.FC = () => {
  return (
    <Router>
      <div className="app flex flex-col min-h-screen h-full bg-black">
        <Header />
        <main className="flex-grow">
          <div className={'container min-w-[75%] min-h-[75%] h-full mx-auto bg-opacity-80 rounded'}>
            <Routes>
              <Route path="/" element={<><Home /><Products /></>} />
              <Route path="/login" element={<Login />} />
              <Route path="/gallery" element={<Products />} />
              <Route path="/contact" element={<ContactForm />} />
              <Route path="/admin/upload" element={<ProtectedRoute element={<AdminUpload />} />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;