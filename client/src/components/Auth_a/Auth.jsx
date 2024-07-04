import React from 'react';
import Signup from './Signup';
import Signin from './Signin';
import axios from 'axios';
import store from '../../store/index';
import Toast from '../Toast/Toast';
import './Auth.css';
import { Navigate, useNavigate } from 'react-router-dom';

// New function component to wrap the class component
function AuthWrapper(props) {
    const navigate = useNavigate();

    return <Auth navigate={navigate} {...props} />;
}

class Auth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: 'signin',
            showToast: false
        }
    }

    signIn = (email, password) => {
        axios.post('/api/users/login', { email, password }).then(res => {
            if (res.data.success) {
                console.log("inside response data success");
                store.dispatch({
                    type: 'login',
                    _id: res.data.user._id,
                    user: res.data.user,
                    token: res.data.token
                });

                this.props.navigate('/dashboard');
            } else {
                this.setState({
                    showToast: true
                });
                setTimeout(() => {
                    this.setState({ showToast: false })
                }, 3000);
            }
        }).catch(er => {
            this.setState({
                showToast: true
            });
            setTimeout(() => {
                this.setState({ showToast: false })
            }, 3000);
        })
    }

    signUp = ({ firstName, lastName, email, password }) => {
        axios.post('/api/users/register', { firstName, lastName, email, password }).then(res => {
            if (res.data.success) {
                this.setState({ tab: 'signin' });
            }
        }).catch(er => {
            console.log(er);
        })
    }

    changeTab = () => {
        this.setState({
            tab: this.state.tab === 'signup' ? 'signin' : 'signup'
        });
    }

    render() {
        let page = this.state.tab === 'signin' ? <Signin signIn={this.signIn} /> : <Signup signUp={this.signUp} />
        return (
            <div className="auth-wrapper">
                <Toast model={this.state.showToast} message="Incorrect login" backgroundColor="#FF4539" />
                <div className="left">
                    <img src="https://miro.medium.com/v2/resize:fit:1000/1*FBRsnCP9wE84UVW1Kkv5Yw.jpeg" alt="quiz_img" />
                </div>

                <div className="right">
                    <div className="header"><h3>Quizzer</h3> </div>
                    <div className="sub-header">Welcome to Quizzer!</div>
                    {page}
                    <div className="new" onClick={this.changeTab}>{this.state.tab === 'signin' ? 'New to Quiz itt? Sign up here' : 'Already have an account with us? Sign in'}</div>
                </div>
            </div>
        )
    }
}

export default AuthWrapper;
