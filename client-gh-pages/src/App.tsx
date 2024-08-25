import { HashRouter, Routes, Route } from "react-router-dom";
import Favicon from "react-favicon";

import Navigate from "./sites/Navigate";
import PageNotFound from "./sites/PageNotFound";
import Index from "./sites/Index";

import config from "./config.json";

import 'bootstrap/dist/css/bootstrap.css';

import "./gallery.css";
import './style.css';

function App() {

  return (
    <HashRouter>
      {/* needs basepath */}
      <Navigate basepath={config.basepath} />
      <Favicon url={`${config.basepath}/logo.svg`} />

      <Routes> {/* dont needs basepath */}
        <Route index element={<Index />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </HashRouter>
  )
}

export default App
