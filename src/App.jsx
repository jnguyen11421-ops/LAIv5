import { useState, useEffect, useCallback } from "react";
import { ITEMS_SOURCE, ITEMS } from './items';
import { LANG } from './lang';
import { SYNTHESIS_CONTENT, CLUSTER_RULES, RISK_RULES, QUESTION_RULES, getSynthesis, DOMAIN_KEYS, ORIENT_BUCKET, ORIENTATION_ORDER } from './synthesis';


const C = {
  warmWhite: "#e8e6e2", lightSage: "#f4f6f1", midBlue: "#8596a2",
  slate: "#4a6274", nearBlack: "#313130", deepCharcoal: "#1f2328", offWhite: "#faf9f7",
  gold: "#c8a84a", goldDark: "#a88830",
};

// ── SCORING ──
// Orientation scores use string keys: "outcome", "process", "identity", "system"
// Higher-order tiebreak: system > identity > process > outcome
const HIGHER_ORDER = ["system", "identity", "process", "outcome"];

function scoreAll(responses) {
  const results = {};

  [1,2,3,4,5].forEach(domain => {
    const domainItems = ITEMS_SOURCE.filter(item => item[1] === domain);
    const scores = { outcome: 0, process: 0, identity: 0, system: 0 };

    domainItems.forEach(item => {
      const [id, , , type, , , , orients] = item;
      const resp = responses.find(r => r.id === id);
      if (!resp) return;

      if (type === "single" || type === "paired") {
        const orient = orients[resp.selected];
        if (orient) scores[orient] = (scores[orient] || 0) + 1;
      } else if (type === "forced") {
        const mostOrient  = orients[resp.most];
        const leastOrient = orients[resp.least];
        if (mostOrient)  scores[mostOrient]  = (scores[mostOrient]  || 0) + 2;
        if (leastOrient) scores[leastOrient] = (scores[leastOrient] || 0) - 1;
      }
    });

    // ── PLACEMENT LOGIC ──
    const maxScore = Math.max(...Object.values(scores));

    const tied = Object.entries(scores)
      .filter(([, v]) => v === maxScore)
      .map(([k]) => k);

    if (tied.length === 1) {
      // Map string key to placement code
      const placementMap = { outcome: "1", process: "2a", identity: "2b", system: "3" };
      results[domain] = { placement: placementMap[tied[0]] || tied[0], scores };
      return;
    }

    // Tiebreak: MOST count
    const domainResps = responses.filter(r => {
      const item = ITEMS_SOURCE.find(it => it[0] === r.id);
      return item && item[1] === domain && item[3] === "forced";
    });

    const mostCounts = {};
    tied.forEach(o => { mostCounts[o] = 0; });
    domainResps.forEach(r => {
      const item = ITEMS_SOURCE.find(it => it[0] === r.id);
      if (!item) return;
      const mostOrient = item[7][r.most];
      if (tied.includes(mostOrient)) mostCounts[mostOrient]++;
    });

    const maxMost = Math.max(...tied.map(o => mostCounts[o]));
    const afterMost = tied.filter(o => mostCounts[o] === maxMost);

    if (afterMost.length === 1) {
      const placementMap = { outcome: "1", process: "2a", identity: "2b", system: "3" };
      results[domain] = { placement: placementMap[afterMost[0]] || afterMost[0], scores };
      return;
    }

    // Tiebreak: LEAST count (fewer = better)
    const leastCounts = {};
    afterMost.forEach(o => { leastCounts[o] = 0; });
    domainResps.forEach(r => {
      const item = ITEMS_SOURCE.find(it => it[0] === r.id);
      if (!item) return;
      const leastOrient = item[7][r.least];
      if (afterMost.includes(leastOrient)) leastCounts[leastOrient]++;
    });

    const minLeast = Math.min(...afterMost.map(o => leastCounts[o]));
    const afterLeast = afterMost.filter(o => leastCounts[o] === minLeast);

    if (afterLeast.length === 1) {
      const placementMap = { outcome: "1", process: "2a", identity: "2b", system: "3" };
      results[domain] = { placement: placementMap[afterLeast[0]] || afterLeast[0], scores };
      return;
    }

    // Higher-order tiebreak
    const winner = HIGHER_ORDER.find(o => afterLeast.includes(o));
    const placementMap = { outcome: "1", process: "2a", identity: "2b", system: "3" };
    results[domain] = { placement: placementMap[winner] || placementMap[afterLeast[0]], scores };
  });

  return results;
}

const ORIENTATION_LABELS = {"1":"Execution Mode","2a":"Orchestration Mode","2b":"Navigation Mode","3":"Integration Mode"};
const DOMAIN_NAMES = {1:"Contribution",2:"Reasoning",3:"Authority",4:"Loyalty",5:"Presence"};
const DOMAIN_TENSIONS = {1:"Visibility ↔ Impact",2:"Correctness ↔ Transparency",3:"Direct Control ↔ System Trust",4:"Your People ↔ The Whole",5:"Reaction ↔ Curiosity"};
const DOMAIN_POLES = {
  1:{left:"Visibility",right:"Impact"},
  2:{left:"Correctness",right:"Transparency"},
  3:{left:"Direct Control",right:"System Trust"},
  4:{left:"Your People",right:"The Whole"},
  5:{left:"Reaction",right:"Curiosity"},
};

