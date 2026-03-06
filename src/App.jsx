import { useState, useEffect, useCallback } from "react";

const C = {
  warmWhite: "#e8e6e2", lightSage: "#f4f6f1", midBlue: "#8596a2",
  slate: "#4a6274", nearBlack: "#313130", deepCharcoal: "#1f2328", offWhite: "#faf9f7",
  gold: "#c8a84a", goldDark: "#a88830",
};

const ITEMS = [
  ["D1-T1-A",1,1,"vignette","A high-stakes project you championed is in its final stage. Your team is executing well and no longer needs your direct involvement. A senior leader asks for a status update and your team lead responds — thoroughly and confidently — without looping you in.","Where does your attention go first?",["To whether the team lead represented the work accurately and completely.","To a quiet pull to re-engage — there's still enough at stake that staying close feels right.","To how this looks — a leader who steps back and lets the team run is exactly what this role requires.","To whether the outcome will reflect the judgment I brought to the early decisions, regardless of who presented it."],["2a","1","2b","3"]],
  ["D1-T2-A",1,2,"vignette","You have spent months developing a direct report into a strategic role. In a senior forum, they present work that draws directly on frameworks you developed together — as their own thinking. It lands well. No one asks about your role.","Where does your attention go?",["To whether this is a pattern — if they're consistently not attributing shared thinking, that needs to be addressed.","To whether the curiosity about how the framework performed is actually a way of staying connected to work I've let go.","To something not quite comfortable but not quite uncomfortable — I notice it without knowing what to do with it.","To how I'm holding this — a leader who needs attribution from their own people isn't as far along as they think."],["2a","2b","3","2b"]],
  ["D1-T2-C",1,2,"paired",null,"Which resonates more when you reflect on how you experience your own contribution at work?",["I feel most settled when I know the people who matter have a clear sense of what I bring.","I feel most settled when I can see that the thinking I contributed is actually shaping how decisions get made."],["2b","3"]],
  ["D1-T3-A",1,3,"paired",null,"Which resonates more with how you actually experience your own leadership contribution?",["I've gotten genuinely comfortable not needing credit — I know what I bring and that's enough.","I've gotten comfortable not needing credit, but I notice I still track whether my thinking is landing even when my name isn't on it."],["3f","3e"]],
  ["D2-T1-A",2,1,"vignette","You are asked to present a recommendation to a senior leadership group. You have a clear view on the right path. As you prepare, you realize the data is more mixed than you initially thought.","Where does your attention go first?",["To strengthening the case — if I present the ambiguity too prominently, it will undermine confidence.","To making sure I've documented the risks clearly enough that I'm protected if it doesn't land.","To thinking through how to present the mixed picture in a way that demonstrates rigor rather than selectivity.","To whether the mixed data means the recommendation may not hold the way I thought it did."],["1","2a","2b","3"]],
  ["D2-T2-B",2,2,"vignette","You are presenting two options to the CEO. You have a clear preference, but the analysis shows the option you prefer carries a risk the other option avoids. The CEO asks: \"Which would you recommend and why?\"","What happens internally as you respond?",["I lead with my recommendation and make the case for why the risk shouldn't stop us.","I name the tradeoff directly — including the risk my preferred option carries — and let the recommendation stand or fall.","I present both options with equal rigor and note my preference without over-weighting it.","I double-check mentally that I've addressed the risk adequately before I commit."],["1","3","2b","2a"]],
  ["D2-T2-C",2,2,"paired",null,"Which is closer to how you experience high-stakes recommendation moments?",["I present my reasoning as clearly as I can and trust that a well-structured argument will hold up.","I find myself most settled when I've named what my recommendation gets wrong, not just what it gets right."],["2b","3"]],
  ["D2-T3-B",2,3,"paired",null,"Which is closer to how you experience moments when your recommendation doesn't land the way you expected?",["I go back and look at where the reasoning broke down or where the context shifted.","I go back and look at where the reasoning broke down — and I also notice I'm more interested in that question when the recommendation failed than when it succeeded."],["3f","3e"]],
  ["D3-T1-A",3,1,"vignette","A direct report is leading a client-facing project you handed off three weeks ago. You check in and find the approach has drifted — not dangerously, but noticeably. The client relationship matters to you personally.","Where does your attention go first?",["To getting back into the project enough to make sure it lands the way it should.","To whether I need to increase check-in frequency until I'm confident the approach is back on track.","To how I position my involvement if the client notices the drift.","To whether the drift is inside acceptable bounds or signals a gap in how I set up the handoff."],["1","2a","2b","3"]],
  ["D3-T2-A",3,2,"vignette","A VP you have developed makes a significant call on a client issue — without consulting you. The decision is defensible but not what you would have done. It produces some friction. A senior leader asks why you didn't weigh in.","Where does your attention go?",["To whether my oversight structure needs to be tightened — this should have come to me first.","To the friction itself — I want to understand what happened and make sure it doesn't happen again.","To how I answer the senior leader in a way that demonstrates I was appropriately in the loop.","To whether the friction is the system working — imperfect decisions with manageable consequences are what delegated authority looks like."],["2a","2a","2b","3"]],
  ["D3-T2-C",3,2,"paired",null,"Which is closer to how you experience situations where delegated authority produces a visible mistake on your watch?",["I focus on understanding what happened and whether my oversight structure should have caught it earlier.","I notice the pull to step in — and I'm aware that whether I act on it says something about where I actually am with this."],["2b","3"]],
  ["D3-T3-B",3,3,"paired",null,"Which is closer to how you experience situations where someone redesigns a process or structure you built?",["I engage with the redesign on its merits — if it's better, it should replace what I built.","I engage with it on the merits, but I notice I hold it to a higher standard of proof than I held my own original design."],["3f","3e"]],
  ["D4-T1-A",4,1,"vignette","A cross-functional resource decision is being made at the senior leadership level. The outcome will disadvantage your team — not catastrophically, but meaningfully. You have a seat at the table.","Where does your attention go first?",["To making the strongest possible case for my team's position — that's what I'm there to do.","To finding a solution that protects my team's core needs while demonstrating I can think beyond my function.","To how I frame my team's position in a way that sounds enterprise-minded rather than territorial.","To what the right outcome is for the organization — and whether my team's position is actually aligned with that."],["1","2a","2b","3"]],
  ["D4-T2-B",4,2,"vignette","A member of your team comes to you privately after a difficult enterprise decision. They say: \"I feel like leadership doesn't actually care about us. Does it matter to them that this is hard?\"","What happens internally first?",["I feel the pull to reassure them — I want them to feel seen even if the decision stands.","I find myself genuinely sitting with their question — because I'm not entirely sure the answer is as clean as I'd like.","I think about how to validate their experience without undermining confidence in the leadership team.","I focus on helping them see the bigger picture — that's what matters most right now."],["2a","3","2b","1"]],
  ["D4-T2-C",4,2,"paired",null,"Which is closer to how you experience moments when you've made a decision that was right for the enterprise and hard for your team?",["I feel settled — I made the right call and I trust that good decisions are the best thing I can do for my team.","I feel settled about the decision and genuinely unsettled about the cost — and I've learned not to resolve that tension too quickly."],["2b","3"]],
  ["D4-T3-C",4,3,"paired",null,"Which resonates more?",["When I make a decision that's right for the system and hard for my team, I own it clearly — I don't soften it or apologize for it.","When I make a decision that's right for the system and hard for my team, I notice I sometimes find ways to soften the edges — and I'm not always sure whether that's care or whether it's something I'm doing for myself."],["3f","3e"]],
  ["D5-T1-A",5,1,"vignette","You are in a senior leadership meeting. A peer challenges one of your recommendations directly and with visible skepticism in front of the group. You feel the tension immediately.","Where does your attention go first?",["To noticing what the exchange is revealing about how the group is reacting.","To making sure my reaction doesn't read as defensive or rattled.","To reinforcing the logic of the recommendation before the challenge gains traction.","To thinking through how to acknowledge the challenge in a way that keeps my credibility intact."],["3","2a","1","2b"]],
  ["D5-T2-A",5,2,"vignette","You are in a difficult one-on-one with a high-performing direct report. The conversation hasn't resolved after twenty minutes. You have been calm throughout. They say: \"I feel like you're not really here.\"","Where does your attention go?",["I take it in without knowing what to do with it. I don't dismiss it — but I don't know yet whether they're right.","I've been engaged, and I'm tracking that they may be interpreting my calm as distance.","I refocus. I may have been managing the conversation more than being in it. I try to shift.","I ask them what 'here' means to them — I want to understand the gap, not just respond to it."],["3","2b","2a","2b"]],
  ["D5-T2-C",5,2,"paired","A peer you have tension with publicly misrepresents your position. You feel the activation — anger, or something close to it.","Which is closer to your internal experience?",["I need to address this clearly without letting what I'm feeling drive how I do it.","I'm not sure I can address this cleanly right now — and I'm sitting with that uncertainty."],["2","3"]],
  ["D5-T3-A",5,3,"paired",null,"Which resonates more with how you actually experience yourself under sustained pressure?",["I stay grounded — I've learned that my steadiness is one of the most useful things I can offer.","I sometimes wonder whether my steadiness is creating distance I'm not aware of."],["3f","3e"]],
];

