


import axios from 'axios';
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Auth from "./components/Auth_a/Auth"
import Dashboard from './components/Dashboard/Dashboard';
import CreateQuiz from './components/CreateQuiz/CreateQuiz';
import MyQuizzes from './components/MyQuizzes/MyQuizzes';
import CommunityQuizzes from './components/CommunityQuizzes/CommunityQuizzes';
import ViewQuiz from './components/ViewQuiz/ViewQuiz';
import TakeQuiz from './components/TakeQuiz/TakeQuiz';
import ViewResults from './components/ViewResults/ViewResults';
import Profile from './components/Profile/Profile';
import { Navigate } from "react-router-dom";

import store from './store';

axios.defaults.baseURL = "http://localhost:8000";

class App extends React.Component {

  componentDidMount() {
    if (localStorage.getItem('_ID')) {
      axios.get(`/api/users/${localStorage.getItem('_ID')}`).then(res => {
        store.dispatch({
          user: res.data.user,
          type: 'set_user'
        })
      }).catch(er => {
        console.log(er);
      })
    }
  }

  render() {
    return (
      <div className="app">

        <Router>
          <Routes>
            <Route exact path="/" element={<Auth/>}/>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/create-quiz" element={<CreateQuiz/>} />
            <Route path="/my-quizzes" element={<MyQuizzes/>} />
            <Route path="/community-quizzes" element={<CommunityQuizzes/>} />
            <Route path="/view-quiz" element={<ViewQuiz/>} />
            <Route path="/take-quiz" element={<TakeQuiz/>} />
            <Route path="/view-results" element={<ViewResults/>} />
            <Route path="/account" element={<Profile/>} />
            <Route path='*' element={<Navigate to='/' />} /> 
          </Routes>
        </Router>
      </div>
    )
  }
}

export default App;