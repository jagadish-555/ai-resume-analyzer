import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generateReport, reports, error } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ localError, setLocalError ] = useState("")
    const [ resumeInfo, setResumeInfo ] = useState(null)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    const handleResumeChange = (e) => {
        const file = e.target.files?.[ 0 ]

        if (!file) {
            setResumeInfo(null)
            return
        }

        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
        if (!isPdf) {
            setLocalError("Only PDF resumes are supported.")
            setResumeInfo(null)
            e.target.value = ""
            return
        }

        const maxFileSize = 3 * 1024 * 1024
        if (file.size > maxFileSize) {
            setLocalError("Resume file must be less than 3MB.")
            setResumeInfo(null)
            e.target.value = ""
            return
        }

        setLocalError("")
        setResumeInfo({
            name: file.name,
            sizeKB: Math.max(1, Math.round(file.size / 1024))
        })
    }

    const handleGenerateReport = async () => {
        setLocalError("")

        const trimmedJobDescription = jobDescription.trim()
        const trimmedSelfDescription = selfDescription.trim()
        const resumeFile = resumeInputRef.current.files[ 0 ]

        if (!trimmedJobDescription) {
            setLocalError("Job description is required.")
            return
        }

        if (!resumeFile && !trimmedSelfDescription) {
            setLocalError("Provide either a resume file or self description.")
            return
        }

        const data = await generateReport({
            jobDescription: trimmedJobDescription,
            selfDescription: trimmedSelfDescription,
            resumeFile
        })
        if (data?._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <div className='loading-spinner' aria-hidden='true'></div>
                <h1>Generating your report...</h1>
            </main>
        )
    }

    return (
        <div className='home-page'>
            <nav className='home-nav'>
                <div className='brand'>
                    <span className='brand__dot' aria-hidden='true'></span>
                    <span className='brand__text'>PrepAI</span>
                </div>
                <button
                    className='button ghost-button home-nav__reports-btn'
                    type='button'
                    onClick={() => document.getElementById('recent-reports')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    My reports
                </button>
            </nav>

            <section className='home-content'>
                <header className='page-header'>
                    <h1>New analysis</h1>
                    <p>Analyze the role requirements and generate a focused interview prep report.</p>
                </header>

                {(localError || error) && (
                    <div className='error-box'>
                        {localError || error}
                    </div>
                )}

                <div className='interview-card'>
                    <div className='interview-card__body'>
                        <div className='panel panel--left'>
                            <div className='panel__header'>
                                <h2>Job description</h2>
                                <span className='badge badge--required'>Required</span>
                            </div>
                            <textarea
                                onChange={(e) => { setJobDescription(e.target.value) }}
                                value={jobDescription}
                                className='panel__textarea'
                                placeholder='Paste the full job description here...'
                                maxLength={5000}
                            />
                            <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                        </div>

                        <div className='panel panel--right'>
                            <div className='panel__header'>
                                <h2>Your profile</h2>
                            </div>

                            <div className='upload-section'>
                                <label className='section-label'>Upload resume</label>
                                <label className={`dropzone ${resumeInfo ? 'dropzone--uploaded' : ''}`} htmlFor='resume'>
                                    <span className='dropzone__icon'>
                                        <svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><polyline points='16 16 12 12 8 16' /><line x1='12' y1='12' x2='12' y2='21' /><path d='M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3' /></svg>
                                    </span>
                                    <p className='dropzone__title'>{resumeInfo ? 'Resume selected' : 'Drop file here'}</p>
                                    <p className='dropzone__subtitle'>PDF only (Max 3MB)</p>
                                    <input ref={resumeInputRef} onChange={handleResumeChange} hidden type='file' id='resume' name='resume' accept='.pdf' />
                                </label>
                                <p className={`upload-status ${resumeInfo ? 'upload-status--ok' : ''}`}>
                                    {resumeInfo ? `Uploaded: ${resumeInfo.name} (${resumeInfo.sizeKB} KB)` : 'No resume uploaded yet'}
                                </p>
                            </div>

                            <div className='or-divider'><span>or describe yourself</span></div>

                            <div className='self-description'>
                                <label className='section-label' htmlFor='selfDescription'>Self description</label>
                                <textarea
                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                    value={selfDescription}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='panel__textarea panel__textarea--short'
                                    placeholder="Briefly describe your experience, key skills, and years of experience..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className='interview-card__footer'>
                        <button
                            onClick={handleGenerateReport}
                            className='button primary-button generate-btn'
                            type='button'
                        >
                            Generate report
                        </button>
                    </div>
                </div>

                {reports.length > 0 && (
                    <section className='recent-reports' id='recent-reports'>
                        <h2>My reports</h2>
                        <ul className='reports-list'>
                            {reports.map(report => (
                                <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                    <h3>{report.title || 'Untitled position'}</h3>
                                    <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                        Match score: {report.matchScore}%
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </section>
        </div>
    )
}

export default Home