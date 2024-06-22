import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css'
import HomeScreen from './Components/Components/HomeScreen';
import BoardDetailsScreen from './Components/Components/BoardDetailsScreen';

function App() {

    return(
        <>
            <Router>
                <Routes>
                    <Route path="/" exact element={<HomeScreen/>}/>
                    <Route path="/boards/:id" element={<BoardDetailsScreen/>}/>
                </Routes>
            </Router>
        </>
    )

}

export default App;