function scoreAll(responses) {
  const results = {};
  [1,2,3,4,5].forEach(d => {
    const dr = responses.filter(r => r.domain === d);
    const t2 = dr.filter(r => r.type === 2);
    const t3 = dr.filter(r => r.type === 3);
    const gate1 = t2.filter(r => r.score === "3").length >= 2;
    const gate2 = t3.filter(r => r.score === "3e").length >= 1;
    let placement;
    if (gate1 && gate2) placement = "3";
    else if (gate1) placement = "2b+";
    else {
      const s1 = dr.filter(r => r.score === "1").length;
      const s2a = dr.filter(r => r.score === "2a").length;
      const s2b = dr.filter(r => r.score === "2b" || r.score === "2").length;
      if (s1 > s2a && s1 > s2b) placement = "1";
      else if (s2a >= s2b) placement = "2a";
      else placement = "2b";
    }
    results[d] = { placement };
  });
  return results;
}

const ORIENTATION_LABELS = {"1":"Protect Outcome","2a":"Protect Process","2b":"Protect Identity","2b+":"Protect Identity","3":"Protect System"};
const ORIENTATION_ORDER = {"1":0,"2a":1,"2b":2,"2b+":2,"3":3};
const DOMAIN_NAMES = {1:"Contribution",2:"Reasoning",3:"Authority",4:"Loyalty",5:"Presence"};
const DOMAIN_TENSIONS = {1:"Visibility ↔ Impact",2:"Correctness ↔ Transparent Reasoning",3:"Direct Control ↔ System Trust",4:"Your People ↔ The Whole",5:"Reaction ↔ Curiosity"};
const DOMAIN_POLES = {
  1:{left:"Visibility",right:"Impact"},
  2:{left:"Correctness",right:"Transparent Reasoning"},
  3:{left:"Direct Control",right:"System Trust"},
  4:{left:"Your People",right:"The Whole"},
  5:{left:"Reaction",right:"Curiosity"},
};

