import { HashRouter, Routes, Route } from "react-router-dom";
import Favicon from "react-favicon";

import Home from "./sites/Home";
import Navigate from "./sites/Navigate";
import PageNotFound from "./sites/PageNotFound";

import config from "./config.json";

import 'bootstrap/dist/css/bootstrap.css';

import "./gallery.css";
import './style.css';

function App() {

  return (
    <HashRouter>
      {/* needs basepath */}
      <Navigate basepath={config.basepath} />
      <Favicon url={`${config}/logo.svg`} />

      <Routes> {/* dont needs basepath */}
        <Route index element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </HashRouter>
  )
}

export default App
