import React from 'react'
import './resume-builder-loading.scss'

const stickers = Array.from({ length: 9 })

const ResumeBuilderLoading = () => (
    <main className='resume-builder-loading'>
        <div className='rubik-scene' aria-hidden='true'>
            <div className='rubik-cube'>
                <div className='rubik-face rubik-face--front'>
                    {stickers.map((_, index) => <i key={`front-${index}`} />)}
                </div>
                <div className='rubik-face rubik-face--back'>
                    {stickers.map((_, index) => <i key={`back-${index}`} />)}
                </div>
                <div className='rubik-face rubik-face--right'>
                    {stickers.map((_, index) => <i key={`right-${index}`} />)}
                </div>
                <div className='rubik-face rubik-face--left'>
                    {stickers.map((_, index) => <i key={`left-${index}`} />)}
                </div>
                <div className='rubik-face rubik-face--top'>
                    {stickers.map((_, index) => <i key={`top-${index}`} />)}
                </div>
                <div className='rubik-face rubik-face--bottom'>
                    {stickers.map((_, index) => <i key={`bottom-${index}`} />)}
                </div>
            </div>
            <div className='rubik-shadow' />
        </div>

        <section className='resume-builder-copy'>
            <p>Resume Builder</p>
            <h1>Generating an ATS-friendly resume</h1>
            <span>AI is aligning your profile with the role, prioritizing keywords, and polishing the final PDF.</span>
        </section>

        <div className='resume-builder-steps'>
            <span>Matching role keywords</span>
            <span>Structuring impact bullets</span>
            <span>Preparing PDF export</span>
        </div>
    </main>
)

export default ResumeBuilderLoading
