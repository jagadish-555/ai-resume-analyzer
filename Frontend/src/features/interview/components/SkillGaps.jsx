import { forwardRef } from 'react';
import styles from '../style/interview.module.scss';
import { severityMeta } from '../utils/severityMeta';

const SkillGaps = forwardRef(({ skillGaps }, ref) => {
    return (
        <section id='gaps' ref={ref} className={`${styles.card} ${styles.analysisCard}`}>
            <h2 className={styles.sectionTitle}><span className={`${styles.sectionDot} ${styles.dotRed}`}></span>Skill gaps</h2>
            <div className={styles.gapList}>
                {skillGaps.map((gap, index) => {
                    const meta = severityMeta(gap.severity);
                    return (
                        <article key={index} className={`${styles.gapRow} ${styles[`gapRow${meta.key.charAt(0).toUpperCase()}${meta.key.slice(1)}`]}`}>
                            <p>{gap.skill}</p>
                            <span className={`${styles.gapBadge} ${styles[`gapBadge${meta.key.charAt(0).toUpperCase()}${meta.key.slice(1)}`]}`}>{meta.label}</span>
                        </article>
                    );
                })}
            </div>
        </section>
    );
});

SkillGaps.displayName = 'SkillGaps';

export default SkillGaps;
