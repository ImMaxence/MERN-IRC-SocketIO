import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Test from './pages/Test';
import Error from './pages/Error';
import Home from './pages/Home';
import io from 'socket.io-client';
const socket = io.connect("http://localhost:8080");

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login socket={socket} />} />
                <Route path='*' element={<Error />} />
                <Route path='/home' element={<Home socket={socket} />} />
                <Route path='/test' element={<Test />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;