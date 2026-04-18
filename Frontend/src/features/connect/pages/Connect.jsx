import React from 'react'
import { Link } from 'react-router'
import { appRoutes, externalLinkProps, siteBrand, socialLinks } from '../../../config/site'
import '../style/connect.scss'

const connectCopy = {
    eyebrow: 'Connect With Us',
    title: 'Built by Neelabhra for sharper interview preparation.',
    text: `${siteBrand.name} is designed to help candidates move from uncertainty to a focused plan. For feedback, collaboration, or product conversations, connect directly on LinkedIn.`,
    button: 'Open LinkedIn',
    creator: 'Neelabhra De',
    signal: 'Career tools, AI workflows, and better prep systems.'
}

const Connect = () => (
    <main className='connect-page'>
        <div className='connect-grid' aria-hidden='true' />
        <span className='connect-node connect-node--one' aria-hidden='true' />
        <span className='connect-node connect-node--two' aria-hidden='true' />

        <nav className='connect-nav'>
            <Link to={appRoutes.landing} className='connect-logo'>{siteBrand.name}</Link>
            <div>
                <Link to={appRoutes.landing}>Home</Link>
                <Link to={appRoutes.login}>Login</Link>
                <Link to={appRoutes.register}>Register</Link>
            </div>
        </nav>

        <section className='connect-hero'>
            <div className='connect-copy'>
                <p className='connect-eyebrow'>{connectCopy.eyebrow}</p>
                <h1>{connectCopy.title}</h1>
                <p>{connectCopy.text}</p>
                <a className='connect-button' href={socialLinks.linkedIn} {...externalLinkProps}>
                    <span>{connectCopy.button}</span>
                    <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
                        <path d='M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3Z' />
                        <path d='M5 5h6v2H7v10h10v-4h2v6H5V5Z' />
                    </svg>
                </a>
            </div>

            <div className='connect-visual' aria-hidden='true'>
                <div className='profile-card-3d'>
                    <div className='profile-card-3d__face profile-card-3d__face--front'>
                        <div className='profile-avatar'>ND</div>
                        <span>Creator</span>
                        <strong>{connectCopy.creator}</strong>
                        <i>LinkedIn / {siteBrand.name}</i>
                    </div>
                    <div className='profile-card-3d__face profile-card-3d__face--back'>
                        <span>Signal</span>
                        <strong>{connectCopy.signal}</strong>
                    </div>
                </div>
                <div className='connect-orbit connect-orbit--one' />
                <div className='connect-orbit connect-orbit--two' />
            </div>
        </section>
    </main>
)

export default Connect
