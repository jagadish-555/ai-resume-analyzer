import React, { useEffect, useMemo, useRef, useState } from 'react'
import styles from '../style/interview.module.scss'
import { useInterview } from '../hooks/useInterview.js'

const SectionIcon = ({ type }) => {
    if (type === 'summary') return <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><rect x='3' y='3' width='7' height='7' /><rect x='14' y='3' width='7' height='7' /><rect x='14' y='14' width='7' height='7' /><rect x='3' y='14' width='7' height='7' /></svg>
    if (type === 'score') return <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M9 12l2 2 4-4' /><circle cx='12' cy='12' r='9' /></svg>
    if (type === 'technical') return <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><line x1='8' y1='6' x2='21' y2='6' /><line x1='8' y1='12' x2='21' y2='12' /><line x1='8' y1='18' x2='21' y2='18' /><line x1='3' y1='6' x2='3.01' y2='6' /><line x1='3' y1='12' x2='3.01' y2='12' /><line x1='3' y1='18' x2='3.01' y2='18' /></svg>
    if (type === 'behavioral') return <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' /></svg>
    if (type === 'gaps') return <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M10.29 3.86l-8.2 14.2A2 2 0 0 0 3.8 21h16.4a2 2 0 0 0 1.72-2.94l-8.2-14.2a2 2 0 0 0-3.43 0z' /><line x1='12' y1='9' x2='12' y2='13' /><line x1='12' y1='17' x2='12.01' y2='17' /></svg>
    return <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><rect x='3' y='4' width='18' height='18' rx='2' ry='2' /><line x1='16' y1='2' x2='16' y2='6' /><line x1='8' y1='2' x2='8' y2='6' /><line x1='3' y1='10' x2='21' y2='10' /></svg>
}

const severityMeta = (severityRaw) => {
    const severity = String(severityRaw || '').toLowerCase()
    if (severity === 'high') return { key: 'high', label: 'Critical' }
    if (severity === 'medium' || severity === 'mid') return { key: 'mid', label: 'Moderate' }
    return { key: 'low', label: 'Minor' }
}

const escapeHtml = (value) =>
    String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')

