import { BrowserRouter, Routes, Route } from "react-router-dom";
import Favicon from "react-favicon";

import Home from "./sites/Home";

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

function App() {

  return (
    <BrowserRouter>
      <Favicon url="/logo.svg" />
      <Routes>
        <Route index element={<Home />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
