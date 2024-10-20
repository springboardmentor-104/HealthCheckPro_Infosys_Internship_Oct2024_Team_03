import { useState } from "react"
import { useNavigate } from "react-router-dom";


const SignupForm = () => {
    const navigate = useNavigate();
    const [ step, setStep ] = useState(1)
    const [ email, setEmail ] = useState("")
    const [ otp, setOtp ] = useState("")
    const [ username, setUserName ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ name, setName ] = useState("")
    const [ dob, setDob ] = useState("")
    const [ gender, setGender ] = useState("Other")
    const [ isSendOTPClicked, setIsSendOTPClicked ] = useState(false)
    const [ otpSuccess, setOtpSuccess ] = useState(false)
    const [ isEmailVerified, setIsEmailVerfied ] = useState(false)
    const [ isRegistered, setIsRegistered ] = useState(false)

    const sendOTP = async() => {
        const response = await fetch(`http://localhost:3000/auth/send-otp`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email })
        })

        if(response.status === 200) {
            console.log("sendotp: success")
            setOtpSuccess(true)
            setIsSendOTPClicked(true)
        }
    }

    const verifyOTP = async() => {
        const response = await fetch(`http://localhost:3000/auth/email-verification`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email, otp })
        })

        if(response.status === 200) {
            console.log("verify otp success")
            setIsEmailVerfied(true)
            setStep(2)
        }
    }

    const registerUser = async() => {
        const response = await fetch(`http://localhost:3000/auth/signup`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email, username, password, name, dateOfBirth: dob, gender })
        })

        if(response.status === 201) {
            console.log("registerUser success")
            setIsRegistered(true)
            setStep(3)
        }
    }

    return (
        <>
            <div className="auth-container">
                <div className="auth-image">
                    
                    <div className="placeholder-image">
                    
                    <img src="/gymman.png" alt="Person in a Gym" />
                    </div>
                </div>
                <div className="auth-form">
                    {/* <Link to="/" className="back-link">← Back</Link> */}
                    <h2>Account Signup</h2>
                    {/* <p className="auth-description">
                        Your commitment to health is paying off. Keep it up!
                    </p> */}
            { 
                step === 1 && (
                    <>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter Your Email"
                            required
                            />
                        </div>
                        {/* <p>Enter your email: </p>
                        <input type="email" value={ email } onChange={(e) => setEmail(e.target.value)} /> */}
                        <button className="" onClick={ sendOTP }>Send OTP</button>

                        {
                            isSendOTPClicked && (
                                <>
                                    {
                                        otpSuccess ? 
                                        <>
                                            <div className="form-group">
                                                <input
                                                type="text"
                                                id="otp"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="Enter OTP"
                                                required
                                                />
                                            </div>
                                            {/* <p>Enter OTP</p>
                                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} /> */}
                                            <button onClick={ verifyOTP }>Verify Your Email</button>
                                        </> : 
                                            <p>something went wrong while sending the OTP</p>
                                    }
                                    
                                </>
                            )
                        }
                    </>
                )
            }

            {
                step === 2 && isEmailVerified && (
                    <>
                        <div className="form-group">
                            <label htmlFor="username">Create Username</label>
                            <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Create your unique username"
                            required
                            />
                        </div>
    
                        <div className="form-group">
                            <label htmlFor="password">Create Password</label>
                            <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password"
                            required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="name">What should we call you?</label>
                            <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateOfBirth">Date of Birth</label>
                            <input
                            type="date"
                            id="dateOfBirth"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            placeholder="Enter Date of Birth"
                            required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="Other">Other</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        
                    
                        <button onClick={ registerUser } className="submit-btn">Register</button>
                        {/* <button onClick={ registerUser }>Register</button> */}
                    </>
                )
            }

            {
                step === 3 && isRegistered && (
                    <>
                        <h2>{email} successfully registered!</h2>
                        <button className="submit-btn" onClick={() => navigate("/signin")}>Log in</button>
                    </>
                )
            }
            </div>
            </div>
        </>
    )
}

export default SignupForm