const Interview = () => {
    const { report, loading } = useInterview()
    const [activeSection, setActiveSection] = useState('overview')
    const [openQuestions, setOpenQuestions] = useState({})
    const mainRef = useRef(null)
    const sectionRefs = useRef({})

    const technicalQuestions = report?.interviewQuestions || report?.technicalQuestions || []
    const behavioralQuestions = report?.behavioralQuestions || []
    const preparationPlan = report?.preparationPlan || []
    const skillGaps = report?.skillGaps || []

    const createdDate = report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : '--'
    const matchScore = Number.isFinite(report?.matchScore) ? report.matchScore : 0
    const title = report?.title || 'Report'

    const breakdown = useMemo(() => {
        const technical = Math.max(0, Math.min(100, Math.round(matchScore + 7)))
        const experience = Math.max(0, Math.min(100, Math.round(matchScore - 3)))
        const keywords = Math.max(0, Math.min(100, Math.round(matchScore - 9)))
        return { technical, experience, keywords }
    }, [matchScore])

    const navGroups = useMemo(() => ([
        {
            label: 'Overview',
            items: [
                { id: 'overview', title: 'Summary', icon: 'summary' },
                { id: 'match', title: 'Match score', icon: 'score' }
            ]
        },
        {
            label: 'Questions',
            items: [
                { id: 'technical', title: 'Technical', icon: 'technical', count: technicalQuestions.length },
                { id: 'behavioral', title: 'Behavioral', icon: 'behavioral', count: behavioralQuestions.length }
            ]
        },
        {
            label: 'Analysis',
            items: [
                { id: 'gaps', title: 'Skill gaps', icon: 'gaps', count: skillGaps.length },
                { id: 'plan', title: 'Prep plan', icon: 'plan', count: preparationPlan.length }
            ]
        }
    ]), [technicalQuestions.length, behavioralQuestions.length, skillGaps.length, preparationPlan.length])

    useEffect(() => {
        if (!mainRef.current) return

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
                if (visible.length > 0) {
                    setActiveSection(visible[0].target.id)
                }
            },
            {
                root: mainRef.current,
                threshold: [0.2, 0.45, 0.7],
                rootMargin: '-8% 0px -45% 0px'
            }
        )

        Object.values(sectionRefs.current).forEach((node) => {
            if (node) observer.observe(node)
        })

        return () => observer.disconnect()
    }, [report])

    const scrollToSection = (id) => {
        const node = sectionRefs.current[id]
        if (!node) return
        node.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const toggleQuestion = (key) => {
        setOpenQuestions((prev) => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

        const handleDownloadFeedbackPdf = () => {
                if (!report) return

                const safeTitle = escapeHtml(title)
                const safeDate = escapeHtml(createdDate)

                const technicalHtml = technicalQuestions.map((item, index) => `
                        <article class="q-item">
                                <p class="q-head"><span class="badge">T${index + 1}</span>${escapeHtml(item?.question || 'No question provided.')}</p>
                                <p><strong>Intention:</strong> ${escapeHtml(item?.intention || 'No intention provided.')}</p>
                                <p><strong>Answer:</strong> ${escapeHtml(item?.answer || 'No answer provided.')}</p>
                        </article>
                `).join('')

                const behavioralHtml = behavioralQuestions.map((item, index) => `
                        <article class="q-item">
                                <p class="q-head"><span class="badge b">B${index + 1}</span>${escapeHtml(item?.question || 'No question provided.')}</p>
                                <p><strong>Intention:</strong> ${escapeHtml(item?.intention || 'No intention provided.')}</p>
                                <p><strong>Answer:</strong> ${escapeHtml(item?.answer || 'No answer provided.')}</p>
                        </article>
                `).join('')

                const gapsHtml = skillGaps.map((gap) => {
                        const meta = severityMeta(gap?.severity)
                        return `<li><strong>${escapeHtml(gap?.skill || 'Unnamed skill')}</strong> - ${meta.label}</li>`
                }).join('')

                const planHtml = preparationPlan.map((day) => `
                        <article class="plan-item">
                                <p class="plan-title">Day ${escapeHtml(day?.day)} - ${escapeHtml(day?.focus || 'Focus area')}</p>
                                <ul>${(day?.tasks || []).map((task) => `<li>${escapeHtml(task)}</li>`).join('')}</ul>
                        </article>
                `).join('')

                const html = `<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <title>PrepAI-Feedback-${safeTitle}</title>
    <style>
        body { font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif; color: #1a1a1a; margin: 28px; line-height: 1.55; }
        h1 { font-size: 24px; font-weight: 600; margin: 0; }
        h2 { font-size: 16px; font-weight: 600; margin: 0 0 10px; }
        .meta { margin-top: 6px; color: #6b6b6b; font-size: 12px; }
        .section { margin-top: 18px; border: 0.5px solid rgba(0,0,0,0.10); border-radius: 12px; padding: 14px; page-break-inside: avoid; }
        .q-item { border-top: 0.5px solid rgba(0,0,0,0.10); padding-top: 10px; margin-top: 10px; }
        .q-item:first-child { border-top: none; margin-top: 0; padding-top: 0; }
        .q-head { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
        .badge { display: inline-flex; padding: 2px 8px; border-radius: 6px; font-size: 11px; background: #EEEDFE; color: #3C3489; }
        .badge.b { background: #E1F5EE; color: #085041; }
        p { font-size: 12px; margin: 6px 0; }
        ul { margin: 6px 0 0 18px; }
        li { margin: 4px 0; font-size: 12px; }
        .plan-item { border-top: 0.5px solid rgba(0,0,0,0.10); padding-top: 10px; margin-top: 10px; }
        .plan-item:first-child { border-top: none; margin-top: 0; padding-top: 0; }
        .plan-title { font-weight: 600; }
    </style>
</head>
<body>
    <header>
        <h1>${safeTitle}</h1>
        <p class="meta">Generated on ${safeDate} · Match score ${matchScore}% · ${technicalQuestions.length} technical · ${behavioralQuestions.length} behavioral</p>
    </header>

    <section class="section">
        <h2>Technical questions</h2>
        ${technicalHtml || '<p>No technical questions found.</p>'}
    </section>

    <section class="section">
        <h2>Behavioral questions</h2>
        ${behavioralHtml || '<p>No behavioral questions found.</p>'}
    </section>

    <section class="section">
        <h2>Skill gaps</h2>
        ${gapsHtml ? `<ul>${gapsHtml}</ul>` : '<p>No skill gaps found.</p>'}
    </section>

    <section class="section">
        <h2>Preparation plan</h2>
        ${planHtml || '<p>No preparation plan found.</p>'}
    </section>
</body>
    </html>`

            const iframe = document.createElement('iframe')
            iframe.style.position = 'fixed'
            iframe.style.width = '0'
            iframe.style.height = '0'
            iframe.style.border = '0'
            iframe.style.right = '0'
            iframe.style.bottom = '0'
            iframe.setAttribute('aria-hidden', 'true')
            document.body.appendChild(iframe)

            const cleanup = () => {
                setTimeout(() => {
                    if (iframe.parentNode) {
                        iframe.parentNode.removeChild(iframe)
                    }
                }, 300)
            }

            const frameDoc = iframe.contentWindow?.document
            if (!frameDoc || !iframe.contentWindow) {
                cleanup()
                window.alert('Unable to open print frame. Please try again.')
                return
            }

            frameDoc.open()
            frameDoc.write(html)
            frameDoc.close()

            const doPrint = () => {
                const frameWin = iframe.contentWindow
                if (!frameWin) {
                    cleanup()
                    return
                }

                const afterPrint = () => {
                    frameWin.removeEventListener('afterprint', afterPrint)
                    cleanup()
                }

                frameWin.addEventListener('afterprint', afterPrint)
                frameWin.focus()
                frameWin.print()
                setTimeout(cleanup, 4000)
            }

            if (iframe.contentWindow?.document.readyState === 'complete') {
                setTimeout(doPrint, 120)
            } else {
                iframe.onload = () => setTimeout(doPrint, 120)
            }
        }

    if (loading || !report) {
        return (
            <main className={styles.loadingScreen}>
                <div className={styles.loadingSpinner} aria-hidden='true'></div>
                <h1>Loading your report...</h1>
            </main>
        )
    }

    return (
        <div className={styles.page}>
            <header className={styles.navbar}>
                <div className={styles.logo}>
                    <span className={styles.logoDot} aria-hidden='true'></span>
                    <span className={styles.logoText}>PrepAI</span>
                </div>
                <div className={styles.navActions}>
                    <button type='button' className={styles.ghostButton} onClick={() => scrollToSection('overview')}>My reports</button>
                    <button type='button' className={styles.primaryButton} onClick={handleDownloadFeedbackPdf}>Download PDF</button>
                </div>
            </header>

            <div className={styles.shell}>
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <p className={styles.sidebarRole}>{title}</p>
                        <p className={styles.sidebarDate}>{createdDate}</p>
                        <span className={styles.matchPill}><span className={styles.matchDot}></span>{matchScore}% match</span>
                    </div>

                    <nav className={styles.sidebarNav}>
                        {navGroups.map((group) => (
                            <div key={group.label} className={styles.navGroup}>
                                <p className={styles.groupLabel}>{group.label}</p>
                                {group.items.map((item) => {
                                    const active = item.id === activeSection
                                    return (
                                        <button
                                            key={item.id}
                                            type='button'
                                            className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                                            onClick={() => scrollToSection(item.id)}
                                        >
                                            <span className={styles.navItemLeft}>
                                                <span className={styles.navIcon}><SectionIcon type={item.icon} /></span>
                                                <span>{item.title}</span>
                                            </span>
                                            {typeof item.count === 'number' && (
                                                <span className={`${styles.countBadge} ${active ? styles.countBadgeActive : ''}`}>{item.count}</span>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                    </nav>
                </aside>

                <main className={styles.main} ref={mainRef}>
                    <section id='overview' ref={(node) => { sectionRefs.current.overview = node }} className={`${styles.card} ${styles.heroCard}`}>
                        <div className={styles.heroLeft}>
                            <h1>{title}</h1>
                            <p>{createdDate} · {technicalQuestions.length} technical · {behavioralQuestions.length} behavioral</p>
                        </div>
                        <div className={styles.heroStats}>
                            <article className={styles.statBox}>
                                <p className={styles.statValuePrimary}>{matchScore}%</p>
                                <p className={styles.statLabel}>Match</p>
                            </article>
                            <article className={styles.statBox}>
                                <p className={styles.statValue}>{technicalQuestions.length}</p>
                                <p className={styles.statLabel}>Technical</p>
                            </article>
                            <article className={styles.statBox}>
                                <p className={styles.statValue}>{behavioralQuestions.length}</p>
                                <p className={styles.statLabel}>Behavioral</p>
                            </article>
                            <article className={styles.statBox}>
                                <p className={styles.statValueDanger}>{skillGaps.length}</p>
                                <p className={styles.statLabel}>Skill gaps</p>
                            </article>
                        </div>
                    </section>

                    <div className={styles.analysisGrid}>
                        <section id='match' ref={(node) => { sectionRefs.current.match = node }} className={`${styles.card} ${styles.analysisCard}`}>
                            <h2 className={styles.sectionTitle}><span className={`${styles.sectionDot} ${styles.dotViolet}`}></span>Match breakdown</h2>
                            <div className={styles.breakdownList}>
                                <div className={styles.barRow}>
                                    <div className={styles.barMeta}><p>Technical skills</p><span>{breakdown.technical}%</span></div>
                                    <progress className={`${styles.progress} ${styles.progressViolet}`} value={breakdown.technical} max='100'></progress>
                                </div>
                                <div className={styles.barRow}>
                                    <div className={styles.barMeta}><p>Experience relevance</p><span>{breakdown.experience}%</span></div>
                                    <progress className={`${styles.progress} ${styles.progressGreen}`} value={breakdown.experience} max='100'></progress>
                                </div>
                                <div className={styles.barRow}>
                                    <div className={styles.barMeta}><p>Keywords matched</p><span>{breakdown.keywords}%</span></div>
                                    <progress className={`${styles.progress} ${styles.progressAmber}`} value={breakdown.keywords} max='100'></progress>
                                </div>
                            </div>
                        </section>

                        <section id='gaps' ref={(node) => { sectionRefs.current.gaps = node }} className={`${styles.card} ${styles.analysisCard}`}>
                            <h2 className={styles.sectionTitle}><span className={`${styles.sectionDot} ${styles.dotRed}`}></span>Skill gaps</h2>
                            <div className={styles.gapList}>
                                {skillGaps.map((gap, index) => {
                                    const meta = severityMeta(gap.severity)
                                    return (
                                        <article key={index} className={`${styles.gapRow} ${styles[`gapRow${meta.key.charAt(0).toUpperCase()}${meta.key.slice(1)}`]}`}>
                                            <p>{gap.skill}</p>
                                            <span className={`${styles.gapBadge} ${styles[`gapBadge${meta.key.charAt(0).toUpperCase()}${meta.key.slice(1)}`]}`}>{meta.label}</span>
                                        </article>
                                    )
                                })}
                            </div>
                        </section>
                    </div>

                    <section id='technical' ref={(node) => { sectionRefs.current.technical = node }} className={styles.card}>
                        <h2 className={styles.sectionTitle}><span className={`${styles.sectionDot} ${styles.dotViolet}`}></span>Technical questions</h2>
                        <div className={styles.questionRows}>
                            {technicalQuestions.map((item, index) => (
                                <article key={`t-${index}`} className={styles.questionCard}>
                                    <button
                                        type='button'
                                        className={`${styles.questionToggle} ${openQuestions[`t-${index}`] ? styles.questionToggleOpen : ''}`}
                                        onClick={() => toggleQuestion(`t-${index}`)}
                                    >
                                        <div className={styles.questionMain}>
                                            <span className={`${styles.questionBadge} ${styles.badgeTechnical}`}>T{index + 1}</span>
                                            <p>{item.question}</p>
                                        </div>
                                        <span className={`${styles.questionChevron} ${openQuestions[`t-${index}`] ? styles.questionChevronOpen : ''}`}>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><polyline points='6 9 12 15 18 9' /></svg>
                                        </span>
                                    </button>
                                    <div className={`${styles.questionDetail} ${openQuestions[`t-${index}`] ? styles.questionDetailOpen : ''}`}>
                                        <div className={styles.detailBlock}>
                                            <p className={styles.detailLabel}>Intention</p>
                                            <p className={styles.detailText}>{item.intention || 'No intention provided.'}</p>
                                        </div>
                                        <div className={styles.detailBlock}>
                                            <p className={styles.detailLabel}>Answer</p>
                                            <p className={styles.detailText}>{item.answer || 'No answer provided.'}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section id='behavioral' ref={(node) => { sectionRefs.current.behavioral = node }} className={styles.card}>
                        <h2 className={styles.sectionTitle}><span className={`${styles.sectionDot} ${styles.dotGreen}`}></span>Behavioral questions</h2>
                        <div className={styles.questionRows}>
                            {behavioralQuestions.map((item, index) => (
                                <article key={`b-${index}`} className={styles.questionCard}>
                                    <button
                                        type='button'
                                        className={`${styles.questionToggle} ${openQuestions[`b-${index}`] ? styles.questionToggleOpen : ''}`}
                                        onClick={() => toggleQuestion(`b-${index}`)}
                                    >
                                        <div className={styles.questionMain}>
                                            <span className={`${styles.questionBadge} ${styles.badgeBehavioral}`}>B{index + 1}</span>
                                            <p>{item.question}</p>
                                        </div>
                                        <span className={`${styles.questionChevron} ${openQuestions[`b-${index}`] ? styles.questionChevronOpen : ''}`}>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><polyline points='6 9 12 15 18 9' /></svg>
                                        </span>
                                    </button>
                                    <div className={`${styles.questionDetail} ${openQuestions[`b-${index}`] ? styles.questionDetailOpen : ''}`}>
                                        <div className={styles.detailBlock}>
                                            <p className={styles.detailLabel}>Intention</p>
                                            <p className={styles.detailText}>{item.intention || 'No intention provided.'}</p>
                                        </div>
                                        <div className={styles.detailBlock}>
                                            <p className={styles.detailLabel}>Answer</p>
                                            <p className={styles.detailText}>{item.answer || 'No answer provided.'}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section id='plan' ref={(node) => { sectionRefs.current.plan = node }} className={styles.card}>
                        <h2 className={styles.sectionTitle}><span className={`${styles.sectionDot} ${styles.dotAmber}`}></span>Preparation plan</h2>
                        <div className={styles.planRows}>
                            {preparationPlan.map((day) => (
                                <article key={day.day} className={styles.planRow}>
                                    <span className={styles.dayPill}>Day {day.day}</span>
                                    <div className={styles.planContent}>
                                        <h3>{day.focus}</h3>
                                        <ul>
                                            {day.tasks.map((task, i) => (
                                                <li key={i}>{task}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

export default Interview