// ── HTML PDF GENERATION ──
function generatePDF(p) {
  // Build filename: LASTNAME_FIRSTINITIAL_LPP (e.g. Rivera_A_LPP)
  const nameParts = p.name.trim().split(/\s+/);
  const lastName = nameParts[nameParts.length - 1];
  const firstInitial = nameParts.length > 1 ? nameParts[0][0] : '';
  const pdfFilename = [lastName, firstInitial, 'LPP'].filter(Boolean).join('_');
  const syn = getSynthesis(p.results, null);
  const date = new Date(p.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  function orientBadge(placement) {
    return `<span class="orient-badge">${ORIENTATION_LABELS[placement] || placement}</span>`;
  }

  function continuumBar(domain, placement) {
    const poles = DOMAIN_POLES[domain];
    const pct = { "1": 15, "2a": 38, "2b": 63, "3": 85 }[placement] || 0;
    return `
      <div class="continuum-wrap">
        <div class="continuum-labels-top">
          <span class="continuum-domain-name">${DOMAIN_NAMES[domain]}</span>
          <span class="continuum-orient">${ORIENTATION_LABELS[placement] || placement}</span>
        </div>
        <div class="continuum-track">
          <div class="continuum-fill" style="width:${pct}%"></div>
          <div class="continuum-dot" style="left:${pct}%"></div>
        </div>
        <div class="continuum-poles">
          <span>${poles.left}</span>
          <span>${poles.right}</span>
        </div>
      </div>`;
  }

  function scenarioBlock(s) {
    return `
      <div class="scenario-block">
        <p class="scenario-title">${s.title}</p>
        <p class="body-text">${s.text}</p>
        <div class="response-grid">
          ${s.responses.map(r => `
            <div class="response-row">
              <span class="response-label">${r.label}</span>
              <span class="response-text">${r.text}</span>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function domainSection(domainId) {
    const placement = p.results[domainId].placement;
    const dc = DOMAIN_CONTENT[domainId];
    const oc = ORIENTATION_CONTENT[domainId];
    const orient = oc[placement] || oc["2b"];
    const isTransitional = placement === "2b+";
    const poles = DOMAIN_POLES[domainId];
    const pct = { "1": 15, "2a": 38, "2b": 63, "3": 85 }[placement] || 0;

    return `
    <section class="domain-section page-break-before">
      <div class="domain-header">
        <div class="domain-header-left">
          <h2 class="domain-title">${DOMAIN_NAMES[domainId]}</h2>
          <p class="domain-tension">Leadership tension: ${DOMAIN_TENSIONS[domainId]}</p>
        </div>
        <div class="domain-header-badge">${ORIENTATION_LABELS[placement] || placement}</div>
      </div>

      <div class="domain-continuum">
        <div class="continuum-track-inner">
          <div class="continuum-fill" style="width:${pct}%"></div>
          <div class="continuum-dot" style="left:${pct}%"></div>
        </div>
        <div class="continuum-poles">
          <span>${poles.left}</span>
          <span>${poles.right}</span>
        </div>
      </div>

      <div class="section-block avoid-break">
        <h3 class="section-label">About This Domain</h3>
        ${dc.description.split('\n\n').map(t => `<p class="body-text">${t}</p>`).join('')}
      </div>

      <div class="section-block avoid-break">
        <h3 class="section-label">The Four Leadership Orientations</h3>
        <div class="orientation-table">
          ${dc.orientations.map(o => `
            <div class="orientation-row">
              <span class="orientation-label-cell">${o.label}</span>
              <span class="orientation-desc-cell">${o.desc}</span>
            </div>`).join('')}
        </div>
        ${dc.orientationsNote ? `<p class="body-text note-text">${dc.orientationsNote}</p>` : ''}
      </div>

      <div class="section-block">
        <h3 class="section-label">When This Pattern Shows Up</h3>
        <p class="body-text">${dc.scenarios.intro}</p>
        ${scenarioBlock(dc.scenarios.s1)}
        ${scenarioBlock(dc.scenarios.s2)}
        ${dc.scenarios.closing ? `<p class="body-text">${dc.scenarios.closing}</p>` : ''}
      </div>

      <div class="section-block avoid-break">
        <h3 class="section-label">Your Orientation: ${isTransitional ? "Navigation Mode (Emerging System Orientation)" : ORIENTATION_LABELS[placement]}</h3>
        ${isTransitional ? `<div class="transitional-box">${orient.transitional.split('\n\n').map(t => `<p class="body-text">${t}</p>`).join('')}</div>` : ''}
        ${orient.intro.split('\n\n').map(t => `<p class="body-text">${t}</p>`).join('')}
      </div>

      <div class="section-block avoid-break">
        <h3 class="section-label">What This Looks Like in Practice</h3>
        <ul class="bullet-list">
          ${orient.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
        ${orient.bulletsNote ? `<p class="body-text note-text">${orient.bulletsNote}</p>` : ''}
      </div>

      <div class="section-block avoid-break">
        <h3 class="section-label">What This Orientation Makes Possible</h3>
        ${orient.possible.split('\n\n').map(t => `<p class="body-text">${t}</p>`).join('')}
      </div>

      <div class="section-block avoid-break">
        <h3 class="section-label">What the Next Shift Looks Like</h3>
        ${orient.shift.split('\n\n').map(t => `<p class="body-text">${t}</p>`).join('')}
      </div>

      <div class="section-block avoid-break">
        <h3 class="section-label">Working With This Pattern</h3>
        <p class="body-text">${orient.reflection.intro}</p>
        <p class="body-text">You might explore:</p>
        <ol class="reflection-list">
          ${orient.reflection.questions.map(q => `<li>${q}</li>`).join('')}
        </ol>
      </div>

      <div class="section-block avoid-break">
        <h3 class="section-label">Leadership Moment to Practice</h3>
        ${dc.moment.text.split('\n\n').map(t => `<p class="body-text">${t}</p>`).join('')}
        <div class="pull-quote">${dc.moment.question}</div>
        ${dc.moment.closing ? `<p class="body-text">${dc.moment.closing}</p>` : ''}
      </div>

      <div class="section-block avoid-break">
        <h3 class="section-label">Cross-Domain Insight</h3>
        ${dc.crossDomain.split('\n\n').map(t => `<p class="body-text">${t}</p>`).join('')}
      </div>
    </section>`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${pdfFilename}</title>
<style>
/* ── BASE ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 10pt; }
body {
  font-family: 'Georgia', serif;
  color: #313130;
  background: #f8f7f5;
  line-height: 1.6;
}

/* ── SCREEN LAYOUT ── */
.report-wrap {
  max-width: 780px;
  margin: 0 auto;
  padding: 0;
}

/* ── COVER PAGE ── */
.cover-page {
  min-height: 100vh;
  background: #ffffff;
  color: #313130;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 48px;
  border-top: 6px solid #1f2328;
}
.cover-top-bar {
  background: #1f2328;
  padding: 0 64px;
  height: 8px;
  display: none;
}
.cover-inner { padding: 64px 64px 0; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
.cover-eyebrow {
  font-family: system-ui, sans-serif;
  font-size: 8pt;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #4a6274;
  margin-bottom: 48px;
}
.cover-name {
  font-size: 36pt;
  font-weight: 300;
  color: #1f2328;
  margin-bottom: 10px;
  line-height: 1.1;
}
.cover-date {
  font-family: system-ui, sans-serif;
  font-size: 10pt;
  color: #8596a2;
  font-weight: 300;
  margin-bottom: 48px;
}
.cover-rule { width: 48px; height: 2px; background: #1f2328; margin-bottom: 32px; }
.cover-quote {
  font-style: italic;
  font-size: 11pt;
  color: #4a6274;
  max-width: 480px;
  line-height: 1.7;
  margin-bottom: 56px;
}
.cover-summary {
  background: #f4f6f1;
  border-left: 4px solid #1f2328;
  padding: 24px 28px;
  margin: 0 64px 32px;
}
.cover-summary-label {
  font-family: system-ui, sans-serif;
  font-size: 7pt;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #4a6274;
  margin-bottom: 16px;
}
.cover-summary-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid #e8e6e2;
  font-size: 9.5pt;
}
.cover-summary-row:last-child { border-bottom: none; }
.cover-domain-name { color: #313130; font-weight: 300; }
.cover-orient { color: #4a6274; font-family: system-ui, sans-serif; font-size: 8pt; font-weight: 600; }
.cover-footer {
  font-family: system-ui, sans-serif;
  font-size: 7.5pt;
  color: #8596a2;
  letter-spacing: 0.06em;
  padding: 0 64px;
}

/* ── INTRO PAGE ── */
.intro-page {
  min-height: 100vh;
  background: #f4f6f1;
  padding: 64px 64px 48px;
}
.page-eyebrow {
  font-family: system-ui, sans-serif;
  font-size: 7.5pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #8596a2;
  margin-bottom: 8px;
}
.page-title {
  font-size: 22pt;
  font-weight: 300;
  color: #1f2328;
  margin-bottom: 32px;
  line-height: 1.2;
}
.intro-block { margin-bottom: 24px; }
.intro-block p { font-size: 10pt; line-height: 1.75; color: #313130; margin-bottom: 12px; font-family: system-ui, sans-serif; font-weight: 300; }
.domain-intro-table { margin-top: 20px; }
.domain-intro-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  padding: 9px 0;
  border-bottom: 1px solid #e8e6e2;
  font-size: 9.5pt;
}
.domain-intro-name { font-weight: 600; color: #1f2328; }
.domain-intro-tension { color: #4a6274; font-family: system-ui, sans-serif; font-weight: 300; }
.intro-note {
  margin-top: 24px;
  padding: 18px 22px;
  background: #e8e6e2;
  border-left: 3px solid #4a6274;
}
.intro-note p { font-size: 9.5pt; line-height: 1.7; color: #313130; font-family: system-ui, sans-serif; font-weight: 300; }

/* ── MAP PAGE ── */
.map-page {
  min-height: 100vh;
  background: #f8f7f5;
  padding: 64px 64px 48px;
}
.orientation-legend {
  display: flex;
  gap: 0;
  margin-bottom: 32px;
  border: 1px solid #e8e6e2;
}
.legend-item {
  flex: 1;
  padding: 10px 14px;
  border-right: 1px solid #e8e6e2;
  font-family: system-ui, sans-serif;
}
.legend-item:last-child { border-right: none; }
.legend-label { font-size: 7.5pt; font-weight: 600; color: #1f2328; letter-spacing: 0.04em; }
.legend-sub { font-size: 7pt; color: #8596a2; font-weight: 300; margin-top: 2px; }
.map-continuum-wrap { margin-bottom: 28px; }
.map-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 5px;
}
.map-bar-domain { font-family: system-ui, sans-serif; font-size: 9.5pt; font-weight: 600; color: #1f2328; }
.map-bar-orient { font-family: system-ui, sans-serif; font-size: 8.5pt; color: #4a6274; font-weight: 300; }
.map-bar-track {
  position: relative;
  height: 5px;
  background: #e8e6e2;
  border-radius: 3px;
  margin-bottom: 5px;
}
.map-bar-fill {
  position: absolute;
  left: 0; top: 0; height: 100%;
  background: linear-gradient(to right, #e8e6e2, #4a6274);
  border-radius: 3px;
}
.map-bar-dot {
  position: absolute;
  top: 50%; transform: translate(-50%, -50%);
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #c8a84a;
  border: 2px solid #a88830;
  box-shadow: 0 1px 3px rgba(0,0,0,0.18);
}
.map-bar-poles {
  display: flex;
  justify-content: space-between;
  font-family: system-ui, sans-serif;
  font-size: 7.5pt;
  color: #8596a2;
  font-weight: 300;
}
.map-note {
  margin-top: 16px;
  padding: 16px 20px;
  border-left: 3px solid #4a6274;
  background: #f4f6f1;
}
.map-note p { font-family: system-ui, sans-serif; font-size: 9pt; color: #4a6274; font-weight: 300; line-height: 1.7; }

/* ── DOMAIN SECTIONS ── */
.domain-section {
  background: #f8f7f5;
  padding: 0 0 48px;
}
.domain-header {
  background: #1f2328;
  padding: 22px 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}
.domain-title {
  font-size: 20pt;
  font-weight: 300;
  color: #e8e6e2;
  margin-bottom: 4px;
}
.domain-tension {
  font-family: system-ui, sans-serif;
  font-size: 8.5pt;
  color: #8596a2;
  font-weight: 300;
}
.domain-header-badge {
  font-family: system-ui, sans-serif;
  font-size: 8pt;
  font-weight: 600;
  color: #e8e6e2;
  background: #4a6274;
  padding: 5px 14px;
  white-space: nowrap;
  letter-spacing: 0.04em;
}
.domain-continuum {
  padding: 0 64px;
  margin-bottom: 28px;
}
.continuum-track-inner {
  position: relative;
  height: 5px;
  background: #e8e6e2;
  border-radius: 3px;
  margin-bottom: 6px;
}
.continuum-fill {
  position: absolute;
  left: 0; top: 0; height: 100%;
  background: linear-gradient(to right, #e8e6e2, #4a6274);
  border-radius: 3px;
}
.continuum-dot {
  position: absolute;
  top: 50%; transform: translate(-50%, -50%);
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #c8a84a;
  border: 2px solid #a88830;
  box-shadow: 0 1px 3px rgba(0,0,0,0.18);
}
.continuum-poles {
  display: flex;
  justify-content: space-between;
  font-family: system-ui, sans-serif;
  font-size: 7.5pt;
  color: #8596a2;
  font-weight: 300;
}
.section-block {
  padding: 0 64px;
  margin-bottom: 28px;
}
.section-divider {
  height: 1px;
  background: #e8e6e2;
  margin: 0 64px 28px;
}
.section-label {
  font-family: system-ui, sans-serif;
  font-size: 7.5pt;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4a6274;
  font-weight: 700;
  margin-bottom: 10px;
}
.body-text {
  font-family: system-ui, sans-serif;
  font-size: 9.5pt;
  line-height: 1.85;
  color: #313130;
  font-weight: 300;
  margin-bottom: 10px;
}
.note-text { font-style: italic; color: #4a6274; }
.orientation-table { margin-bottom: 8px; }
.orientation-row {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 16px;
  padding: 9px 0;
  border-bottom: 1px solid #e8e6e2;
  font-family: system-ui, sans-serif;
  font-size: 9.5pt;
}
.orientation-label-cell { font-weight: 600; color: #1f2328; }
.orientation-desc-cell { font-weight: 300; color: #313130; line-height: 1.6; }
.scenario-block { margin-bottom: 18px; }
.scenario-title {
  font-family: system-ui, sans-serif;
  font-size: 8pt;
  font-weight: 700;
  color: #4a6274;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}
.response-grid { display: flex; flex-direction: column; gap: 5px; margin-top: 8px; margin-bottom: 4px; }
.response-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 12px;
  padding: 8px 12px;
  background: #f4f6f1;
  font-family: system-ui, sans-serif;
  font-size: 9pt;
}
.response-label { font-weight: 600; color: #4a6274; }
.response-text { font-weight: 300; color: #313130; font-style: italic; line-height: 1.6; }
.transitional-box {
  background: #f4f6f1;
  border-left: 3px solid #c8a84a;
  padding: 14px 18px;
  margin-bottom: 14px;
}
.bullet-list {
  list-style: none;
  margin: 0 0 8px 0;
  padding: 0;
}
.bullet-list li {
  display: flex;
  gap: 10px;
  margin-bottom: 9px;
  font-family: system-ui, sans-serif;
  font-size: 9.5pt;
  line-height: 1.7;
  color: #313130;
  font-weight: 300;
}
.bullet-list li::before {
  content: '';
  width: 3px;
  min-height: 1em;
  background: #4a6274;
  flex-shrink: 0;
  margin-top: 4px;
  align-self: stretch;
  display: inline-block;
}
.reflection-list {
  list-style: none;
  counter-reset: ref-counter;
  margin: 0; padding: 0;
}
.reflection-list li {
  counter-increment: ref-counter;
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
  font-family: system-ui, sans-serif;
  font-size: 9.5pt;
  line-height: 1.7;
  color: #313130;
  font-weight: 300;
}
.reflection-list li::before {
  content: counter(ref-counter) ".";
  color: #4a6274;
  font-weight: 700;
  flex-shrink: 0;
  min-width: 16px;
}
.pull-quote {
  font-family: 'Georgia', serif;
  font-style: italic;
  font-size: 12pt;
  color: #1f2328;
  line-height: 1.65;
  padding: 16px 20px;
  background: #f4f6f1;
  border-left: 3px solid #4a6274;
  margin: 12px 0;
}

/* ── SYNTHESIS PAGE ── */
.synthesis-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 0 0 48px;
  color: #313130;
  border-top: 6px solid #1f2328;
}
.synthesis-inner { padding: 48px 64px 0; }
.synthesis-title { font-size: 22pt; font-weight: 300; color: #1f2328; margin-bottom: 32px; line-height: 1.2; }
.synthesis-domain-grid { margin-bottom: 36px; }
.synthesis-domain-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 11px 0;
  border-bottom: 1px solid #e8e6e2;
}
.synthesis-domain-name { font-size: 10.5pt; font-weight: 300; color: #313130; }
.synthesis-tension { font-family: system-ui, sans-serif; font-size: 8pt; color: #8596a2; font-weight: 300; }
.synthesis-orient-badge {
  font-family: system-ui, sans-serif;
  font-size: 7.5pt;
  font-weight: 600;
  color: #ffffff;
  background: #4a6274;
  padding: 4px 12px;
  white-space: nowrap;
}
.synthesis-section { margin-bottom: 24px; padding: 16px 20px; border-left: 3px solid #e8e6e2; }
.synthesis-section-label {
  font-family: system-ui, sans-serif;
  font-size: 7.5pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #4a6274;
  font-weight: 700;
  margin-bottom: 10px;
}
.synthesis-body {
  font-family: system-ui, sans-serif;
  font-size: 9.5pt;
  line-height: 1.85;
  color: #313130;
  font-weight: 300;
}
.synthesis-footer {
  margin-top: 32px;
  padding: 16px 64px 0;
  font-family: system-ui, sans-serif;
  font-size: 7.5pt;
  color: #8596a2;
  letter-spacing: 0.06em;
  border-top: 1px solid #e8e6e2;
}
.synthesis-integrative {
  font-family: system-ui, sans-serif;
  font-size: 9pt;
  line-height: 1.75;
  color: #4a6274;
  font-weight: 300;
  font-style: italic;
  margin-top: 6px;
}
.synthesis-question {
  margin: 24px 0 0;
  padding: 18px 22px;
  background: #1f2328;
  border-left: 4px solid #c8a84a;
}
.synthesis-question-label {
  font-family: system-ui, sans-serif;
  font-size: 7pt;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8596a2;
  font-weight: 600;
  margin-bottom: 8px;
}
.synthesis-question-text {
  font-family: Georgia, serif;
  font-size: 11pt;
  line-height: 1.7;
  color: #e8e6e2;
  font-weight: 300;
  font-style: italic;
}

/* ── SCREEN: show section dividers ── */
@media screen {
  .domain-section { border-top: 4px solid #1f2328; }
  .page-footer { display: none; }
}

/* ── PRINT ── */
@media print {
  @page { size: A4 portrait; margin: 14mm 16mm 14mm 16mm; }
  html { font-size: 9pt; }
  body { background: white; }

  .report-wrap { max-width: none; padding: 0; }

  /* Each major section starts on a new page */
  .cover-page,
  .intro-page,
  .map-page,
  .page-break-before,
  .synthesis-page {
    page-break-before: always;
    break-before: page;
  }
  .cover-page { page-break-before: auto; break-before: auto; }

  /* Only avoid breaks on small, atomic blocks */
  .avoid-break,
  .orientation-row,
  .synthesis-section,
  .pull-quote,
  .map-continuum-wrap {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Section headings stay with their first line */
  .section-label {
    page-break-after: avoid;
    break-after: avoid;
  }

  /* Tighter padding in print */
  .cover-page, .intro-page, .map-page, .synthesis-page {
    padding: 40px 48px 32px;
  }
  .domain-section { padding: 0 0 32px; }
  .domain-header { padding: 18px 48px; }
  .section-block { padding: 0 48px; margin-bottom: 20px; }
  .domain-continuum { padding: 0 48px; margin-bottom: 20px; }

  /* Tighter body text in print */
  .body-text { font-size: 9pt; line-height: 1.7; margin-bottom: 8px; }
  .bullet-list li { font-size: 9pt; margin-bottom: 7px; }
  .reflection-list li { font-size: 9pt; margin-bottom: 9px; }
  .response-row { font-size: 8.5pt; padding: 6px 10px; }
  .orientation-row { font-size: 9pt; padding: 7px 0; }
  .section-label { margin-top: 18px; margin-bottom: 8px; }
  .scenario-block { margin-bottom: 14px; }
  .pull-quote { font-size: 11pt; padding: 12px 16px; margin: 10px 0; }

  /* No footer for now — avoid fixed positioning issues */
  .page-footer { display: none; }

  /* Force background colors */
  .cover-page { background: #ffffff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .intro-page { background: #f4f6f1 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .map-page { background: #f8f7f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .domain-section { background: #f8f7f5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .synthesis-page { background: #ffffff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
</head>
<body>
<div class="report-wrap">

  <!-- PAGE 1: COVER -->
  <div class="cover-page">
    <div class="cover-inner">
      <div>
        <p class="cover-eyebrow">Leadership Patterns Profile</p>
        <h1 class="cover-name">${p.name}</h1>
        <p class="cover-date">${date}</p>
        <div class="cover-rule"></div>
        <p class="cover-quote">"Leadership becomes visible when pressure makes tradeoffs unavoidable."</p>
      </div>
    </div>
    <div class="cover-summary">
      <p class="cover-summary-label">Domain Summary</p>
      ${[1,2,3,4,5].map(d => `
        <div class="cover-summary-row">
          <span class="cover-domain-name">${DOMAIN_NAMES[d]}</span>
          <span class="cover-orient">${ORIENTATION_LABELS[p.results[d].placement] || p.results[d].placement}</span>
        </div>`).join('')}
    </div>
    <p class="cover-footer">Jen Nguyen · Executive Coaching · jnguyen.org</p>
  </div>

  <!-- PAGE 2: INTRODUCTION -->
  <div class="intro-page">
    <p class="page-eyebrow">About This Report</p>
    <h2 class="page-title">Introduction</h2>
    <div class="intro-block">
      <p>This report describes your leadership patterns across five domains — the areas where leadership responsibility most often becomes difficult to carry.</p>
      <p>The patterns described here are not measures of leadership capability. They reflect where your leadership attention tends to go when pressure increases and tradeoffs become unavoidable.</p>
      <p>Most experienced leaders operate from different orientations in different domains. This report helps make those patterns visible.</p>
    </div>
    <div class="intro-block">
      <p>Each domain describes a tension that leaders regularly encounter as responsibility grows. Your responses placed your current orientation somewhere along that tension for each domain.</p>
      <p>The four orientations — Execution Mode, Orchestration Mode, Navigation Mode, and Integration Mode — reflect different ways leaders anchor their leadership identity under pressure. Each orientation has genuine strengths. Each also has a developmental edge.</p>
    </div>
    <div class="domain-intro-table">
      ${[1,2,3,4,5].map(d => `
        <div class="domain-intro-row">
          <span class="domain-intro-name">${DOMAIN_NAMES[d]}</span>
          <span class="domain-intro-tension">${DOMAIN_TENSIONS[d]}</span>
        </div>`).join('')}
    </div>
    <div class="intro-note">
      <p>The orientations described in this report are not levels of leadership capability. They describe the patterns leaders tend to rely on when leadership moments become demanding. The goal is not to evaluate capability, but to make these patterns visible so they can be examined and developed.</p>
    </div>
  </div>

  <!-- PAGE 3: PATTERNS MAP -->
  <div class="map-page">
    <p class="page-eyebrow">Leadership Development Map</p>
    <h2 class="page-title">Your Leadership Patterns</h2>
    <div class="orientation-legend">
      <div class="legend-item">
        <div class="legend-label">Execution Mode</div>
        <div class="legend-sub">Direct connection to results</div>
      </div>
      <div class="legend-item">
        <div class="legend-label">Orchestration Mode</div>
        <div class="legend-sub">Visibility into how work unfolds</div>
      </div>
      <div class="legend-item">
        <div class="legend-label">Navigation Mode</div>
        <div class="legend-sub">How leadership is understood</div>
      </div>
      <div class="legend-item">
        <div class="legend-label">Integration Mode</div>
        <div class="legend-sub">Architecture and structure</div>
      </div>
    </div>
    ${[1,2,3,4,5].map(d => {
      const placement = p.results[d].placement;
      const pct = { "1": 15, "2a": 38, "2b": 63, "3": 85 }[placement] || 0;
      const poles = DOMAIN_POLES[d];
      return `
      <div class="map-continuum-wrap">
        <div class="map-bar-header">
          <span class="map-bar-domain">${DOMAIN_NAMES[d]}</span>
          <span class="map-bar-orient">${ORIENTATION_LABELS[placement] || placement}</span>
        </div>
        <div class="map-bar-track">
          <div class="map-bar-fill" style="width:${pct}%"></div>
          <div class="map-bar-dot" style="left:${pct}%"></div>
        </div>
        <div class="map-bar-poles">
          <span>${poles.left}</span>
          <span>${poles.right}</span>
        </div>
      </div>`;
    }).join('')}
    <div class="map-note">
      <p>Each bar reflects the tension your leadership navigates in that domain — and where your responses most often landed. The dot shows your current orientation placement. These patterns reflect tendencies under pressure, not fixed traits.</p>
    </div>
  </div>

  <!-- PAGES 4–8: DOMAIN SECTIONS -->
  ${[1,2,3,4,5].map(d => domainSection(d)).join('\n')}

  <!-- FINAL PAGE: SYNTHESIS -->
  <div class="synthesis-page page-break-before">
    <div class="synthesis-inner">
      <p class="page-eyebrow">Your Leadership Pattern Summary</p>
      <h2 class="synthesis-title">Pattern Summary</h2>

      <div class="synthesis-domain-grid">
        ${[1,2,3,4,5].map(d => `
          <div class="synthesis-domain-row">
            <div>
              <span class="synthesis-domain-name">${DOMAIN_NAMES[d]}</span>
              <span class="synthesis-tension" style="margin-left:12px;">${DOMAIN_TENSIONS[d]}</span>
            </div>
            <span class="synthesis-orient-badge">${ORIENTATION_LABELS[p.results[d].placement] || p.results[d].placement}</span>
          </div>`).join('')}
      </div>

      <div class="synthesis-section">
        <p class="synthesis-section-label">${syn.cluster.title}</p>
        <p class="synthesis-body">${syn.cluster.text}</p>
      </div>

      <div class="synthesis-section">
        <p class="synthesis-section-label">${syn.leverage.title}</p>
        <p class="synthesis-body">${syn.leverage.text}</p>
        <p class="synthesis-integrative">${syn.integrative}</p>
      </div>

      <div class="synthesis-section">
        <p class="synthesis-section-label">${syn.risk.title}</p>
        <p class="synthesis-body">${syn.risk.text}</p>
      </div>

      <div class="synthesis-question">
        <p class="synthesis-question-label">A question worth sitting with</p>
        <p class="synthesis-question-text">${syn.question}</p>
      </div>
    </div>
    <div class="synthesis-footer">Jen Nguyen · Executive Coaching · jnguyen.org</div>
  </div>

</div>

<div class="page-footer">Jen Nguyen · Executive Coaching · jnguyen.org</div>

<script>document.title = "${pdfFilename}"; window.print();</script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (!win) { alert('Please allow popups for this site to generate the PDF.'); return; }
  win.document.write(html);
  win.document.close();
}

function Wheel({results}) {
  const CX=300, CY=300, size=600, GAP=2.5;
  const RINGS=[
    {r:75, rIn:28, bg:"#dedad4", label:"PROTECT OUTCOME"},
    {r:135,rIn:75, bg:"#b8ccd6", label:"PROTECT PROCESS"},
    {r:195,rIn:135,bg:"#8aaabe", label:"PROTECT IDENTITY"},
    {r:250,rIn:195,bg:"#4a6e88", label:"PROTECT SYSTEM"},
  ];
  const RING_IDX={"1":0,"2a":1,"2b":2,"2b+":2,"3":3};
  const DOMAINS=[
    {id:1,name:"Contribution",        s:198,e:270},
    {id:2,name:"Decision\nReasoning", s:270,e:342},
    {id:3,name:"Authority",           s:342,e:414},
    {id:4,name:"Enterprise\nHealth",  s:414,e:486},
    {id:5,name:"Presence",            s:486,e:558},
  ];

  function toRad(d){return d*Math.PI/180;}
  function pt(r,deg){return [CX+r*Math.cos(toRad(deg)),CY+r*Math.sin(toRad(deg))];}
  function wedgePath(rO,rI,s,e){
    const[ox1,oy1]=pt(rO,s),[ox2,oy2]=pt(rO,e),[ix1,iy1]=pt(rI,e),[ix2,iy2]=pt(rI,s);
    const lg=(e-s)>180?1:0;
    return `M${ox1} ${oy1} A${rO} ${rO} 0 ${lg} 1 ${ox2} ${oy2} L${ix1} ${iy1} A${rI} ${rI} 0 ${lg} 0 ${ix2} ${iy2}Z`;
  }

  const slices = DOMAINS.map(({id,s,e})=>{
    const placement=results[id]?.placement||"2a";
    const activeIdx=RING_IDX[placement];
    const sg=s+GAP/2,eg=e-GAP/2;
    return {id,s:sg,e:eg,activeIdx};
  });

  return (
    <div id="pdf-wheel" style={{display:"flex",flexDirection:"column",alignItems:"center",margin:"16px 0"}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{maxWidth:"100%"}}>
        <defs>
          <filter id="tshadow"><feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#000" floodOpacity="0.4"/></filter>
          <filter id="goldshadow"><feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#c8a84a" floodOpacity="0.4"/></filter>
        </defs>
        <rect width={size} height={size} fill={C.offWhite}/>

        {/* Base ring fills */}
        {slices.map(({id,s,e,activeIdx})=>
          RINGS.map((ring,idx)=>(
            <path key={`${id}-${idx}`} d={wedgePath(ring.r,ring.rIn,s,e)}
              fill={ring.bg} fillOpacity={idx>activeIdx?"0.22":"0.9"} stroke="none"/>
          ))
        )}

        {/* Gold active band */}
        {slices.map(({id,s,e,activeIdx})=>{
          const ar=RINGS[activeIdx];
          return <path key={`gold-${id}`} d={wedgePath(ar.r,ar.rIn,s,e)}
            fill={C.gold} fillOpacity="0.88" stroke={C.goldDark} strokeWidth="1.5" filter="url(#goldshadow)"/>;
        })}

        {/* Ring dividers */}
        {RINGS.map((ring,i)=>(
          <circle key={i} cx={CX} cy={CY} r={ring.r} fill="none" stroke="#7a7672" strokeWidth="1.2" opacity="0.5"/>
        ))}
        <circle cx={CX} cy={CY} r={RINGS[0].rIn} fill="none" stroke="#7a7672" strokeWidth="1" opacity="0.4"/>

        {/* Slice dividers */}
        {DOMAINS.map(({s})=>{
          const[x1,y1]=pt(28,s),[x2,y2]=pt(250,s);
          return <line key={s} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#7a7672" strokeWidth="1.2" opacity="0.5"/>;
        })}

        {/* Ring labels — white */}
        {RINGS.map((ring)=>{
          const midR=(ring.r+ring.rIn)/2;
          const[lx,ly]=pt(midR,-90);
          return <text key={ring.label} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fill="#fff" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="700" letterSpacing="0.1em"
            filter="url(#tshadow)">{ring.label}</text>;
        })}

        {/* Domain names outside wheel */}
        {DOMAINS.map(({id,name,s,e})=>{
          const mid=(s+e)/2;
          const lines=name.split("\n");
          return lines.map((line,i)=>{
            const[nx,ny]=pt(278,mid);
            const offset=(i-(lines.length-1)/2)*18;
            return <text key={`${id}-${i}`} x={nx} y={ny+offset} textAnchor="middle" dominantBaseline="middle"
              fill={C.deepCharcoal} fontFamily="system-ui,sans-serif" fontSize="14" fontWeight="700">{line}</text>;
          });
        })}

        {/* Center — empty */}
        <circle cx={CX} cy={CY} r={RINGS[0].rIn} fill={C.offWhite} stroke="#b0aca6" strokeWidth="1.5"/>
      </svg>

      {/* Legend */}
      <div style={{display:"flex",gap:20,flexWrap:"wrap",justifyContent:"center",marginTop:12}}>
        {[
          {color:C.gold,border:C.goldDark,label:"Current orientation"},
          {color:"#dedad4",border:"#c4c0ba",label:"Execution Mode"},
          {color:"#b8ccd6",border:"#9ab4c2",label:"Orchestration Mode"},
          {color:"#8aaabe",border:"#6a8eaa",label:"Navigation Mode"},
          {color:"#4a6e88",border:"#2a5068",label:"Integration Mode"},
        ].map(({color,border,label})=>(
          <div key={label} style={{display:"flex",alignItems:"center",gap:7}}>
            <div style={{width:28,height:10,background:color,border:`1.5px solid ${border}`,borderRadius:2}}/>
            <span style={{fontFamily:"system-ui,sans-serif",fontSize:11,fontWeight:500,color:C.nearBlack}}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── UI COMPONENTS ──
function Nav({ right }) {
  return (
    <nav style={{padding:"20px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.warmWhite}`,background:C.offWhite,position:"sticky",top:0,zIndex:10}}>
      <span style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:400,letterSpacing:"0.04em",color:C.deepCharcoal}}>Leadership Patterns Profile</span>
      {right||<div/>}
    </nav>
  );
}

function Btn({ variant="dark", children, onClick, style={} }) {
  const variants = {
    dark:{background:C.deepCharcoal,color:C.warmWhite,border:"none"},
    outline:{background:"transparent",color:C.slate,border:`1px solid ${C.midBlue}`},
    slate:{background:C.slate,color:C.warmWhite,border:"none"},
  };
  return <button onClick={onClick} style={{...{display:"inline-flex",alignItems:"center",gap:8,cursor:"pointer",fontFamily:"system-ui,sans-serif",fontSize:12,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:500,padding:"13px 24px",transition:"all 0.2s"},...variants[variant],...style}}>{children}</button>;
}

function FormField({label,value,onChange,type="text",placeholder}) {
  return (
    <div style={{marginBottom:18}}>
      <label style={{display:"block",fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.midBlue,fontWeight:500,marginBottom:7}}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"12px 14px",background:C.offWhite,border:`1px solid ${C.warmWhite}`,fontFamily:"system-ui,sans-serif",fontSize:14,color:C.nearBlack,outline:"none",boxSizing:"border-box"}}/>
    </div>
  );
}

function OrientationBadge({placement}) {
  const bgs={"1":C.warmWhite,"2a":"#dce4e0","2b":"#b8c4cc","2b+":"#b8c4cc","3":C.slate};
  const fgs={"1":C.midBlue,"2a":C.slate,"2b":C.deepCharcoal,"2b+":C.deepCharcoal,"3":C.offWhite};
  return <span style={{fontFamily:"system-ui,sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.05em",padding:"3px 10px",background:bgs[placement]||C.warmWhite,color:fgs[placement]||C.midBlue,whiteSpace:"nowrap"}}>{ORIENTATION_LABELS[placement]||placement}</span>;
}

// ── REPORT PAGES ──
function IntroPage() {
  return (
    <div>
      {/* Title block */}
      <div style={{marginBottom:36}}>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:300,color:C.deepCharcoal,marginBottom:8,lineHeight:1.2}}>Leadership Patterns Profile</h2>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,color:C.midBlue,fontWeight:300,fontStyle:"italic",marginBottom:24}}>What drives your leadership in the moments that matter most</p>
        <div style={{borderLeft:`3px solid ${C.gold}`,paddingLeft:24,marginBottom:28}}>
          <p style={{fontFamily:"Georgia,serif",fontSize:19,fontWeight:300,color:C.deepCharcoal,lineHeight:1.5,fontStyle:"italic"}}>Leadership becomes most visible when pressure makes trade-offs unavoidable.</p>
        </div>
      </div>

      {/* Opening section */}
      <div style={{marginBottom:32}}>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:15,lineHeight:1.9,color:C.nearBlack,fontWeight:300,maxWidth:600,marginBottom:16}}>Leadership rarely reveals itself in routine moments. It becomes most visible when responsibility intensifies — when decisions carry real consequences, information is incomplete, loyalties compete, and outcomes cannot be fully controlled.</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:15,lineHeight:1.9,color:C.nearBlack,fontWeight:300,maxWidth:600,marginBottom:16}}>In these moments, leadership behavior is less about skill and more about <span style={{fontWeight:500,color:C.slate}}>the internal orientation a leader relies on to carry responsibility.</span></p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:15,lineHeight:1.9,color:C.nearBlack,fontWeight:300,maxWidth:600,marginBottom:16}}>When pressure increases, most leaders do not gain new capabilities. They tend to rely on the orientation that helps them steady themselves when the stakes are high.</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:15,lineHeight:1.9,color:C.nearBlack,fontWeight:300,maxWidth:600,marginBottom:16}}>Sometimes this appears as direct involvement in results. Sometimes it shows up as oversight, structured reasoning, or careful attention to how leadership decisions are perceived. From the outside, these responses often look like leadership competence.</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:15,lineHeight:1.9,color:C.nearBlack,fontWeight:300,maxWidth:600,marginBottom:16}}>None of these responses are inherently right or wrong. They represent different ways leaders carry responsibility when pressure increases.</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:15,lineHeight:1.9,color:C.nearBlack,fontWeight:300,maxWidth:600}}>Leadership development is not primarily about acquiring new skills. It often involves <span style={{fontWeight:500,color:C.slate}}>a shift in the orientation a leader relies on when leadership responsibility becomes difficult to carry.</span></p>
      </div>

      <div style={{height:1,background:C.warmWhite,marginBottom:32}}/>

      {/* Four orientations */}
      <div style={{marginBottom:36}}>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:C.slate,fontWeight:600,marginBottom:8}}>The Four Leadership Orientations</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,maxWidth:580,marginBottom:20}}>These orientations describe the different ways leaders tend to steady themselves when responsibility intensifies.</p>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[
            {label:"Execution Mode", desc:"Leadership stabilizes through direct involvement in results."},
            {label:"Orchestration Mode", desc:"Leadership stabilizes through oversight, structure, and defensibility."},
            {label:"Navigation Mode", desc:"Leadership stabilizes through how leadership decisions and actions are perceived."},
            {label:"Integration Mode",  desc:"Leadership stabilizes through designing conditions that allow others to act and decisions to hold without direct involvement."},
          ].map((o,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:20,padding:"12px 0",borderBottom:`1px solid ${C.warmWhite}`}}>
              <div style={{fontFamily:"system-ui,sans-serif",fontSize:12,fontWeight:600,color:C.nearBlack}}>{o.label}</div>
              <div style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.7,color:C.nearBlack,fontWeight:300}}>{o.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{height:1,background:C.warmWhite,marginBottom:32}}/>

      {/* Where responsibility shows up */}
      <div style={{marginBottom:36}}>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:C.slate,fontWeight:600,marginBottom:8}}>Where Leadership Responsibility Shows Up</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,maxWidth:580,marginBottom:20}}>The five domains represent leadership tensions that become most visible when responsibility increases and tradeoffs cannot be avoided.</p>

        <div style={{border:`1px solid ${C.warmWhite}`,marginBottom:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:C.deepCharcoal,padding:"10px 16px"}}>
            <span style={{fontFamily:"system-ui,sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:C.warmWhite}}>DOMAIN</span>
            <span style={{fontFamily:"system-ui,sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:C.warmWhite}}>CORE LEADERSHIP TENSION</span>
          </div>
          {[
            {d:"Contribution", t:"Visibility ↔ Impact"},
            {d:"Reasoning",    t:"Correctness ↔ Transparency"},
            {d:"Authority",    t:"Direct Control ↔ System Trust"},
            {d:"Loyalty",      t:"Your People ↔ The Whole"},
            {d:"Presence",     t:"Reaction ↔ Curiosity"},
          ].map(({d,t},i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"11px 16px",borderTop:`1px solid ${C.warmWhite}`,background:i%2===0?C.offWhite:C.lightSage}}>
              <span style={{fontFamily:"system-ui,sans-serif",fontSize:13,fontWeight:600,color:C.nearBlack}}>{d}</span>
              <span style={{fontFamily:"system-ui,sans-serif",fontSize:13,fontWeight:300,color:C.nearBlack}}>{t}</span>
            </div>
          ))}
        </div>

        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,maxWidth:580,marginBottom:12}}>These domains represent the places where leadership responsibility most often becomes difficult to carry.</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,maxWidth:580}}>Different leaders rely on different orientations across these domains when pressure increases.</p>
      </div>

      <div style={{background:C.lightSage,padding:"20px 24px",borderLeft:`2px solid ${C.slate}`}}>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,marginBottom:10}}>The orientations described in this report are not levels of leadership capability. They describe the patterns leaders tend to rely on when leadership moments become demanding.</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300}}>Most experienced leaders operate from different orientations in different domains. This report helps make those patterns visible.</p>
      </div>
    </div>
  );
}

