import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import styles from '../style/interview.module.scss';
import { useInterview } from '../hooks/useInterview.js';
import { useAuth } from '../../auth/hooks/useAuth';
import LoadingScreen from '../../../components/LoadingScreen';
import Logo from '../../../components/Logo';
import Sidebar from '../components/Sidebar';
import HeroSection from '../components/HeroSection';
import MatchBreakdown from '../components/MatchBreakdown';
import SkillGaps from '../components/SkillGaps';
import QuestionSection from '../components/QuestionSection';
import PrepPlan from '../components/PrepPlan';
import { downloadFeedbackPdf } from '../utils/downloadFeedbackPdf';

const Interview = () => {
    const { report, loading, error } = useInterview();
    const { handleLogout } = useAuth();
    const [activeSection, setActiveSection] = useState('overview');
    const mainRef = useRef(null);
    const sectionRefs = useRef({});
    const navigate = useNavigate();

    const technicalQuestions = report?.interviewQuestions || report?.technicalQuestions || [];
    const behavioralQuestions = report?.behavioralQuestions || [];
    const preparationPlan = report?.preparationPlan || [];
    const skillGaps = report?.skillGaps || [];

    const createdDate = report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : '--';
    const matchScore = Number.isFinite(report?.matchScore) ? report.matchScore : 0;
    const title = report?.title || 'Report';

    const breakdown = useMemo(() => {
        const technical = Math.max(0, Math.min(100, Math.round(matchScore + 7)));
        const experience = Math.max(0, Math.min(100, Math.round(matchScore - 3)));
        const keywords = Math.max(0, Math.min(100, Math.round(matchScore - 9)));
        return { technical, experience, keywords };
    }, [matchScore]);

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
    ]), [technicalQuestions.length, behavioralQuestions.length, skillGaps.length, preparationPlan.length]);

    useEffect(() => {
        if (!mainRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
                if (visible.length > 0) {
                    setActiveSection(visible[0].target.id);
                }
            },
            {
                root: mainRef.current,
                threshold: [0.2, 0.45, 0.7],
                rootMargin: '-8% 0px -45% 0px'
            }
        );

        Object.values(sectionRefs.current).forEach((node) => {
            if (node) observer.observe(node);
        });

        return () => observer.disconnect();
    }, [report]);

    const scrollToSection = (id) => {
        const node = sectionRefs.current[id];
        if (!node) return;
        node.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleDownloadPdf = () => {
        if (!report) return;
        downloadFeedbackPdf({
            title,
            createdDate,
            matchScore,
            technicalQuestions,
            behavioralQuestions,
            skillGaps,
            preparationPlan
        });
    };

    if (loading) {
        return <LoadingScreen message='Loading your report...' />;
    }

    if (error) {
        return (
            <div className={styles.page}>
                <header className={styles.navbar}>
                    <Logo />
                    <div className={styles.navActions}>
                        <button type='button' className={styles.ghostButton} onClick={() => navigate('/home')}>My reports</button>
                    </div>
                </header>
                <main className={styles.main}>
                    <HeroSection
                        title='Unable to load this report'
                        createdDate='--'
                        matchScore={0}
                        technicalCount={0}
                        behavioralCount={0}
                        gapCount={0}
                    />
                    <section className={styles.card}>
                        <p>{error}</p>
                        <button type='button' className={styles.primaryButton} onClick={() => navigate('/home')}>
                            Back to my reports
                        </button>
                    </section>
                </main>
            </div>
        );
    }

    if (!report) {
        return (
            <div className={styles.page}>
                <header className={styles.navbar}>
                    <Logo />
                    <div className={styles.navActions}>
                        <button type='button' className={styles.ghostButton} onClick={() => navigate('/home')}>My reports</button>
                    </div>
                </header>
                <main className={styles.main}>
                    <section className={styles.card}>
                        <p>Report not found.</p>
                        <button type='button' className={styles.primaryButton} onClick={() => navigate('/home')}>
                            Back to my reports
                        </button>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <header className={styles.navbar}>
                <Logo />
                <div className={styles.navActions}>
                    <button type='button' className={styles.ghostButton} onClick={() => navigate('/home')}>My reports</button>
                    <button type='button' className={styles.primaryButton} onClick={handleDownloadPdf}>Download PDF</button>
                    <button type='button' className={styles.ghostButton} onClick={async () => {
                        const result = await handleLogout();
                        if (result.success) navigate('/login');
                    }}>Logout</button>
                </div>
            </header>

            <div className={styles.shell}>
                <Sidebar
                    title={title}
                    createdDate={createdDate}
                    matchScore={matchScore}
                    navGroups={navGroups}
                    activeSection={activeSection}
                    scrollToSection={scrollToSection}
                />

                <main className={styles.main} ref={mainRef}>
                    <HeroSection
                        ref={(node) => { sectionRefs.current.overview = node; }}
                        title={title}
                        createdDate={createdDate}
                        matchScore={matchScore}
                        technicalCount={technicalQuestions.length}
                        behavioralCount={behavioralQuestions.length}
                        gapCount={skillGaps.length}
                    />

                    <div className={styles.analysisGrid}>
                        <MatchBreakdown
                            ref={(node) => { sectionRefs.current.match = node; }}
                            breakdown={breakdown}
                        />

                        <SkillGaps
                            ref={(node) => { sectionRefs.current.gaps = node; }}
                            skillGaps={skillGaps}
                        />
                    </div>

                    <QuestionSection
                        ref={(node) => { sectionRefs.current.technical = node; }}
                        id='technical'
                        title='Technical questions'
                        dotColor={styles.dotViolet}
                        badgeClass={styles.badgeTechnical}
                        badgePrefix='t'
                        questions={technicalQuestions}
                    />

                    <QuestionSection
                        ref={(node) => { sectionRefs.current.behavioral = node; }}
                        id='behavioral'
                        title='Behavioral questions'
                        dotColor={styles.dotGreen}
                        badgeClass={styles.badgeBehavioral}
                        badgePrefix='b'
                        questions={behavioralQuestions}
                    />

                    <PrepPlan
                        ref={(node) => { sectionRefs.current.plan = node; }}
                        preparationPlan={preparationPlan}
                    />
                </main>
            </div>
        </div>
    );
};

export default Interview;
