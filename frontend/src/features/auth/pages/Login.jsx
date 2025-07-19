import { useState } from 'react';
import "./Register.css"
import navBar from "../../../shared/components/navBar.jsx"
import { useAuth } from '../useAuth.jsx';

function Login() {

    let { login } = useAuth()
    
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [errLabel, setErrLabel] = useState('');
    const [labelType, setLabelType] = useState(0)
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrLabel("")
        setLabelType(0)
        const email_input = document.getElementById("email")
        const pass_input = document.getElementById("pass")
        if (email_input.validity.valueMissing) {
            setErrLabel("Enter an email.")
        } else if (pass_input.validity.valueMissing) {
            setErrLabel("Enter a password.")
        } else {
            setErrLabel('');
            try {
                setLoading(true);
                const response = await login({
                    "email": email,
                    "password": pass
                });
                setLoading(false);
                if (response.status == 200) {
                    setErrLabel("Login Successful! Redirecting in 5 seconds... (FALSE: TODO REDIRECT)")
                    setLabelType(1)
                } else {
                    throw new Error(response);
                }

            } catch (err) {
                setLoading(false);
                if (err.status == 400) {
                    setErrLabel(<>User with such email was not found. You can <a href='/login/'>register</a>!</>)
                } else if (err.status == 403) {
                    setErrLabel("Wrong password. Please, try again.")
                } else if (err.status == 500) {
                    setErrLabel("Internal server error. Please, try again later.")
                } else {
                    setErrLabel("Something went wrong during registration. Please, try again later.");
                }
            }
        }

    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
        setErrLabel('');
        setLabelType(0);
    }
    const handleChangePass = (e) => {
        setPass(e.target.value);
        setErrLabel('');
        setLabelType(0);
    }

    return (
        <>
            {navBar()}
            <div className="card">
                <h1>Sign in to Miro</h1>
                <form onSubmit={handleSubmit} noValidate labelType={labelType} err={errLabel}>
                    <label className="form_label">Email</label>
                    <input 
                        id='email'
                        type="email" 
                        placeholder="Email"
                        value={email}
                        onChange={handleChangeEmail}
                        required
                    />
                    <label className="form_label">Password</label>
                    <input 
                        pattern='^.*(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$'
                        minLength="8"
                        id='pass'
                        type="password" 
                        placeholder="Password"
                        value={pass}
                        onChange={handleChangePass}
                        required
                    />
                    {<label className="form_label_bottom">{errLabel}</label>}
                    <button type="submit">
                        {loading ? (
                            <>
                                <svg className="spinner" viewBox="0 0 50 50">
                                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                                </svg>
                            </>
                        ) : (
                            "Continue with email"
                        )}
                    </button>
                </form>
            </div>
        </>
    )
}

export default Login;