import styles from '../style/interview.module.scss';
import SectionIcon from './SectionIcon';

const Sidebar = ({ title, createdDate, matchScore, navGroups, activeSection, scrollToSection }) => {
    return (
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
                            const active = item.id === activeSection;
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
                            );
                        })}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
