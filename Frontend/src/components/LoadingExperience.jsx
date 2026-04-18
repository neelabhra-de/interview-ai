import React from 'react'
import './loading-experience.scss'

const LoadingExperience = ({
    title = 'Loading...',
    subtitle = 'Preparing your workspace.'
}) => (
    <main className='loading-experience'>
        <div className='loading-scene' aria-hidden='true'>
            <div className='loading-ring loading-ring--outer' />
            <div className='loading-ring loading-ring--inner' />
            <div className='loading-cube'>
                <span className='face face--front' />
                <span className='face face--back' />
                <span className='face face--right' />
                <span className='face face--left' />
                <span className='face face--top' />
                <span className='face face--bottom' />
            </div>
            <div className='loading-scan' />
        </div>

        <div className='loading-copy'>
            <p>Interview AI</p>
            <h1>{title}</h1>
            <span>{subtitle}</span>
        </div>

        <div className='loading-steps' aria-hidden='true'>
            <i />
            <i />
            <i />
        </div>
    </main>
)

export default LoadingExperience