const LANG = {
  1:{ name:"Contribution", tension:"Visibility ↔ Impact", question:"Where does your sense of value settle when credit or visibility shifts?",
    "1":{ pattern:"Your responses indicate that you may rely on direct involvement to feel confident in your contribution. When credit or visibility becomes ambiguous, there can be a pull to stay connected to the work because proximity makes your impact easier to see and trust.", bullets:["You tend to stay close to high-stakes work even after handing it off","When credit becomes unclear, you may feel a pull to reconnect to the outcome","Your contribution feels most concrete when your involvement is visible"], edge:"Further development in this domain often involves separating the value of your contribution from your proximity to the outcome. Framing direction, shaping decisions, and designing the approach carry real value even when they are not visible." },
    "2a":{ pattern:"Your responses indicate that you may rely on quality oversight to maintain confidence in delegated work. Staying close enough to monitor progress helps ensure standards hold and problems are caught early.", bullets:["You maintain oversight structures even when work has been formally delegated","Confidence comes from knowing the work is progressing well rather than from receiving credit","Delegation occurs, but some form of monitoring loop usually remains"], edge:"Further development often involves trusting that the value of your upstream contribution — the direction, frameworks, and conditions you established — continues to hold even when you are no longer closely monitoring the work." },
    "2b":{ pattern:"Your responses indicate that contribution may be tied to operating at the level you believe leadership should occur. Delegation is genuine, but attention often goes to whether your leadership contribution is understood or recognized appropriately.", bullets:["You are attentive to how your involvement or absence is interpreted by senior leadership","When credit is ambiguous, you may clarify context so upstream thinking remains visible","Delegation is real, but how it reflects on your leadership still occupies attention"], edge:"Further development often involves anchoring your sense of contribution in the durability and influence of your thinking rather than in whether others clearly recognize where it originated." },
    "2b+":{ pattern:"Your responses indicate a mixed pattern. In some situations your contribution feels stable regardless of visibility, while in others attention still shifts toward how the contribution is recognized.", bullets:["Contribution feels stable in lower-visibility situations","When visibility stakes increase, attention may shift toward recognition","This shift is most noticeable in high-profile work"], edge:"Further development often involves extending the contribution stability you demonstrate in lower-stakes situations to moments where visibility and recognition carry greater weight." },
    "3":{ pattern:"Your responses indicate that contribution feels stable when you can see that the thinking you introduced continues shaping decisions, even when your role is no longer visible.", bullets:["Lack of visibility in outcomes does not create restlessness","You pay more attention to whether your thinking continues to hold than to who receives credit","When credit goes elsewhere, attention shifts to whether the work is understood correctly"], edge:"Further development often involves noticing when attachment shifts from visibility to the quality of your own thinking. Frameworks and ideas are useful tools, but they do not need to become the measure of your value." }
  },
  2:{ name:"Reasoning", tension:"Correctness ↔ Transparent Reasoning", question:"Do you protect your recommendation, or the integrity of the reasoning process?",
    "1":{ pattern:"Your responses indicate that you may rely on the strength of your recommendation to carry credibility under pressure. When analysis becomes ambiguous or your position is challenged, the instinct may be to strengthen the case rather than surface the uncertainty.", bullets:["Mixed or ambiguous data tends to be resolved toward a preferred conclusion","Challenges to the recommendation can feel like challenges to competence","Under pressure, the instinct is to defend the position rather than reopen the reasoning"], edge:"Further development often involves separating credibility from correctness. Naming uncertainty or tradeoffs openly can strengthen trust in the decision process rather than weaken it." },
    "2a":{ pattern:"Your responses indicate that you may rely on thorough analysis and risk coverage to maintain decision credibility. Ensuring the reasoning is well supported helps protect against being wrong when stakes are high.", bullets:["Risk documentation and downside analysis are central to how decisions are presented","Before committing publicly, you mentally review whether the reasoning holds","Challenges are addressed by reinforcing the analytical structure"], edge:"Further development often involves being willing to name where your recommendation may fall short, not just where it is strong." },
    "2b":{ pattern:"Your responses indicate that decision credibility may come from demonstrating analytical rigor. The reasoning is structured and balanced, but it may still be organized in ways that keep the preferred conclusion viable.", bullets:["Recommendations are presented as balanced while still guiding toward a preferred outcome","Under challenge, the instinct is to demonstrate the rigor of the analysis","Frameworks and criteria are applied carefully but often point toward similar conclusions"], edge:"Further development often involves allowing decision criteria to lead wherever they point, even when the outcome is not the one you would choose." },
    "2b+":{ pattern:"Your responses indicate a mixed pattern. In some situations your reasoning process is fully visible, while in others the pull to protect the preferred conclusion becomes stronger.", bullets:["Reasoning tends to be open in lower-stakes decisions","Under political or reputational pressure, the instinct to defend the conclusion increases","This is most noticeable when your own framework produces an outcome you do not prefer"], edge:"Further development often involves maintaining the same openness to the reasoning process even when the credibility stakes are high." },
    "3":{ pattern:"Your responses indicate that decision credibility is grounded in the integrity of the reasoning process rather than the outcome it produces. When analysis points somewhere unexpected, you are willing to follow it.", bullets:["You name risks in your preferred option as clearly as its strengths","When analysis produces an unexpected result, you follow it rather than revise it","Challenges to your reasoning create curiosity about what others may be seeing"], edge:"Further development often involves recognizing that the frameworks you use to analyze decisions are not neutral tools. They shape which factors become visible in the analysis." }
  },
  3:{ name:"Authority", tension:"Direct Control ↔ System Trust", question:"What happens when someone else's imperfect decision lands under your name?",
    "1":{ pattern:"Your responses indicate that you may experience accountability for delegated work as personal responsibility for the outcome. When delegated work drifts or creates friction, the instinct may be to step back in directly to ensure it lands well.", bullets:["When delegated work begins to drift, the instinct is to re-engage directly","High-visibility work or client relationships can be difficult to fully release after handoff","Delegated work is often measured against the standard you would personally apply"], edge:"Further development often involves separating accountability for outcomes from involvement in every decision that affects them." },
    "2a":{ pattern:"Your responses indicate that you may rely on monitoring structures to maintain accountability for delegated work. Staying close enough to catch problems early helps ensure issues do not surface unexpectedly.", bullets:["Delegated work includes checkpoints, approvals, or structured updates","When something surfaces unexpectedly, oversight tends to increase","You remain available as a backstop even when authority has formally transferred"], edge:"Further development often involves trusting that the authority structure you designed can absorb imperfect decisions without requiring immediate intervention." },
    "2b":{ pattern:"Your responses indicate that delegation is genuine but carefully managed. Authority is transferred, while enough visibility remains to intervene if something begins creating avoidable friction.", bullets:["You encourage autonomy while maintaining informal visibility into decisions","When friction appears, you may quietly correct course while managing how the situation is interpreted","How your delegation approach reflects on your leadership remains important"], edge:"Further development often involves releasing narrative management alongside operational oversight." },
    "2b+":{ pattern:"Your responses indicate a mixed pattern. In some situations authority transfers cleanly, while in others oversight or involvement increases when reputational risk rises.", bullets:["Delegation operates smoothly in stable conditions","When stakes rise, the pull toward oversight increases","This shift is most visible when visible imperfection could reflect on your leadership"], edge:"Further development often involves extending the authority transfer you demonstrate in lower-risk situations to moments where imperfection may be visible." },
    "3":{ pattern:"Your responses indicate that accountability is grounded in the design of the authority structure rather than in proximity to individual decisions. When delegated work produces friction, the focus shifts to whether the system is functioning as intended.", bullets:["Imperfect outcomes are treated as information about the system rather than as personal failure","When issues arise, attention goes to structure rather than to individual correction","You distinguish between outcomes you would have chosen differently and outcomes that signal a real system gap"], edge:"Further development often involves noticing when systems designed to prevent failure become overly restrictive and begin reclaiming authority they were meant to distribute." }
  },
  4:{ name:"Loyalty", tension:"Your People ↔ The Whole", question:"Where does your loyalty settle when your team absorbs the cost of an enterprise decision?",
    "1":{ pattern:"Your responses indicate that your leadership instincts may be closely tied to your team's success. When enterprise decisions disadvantage your team, the instinct may be to advocate strongly on their behalf and protect them from the impact.", bullets:["In cross-functional decisions, your first instinct is to advocate for your team's position","When team members express frustration with enterprise decisions, you may move quickly to reassure or defend them","Enterprise decisions that disadvantage your team can feel like a direct challenge to your leadership"], edge:"Further development often involves holding your team's interests as an important input to enterprise decisions rather than as the primary destination." },
    "2a":{ pattern:"Your responses indicate that you may try to balance team advocacy with enterprise responsibility. When enterprise decisions affect your team, the focus often shifts toward minimizing the impact while still supporting the broader decision.", bullets:["You look for ways to protect your team's core needs while supporting enterprise priorities","When enterprise decisions affect your team, you may negotiate how the change is implemented","You often consider what resources or support would be needed before signaling full agreement"], edge:"Further development often involves allowing enterprise priorities to guide decisions even when the cost to your team cannot be softened." },
    "2b":{ pattern:"Your responses indicate that you are attentive to how enterprise decisions are interpreted by both your team and senior leadership. Significant attention may go toward explaining or framing difficult decisions so that your leadership stance is understood.", bullets:["When enterprise decisions disadvantage your team, you focus on explaining the reasoning clearly","You consider how both your team and senior leadership will interpret your response","Tension between team loyalty and enterprise responsibility is often managed through careful positioning"], edge:"Further development often involves holding the cost of difficult decisions without needing to manage how they are interpreted." },
    "2b+":{ pattern:"Your responses indicate a mixed pattern. Enterprise priorities are clear in some situations, while in others the instinct to protect your team becomes stronger when the impact is direct.", bullets:["Enterprise thinking is clear in lower-stakes situations","When the cost to your team becomes visible, the instinct to advocate or reframe increases","The tension is most noticeable when the impact on your team is immediate and personal"], edge:"Further development often involves extending the enterprise orientation you demonstrate in lower-stakes decisions to situations where the cost to your team is real and visible." },
    "3":{ pattern:"Your responses indicate that enterprise health is a primary reference point for leadership decisions. When enterprise priorities require difficult tradeoffs, you are willing to make the decision and hold the cost openly.", bullets:["You make enterprise decisions even when they disadvantage your own team","When team members express frustration, you acknowledge the impact rather than quickly reframing it","You hold the tension between team loyalty and enterprise responsibility without trying to resolve it too quickly"], edge:"Further development often involves noticing when enterprise logic moves faster than the human experience of the people affected by the decision." }
  },
  5:{ name:"Presence", tension:"Reaction ↔ Curiosity", question:"When pressure rises, do you react immediately or become curious about what the moment is revealing?",
    "1":{ pattern:"Your responses indicate that interpersonal pressure may trigger a strong instinct to resolve the situation quickly. When challenged or confronted, the immediate focus often goes to correcting the issue, defending the position, or restoring clarity.", bullets:["Interpersonal challenges can feel like direct challenges to the decision, position, or relationship","When someone pushes back publicly, the instinct may be to respond quickly or defend the position","Emotional activation and behavioral response tend to occur close together"], edge:"Further development often involves creating a small pause between activation and response so you can choose how to engage rather than reacting immediately." },
    "2a":{ pattern:"Your responses indicate that you may manage interpersonal pressure through self-control. The priority becomes ensuring that your internal reaction does not disrupt the conversation or create visible damage.", bullets:["Under pressure, significant energy goes into managing how your reaction appears","Composure may require deliberate effort","Attention often goes to keeping the reaction contained rather than exploring what it may be revealing"], edge:"Further development often involves shifting from managing the reaction to becoming curious about it and the information it may carry." },
    "2b":{ pattern:"Your responses indicate that interpersonal pressure may lead to careful social calibration. You regulate your own reaction while also paying attention to how your response will be interpreted by others.", bullets:["Under pressure, you consider how your response will be received by others in the room","When receiving difficult feedback, you may first evaluate whether it is accurate","Attention often goes to responding well rather than exploring what the pressure might reveal"], edge:"Further development often involves putting the management agenda aside and responding more directly to what is actually happening in the interaction." },
    "2b+":{ pattern:"Your responses indicate a mixed pattern. In some situations you are genuinely curious about interpersonal dynamics, while in others the instinct to manage the reaction or response becomes stronger.", bullets:["Curiosity about emotional dynamics appears in lower-stakes conversations","When feedback or pressure becomes more personal, the instinct to manage the response increases","This shift is most visible when the pressure involves feedback about you directly"], edge:"Further development often involves bringing the curiosity you demonstrate in lower-pressure situations into moments where the interpersonal stakes are higher." },
    "3":{ pattern:"Your responses indicate that interpersonal pressure often leads to curiosity rather than immediate management or reaction. Emotional activation becomes a source of information about what may actually be happening in the situation.", bullets:["Interpersonal tension leads to curiosity about what may be underneath it","When someone challenges you directly, you can remain open to the possibility that their perspective may hold information","You are able to notice the difference between what you feel and how you choose to respond"], edge:"Further development often involves noticing when steadiness and composure unintentionally create distance — for example when calmness closes conversations before others feel fully heard." }
  }
};