// DOMAIN_CONTENT — v16
// Structure per domain:
//   about: string (About This Domain)
//   assets: { execution, orchestration, navigation, integration } — each: { possible: string[], costs: string[] }
//   scenario: string (shared Leadership Moment scenario)
//   framingLine: string (framing line before primary response)
//   primary: { execution, orchestration, navigation, integration } — string (full paragraph)
//   secondary: { execution, orchestration, navigation, integration } — string (short version)
//   question: string (Questions to Sit With)

const DOMAIN_CONTENT = {

  contribution: {
    about: `Contribution examines how you experience your own impact when the work moves through others rather than through you. As leadership scope grows, your involvement becomes less direct. You shape outcomes through direction, judgment, and the conditions you create rather than through your own output.\n\nWhen visibility drops or credit becomes unclear, this domain surfaces. The question it asks is where your confidence goes when you can no longer see your hand in the result. It shows what you rely on to feel your contribution is real: doing the work yourself, staying close to how it unfolds, whether your role is being understood correctly, or the strength of the thinking behind it.`,

    assets: {
      execution: {
        possible: [
          "Clear direction through direct involvement",
          "Work stays aligned to intended outcome",
          "Rapid correction when work starts to drift"
        ],
        costs: [
          "Limited delegation of true ownership",
          "Others depend on your continued involvement",
          "Difficulty releasing ownership once you've shaped the direction"
        ]
      },
      orchestration: {
        possible: [
          "Work scales through clear structure and roles",
          "Consistent execution across people and teams",
          "Strong continuity as work moves across groups"
        ],
        costs: [
          "Resistance when work needs to evolve",
          "Over-reliance on established structure",
          "Slower adaptation when direction needs to shift"
        ]
      },
      navigation: {
        possible: [
          "Contribution is visible and well understood",
          "Role in shaping the work remains legible to others",
          "Clear connection between you and the work"
        ],
        costs: [
          "Attention split between work and perception",
          "Reliance on recognition to validate contribution",
          "Reduced focus on the work itself"
        ]
      },
      integration: {
        possible: [
          "Work evolves beyond original ownership",
          "Direction holds without your direct involvement",
          "Thinking transfers across people and contexts"
        ],
        costs: [
          "Contribution not always visible or attributed",
          "Others unclear on your role in the work",
          "Direction may feel under-specified to others"
        ]
      }
    },

    scenario: `You are in a senior leadership meeting. A decision is being made about a major initiative shaped by your thinking, and your team has been carrying most of the execution across several groups. New information is pushing a shift in direction that will create strain for your team. A peer challenges the direction publicly and looks to you to respond.`,

    framingLine: `In this moment, your instinct is to move into [Mode] Mode:`,

    primary: {
      execution: `Your focus goes to the work and whether the direction still holds. The challenge feels like the work itself is at risk, and you move to reinsert your thinking so it doesn't drift. You step in to restate the approach, clarify what should happen, and make sure the outcome reflects what you see as the right path. Staying out of it doesn't feel like a responsible option when your imprint is on the work.`,
      orchestration: `Focus on whether the process that got you here is being understood correctly. The shift in direction concerns you less than whether the people pushing for it understand how the original approach was built and why it was set up the way it was. You slow the conversation down, fill in the context, and make sure the decision is grounded in how the work actually developed. A decision made on incomplete understanding feels like a breakdown in how the work is being managed.`,
      navigation: `Focus on how this moment is landing and what it's asking of you. The peer's challenge is public, the room is watching, and how you respond will shape how your leadership is read. You track whether the original approach is being credited, how your team will interpret your response, and how to engage in a way that reads as measured and credible. You want to hold your ground without coming across as defensive.`,
      integration: `The change doesn't immediately pull you to assert your contribution. What stands out is whether the original approach is still holding. You want to understand what shifted before responding, even if it means not stepping in right away. If the direction needs to change, you may let go of your imprint on the work. Others may expect you to make your role more visible than you do.`
    },

    secondary: {
      execution: `You focus on the work and whether the direction still holds. If it's being challenged, you step in directly to defend the approach and keep it on track.`,
      orchestration: `You focus on how the decision is being shaped. Before reacting, you want to make sure the shift is grounded in a clear understanding of how the work developed and why it was set up the way it was.`,
      navigation: `You focus on how the moment is landing and what your response will signal. You step in carefully, making sure your position is clear without coming across as defensive or overreaching.`,
      integration: `You focus on what the new information is actually showing. If the direction needs to change, you're willing to follow that, even if it means letting go of the original approach.`
    },

    question: `Where are you staying closer to the work than needed, or further from it than the situation can carry?`
  },

  reasoning: {
    about: `Reasoning examines what you rely on when you're faced with uncertainty, ambiguity, or challenge and a decision is yours to make or defend. In senior leadership, decisions rarely come with complete information. The question is not just what you conclude, but where you find confidence in your reasoning when the analysis is mixed, assumptions are exposed, or someone pushes back.\n\nWhen credibility is on the line, this domain surfaces. It shows what leaders rely on to feel their reasoning holds: arriving at the right answer, building a well-structured analysis, ensuring their reasoning lands as credible, or making their assumptions and logic clear enough to examine and adapt.`,

    assets: {
      execution: {
        possible: [
          "Clear, decisive answers under pressure",
          "Faster movement from debate to decision",
          "Strong direction when clarity is needed"
        ],
        costs: [
          "Premature closure on incomplete reasoning",
          "Limited exploration of alternative interpretations",
          "Difficulty revisiting initial conclusions"
        ]
      },
      orchestration: {
        possible: [
          "Well-structured, rigorous analysis",
          "Clear articulation of assumptions and logic",
          "High confidence in how decisions are built"
        ],
        costs: [
          "Slower decisions when clarity is incomplete",
          "Analysis prioritized over speed when decisions are time-sensitive",
          "Difficulty acting without complete analysis"
        ]
      },
      navigation: {
        possible: [
          "Reasoning lands clearly with stakeholders",
          "Strong alignment around how decisions are understood",
          "Credibility maintained across differing perspectives"
        ],
        costs: [
          "Framing shaped by audience over own thinking",
          "Hesitation when reasoning diverges from the room",
          "Social pressure compromises ability to access your own reasoning"
        ]
      },
      integration: {
        possible: [
          "Reasoning adapts as new information emerges",
          "Assumptions surfaced and tested in real time",
          "Decisions built on more resilient logic"
        ],
        costs: [
          "Delayed closure when decisions are needed",
          "Unclear position while thinking is evolving",
          "Frustration from others seeking a clear answer"
        ]
      }
    },

    scenario: `You are in a senior leadership meeting. A decision is being made about a major initiative shaped by your thinking, and your team has been carrying most of the execution across several groups. New information is pushing a shift in direction that will create strain for your team. A peer challenges the direction publicly and looks to you to respond.`,

    framingLine: `In this moment, your instinct is to move into [Mode] Mode:`,

    primary: {
      execution: `Your focus goes to resolving the question. The differing views create pressure to land on a clear answer, and you move to close the gap by sharpening the conclusion. You restate the decision, clarify what you believe is true, and push toward alignment so the group can move forward. Leaving the reasoning open feels like a delay when a decision needs to be made.`,
      orchestration: `Focus on how the reasoning is being built and whether it holds up. The differing views signal that something in the analysis may be incomplete or not fully understood. You slow the conversation down to clarify how the original thinking was formed, what assumptions were in play, and where the reasoning may be breaking down. Before moving forward, you want the logic to be fully worked through.`,
      navigation: `Focus on how your reasoning is landing and how to position it effectively in the room. The challenge makes you aware of how your thinking is being interpreted and what your response will signal. You adjust how you frame your point so it comes across as credible and well-considered, while also tracking how others are responding. It matters that your reasoning is received as credible and well-considered, not just stated.`,
      integration: `The disagreement doesn't need to be resolved right away. It signals that something in the thinking may not be holding as expected. You stay with the tension to examine which assumptions are driving the difference before moving to a conclusion. If the answer changes, you rework it based on what becomes clearer. The conversation may move faster than you're ready to.`
    },

    secondary: {
      execution: `You focus on getting to a clear answer. If the direction is being challenged, you step in to restate the conclusion and move the decision forward.`,
      orchestration: `You focus on how the reasoning is being built. You slow the conversation down to clarify assumptions and make sure the logic holds before moving forward.`,
      navigation: `You focus on how your reasoning is landing. You adjust how you frame your point so it comes across as credible and aligns with how others are reading it.`,
      integration: `You focus on what the challenge is revealing. You stay with the tension to examine assumptions and adjust the thinking if the conclusion no longer holds.`
    },

    question: `Think of a recent decision under pressure. Where did you move too quickly or stay too long before deciding?`
  },

  authority: {
    about: `Authority examines how you hold accountability when work is no longer yours to control directly. As leadership scope expands, decisions move through teams and systems rather than through you. Others carry work that still reflects on your judgment and your name.\n\nWhen delegated work drifts, creates friction, or produces outcomes that differ from expectation, this domain surfaces. It shows what you rely on to feel that accountability is held: your direct involvement, the oversight structure you maintain, whether your leadership is being read correctly by others, or whether the system is strong enough to produce outcomes without your intervention.`,

    assets: {
      execution: {
        possible: [
          "Clear direction when accountability is at risk",
          "Fast intervention to stabilize outcomes",
          "Strong ownership of results"
        ],
        costs: [
          "Limited space for others to fully own work",
          "Dependence on your direct involvement",
          "Difficulty trusting the system to hold once you've re-engaged"
        ]
      },
      orchestration: {
        possible: [
          "Clear ownership across roles and teams",
          "Consistent decision-making structures",
          "Accountability held through defined processes"
        ],
        costs: [
          "Slower response when ownership needs to shift",
          "Over-reliance on established decision structures",
          "Difficulty adapting roles in fluid situations"
        ]
      },
      navigation: {
        possible: [
          "Authority reinforced through appropriate positioning",
          "Credibility maintained in complex group dynamics",
          "Leadership presence reads as deliberate and appropriate"
        ],
        costs: [
          "Hesitation to assert authority when needed",
          "Attention split between action and perception",
          "Risk of under-signaling ownership"
        ]
      },
      integration: {
        possible: [
          "Accountability held across the broader system",
          "Ownership distributed effectively beyond you",
          "Systems that sustain outcomes without intervention"
        ],
        costs: [
          "Delayed intervention when issues emerge",
          "Unclear point of ownership in critical moments",
          "Frustration from others seeking direct leadership"
        ]
      }
    },

    scenario: `You are in a senior leadership meeting. A decision is being made about a major initiative shaped by your thinking, and your team has been carrying most of the execution across several groups. New information is pushing a shift in direction that will create strain for your team. A peer challenges the direction publicly and looks to you to respond.`,

    framingLine: `In this moment, your instinct is to move into [Mode] Mode:`,

    primary: {
      execution: `Your focus shifts to ownership of the outcome. The challenge and shifting direction make accountability feel exposed, and you move to reclaim it by stepping more directly into the decision. You clarify what should happen, who should do what, and ensure the path forward reflects your judgment. Letting it play out without your involvement doesn't feel like holding accountability.`,
      orchestration: `Focus on how accountability is being held across the group. The shift in direction raises questions about how decisions are being made and whether roles and expectations are clear. You work to re-establish structure by clarifying ownership, tightening how decisions move, and making sure the right people are accountable for what happens next. Stability comes from making the system of oversight more explicit.`,
      navigation: `Focus on how your authority is being read in the moment. The public challenge and unclear ownership make it important to show up in a way that maintains your position without overstepping. You calibrate when and how to step in, making sure your involvement reads as decisive and appropriate, not as taking over or stepping back too far. It matters that your involvement reads as decisive and appropriate, not as taking over or stepping back too far.`,
      integration: `You don't step in immediately. The situation raises questions about how ownership is actually operating and whether accountability is clear enough to hold. You take time to understand where responsibility is sitting before intervening. If something needs to change, you adjust how ownership is structured rather than taking control of the outcome. Others may want you to step in sooner than you do.`
    },

    secondary: {
      execution: `You focus on reasserting ownership. If accountability feels at risk, you step in directly to make sure the outcome is right.`,
      orchestration: `You focus on how accountability is being managed. You clarify roles and tighten how decisions move so ownership is clear and the work stays on track.`,
      navigation: `You focus on how your authority is being read. You calibrate your involvement so you maintain your position without overstepping or stepping back too far.`,
      integration: `You focus on what the situation reveals about the system. You look at how accountability is structured and adjust it so the system can hold the work without your direct involvement.`
    },

    question: `In moments where outcomes are at risk, when do you step in too early, and when do you wait longer than you should?`
  },

  loyalty: {
    about: `Loyalty examines how you hold responsibility when the interests of your team and the needs of the broader organization pull in different directions. Senior leadership regularly requires decisions that create real cost for the people closest to you, and you may not be able to soften, negotiate, or protect your team from that impact.\n\nWhen those tradeoffs become unavoidable, this domain surfaces. It shows what you rely on to hold that tension: protecting your team, managing how the tradeoff is handled, whether your allegiance is being read correctly by both sides, or what best serves the system as a whole.`,

    assets: {
      execution: {
        possible: [
          "Strong advocacy for your team's interests",
          "Clear representation of team impact",
          "Protection against unacknowledged team burden"
        ],
        costs: [
          "Narrow focus on team over broader system needs",
          "Team shielded from organizational context they may need",
          "Enterprise priorities harder to hold when team cost is visible"
        ]
      },
      orchestration: {
        possible: [
          "Tradeoffs handled in a clear, structured way",
          "Alignment maintained across team and organization",
          "Balanced consideration of competing priorities"
        ],
        costs: [
          "Slower positioning when advocacy is needed",
          "Over-focus on process of decision over stance",
          "Difficulty taking a clear side under pressure"
        ]
      },
      navigation: {
        possible: [
          "Credibility maintained across multiple groups",
          "Stance interpreted as fair and well-balanced",
          "Able to hold credibility with team and organization simultaneously"
        ],
        costs: [
          "Hesitation to clearly favor one side",
          "Attention split between stance and perception",
          "Risk of appearing non-committal to both sides"
        ]
      },
      integration: {
        possible: [
          "Decisions that hold at the system level",
          "Tradeoffs surfaced and worked through fully",
          "Balance between local impact and broader need"
        ],
        costs: [
          "Reduced clarity of support for your team",
          "Frustration when advocacy is expected",
          "Perception of distance from team impact"
        ]
      }
    },

    scenario: `You are in a senior leadership meeting. A decision is being made about a major initiative shaped by your thinking, and your team has been carrying most of the execution across several groups. New information is pushing a shift in direction that will create strain for your team. A peer challenges the direction publicly and looks to you to respond.`,

    framingLine: `In this moment, your instinct is to move into [Mode] Mode:`,

    primary: {
      execution: `The impact on your team is front and center. You step in to represent them directly so that cost isn't overlooked or minimized. You make the implications visible and push for a path that doesn't leave them carrying the burden alone. Staying neutral doesn't feel acceptable when your team is affected.`,
      orchestration: `Focus on how the tension between the team and the organization is being handled. You're less concerned with taking a side and more with making sure the tradeoff is being worked through in a clear and structured way. You clarify the reasoning behind the shift, how the decision is being made, and whether the implications for your team are fully understood. Your instinct is to make sure the decision process holds even when the stakes are high.`,
      navigation: `Focus on how your position is being interpreted by both your team and your peers. The moment requires you to represent your team while also maintaining credibility with the broader group. You calibrate how you respond so your team feels you are standing with them, while others see you as fair and balanced. It matters that your stance is read as appropriate in both directions.`,
      integration: `The pull to take a side isn't immediate. The strain on your team is real, but so is the broader need driving the change. You stay with the tradeoff and make it visible rather than resolving it too quickly in one direction. If the system-level direction holds, you support it even with local cost. Your team may expect more direct advocacy than you offer in that moment.`
    },

    secondary: {
      execution: `You focus on protecting your team. If the decision creates strain for them, you step in to advocate and make sure their impact is addressed.`,
      orchestration: `You focus on how the tension is being managed. You work to clarify the tradeoff and make sure the decision process holds as it moves forward.`,
      navigation: `You focus on how your position is being read. You balance representing your team with maintaining credibility across the group.`,
      integration: `You focus on what best serves the system. You stay with the tradeoff and support the direction that holds at the broader level, even if it creates local cost.`
    },

    question: `When priorities pull in different directions, where do you lean too quickly, or hold your position longer than the moment calls for?`
  },

  presence: {
    about: `Presence examines what happens in real time when challenge or emotional intensity enters a conversation. Leadership regularly creates moments where something unexpected occurs, a position is challenged, or frustration surfaces, and your response is visible and consequential.\n\nWhen pressure arrives without warning, this domain surfaces. It shows what you rely on to stay steady in the moment: addressing the moment directly, structuring the interaction, managing how your response is landing, or staying with the tension long enough to understand it.`,

    assets: {
      execution: {
        possible: [
          "Clear, direct responses in charged moments",
          "Fast movement through tension toward resolution",
          "Strong re-establishment of direction in conversation"
        ],
        costs: [
          "Moves to resolution before full understanding",
          "Limited space for underlying issues to surface",
          "Charges addressed before their source is understood"
        ]
      },
      orchestration: {
        possible: [
          "Conversations held in a clear, structured format",
          "Tension managed without escalation",
          "Productive dialogue maintained under pressure"
        ],
        costs: [
          "Slows momentum when quick response is needed",
          "Over-structuring can limit organic exchange",
          "Difficulty allowing conversation to unfold naturally"
        ]
      },
      navigation: {
        possible: [
          "Presence reads as steady and composed",
          "Tone and timing reinforce credibility",
          "Interactions handled with social awareness"
        ],
        costs: [
          "Attention split between content and delivery",
          "Hesitation to respond directly when needed",
          "Risk of over-calibrating in high-pressure moments"
        ]
      },
      integration: {
        possible: [
          "Deeper understanding of what is driving tension",
          "Space for unspoken dynamics to surface",
          "Conversations that address underlying issues"
        ],
        costs: [
          "Slows resolution when action is expected",
          "Unclear response while meaning is still forming",
          "Frustration from others seeking forward movement"
        ]
      }
    },

    scenario: `You are in a senior leadership meeting. A decision is being made about a major initiative shaped by your thinking, and your team has been carrying most of the execution across several groups. New information is pushing a shift in direction that will create strain for your team. A peer challenges the direction publicly and looks to you to respond.`,

    framingLine: `In this moment, your instinct is to move into [Mode] Mode:`,

    primary: {
      execution: `Your focus goes to moving the moment forward. The tension in the room creates pressure to respond, and you step in directly to address the challenge and regain momentum. You clarify your position, respond to the concern, and work to bring the conversation back to a clear path. Letting the moment sit unresolved feels unproductive.`,
      orchestration: `Focus on structuring the interaction so the conversation holds. The tension signals that something in how the discussion is unfolding isn't working, and your instinct is to reset it. You slow things down, clarify what's being debated, and guide the conversation into a more contained and productive format. Without that reset, the moment loses whatever clarity it had.`,
      navigation: `Focus on how you are showing up in the moment and how your response will be interpreted. The public nature of the challenge makes you aware of tone, timing, and how your reaction might land. You adjust how you engage so your response feels measured and steady, even as the tension rises. It matters that your presence reinforces credibility rather than escalating the situation.`,
      integration: `You don't respond right away. The tension signals that something important may not have been fully surfaced. You stay with the moment, asking questions and letting the exchange unfold before moving to resolution. Slowing things down helps you understand what's actually driving the reaction. The group may be ready to move before you are.`
    },

    secondary: {
      execution: `You move the conversation forward. You respond directly to the challenge and work to bring the group back to a clear path.`,
      orchestration: `You focus on structuring the conversation. You slow things down, clarify the issue, and guide the discussion into a more productive format.`,
      navigation: `You focus on how you are showing up. You adjust your tone and response so you come across as steady and credible under pressure.`,
      integration: `You stay with the tension. You focus on understanding what's driving the reaction before moving to resolve it.`
    },

    question: `When a conversation becomes tense, how does your first response shape where the moment goes?`
  }

};


