export const severityMeta = (severityRaw) => {
    const severity = String(severityRaw || '').toLowerCase();
    if (severity === 'high') return { key: 'high', label: 'Critical' };
    if (severity === 'medium' || severity === 'mid') return { key: 'mid', label: 'Moderate' };
    return { key: 'low', label: 'Minor' };
};
