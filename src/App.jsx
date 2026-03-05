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
const DOMAIN_NAMES = {1:"Contribution",2:"Reasoning",3:"Authority",4:"Enterprise Health",5:"Presence"};
const DOMAIN_TENSIONS = {1:"Visibility vs contribution",2:"Being right vs transparent reasoning",3:"Control vs system trust",4:"Team loyalty vs enterprise health",5:"Reaction vs inquiry"};

const LANG = {
  1:{ name:"Contribution", tension:"Visibility vs contribution", question:"Where does your sense of value stabilize when credit or visibility shifts?",
    "1":{ pattern:"Your responses suggest that your sense of contribution is most stable when you are directly involved in the work. When visibility or credit becomes ambiguous, there is a pull toward re-engagement — not from distrust of others, but because proximity to the work is where value feels most real.", bullets:["You tend to stay close to high-stakes work even after formally handing it off","Credit ambiguity produces mild restlessness or a pull to re-establish connection to the outcome","Contribution feels most real when your involvement is visible to the people whose judgment matters"], edge:"Further development in this domain often involves separating the quality of your contribution from your proximity to the outcome. Early-stage thinking — the framing, the judgment calls, the architecture of an approach — carries value that does not require visibility to be real." },
    "2a":{ pattern:"Your responses suggest that your sense of contribution stabilizes through quality monitoring — staying close enough to delegated work to ensure standards hold. Worth is anchored in competence, and competence feels secure when you have enough visibility to catch problems before they surface.", bullets:["You maintain oversight structures even on work that has been fully delegated","Reassurance comes from knowing the work is on track, not from being credited for it","Delegation occurs, but a monitoring loop typically remains in place"], edge:"Further development in this domain often involves trusting that the quality of your upstream contribution — the frameworks, criteria, and conditions you established — carries value independent of ongoing oversight." },
    "2b":{ pattern:"Your responses suggest that your sense of contribution stabilizes through operating at the level you believe you should be leading at — delegating appropriately, staying out of work that no longer belongs to you, and contributing at the right altitude.", bullets:["You are attentive to how your involvement or absence reads to senior leadership","When credit is ambiguous, attention goes to ensuring your contribution is understood by clarifying context or framing decisions in ways that make the upstream thinking visible","Delegation is genuine, but the optics of how it lands still occupy attention"], edge:"Further development in this domain often involves anchoring worth in the durability and influence of your thinking — not in whether the right people have a clear sense of what you bring." },
    "2b+":{ pattern:"Your responses show a mixed pattern — strong contribution orientation in some moments, with identity investment still present in others.", bullets:["Identity stability varies depending on the visibility stakes of the work","You demonstrate genuine contribution orientation in lower-stakes moments","In higher-visibility situations, attention still moves toward how the contribution lands"], edge:"Further development often involves extending the contribution stability you demonstrate in lower-stakes contexts to moments where visibility is high and credit is contested." },
    "3":{ pattern:"Your responses suggest that your sense of contribution is stable when you can see that the thinking you brought to a situation is shaping how decisions get made — regardless of whether your role is visible.", bullets:["Invisibility in outcomes produces equanimity rather than restlessness","You track whether your framing is holding up over time more than whether others know you originated it","When credit goes elsewhere, attention moves to whether the work itself is being understood correctly"], edge:"Further development in this domain often involves noticing when attachment to the quality of your own thinking — rather than to visibility — becomes its own form of investment." }
  },
  2:{ name:"Reasoning", tension:"Being right vs transparent reasoning", question:"Do you protect your recommendation, or the integrity of the reasoning process?",
    "1":{ pattern:"Your responses suggest that the strength of your recommendation is a primary source of leadership value under pressure. When analysis is ambiguous or a recommendation is challenged, the pull is toward building a stronger case rather than surfacing the uncertainty.", bullets:["Ambiguous data tends to be resolved toward the preferred conclusion rather than presented as mixed","Challenges to a recommendation feel like challenges to competence, not just the idea","The instinct under pressure is to defend the position rather than examine the reasoning"], edge:"Further development in this domain often involves separating credibility from correctness. A recommendation that clearly names its own uncertainties is more trustworthy than one that conceals them." },
    "2a":{ pattern:"Your responses suggest that decision credibility is anchored in defensibility — making sure the analysis is thorough enough to withstand scrutiny and the risks documented clearly enough to protect against being wrong.", bullets:["Risk documentation and downside enumeration are consistent features of how decisions are presented","Before committing publicly, there is a mental review of whether the reasoning holds","Challenges are addressed by reinforcing the analytical structure rather than opening the question"], edge:"Further development in this domain often involves the willingness to name what your recommendation gets wrong, not just what it gets right." },
    "2b":{ pattern:"Your responses suggest that decision credibility is anchored in demonstrating analytical rigor. The analysis is genuinely structured, but organized in ways that keep the preferred conclusion viable while still presenting the analysis as balanced.", bullets:["Recommendations are framed with visible balance while still steering toward the preferred outcome","The instinct under challenge is to demonstrate that the thinking was rigorous, not to genuinely reopen the question","Criteria and frameworks are applied carefully, but tend to surface the same conclusions"], edge:"Further development in this domain often involves following the decision criteria wherever they lead — including to outcomes you would argue against if you could." },
    "2b+":{ pattern:"Your responses show a transitional pattern — genuine process transparency in some moments, with outcome protection still operating in others.", bullets:["Decision reasoning is genuinely visible in lower-stakes situations","Under higher visibility or political pressure, the pull toward protecting the preferred conclusion increases","The transition is most visible in moments where your own framework produces an outcome you don't prefer"], edge:"Further development often involves extending the process openness you demonstrate in lower-stakes situations to moments where the preferred conclusion carries real credibility stakes." },
    "3":{ pattern:"Your responses suggest that decision credibility is anchored in the integrity of the reasoning process rather than in the outcome it produces. Under pressure, you are willing to name what your recommendation gets wrong and follow your own criteria to conclusions you did not anticipate.", bullets:["You name the risks of your preferred option with the same specificity you bring to its strengths","When your analytical framework produces an unexpected result, you follow it rather than revise it","Challenges to your reasoning produce genuine curiosity rather than a defense of the position"], edge:"Further development often involves recognizing that the frameworks you bring to decisions are not neutral instruments — they surface the same kinds of considerations consistently." }
  },
  3:{ name:"Authority", tension:"Control vs system trust", question:"What happens when someone else's imperfect decision lands under your name?",
    "1":{ pattern:"Your responses suggest that accountability for delegated work is experienced as personal responsibility for the outcome. When delegated work drifts or produces friction, the pull is toward direct re-engagement.", bullets:["When delegated work shows signs of drift, the instinct is to step back in directly","Client relationships or high-visibility outcomes are difficult to fully release after formal handoff","The standard for delegated work is typically your own standard, applied through proximity"], edge:"Further development often involves separating accountability for outcomes from accountability for involvement." },
    "2a":{ pattern:"Your responses suggest that accountability for delegated work is maintained through monitoring — staying close enough to catch problems before they become visible failures.", bullets:["Delegated work typically includes checkpoints, approval loops, or regular status updates","When something surfaces unexpectedly, the response is to tighten oversight rather than examine the system design","You remain available as a backstop even when authority has formally transferred"], edge:"Further development often involves trusting the system you designed to absorb imperfect decisions without requiring your intervention." },
    "2b":{ pattern:"Your responses suggest that delegation is genuine but managed — maintaining enough visibility to step in if something begins creating avoidable friction.", bullets:["You use the language of trust and empowerment while maintaining informal oversight mechanisms","When delegated decisions produce friction, the response involves both managing the narrative and quietly correcting course","How your delegation practice appears to the organization is a consistent source of attention"], edge:"Further development often involves releasing the narrative management alongside the operational oversight." },
    "2b+":{ pattern:"Your responses show a transitional pattern — genuine authority transfer in some moments, with oversight proximity still operating in others.", bullets:["Authority transfer is genuine in stable conditions","Under reputational exposure, the pull toward oversight or narrative management increases","The seam between delegation and control is most visible in high-stakes moments"], edge:"Further development often involves extending the system trust you demonstrate in lower-stakes situations to moments where visible imperfection creates reputational exposure." },
    "3":{ pattern:"Your responses suggest that accountability is located in the design of the authority structure rather than in proximity to individual decisions. Your first question when delegated decisions produce friction is whether the authority structure is working as intended.", bullets:["Visible imperfection in delegated work is treated as system output rather than system failure","When something surfaces unexpectedly, attention goes to the architecture rather than the individual decision","You distinguish between outcomes you would have chosen differently and outcomes that signal a genuine system gap"], edge:"Further development often involves noticing when the systems you have designed have become rigid — built to prevent failure rather than to enable real authority." }
  },
  4:{ name:"Enterprise Health", tension:"Team loyalty vs enterprise health", question:"Where does your loyalty anchor when your team absorbs the cost of an enterprise decision?",
    "1":{ pattern:"Your responses suggest that leadership identity is closely tied to your team's success. When enterprise decisions disadvantage your team, the pull is toward advocacy.", bullets:["In cross-functional resource decisions, the instinct is to advocate for your team's position as the primary responsibility","When team members express frustration, the pull is toward reassurance and protection","Enterprise logic that costs your team something is experienced as a direct challenge to your leadership"], edge:"Further development often involves holding your team's interests as one legitimate input into enterprise decisions rather than as the destination." },
    "2a":{ pattern:"Your responses suggest that leadership credibility is maintained through balance — protecting your team's core interests while demonstrating you can think beyond your function.", bullets:["In resource decisions, you look for solutions that protect your team's core needs while appearing enterprise-minded","When enterprise decisions cost your team, you negotiate around implementation rather than accepting the full impact","You think through what you need in return before signaling openness"], edge:"Further development often involves letting enterprise logic drive decisions without negotiating around the edges." },
    "2b":{ pattern:"Your responses suggest that enterprise identity is important to how you lead. When enterprise decisions cost your team, significant attention goes to explaining the decision in ways that both the team and leadership can understand.", bullets:["When enterprise decisions disadvantage your team, energy goes into framing them in ways that preserve team trust","You are attentive to how your response is perceived by both your team and senior leadership","The tension between team loyalty and enterprise responsibility is managed through careful positioning rather than resolved"], edge:"Further development often involves holding the cost to your team without managing the narrative around it." },
    "2b+":{ pattern:"Your responses show a transitional pattern — genuine enterprise orientation in some moments, with team loyalty protection still operating in others.", bullets:["Enterprise thinking is genuine in lower-stakes situations","Under direct team cost, the pull toward advocacy or narrative management increases","The seam is most visible when the cost to your team is real and felt"], edge:"Further development often involves extending the enterprise orientation you demonstrate in lower-stakes situations to moments where the cost to your people is direct and visible." },
    "3":{ pattern:"Your responses suggest that enterprise health is a genuine identity anchor. When enterprise decisions disadvantage your team, you own that cost directly and hold both the rightness of the decision and the reality of its impact without collapsing one into the other.", bullets:["You make decisions that disadvantage your team and own them without hedging or repositioning","When team members express frustration, you sit with their experience rather than moving quickly to reframe","The tension between team loyalty and enterprise responsibility is held openly rather than resolved through positioning"], edge:"Further development often involves noticing when enterprise logic moves too quickly past the human cost of decisions." }
  },
  5:{ name:"Presence", tension:"Reaction vs inquiry", question:"When pressure rises, do you manage your reaction or become curious about it?",
    "1":{ pattern:"Your responses suggest that interpersonal pressure produces an unmediated pull toward resolution — defending a position, correcting a misrepresentation, or re-establishing clarity.", bullets:["Interpersonal challenges feel like direct challenges to the recommendation, decision, or relationship","When someone pushes back publicly, the pull is toward defending the position first","Emotional activation and behavioral response are closely connected"], edge:"Further development often involves creating a pause between activation and response — not to suppress the reaction, but to create enough space to choose how to engage." },
    "2a":{ pattern:"Your responses suggest that interpersonal pressure is managed through self-containment — the priority is ensuring that your internal reaction does not create visible damage.", bullets:["Under interpersonal pressure, significant energy goes toward managing how the reaction reads externally","Composure is experienced as something that requires active maintenance","The focus under pressure is on not letting the activation show rather than on what it might be revealing"], edge:"Further development often involves shifting from managing the reaction to becoming curious about it." },
    "2b":{ pattern:"Your responses suggest that interpersonal pressure is managed through social calibration. Composure is both real and deliberate — you are regulating your own reaction while also being attentive to the effect your response has on the room.", bullets:["Under pressure, you think about how your response will read — to the other person, to the room, to senior leadership","When given difficult feedback about your presence, the first move is to assess whether the feedback is accurate","The instinct is to respond well rather than to be curious about what the pressure is revealing"], edge:"Further development often involves putting the management agenda down — responding to what is actually happening rather than to how the response will land." },
    "2b+":{ pattern:"Your responses show a transitional pattern — genuine inquiry in some moments, with regulation management still operating in others.", bullets:["Emotional inquiry is genuine in lower-stakes interpersonal situations","Under direct feedback or high-visibility pressure, the management response re-engages","The seam is most visible in sustained or unresolved interpersonal tension"], edge:"Further development often involves bringing the genuine curiosity you demonstrate in lower-stakes situations to moments where the pressure involves feedback about you directly." },
    "3":{ pattern:"Your responses suggest that interpersonal pressure produces genuine curiosity rather than a management response. When activation arises, you use it as information about what the situation is actually about.", bullets:["Interpersonal pressure produces curiosity about what is underneath it rather than a move to contain or calibrate","When someone challenges your presence directly, you sit in genuine uncertainty about whether they are right","You distinguish between what you feel and how you respond — and the gap is a source of information rather than a problem"], edge:"Further development often involves noticing when composure itself creates distance — when your steadiness ends conversations before they are finished." }
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
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
  script.onload = () => buildPDF(p);
  document.head.appendChild(script);
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

  // Cover
  drawRect(0, 0, W, 297, [250, 249, 247]);
  drawRect(0, 0, W, 2, slate);
  setFont(9, 'normal', midBlue); doc.text('LEADERSHIP ARCHITECTURE INVENTORY', margin, 50);
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
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",margin:"16px 0"}}>
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
      <span style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:400,letterSpacing:"0.04em",color:C.deepCharcoal}}>Leadership Architecture Inventory</span>
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
      {/* Pull quote */}
      <div style={{borderLeft:`3px solid ${C.gold}`,paddingLeft:24,marginBottom:40}}>
        <p style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:300,color:C.deepCharcoal,lineHeight:1.4,fontStyle:"italic"}}>"Leadership becomes visible when pressure makes trade offs unavoidable."</p>
      </div>

      {/* Section 1: How Leadership Changes */}
      <div style={{marginBottom:40}}>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:C.slate,fontWeight:600,marginBottom:16}}>How Leadership Changes When Responsibility Becomes Consequential</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:15,lineHeight:1.85,color:C.nearBlack,fontWeight:300,maxWidth:580,marginBottom:14}}>It comes from the pressures that make decisions consequential — visible tradeoffs, competing loyalties, imperfect information, and responsibility that cannot be fully shared.</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:15,lineHeight:1.85,color:C.nearBlack,fontWeight:400,maxWidth:580,marginBottom:20}}>Under these conditions, leadership behavior is less about skill and more about <span style={{color:C.slate,fontWeight:500}}>where identity stabilizes.</span></p>
        <div style={{borderLeft:`2px solid ${C.slate}`,paddingLeft:24,marginBottom:20}}>
          <p style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:300,color:C.deepCharcoal,lineHeight:1.5,fontStyle:"italic"}}>"When pressure increases, most leaders do not gain new capabilities — they revert to the orientation that protects their leadership identity."</p>
        </div>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,maxWidth:580,marginBottom:12}}>Sometimes that protection is visible in behavior. Sometimes it appears as oversight, narrative framing, or analytical rigor. These responses often look like leadership competence from the outside.</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,maxWidth:580,marginBottom:24}}>None of these responses are inherently right or wrong. They represent different ways leaders stabilize responsibility when the stakes are high. Development occurs not by acquiring new skills, but by a shift in where identity anchors under pressure.</p>

        {/* Four orientations */}
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.midBlue,fontWeight:500,marginBottom:16}}>The Four Orientations</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2,marginBottom:16}}>
          {[{l:"Protect Outcome",bg:C.warmWhite,fg:C.deepCharcoal},{l:"Protect Process",bg:"#dce4e0",fg:C.deepCharcoal},{l:"Protect Identity",bg:"#b8c4cc",fg:C.deepCharcoal},{l:"Protect System",bg:C.slate,fg:C.offWhite}].map((s,i)=>(
            <div key={i} style={{background:s.bg,padding:"12px 14px",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontFamily:"system-ui,sans-serif",fontSize:11,fontWeight:600,color:s.fg,textAlign:"center"}}>{s.l}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:0}}>
          {[{label:"Protect Outcome",desc:"Leadership identity stabilizes through direct involvement in results."},{label:"Protect Process",desc:"Leadership identity stabilizes through oversight, coverage, and defensibility."},{label:"Protect Identity",desc:"Leadership identity stabilizes through how leadership stance is perceived."},{label:"Protect System",desc:"Leadership identity stabilizes through designing conditions that allow others to act."}].map((o,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:20,padding:"12px 0",borderBottom:`1px solid ${C.warmWhite}`}}>
              <div style={{fontFamily:"system-ui,sans-serif",fontSize:12,fontWeight:600,color:C.nearBlack}}>{o.label}</div>
              <div style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.7,color:C.nearBlack,fontWeight:300}}>{o.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{height:1,background:C.warmWhite,marginBottom:36}}/>

      {/* Section 2: Where Leadership Responsibility Shows Up */}
      <div style={{marginBottom:40}}>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",color:C.slate,fontWeight:600,marginBottom:16}}>Where Leadership Responsibility Shows Up</p>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,maxWidth:580,marginBottom:20}}>Leadership responsibility shows up in several distinct parts of a leader's role. The inventory examines five places where that responsibility becomes most visible.</p>

        {/* Domain table */}
        <div style={{border:`1px solid ${C.warmWhite}`,marginBottom:20}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",background:C.deepCharcoal,padding:"10px 16px"}}>
            <span style={{fontFamily:"system-ui,sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:C.warmWhite}}>DOMAIN</span>
            <span style={{fontFamily:"system-ui,sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.1em",color:C.warmWhite}}>TENSION</span>
          </div>
          {[
            {d:"Contribution",   t:"Visibility vs contribution"},
            {d:"Reasoning",      t:"Being right vs transparent reasoning"},
            {d:"Authority",      t:"Control vs system trust"},
            {d:"Enterprise Health",t:"Team loyalty vs enterprise health"},
            {d:"Presence",       t:"Reaction vs inquiry"},
          ].map(({d,t},i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr",padding:"11px 16px",borderTop:`1px solid ${C.warmWhite}`,background:i%2===0?C.offWhite:C.lightSage}}>
              <span style={{fontFamily:"system-ui,sans-serif",fontSize:13,fontWeight:600,color:C.nearBlack}}>{d}</span>
              <span style={{fontFamily:"system-ui,sans-serif",fontSize:13,fontWeight:300,color:C.nearBlack}}>{t}</span>
            </div>
          ))}
        </div>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300,maxWidth:580}}>Different leaders anchor their identity in different places when that responsibility becomes consequential.</p>
      </div>

      <div style={{height:1,background:C.warmWhite,marginBottom:28}}/>
      <div style={{background:C.lightSage,padding:"20px 24px",borderLeft:`2px solid ${C.slate}`}}>
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:14,lineHeight:1.8,color:C.nearBlack,fontWeight:300}}>The orientations described in this report are not levels of leadership capability. They describe where leadership identity tends to stabilize when responsibility becomes consequential. Most experienced leaders operate from different orientations in different domains.</p>
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
        <p style={{fontFamily:"system-ui,sans-serif",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.slate,fontWeight:500,marginBottom:6}}>Leadership Tension</p>
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
          <h1 style={{fontFamily:"Georgia,serif",fontSize:46,fontWeight:300,lineHeight:1.1,color:C.deepCharcoal,marginBottom:8}}>Leadership<br/><em style={{color:C.slate}}>Architecture</em><br/>Inventory</h1>
          <p style={{fontSize:13,color:C.midBlue,lineHeight:1.7,marginBottom:36,fontWeight:300,maxWidth:360}}>A profile of where leadership identity stabilizes when responsibility becomes consequential.</p>
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
          {[{t:"Leadership Identity Under Pressure",d:"Each domain represents a place where leadership identity is tested when responsibility becomes consequential and the right answer is not obvious."},{t:"Five Domains",d:"Contribution · Reasoning · Authority · Enterprise Health · Presence"},{t:"Developmental Architecture",d:"Results show where your leadership identity currently stabilizes — and where the next developmental shift typically occurs."}].map((b,i)=>(
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
      ["map","Architecture Map"],
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
            <p style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.slate,fontWeight:600,marginBottom:6}}>Leadership Architecture Inventory</p>
            <h1 style={{fontFamily:"Georgia,serif",fontSize:32,fontWeight:300,color:C.deepCharcoal,marginBottom:3}}>{selectedP.name}</h1>
            <p style={{fontSize:13,color:C.midBlue,fontWeight:300}}>{new Date(selectedP.completedAt).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p>
          </div>

          {reportTab==="intro"&&<IntroPage/>}

          {reportTab==="map"&&(
            <div>
              <h2 style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:300,color:C.deepCharcoal,marginBottom:8}}>Leadership Identity Under Pressure</h2>
              <p style={{fontSize:14,color:C.midBlue,lineHeight:1.7,fontWeight:300,marginBottom:8,maxWidth:520}}>The five domains represent the places where leadership responsibility becomes most visible when tradeoffs cannot be avoided.</p>
              <Wheel results={selectedP.results}/>
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