// ORIENTATION_CONTENT — v16
// Structure: domain number (int) → placement string → { pattern: string }
// Single field per orientation. No other fields.

const ORIENTATION_CONTENT = {

  1: {
    "1": {
      pattern: "In this domain, Execution Mode relies on staying closely connected to the work itself. Confidence comes from being able to see how the outcome is taking shape and to step in when it starts to drift. Under pressure, it protects against loss of control by re-engaging directly and making the direction explicit. This keeps the work aligned, but can make it harder to trust others to carry it forward without your involvement."
    },
    "2a": {
      pattern: "In this domain, Orchestration Mode relies on how the work is structured and managed as it moves through others. Confidence comes from knowing the right processes, roles, and expectations are in place to carry the work forward. Under pressure, it protects against breakdown by reinforcing structure and ensuring the work is being handled as intended. This creates consistency and continuity, but can make it harder to allow the work to evolve when it needs to move beyond the original design."
    },
    "2b": {
      pattern: "In this domain, Navigation Mode relies on how your contribution is understood and recognized by others. Confidence comes from knowing your role in shaping the work is visible and interpreted accurately. Under pressure, it protects against being overlooked or misread by managing how your contribution is communicated and perceived. This helps maintain influence and clarity of role, but can make it harder to stay grounded in the work itself without tracking how it reflects on you."
    },
    "3": {
      pattern: "In this domain, Integration Mode relies on the strength of the thinking behind the work rather than direct involvement in it. Confidence comes from knowing the direction is sound and can hold as it moves through others. Under pressure, it protects against attachment to personal contribution by staying focused on what the work requires now. This allows the work to evolve and strengthen over time, but can make it harder to make your thinking legible to others when the work needs clearer direction or attribution."
    }
  },

  2: {
    "1": {
      pattern: "In this domain, Execution Mode relies on arriving at a clear and decisive answer. Confidence comes from being able to determine what is true and move forward with conviction. Under pressure, it protects against uncertainty by closing on a conclusion and reinforcing it so the decision can move ahead. This drives clarity and momentum, but can make it harder to stay open to new information when the reasoning needs further examination."
    },
    "2a": {
      pattern: "In this domain, Orchestration Mode relies on how the reasoning is structured and worked through. Confidence comes from knowing the logic is sound, assumptions are clear, and the analysis holds together end to end. Under pressure, it protects against flawed conclusions by slowing things down and ensuring the reasoning is fully developed. This strengthens the quality of decisions, but can make it harder to move forward when the situation requires acting without complete clarity."
    },
    "2b": {
      pattern: "In this domain, Navigation Mode relies on how your reasoning is interpreted and received by others. Confidence comes from knowing your thinking is understood, credible, and aligned with how others are making sense of the situation. Under pressure, it protects against being dismissed or misunderstood by adjusting how the reasoning is framed and communicated. This helps build alignment and acceptance, but can make it harder to stay anchored in your own line of thinking when it diverges from the room."
    },
    "3": {
      pattern: "In this domain, Integration Mode relies on the strength and adaptability of the underlying logic. Confidence comes from knowing the reasoning can be examined, adjusted, and still hold as new information emerges. Under pressure, it protects against premature conclusions by continuing to test assumptions and refine the thinking. This leads to more resilient decisions, but can make it harder to signal a clear position when others are looking for closure."
    }
  },

  3: {
    "1": {
      pattern: "In this domain, Execution Mode relies on direct involvement in how outcomes are delivered. Confidence comes from being able to step in, make decisions, and ensure the work reflects your judgment. Under pressure, it protects against loss of control by reasserting ownership and taking a more active role in driving the outcome. This stabilizes results and reinforces accountability, but can make it harder to allow others to fully own the work when they are in position to carry it."
    },
    "2a": {
      pattern: "In this domain, Orchestration Mode relies on how ownership and decisions are structured across people and teams. Confidence comes from knowing roles are clear, decision paths are defined, and accountability is consistently held. Under pressure, it protects against breakdown by tightening how decisions are made and ensuring responsibility is properly assigned. This creates clarity and consistency, but can make it harder to adjust ownership dynamically when the situation calls for more flexibility."
    },
    "2b": {
      pattern: "In this domain, Navigation Mode relies on how your authority is interpreted by others. Confidence comes from knowing your role, involvement, and level of control are being read appropriately in the context of the situation. Under pressure, it protects against being undermined or mispositioned by calibrating how and when you step in. This helps maintain credibility and appropriate influence, but can make it harder to act decisively when the situation requires clearer assertion of authority."
    },
    "3": {
      pattern: "In this domain, Integration Mode relies on how accountability is held across the system rather than through individual control. Confidence comes from knowing ownership is structured in a way that can produce outcomes without your direct intervention. Under pressure, it protects against over-reliance on individual authority by examining how responsibility is distributed and adjusting it where needed. This strengthens the system's ability to hold the work, but can make it harder to provide immediate direction when others are looking for a clear point of ownership."
    }
  },

  4: {
    "1": {
      pattern: "In this domain, Execution Mode relies on directly representing and protecting your team. Confidence comes from being able to advocate clearly for their interests and ensure their impact is not overlooked. Under pressure, it protects against your team carrying unacknowledged cost by stepping in and making that impact visible. This ensures your team is represented and supported, but can make it harder to hold the broader tradeoff when the system requires a direction that creates local strain."
    },
    "2a": {
      pattern: "In this domain, Orchestration Mode relies on how the tension between team and organization is worked through. Confidence comes from knowing the tradeoff is being handled in a structured and deliberate way, with both sides clearly understood. Under pressure, it protects against misalignment by ensuring the tradeoff is worked through clearly and the implications are fully understood on both sides. This maintains alignment across the system, but can make it harder to take a clear position when the moment calls for stronger advocacy."
    },
    "2b": {
      pattern: "In this domain, Navigation Mode relies on how your stance is interpreted by both your team and the broader organization. Confidence comes from knowing you are being seen as fair, balanced, and appropriately aligned in both directions. Under pressure, it protects against being misread or misaligned by carefully shaping how your position is communicated. This helps maintain credibility across groups, but can make it harder to take a position that clearly favors one side when the situation requires it."
    },
    "3": {
      pattern: "In this domain, Integration Mode relies on holding the needs of the system as a whole. Confidence comes from knowing the direction serves the broader context, even when it creates local cost. Under pressure, it protects against narrowing to one side by keeping the tradeoff visible and working through it without resolving it prematurely. This supports decisions that hold at the system level, but can make it harder to signal clear support to your team when they are directly affected."
    }
  },

  5: {
    "1": {
      pattern: "In this domain, Execution Mode relies on responding directly to what is happening in the moment. Confidence comes from being able to step in, address the issue, and move the interaction forward. Under pressure, it protects against loss of control by acting quickly to resolve tension and re-establish direction. This keeps conversations focused and moving, but can make it harder to stay with what is emerging when the situation requires more time to unfold."
    },
    "2a": {
      pattern: "In this domain, Orchestration Mode relies on how the interaction is structured and contained. Confidence comes from being able to shape the conversation so it stays productive and on track. Under pressure, it protects against escalation by slowing things down and guiding the exchange into a clearer format. This creates stability in the interaction, but can make it harder to allow the conversation to develop organically when something important has not yet surfaced."
    },
    "2b": {
      pattern: "In this domain, Navigation Mode relies on how you are coming across in the moment. Confidence comes from knowing your tone, timing, and response are being interpreted as steady and appropriate. Under pressure, it protects against being misread or escalating the situation by adjusting how you engage. This helps maintain credibility and composure, but can make it harder to respond directly when the moment calls for greater clarity or candor."
    },
    "3": {
      pattern: "In this domain, Integration Mode relies on staying with what is happening beneath the surface of the interaction. Confidence comes from knowing the moment can be understood more fully before moving to resolution. Under pressure, it protects against reacting too quickly by allowing the tension to unfold and examining what is driving it. This creates space for deeper understanding, but can make it harder to move the conversation forward when others are ready to act."
    }
  }

};



