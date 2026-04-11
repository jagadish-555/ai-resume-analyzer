import { Link } from 'react-router';
import { LogoMark } from '../components/Logo';
import './landing.scss';

const featureList = [
    {
        title: 'Resume-to-role scoring',
        description: 'See how closely your profile matches a target role with a weighted breakdown across experience, tools, and impact.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
        )
    },
    {
        title: 'Targeted question bank',
        description: 'Practice technical and behavioral questions tuned to the exact responsibilities in the job description.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        )
    },
    {
        title: 'Skill-gap intelligence',
        description: 'Know which missing competencies matter most and what to improve first before interview day.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </svg>
        )
    },
    {
        title: 'Guided prep plan',
        description: 'Get a day-by-day schedule tailored to your timeline so every study session has a clear purpose.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
        )
    }
];

const processSteps = [
    {
        step: '01',
        title: 'Add the job context',
        description: 'Paste the role description and expected responsibilities. PrepAI extracts skills, scope, and seniority signals.'
    },
    {
        step: '02',
        title: 'Share your profile',
        description: 'Upload your resume or provide a self-summary so the model can compare your background against the role.'
    },
    {
        step: '03',
        title: 'Receive your prep brief',
        description: 'Get a focused report with match score, interview prompts, skill gaps, and a practical study sequence.'
    }
];

