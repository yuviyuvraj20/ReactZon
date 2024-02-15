import React from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useEffect } from 'react';
import {auth} from './firebase';
import { useStateValue } from './StateProvider';
import Payment from './Payment';
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import Orders from './Orders';
const promise=loadStripe('pk_test_51OhOH0SGOMJC9CuZVtjIUanz06ghu09HRyilnGL4eYugJ9PePQfKAephbVjHyPrzVINoi1joCXr8DTP5BLU9rktN00PUCa4X7H');
function App() {

  const [{},dispatch]=useStateValue();

  useEffect(()=>{
//will only run once when the app component loads.....
auth.onAuthStateChanged(authUser=> {
  console.log('THE USER IS >>>', authUser);
  if(authUser){
    // the user just logged in/the user was logged in

    dispatch({
      type: 'SET_USER',
      user: authUser
    })
  }
  else{
    //the user is logged out
    dispatch({
      type: 'SET_USER',
      user:null
    })
  }
})
  },[])
  return (
    //BEM
    <Router>
    <div className="app">
      <Routes>
        <Route path='/orders' element={<React.Fragment>
          <Header/>
          <Orders />
        </React.Fragment>}></Route>
        <Route path='/login' element={<React.Fragment>
          <Login />
        </React.Fragment>}>
          
        </Route>
        <Route path='/checkout' element={<React.Fragment>
        <Header/>
        <Checkout />
        </React.Fragment>} />
        <Route path='/payment' element={<React.Fragment>
        <Header/>
        <Elements stripe={promise}> 
        <Payment/>
        </Elements>
        </React.Fragment>} />
        <Route path='/' element={<React.Fragment>
        <Header/>
        <Home/>
        
        </React.Fragment>} />
        
      </Routes>
    </div>
    </Router>
  );
}

export default App;