function getCrossInsight(results) {
  const pl = d => results[d].placement;
  const s3count = [1,2,3,4,5].filter(d => pl(d) === "3").length;
  if (s3count >= 4) return "Your results show a consistent pattern across most domains — identity tends to stabilize at the system level under pressure. The developmental edge at this level is subtle: the frameworks, systems, and composure that allow you to operate from genuine openness can themselves become sources of attachment. Further development often involves recognizing when your own structures — analytical, relational, or organizational — are shaping what you see.";
  if (pl(2) === "3" && (ORIENTATION_ORDER[pl(3)]||0) <= 1) return "Your results show strong reasoning transparency in how decisions get made, combined with a tendency to remain close to delegated authority structures. The developmental edge involves extending that same structural clarity to the authority systems you design. The tension arises when reasoning transparency coexists with authority structures that still rely on your proximity to hold.";
  if (pl(5) === "3" && (ORIENTATION_ORDER[pl(4)]||0) <= 2) return "Your results show strong inquiry under interpersonal pressure, combined with active navigation of the tension between team loyalty and enterprise health. The developmental edge involves bringing that same equanimity to enterprise-level decisions that cost your team.";
  if (pl(3) === "3" && (ORIENTATION_ORDER[pl(5)]||0) <= 1) return "Your results show strong authority transfer — you trust the systems and people you have developed to make decisions without your direct involvement. The developmental edge involves bringing the same trust you place in your organizational systems to emotionally charged conversations.";
  return "Your results show a mixed pattern across the five leadership domains. This is typical. Leadership identity rarely stabilizes in the same place across all pressures. The most useful development focus is usually the domain where the current orientation most constrains the leadership challenges you face now.";
}

