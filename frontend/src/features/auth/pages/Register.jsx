import { useState } from 'react';
import "./Register.css"
import navBar from "../../../shared/components/navBar.jsx"
import { register } from '../authService.jsx';
import { useNavigate } from 'react-router';

function Register() {
    
    let navigate = useNavigate();
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
        }else if (!email_input.checkValidity()) {
            setErrLabel("Enter a valid email. Check for typos and make sure the format is example@xyz.com.");
        } else if (pass_input.validity.valueMissing) {
            setErrLabel("Enter a password.")
        } else if (pass_input.validity.tooShort) {
            setErrLabel("The minimum password length is 8 symbols.")
        } else if (!pass_input.checkValidity()) {
            setErrLabel("Enter a valid password. Ensure the password has at least 1 uppercase, lowercase letters and a digit.");
        } else {
            setErrLabel('');
            try {
                setLoading(true);
                const response = await register({
                    "email": email,
                    "password": pass
                });
                setLoading(false);
                if (response.status == 201) {
                    setErrLabel(<>Successfully registered! You can <a href='/login/'>log in</a> now.</>)
                    setLabelType(1)
                } else {
                    throw new Error(response);
                }

            } catch (err) {
                setLoading(false);
                setErrLabel("Something went wrong during registration. Please, try again later.");
                if (err.status == 422) {
                    setErrLabel("Enter a valid email. Check for typos and make sure the format is example@xyz.com.")
                } else if (err.status == 500) {
                    setErrLabel("Internal server error. Please, try again later.")
                } else if (err.status == 409) { // Conflict
                    setErrLabel("This email is already registered! Try to log in.")
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
                <h1>Sign up for free</h1>
                <h3>We recommend using your <strong>work email</strong> - it keeps work and life separate.</h3>
                <form onSubmit={handleSubmit} noValidate labelType={labelType} err={errLabel}>
                    <label className="form_label">Work Email</label>
                    <input 
                        id='email'
                        type="email" 
                        placeholder="Work Email"
                        value={email}
                        onChange={handleChangeEmail}
                        autoComplete='email'
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
                            "Register with email"
                        )}
                    </button>
                </form>
            </div>
        </>
    )
}

export default Register;