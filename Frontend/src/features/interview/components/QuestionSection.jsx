import { forwardRef, useState } from 'react';
import styles from '../style/interview.module.scss';

const QuestionSection = forwardRef(({ id, title, dotColor, badgeClass, badgePrefix, questions }, ref) => {
    const [openQuestions, setOpenQuestions] = useState({});

    const toggleQuestion = (key) => {
        setOpenQuestions((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <section id={id} ref={ref} className={styles.card}>
            <h2 className={styles.sectionTitle}><span className={`${styles.sectionDot} ${dotColor}`}></span>{title}</h2>
            <div className={styles.questionRows}>
                {questions.map((item, index) => {
                    const key = `${badgePrefix}-${index}`;
                    return (
                        <article key={key} className={styles.questionCard}>
                            <button
                                type='button'
                                className={`${styles.questionToggle} ${openQuestions[key] ? styles.questionToggleOpen : ''}`}
                                onClick={() => toggleQuestion(key)}
                                aria-expanded={!!openQuestions[key]}
                            >
                                <div className={styles.questionMain}>
                                    <span className={`${styles.questionBadge} ${badgeClass}`}>{badgePrefix.toUpperCase()}{index + 1}</span>
                                    <p>{item.question}</p>
                                </div>
                                <span className={`${styles.questionChevron} ${openQuestions[key] ? styles.questionChevronOpen : ''}`}>
                                    <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><polyline points='6 9 12 15 18 9' /></svg>
                                </span>
                            </button>
                            <div className={`${styles.questionDetail} ${openQuestions[key] ? styles.questionDetailOpen : ''}`}>
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
                    );
                })}
            </div>
        </section>
    );
});

QuestionSection.displayName = 'QuestionSection';

export default QuestionSection;