// ── PDF GENERATION ──
function generatePDF(p) {
  if (!window.jspdf) {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    s.onload = () => buildPDF(p);
    document.head.appendChild(s);
  } else { buildPDF(p); }
}

function buildPDF(p) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, margin = 20, contentW = W - margin * 2;
  const slate = [74, 98, 116], deepCharcoal = [31, 35, 40], midBlue = [133, 150, 162], warmWhite = [232, 230, 226], lightSage = [244, 246, 241];

  function setFont(size, weight='normal', color=deepCharcoal) {
    doc.setFontSize(size); doc.setTextColor(...color); doc.setFont('helvetica', weight);
  }
  function drawRect(x, y, w, h, color) { doc.setFillColor(...color); doc.rect(x, y, w, h, 'F'); }
  function wrappedText(text, x, y, maxW, lineH) {
    const lines = doc.splitTextToSize(text, maxW); doc.text(lines, x, y); return y + lines.length * lineH;
  }

  // ── Draw wheel in jsPDF ──
  function drawWheel(cx, cy, doc, results) {
    const toRad = d => d * Math.PI / 180;
    const RINGS = [
      { r: 18, rIn: 7,  bg: [220,218,212] },
      { r: 32, rIn: 18, bg: [184,204,214] },
      { r: 46, rIn: 32, bg: [138,170,190] },
      { r: 58, rIn: 46, bg: [74, 110, 136] },
    ];
    const RING_IDX = {"1":0,"2a":1,"2b":2,"2b+":2,"3":3};
    const DOMAINS = [
      {id:1, name:"Contribution",      s:198, e:270},
      {id:2, name:"Reasoning",         s:270, e:342},
      {id:3, name:"Authority",         s:342, e:414},
      {id:4, name:"Enterprise\nHealth",s:414, e:486},
      {id:5, name:"Presence",          s:486, e:558},
    ];
    const GAP = 2;

    function wedge(rO, rI, startDeg, endDeg, fillColor, strokeColor) {
      const s = startDeg + GAP/2, e = endDeg - GAP/2;
      const steps = 16;
      const pts = [];
      for (let i = 0; i <= steps; i++) {
        const a = toRad(s + (e - s) * i / steps);
        pts.push([cx + rO * Math.cos(a), cy + rO * Math.sin(a)]);
      }
      for (let i = steps; i >= 0; i--) {
        const a = toRad(s + (e - s) * i / steps);
        pts.push([cx + rI * Math.cos(a), cy + rI * Math.sin(a)]);
      }
      doc.setFillColor(...fillColor);
      if (strokeColor) { doc.setDrawColor(...strokeColor); doc.setLineWidth(0.3); }
      else doc.setDrawColor(255,255,255);
      doc.setLineWidth(0.2);
      doc.moveTo(pts[0][0], pts[0][1]);
      pts.slice(1).forEach(([x,y]) => doc.lineTo(x, y));
      doc.close();
      doc.fillStroke ? doc.fillStroke() : doc.fill();
    }

    // Draw base rings (dimmed) then gold active band
    DOMAINS.forEach(({id, s, e}) => {
      const placement = results[id]?.placement || "2a";
      const activeIdx = RING_IDX[placement];
      RINGS.forEach((ring, idx) => {
        const alpha = idx === activeIdx ? 1 : 0.22;
        const col = ring.bg.map(c => Math.round(c + (255 - c) * (1 - alpha)));
        wedge(ring.r, ring.rIn, s, e, col, null);
      });
      // Gold active band
      const ar = RINGS[activeIdx];
      wedge(ar.r, ar.rIn, s, e, [200, 168, 74], [168, 136, 48]);
    });

    // Ring dividers
    doc.setDrawColor(180,176,166); doc.setLineWidth(0.2);
    RINGS.forEach(ring => {
      doc.circle(cx, cy, ring.r, 'S');
    });
    doc.circle(cx, cy, RINGS[0].rIn, 'S');

    // Slice dividers
    DOMAINS.forEach(({s}) => {
      const a = toRad(s);
      doc.line(cx + RINGS[0].rIn * Math.cos(a), cy + RINGS[0].rIn * Math.sin(a),
               cx + RINGS[3].r * Math.cos(a),   cy + RINGS[3].r * Math.sin(a));
    });

    // Center circle
    doc.setFillColor(250,249,247); doc.setDrawColor(180,176,166); doc.setLineWidth(0.3);
    doc.circle(cx, cy, RINGS[0].rIn, 'FD');

    // Domain name labels outside wheel
    DOMAINS.forEach(({id, name, s, e}) => {
      const mid = (s + e) / 2;
      const a = toRad(mid);
      const labelR = RINGS[3].r + 10;
      const lx = cx + labelR * Math.cos(a);
      const ly = cy + labelR * Math.sin(a);
      const lines = name.split('\n');
      setFont(5.5, 'bold', deepCharcoal);
      lines.forEach((line, i) => {
        const offset = (i - (lines.length - 1) / 2) * 5;
        doc.text(line, lx, ly + offset, { align: 'center', baseline: 'middle' });
      });
    });

    // Orientation ring labels
    const ringLabels = ["PROTECT\nOUTCOME","PROTECT\nPROCESS","PROTECT\nIDENTITY","PROTECT\nSYSTEM"];
    RINGS.forEach((ring, i) => {
      const midR = (ring.r + ring.rIn) / 2;
      const lines = ringLabels[i].split('\n');
      setFont(4, 'bold', [255,255,255]);
      lines.forEach((line, li) => {
        const offset = (li - (lines.length - 1) / 2) * 3.5;
        doc.text(line, cx, cy - midR + offset, { align: 'center', baseline: 'middle' });
      });
    });
  }

  // Cover
  drawRect(0, 0, W, 297, [250, 249, 247]);
  drawRect(0, 0, W, 2, slate);
  setFont(9, 'normal', midBlue); doc.text('LEADERSHIP PATTERNS PROFILE', margin, 50);
  setFont(32, 'normal', deepCharcoal); doc.text(p.name, margin, 68);
  setFont(11, 'normal', midBlue); doc.text(new Date(p.completedAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}), margin, 78);
  drawRect(margin, 90, contentW, 1, warmWhite);
  setFont(9, 'italic', [74,98,116]); doc.text('"Leadership becomes visible when pressure makes trade offs unavoidable."', margin, 102);
  drawRect(margin, 112, contentW, 58, lightSage);
  setFont(8, 'bold', slate); doc.text('DOMAIN SUMMARY', margin + 8, 124);
  let dy = 132;
  [1,2,3,4,5].forEach(d => {
    setFont(9, 'normal', deepCharcoal); doc.text(DOMAIN_NAMES[d], margin + 8, dy);
    setFont(9, 'bold', slate); doc.text(ORIENTATION_LABELS[p.results[d].placement]||p.results[d].placement, margin + contentW - 8, dy, {align:'right'});
    dy += 8;
  });
  setFont(8, 'normal', midBlue); doc.text('Jen Nguyen · Executive Coaching · jnguyen.org', margin, 280);
  drawRect(0, 290, W, 7, deepCharcoal);

  // Patterns Map page — linear continuums
  doc.addPage();
  drawRect(0, 0, W, 297, [250, 249, 247]);
  drawRect(0, 0, W, 2, slate);
  setFont(8, 'normal', midBlue); doc.text('YOUR LEADERSHIP PATTERNS MAP', margin, 14);
  setFont(18, 'normal', deepCharcoal); doc.text('Leadership Patterns Map', margin, 26);
  setFont(8, 'normal', midBlue);
  const introLines = doc.splitTextToSize('Each line reflects the tension your leadership navigates in that domain — and where you tend to default.', contentW);
  doc.text(introLines, margin, 35);

  const BAR_TOP = 48;
  const BAR_GAP = 30;
  const BAR_H = 3;
  const BAR_W = contentW;
  const POS_PCT = {"1":0,"2a":0.33,"2b":0.58,"2b+":0.58,"3":0.85};

  [1,2,3,4,5].forEach((d, i) => {
    const placement = p.results[d].placement;
    const pct = POS_PCT[placement] || 0;
    const barY = BAR_TOP + i * BAR_GAP;
    const poles = DOMAIN_POLES[d];

    // Domain label + orientation
    setFont(8, 'bold', deepCharcoal); doc.text(DOMAIN_NAMES[d], margin, barY - 5);
    setFont(7, 'normal', slate); doc.text(ORIENTATION_LABELS[placement]||placement, margin + contentW, barY - 5, {align:'right'});

    // Track
    drawRect(margin, barY, BAR_W, BAR_H, warmWhite);
    // Fill
    drawRect(margin, barY, BAR_W * pct, BAR_H, [180, 196, 210]);
    // Marker
    const markerX = margin + BAR_W * pct;
    doc.setFillColor(200, 168, 74); doc.setDrawColor(168, 136, 48); doc.setLineWidth(0.4);
    doc.circle(markerX, barY + BAR_H/2, 3, 'FD');

    // Pole labels
    setFont(6.5, 'normal', midBlue);
    doc.text(poles.left, margin, barY + BAR_H + 5);
    doc.text(poles.right, margin + contentW, barY + BAR_H + 5, {align:'right'});
  });

  drawRect(margin, BAR_TOP + 5 * BAR_GAP + 4, contentW, 0.5, warmWhite);
  let noteY = BAR_TOP + 5 * BAR_GAP + 14;
  drawRect(margin, noteY - 4, 1.5, 16, slate);
  setFont(7, 'normal', midBlue);
  const noteLines = doc.splitTextToSize('These patterns reflect where your leadership currently tends to default when responsibility becomes difficult to carry. The goal is not to evaluate capability, but to make these tendencies visible.', contentW - 8);
  doc.text(noteLines, margin + 6, noteY);

  setFont(8, 'normal', midBlue); doc.text('Jen Nguyen · Executive Coaching · jnguyen.org', margin, 280);
  drawRect(0, 290, W, 7, deepCharcoal);

  // Domain pages
  [1,2,3,4,5].forEach(d => {
    doc.addPage();
    const lang = LANG[d]; const placement = p.results[d].placement; const pl = lang[placement]||lang['2b'];
    drawRect(0, 0, W, 297, [250, 249, 247]); drawRect(0, 0, W, 20, deepCharcoal);
    setFont(13, 'normal', [232,230,226]); doc.text(lang.name, margin, 13);
    setFont(7, 'normal', midBlue); doc.text(`Leadership tension: ${lang.tension}`, margin, 18);
    drawRect(W - margin - 42, 5, 42, 10, slate);
    setFont(7, 'bold', [250,249,247]); doc.text(ORIENTATION_LABELS[placement]||placement, W - margin - 21, 11.5, {align:'center'});
    let y = 35;
    setFont(7, 'bold', slate); doc.text('YOUR CURRENT ORIENTATION', margin, y); y += 6;
    setFont(9, 'normal', deepCharcoal); y = wrappedText(pl.pattern, margin, y, contentW, 5.5) + 6;
    setFont(7, 'bold', slate); doc.text('WHAT THIS LOOKS LIKE IN PRACTICE', margin, y); y += 6;
    pl.bullets.forEach(b => { drawRect(margin, y-3, 2, 4, slate); setFont(9, 'normal', deepCharcoal); y = wrappedText(b, margin+6, y, contentW-6, 5.5) + 3; });
    y += 4; drawRect(margin, y, contentW, 0.5, warmWhite); y += 8;
    setFont(7, 'bold', slate); doc.text('DEVELOPMENTAL EDGE', margin, y); y += 6;
    drawRect(margin, y-4, 1.5, 20, slate); setFont(9, 'normal', deepCharcoal); wrappedText(pl.edge, margin+6, y, contentW-6, 5.5);
    setFont(8, 'normal', midBlue); doc.text('Jen Nguyen · Executive Coaching · jnguyen.org', margin, 280);
    drawRect(0, 290, W, 7, deepCharcoal);
  });

  // Cross-domain page
  doc.addPage();
  drawRect(0, 0, W, 297, [250, 249, 247]); drawRect(0, 0, W, 2, slate);
  setFont(8, 'normal', midBlue); doc.text('CROSS-DOMAIN INSIGHT', margin, 20);
  setFont(20, 'normal', deepCharcoal); doc.text('Pattern Summary', margin, 32);
  let y = 45;
  [1,2,3,4,5].sort((a,b)=>((ORIENTATION_ORDER[p.results[b].placement]||0)-(ORIENTATION_ORDER[p.results[a].placement]||0))).forEach(d => {
    drawRect(margin, y-4, contentW, 12, lightSage);
    setFont(9, 'bold', deepCharcoal); doc.text(LANG[d].name, margin+4, y+2);
    setFont(8, 'normal', midBlue); doc.text(LANG[d].tension, margin+4, y+7);
    drawRect(W-margin-38, y-2, 38, 9, slate);
    setFont(7, 'bold', [250,249,247]); doc.text(ORIENTATION_LABELS[p.results[d].placement]||p.results[d].placement, W-margin-19, y+4, {align:'center'});
    y += 16;
  });
  y += 6; drawRect(margin, y, 2, 30, slate);
  setFont(8, 'bold', slate); doc.text('INTEGRATIVE INSIGHT', margin+6, y+6); y += 12;
  setFont(9, 'normal', deepCharcoal); wrappedText(getCrossInsight(p.results), margin+6, y, contentW-6, 5.5);
  setFont(8, 'normal', midBlue); doc.text('Jen Nguyen · Executive Coaching · jnguyen.org', margin, 280);
  drawRect(0, 290, W, 7, deepCharcoal);

  const date = new Date(p.completedAt).toISOString().slice(0,10);
  doc.save(`LAI_${p.name.replace(/\s+/g,'_')}_${date}.pdf`);
}

