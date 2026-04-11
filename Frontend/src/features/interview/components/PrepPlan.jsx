import { forwardRef } from 'react';
import styles from '../style/interview.module.scss';

const PrepPlan = forwardRef(({ preparationPlan }, ref) => {
    return (
        <section id='plan' ref={ref} className={styles.card}>
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
    );
});

PrepPlan.displayName = 'PrepPlan';

export default PrepPlan;