function SH({children}) {
  return <p style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.slate,fontWeight:600,marginBottom:10,marginTop:28}}>{children}</p>;
}
function BT({children,style={}}) {
  return <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,marginBottom:12,...style}}>{children}</p>;
}
function MP({text}) {
  return <>{text.split("\n\n").map((p,i)=><BT key={i}>{p}</BT>)}</>;
}
function HR() {
  return <div style={{height:1,background:C.warmWhite,marginBottom:24,marginTop:4}}/>;
}

function DomainPage({domain, placement}) {
  const dc = DOMAIN_CONTENT[domain];
  const oc = ORIENTATION_CONTENT[domain];
  const orient = oc[placement] || oc["2b"];
  const isTransitional = placement === "2b+";
  const poles = DOMAIN_POLES[domain];
  const pos = ORIENTATION_ORDER[placement] || 0;
  const pct = [15,38,63,85][pos];

  return (
    <div style={{maxWidth:720}}>
      {/* Header */}
      <div style={{background:C.deepCharcoal,padding:"22px 26px",marginBottom:24}}>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:300,color:C.warmWhite,marginBottom:4}}>{DOMAIN_NAMES[domain]}</h2>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:12,color:C.midBlue,fontWeight:300}}>Leadership tension: {DOMAIN_TENSIONS[domain]}</p>
      </div>

      {/* Continuum bar */}
      <div style={{marginBottom:28}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
          <span style={{fontSize:12,fontWeight:600,color:C.nearBlack}}>{DOMAIN_NAMES[domain]}</span>
          <span style={{fontSize:11,color:C.midBlue,fontWeight:300}}>{ORIENTATION_LABELS[placement]}</span>
        </div>
        <div style={{position:"relative",height:6,background:C.warmWhite,borderRadius:3,marginBottom:6}}>
          <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,background:`linear-gradient(to right,${C.warmWhite},${C.slate})`,borderRadius:3}}/>
          <div style={{position:"absolute",top:"50%",left:`${pct}%`,transform:"translate(-50%,-50%)",width:14,height:14,borderRadius:"50%",background:C.gold,border:`2px solid ${C.goldDark}`,boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:11,color:C.midBlue,fontWeight:300}}>{poles.left}</span>
          <span style={{fontSize:11,color:C.midBlue,fontWeight:300}}>{poles.right}</span>
        </div>
      </div>

      <HR/>

      {/* 1. About This Domain */}
      <SH>About This Domain</SH>
      <MP text={dc.description}/>
      <HR/>

      {/* 2. The Four Orientations */}
      <SH>The Four Leadership Orientations</SH>
      <div style={{marginBottom:12}}>
        {dc.orientations.map((o,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:16,padding:"10px 0",borderBottom:`1px solid ${C.warmWhite}`}}>
            <span style={{fontSize:13,fontWeight:600,color:C.nearBlack}}>{o.label}</span>
            <span style={{fontSize:13,fontWeight:300,color:C.nearBlack,lineHeight:1.6}}>{o.desc}</span>
          </div>
        ))}
      </div>
      {dc.orientationsNote && <BT style={{marginTop:8}}>{dc.orientationsNote}</BT>}
      <HR/>

      {/* 3. When This Pattern Shows Up */}
      <SH>When This Pattern Shows Up</SH>
      <BT>{dc.scenarios.intro}</BT>
      {[dc.scenarios.s1, dc.scenarios.s2].map((s,si)=>(
        <div key={si} style={{marginBottom:20}}>
          <p style={{fontFamily:"system-ui,sans-serif",fontSize:12,fontWeight:600,color:C.slate,marginBottom:6,letterSpacing:"0.04em"}}>{s.title}</p>
          <BT>{s.text}</BT>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
            {s.responses.map((r,ri)=>(
              <div key={ri} style={{display:"grid",gridTemplateColumns:"140px 1fr",gap:12,padding:"8px 12px",background:C.lightSage}}>
                <span style={{fontSize:12,fontWeight:600,color:C.slate}}>{r.label}</span>
                <span style={{fontSize:13,fontWeight:300,color:C.nearBlack,lineHeight:1.6,fontStyle:"italic"}}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {dc.scenarios.closing && <BT>{dc.scenarios.closing}</BT>}
      <HR/>

      {/* 4. Your Orientation */}
      <SH>Your Orientation: {isTransitional ? "Navigation Mode (Emerging System Orientation)" : ORIENTATION_LABELS[placement]}</SH>
      {isTransitional && (
        <div style={{background:C.lightSage,padding:"16px 20px",borderLeft:`3px solid ${C.gold}`,marginBottom:16}}>
          <MP text={orient.transitional}/>
        </div>
      )}
      <MP text={orient.intro}/>
      <HR/>

      {/* 5. What This Looks Like in Practice */}
      <SH>What This Looks Like in Practice</SH>
      <div style={{marginBottom:8}}>
        {orient.bullets.map((b,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:10}}>
            <div style={{width:3,background:C.slate,flexShrink:0,marginTop:4,alignSelf:"stretch"}}/>
            <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.7,color:C.nearBlack,fontWeight:300}}>{b}</p>
          </div>
        ))}
      </div>
      {orient.bulletsNote && <BT style={{marginTop:8,fontStyle:"italic",color:C.midBlue}}>{orient.bulletsNote}</BT>}
      <HR/>

      {/* 6. What This Orientation Makes Possible */}
      <SH>What This Orientation Makes Possible</SH>
      <MP text={orient.possible}/>
      <HR/>

      {/* 7. What the Next Shift Looks Like */}
      <SH>What the Next Shift Looks Like</SH>
      <MP text={orient.shift}/>
      <HR/>

      {/* 8. Working With This Pattern */}
      <SH>Working With This Pattern</SH>
      <BT>{orient.reflection.intro}</BT>
      <BT>You might explore:</BT>
      <div style={{marginBottom:16}}>
        {orient.reflection.questions.map((q,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:12}}>
            <span style={{color:C.slate,fontWeight:600,flexShrink:0,fontSize:14,minWidth:16}}>{i+1}.</span>
            <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.7,color:C.nearBlack,fontWeight:300}}>{q}</p>
          </div>
        ))}
      </div>
      <HR/>

      {/* 9. Leadership Moment to Practice */}
      <SH>Leadership Moment to Practice</SH>
      <MP text={dc.moment.text}/>
      <div style={{background:C.lightSage,padding:"16px 20px",borderLeft:`3px solid ${C.slate}`,marginBottom:16}}>
        <p style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:300,color:C.deepCharcoal,lineHeight:1.6,fontStyle:"italic"}}>{dc.moment.question}</p>
      </div>
      {dc.moment.closing && <BT>{dc.moment.closing}</BT>}
      <HR/>

      {/* 10. Cross-Domain Insight */}
      <SH>Cross-Domain Insight</SH>
      <MP text={dc.crossDomain}/>
    </div>
  );
}