// ── WHEEL ──
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
          {color:"#dedad4",border:"#c4c0ba",label:"Protect Outcome"},
          {color:"#b8ccd6",border:"#9ab4c2",label:"Protect Process"},
          {color:"#8aaabe",border:"#6a8eaa",label:"Protect Identity"},
          {color:"#4a6e88",border:"#2a5068",label:"Protect System"},
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
            {label:"Protect Outcome", desc:"Leadership stabilizes through direct involvement in results."},
            {label:"Protect Process", desc:"Leadership stabilizes through oversight, structure, and defensibility."},
            {label:"Protect Identity", desc:"Leadership stabilizes through how leadership decisions and actions are perceived."},
            {label:"Protect System",  desc:"Leadership stabilizes through designing conditions that allow others to act and decisions to hold without direct involvement."},
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
            {d:"Reasoning",    t:"Correctness ↔ Transparent Reasoning"},
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

function DomainPage({domain,placement}) {
  const lang=LANG[domain];
  const pl=lang[placement]||lang["2b"];
  return (
    <div>
      <div style={{background:C.deepCharcoal,padding:"22px 26px",marginBottom:20}}>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:300,color:C.warmWhite,marginBottom:4}}>{lang.name}</h2>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:12,color:C.midBlue,fontWeight:300}}>Leadership tension: {lang.tension}</p>
      </div>
      <p style={{fontFamily:"system-ui,sans-serif",fontSize:13,color:C.midBlue,fontStyle:"italic",fontWeight:300,marginBottom:18,lineHeight:1.7}}>When leadership responsibility becomes consequential, where do you anchor yourself as a leader?</p>
      <div style={{height:1,background:C.warmWhite,marginBottom:20}}/>
      <h3 style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.slate,fontWeight:500,marginBottom:10}}>Your Current Orientation</h3>
      <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,marginBottom:24}}>{pl.pattern}</p>
      <h3 style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.slate,fontWeight:500,marginBottom:10}}>What This Looks Like in Practice</h3>
      <div style={{marginBottom:24}}>
        {pl.bullets.map((b,i)=>(
          <div key={i} style={{display:"flex",gap:12,marginBottom:10}}>
            <div style={{width:3,background:C.slate,flexShrink:0,marginTop:4,alignSelf:"stretch"}}/>
            <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.7,color:C.nearBlack,fontWeight:300}}>{b}</p>
          </div>
        ))}
      </div>
      <div style={{height:1,background:C.warmWhite,marginBottom:18}}/>
      <h3 style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:C.slate,fontWeight:500,marginBottom:10}}>Developmental Edge</h3>
      <div style={{borderLeft:`2px solid ${C.slate}`,paddingLeft:18,marginBottom:24}}>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300}}>{pl.edge}</p>
      </div>
      <div style={{background:C.lightSage,padding:"18px 22px"}}>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.slate,fontWeight:500,marginBottom:6}}>Leadership Continuum</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,color:C.nearBlack,fontWeight:400}}>{lang.tension}</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:13,color:C.midBlue,fontWeight:300,marginTop:4,lineHeight:1.6}}>{lang.question}</p>
      </div>
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
          const demo={name:"Alex Rivera",email:"demo@example.com",completed:true,completedAt:new Date().toISOString(),results:scoreAll(ITEMS.map((item,i)=>({itemId:item[0],domain:item[1],type:item[2],selected:i%item[6].length,score:item[7][i%item[7].length]})))};
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
        p.completed?setScreen("complete"):(setQIndex(0),setResponses([]),setSelected(null),setAnimKey(k=>k+1),setScreen("assessment"));
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
    setQIndex(0);setResponses([]);setSelected(null);setAnimKey(k=>k+1);
    setScreen("assessment");
  }

  async function handleNext(){
    if(selected===null)return;
    const item=ITEMS[qIndex];
    const nr=[...responses,{itemId:item[0],domain:item[1],type:item[2],selected,score:item[7][selected]}];
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
      setQIndex(i=>i+1);setSelected(null);setAnimKey(k=>k+1);
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
            {["20 items across five leadership domains","Approximately 20–25 minutes to complete","Results reviewed with your coach before sharing","No right answers — only honest ones"].map((t,i)=>(
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

  if(screen==="assessment") return (
    <div style={{fontFamily:"system-ui,sans-serif",background:C.offWhite,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <Nav right={<span style={{fontSize:12,color:C.midBlue}}>{currentUser?.name}</span>}/>
      <div style={{height:3,background:C.warmWhite}}><div style={{height:"100%",background:C.slate,width:`${progress}%`,transition:"width 0.4s ease"}}/></div>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"44px 28px"}}>
        <div key={animKey} style={{width:"100%",maxWidth:660,animation:"fadeUp 0.3s ease"}}>
          {item[4]&&<div style={{fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,marginBottom:22,padding:"18px 22px",background:C.lightSage,borderLeft:`2px solid ${C.slate}`}}>{item[4]}</div>}
          <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:400,color:C.deepCharcoal,marginBottom:22,lineHeight:1.45}}>{item[5]}</div>
          {item[3]==="paired"&&<p style={{fontSize:13,color:C.midBlue,fontStyle:"italic",marginBottom:12,fontWeight:300}}>Which statement is closer to your experience?</p>}
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {item[6].map((opt,i)=>(
              <div key={i} onClick={()=>setSelected(i)} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"14px 16px",border:`1px solid ${selected===i?C.slate:C.warmWhite}`,cursor:"pointer",background:selected===i?C.lightSage:C.offWhite,transition:"all 0.15s"}}>
                <div style={{width:24,height:24,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,letterSpacing:"0.06em",border:`1px solid ${selected===i?C.slate:C.midBlue}`,color:selected===i?C.offWhite:C.midBlue,background:selected===i?C.slate:"transparent",transition:"all 0.15s"}}>{["A","B","C","D"][i]}</div>
                <div style={{fontSize:14,lineHeight:1.7,fontWeight:300,color:C.nearBlack,paddingTop:2}}>{opt}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:24}}>
            <span style={{fontSize:12,color:C.midBlue,letterSpacing:"0.06em"}}>{qIndex+1} of {ITEMS.length}</span>
            <Btn variant="dark" onClick={handleNext} style={{opacity:selected!==null?1:0.35,pointerEvents:selected!==null?"auto":"none"}}>{qIndex===ITEMS.length-1?"Submit":"Continue"} →</Btn>
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
                  const pct=[0,33,58,58,85][pos];
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
                  <button key={d} onClick={()=>setDomainTab(d)} style={{fontFamily:"system-ui,sans-serif",fontSize:12,padding:"7px 14px",background:domainTab===d?C.deepCharcoal:C.lightSage,color:domainTab===d?C.warmWhite:C.nearBlack,border:`1px solid ${domainTab===d?C.deepCharcoal:C.warmWhite}`,cursor:"pointer",fontWeight:400}}>{LANG[d].name}</button>
                ))}
              </div>
              <DomainPage domain={domainTab} placement={selectedP.results[domainTab].placement}/>
            </div>
          )}

          {reportTab==="cross"&&(
            <div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:300,color:C.deepCharcoal,marginBottom:6}}>Cross-Domain Insight</h2>
              <p style={{fontSize:13,color:C.midBlue,fontWeight:300,marginBottom:28}}>Pattern summary across all five domains.</p>
              {[1,2,3,4,5].sort((a,b)=>(ORIENTATION_ORDER[selectedP.results[b].placement]||0)-(ORIENTATION_ORDER[selectedP.results[a].placement]||0)).map(d=>(
                <div key={d} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 0",borderBottom:`1px solid ${C.warmWhite}`,gap:16}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:500,color:C.nearBlack}}>{LANG[d].name}</div>
                    <div style={{fontSize:12,color:C.midBlue,marginTop:2,fontStyle:"italic",fontWeight:300}}>{LANG[d].tension}</div>
                  </div>
                  <OrientationBadge placement={selectedP.results[d].placement}/>
                </div>
              ))}
              <div style={{marginTop:28,padding:"24px 22px",background:C.lightSage,borderLeft:`2px solid ${C.slate}`}}>
                <p style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.slate,fontWeight:500,marginBottom:10}}>Integrative Insight</p>
                <p style={{fontSize:14,lineHeight:1.8,color:C.nearBlack,fontWeight:300}}>{getCrossInsight(selectedP.results)}</p>
              </div>
            </div>
          )}

          {reportTab==="path"&&(
            <div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:300,color:C.deepCharcoal,marginBottom:8}}>Development Path</h2>
              <p style={{fontSize:14,color:C.midBlue,lineHeight:1.7,fontWeight:300,marginBottom:28,maxWidth:520}}>How leadership identity typically evolves across the developmental continuum.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,marginBottom:32}}>
                {[{l:"Protect Outcome",d:"Direct involvement in results. Identity lives in the work itself.",bg:C.warmWhite,fg:C.deepCharcoal},{l:"Protect Process",d:"Oversight and defensibility. Identity lives in competence and coverage.",bg:"#dce4e0",fg:C.deepCharcoal},{l:"Protect Identity",d:"Managing how leadership appears. Identity lives in reputation and stance.",bg:"#b8c4cc",fg:C.deepCharcoal},{l:"Protect System",d:"Designing conditions for others. Identity lives in the health of the whole.",bg:C.slate,fg:C.offWhite}].map((s,i)=>(
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
