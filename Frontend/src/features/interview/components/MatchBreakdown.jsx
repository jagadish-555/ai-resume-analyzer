import { forwardRef } from 'react';
import styles from '../style/interview.module.scss';

const MatchBreakdown = forwardRef(({ breakdown }, ref) => {
    return (
        <section id='match' ref={ref} className={`${styles.card} ${styles.analysisCard}`}>
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
    );
});

MatchBreakdown.displayName = 'MatchBreakdown';

export default MatchBreakdown;
