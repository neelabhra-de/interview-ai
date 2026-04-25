import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import LoadingExperience from '../../../components/LoadingExperience'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { appRoutes } from '../../../config/site.js'

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const { handleLogout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [isDraggingResume, setIsDraggingResume] = useState(false)
    const [error, setError] = useState("")
    const resumeInputRef = useRef()

    const navigate = useNavigate()
    const jobDescriptionChars = jobDescription.length
    const profileDepthScore = Math.min(100, Math.round(((jobDescription.trim() ? 45 : 0) + (resumeFile ? 35 : 0) + (selfDescription.trim() ? 20 : 0))))

    const handleUserLogout = async () => {
        await handleLogout()
        navigate('/login', { replace: true })
    }

    const validateResumeFile = (file) => {
        setError("")

        if (!file) {
            setResumeFile(null)
            return
        }

        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            setResumeFile(null)
            if (resumeInputRef.current) {
                resumeInputRef.current.value = ""
            }
            setError("Please upload a PDF resume only.")
            return
        }

        if (file.size > 3 * 1024 * 1024) {
            setResumeFile(null)
            if (resumeInputRef.current) {
                resumeInputRef.current.value = ""
            }
            setError("Resume PDF must be 3MB or smaller.")
            return
        }

        setResumeFile(file)
    }

    const handleResumeChange = (event) => {
        validateResumeFile(event.target.files[0])
    }

    const handleResumeDragOver = (event) => {
        event.preventDefault()
        setIsDraggingResume(true)
    }

    const handleResumeDragLeave = () => {
        setIsDraggingResume(false)
    }

    const handleResumeDrop = (event) => {
        event.preventDefault()
        setIsDraggingResume(false)
        validateResumeFile(event.dataTransfer.files[0])
    }

    const handleGenerateReport = async () => {
        setError("")

        if (!jobDescription.trim()) {
            setError("Please paste the job description.")
            return
        }

        if (!resumeFile) {
            setError("Please upload your resume as a PDF.")
            return
        }

        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })

            if (data?._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (error) {
            setError(error.response?.data?.message || "Could not upload your resume PDF. Please try again.")
        }
    }

    if (loading) {
        return (
            <LoadingExperience
                title='Building your interview plan'
                subtitle='AI is analyzing your resume, matching the role, and shaping your prep map.' />
        )
    }

    return (
        <div className='home-page'>

            <nav className='workspace-actions'>
                <button type='button' className='workspace-action workspace-action--active' onClick={() => navigate('/interview')}>
                    <span>Home</span>
                </button>
                <button type='button' className='workspace-action workspace-action--logout' onClick={handleUserLogout}>
                    <span>Logout</span>
                </button>
            </nav>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            <section className='prep-insights'>
                <article className='insight-card insight-card--readiness'>
                    <p className='insight-card__label'>Prep Readiness</p>
                    <div className='insight-card__value'>
                        <strong>{profileDepthScore}</strong>
                        <span>%</span>
                    </div>
                    <div className='insight-meter'>
                        <i style={{ width: `${profileDepthScore}%` }} />
                    </div>
                </article>
                <article className='insight-card'>
                    <p className='insight-card__label'>Job Description Depth</p>
                    <p className='insight-card__meta'>{jobDescriptionChars} / 5000 chars</p>
                    <small>{jobDescriptionChars >= 600 ? 'Great detail level' : 'Add role responsibilities and stack keywords'}</small>
                </article>
                <article className='insight-card'>
                    <p className='insight-card__label'>Profile Source</p>
                    <p className='insight-card__meta'>{resumeFile ? 'Resume PDF attached' : 'Waiting for resume PDF'}</p>
                    <small>{resumeFile ? resumeFile.name : 'Upload your resume for stronger match scoring'}</small>
                </article>
            </section>

            <section className='workspace-hub'>
                <div className='workspace-hub__main'>
                    {/* Main Card */}
                    <div className='interview-card'>
                        <div className='interview-card__body'>

                            {/* Left Panel - Job Description */}
                            <div className='panel panel--left'>
                                <div className='panel__header'>
                                    <span className='panel__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                    </span>
                                    <h2>Target Job Description</h2>
                                    <span className='badge badge--required'>Required</span>
                                </div>
                        <textarea
                            onChange={(e) => { setJobDescription(e.target.value) }}
                            value={jobDescription}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className='char-counter'>{jobDescriptionChars} / 5000 chars</div>
                            </div>

                            {/* Vertical Divider */}
                            <div className='panel-divider' />

                            {/* Right Panel - Profile */}
                            <div className='panel panel--right'>
                                <div className='panel__header'>
                                    <span className='panel__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </span>
                                    <h2>Your Profile</h2>
                                </div>

                                {/* Upload Resume */}
                                <div className='upload-section'>
                                    <label className='section-label'>
                                        Upload Resume
                                        <span className='badge badge--best'>Best Results</span>
                                    </label>
                                    <label
                                        className={`dropzone ${isDraggingResume ? "dropzone--active" : ""}`}
                                        htmlFor='resume'
                                        onDragOver={handleResumeDragOver}
                                        onDragLeave={handleResumeDragLeave}
                                        onDrop={handleResumeDrop}>
                                        <span className='dropzone__icon'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                        </span>
                                        <p className='dropzone__title'>{resumeFile ? resumeFile.name : "Click to upload or drag & drop"}</p>
                                        <p className='dropzone__subtitle'>PDF only (Max 3MB)</p>
                                        <input ref={resumeInputRef} hidden type='file' id='resume' name='resume' accept='.pdf,application/pdf' onChange={handleResumeChange} />
                                    </label>
                                </div>

                                {/* OR Divider */}
                                <div className='or-divider'><span>OR</span></div>

                                {/* Quick Self-Description */}
                                <div className='self-description'>
                                    <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                                    <textarea
                                        onChange={(e) => { setSelfDescription(e.target.value) }}
                                        value={selfDescription}
                                        id='selfDescription'
                                        name='selfDescription'
                                        className='panel__textarea panel__textarea--short'
                                        placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                    />
                                </div>

                                {/* Info Box */}
                                <div className='info-box'>
                                    <span className='info-box__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                                    </span>
                                    <p>A <strong>Resume PDF</strong> and <strong>Job Description</strong> are required to generate a personalized plan.</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Footer */}
                        <div className='interview-card__footer'>
                            <span className='footer-info'>{error || "AI-Powered Strategy Generation - Approx 30s"}</span>
                            <div className='footer-actions'>
                                <button
                                    onClick={handleGenerateReport}
                                    className='generate-btn'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                                    Generate My Interview Strategy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <aside className='workspace-hub__side'>
                    <section className='mock-feature-strip mock-feature-strip--side'>
                        <div className='mock-feature-strip__copy'>
                            <span className='mock-badge'>New: Mock Interview Arena</span>
                            <h2>Practice answer-by-answer with instant scoring.</h2>
                            <p>Run a focused mock session with real-time feedback, what was missing, and an improved answer after each question.</p>
                            <div className='mock-feature-strip__chips'>
                                <i>8 Question Session</i>
                                <i>0-10 Scoring</i>
                                <i>Final Summary</i>
                            </div>
                        </div>

                        <div className='mock-feature-strip__panel' aria-hidden='true'>
                            <div className='mock-rail mock-rail--1' />
                            <div className='mock-rail mock-rail--2' />
                            <div className='mock-rail mock-rail--3' />
                            <div className='mock-orb'>
                                <strong>9.1</strong>
                                <span>latest score</span>
                            </div>
                        </div>

                        <button
                            type='button'
                            onClick={() => navigate(appRoutes.mockInterview)}
                            className='mock-feature-strip__cta'
                        >
                            Start Mock Interview
                        </button>
                    </section>
                </aside>
            </section>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
                <button type='button' onClick={() => navigate('/connect')}>Connect</button>
            </footer>
        </div>
    )
}

export default Home
