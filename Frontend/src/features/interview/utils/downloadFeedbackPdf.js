import { severityMeta } from './severityMeta';

const escapeHtml = (value) =>
    String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');

export const downloadFeedbackPdf = ({ title, createdDate, matchScore, breakdown, technicalQuestions, behavioralQuestions, skillGaps, preparationPlan }) => {
    const safeTitle = escapeHtml(title);
    const safeDate = escapeHtml(createdDate);

    const technicalHtml = technicalQuestions.map((item, index) => `
        <article class="q-item">
            <div class="q-head"><span class="badge">T${index + 1}</span>${escapeHtml(item?.question || 'No question provided.')}</div>
            <div class="q-body">
                <p><strong>🧠 Intention:</strong> ${escapeHtml(item?.intention || 'No intention provided.')}</p>
                <p><strong>💡 Suggested Answer:</strong> ${escapeHtml(item?.answer || 'No answer provided.')}</p>
            </div>
        </article>
    `).join('');

    const behavioralHtml = behavioralQuestions.map((item, index) => `
        <article class="q-item">
            <div class="q-head"><span class="badge b">B${index + 1}</span>${escapeHtml(item?.question || 'No question provided.')}</div>
            <div class="q-body">
                <p><strong>🧠 Intention:</strong> ${escapeHtml(item?.intention || 'No intention provided.')}</p>
                <p><strong>💡 Suggested Answer:</strong> ${escapeHtml(item?.answer || 'No answer provided.')}</p>
            </div>
        </article>
    `).join('');

    const gapsHtml = skillGaps.map((gap) => {
        const meta = severityMeta(gap?.severity);
        return `<div class="gap-card">
            <span class="severity-badge ${gap?.severity}">● ${meta.label}</span>
            <div class="gap-skill">${escapeHtml(gap?.skill || 'Unnamed skill')}</div>
        </div>`;
    }).join('');

    const planHtml = preparationPlan.map((day) => `
        <article class="plan-item">
            <div class="plan-day">
                <div class="day-badge">Day ${escapeHtml(day?.day)}</div>
                <div class="plan-focus">${escapeHtml(day?.focus || 'Focus area')}</div>
            </div>
            <ul class="task-list">
                ${(day?.tasks || []).map((task) => `<li>${escapeHtml(task)}</li>`).join('')}
            </ul>
        </article>
    `).join('');

    const breakdownHtml = breakdown ? `
        <div class="breakdown-grid">
            <div class="breakdown-card">
                <div class="label">Technical</div>
                <div class="value">${breakdown.technical}%</div>
                <div class="bar-bg"><div class="bar-fill" style="width: ${breakdown.technical}%"></div></div>
            </div>
            <div class="breakdown-card">
                <div class="label">Experience</div>
                <div class="value">${breakdown.experience}%</div>
                <div class="bar-bg"><div class="bar-fill" style="width: ${breakdown.experience}%"></div></div>
            </div>
            <div class="breakdown-card">
                <div class="label">Keywords</div>
                <div class="value">${breakdown.keywords}%</div>
                <div class="bar-bg"><div class="bar-fill" style="width: ${breakdown.keywords}%"></div></div>
            </div>
        </div>
    ` : '';

    const html = `<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <title>PrepAI-Feedback-${safeTitle}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @page { margin: 15mm 15mm; size: A4 portrait; }
        body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            color: #1f2937; 
            margin: 0; 
            padding: 0;
            line-height: 1.6; 
            background: #ffffff;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .container { max-width: 800px; margin: 0 auto; }
        
        /* Header */
        header { 
            border-bottom: 2px solid #f3f4f6;
            padding-bottom: 24px;
            margin-bottom: 32px;
        }
        h1 { font-size: 28px; font-weight: 700; color: #111827; margin: 0 0 12px 0; letter-spacing: -0.02em; }
        .meta-badges { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
        .badge-chip { 
            display: inline-flex; align-items: center; 
            padding: 4px 12px; border-radius: 999px; 
            font-size: 13px; font-weight: 500;
            background: #f3f4f6; color: #374151;
        }
        .badge-chip.score { background: #eff6ff; color: #1d4ed8; }
        .match-score-lg { font-size: 48px; font-weight: 700; color: #2563eb; line-height: 1; }
        
        /* Sections */
        .section { margin-bottom: 36px; page-break-inside: avoid; }
        h2 { 
            font-size: 20px; font-weight: 600; color: #111827; 
            margin: 0 0 20px 0; 
            display: flex; align-items: center; gap: 8px;
        }
        
        /* Breakdown */
        .breakdown-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .breakdown-card { background: #f9fafb; border-radius: 12px; padding: 16px; border: 1px solid #e5e7eb; }
        .breakdown-card .label { font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
        .breakdown-card .value { font-size: 24px; font-weight: 700; color: #111827; margin: 4px 0 8px; }
        .bar-bg { height: 6px; background: #e5e7eb; border-radius: 999px; overflow: hidden; }
        .bar-fill { height: 100%; background: #3b82f6; border-radius: 999px; }

        /* Questions */
        .q-item { 
            background: #ffffff;
            border: 1px solid #e5e7eb; 
            border-radius: 12px; 
            padding: 0; 
            margin-bottom: 20px;
            page-break-inside: avoid;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .q-head { 
            display: flex; align-items: flex-start; gap: 12px; 
            font-size: 16px; font-weight: 600; color: #111827;
            padding: 16px;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
            border-radius: 12px 12px 0 0;
            line-height: 1.4;
        }
        .q-body { padding: 16px; font-size: 14px; }
        .q-body p { margin: 0 0 12px 0; }
        .q-body p:last-child { margin: 0; }
        .badge { 
            display: inline-flex; align-items: center; justify-content: center;
            padding: 2px 8px; border-radius: 6px; 
            font-size: 12px; font-weight: 600; letter-spacing: 0.05em;
            background: #e0e7ff; color: #4338ca;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .badge.b { background: #dcfce7; color: #15803d; }
        
        /* Skill Gaps */
        .gaps-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .gap-card { 
            border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px;
            display: flex; flex-direction: column; gap: 8px;
            page-break-inside: avoid;
        }
        .severity-badge { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .severity-badge.high { color: #dc2626; }
        .severity-badge.medium { color: #d97706; }
        .severity-badge.low { color: #2563eb; }
        .gap-skill { font-size: 15px; font-weight: 600; color: #111827; }

        /* Prep Plan */
        .plan-item { 
            border-left: 2px solid #e5e7eb;
            padding-left: 20px;
            margin-bottom: 24px;
            position: relative;
            page-break-inside: avoid;
        }
        .plan-item::before {
            content: '';
            position: absolute;
            left: -5px;
            top: 2px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #3b82f6;
        }
        .plan-day { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
        .day-badge { background: #111827; color: #ffffff; font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 6px; }
        .plan-focus { font-size: 16px; font-weight: 600; color: #111827; }
        .task-list { margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; }
        .task-list li { margin-bottom: 6px; }
        .task-list li:last-child { margin-bottom: 0; }
        
        /* Empty states */
        .empty-state { color: #6b7280; font-style: italic; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${safeTitle}</h1>
            <div class="meta-badges">
                <span class="badge-chip">Generated: ${safeDate}</span>
                <span class="badge-chip">${technicalQuestions.length} Technical</span>
                <span class="badge-chip">${behavioralQuestions.length} Behavioral</span>
            </div>
            <div style="display: flex; align-items: center; gap: 16px; margin-top: 24px;">
                <div class="match-score-lg">${matchScore}%</div>
                <div>
                    <div style="font-size: 14px; font-weight: 600; color: #374151;">Overall Match Score</div>
                    <div style="font-size: 13px; color: #6b7280;">Based on resume and job description analysis</div>
                </div>
            </div>
        </header>

        <section class="section">
            <h2>📊 Match Breakdown</h2>
            ${breakdownHtml || '<p class="empty-state">No breakdown data available.</p>'}
        </section>

        <section class="section">
            <h2>🎯 Skill Gaps Identified</h2>
            ${gapsHtml ? `<div class="gaps-grid">${gapsHtml}</div>` : '<p class="empty-state">No skill gaps found.</p>'}
        </section>

        <section class="section">
            <h2>💻 Technical Questions</h2>
            ${technicalHtml || '<p class="empty-state">No technical questions found.</p>'}
        </section>

        <section class="section">
            <h2>🤝 Behavioral Questions</h2>
            ${behavioralHtml || '<p class="empty-state">No behavioral questions found.</p>'}
        </section>

        <section class="section">
            <h2>📅 Preparation Plan</h2>
            <div style="margin-top: 24px;">
                ${planHtml || '<p class="empty-state">No preparation plan found.</p>'}
            </div>
        </section>
    </div>
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
