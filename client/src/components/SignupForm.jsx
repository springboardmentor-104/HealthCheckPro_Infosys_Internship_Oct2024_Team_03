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
            { 
                step === 1 && (
                    <>
                        <p>Enter your email: </p>
                        <input type="email" value={ email } onChange={(e) => setEmail(e.target.value)} />
                        <button onClick={ sendOTP }>Send OTP</button>

                        {
                            isSendOTPClicked && (
                                <>
                                    {
                                        otpSuccess ? 
                                        <>
                                            <p>Enter OTP</p>
                                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} />
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
                        <p>Create username: </p>
                        <input type="text" value={ username } onChange={(e) => setUserName(e.target.value)} />
                        
                        <p>Create password</p>
                        <input type="text" value={ password } onChange={(e) => setPassword(e.target.value)} />

                        <p>What we should call you?</p>
                        <input type="text" value={ name } onChange={(e) => setName(e.target.value)} />

                        <p>Add your DOB</p>
                        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />

                        <p>Gender:</p>
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="Other">Other</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    

                        <button onClick={ registerUser }>Register</button>
                    </>
                )
            }

            {
                step === 3 && isRegistered && (
                    <>
                        <h2>{email} -- successfully registered!</h2>
                        <button onClick={() => navigate("/login")}>Log in</button>
                    </>
                )
            }
        </>
    )
}

export default SignupForm