// ── SUPABASE ──
const SB_URL = "https://yvxhupwsiecpmredaiul.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2eGh1cHdzaWVjcG1yZWRhaXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MzE0MjgsImV4cCI6MjA4ODMwNzQyOH0.0YOLB2eGt60lKqBNQmVqJrn0lit7mhth0APIC0zCpAU";
const SB_HEADERS = { "Content-Type": "application/json", "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` };

async function sbGet(table, params="") {
  const res = await fetch(`${SB_URL}/rest/v1/${table}?${params}`, { headers: SB_HEADERS });
  return res.json();
}
async function sbUpsert(table, data) {
  await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...SB_HEADERS, "Prefer": "resolution=merge-duplicates" },
    body: JSON.stringify(data)
  });
}
async function sbPatch(table, match, data) {
  await fetch(`${SB_URL}/rest/v1/${table}?${match}`, {
    method: "PATCH",
    headers: SB_HEADERS,
    body: JSON.stringify(data)
  });
}

// ── MAIN APP ──
export default function App() {
  const [screen,setScreen]=useState("landing");
  const [authMode,setAuthMode]=useState("register");
  const [currentUser,setCurrentUser]=useState(null);
  const [qIndex,setQIndex]=useState(0);
  const [responses,setResponses]=useState([]);
  const [selected,setSelected]=useState(null);
  const [mostSel,setMostSel]=useState(null);
  const [leastSel,setLeastSel]=useState(null);
  const [animKey,setAnimKey]=useState(0);
  const [coachView,setCoachView]=useState("results");
  const [selectedP,setSelectedP]=useState(null);
  const [reportTab,setReportTab]=useState("intro");
  const [domainTab,setDomainTab]=useState(1);
  const [participants,setParticipants]=useState({});
  const [invites,setInvites]=useState({});
  const [loading,setLoading]=useState(true);
  const [inviteName,setInviteName]=useState("");
  const [newCode,setNewCode]=useState(null);
  const [loginEmail,setLoginEmail]=useState("");
  const [loginCode,setLoginCode]=useState("");
  const [loginErr,setLoginErr]=useState("");
  const [regName,setRegName]=useState("");
  const [regEmail,setRegEmail]=useState("");
  const [regInvite,setRegInvite]=useState("");
  const [regErr,setRegErr]=useState("");
  const [shownBeforeYouBegin,setShownBeforeYouBegin]=useState(false);

  const COACH_EMAIL="jnguyen.11421@gmail.com", COACH_PASS="LAI2024coach";
  const completedList=Object.values(participants).filter(p=>p.completed);

  // Load all data from Supabase on mount
  useEffect(()=>{
    async function load() {
      try {
        const [pRows,iRows] = await Promise.all([
          sbGet("participants","select=*"),
          sbGet("invites","select=*")
        ]);
        const pMap={};
        (pRows||[]).forEach(r=>{
          pMap[r.email]={name:r.name,email:r.email,completed:r.completed,completedAt:r.completed_at,results:r.results};
        });
        if(Object.keys(pMap).length===0){
          const demo={name:"Alex Rivera",email:"demo@example.com",completed:true,completedAt:new Date().toISOString(),results:scoreAll(ITEMS_SOURCE.map((item)=>{
            if(item[3]==="forced") return {id:item[0],domain:item[1],most:0,least:3};
            return {id:item[0],domain:item[1],selected:0};
          }))};
          pMap["demo@example.com"]=demo;
          await sbUpsert("participants",{email:demo.email,name:demo.name,completed:demo.completed,completed_at:demo.completedAt,results:demo.results});
        }
        setParticipants(pMap);
        const iMap={};
        (iRows||[]).forEach(r=>{iMap[r.code]={name:r.name,used:r.used,permanent:r.permanent};});
        setInvites(iMap);
      } catch(e){ console.error("Load error:",e); }
      setLoading(false);
    }
    load();
  },[]);

  async function handleLogin(){
    setLoginErr("");
    if(loginEmail.toLowerCase()===COACH_EMAIL.toLowerCase()&&loginCode===COACH_PASS){setScreen("coach");return;}
    try {
      const rows=await sbGet("participants",`email=eq.${encodeURIComponent(loginEmail.toLowerCase())}&select=*`);
      if(rows&&rows.length>0){
        const r=rows[0];
        const p={name:r.name,email:r.email,completed:r.completed,completedAt:r.completed_at,results:r.results};
        setCurrentUser(p);
        setParticipants(prev=>({...prev,[p.email]:p}));
        p.completed?setScreen("complete"):(setQIndex(0),setResponses([]),setSelected(null),setMostSel(null),setLeastSel(null),setAnimKey(k=>k+1),setScreen(shownBeforeYouBegin?"assessment":"beforeyoubegin"));
        return;
      }
    } catch(e){ console.error("Login error:",e); }
    setLoginErr("Invalid email or access code.");
  }

  async function handleRegister(){
    setRegErr("");
    const code=regInvite.toUpperCase();
    const invite=invites[code];
    if(!invite||(!invite.permanent&&invite.used)){setRegErr("Invalid invite code.");return;}
    if(!regName.trim()||!regEmail.trim()){setRegErr("Please complete all fields.");return;}
    const p={name:regName.trim(),email:regEmail.trim().toLowerCase(),completed:false,completedAt:null,results:null};
    try {
      await sbUpsert("participants",{email:p.email,name:p.name,completed:false,completed_at:null,results:null});
      if(!invite.permanent) await sbPatch("invites",`code=eq.${code}`,{used:true});
      setParticipants(prev=>({...prev,[p.email]:p}));
      if(!invite.permanent) setInvites(prev=>({...prev,[code]:{...prev[code],used:true}}));
    } catch(e){ console.error("Register error:",e); }
    setCurrentUser(p);
    setQIndex(0);setResponses([]);setSelected(null);setMostSel(null);setLeastSel(null);setAnimKey(k=>k+1);
    setScreen(shownBeforeYouBegin?"assessment":"beforeyoubegin");
  }

  async function handleNext(){
    const item=ITEMS[qIndex];
    const type=item[3];
    // Validate by type
    if(type==="forced"&&(mostSel===null||leastSel===null))return;
    if((type==="single"||type==="paired")&&selected===null)return;
    // Build response record
    let resp;
    if(type==="forced"){
      resp={id:item[0],domain:item[1],most:mostSel,least:leastSel};
    } else {
      resp={id:item[0],domain:item[1],selected};
    }
    const nr=[...responses,resp];
    setResponses(nr);
    if(qIndex+1>=ITEMS.length){
      const results=scoreAll(nr);
      const updated={...currentUser,completed:true,completedAt:new Date().toISOString(),results};
      setCurrentUser(updated);
      setParticipants(prev=>({...prev,[updated.email]:updated}));
      try {
        await sbPatch("participants",`email=eq.${encodeURIComponent(updated.email)}`,{completed:true,completed_at:updated.completedAt,results:updated.results});
      } catch(e){ console.error("Save error:",e); }
      setScreen("complete");
    } else {
      setQIndex(i=>i+1);setSelected(null);setMostSel(null);setLeastSel(null);setAnimKey(k=>k+1);
    }
  }

  const item=ITEMS[qIndex]||ITEMS[0];
  const progress=Math.round((qIndex/ITEMS.length)*100);

  if(loading) return (
    <div style={{fontFamily:"system-ui,sans-serif",background:C.offWhite,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div style={{width:32,height:32,border:`2px solid ${C.warmWhite}`,borderTop:`2px solid ${C.slate}`,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{fontSize:13,color:C.midBlue,fontWeight:300,letterSpacing:"0.06em"}}>Loading…</p>
    </div>
  );

  if(screen==="landing") return (
    <div style={{fontFamily:"system-ui,sans-serif",background:C.offWhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <Nav right={<Btn variant="outline" onClick={()=>{setAuthMode("login");setScreen("auth");}}>Coach Login</Btn>}/>
      <div style={{flex:1,display:"grid",gridTemplateColumns:"1fr 1fr"}}>
        <div style={{padding:"64px 52px 64px 64px",display:"flex",flexDirection:"column",justifyContent:"center",borderRight:`1px solid ${C.warmWhite}`}}>
          <p style={{fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:C.slate,fontWeight:600,marginBottom:18}}>Jen Nguyen · Executive Coaching</p>
          <h1 style={{fontFamily:"Georgia,serif",fontSize:46,fontWeight:300,lineHeight:1.1,color:C.deepCharcoal,marginBottom:8}}>Leadership<br/><em style={{color:C.slate}}>Patterns</em><br/>Profile</h1>
          <p style={{fontSize:13,color:C.midBlue,lineHeight:1.7,marginBottom:36,fontWeight:300,maxWidth:360}}>What drives your leadership in the moments that matter most.</p>
          <div style={{marginBottom:32}}>
            {["25 items across five leadership domains","Approximately 20–25 minutes to complete","Results reviewed with your coach before sharing","No right answers — only honest ones"].map((t,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:10}}>
                <div style={{width:16,height:1,background:C.slate,marginTop:8,flexShrink:0}}/>
                <span style={{fontSize:13,color:C.nearBlack,fontWeight:300,lineHeight:1.5}}>{t}</span>
              </div>
            ))}
          </div>
          <Btn variant="dark" onClick={()=>{setAuthMode("register");setScreen("auth");}}>Begin Inventory →</Btn>
        </div>
        <div style={{background:C.lightSage,padding:"64px 64px 64px 52px",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <p style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.midBlue,fontWeight:500,marginBottom:24}}>What this measures</p>
          {[{t:"Leadership Patterns Under Pressure",d:"Each domain represents a place where leadership patterns become visible when responsibility becomes consequential and the right answer is not obvious."},{t:"Five Domains",d:"Contribution · Reasoning · Authority · Loyalty · Presence"},{t:"Developmental Architecture",d:"Results show where your leadership patterns currently stabilize — and where the next developmental shift typically occurs."}].map((b,i)=>(
            <div key={i} style={{borderLeft:`2px solid ${C.slate}40`,paddingLeft:18,marginBottom:22}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:400,color:C.deepCharcoal,marginBottom:4}}>{b.t}</div>
              <div style={{fontSize:13,lineHeight:1.7,color:C.nearBlack,fontWeight:300}}>{b.d}</div>
            </div>
          ))}
          <div style={{width:32,height:1,background:C.midBlue,margin:"18px 0"}}/>
          <p style={{fontSize:13,color:C.midBlue,fontWeight:300,lineHeight:1.7}}>This inventory is used exclusively within an active coaching relationship. You will receive your results through a coaching conversation, not as a standalone report.</p>
        </div>
      </div>
    </div>
  );

  if(screen==="auth") return (
    <div style={{fontFamily:"system-ui,sans-serif",background:C.offWhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <Nav right={<Btn variant="outline" onClick={()=>setScreen("landing")}>← Back</Btn>}/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
        <div style={{width:"100%",maxWidth:420,padding:"48px 44px",background:C.lightSage,border:`1px solid ${C.warmWhite}`}}>
          {authMode==="login"?(
            <>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:300,color:C.deepCharcoal,marginBottom:5}}>Welcome back</h2>
              <p style={{fontSize:13,color:C.midBlue,marginBottom:28,fontWeight:300,lineHeight:1.6}}>Sign in to access your inventory or coach dashboard.</p>
              <FormField label="Email" value={loginEmail} onChange={setLoginEmail} type="email" placeholder="your@email.com"/>
              <FormField label="Access Code" value={loginCode} onChange={setLoginCode} type="password" placeholder="Enter your code"/>
              {loginErr&&<p style={{fontSize:12,color:"#b85450",marginBottom:10}}>{loginErr}</p>}
              <Btn variant="dark" style={{width:"100%",justifyContent:"center"}} onClick={handleLogin}>Continue →</Btn>
              <p style={{fontSize:12,color:C.midBlue,marginTop:14}}>New participant? <span style={{color:C.slate,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setAuthMode("register")}>Register with invite code</span></p>
            </>
          ):(
            <>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:300,color:C.deepCharcoal,marginBottom:5}}>Register</h2>
              <p style={{fontSize:13,color:C.midBlue,marginBottom:28,fontWeight:300,lineHeight:1.6}}>Enter your name, email, and the invite code provided by your coach.</p>
              <FormField label="Full Name" value={regName} onChange={setRegName} placeholder="Your full name"/>
              <FormField label="Email" value={regEmail} onChange={setRegEmail} type="email" placeholder="your@email.com"/>
              <FormField label="Invite Code" value={regInvite} onChange={setRegInvite} placeholder="Provided by your coach"/>
              {regErr&&<p style={{fontSize:12,color:"#b85450",marginBottom:10}}>{regErr}</p>}
              <Btn variant="dark" style={{width:"100%",justifyContent:"center"}} onClick={handleRegister}>Begin Inventory →</Btn>
              <p style={{fontSize:12,color:C.midBlue,marginTop:14}}>Already registered? <span style={{color:C.slate,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setAuthMode("login")}>Sign in</span></p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if(screen==="beforeyoubegin") return (
    <div style={{fontFamily:"system-ui,sans-serif",background:C.offWhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <Nav/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"44px 28px"}}>
        <div style={{width:"100%",maxWidth:560}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:300,color:C.deepCharcoal,marginBottom:8}}>Before you begin</div>
          <div style={{height:2,background:C.gold,width:48,marginBottom:28}}/>
          <p style={{fontSize:15,lineHeight:1.8,color:C.nearBlack,fontWeight:300,marginBottom:28}}>
            As you respond to each scenario, think of yourself in your current or most recent leadership role — one in which you are responsible for a team or group of direct reports.
          </p>
          <div style={{fontSize:13,fontWeight:600,color:C.slate,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14}}>A few terms used throughout</div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:36}}>
            {[
              {term:"Your team", def:"the people you directly lead, not a team you are a member of"},
              {term:"A senior leadership team", def:"a leadership team you are a member of"},
              {term:"A team member", def:"a competent but not exceptional performer from a team you currently supervise or have supervised in the past"},
            ].map(({term,def})=>(
              <div key={term} style={{display:"flex",gap:12,padding:"12px 16px",background:C.lightSage,borderLeft:`2px solid ${C.slate}`}}>
                <span style={{fontWeight:600,color:C.deepCharcoal,fontSize:14,flexShrink:0}}>{term}</span>
                <span style={{color:C.midBlue,fontSize:14}}>—</span>
                <span style={{color:C.nearBlack,fontSize:14,fontWeight:300,lineHeight:1.6}}>{def}</span>
              </div>
            ))}
          </div>
          <button onClick={()=>{setShownBeforeYouBegin(true);setScreen("assessment");}} style={{background:C.deepCharcoal,color:C.warmWhite,border:"none",padding:"14px 32px",fontSize:14,fontWeight:500,cursor:"pointer",letterSpacing:"0.06em"}}>
            BEGIN ASSESSMENT
          </button>
        </div>
      </div>
    </div>
  );

  if(screen==="assessment") return (
    <div style={{fontFamily:"system-ui,sans-serif",background:C.offWhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Nav right={<span style={{fontSize:12,color:C.midBlue}}>{currentUser?.name}</span>}/>
      <div style={{height:3,background:C.warmWhite}}><div style={{height:"100%",background:C.slate,width:`${progress}%`,transition:"width 0.4s ease"}}/></div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"44px 28px"}}>
        <div key={animKey} style={{width:"100%",maxWidth:660,animation:"fadeUp 0.3s ease"}}>
          {item[4]&&<div style={{fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,marginBottom:22,padding:"18px 22px",background:C.lightSage,borderLeft:`2px solid ${C.slate}`}}>{item[4]}</div>}
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:400,color:C.deepCharcoal,marginBottom:22,lineHeight:1.45}}>{item[5]}</div>
          {item[3]==="forced"?(
            <div>
              <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginBottom:8}}>
                <span style={{width:56,textAlign:"center",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.slate,fontWeight:600}}>MOST</span>
                <span style={{width:56,textAlign:"center",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.midBlue,fontWeight:600}}>LEAST</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {item[6].map((opt,i)=>{
                  const isMost=mostSel===i, isLeast=leastSel===i;
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"12px 14px",border:`1px solid ${isMost||isLeast?C.slate:C.warmWhite}`,background:isMost?C.lightSage:isLeast?"#fdf6f0":C.offWhite,transition:"all 0.15s"}}>
                      <div style={{fontSize:10,fontWeight:600,color:C.midBlue,width:18,flexShrink:0}}>{["A","B","C","D"][i]}</div>
                      <div style={{flex:1,fontSize:14,lineHeight:1.7,fontWeight:300,color:C.nearBlack}}>{opt}</div>
                      <div style={{display:"flex",gap:8,flexShrink:0}}>
                        <div onClick={()=>{if(leastSel===i)return;setMostSel(isMost?null:i);}} style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${isMost?C.slate:C.warmWhite}`,background:isMost?C.slate:"transparent",cursor:leastSel===i?"not-allowed":"pointer",opacity:leastSel===i?0.3:1,transition:"all 0.15s",fontSize:14,color:isMost?C.offWhite:C.midBlue}}>✓</div>
                        <div onClick={()=>{if(mostSel===i)return;setLeastSel(isLeast?null:i);}} style={{width:28,height:28,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${isLeast?C.midBlue:C.warmWhite}`,background:isLeast?"#8596a220":"transparent",cursor:mostSel===i?"not-allowed":"pointer",opacity:mostSel===i?0.3:1,transition:"all 0.15s",fontSize:14,color:isLeast?C.slate:C.midBlue}}>✗</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {item[6].map((opt,i)=>(
                <div key={i} onClick={()=>setSelected(i)} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",border:`1px solid ${selected===i?C.slate:C.warmWhite}`,cursor:"pointer",background:selected===i?C.lightSage:C.offWhite,transition:"all 0.15s"}}>
                  <div style={{width:24,height:24,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,letterSpacing:"0.06em",border:`1px solid ${selected===i?C.slate:C.midBlue}`,color:selected===i?C.offWhite:C.midBlue,background:selected===i?C.slate:"transparent",transition:"all 0.15s"}}>{["A","B","C","D"][i]}</div>
                  <div style={{fontSize:14,lineHeight:1.7,fontWeight:300,color:C.nearBlack,paddingTop:2}}>{opt}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:24}}>
            <span style={{fontSize:12,color:C.midBlue,letterSpacing:"0.06em"}}>{qIndex+1} of {ITEMS.length}</span>
            <Btn variant="dark" onClick={handleNext} style={{opacity:(item[3]==="forced"?(mostSel!==null&&leastSel!==null):(selected!==null))?1:0.35,pointerEvents:(item[3]==="forced"?(mostSel!==null&&leastSel!==null):(selected!==null))?"auto":"none"}}>{qIndex===ITEMS.length-1?"Submit":"Continue"} →</Btn>
          </div>
        </div>
      </div>
    </div>
  );

  if(screen==="complete") return (
    <div style={{fontFamily:"system-ui,sans-serif",background:C.offWhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <Nav/>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:40}}>
        <div style={{maxWidth:500,textAlign:"center",padding:"60px 48px",background:C.lightSage,border:`1px solid ${C.warmWhite}`}}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{marginBottom:24}}><circle cx="20" cy="20" r="19" stroke={C.slate} strokeWidth="1.5"/><path d="M11 20l7 7 11-14" stroke={C.slate} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <h2 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:300,color:C.deepCharcoal,marginBottom:10}}>Inventory Complete</h2>
          <p style={{fontSize:14,color:C.midBlue,lineHeight:1.7,fontWeight:300}}>Your responses have been recorded. Your coach will review your results and share them with you directly. There is nothing further to do at this time.</p>
        </div>
      </div>
    </div>
  );

  if(screen==="report"&&selectedP) {
    const REPORT_TABS=[
      ["intro","How Leadership Changes"],
      ["map","Patterns Map"],
      ["domain","Domain Profiles"],
      ["cross","Cross-Domain Insight"],
      ["path","Development Path"],
    ];
    return (
      <div style={{fontFamily:"system-ui,sans-serif",background:C.offWhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <Nav right={<div style={{display:"flex",gap:10}}><Btn variant="slate" onClick={()=>generatePDF(selectedP)}>↓ Download PDF</Btn><Btn variant="outline" onClick={()=>setScreen("coach")}>← Dashboard</Btn></div>}/>
        <div style={{borderBottom:`1px solid ${C.warmWhite}`,background:C.offWhite,padding:"0 40px",display:"flex",gap:0,overflowX:"auto"}}>
          {REPORT_TABS.map(([v,l])=>(
            <button key={v} onClick={()=>setReportTab(v)} style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.06em",textTransform:"uppercase",padding:"12px 16px",background:"none",border:"none",borderBottom:`2px solid ${reportTab===v?C.slate:"transparent"}`,color:reportTab===v?C.slate:C.midBlue,cursor:"pointer",fontWeight:reportTab===v?500:400,whiteSpace:"nowrap"}}>{l}</button>
          ))}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"40px 48px",maxWidth:860,margin:"0 auto",width:"100%"}}>
          <div style={{marginBottom:28,paddingBottom:20,borderBottom:`1px solid ${C.warmWhite}`}}>
            <p style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.slate,fontWeight:600,marginBottom:6}}>Leadership Patterns Profile</p>
            <h1 style={{fontFamily:"Georgia,serif",fontSize:32,fontWeight:300,color:C.deepCharcoal,marginBottom:3}}>{selectedP.name}</h1>
            <p style={{fontSize:13,color:C.midBlue,fontWeight:300}}>{new Date(selectedP.completedAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
          </div>

          {reportTab==="intro"&&<IntroPage/>}

          {reportTab==="map"&&(
            <div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:300,color:C.deepCharcoal,marginBottom:8}}>Your Leadership Patterns Map</h2>
              <p style={{fontSize:14,color:C.midBlue,lineHeight:1.7,fontWeight:300,marginBottom:32,maxWidth:560}}>Each line represents a leadership tension that becomes more visible when the stakes are high. The dot shows where your responses most often landed along that continuum.</p>
              <div style={{display:"flex",flexDirection:"column",gap:28,maxWidth:640}}>
                {[1,2,3,4,5].map(d=>{
                  const placement=selectedP.results[d].placement;
                  const pos=ORIENTATION_ORDER[placement]||0;
                  const pct=[15,38,63,85][pos];
                  const poles=DOMAIN_POLES[d];
                  return (
                    <div key={d}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                        <span style={{fontSize:12,fontWeight:600,color:C.nearBlack,letterSpacing:"0.03em"}}>{DOMAIN_NAMES[d]}</span>
                        <span style={{fontSize:11,color:C.midBlue,fontWeight:300}}>{ORIENTATION_LABELS[placement]}</span>
                      </div>
                      <div style={{position:"relative",height:6,background:C.warmWhite,borderRadius:3,marginBottom:6}}>
                        <div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,background:`linear-gradient(to right,${C.warmWhite},${C.slate})`,borderRadius:3}}/>
                        <div style={{position:"absolute",top:"50%",left:`${pct}%`,transform:"translate(-50%,-50%)",width:14,height:14,borderRadius:"50%",background:C.gold,border:`2px solid ${C.goldDark}`,boxShadow:"0 1px 3px rgba(0,0,0,0.15)"}}/>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <span style={{fontSize:11,color:C.midBlue,fontWeight:300}}>{poles.left}</span>
                        <span style={{fontSize:11,color:C.midBlue,fontWeight:300}}>{poles.right}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{height:1,background:C.warmWhite,margin:"36px 0"}}/>
              <div style={{background:C.lightSage,padding:"20px 24px",borderLeft:`2px solid ${C.slate}`,maxWidth:640}}>
                <p style={{fontSize:14,lineHeight:1.8,color:C.nearBlack,fontWeight:300}}>These patterns are not fixed. They reflect where your leadership currently tends to default when responsibility becomes difficult to carry. The goal is not to evaluate capability, but to make these tendencies visible.</p>
              </div>
            </div>
          )}

          {reportTab==="domain"&&(
            <div>
              <div style={{display:"flex",gap:6,marginBottom:28,flexWrap:"wrap"}}>
                {[1,2,3,4,5].map(d=>(
                  <button key={d} onClick={()=>setDomainTab(d)} style={{fontFamily:"system-ui,sans-serif",fontSize:12,padding:"7px 14px",background:domainTab===d?C.deepCharcoal:C.lightSage,color:domainTab===d?C.warmWhite:C.nearBlack,border:`1px solid ${domainTab===d?C.deepCharcoal:C.warmWhite}`,cursor:"pointer",fontWeight:400}}>{DOMAIN_NAMES[d]}</button>
                ))}
              </div>
              <DomainPage domain={domainTab} placement={selectedP.results[domainTab].placement}/>
            </div>
          )}

          {reportTab==="cross"&&(()=>{
            const syn = getSynthesis(selectedP.results, null);
            return (
            <div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:300,color:C.deepCharcoal,marginBottom:6}}>Pattern Summary</h2>
              <p style={{fontSize:13,color:C.midBlue,fontWeight:300,marginBottom:28}}>A synthesis of your leadership patterns across all five domains.</p>
              {[1,2,3,4,5].map(d=>(
                <div key={d} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${C.warmWhite}`,gap:16}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:500,color:C.nearBlack}}>{DOMAIN_NAMES[d]}</div>
                    <div style={{fontSize:12,color:C.midBlue,marginTop:2,fontStyle:"italic",fontWeight:300}}>{DOMAIN_TENSIONS[d]}</div>
                  </div>
                  <OrientationBadge placement={selectedP.results[d].placement}/>
                </div>
              ))}
              <div style={{marginTop:32}}>
                {[
                  {label:syn.cluster.title, text:syn.cluster.text},
                  {label:syn.leverage.title, text:syn.leverage.text, integrative:syn.integrative},
                  {label:syn.risk.title, text:syn.risk.text},
                ].map((s,i)=>(
                  <div key={i} style={{marginBottom:24,padding:"20px 22px",background:i===0?C.lightSage:"transparent",borderLeft:`2px solid ${C.slate}`}}>
                    <p style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.slate,fontWeight:600,marginBottom:10}}>{s.label}</p>
                    <p style={{fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,marginBottom:s.integrative?8:0}}>{s.text}</p>
                    {s.integrative&&<p style={{fontSize:13,lineHeight:1.75,color:C.midBlue,fontWeight:300,fontStyle:"italic"}}>{s.integrative}</p>}
                  </div>
                ))}
                <div style={{marginTop:8,padding:"18px 22px",background:C.deepCharcoal}}>
                  <p style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.midBlue,fontWeight:600,marginBottom:8}}>A question worth sitting with</p>
                  <p style={{fontFamily:"Georgia,serif",fontSize:15,lineHeight:1.7,color:C.warmWhite,fontWeight:300,fontStyle:"italic"}}>{syn.question}</p>
                </div>
              </div>
            </div>
            );
          })()}

          {reportTab==="path"&&(
            <div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:300,color:C.deepCharcoal,marginBottom:8}}>Development Path</h2>
              <p style={{fontSize:14,color:C.midBlue,lineHeight:1.7,fontWeight:300,marginBottom:28,maxWidth:520}}>How leadership identity typically evolves across the developmental continuum.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,marginBottom:32}}>
                {[{l:"Execution Mode",d:"Direct involvement in results. Identity lives in the work itself.",bg:C.warmWhite,fg:C.deepCharcoal},{l:"Orchestration Mode",d:"Oversight and defensibility. Identity lives in competence and coverage.",bg:"#dce4e0",fg:C.deepCharcoal},{l:"Navigation Mode",d:"Managing how leadership appears. Identity lives in reputation and stance.",bg:"#b8c4cc",fg:C.deepCharcoal},{l:"Integration Mode",d:"Designing conditions for others. Identity lives in the health of the whole.",bg:C.slate,fg:C.offWhite}].map((s,i)=>(
                  <div key={i} style={{background:s.bg,padding:"16px 14px"}}>
                    <div style={{fontSize:12,fontWeight:600,color:s.fg,marginBottom:6}}>{s.l}</div>
                    <div style={{fontSize:12,lineHeight:1.6,color:s.fg,opacity:0.85,fontWeight:300}}>{s.d}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,maxWidth:580}}>
                <p style={{marginBottom:14}}>Leadership development is not a single progression. Most leaders move through these orientations at different rates across different domains — and most operate from more than one orientation depending on context and pressure.</p>
                <p>The domains in this inventory represent the five places where this progression becomes most visible for senior leaders. Development in any domain is not about acquiring a new skill — it is about a shift in where leadership identity stabilizes when pressure makes the tradeoff unavoidable.</p>
              </div>
              <div style={{marginTop:28,paddingTop:20,borderTop:`1px solid ${C.warmWhite}`}}>
                <p style={{fontSize:12,color:C.midBlue,fontWeight:300}}>This inventory was developed by Jen Nguyen as part of the Enterprise Maturity Architecture framework. Results are intended for use within an active coaching relationship. · jnguyen.org</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Coach dashboard
  return (
    <div style={{fontFamily:"system-ui,sans-serif",background:C.offWhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <Nav right={<Btn variant="outline" onClick={()=>setScreen("landing")}>Sign Out</Btn>}/>
      <div style={{flex:1,display:"grid",gridTemplateColumns:"220px 1fr"}}>
        <div style={{background:C.deepCharcoal,padding:"28px 18px",display:"flex",flexDirection:"column",gap:3}}>
          <p style={{fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:C.midBlue,fontWeight:500,marginBottom:6}}>Dashboard</p>
          {[["results","All Results"],["links","Generate Links"]].map(([v,l])=>(
            <div key={v} onClick={()=>setCoachView(v)} style={{fontSize:13,color:coachView===v?C.warmWhite:"rgba(232,230,226,0.6)",padding:"8px 10px",cursor:"pointer",borderLeft:`2px solid ${coachView===v?C.slate:"transparent"}`,background:coachView===v?"rgba(255,255,255,0.04)":"transparent",fontWeight:300}}>{l}</div>
          ))}
          <p style={{fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:C.midBlue,fontWeight:500,marginTop:18,marginBottom:4}}>Account</p>
          <div style={{fontSize:11,color:"rgba(133,150,162,0.5)",padding:"5px 10px",fontWeight:300,wordBreak:"break-all"}}>jnguyen.11421@gmail.com</div>
        </div>
        <div style={{padding:"40px 48px",overflowY:"auto"}}>
          {coachView==="results"&&(
            <div>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:300,color:C.deepCharcoal,marginBottom:4}}>Results</h1>
              <p style={{fontSize:13,color:C.midBlue,fontWeight:300,marginBottom:28}}>Click any row to view the full report.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:32}}>
                {[{n:completedList.length,l:"Completed"},{n:Object.values(participants).filter(p=>!p.completed).length,l:"In Progress"},{n:Object.keys(invites).length,l:"Invites Generated"}].map((s,i)=>(
                  <div key={i} style={{background:C.lightSage,border:`1px solid ${C.warmWhite}`,padding:"22px 18px"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:36,fontWeight:300,color:C.deepCharcoal,lineHeight:1}}>{s.n}</div>
                    <div style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:C.midBlue,marginTop:5,fontWeight:500}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.midBlue,fontWeight:500,marginBottom:14}}>Completed Inventories</p>
              {completedList.length===0?(
                <p style={{fontSize:14,color:C.midBlue,fontWeight:300,padding:"28px 0"}}>No completed inventories yet.</p>
              ):(
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
                    <thead>
                      <tr>{["Participant","Completed","Contribution","Reasoning","Authority","Enterprise Health","Presence"].map(h=>(
                        <th key={h} style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.07em",textTransform:"uppercase",color:C.midBlue,fontWeight:500,padding:"9px 12px",textAlign:"left",borderBottom:`1px solid ${C.warmWhite}`,whiteSpace:"nowrap"}}>{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody>
                      {completedList.map(p=>(
                        <tr key={p.email} onClick={()=>{setSelectedP(p);setReportTab("intro");setScreen("report");}} style={{cursor:"pointer"}}>
                          <td style={{padding:"12px",borderBottom:`1px solid ${C.warmWhite}`}}>
                            <div style={{fontSize:13,fontWeight:500,color:C.nearBlack}}>{p.name}</div>
                            <div style={{fontSize:11,color:C.midBlue}}>{p.email}</div>
                          </td>
                          <td style={{padding:"12px",borderBottom:`1px solid ${C.warmWhite}`,fontSize:13,fontWeight:300,color:C.midBlue,whiteSpace:"nowrap"}}>{new Date(p.completedAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
                          {[1,2,3,4,5].map(d=>(
                            <td key={d} style={{padding:"12px",borderBottom:`1px solid ${C.warmWhite}`}}><OrientationBadge placement={p.results[d].placement}/></td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {coachView==="links"&&(
            <div>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:30,fontWeight:300,color:C.deepCharcoal,marginBottom:4}}>Generate Invite Links</h1>
              <p style={{fontSize:13,color:C.midBlue,fontWeight:300,marginBottom:28}}>Create a unique invite code for each participant.</p>
              <div style={{background:C.lightSage,border:`1px solid ${C.warmWhite}`,padding:26,marginBottom:22}}>
                <div style={{fontSize:14,fontWeight:500,color:C.deepCharcoal,marginBottom:5}}>New Participant Invite</div>
                <div style={{fontSize:13,color:C.midBlue,fontWeight:300,marginBottom:16,lineHeight:1.6}}>Generate a single-use invite code. The participant registers with this code before beginning the inventory.</div>
                <FormField label="Participant Name (optional)" value={inviteName} onChange={setInviteName} placeholder="e.g. Sarah Chen"/>
                <Btn variant="slate" onClick={async()=>{const c="LAI-"+Math.random().toString(36).slice(2,5).toUpperCase()+Math.random().toString(36).slice(2,4).toUpperCase();await sbUpsert("invites",{code:c,name:inviteName||"Unnamed",used:false,permanent:false});setInvites(prev=>({...prev,[c]:{name:inviteName||"Unnamed",used:false,permanent:false}}));setNewCode(c);setInviteName("");}}>Generate Invite Code</Btn>
                {newCode&&<div style={{marginTop:10,background:C.offWhite,border:`1px solid ${C.warmWhite}`,padding:"9px 13px",fontFamily:"monospace",fontSize:13,color:C.slate}}>Invite Code: <strong>{newCode}</strong></div>}
              </div>
              <p style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.midBlue,fontWeight:500,marginBottom:12}}>Active Invite Codes</p>
              {Object.entries(invites).map(([code,data])=>(
                <div key={code} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${C.warmWhite}`}}>
                  <div><span style={{fontFamily:"monospace",fontSize:13,color:C.deepCharcoal}}>{code}</span><span style={{fontSize:12,color:C.midBlue,marginLeft:10}}>{data.name}</span></div>
                  <span style={{fontSize:11,letterSpacing:"0.06em",color:data.used?C.slate:C.midBlue,fontWeight:data.used?500:400}}>{data.used?"USED":"ACTIVE"}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
