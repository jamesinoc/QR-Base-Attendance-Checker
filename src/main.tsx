import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './style/global.css'
import { Homepage } from './pages/home';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<Homepage />} />
        </Routes>
    </BrowserRouter>
)
