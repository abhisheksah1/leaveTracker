import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />
      {/* Global ToastContainer */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </>
  );
}

export default App;
