import { useEffect, useState } from 'react'


import LoginForm from '../components/forms/LoginForm'
import RegisterForm from '../components/forms/RegisterForm';


export default function LoginTesting() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div>
            <h1>Login testing</h1>
            <button onClick={() => setIsLogin(!isLogin)}>Switch login/register</button>
            {
                isLogin ? <LoginForm/> : <RegisterForm/>
            }
        </div>
    )
}