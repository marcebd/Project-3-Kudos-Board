import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BoardContainer from './BoardContainer';


function HomeScreen() {

    return(
        <div className='homescreen'>
          <Header/>
          <BoardContainer/>
          <Footer/>
        </div>
    )

}

export default HomeScreen;
