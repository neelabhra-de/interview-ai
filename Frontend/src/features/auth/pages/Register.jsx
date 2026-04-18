import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import "../auth.form.scss"

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleRegister({ username, email, password })
            navigate("/", { replace: true })
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Could not create your account. Please try again.")
        }
    }

    if (loading) {
        return (
            <main className='auth-page'>
                <div className='auth-loader'>
                    <span />
                    <h1>Creating your workspace...</h1>
                </div>
            </main>
        )
    }

    return (
        <main className='auth-page'>
            <section className='auth-shell auth-shell--register'>
                <div className='auth-orbit' aria-hidden='true'>
                    <span />
                    <span />
                    <span />
                </div>

                <div className='auth-copy'>
                    <p className='auth-eyebrow'>Interview AI</p>
                    <h1>Build your edge.</h1>
                    <p>Turn a job description and your resume into focused practice that feels made for the room.</p>
                </div>

                <div className='form-container'>
                    <div className='form-header'>
                        <p>Create account</p>
                        <h2>Start your interview plan</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && <p className='auth-error'>{error}</p>}
                        <div className='input-group'>
                            <label htmlFor='username'>Username</label>
                            <input
                                value={username}
                                onChange={(e) => { setUsername(e.target.value) }}
                                type='text'
                                id='username'
                                name='username'
                                placeholder='Choose a username'
                                autoComplete='username'
                                required />
                        </div>
                        <div className='input-group'>
                            <label htmlFor='email'>Email</label>
                            <input
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                                type='email'
                                id='email'
                                name='email'
                                placeholder='you@example.com'
                                autoComplete='email'
                                required />
                        </div>
                        <div className='input-group'>
                            <label htmlFor='password'>Password</label>
                            <input
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                                type='password'
                                id='password'
                                name='password'
                                placeholder='Create password'
                                autoComplete='new-password'
                                required />
                        </div>

                        <button className='auth-button' type='submit'>Register</button>
                    </form>

                    <p className='auth-switch'>Already joined? <Link to='/login'>Login</Link></p>
                </div>
            </section>
        </main>
    )
}

export default Register
