import { forwardRef } from 'react';
import styles from '../style/interview.module.scss';

const HeroSection = forwardRef(({ title, createdDate, matchScore, technicalCount, behavioralCount, gapCount }, ref) => {
    return (
        <section id='overview' ref={ref} className={`${styles.card} ${styles.heroCard}`}>
            <div className={styles.heroLeft}>
                <h1>{title}</h1>
                <p>{createdDate} · {technicalCount} technical · {behavioralCount} behavioral</p>
            </div>
            <div className={styles.heroStats}>
                <article className={styles.statBox}>
                    <p className={styles.statValuePrimary}>{matchScore}%</p>
                    <p className={styles.statLabel}>Match</p>
                </article>
                <article className={styles.statBox}>
                    <p className={styles.statValue}>{technicalCount}</p>
                    <p className={styles.statLabel}>Technical</p>
                </article>
                <article className={styles.statBox}>
                    <p className={styles.statValue}>{behavioralCount}</p>
                    <p className={styles.statLabel}>Behavioral</p>
                </article>
                <article className={styles.statBox}>
                    <p className={styles.statValueDanger}>{gapCount}</p>
                    <p className={styles.statLabel}>Skill gaps</p>
                </article>
            </div>
        </section>
    );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
