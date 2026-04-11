import { severityMeta } from './severityMeta';

const escapeHtml = (value) =>
    String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

export const downloadFeedbackPdf = ({ title, createdDate, matchScore, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan }) => {
    const safeTitle = escapeHtml(title);
    const safeDate = escapeHtml(createdDate);

    const technicalHtml = technicalQuestions.map((item, index) => `
        <article class="q-item">
            <p class="q-head"><span class="badge">T${index + 1}</span>${escapeHtml(item?.question || 'No question provided.')}</p>
            <p><strong>Intention:</strong> ${escapeHtml(item?.intention || 'No intention provided.')}</p>
            <p><strong>Answer:</strong> ${escapeHtml(item?.answer || 'No answer provided.')}</p>
        </article>
    `).join('');

    const behavioralHtml = behavioralQuestions.map((item, index) => `
        <article class="q-item">
            <p class="q-head"><span class="badge b">B${index + 1}</span>${escapeHtml(item?.question || 'No question provided.')}</p>
            <p><strong>Intention:</strong> ${escapeHtml(item?.intention || 'No intention provided.')}</p>
            <p><strong>Answer:</strong> ${escapeHtml(item?.answer || 'No answer provided.')}</p>
        </article>
    `).join('');

    const gapsHtml = skillGaps.map((gap) => {
        const meta = severityMeta(gap?.severity);
        return `<li><strong>${escapeHtml(gap?.skill || 'Unnamed skill')}</strong> - ${meta.label}</li>`;
    }).join('');

    const planHtml = preparationPlan.map((day) => `
        <article class="plan-item">
            <p class="plan-title">Day ${escapeHtml(day?.day)} - ${escapeHtml(day?.focus || 'Focus area')}</p>
            <ul>${(day?.tasks || []).map((task) => `<li>${escapeHtml(task)}</li>`).join('')}</ul>
        </article>
    `).join('');

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
</html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(iframe);

    const cleanup = () => {
        setTimeout(() => {
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
        }, 300);
    };

    const frameDoc = iframe.contentWindow?.document;
    if (!frameDoc || !iframe.contentWindow) {
        cleanup();
        window.alert('Unable to open print frame. Please try again.');
        return;
    }

    frameDoc.open();
    frameDoc.write(html);
    frameDoc.close();

    const doPrint = () => {
        const frameWin = iframe.contentWindow;
        if (!frameWin) {
            cleanup();
            return;
        }

        const afterPrint = () => {
            frameWin.removeEventListener('afterprint', afterPrint);
            cleanup();
        };

        frameWin.addEventListener('afterprint', afterPrint);
        frameWin.focus();
        frameWin.print();
        setTimeout(cleanup, 4000);
    };

    if (iframe.contentWindow?.document.readyState === 'complete') {
        setTimeout(doPrint, 120);
    } else {
        iframe.onload = () => setTimeout(doPrint, 120);
    }
};