const Landing = () => {
    return (
        <div className="landing" id="top">
            <header className="landing-shell">
                <nav className="landing-nav">
                    <Link to="/" className="landing-nav__brand" aria-label="PrepAI home">
                        <LogoMark size={28} />
                        <span>PrepAI</span>
                    </Link>
                    <div className="landing-nav__links">
                        <a href="#features">Features</a>
                        <a href="#process">Process</a>
                        <a href="#outcomes">Outcomes</a>
                    </div>
                    <div className="landing-nav__actions">
                        <Link to="/login" className="button ghost-button">Sign in</Link>
                        <Link to="/register" className="button primary-button">Get started</Link>
                    </div>
                </nav>

                <section className="hero">
                    <div className="hero__content">
                        <span className="hero__eyebrow">Interview Preparation Platform</span>
                        <h1>Prepare for interviews with clarity, structure, and confidence.</h1>
                        <p className="hero__subtitle">
                            PrepAI turns your resume and a job description into a strategic prep brief so you can focus on the right questions, the right skills, and the right stories.
                        </p>
                        <div className="hero__cta">
                            <Link to="/register" className="button primary-button hero__cta-btn">Start free analysis</Link>
                            <a href="#process" className="button ghost-button hero__cta-btn">See process</a>
                        </div>
                        <div className="hero__proof">
                            <p>Used by candidates preparing for product, data, and engineering interviews.</p>
                        </div>
                    </div>

                    <aside className="hero-panel" aria-label="Sample outcome preview">
                        <div className="hero-panel__card hero-panel__card--score">
                            <p className="hero-panel__label">Role match score</p>
                            <p className="hero-panel__value">87%</p>
                            <div className="hero-panel__meter" role="presentation">
                                <span style={{ width: '87%' }}></span>
                            </div>
                            <p className="hero-panel__caption">Senior Frontend Engineer</p>
                        </div>
                        <div className="hero-panel__card">
                            <p className="hero-panel__label">Highest gap area</p>
                            <p className="hero-panel__text">System design depth</p>
                        </div>
                        <div className="hero-panel__card">
                            <p className="hero-panel__label">Prep timeline</p>
                            <p className="hero-panel__text">7-day targeted plan</p>
                        </div>
                    </aside>
                </section>
            </header>

            <main>
                <section className="section section--features" id="features">
                    <div className="section-heading">
                        <p className="section-heading__tag">Core capabilities</p>
                        <h2>Everything required for role-specific preparation.</h2>
                        <p className="section-heading__subtitle">
                            Each report is tailored to your target role so you spend time on preparation that actually moves interview outcomes.
                        </p>
                    </div>
                    <div className="feature-grid">
                        {featureList.map((feature) => (
                            <article className="feature-card" key={feature.title}>
                                <div className="feature-card__icon" aria-hidden="true">
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="section section--process" id="process">
                    <div className="section-heading section-heading--left">
                        <p className="section-heading__tag">How it works</p>
                        <h2>A simple workflow from job post to prep plan.</h2>
                    </div>
                    <div className="process-grid">
                        {processSteps.map((item) => (
                            <article className="process-card" key={item.step}>
                                <p className="process-card__step">{item.step}</p>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="section section--outcomes" id="outcomes">
                    <div className="outcomes-panel">
                        <div className="outcomes-panel__copy">
                            <p className="section-heading__tag">Outcomes</p>
                            <h2>Professional interview prep without guesswork.</h2>
                            <p>
                                Replace scattered notes and random practice with one coherent strategy generated from your profile and the role expectations.
                            </p>
                        </div>
                        <div className="outcomes-panel__stats">
                            <div>
                                <p className="stat-value">1 brief</p>
                                <p className="stat-label">for scoring, questions, gaps, and plan</p>
                            </div>
                            <div>
                                <p className="stat-value">Role-specific</p>
                                <p className="stat-label">content aligned to job requirements</p>
                            </div>
                            <div>
                                <p className="stat-value">Actionable</p>
                                <p className="stat-label">clear next steps for each day</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section section--cta">
                    <div className="cta">
                        <h2>Ready to prepare like a top candidate?</h2>
                        <p>Create your first AI interview prep brief in minutes.</p>
                        <div className="cta__actions">
                            <Link to="/register" className="button primary-button">Create account</Link>
                            <Link to="/login" className="button ghost-button">I already have an account</Link>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <div className="landing-footer__top">
                    <div className="landing-footer__identity">
                        <div className="landing-footer__brand">
                            <LogoMark size={24} />
                            <span>PrepAI</span>
                        </div>
                        <p className="landing-footer__desc">Professional interview preparation for ambitious candidates.</p>
                    </div>
                    <div className="landing-footer__contacts" aria-label="Social and contact links">
                        <p className="landing-footer__connect-label">Connect me</p>
                        <div className="landing-footer__links">
                            <a
                                href="https://www.linkedin.com/in/jagadish-patil-283747322/?skipRedirect=true"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Visit LinkedIn profile"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.32V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.28 2.38 4.28 5.48v6.26zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77A1.77 1.77 0 0 0 0 1.77v20.46C0 23.2.8 24 1.77 24h20.46A1.77 1.77 0 0 0 24 22.23V1.77A1.77 1.77 0 0 0 22.23 0z" />
                                </svg>
                                <span>LinkedIn</span>
                            </a>
                            <a
                                href="https://x.com/jagadiship55"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Visit X profile"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M18.9 2H22l-6.77 7.73L23.2 22h-6.27l-4.9-6.41L6.35 22H3.2l7.24-8.28L.8 2h6.42l4.43 5.85L18.9 2zm-1.1 18h1.74L6.28 3.9H4.41L17.8 20z" />
                                </svg>
                                <span>X</span>
                            </a>
                            <a
                                href="https://github.com/jagadish-555/ai-resume-analyzer-prepAi"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Visit GitHub profile"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.1.82-.26.82-.58v-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.38-1.33-1.75-1.33-1.75-1.08-.74.08-.73.08-.73 1.2.08 1.83 1.22 1.83 1.22 1.06 1.82 2.79 1.29 3.47.98.11-.77.42-1.29.76-1.58-2.66-.3-5.46-1.33-5.46-5.92 0-1.31.46-2.38 1.22-3.22-.12-.3-.53-1.52.11-3.16 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.64 1.64.24 2.86.12 3.16.76.84 1.22 1.91 1.22 3.22 0 4.61-2.81 5.61-5.49 5.91.43.37.82 1.1.82 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .3" />
                                </svg>
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="landing-footer__meta">
                    <div className="landing-footer__utilities">
                        <a href="#top">Back to top</a>
                    </div>
                    <p>&copy; {new Date().getFullYear()} PrepAI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
