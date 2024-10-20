import { useState } from "react"
import { useNavigate } from "react-router-dom"

const SignInForm = () => {
    const navigate = useNavigate()
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const handleSignin = async(event) => {
        event.preventDefault()
        const response = await fetch(`http://localhost:3000/auth/signin`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })

        if(response.status === 200) navigate("/home")
    }

    return (
        <>
            <form action="">
                <label htmlFor="email">Enter your email</label>
                <input type="email" name="email" value={ email } onChange={ (e) => setEmail(e.target.value) } />

                <label htmlFor="password">Enter your password</label>
                <input type="password" name="password" value={ password } onChange={ (e) => setPassword(e.target.value) } />

                <button onClick={ handleSignin }>SignIn</button>
            </form>
        </>
    )
}

export default SignInForm