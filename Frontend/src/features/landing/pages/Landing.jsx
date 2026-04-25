import React from 'react'
import { Link } from 'react-router'
import { appRoutes, siteBrand } from '../../../config/site'
import {
    capabilityCards,
    finalCta,
    landingFooterLinks,
    landingHero,
    landingNavLinks,
    mockSpotlight,
    prepSteps,
    previewPanel,
    reportPreview,
    visionPanel
} from '../landing.content'
import '../style/landing.scss'

const Landing = () => (
    <main className='landing-page'>
        <div className='landing-noise' aria-hidden='true' />
        <span className='data-node data-node--one' aria-hidden='true' />
        <span className='data-node data-node--two' aria-hidden='true' />
        <span className='data-node data-node--three' aria-hidden='true' />

        <nav className='landing-nav'>
            <Link className='landing-logo' to={appRoutes.landing}>{siteBrand.name}</Link>
            <div className='landing-nav__links'>
                {landingNavLinks.map(link => (
                    <a href={link.href} key={link.href}>{link.label}</a>
                ))}
            </div>
            <div className='landing-nav__actions'>
                <Link to={appRoutes.login}>Login</Link>
                <Link className='landing-nav__cta' to={appRoutes.register}>Begin</Link>
            </div>
        </nav>

        <section className='landing-hero'>
            <div className='landing-kicker'>
                <i />
                {landingHero.kicker}
            </div>
            <h1>{landingHero.title}</h1>
            <p>{landingHero.text}</p>
            <div className='landing-hero__actions'>
                {landingHero.actions.map(action => (
                    <Link className={`landing-btn landing-btn--${action.variant}`} to={action.to} key={action.label}>{action.label}</Link>
                ))}
            </div>

            <div className='product-preview' aria-label={previewPanel.ariaLabel}>
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
                            <strong>{previewPanel.uploadStatus.title}</strong>
                            <span>{previewPanel.uploadStatus.text}</span>
                        </div>
                    </div>
                    <div className='preview-bars'>
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className='preview-question'>
                        <strong>{previewPanel.question.title}</strong>
                        <span>{previewPanel.question.text}</span>
                    </div>
                </div>
                <div className='preview-score'>
                    <div className='score-ring'>
                        <strong>{previewPanel.score}</strong>
                        <span>%</span>
                    </div>
                    <p>{previewPanel.scoreLabel}</p>
                    <div className='preview-tags'>
                        {previewPanel.tags.map(tag => (
                            <span key={tag}>{tag}</span>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <section className='landing-section' id='method'>
            <div className='section-heading'>
                <span>The Architecture Of Prep</span>
                <h2>Four moves from uncertainty to interview-ready execution.</h2>
            </div>
            <div className='steps-grid'>
                {prepSteps.map(step => (
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
                {capabilityCards.map(([title, text, stat], index) => (
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
                <span>{reportPreview.eyebrow}</span>
                <h2>{reportPreview.title}</h2>
                <p>{reportPreview.text}</p>
                <Link className='landing-btn landing-btn--primary' to={reportPreview.cta.to}>{reportPreview.cta.label}</Link>
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
                    <div className='mini-score'>{reportPreview.score}</div>
                    <span>Skill gaps</span>
                    <i />
                    <i />
                </div>
            </div>
        </section>

        <section className='mock-spotlight-section' id='mock'>
            <div className='mock-spotlight-copy'>
                <span>{mockSpotlight.eyebrow}</span>
                <h2>{mockSpotlight.title}</h2>
                <p>{mockSpotlight.text}</p>
                <div className='mock-spotlight-chips'>
                    {mockSpotlight.chips.map(chip => (
                        <i key={chip}>{chip}</i>
                    ))}
                </div>
                <Link className='landing-btn landing-btn--primary' to={mockSpotlight.cta.to}>{mockSpotlight.cta.label}</Link>
            </div>
            <div className='mock-spotlight-panel' aria-hidden='true'>
                <div className='mock-line mock-line--1' />
                <div className='mock-line mock-line--2' />
                <div className='mock-line mock-line--3' />
                <div className='mock-score'>
                    <strong>8.6</strong>
                    <span>avg score</span>
                </div>
                <div className='mock-callout'>Question 4/8 - Behavioral</div>
            </div>
        </section>

        <section className='final-cta'>
            <h2>{finalCta.title}</h2>
            <p>{finalCta.text}</p>
            <div>
                {finalCta.actions.map(action => (
                    <Link className={`landing-btn landing-btn--${action.variant}`} to={action.to} key={action.label}>{action.label}</Link>
                ))}
            </div>
        </section>

        <section className='vision-panel' id='vision'>
            <h2>{visionPanel.title}</h2>
            <p>{visionPanel.text}</p>
        </section>

        <footer className='landing-footer'>
            <Link to={appRoutes.landing} className='landing-logo'>{siteBrand.name}</Link>
            <div>
                {landingFooterLinks.map(link => (
                    link.to
                        ? <Link to={link.to} key={link.label}>{link.label}</Link>
                        : <a href={link.href} key={link.label}>{link.label}</a>
                ))}
            </div>
            <span>{siteBrand.tagline}</span>
        </footer>
    </main>
)

export default Landing
