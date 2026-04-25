import { appRoutes, siteBrand } from '../../config/site'

export const landingNavLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Mock', href: '#mock' },
    { label: 'Method', href: '#method' },
    { label: 'Vision', href: '#vision' }
]

export const landingHero = {
    kicker: siteBrand.name,
    title: 'Turn any job description into a focused interview plan.',
    text: 'Upload your resume, paste the role, and build a personalized prep strategy with match scoring, skill gaps, likely questions, and an ATS-friendly resume.',
    actions: [
        { label: 'Get Started', to: appRoutes.register, variant: 'primary' },
        { label: 'Login', to: appRoutes.login, variant: 'ghost' }
    ]
}

export const previewPanel = {
    ariaLabel: `${siteBrand.name} product preview`,
    uploadStatus: {
        title: 'Resume uploaded',
        text: 'PDF parsed and ready'
    },
    question: {
        title: 'Technical question',
        text: 'How would you design a scalable candidate matching flow?'
    },
    score: 87,
    scoreLabel: 'Role match',
    tags: ['React', 'System Design', 'API']
}

export const prepSteps = [
    {
        number: '01',
        title: 'Upload your resume',
        text: `Add your PDF resume so ${siteBrand.name} can understand your background, strengths, and experience.`
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

export const capabilityCards = [
    ['Role-based match score', 'See how closely your resume aligns with the exact role you are targeting.', '87%'],
    ['Technical and behavioral questions', 'Practice high-probability questions shaped around the job description.', 'Q/A'],
    ['Mock interview mode', 'Run a question-by-question simulation with instant scoring and improved answers.', 'LIVE'],
    ['Skill gap analysis', 'Identify what to sharpen before the interview, with clear priority signals.', 'GAP'],
    ['Preparation roadmap', 'Follow a structured plan that turns prep into daily execution.', 'MAP'],
    ['ATS-friendly resume', 'Generate a tailored resume version designed for parser clarity.', 'PDF'],
    ['Recent interview plans', 'Return to previous targets and keep iterating as your search evolves.', 'LOG']
]

export const reportPreview = {
    eyebrow: 'Report Preview',
    title: 'See the role through a sharper lens.',
    text: `${siteBrand.name} turns a raw job post into questions, gaps, score signals, and a roadmap you can actually follow.`,
    cta: { label: 'Create Account', to: appRoutes.register },
    score: `${previewPanel.score}%`
}

export const mockSpotlight = {
    eyebrow: 'Mock Interview',
    title: 'Practice like the interview is happening now.',
    text: 'Launch a guided mock session, answer one question at a time, and get score-based feedback, missing points, and better sample answers before your real round.',
    cta: { label: 'Unlock Mock Interview', to: appRoutes.register },
    chips: [ 'Score 0-10', 'Strengths + Gaps', 'Improved Answer', 'Final Summary' ]
}

export const finalCta = {
    title: 'Ready to build your next interview plan?',
    text: `Start with your resume and the role you want. ${siteBrand.name} will handle the structure.`,
    actions: [
        { label: 'Create Account', to: appRoutes.register, variant: 'primary' },
        { label: 'Login', to: appRoutes.login, variant: 'ghost' }
    ]
}

export const visionPanel = {
    title: `The Vision Behind ${siteBrand.name}`,
    text: `Modern hiring is noisy. ${siteBrand.name} helps candidates decode the role, focus their preparation, and walk into interviews with a strategy that matches the job they actually want.`
}

export const landingFooterLinks = [
    { label: 'Architecture', href: '#method' },
    { label: 'Features', href: '#features' },
    { label: 'Vision', href: '#vision' },
    { label: 'Connect', to: appRoutes.connect },
    { label: 'Login', to: appRoutes.login }
]
