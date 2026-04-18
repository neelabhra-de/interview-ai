import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleLogin({ email, password })
            navigate('/', { replace: true })
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Could not login. Please try again.")
        }
    }

    if (loading) {
        return (
            <main className='auth-page'>
                <div className='auth-loader'>
                    <span />
                    <h1>Opening your workspace...</h1>
                </div>
            </main>
        )
    }


    return (
        <main className='auth-page'>
            <section className='auth-shell'>
                <div className='auth-orbit' aria-hidden='true'>
                    <span />
                    <span />
                    <span />
                </div>

                <div className='auth-copy'>
                    <p className='auth-eyebrow'>Interview AI</p>
                    <h1>Welcome back.</h1>
                    <p>Pick up your prep plan, sharpen your answers, and keep the momentum moving.</p>
                </div>

                <div className='form-container'>
                    <div className='form-header'>
                        <p>Sign in</p>
                        <h2>Continue your preparation</h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && <p className='auth-error'>{error}</p>}
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
                                placeholder='Enter password'
                                autoComplete='current-password'
                                required />
                        </div>
                        <button className='auth-button' type='submit'>Login</button>
                    </form>

                    <p className='auth-switch'>New here? <Link to='/register'>Create an account</Link></p>
                </div>
            </section>
        </main>
    )
}

export default Login
