import React from 'react'
import { Link } from 'react-router'
import '../style/landing.scss'

const steps = [
    {
        number: '01',
        title: 'Upload your resume',
        text: 'Add your PDF resume so InterviewAI can understand your background, strengths, and experience.'
    },
    {
        number: '02',
        title: 'Paste the job description',
        text: 'Define the role you want. The system reads requirements, keywords, seniority, and hidden signals.'
    },
    {
        number: '03',
        title: 'Generate your prep plan',
        text: 'Get match score, likely questions, skill gaps, roadmap, and resume guidance in one focused report.'
    }
]

const features = [
    ['Role-based match score', 'See how closely your resume aligns with the exact role you are targeting.', '87%'],
    ['Technical and behavioral questions', 'Practice high-probability questions shaped around the job description.', 'Q/A'],
    ['Skill gap analysis', 'Identify what to sharpen before the interview, with clear priority signals.', 'GAP'],
    ['Preparation roadmap', 'Follow a structured plan that turns prep into daily execution.', 'MAP'],
    ['ATS-friendly resume', 'Generate a tailored resume version designed for parser clarity.', 'PDF'],
    ['Recent interview plans', 'Return to previous targets and keep iterating as your search evolves.', 'LOG']
]

const Landing = () => (
    <main className='landing-page'>
        <div className='landing-noise' aria-hidden='true' />
        <span className='data-node data-node--one' aria-hidden='true' />
        <span className='data-node data-node--two' aria-hidden='true' />
        <span className='data-node data-node--three' aria-hidden='true' />

        <nav className='landing-nav'>
            <Link className='landing-logo' to='/'>InterviewAI</Link>
            <div className='landing-nav__links'>
                <a href='#features'>Features</a>
                <a href='#method'>Method</a>
                <a href='#vision'>Vision</a>
            </div>
            <div className='landing-nav__actions'>
                <Link to='/login'>Login</Link>
                <Link className='landing-nav__cta' to='/register'>Begin</Link>
            </div>
        </nav>

        <section className='landing-hero'>
            <div className='landing-kicker'>
                <i />
                InterviewAI
            </div>
            <h1>Turn any job description into a focused interview plan.</h1>
            <p>Upload your resume, paste the role, and build a personalized prep strategy with match scoring, skill gaps, likely questions, and an ATS-friendly resume.</p>
            <div className='landing-hero__actions'>
                <Link className='landing-btn landing-btn--primary' to='/register'>Get Started</Link>
                <Link className='landing-btn landing-btn--ghost' to='/login'>Login</Link>
            </div>

            <div className='product-preview' aria-label='InterviewAI product preview'>
                <div className='preview-scan' />
                <div className='preview-sidebar'>
                    <span />
                    <span />
                    <span />
                </div>
                <div className='preview-main'>
                    <div className='preview-upload'>
                        <i />
                        <div>
                            <strong>Resume uploaded</strong>
                            <span>PDF parsed and ready</span>
                        </div>
                    </div>
                    <div className='preview-bars'>
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className='preview-question'>
                        <strong>Technical question</strong>
                        <span>How would you design a scalable candidate matching flow?</span>
                    </div>
                </div>
                <div className='preview-score'>
                    <div className='score-ring'>
                        <strong>87</strong>
                        <span>%</span>
                    </div>
                    <p>Role match</p>
                    <div className='preview-tags'>
                        <span>React</span>
                        <span>System Design</span>
                        <span>API</span>
                    </div>
                </div>
            </div>
        </section>

        <section className='landing-section' id='method'>
            <div className='section-heading'>
                <span>The Architecture Of Prep</span>
                <h2>Three moves from uncertainty to a plan.</h2>
            </div>
            <div className='steps-grid'>
                {steps.map(step => (
                    <article className='step-card' key={step.number}>
                        <span className='step-card__number'>{step.number}</span>
                        <div className='step-card__icon' />
                        <h3>{step.title}</h3>
                        <p>{step.text}</p>
                    </article>
                ))}
            </div>
        </section>

        <section className='landing-section' id='features'>
            <div className='section-heading section-heading--left'>
                <span>Precision Capabilities</span>
                <h2>Everything you need before the interview room.</h2>
            </div>
            <div className='feature-grid'>
                <div className='capability-field' aria-hidden='true'>
                    <span />
                    <span />
                    <span />
                </div>
                {features.map(([title, text, stat], index) => (
                    <article className={`feature-card feature-card--${index + 1}`} key={title}>
                        <div className='feature-card__beacon' aria-hidden='true' />
                        <div className='feature-card__mark'>{stat}</div>
                        <h3>{title}</h3>
                        <p>{text}</p>
                    </article>
                ))}
            </div>
        </section>

        <section className='report-preview-section'>
            <div className='report-copy'>
                <span>Report Preview</span>
                <h2>See the role through a sharper lens.</h2>
                <p>InterviewAI turns a raw job post into questions, gaps, score signals, and a roadmap you can actually follow.</p>
                <Link className='landing-btn landing-btn--primary' to='/register'>Create Account</Link>
            </div>
            <div className='mini-report'>
                <div className='mini-report__nav'>
                    <span className='active' />
                    <span />
                    <span />
                </div>
                <div className='mini-report__content'>
                    <h3>Technical Questions</h3>
                    <div className='mini-row' />
                    <div className='mini-row short' />
                    <div className='mini-row' />
                </div>
                <div className='mini-report__aside'>
                    <div className='mini-score'>87%</div>
                    <span>Skill gaps</span>
                    <i />
                    <i />
                </div>
            </div>
        </section>

        <section className='final-cta'>
            <h2>Ready to build your next interview plan?</h2>
            <p>Start with your resume and the role you want. InterviewAI will handle the structure.</p>
            <div>
                <Link className='landing-btn landing-btn--primary' to='/register'>Create Account</Link>
                <Link className='landing-btn landing-btn--ghost' to='/login'>Login</Link>
            </div>
        </section>

        <section className='vision-panel' id='vision'>
            <h2>The Vision Behind InterviewAI</h2>
            <p>Modern hiring is noisy. InterviewAI helps candidates decode the role, focus their preparation, and walk into interviews with a strategy that matches the job they actually want.</p>
        </section>

        <footer className='landing-footer'>
            <Link to='/' className='landing-logo'>InterviewAI</Link>
            <div>
                <a href='#method'>Architecture</a>
                <a href='#features'>Features</a>
                <a href='#vision'>Vision</a>
                <Link to='/connect'>Connect</Link>
                <Link to='/login'>Login</Link>
            </div>
            <span>Built for focused interview preparation.</span>
        </footer>
    </main>
)

export default Landing
