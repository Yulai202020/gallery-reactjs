import { HashRouter, Routes, Route } from "react-router-dom";
import Favicon from "react-favicon";

import Home from "./sites/Home";
import PageNotFound from "./sites/PageNotFound";
import Navigate from "./sites/Navigate";

import { basepath } from "./config.json";

import 'bootstrap/dist/css/bootstrap.css';

import "./gallery.css";
import './style.css';

function App() {

  return (
    <HashRouter>
      {/* needs basepath */}
      <Navigate basepath={basepath} />
      <Favicon url={`${basepath}/logo.svg`} />

      <Routes> {/* dont needs basepath */}
        <Route path="/" element={<Home />} />
        <Route path="/:folder" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </HashRouter>
  )
}

export default App
