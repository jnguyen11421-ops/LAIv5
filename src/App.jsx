import { useState, useEffect, useCallback } from "react";

const C = {
  warmWhite: "#e8e6e2", lightSage: "#f4f6f1", midBlue: "#8596a2",
  slate: "#4a6274", nearBlack: "#313130", deepCharcoal: "#1f2328", offWhite: "#faf9f7",
  gold: "#c8a84a", goldDark: "#a88830",
};

const ITEMS = [
  ["D1-1",1,1,"vignette","A major initiative you originally designed is now being executed by your team. In a senior meeting, a team member presents the work confidently and the discussion moves forward without reference to your role.","Where does your attention go first?",["Whether the thinking behind the work is holding up in how others are using it.","Whether the work is being represented accurately and at the standard I expect.","A pull to add context so the group understands how the thinking developed.","Whether people in the room understand the role I played in shaping the work."],["3","2a","1","2b"]],
  ["D2-1",2,1,"vignette","You are preparing a recommendation for a senior leadership decision. The analysis generally supports your preferred option, but some of the data complicates the story.","Where does your attention go first?",["Examining whether the mixed data suggests the recommendation itself should change.","Presenting the analysis in a way that demonstrates balanced and rigorous thinking.","Making sure the risks are fully documented so the reasoning is defensible.","Strengthening the case so the recommendation is clear and convincing."],["3","2b","2a","1"]],
  ["D3-1",3,1,"vignette","A capable direct report makes a decision on an important issue without consulting you. The decision works, but it is not the one you would have made.","Where does your attention go first?",["To whether the system I set up is functioning as intended.","To stepping in so the next decision aligns more closely with my judgment.","To whether I need tighter checkpoints so I stay closer to decisions like this.","To how the decision reflects on the leadership structure I've created."],["3","1","2a","2b"]],
  ["D4-1",4,1,"vignette","A senior leadership decision requires one function to absorb a meaningful budget reduction so another can expand. The analysis points to your area.","Where does your attention go first?",["Thinking about how the decision will affect my credibility with both my team and leadership.","Evaluating whether the decision serves the organization as a whole.","Making the strongest case for protecting my team.","Looking for ways to negotiate the impact on my group."],["2b","3","1","2a"]],
  ["D5-1",5,1,"vignette","A peer publicly challenges your recommendation in a leadership meeting.","Where does your attention go first?",["Becoming curious about what the challenge might be revealing about the situation.","Reinforcing the logic of my position.","Thinking about how to respond in a way that maintains credibility.","Making sure my reaction doesn't appear defensive."],["3","1","2b","2a"]],
  ["D1-2",1,2,"vignette","You step back from a high-stakes project you previously led. A few weeks later the team delivers a result that works, but it is not how you would have approached it.","What happens internally first?",["I find myself asking whether my approach would actually have produced a better result.","I want to step back in to make sure future work stays aligned with how it should be done.","I notice how the difference might reflect on my leadership of the work.","I think about whether I need clearer checkpoints or guidance going forward."],["3","1","2b","2a"]],
  ["D2-2",2,2,"vignette","You build a framework to evaluate several strategic options. When applied consistently, it produces a different conclusion than the one you initially believed was strongest.","What happens internally first?",["I acknowledge the result and follow the framework even though it wasn't the outcome I expected.","I look for factors the framework may not have captured correctly.","I want to re-examine the analysis before accepting a conclusion I don't fully trust.","I feel a pull to explain why my original recommendation still makes sense."],["3","2b","2a","1"]],
  ["D3-2",3,2,"vignette","A delegated project produces a visible mistake that reflects on your team.","What happens internally first?",["I think about how the situation will be interpreted by others.","I look at whether the system is working overall rather than focusing on a single decision.","I want to understand how the oversight structure missed this.","I want to step in quickly so the issue is corrected."],["2b","3","2a","1"]],
  ["D4-2",4,2,"vignette","A team member says privately: \"It feels like leadership doesn't understand how hard this decision is on us.\"","What happens internally first?",["I think about how to explain the broader reasoning behind the decision.","I sit with the possibility that the decision may genuinely feel unfair from their perspective.","I want to reassure them that the decision wasn't made lightly.","I focus on helping them understand why the decision was necessary."],["2b","3","2a","1"]],
  ["D5-2",5,2,"vignette","During a difficult conversation, a colleague says: \"It feels like you're not really hearing me.\"","What happens internally first?",["I concentrate on staying calm and measured in my response.","I become curious about what they are experiencing that I may not see yet.","I consider how my response will come across.","I clarify the issue so the conversation can move forward."],["2a","3","2b","1"]],
  ["D1-3",1,2,"paired",null,"Which statement resonates more?",["I feel most confident when I can see that the thinking I contributed is shaping decisions, whether or not it is attributed to me.","I feel most confident in my contribution when the people who matter know what I brought to the work."],["3","2b"]],
  ["D2-3",2,2,"paired",null,"Which statement is closer to your experience?",["The most important part of a recommendation is making the reasoning behind it fully visible.","A well-structured argument should be able to stand on its own."],["3","2b"]],
  ["D3-3",3,2,"paired",null,"Which resonates more?",["Delegation works best when people are trusted to make decisions within the structure we built.","Delegation works best when I maintain enough oversight to catch problems early."],["3","2a"]],
  ["D4-3",4,2,"paired",null,"Which statement resonates more?",["My responsibility is to make decisions that serve the organization as a whole.","My responsibility is to advocate strongly for my team."],["3","1"]],
  ["D5-3",5,2,"paired",null,"When tension rises in a conversation:",["I try to understand what the tension might be revealing about the issue or relationship.","I concentrate on managing my reaction so the situation stays constructive."],["3","2a"]],
  ["D1-4",1,3,"paired",null,"When a major outcome succeeds without your involvement being visible:",["I mostly pay attention to whether the approach we set up is continuing to work over time.","I tend to review how the work unfolded to make sure the quality held."],["3","2a"]],
  ["D2-4",2,3,"paired",null,"In high-stakes decisions:",["I focus on making sure the reasoning is transparent enough that others can see the tradeoffs clearly.","I focus on making sure the recommendation is solid and defensible."],["3","2a"]],
  ["D3-4",3,3,"paired",null,"When someone leads work you previously owned:",["I focus on whether the system I designed is enabling good decisions.","I still feel responsible for staying close enough to ensure quality."],["3","1"]],
  ["D4-4",4,3,"paired",null,"When an enterprise decision disadvantages your team:",["I focus on holding both the decision and its impact openly with the team.","I work to soften the impact wherever possible."],["3","2a"]],
  ["D5-4",5,3,"paired",null,"Under sustained pressure:",["I rely on my ability to remain composed and steady.","I pay attention to what my reactions might be signaling about the situation."],["2b","3"]],
];

function scoreAll(responses) {
  const results = {};
  [1,2,3,4,5].forEach(d => {
    const dr = responses.filter(r => r.domain === d);
    const counts = {};
    dr.forEach(r => { counts[r.score] = (counts[r.score]||0) + 1; });
    const s1   = counts["1"]  || 0;
    const s2a  = counts["2a"] || 0;
    const s2b  = (counts["2b"] || 0) + (counts["2"] || 0);
    const s3   = counts["3"]  || 0;
    const total = dr.length || 1;
    let placement;
    if (s3 / total >= 0.5)       placement = "3";
    else if (s3 >= 2 && s2b >= 1) placement = "2b+";
    else if (s2b > s2a && s2b > s1) placement = "2b";
    else if (s2a >= s1)           placement = "2a";
    else                          placement = "1";
    results[d] = { placement };
  });
  return results;
}

const ORIENTATION_LABELS = {"1":"Protect Outcome","2a":"Protect Process","2b":"Protect Identity","2b+":"Protect Identity","3":"Protect System"};
const ORIENTATION_ORDER = {"1":0,"2a":1,"2b":2,"2b+":2,"3":3};
const DOMAIN_NAMES = {1:"Contribution",2:"Reasoning",3:"Authority",4:"Loyalty",5:"Presence"};
const DOMAIN_TENSIONS = {1:"Visibility ↔ Impact",2:"Correctness ↔ Transparency",3:"Direct Control ↔ System Trust",4:"Your People ↔ The Whole",5:"Reaction ↔ Curiosity"};
const DOMAIN_POLES = {
  1:{left:"Visibility",right:"Impact"},
  2:{left:"Correctness",right:"Transparency"},
  3:{left:"Direct Control",right:"System Trust"},
  4:{left:"Your People",right:"The Whole"},
  5:{left:"Reaction",right:"Curiosity"},
};

const LANG = {
  1:{ name:"Contribution", tension:"Visibility ↔ Impact", question:"Where does your sense of value settle when credit or visibility shifts?",
    "1":{ pattern:"Your responses indicate that you may rely on direct involvement to feel confident in your contribution. When credit or visibility becomes ambiguous, there can be a pull to stay connected to the work because your sense of contribution is most stable when you are directly involved in the work and close to the outcome.", bullets:["You tend to stay close to high-stakes work even after handing it off","When credit becomes unclear, you may feel a pull to reconnect to the outcome","Your contribution feels most concrete when your involvement is visible"], edge:"Further development in this domain often involves separating the value of your contribution from your proximity to the outcome. Framing direction, shaping decisions, and designing the approach carry real value even when they are not visible." },
    "2a":{ pattern:"Your responses indicate that you may rely on quality oversight to maintain confidence in delegated work. Staying close enough to monitor progress helps ensure standards hold and problems are caught early.", bullets:["You maintain oversight structures even when work has been formally delegated","Confidence comes from knowing the work is progressing well rather than from receiving credit","Delegation occurs, but some form of monitoring loop usually remains"], edge:"Further development often involves trusting that the value of your upstream contribution — the direction, frameworks, and conditions you established — continues to hold even when you are no longer closely monitoring the work." },
    "2b":{ pattern:"Your responses indicate that contribution may be tied to operating at the level you believe your leadership role requires. Delegation is genuine, but attention often goes to whether your leadership contribution is understood or recognized appropriately.", bullets:["You are attentive to how your involvement or absence is interpreted by senior leadership","When credit is ambiguous, you may clarify context so upstream thinking remains visible","Delegation is real, but how it reflects on your leadership still occupies attention"], edge:"Further development often involves anchoring your sense of contribution in the durability and influence of your thinking rather than in whether others clearly recognize where it originated." },
    "2b+":{ pattern:"Your responses indicate a mixed pattern. In some situations your contribution feels stable regardless of visibility, while in others attention still shifts toward how the contribution is recognized.", bullets:["Contribution feels stable in lower-visibility situations","When visibility stakes increase, attention may shift toward recognition","This shift is most noticeable in high-profile work"], edge:"Further development often involves extending the contribution stability you demonstrate in lower-stakes situations to moments where visibility and recognition carry greater weight." },
    "3":{ pattern:"Your responses indicate that your sense of contribution is stable when you can see that the thinking you brought to a situation is shaping outcomes, regardless of whether your role is visible.", bullets:["Lack of visibility in outcomes does not create restlessness","You track whether the thinking you introduced is shaping decisions and outcomes over time","When credit goes elsewhere, attention shifts to whether the work is understood correctly"], edge:"Further development often involves noticing when attachment shifts from visibility to the quality of your own thinking. Frameworks and ideas are useful tools, but they do not need to become the measure of your value." }
  },
  2:{ name:"Reasoning", tension:"Correctness ↔ Transparency", question:"Do you protect your conclusion, or make your reasoning visible enough for others to engage with it?",
    "1":{ pattern:"Your responses indicate that the correctness of your recommendation becomes the primary focus under pressure. When analysis becomes ambiguous or your position is challenged, the instinct may be to strengthen the case rather than surface the uncertainty.", bullets:["Mixed or ambiguous data tends to be resolved toward a preferred conclusion","Challenges to the recommendation can feel like challenges to competence","Under pressure, the instinct is to defend the position rather than reopen the reasoning"], edge:"Further development often involves separating credibility from always being correct. Naming uncertainty or tradeoffs openly can strengthen trust in the decision process rather than weaken it." },
    "2a":{ pattern:"Your responses indicate that decision credibility is anchored in defensibility and analytical coverage. Ensuring the reasoning is well supported helps protect against being wrong when stakes are high.", bullets:["Risk documentation and downside analysis are central to how decisions are presented","Before committing publicly, you mentally review whether the reasoning holds","Challenges are addressed by reinforcing the analytical structure"], edge:"Further development often involves being willing to name where your recommendation may fall short, not just where it is strong." },
    "2b":{ pattern:"Your responses indicate that decision credibility may come from demonstrating analytical rigor. The analysis is genuinely structured, but often organized in ways that keep the preferred conclusion viable while still appearing balanced.", bullets:["Recommendations are presented as balanced while still guiding toward a preferred outcome","Under challenge, the instinct is to demonstrate the rigor of the analysis","Frameworks and criteria are applied carefully but often point toward similar conclusions"], edge:"Further development often involves allowing decision criteria to lead wherever they point, even when the outcome is not the one you would choose." },
    "2b+":{ pattern:"Your responses indicate a mixed pattern. In some situations your reasoning process is fully visible, while in others the pull to protect the preferred conclusion becomes stronger.", bullets:["Reasoning tends to be open in lower-stakes decisions","Under political or reputational pressure, the instinct to defend the conclusion increases","This is most noticeable when your own framework produces an outcome you do not prefer"], edge:"Further development often involves maintaining the same openness to the reasoning process even when the credibility stakes are high." },
    "3":{ pattern:"Your responses indicate that decision credibility is anchored in making the reasoning process transparent and followable. When analysis points somewhere unexpected, you are willing to follow it.", bullets:["You name risks in your preferred option with the same clarity you bring to its strengths","When analysis produces an unexpected result, you follow it rather than revise it","Challenges to your reasoning create curiosity about what others may be seeing"], edge:"Further development often involves recognizing that the frameworks you bring to decisions shape what becomes visible in the reasoning process." }
  },
  3:{ name:"Authority", tension:"Direct Control ↔ System Trust", question:"What happens when someone else's imperfect decision lands under your name?",
    "1":{ pattern:"Your responses indicate that you may experience accountability for delegated work as personal responsibility for the outcome, which can create a pull to step back into the decision. When delegated work drifts or creates friction, the instinct may be to step back in directly to ensure it lands well.", bullets:["When delegated work begins to drift, the instinct is to re-engage directly","High-visibility work or client relationships can be difficult to fully release after handoff","Delegated work is often measured against the standard you would personally apply"], edge:"Further development often involves separating accountability for outcomes from involvement in every decision that affects them." },
    "2a":{ pattern:"Your responses indicate that accountability for delegated work is maintained through monitoring and oversight. Staying close enough to catch problems early helps ensure issues do not surface unexpectedly.", bullets:["Delegated work includes checkpoints, approvals, or structured updates","When something surfaces unexpectedly, oversight tends to increase","You remain available as a backstop even when authority has formally transferred"], edge:"Further development often involves trusting that the authority structure you designed can absorb imperfect decisions without requiring immediate intervention." },
    "2b":{ pattern:"Your responses indicate that delegation is genuine, but attention remains on how the delegation appears and whether any resulting friction reflects on your judgment. Authority is transferred, while enough visibility remains to intervene if something begins creating avoidable friction.", bullets:["You encourage autonomy while maintaining informal visibility into decisions","When friction appears, you may quietly correct course while managing how the situation is interpreted","How your delegation approach reflects on your leadership remains important"], edge:"Further development often involves releasing narrative management alongside operational oversight." },
    "2b+":{ pattern:"Your responses indicate a mixed pattern. In some situations authority transfers cleanly, while in others oversight or involvement increases when reputational risk rises.", bullets:["Delegation operates smoothly in stable conditions","When stakes rise, the pull toward oversight increases","This shift is most visible when visible imperfection could reflect on your leadership"], edge:"Further development often involves extending the authority transfer you demonstrate in lower-risk situations to moments where imperfection may be visible." },
    "3":{ pattern:"Your responses indicate that accountability is located in the design of the authority structure rather than in direct involvement in individual decisions. When delegated work produces friction, the focus shifts to whether the system is functioning as intended.", bullets:["Visible imperfection in delegated work is treated as part of how the system operates rather than as a failure requiring immediate intervention","When issues arise, attention goes to structure rather than to individual correction","You distinguish between outcomes you would have chosen differently and outcomes that signal a real system gap"], edge:"Further development often involves noticing when the systems you have designed can become so structured that they begin limiting the judgment and authority they were meant to enable." }
  },
  4:{ name:"Loyalty", tension:"Your People ↔ The Whole", question:"Where does your loyalty anchor when the needs of your people and the needs of the whole organization diverge?",
    "1":{ pattern:"Your responses indicate that your leadership identity is closely tied to protecting the people closest to you. When enterprise decisions disadvantage your team, the instinct may be to advocate strongly on their behalf and protect them from the impact.", bullets:["When priorities conflict, the instinct is to advocate strongly for the people closest to you.","When team members express frustration with enterprise decisions, you may move quickly to reassure or defend them","Enterprise decisions that disadvantage your team can feel like a direct challenge to your leadership"], edge:"Further development often involves holding your team's interests as an important input to enterprise decisions rather than as the primary destination." },
    "2a":{ pattern:"Your responses indicate that you may try to balance protecting your people's interests while demonstrating awareness of the broader organization. When enterprise decisions affect your team, the focus often shifts toward minimizing the impact while still supporting the broader decision.", bullets:["You look for ways to protect your team's core needs while supporting enterprise priorities","When enterprise decisions affect your team, you may negotiate how the change is implemented","You often consider what resources or support would be needed before signaling full agreement"], edge:"Further development often involves allowing enterprise priorities to guide decisions even when the cost to your team cannot be softened." },
    "2b":{ pattern:"Your responses indicate that being seen as someone who can balance loyalty to your people with responsibility to the broader organization is important to how you lead. Significant attention may go toward explaining or framing difficult decisions so that your leadership stance is understood.", bullets:["When organizational decisions disadvantage your people, you focus on explaining the reasoning clearly","You consider how both your team and senior leadership will interpret your response","Tension between team loyalty and enterprise responsibility is often managed through careful positioning"], edge:"Further development often involves holding the cost of difficult decisions without needing to manage how they are interpreted." },
    "2b+":{ pattern:"Your responses indicate a mixed pattern. Enterprise priorities are clear in some situations, while in others the instinct to protect your team becomes stronger when the impact is direct.", bullets:["Enterprise thinking is clear in lower-stakes situations","When the cost to your team becomes visible, the instinct to advocate or reframe increases","The tension is most noticeable when the impact on your team is immediate and personal"], edge:"Further development often involves extending the enterprise orientation you demonstrate in lower-stakes decisions to situations where the cost to your team is real and visible." },
    "3":{ pattern:"Your responses indicate that responsibility for the health of the whole organization becomes a genuine identity anchor. When enterprise priorities require difficult tradeoffs, you are willing to make the decision and hold the cost openly.", bullets:["You sometimes make decisions that disadvantage your people or team","When team members express frustration, you acknowledge the impact rather than quickly reframing it","You hold the tension between team loyalty and enterprise responsibility without trying to resolve it too quickly"], edge:"Further development often involves noticing when enterprise logic moves faster than the human experience of the people affected by the decision." }
  },
  5:{ name:"Presence", tension:"Reaction ↔ Curiosity", question:"When pressure rises, do you react immediately or become curious about what the moment might be revealing?",
    "1":{ pattern:"Your responses indicate that interpersonal pressure produces an immediate pull to respond, resolve, or defend a position. When challenged or confronted, the immediate focus often goes to correcting the issue, defending the position, or restoring clarity.", bullets:["Interpersonal challenges can feel like direct challenges to the decision, position, or relationship","When someone pushes back publicly, the instinct may be to respond quickly or defend the position","Emotional activation and behavioral response tend to occur close together"], edge:"Further development often involves creating a small pause between activation and response so you can choose how to engage rather than reacting immediately." },
    "2a":{ pattern:"Your responses indicate that interpersonal pressure is managed through self-containment and reaction control. The priority becomes ensuring that your internal reaction does not disrupt the conversation or create visible damage.", bullets:["Under pressure, significant energy goes into managing how your reaction appears","Composure may require deliberate effort","Attention often goes to keeping the reaction contained rather than exploring what it may be revealing"], edge:"Further development often involves shifting from managing the reaction to becoming curious about it and the information it may carry." },
    "2b":{ pattern:"Your responses indicate that interpersonal pressure is managed through social calibration and careful attention to how your response will be perceived. You regulate your own reaction while also paying attention to how your response will be interpreted by others.", bullets:["Under pressure, you consider how your response will be received by others in the room","When receiving difficult feedback, you may first evaluate whether it is accurate","Attention often goes to responding well rather than exploring what the pressure might reveal"], edge:"Further development often involves putting the management agenda aside and responding more directly to what is actually happening in the interaction." },
    "2b+":{ pattern:"Your responses indicate a mixed pattern. In some situations you are genuinely curious about interpersonal dynamics, while in others the instinct to manage the reaction or response becomes stronger.", bullets:["Curiosity about emotional dynamics appears in lower-stakes conversations","When feedback or pressure becomes more personal, the instinct to manage the response increases","This shift is most visible when the pressure involves feedback about you directly"], edge:"Further development often involves bringing the curiosity you demonstrate in lower-pressure situations into moments where the interpersonal stakes are higher." },
    "3":{ pattern:"Your responses indicate that interpersonal pressure often produces curiosity about what the moment might be revealing rather than a need to manage the reaction. Emotional activation becomes a source of information about what may actually be happening in the situation.", bullets:["Interpersonal tension leads to curiosity about what may be underneath it","When someone challenges you directly, you can remain open to the possibility that their perspective may hold information","You are able to notice the difference between what you feel and how you choose to respond"], edge:"Further development often involves noticing when steadiness or composure unintentionally creates distance from others in the moment." }
  }
};


// ── SYNTHESIS (rule-based) ──
function getSynthesis(results) {
  const pl = d => results[d].placement;
  const ord = d => ORIENTATION_ORDER[pl(d)] || 0;
  const high = [1,2,3,4,5].filter(d => ord(d) >= 2);
  const low  = [1,2,3,4,5].filter(d => ord(d) <= 1);

  // Cluster analysis
  const allHigh = high.length >= 4;
  const allLow  = low.length >= 4;
  const mixed   = high.length >= 2 && low.length >= 2;

  let cluster = "";
  if (allHigh) {
    cluster = "Your results show a consistent pattern across most domains. In high-pressure leadership moments, your identity tends to stabilize around system-level thinking — attending to structures, processes, and broader organizational health rather than outcomes or personal visibility. This is a relatively integrated leadership profile.";
  } else if (allLow) {
    cluster = "Your results show a consistent pattern of staying closely connected to outcomes and execution across most domains. In high-pressure moments, your leadership identity tends to anchor in direct involvement — ensuring results land as intended, maintaining proximity to decisions, and retaining close oversight.";
  } else if (mixed) {
    const highNames = high.map(d => DOMAIN_NAMES[d]).join(", ");
    const lowNames  = low.map(d => DOMAIN_NAMES[d]).join(", ");
    cluster = `Your results show different orientations across domains. You tend to operate from a system or identity orientation in ${highNames}, while defaulting to outcome or process proximity in ${lowNames}. This kind of mixed profile is typical — leadership identity rarely stabilizes in the same place across all pressures.`;
  } else {
    cluster = "Your results show a moderately consistent pattern with some variation across domains. This reflects how most leaders operate — similar orientations in some areas, different ones in others depending on where pressure activates different defaults.";
  }

  // Tension analysis
  let tension = "";
  const d1ord = ord(1), d3ord = ord(3);
  const d2ord = ord(2), d5ord = ord(5);
  const d4ord = ord(4);

  if (d3ord <= 1 && d2ord >= 2) {
    tension = "One notable tension in your profile: you tend toward transparency in how you reason through decisions (Reasoning), but remain closely connected to delegated authority structures (Authority). These two patterns can pull in opposite directions — transparent reasoning invites others into the decision process, while proximity to authority can narrow who actually shapes decisions.";
  } else if (d5ord >= 2 && d4ord <= 1) {
    tension = "One notable tension in your profile: you tend toward curiosity and openness in interpersonal pressure (Presence), but remain closely protective of your team's interests when organizational tradeoffs arise (Loyalty). Leaders in this position sometimes find it easier to stay open in one-on-one conversations than in decisions that require placing organizational priorities above their people.";
  } else if (d1ord <= 1 && d3ord >= 2) {
    tension = "One pattern worth noting: you tend to stay closely connected to outcomes in Contribution — wanting your work to land with your involvement visible — while distributing authority more readily in Authority. As responsibility grows, these two patterns often need to move together. Leaders who trust their systems to carry decisions sometimes find it harder to trust those same systems to carry their contribution.";
  } else if (d2ord <= 1 && d5ord >= 2) {
    tension = "One pattern worth noting: you tend to stay curious and open under interpersonal pressure (Presence), but move toward certainty and advocacy when reasoning through decisions (Reasoning). This kind of split sometimes reflects a leader who is more comfortable with relational ambiguity than analytical ambiguity.";
  } else {
    tension = "Your profile does not show a sharp tension between specific domains. The most useful development focus is usually the domain where your current orientation most constrains the leadership challenges you face now — not necessarily the one where the gap is largest.";
  }

  // Development direction
  let development = "";
  const lowestDomain = [1,2,3,4,5].reduce((a, b) => ord(a) <= ord(b) ? a : b);
  const lowestName = DOMAIN_NAMES[lowestDomain];
  const lowestOrientation = ORIENTATION_LABELS[pl(lowestDomain)];

  if (allHigh) {
    development = "At this level of integration, the developmental edge is often subtle. The frameworks, systems, and composure that allow you to operate with openness can themselves become sources of attachment. Growth often involves noticing when your own structures — analytical, relational, or organizational — shape what you are able to see.";
  } else {
    development = `The domain most likely to be worth examining closely is ${lowestName}, where your results sit at ${lowestOrientation}. This is where a shift in orientation may have the most direct effect on how you operate at scale. That said, development is most useful when it connects to a real leadership challenge you are currently navigating — not simply the domain where the score is lowest.`;
  }

  return { cluster, tension, development };
}

// ── HTML PDF GENERATION ──
function generatePDF(p) {
  const syn = getSynthesis(p.results);
  const date = new Date(p.completedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  function orientBadge(placement) {
    return `<span class="orient-badge">${ORIENTATION_LABELS[placement] || placement}</span>`;
  }

  function continuumBar(domain, placement) {
    const poles = DOMAIN_POLES[domain];
    const pct = { "1": 0, "2a": 33, "2b": 58, "2b+": 58, "3": 85 }[placement] || 0;
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
    const pct = { "1": 0, "2a": 33, "2b": 58, "2b+": 58, "3": 85 }[placement] || 0;

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
        <h3 class="section-label">Your Orientation: ${isTransitional ? "Protect Identity (Emerging System Orientation)" : ORIENTATION_LABELS[placement]}</h3>
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
<title>Leadership Patterns Profile — ${p.name}</title>
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
      <p>The four orientations — Protect Outcome, Protect Process, Protect Identity, and Protect System — reflect different ways leaders anchor their leadership identity under pressure. Each orientation has genuine strengths. Each also has a developmental edge.</p>
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
        <div class="legend-label">Protect Outcome</div>
        <div class="legend-sub">Direct connection to results</div>
      </div>
      <div class="legend-item">
        <div class="legend-label">Protect Process</div>
        <div class="legend-sub">Visibility into how work unfolds</div>
      </div>
      <div class="legend-item">
        <div class="legend-label">Protect Identity</div>
        <div class="legend-sub">How leadership is understood</div>
      </div>
      <div class="legend-item">
        <div class="legend-label">Protect System</div>
        <div class="legend-sub">Architecture and structure</div>
      </div>
    </div>
    ${[1,2,3,4,5].map(d => {
      const placement = p.results[d].placement;
      const pct = { "1": 0, "2a": 33, "2b": 58, "2b+": 58, "3": 85 }[placement] || 0;
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
        <p class="synthesis-section-label">Where Your Patterns Cluster</p>
        <p class="synthesis-body">${syn.cluster}</p>
      </div>

      <div class="synthesis-section">
        <p class="synthesis-section-label">Where Tensions Appear</p>
        <p class="synthesis-body">${syn.tension}</p>
      </div>

      <div class="synthesis-section">
        <p class="synthesis-section-label">What Development May Look Like</p>
        <p class="synthesis-body">${syn.development}</p>
      </div>
    </div>
    <div class="synthesis-footer">Jen Nguyen · Executive Coaching · jnguyen.org</div>
  </div>

</div>

<div class="page-footer">Jen Nguyen · Executive Coaching · jnguyen.org</div>

<script>window.print();</script>
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

const DOMAIN_CONTENT = {
  1: {
    description: `Contribution examines how leaders experience their value as their role shifts from doing work directly to shaping outcomes through others.\n\nEarly in a career, contribution is often visible. Leaders are closely involved in solving problems, making decisions, and producing results themselves. As responsibility grows, influence becomes less direct. Leaders shape outcomes through framing problems, designing approaches, and developing people who carry the work forward.\n\nBecause of this shift, many leaders encounter a tension between visibility and impact. Contribution may still be experienced through direct involvement in the work, or through the influence of thinking that shapes outcomes even when the leader is not visibly connected to the result.\n\nWhen visibility and contribution begin to separate, leaders tend to lean toward one of four orientations.`,
    orientations: [
      {label:"Protect Outcome", desc:"Staying closely connected to results."},
      {label:"Protect Process", desc:"Maintaining visibility into how work unfolds."},
      {label:"Protect Identity", desc:"Managing how leadership influence is understood."},
      {label:"Protect System", desc:"Focusing on whether the structures shaping the work are functioning."},
    ],
    orientationsNote: "These orientations are not right or wrong. They reflect where leadership attention tends to go when contribution becomes less visible.",
    scenarios: {
      intro: "Two types of leadership situations often make this domain visible.",
      s1: {
        title: "Scenario 1",
        text: "A project you originally led is now being run by someone on your team. During a senior meeting, they present the work confidently and the discussion moves forward without reference to your role.",
        responses: [
          {label:"Protect Outcome", text:'"I should step back in. The stakes are high and I want to make sure this lands the way it should."'},
          {label:"Protect Process", text:'"I want to check how the work is unfolding so I know the standards are holding."'},
          {label:"Protect Identity", text:'"I want to make sure people understand the context behind how this work developed."'},
          {label:"Protect System", text:'"I\'m interested in whether the thinking we established is still shaping the decisions."'},
        ],
      },
      s2: {
        title: "Scenario 2",
        text: "A delegated initiative begins to drift from how you would have approached it, even though nothing has gone seriously wrong yet.",
        responses: [
          {label:"Protect Outcome", text:'"I should step back in. The stakes are high and I want to make sure this lands the way it should."'},
          {label:"Protect Process", text:'"I want to check how the work is unfolding so I know the standards are holding."'},
          {label:"Protect Identity", text:'"I want to make sure people understand the context behind how this work developed."'},
          {label:"Protect System", text:'"I\'m interested in whether the thinking we established is still shaping the decisions."'},
        ],
      },
      closing: "Each response reflects a different way leaders experience their contribution when visibility shifts.",
    },
    moment: {
      text: "For Contribution, that moment often occurs when work succeeds without your involvement being visible.\n\nWhen this happens, notice the first internal pull — whether it is to reconnect with the work, check how it unfolded, clarify context, or simply observe the outcome.\n\nExperiment with letting the moment remain unresolved for a little longer than usual.\n\nInstead of moving quickly to reconnect with the work, ask yourself:",
      question: "What influence might already be operating here without my involvement?",
      closing: "Leaders often discover that this moment reveals how they currently experience their contribution — and how it might expand.",
    },
    crossDomain: "Patterns in Contribution often interact with patterns in Authority and Reasoning.\n\nLeaders who experience contribution through proximity to work sometimes also remain closely connected to delegated authority structures. This can produce organizations where execution is reliable but where decision authority spreads more slowly.\n\nAs leaders begin to experience contribution through broader influence rather than proximity, authority and decision-making often distribute more naturally across the system.",
  },
  2: {
    description: `Reasoning examines how leaders approach decision-making when the stakes are high and outcomes are uncertain.\n\nIn leadership roles, decisions are rarely made with complete information. Leaders must interpret ambiguous data, weigh competing perspectives, and move forward even when multiple paths remain plausible.\n\nBecause of this, many leaders experience a tension between correctness and transparency.\n\nSome leaders focus primarily on reaching the right conclusion and making the strongest case for it. Others focus more on making the reasoning process visible — showing how conclusions were reached and where uncertainties remain.\n\nThis domain explores how leaders navigate that tension when making and explaining decisions.`,
    orientations: [
      {label:"Protect Outcome", desc:"Prioritizing the strength of the conclusion and advocating for the recommended path."},
      {label:"Protect Process", desc:"Ensuring the analysis is thorough and defensible before committing to a decision."},
      {label:"Protect Identity", desc:"Demonstrating analytical rigor and presenting reasoning in a way that reflects strong leadership judgment."},
      {label:"Protect System", desc:"Making the reasoning process transparent and following the logic wherever it leads, even when it challenges the preferred conclusion."},
    ],
    orientationsNote: null,
    scenarios: {
      intro: "Two types of leadership situations often make this domain visible.",
      s1: {
        title: "Scenario 1",
        text: "You are presenting a recommendation to senior leadership. As you review the data, you realize the evidence supporting your preferred option is less clear than you initially thought.",
        responses: [
          {label:"Protect Outcome", text:'"I should strengthen the case for the recommendation so the group has confidence in the direction."'},
          {label:"Protect Process", text:'"I want to make sure the analysis is thorough enough that the reasoning holds up under scrutiny."'},
          {label:"Protect Identity", text:'"I need to present the reasoning in a way that shows the analysis is balanced and well considered."'},
          {label:"Protect System", text:'"I\'m curious about what the mixed data might be telling us about the decision itself."'},
        ],
      },
      s2: {
        title: "Scenario 2",
        text: "A colleague challenges your recommendation during a leadership discussion.",
        responses: [
          {label:"Protect Outcome", text:"The instinct is to reinforce the logic supporting the recommendation."},
          {label:"Protect Process", text:"Attention moves to ensuring the reasoning remains well supported."},
          {label:"Protect Identity", text:"The focus shifts to demonstrating that the thinking behind the decision is rigorous."},
          {label:"Protect System", text:"The challenge becomes an opportunity to explore whether the reasoning should evolve."},
        ],
      },
      closing: null,
    },
    moment: {
      text: "In this domain, leadership patterns often become visible when a recommendation is challenged publicly.\n\nWhen this happens, notice the first internal pull — whether it is to reinforce the conclusion, protect the analysis, demonstrate the rigor of the reasoning, or explore what the challenge might reveal.\n\nExperiment with allowing the reasoning conversation to remain open slightly longer than usual.\n\nYou might ask yourself:",
      question: "What might we learn if we stay curious about the reasoning here before deciding?",
      closing: null,
    },
    crossDomain: "Patterns in Reasoning often interact with patterns in Presence.\n\nLeaders who bring transparency to decision reasoning often rely on emotional steadiness when their thinking is challenged. Similarly, leaders who remain curious under interpersonal pressure often find it easier to keep reasoning conversations open.\n\nAs leaders develop greater comfort with transparent reasoning, decision discussions often shift from defending conclusions to exploring understanding together.",
  },
  3: {
    description: `Authority examines how leaders experience responsibility for decisions made by others.\n\nAs leadership roles expand, decisions increasingly move through teams, functions, and systems rather than through the leader directly. Work is delegated, authority is distributed, and others begin making decisions that still carry the leader's name and responsibility.\n\nBecause of this shift, many leaders encounter a tension between control and system trust.\n\nSome leaders remain closely connected to decisions in order to ensure outcomes meet their expectations. Others focus more on designing systems that allow others to make decisions effectively without the leader's involvement.\n\nThis domain explores how leaders respond when someone else's decision produces results that still reflect on them.`,
    orientations: [
      {label:"Protect Outcome", desc:"Stepping back into decisions to ensure the outcome meets expectations."},
      {label:"Protect Process", desc:"Maintaining oversight structures that allow the leader to monitor how decisions are unfolding."},
      {label:"Protect Identity", desc:"Delegating authority while remaining attentive to how delegation and oversight appear to others."},
      {label:"Protect System", desc:"Focusing on whether the structures guiding decisions are functioning, even when outcomes are imperfect."},
    ],
    orientationsNote: null,
    scenarios: {
      intro: "Two types of leadership situations often make this domain visible.",
      s1: {
        title: "Scenario 1",
        text: "A decision made by someone on your team produces friction with another group. The decision is reasonable, but it is not the choice you would have made.",
        responses: [
          {label:"Protect Outcome", text:'"I should step in to correct the direction before the situation escalates."'},
          {label:"Protect Process", text:'"I want to review how this decision was made so I can ensure better oversight next time."'},
          {label:"Protect Identity", text:'"I need to address the situation while making sure the delegation structure still looks strong."'},
          {label:"Protect System", text:'"I\'m curious whether this friction is part of how the system learns and improves."'},
        ],
      },
      s2: {
        title: "Scenario 2",
        text: "A senior leader asks why a decision from your team happened without your involvement.",
        responses: [
          {label:"Protect Outcome", text:"Attention moves toward stepping more directly into similar decisions."},
          {label:"Protect Process", text:"The focus turns toward tightening oversight or review structures."},
          {label:"Protect Identity", text:"The response emphasizes that delegation is intentional and managed."},
          {label:"Protect System", text:"The conversation explores whether the decision authority was appropriately distributed."},
        ],
      },
      closing: null,
    },
    moment: {
      text: "In this domain, leadership patterns often become visible when someone else makes a decision that reflects on you.\n\nWhen this happens, notice the first internal pull — whether it is to step in, adjust oversight, manage how the situation appears, or examine whether the authority system is functioning.\n\nExperiment with pausing before responding and asking:",
      question: "What might this moment reveal about how authority is currently operating across the system?",
      closing: null,
    },
    crossDomain: "Patterns in Authority often interact with patterns in Contribution.\n\nLeaders who experience contribution through direct involvement sometimes remain closely connected to decisions across their teams. As leaders become more comfortable experiencing contribution through influence rather than visibility, authority often spreads more naturally.\n\nOver time, development across these domains often shifts leadership from personally carrying decisions to designing systems where decisions can happen throughout the organization.",
  },
  4: {
    description: `Loyalty examines how leaders navigate responsibility when the interests of their team and the interests of the broader organization diverge.\n\nLeadership roles naturally create strong connections with the people a leader works most closely with. Leaders often feel responsible for protecting their team's resources, opportunities, and success. At the same time, senior leadership requires making decisions that serve the organization as a whole.\n\nBecause of this, many leaders encounter a tension between loyalty to their people and responsibility for the whole system.\n\nSome leaders naturally prioritize protecting their team when difficult tradeoffs arise. Others place greater emphasis on decisions that strengthen the organization overall, even when those decisions create difficulty for their own team.\n\nThis domain explores how leaders experience responsibility when the cost of a decision is absorbed by the people closest to them.`,
    orientations: [
      {label:"Protect Outcome", desc:"Advocating strongly for the interests of one's own team or people."},
      {label:"Protect Process", desc:"Seeking solutions that protect core team needs while maintaining alignment with broader organizational goals."},
      {label:"Protect Identity", desc:"Balancing team loyalty and organizational responsibility while managing how that balance is perceived."},
      {label:"Protect System", desc:"Prioritizing decisions that strengthen the organization as a whole while remaining present to the impact on one's team."},
    ],
    orientationsNote: null,
    scenarios: {
      intro: "Two types of leadership situations often make this domain visible.",
      s1: {
        title: "Scenario 1",
        text: "A cross-functional decision requires shifting resources away from your team so another part of the organization can expand.",
        responses: [
          {label:"Protect Outcome", text:'"My responsibility is to advocate strongly for my team\'s needs."'},
          {label:"Protect Process", text:'"I want to find a way to support the broader decision while protecting the core work my team depends on."'},
          {label:"Protect Identity", text:'"I need to support the organizational direction while maintaining trust with my team."'},
          {label:"Protect System", text:'"I\'m interested in whether this decision truly strengthens the organization overall."'},
        ],
      },
      s2: {
        title: "Scenario 2",
        text: "A member of your team expresses frustration after a decision that negatively affects them.",
        responses: [
          {label:"Protect Outcome", text:"The instinct is to reassure them and protect the team from the impact."},
          {label:"Protect Process", text:"The focus moves toward finding ways to soften the implementation of the decision."},
          {label:"Protect Identity", text:"Attention goes to acknowledging their experience while maintaining alignment with leadership."},
          {label:"Protect System", text:"The conversation remains open to both the decision's purpose and the real impact on the team."},
        ],
      },
      closing: null,
    },
    moment: {
      text: "In this domain, leadership patterns often become visible when a decision that benefits the organization creates difficulty for your team.\n\nWhen this happens, notice the first internal pull — whether it is to protect your people, negotiate adjustments, manage how the decision is understood, or step fully into the system perspective.\n\nExperiment with remaining present to both sides of the tension.\n\nYou might ask yourself:",
      question: "What does this decision ask of me as a leader responsible for both my people and the whole system?",
      closing: null,
    },
    crossDomain: "Patterns in Loyalty often interact with patterns in Presence.\n\nLeaders who remain steady and curious during emotionally charged conversations often find it easier to hold the tension between team loyalty and organizational responsibility.\n\nAs leaders develop greater comfort with this tension, leadership influence often shifts from resolving competing loyalties to helping others understand how both perspectives can coexist within a healthy system.",
  },
  5: {
    description: `Presence examines how leaders respond internally and interpersonally when pressure rises.\n\nLeadership roles regularly involve moments of challenge, disagreement, and emotional intensity. Decisions may be questioned, feedback may be direct, and conversations may become tense or unresolved.\n\nIn these moments, leaders often experience a tension between reacting to the pressure and becoming curious about it.\n\nSome leaders focus on addressing the situation quickly — defending a position, correcting misunderstandings, or restoring clarity. Others focus more on understanding what the moment may be revealing about the conversation, the relationship, or the broader dynamic.\n\nThis domain explores how leaders respond when interpersonal pressure becomes visible in real time.`,
    orientations: [
      {label:"Protect Outcome", desc:"Addressing the situation quickly in order to restore clarity or direction."},
      {label:"Protect Process", desc:"Managing one's response carefully to prevent escalation or visible conflict."},
      {label:"Protect Identity", desc:"Maintaining composure while being attentive to how one's response is perceived."},
      {label:"Protect System", desc:"Becoming curious about what the moment might reveal about the interaction or the broader dynamic."},
    ],
    orientationsNote: null,
    scenarios: {
      intro: "Two types of leadership situations often make this domain visible.",
      s1: {
        title: "Scenario 1",
        text: "During a leadership meeting, a colleague challenges your recommendation directly and with visible skepticism.",
        responses: [
          {label:"Protect Outcome", text:'"I need to clarify the reasoning behind the recommendation before the challenge gains momentum."'},
          {label:"Protect Process", text:'"I want to stay calm and make sure my reaction doesn\'t escalate the situation."'},
          {label:"Protect Identity", text:'"I need to respond in a way that maintains credibility with the group."'},
          {label:"Protect System", text:'"I\'m curious what this reaction might reveal about how the idea is being received."'},
        ],
      },
      s2: {
        title: "Scenario 2",
        text: "In a difficult conversation with a direct report, they tell you they feel you are not really present in the discussion.",
        responses: [
          {label:"Protect Outcome", text:"The instinct is to clarify what you meant or address the misunderstanding."},
          {label:"Protect Process", text:"Attention moves toward managing your response carefully so the conversation stays constructive."},
          {label:"Protect Identity", text:"You consider how your presence in the conversation might be interpreted."},
          {label:"Protect System", text:"You become curious about what the feedback might reveal about the dynamic between you."},
        ],
      },
      closing: null,
    },
    moment: {
      text: "In this domain, leadership patterns often become visible when someone challenges your thinking or questions your presence in a conversation.\n\nWhen this happens, notice the first internal pull — whether it is to respond quickly, manage the interaction, maintain credibility, or explore what the moment might reveal.\n\nExperiment with remaining curious about the interaction before moving to resolution.\n\nYou might ask yourself:",
      question: "What might this moment reveal about the conversation or relationship if I stay curious a little longer?",
      closing: null,
    },
    crossDomain: "Patterns in Presence often interact with patterns in Reasoning.\n\nLeaders who remain curious during interpersonal pressure often find it easier to keep decision conversations open and exploratory. Similarly, leaders who make their reasoning transparent often support more thoughtful dialogue during disagreement.\n\nOver time, development across these domains often shifts leadership from defending positions to exploring understanding together.",
  },
};

const ORIENTATION_CONTENT = {
  1: {
    "1": {
      intro: "Your responses suggest that your patterns in this domain most often show up around Protect Outcome.\n\nLeaders with this orientation tend to stay closely connected to the work itself. Contribution is experienced through direct involvement in ensuring that outcomes land the way they should.\n\nThis often reflects a strong sense of responsibility for results. When the stakes are high, the instinct is to re-engage with the work to ensure quality and prevent issues before they appear.",
      bullets: ["stay closely connected to high-stakes work even after responsibility has been delegated","step back into projects when they sense the work may drift from their standards","feel most confident in their contribution when they are actively shaping the result","see their leadership responsibility as ensuring the outcome succeeds"],
      bulletsNote: "These leaders often bring drive, ownership, and high accountability to complex initiatives.",
      possible: "Protect Outcome can be a powerful leadership orientation.\n\nLeaders who operate this way often take strong ownership of results, bring focus and urgency to critical work, and ensure important initiatives maintain momentum.\n\nTeams often experience these leaders as committed, engaged, and accountable for outcomes.",
      shift: "As responsibility expands, the developmental move in this domain often involves allowing contribution to operate through influence rather than proximity.\n\nThis can include experimenting with allowing work to proceed without stepping back in when approaches differ from your own, recognizing that outcomes can succeed even when the path differs from your original plan, and noticing where your thinking is shaping the work even when you are not directly involved.\n\nIn this shift, contribution becomes less visible but often more scalable.",
      reflection: {
        intro: "You may find it useful to reflect on a recent leadership moment where your contribution was less visible.",
        questions: ["Recall a situation where someone else led work you previously owned. What happened internally when you stepped back from the result?","Think of a moment when delegated work unfolded differently than you expected. What influenced your response?","As you notice your pattern in this domain, what new leadership moves might you want to experiment with when visibility and contribution begin to separate?"],
      },
    },
    "2a": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Process.\n\nLeaders with this orientation often experience their contribution through maintaining visibility into how work unfolds. Staying connected to the process helps ensure standards hold and that the intent behind the work continues to carry through execution.\n\nDelegation typically occurs, but contribution is still experienced through remaining close enough to the work to understand how it is progressing.",
      bullets: ["maintain checkpoints or review loops after work has been delegated","stay informed about how work is unfolding so issues can be addressed early","feel reassured when they understand how a project is progressing","see part of their leadership role as ensuring consistency and quality across work streams"],
      bulletsNote: "Teams often experience these leaders as reliable, attentive, and committed to maintaining strong standards.",
      possible: "Protect Process often creates strong operational leadership.\n\nLeaders operating this way frequently maintain consistent quality across complex initiatives, identify issues before they become visible problems, support teams by ensuring important details are not overlooked, and create dependable execution environments.\n\nOrganizations often rely on leaders with this orientation to ensure work unfolds reliably and predictably.",
      shift: "As leadership scope grows, contribution increasingly happens through influence rather than oversight.\n\nThe next shift in this domain often involves experimenting with allowing work to proceed without needing to stay closely informed about each step, noticing how your earlier framing or design continues shaping decisions without your presence, and allowing successful outcomes to stand without reconnecting to how they unfolded.\n\nThis shift does not mean disengaging from the work. It means trusting that the thinking and conditions you established can continue operating without your ongoing visibility.",
      reflection: {
        intro: "As you reflect on this domain, it may be useful to think about recent leadership moments where work progressed without your direct involvement.",
        questions: ["Recall a recent initiative you delegated fully. What influenced how closely you stayed connected to how it unfolded?","When a project is progressing well, what signals tell you it is safe to step further back?","As you continue developing your leadership approach, where might experimenting with less process visibility allow others to step more fully into ownership?"],
      },
    },
    "2b": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Identity.\n\nLeaders with this orientation often experience their contribution through how their leadership influence is understood. They typically operate at the level expected of their role, contributing through framing decisions, shaping direction, and influencing how work moves forward.\n\nContribution is less about staying close to the work itself and more about ensuring the thinking behind the work is visible and understood.",
      bullets: ["pay attention to how their involvement or absence is interpreted by others","clarify the context behind decisions so the leadership thinking is understood","ensure that their influence is appropriately represented in important conversations","delegate work while remaining attentive to how their leadership contribution is perceived"],
      bulletsNote: "These leaders often bring strong awareness to how leadership operates within an organization's social and political environment.",
      possible: "Protect Identity often supports effective leadership at scale.\n\nLeaders operating from this orientation frequently provide clarity around strategic direction, help others understand the reasoning behind important decisions, maintain alignment across stakeholders by communicating context effectively, and represent their team or function clearly within larger leadership conversations.\n\nOrganizations often benefit from leaders who are skilled at articulating leadership thinking and maintaining alignment across groups.",
      shift: "As leaders continue developing in this domain, contribution increasingly becomes less connected to whether leadership influence is recognized directly.\n\nThe next shift often involves becoming more interested in whether the thinking itself continues shaping outcomes, even when it is no longer clearly associated with the leader who introduced it.\n\nThis may include experimenting with allowing others to carry forward ideas without reinforcing where they originated, focusing less on whether leadership influence is recognized and more on whether it continues operating effectively, and observing how systems and decisions evolve after the original leadership framing is no longer visible.",
      reflection: {
        intro: "As you reflect on this domain, it may be useful to consider moments where your influence shaped outcomes indirectly.",
        questions: ["Think about a recent situation where your thinking influenced a decision but was not explicitly attributed. What was your internal response?","When conversations move forward without referencing your earlier framing, what signals tell you your influence is still present?","As you continue developing your leadership approach, where might experimenting with less emphasis on recognition of influence allow your thinking to operate more freely through others?"],
      },
    },
    "2b+": {
      transitional: "Your responses suggest that your leadership patterns in this domain sit between Protect Identity and Protect System.\n\nIn many situations you lead with Protect Identity — paying attention to how your leadership influence is understood and how decisions are framed. At the same time, your responses show emerging patterns associated with Protect System, where contribution is experienced through the structures and thinking that shape outcomes over time.\n\nLeaders in this position often notice themselves experimenting with releasing the need for their influence to be recognized directly and becoming more interested in how their thinking continues to operate through others.",
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Identity.\n\nLeaders with this orientation often experience their contribution through how their leadership influence is understood. They typically operate at the level expected of their role, contributing through framing decisions, shaping direction, and influencing how work moves forward.",
      bullets: ["pay attention to how their involvement or absence is interpreted by others","clarify the context behind decisions so the leadership thinking is understood","ensure that their influence is appropriately represented in important conversations","delegate work while remaining attentive to how their leadership contribution is perceived"],
      bulletsNote: "These leaders often bring strong awareness to how leadership operates within an organization's social and political environment.",
      possible: "Protect Identity often supports effective leadership at scale.\n\nLeaders operating from this orientation frequently provide clarity around strategic direction, help others understand the reasoning behind important decisions, maintain alignment across stakeholders, and represent their team clearly within larger leadership conversations.",
      shift: "As leaders continue developing in this domain, contribution increasingly becomes less connected to whether leadership influence is recognized directly.\n\nThis may include experimenting with allowing others to carry forward ideas without reinforcing where they originated, focusing less on whether influence is recognized and more on whether it continues operating effectively, and observing how decisions evolve after the original framing is no longer visible.",
      reflection: {
        intro: "As you reflect on this domain, it may be useful to consider moments where your influence shaped outcomes indirectly.",
        questions: ["Think about a recent situation where your thinking influenced a decision but was not explicitly attributed. What was your internal response?","When conversations move forward without referencing your earlier framing, what signals tell you your influence is still present?","As you continue developing your leadership approach, where might experimenting with less emphasis on recognition of influence allow your thinking to operate more freely through others?"],
      },
    },
    "3": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect System.\n\nLeaders with this orientation experience contribution through the influence of the systems, thinking, and structures they establish.\n\nRather than focusing on visibility or proximity to the work, attention often moves to whether the broader architecture shaping the work is functioning as intended.\n\nContribution is experienced through seeing decisions, approaches, and behaviors continue to reflect the thinking that shaped them.",
      bullets: ["pay attention to whether the structures guiding work are functioning well","observe how decisions unfold across the system rather than focusing on individual actions","notice when their thinking continues to shape outcomes over time","distinguish between outcomes they would choose differently and outcomes that still reflect sound systems"],
      bulletsNote: "These leaders often bring scalability, perspective, and system awareness to leadership.",
      possible: "Protect System supports leadership that operates at the level of the whole.\n\nLeaders operating this way frequently create conditions where decisions can happen across the organization without requiring their involvement, develop others' capacity to carry the work forward, focus on the architecture of how work gets done rather than the work itself, and support organizational learning and adaptation over time.",
      shift: "At this level, development often involves noticing where attachment to the system itself may begin to appear.\n\nGrowth can involve experimenting with allowing systems to evolve beyond their original design, noticing where influence persists even when structures change, and remaining open to new ways the system may adapt without their direction.",
      reflection: {
        intro: "As you reflect on this domain, you might consider recent moments when your thinking shaped outcomes in ways you did not directly observe.",
        questions: ["Think about a time when a structure or approach you established continued shaping work after you were no longer involved. What did you notice?","When you observe the organization making decisions that reflect your thinking, how does that land for you as a leader?","As you continue developing your leadership approach, where might experimenting with allowing systems to evolve beyond their original design expand your leadership influence?"],
      },
    },
  },
  2: {
    "1": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Outcome.\n\nLeaders with this orientation often experience their leadership value through advocating for the direction they believe is correct. When ambiguity appears in the analysis, attention naturally moves toward clarifying or strengthening the recommendation.\n\nThis orientation often emerges in environments where leaders are expected to provide clear direction and stand behind their judgment.",
      bullets: ["focus on strengthening the case for a recommendation","emphasize clarity and decisiveness in leadership discussions","respond to challenges by reinforcing the reasoning behind the proposed direction","see part of their leadership role as ensuring the group does not become stalled by uncertainty"],
      bulletsNote: "Teams often experience these leaders as decisive and confident in their judgment.",
      possible: "Protect Outcome often enables leaders to move organizations forward.\n\nLeaders operating this way frequently provide clear direction when ambiguity could slow progress, help groups commit to a course of action, maintain momentum in complex decision environments, and demonstrate confidence that encourages others to act.",
      shift: "As leadership responsibility grows, decision-making often becomes less about advocating for the strongest conclusion and more about making the reasoning process visible to others.\n\nThe next shift may involve experimenting with openly acknowledging when the data is mixed, naming the tradeoffs embedded in a recommendation, and allowing challenges to the reasoning to remain open longer before resolving them.\n\nOver time, leadership influence in this domain often comes from helping others see how decisions are being reasoned through, not only from the strength of the final recommendation.",
      reflection: {
        intro: "You may find it useful to reflect on recent leadership decisions where uncertainty was present.",
        questions: ["Recall a time when the data behind a recommendation was mixed. What influenced how you presented the decision?","When your recommendation is challenged in a meeting, what tends to happen internally first?","As you continue developing your leadership approach, where might experimenting with greater transparency in your reasoning strengthen collective decision-making?"],
      },
    },
    "2a": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Process.\n\nLeaders with this orientation often experience decision credibility through the thoroughness of the analysis. Before committing publicly to a direction, attention moves toward ensuring that the reasoning is well supported and defensible.\n\nContribution in this domain often shows up through careful evaluation of risks, assumptions, and alternatives.",
      bullets: ["review analysis carefully before presenting a recommendation","ensure that potential risks and tradeoffs are clearly understood","respond to challenges by strengthening the analytical foundation","take time to confirm that the reasoning behind a decision holds up"],
      bulletsNote: "These leaders often bring analytical discipline and careful thinking to decision-making processes.",
      possible: "Protect Process often strengthens decision quality.\n\nLeaders operating from this orientation frequently ensure decisions are supported by sound analysis, prevent important risks from being overlooked, help organizations avoid avoidable mistakes, and create decision environments where reasoning is taken seriously.",
      shift: "As leadership influence grows, the developmental shift often involves moving from defensibility to transparency.\n\nThis may include experimenting with sharing uncertainties in the analysis earlier in the process, inviting others to challenge assumptions before conclusions are finalized, and focusing less on whether the analysis is fully protected and more on whether the reasoning is visible and understandable.\n\nOver time, leadership contribution in this domain often becomes less about protecting the analysis and more about opening the reasoning process so others can engage with it.",
      reflection: {
        intro: "As you reflect on this domain, you might consider recent decision moments where your reasoning was under scrutiny.",
        questions: ["Think about a recent recommendation you presented. What influenced how much uncertainty you revealed in the analysis?","When preparing for an important decision discussion, how do you decide when the analysis is ready to share?","As you continue developing your leadership approach, where might experimenting with earlier transparency in your reasoning strengthen collaboration around complex decisions?"],
      },
    },
    "2b": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Identity.\n\nLeaders with this orientation often experience decision credibility through demonstrating analytical rigor. The reasoning behind decisions is structured and thoughtful, and attention often goes to presenting the analysis in a way that reflects strong leadership judgment.\n\nContribution in this domain frequently shows up through carefully framing decisions and articulating the tradeoffs involved.",
      bullets: ["present decisions with visible balance and structured reasoning","articulate tradeoffs clearly during leadership discussions","ensure their thinking reflects thoughtful and credible leadership judgment","remain attentive to how their reasoning is interpreted by others"],
      bulletsNote: "These leaders often bring clarity and structure to complex decision conversations.",
      possible: "Protect Identity often supports effective leadership communication.\n\nLeaders operating this way frequently help leadership groups understand complex tradeoffs, articulate reasoning in ways that build credibility and trust, guide conversations toward thoughtful consideration of alternatives, and ensure decision discussions remain structured and productive.",
      shift: "As leaders continue developing in this domain, reasoning often becomes less connected to demonstrating strong analytical judgment and more connected to making the reasoning process itself transparent.\n\nThis may involve experimenting with allowing others to question the reasoning without immediately resolving the discussion, exploring alternative interpretations of the data, and following the logic of the analysis even when it challenges the preferred conclusion.\n\nOver time, leadership influence in this domain often comes from creating reasoning processes that others can see and engage with, rather than from demonstrating personal analytical expertise.",
      reflection: {
        intro: "You may find it useful to reflect on moments when your reasoning shaped an important leadership conversation.",
        questions: ["Recall a recent decision discussion where you presented a recommendation. How did you decide which parts of your reasoning to emphasize?","When others question your reasoning, what helps you remain open to the possibility that the conclusion might evolve?","As you continue developing your leadership approach, where might experimenting with greater openness to alternative interpretations deepen collective decision-making?"],
      },
    },
    "2b+": {
      transitional: "Your responses suggest that your leadership patterns in this domain sit between Protect Identity and Protect System.\n\nIn many situations you lead with Protect Identity — presenting reasoning in a structured, credible way that reflects strong analytical judgment. At the same time, your responses show emerging patterns associated with Protect System, where the transparency of the reasoning process itself becomes the primary focus.\n\nLeaders in this position often notice themselves beginning to follow the logic of analysis wherever it leads, even when it challenges a preferred conclusion.",
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Identity.\n\nLeaders with this orientation often experience decision credibility through demonstrating analytical rigor. The reasoning behind decisions is structured and thoughtful, and attention often goes to presenting the analysis in a way that reflects strong leadership judgment.",
      bullets: ["present decisions with visible balance and structured reasoning","articulate tradeoffs clearly during leadership discussions","ensure their thinking reflects thoughtful and credible leadership judgment","remain attentive to how their reasoning is interpreted by others"],
      bulletsNote: "These leaders often bring clarity and structure to complex decision conversations.",
      possible: "Protect Identity often supports effective leadership communication.\n\nLeaders operating this way frequently help leadership groups understand complex tradeoffs, articulate reasoning in ways that build credibility and trust, and ensure decision discussions remain structured and productive.",
      shift: "As leaders continue developing in this domain, reasoning often becomes less connected to demonstrating strong analytical judgment and more connected to making the reasoning process itself transparent.\n\nThis may involve experimenting with allowing others to question the reasoning without immediately resolving the discussion, exploring alternative interpretations of the data, and following the logic of the analysis even when it challenges the preferred conclusion.",
      reflection: {
        intro: "You may find it useful to reflect on moments when your reasoning shaped an important leadership conversation.",
        questions: ["Recall a recent decision discussion where you presented a recommendation. How did you decide which parts of your reasoning to emphasize?","When others question your reasoning, what helps you remain open to the possibility that the conclusion might evolve?","As you continue developing your leadership approach, where might experimenting with greater openness to alternative interpretations deepen collective decision-making?"],
      },
    },
    "3": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect System.\n\nLeaders with this orientation often experience decision credibility through the integrity of the reasoning process itself. Rather than focusing primarily on the conclusion, attention moves toward ensuring the logic behind the decision remains transparent and open to examination.\n\nContribution in this domain often involves helping others understand how decisions are being reasoned through.",
      bullets: ["openly discuss the tradeoffs involved in decisions","name uncertainties in the analysis without needing to resolve them immediately","remain curious when others challenge their reasoning","follow the logic of the analysis even when it leads somewhere unexpected"],
      bulletsNote: "These leaders often bring intellectual openness and curiosity to decision-making environments.",
      possible: "Protect System can strengthen collective leadership thinking.\n\nLeaders operating this way frequently create environments where reasoning is visible and discussable, help teams navigate complex decisions without oversimplifying them, encourage thoughtful examination of assumptions, and support cultures where learning and inquiry are valued.",
      shift: "At this stage, development often involves noticing how one's own reasoning frameworks shape what becomes visible in the analysis.\n\nLeaders may experiment with questioning the assumptions embedded in their own decision frameworks, inviting perspectives that challenge the structure of the reasoning itself, and noticing when intellectual confidence may limit curiosity.",
      reflection: {
        intro: "As you reflect on this domain, you might consider recent decisions where reasoning played a central role.",
        questions: ["Think about a recent decision where the analysis evolved during discussion. What allowed that evolution to happen?","When others challenge your reasoning, what helps you stay curious rather than moving toward resolution?","As you continue developing your leadership approach, where might experimenting with questioning your own analytical frameworks deepen collective insight?"],
      },
    },
  },
  3: {
    "1": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Outcome.\n\nLeaders with this orientation often experience accountability for delegated work as personal responsibility for the final result. When delegated decisions produce friction or uncertainty, the instinct is often to step back in to ensure the outcome aligns with expectations.",
      bullets: ["re-engage directly when delegated work begins to drift","stay closely connected to decisions that affect important outcomes","feel responsible for ensuring that delegated work meets their standards","step back into situations where uncertainty begins to grow"],
      bulletsNote: "Teams often experience these leaders as highly accountable for results and deeply invested in the success of the work.",
      possible: "Protect Outcome can create strong ownership around important initiatives.\n\nLeaders operating this way frequently ensure that critical work meets high standards, step in quickly when projects begin to struggle, provide decisive direction when uncertainty emerges, and maintain strong accountability for outcomes.",
      shift: "As leadership scope expands, authority increasingly spreads across teams and systems.\n\nThe next shift in this domain often involves experimenting with allowing others to make decisions even when their approach differs from your own, distinguishing between decisions that require intervention and those that represent normal variation, and focusing more on whether the decision framework is functioning than on whether the decision matches your preference.",
      reflection: {
        intro: "You may find it useful to reflect on recent situations where someone else made a decision that still reflected on you as a leader.",
        questions: ["Think about a recent delegated decision that unfolded differently than you expected. What influenced your response?","When you notice yourself wanting to step back into a decision, what signals help you determine whether intervention is necessary?","As you continue developing your leadership approach, where might experimenting with greater trust in the authority structure allow others to grow into decision ownership?"],
      },
    },
    "2a": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Process.\n\nLeaders with this orientation often experience accountability for delegated decisions through maintaining oversight structures. Rather than stepping directly into decisions, attention moves toward ensuring there are systems that allow the leader to remain informed about how decisions are unfolding.",
      bullets: ["establish checkpoints or review loops around delegated decisions","remain informed about how key decisions are unfolding","adjust oversight structures when unexpected outcomes occur","maintain visibility into important work streams without taking control of them"],
      bulletsNote: "These leaders often bring structure and reliability to how authority operates within teams.",
      possible: "Protect Process often supports effective delegation while maintaining accountability.\n\nLeaders operating this way frequently ensure that delegated decisions remain aligned with broader goals, catch potential problems early through strong communication structures, support teams by providing clear decision boundaries, and maintain organizational consistency across complex work.",
      shift: "As leaders continue developing in this domain, authority often becomes less dependent on oversight and more dependent on trust in the system design.\n\nThis shift may involve experimenting with reducing checkpoints that primarily provide reassurance, allowing others to navigate uncertainty without immediate guidance, and observing how decisions unfold without adjusting oversight structures too quickly.",
      reflection: {
        intro: "You may find it useful to reflect on situations where oversight structures shaped how decisions unfolded.",
        questions: ["Think about a recent project where you established checkpoints or review loops. What purpose did those structures serve?","When unexpected outcomes occur, how do you decide whether to adjust the system or allow the situation to unfold further?","As you continue developing your leadership approach, where might experimenting with less oversight visibility allow decision ownership to deepen across your team?"],
      },
    },
    "2b": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Identity.\n\nLeaders with this orientation often delegate authority genuinely while remaining attentive to how that delegation is perceived. Authority is distributed, but attention still goes to how leadership credibility and accountability are interpreted by others.",
      bullets: ["delegate decisions while remaining attentive to how those decisions reflect on their leadership","address situations where delegated decisions create friction by managing both the issue and the narrative","ensure that their delegation approach is understood by senior leaders and peers","balance empowering others with maintaining leadership credibility"],
      bulletsNote: "These leaders often bring political awareness and communication skill to how authority operates.",
      possible: "Protect Identity can support effective leadership in complex organizational environments.\n\nLeaders operating this way frequently represent their teams effectively within leadership conversations, maintain credibility while distributing authority, communicate clearly about how decisions are being delegated, and help others understand how authority flows within the organization.",
      shift: "As leaders continue developing in this domain, authority increasingly becomes less connected to how delegation appears and more connected to how systems function.\n\nThis may involve experimenting with allowing delegated decisions to stand without managing how they are interpreted, becoming less concerned with how authority structures reflect on personal leadership, and focusing more on whether the authority system itself is working effectively.",
      reflection: {
        intro: "You may find it useful to reflect on situations where your leadership credibility intersected with delegated decisions.",
        questions: ["Recall a time when a delegated decision created tension with another group. How did you approach managing both the issue and the perception of the situation?","When authority is distributed across your team, what signals help you feel confident the system is working?","As you continue developing your leadership approach, where might experimenting with less narrative management around delegation allow authority to spread more naturally?"],
      },
    },
    "2b+": {
      transitional: "Your responses suggest that your leadership patterns in this domain sit between Protect Identity and Protect System.\n\nIn many situations you lead with Protect Identity — delegating authority while remaining attentive to how that delegation is perceived. At the same time, your responses show emerging patterns associated with Protect System, where accountability is experienced through the design and functioning of the authority structure itself.\n\nLeaders in this position often notice themselves becoming less focused on how delegation appears and more interested in whether the systems they have built are truly enabling others to exercise real authority.",
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Identity.\n\nLeaders with this orientation often delegate authority genuinely while remaining attentive to how that delegation is perceived. Authority is distributed, but attention still goes to how leadership credibility and accountability are interpreted by others.",
      bullets: ["delegate decisions while remaining attentive to how those decisions reflect on their leadership","address situations where delegated decisions create friction by managing both the issue and the narrative","ensure that their delegation approach is understood by senior leaders and peers","balance empowering others with maintaining leadership credibility"],
      bulletsNote: "These leaders often bring political awareness and communication skill to how authority operates.",
      possible: "Protect Identity can support effective leadership in complex organizational environments.\n\nLeaders operating this way frequently represent their teams effectively, maintain credibility while distributing authority, and help others understand how authority flows within the organization.",
      shift: "As leaders continue developing in this domain, authority increasingly becomes less connected to how delegation appears and more connected to how systems function.\n\nThis may involve experimenting with allowing delegated decisions to stand without managing how they are interpreted, and focusing more on whether the authority system itself is working effectively.",
      reflection: {
        intro: "You may find it useful to reflect on situations where your leadership credibility intersected with delegated decisions.",
        questions: ["Recall a time when a delegated decision created tension with another group. How did you approach managing both the issue and the perception of the situation?","When authority is distributed across your team, what signals help you feel confident the system is working?","As you continue developing your leadership approach, where might experimenting with less narrative management around delegation allow authority to spread more naturally?"],
      },
    },
    "3": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect System.\n\nLeaders with this orientation often experience accountability through the design of the authority system itself. Rather than focusing on individual decisions, attention moves toward whether the structures guiding those decisions are functioning effectively.\n\nContribution in this domain often shows up through creating environments where others can exercise real authority.",
      bullets: ["focus on how authority is structured across teams","allow others to make decisions even when outcomes differ from their own preferences","examine whether decision systems are functioning rather than reacting to individual outcomes","treat occasional friction as part of how distributed authority evolves"],
      bulletsNote: "These leaders often bring system thinking to how authority operates across the organization.",
      possible: "Protect System can support scalable leadership.\n\nLeaders operating this way frequently build organizations where decisions can happen without constant leader involvement, develop teams that take genuine ownership of decisions, create systems where authority flows across functions and roles, and support environments where learning occurs through decision-making.",
      shift: "At this stage, development often involves examining how one's own assumptions shape the authority systems being created.\n\nLeaders may experiment with questioning whether existing decision frameworks allow enough flexibility, inviting others to challenge how authority is structured, and observing how authority flows across the organization without reinforcing the existing structure.",
      reflection: {
        intro: "As you reflect on this domain, you might consider moments where authority was distributed across your team.",
        questions: ["Think about a recent decision made by someone else on your team. What helped you decide whether the authority structure was working?","When friction appears between teams, how do you determine whether it reflects a system issue or normal variation in decision-making?","As you continue developing your leadership approach, where might experimenting with greater openness to how authority structures evolve strengthen the organization's decision capacity?"],
      },
    },
  },
  4: {
    "1": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Outcome.\n\nLeaders with this orientation often experience leadership responsibility through advocating for their people. When decisions place pressure on the team, attention naturally moves toward protecting their interests and ensuring their work and contributions are recognized.",
      bullets: ["advocate strongly for their team's resources and priorities","step in quickly when decisions disadvantage their people","emphasize loyalty and support within the team","work to shield their team from external pressures"],
      bulletsNote: "Teams often experience these leaders as highly protective and deeply committed to their success.",
      possible: "Protect Outcome often creates strong trust within teams.\n\nLeaders operating this way frequently build loyalty and commitment among team members, ensure their team's work is represented in leadership discussions, protect important work from being overlooked, and create environments where people feel supported by their leader.",
      shift: "As leadership scope expands, decisions increasingly require considering how resources and priorities affect the organization as a whole.\n\nThe next shift in this domain often involves experimenting with viewing team interests as one part of a broader system, participating in decisions that may benefit the organization even when they create short-term difficulty for one's own team, and helping team members understand the larger context behind difficult decisions.",
      reflection: {
        intro: "You may find it useful to reflect on recent moments where your team's interests intersected with broader organizational decisions.",
        questions: ["Think about a recent decision that created tension between your team's needs and the organization's direction. What influenced how you approached that moment?","When your team experiences pressure from outside decisions, what helps you balance support for them with responsibility for the organization?","As you continue developing your leadership approach, where might experimenting with broadening the frame of responsibility create new leadership possibilities?"],
      },
    },
    "2a": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Process.\n\nLeaders with this orientation often navigate loyalty tensions by seeking balanced solutions. Rather than fully prioritizing one side, attention moves toward finding approaches that support the organization while protecting key needs within the team.",
      bullets: ["look for ways to implement decisions that reduce negative effects on their team","negotiate resources, timelines, or adjustments that support both sides of the decision","help their team adapt to organizational shifts","remain attentive to maintaining alignment across groups"],
      bulletsNote: "These leaders often bring thoughtful mediation to complex organizational decisions.",
      possible: "Protect Process can support constructive collaboration across teams.\n\nLeaders operating this way frequently help leadership groups navigate difficult tradeoffs, reduce unnecessary conflict between functions, maintain stability during organizational change, and create solutions that allow multiple priorities to coexist.",
      shift: "As leadership influence grows, development in this domain often involves becoming more comfortable with clear system-level decisions, even when they cannot fully accommodate all interests.\n\nThis may involve experimenting with allowing some decisions to stand without negotiating modifications, supporting organizational priorities even when adjustments cannot soften the impact, and helping teams understand the broader system perspective behind decisions.",
      reflection: {
        intro: "As you reflect on this domain, you might consider situations where you helped navigate competing priorities.",
        questions: ["Recall a recent decision where you worked to balance team needs with broader organizational goals. What influenced your approach?","When negotiating adjustments to a decision, how do you determine when balance has been reached?","As you continue developing your leadership approach, where might experimenting with clearer system-level alignment deepen your leadership impact?"],
      },
    },
    "2b": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Identity.\n\nLeaders with this orientation often hold both team loyalty and organizational responsibility while remaining attentive to how that balance is understood by others.\n\nContribution in this domain often involves communicating decisions in ways that maintain trust with one's team while demonstrating alignment with organizational leadership.",
      bullets: ["explain organizational decisions carefully to their team","maintain alignment with senior leadership while acknowledging the impact on their people","pay attention to how their response to difficult decisions is interpreted","balance support for their team with visible commitment to organizational priorities"],
      bulletsNote: "These leaders often bring political awareness and thoughtful communication to complex organizational moments.",
      possible: "Protect Identity can strengthen leadership credibility.\n\nLeaders operating this way frequently help their teams understand the reasoning behind difficult decisions, maintain trust across different parts of the organization, represent their team's perspective within leadership conversations, and support alignment during periods of organizational change.",
      shift: "As leaders continue developing in this domain, loyalty often becomes less connected to how the leader's stance is interpreted and more connected to holding the system perspective directly.\n\nThis may involve experimenting with allowing difficult decisions to stand without needing to carefully position them, remaining present with the impact on one's team without reshaping the narrative, and focusing more on the long-term health of the organization than on managing perceptions.",
      reflection: {
        intro: "You may find it useful to reflect on recent situations where you communicated difficult organizational decisions.",
        questions: ["Think about a moment when your team reacted strongly to an organizational decision. What influenced how you explained the situation?","When balancing alignment with leadership and loyalty to your team, what helps guide your response?","As you continue developing your leadership approach, where might experimenting with less narrative management and more direct system perspective strengthen your leadership presence?"],
      },
    },
    "2b+": {
      transitional: "Your responses suggest that your leadership patterns in this domain sit between Protect Identity and Protect System.\n\nIn many situations you lead with Protect Identity — carefully communicating organizational decisions in ways that maintain trust with your team while demonstrating alignment with leadership. At the same time, your responses show emerging patterns associated with Protect System, where responsibility is experienced through the health of the whole organization, even when that creates real difficulty for your people.\n\nLeaders in this position often notice themselves becoming less focused on managing how decisions are perceived and more willing to hold the tension between team loyalty and organizational responsibility directly.",
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Identity.\n\nLeaders with this orientation often hold both team loyalty and organizational responsibility while remaining attentive to how that balance is understood by others.",
      bullets: ["explain organizational decisions carefully to their team","maintain alignment with senior leadership while acknowledging the impact on their people","pay attention to how their response to difficult decisions is interpreted","balance support for their team with visible commitment to organizational priorities"],
      bulletsNote: "These leaders often bring political awareness and thoughtful communication to complex organizational moments.",
      possible: "Protect Identity can strengthen leadership credibility.\n\nLeaders operating this way frequently help their teams understand difficult decisions, maintain trust across the organization, and support alignment during periods of organizational change.",
      shift: "As leaders continue developing in this domain, loyalty often becomes less connected to how the leader's stance is interpreted and more connected to holding the system perspective directly.\n\nThis may involve experimenting with allowing difficult decisions to stand without positioning them carefully and focusing more on the long-term health of the organization than on managing perceptions.",
      reflection: {
        intro: "You may find it useful to reflect on recent situations where you communicated difficult organizational decisions.",
        questions: ["Think about a moment when your team reacted strongly to an organizational decision. What influenced how you explained the situation?","When balancing alignment with leadership and loyalty to your team, what helps guide your response?","As you continue developing your leadership approach, where might experimenting with less narrative management and more direct system perspective strengthen your leadership presence?"],
      },
    },
    "3": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect System.\n\nLeaders with this orientation often experience responsibility through the health of the organization as a whole. Decisions are evaluated primarily through how they strengthen the broader system, even when they create difficulty for the leader's own team.\n\nContribution in this domain often involves holding both the system perspective and the human impact of decisions simultaneously.",
      bullets: ["prioritize decisions that strengthen the organization overall","acknowledge the impact of difficult decisions on their team without minimizing it","remain present when people express frustration or disappointment","help teams understand the broader purpose behind organizational shifts"],
      bulletsNote: "These leaders often bring system stewardship and emotional steadiness to complex leadership decisions.",
      possible: "Protect System can support strong organizational leadership.\n\nLeaders operating this way frequently help organizations navigate difficult tradeoffs responsibly, maintain alignment across teams during major shifts, support cultures where difficult conversations can occur openly, and guide organizations through change while remaining attentive to people.",
      shift: "At this stage, development often involves deepening awareness of how system decisions affect the lived experience of people throughout the organization.\n\nLeaders may experiment with slowing down to listen more deeply to the impact of decisions, inviting perspectives from those most affected by change, and remaining curious about how system choices shape culture and relationships.",
      reflection: {
        intro: "As you reflect on this domain, you might consider moments where organizational priorities affected your team.",
        questions: ["Think about a recent decision that benefited the organization but created difficulty for your team. What helped you hold both realities?","When team members express frustration with system decisions, what helps you remain present without needing to resolve the tension immediately?","As you continue developing your leadership approach, where might experimenting with greater curiosity about the human experience of system decisions deepen your leadership impact?"],
      },
    },
  },
  5: {
    "1": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Outcome.\n\nLeaders with this orientation often respond to interpersonal pressure by addressing the situation directly. When tension appears, the instinct is to resolve the issue, clarify the decision, or reestablish direction.\n\nContribution in this domain often shows up through bringing conversations back to clarity and forward movement.",
      bullets: ["respond quickly when disagreements arise","clarify decisions or reasoning when challenged","address misunderstandings directly","work to restore alignment when conversations become tense"],
      bulletsNote: "Teams often experience these leaders as clear, direct, and action oriented during challenging moments.",
      possible: "Protect Outcome can help organizations move through difficult moments efficiently.\n\nLeaders operating this way frequently prevent conversations from becoming stalled in conflict, restore clarity when communication breaks down, help groups regain focus during tense discussions, and demonstrate confidence during high-pressure interactions.",
      shift: "As leaders continue developing in this domain, growth often involves creating more space between the initial reaction and the response.\n\nThis may include experimenting with allowing tension in a conversation to remain present briefly before resolving it, noticing what emotional reactions might be signaling, and becoming curious about how others are experiencing the interaction.\n\nOver time, leadership presence in this domain often shifts from resolving pressure quickly to exploring what the moment might reveal.",
      reflection: {
        intro: "You may find it useful to reflect on recent leadership conversations where tension appeared.",
        questions: ["Think about a recent conversation where someone challenged your perspective. What happened internally before you responded?","When discussions become tense, what helps you decide whether to resolve the issue immediately or stay with the conversation longer?","As you continue developing your leadership approach, where might experimenting with pausing before responding create new understanding in difficult conversations?"],
      },
    },
    "2a": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Process.\n\nLeaders with this orientation often respond to interpersonal pressure by carefully managing their reactions. Attention moves toward maintaining composure and ensuring the conversation remains constructive.\n\nContribution in this domain often involves regulating one's response so the interaction remains productive.",
      bullets: ["remain calm when conversations become tense","monitor their reactions carefully in challenging discussions","work to prevent conversations from escalating emotionally","focus on maintaining a respectful tone even under pressure"],
      bulletsNote: "These leaders often bring stability and self-regulation to difficult interpersonal situations.",
      possible: "Protect Process often supports healthy communication.\n\nLeaders operating this way frequently create environments where difficult conversations remain constructive, model emotional steadiness during conflict, help others stay focused on productive dialogue, and maintain psychological safety during disagreement.",
      shift: "As leaders continue developing in this domain, presence often becomes less about managing reactions and more about becoming curious about them.\n\nThis may involve experimenting with noticing emotional responses without immediately regulating them away, exploring what tension in a conversation might reveal about the underlying issue, and inviting others to share more about their experience of the interaction.\n\nOver time, leadership presence in this domain often shifts from containing reactions to learning from them.",
      reflection: {
        intro: "You may find it useful to reflect on recent conversations where emotional pressure was present.",
        questions: ["Recall a recent conversation where you worked to stay composed. What helped you regulate your response?","When tension appears in a discussion, what signals tell you it is important to remain steady?","As you continue developing your leadership approach, where might experimenting with greater curiosity about emotional signals deepen your leadership presence?"],
      },
    },
    "2b": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Identity.\n\nLeaders with this orientation often maintain composure while remaining attentive to how their presence is perceived by others. During challenging moments, attention often moves toward responding in a way that reflects the kind of leader they aim to be.\n\nContribution in this domain often involves responding thoughtfully while maintaining leadership credibility.",
      bullets: ["consider how their response will be interpreted during difficult conversations","respond carefully when challenged in public settings","remain composed while addressing disagreement","balance authenticity with maintaining leadership presence"],
      bulletsNote: "These leaders often bring awareness of social dynamics and leadership presence to challenging interactions.",
      possible: "Protect Identity can strengthen leadership credibility.\n\nLeaders operating this way frequently maintain confidence during difficult discussions, communicate thoughtfully when tension is present, help others feel heard while maintaining leadership authority, and represent themselves and their role clearly during challenging moments.",
      shift: "As leaders continue developing in this domain, presence often becomes less about how one's response appears and more about what the moment itself might reveal.\n\nThis may involve experimenting with allowing feedback or disagreement to remain open longer, becoming curious about how others are experiencing the interaction, and letting conversations unfold without needing to manage how one's presence is perceived.\n\nOver time, leadership presence in this domain often shifts toward genuine curiosity about the interaction itself.",
      reflection: {
        intro: "You may find it useful to reflect on moments where your leadership presence was challenged or questioned.",
        questions: ["Recall a time when someone questioned your approach or decision. What influenced how you responded?","When conversations become tense, how aware are you of how your response may be interpreted?","As you continue developing your leadership approach, where might experimenting with greater openness to the conversation itself deepen your connection with others?"],
      },
    },
    "2b+": {
      transitional: "Your responses suggest that your leadership patterns in this domain sit between Protect Identity and Protect System.\n\nIn many situations you lead with Protect Identity — remaining composed and attentive to how your presence is perceived during difficult conversations. At the same time, your responses show emerging patterns associated with Protect System, where interpersonal pressure becomes an opportunity for genuine curiosity about what the moment might reveal.\n\nLeaders in this position often notice themselves beginning to let conversations unfold more naturally, becoming less focused on managing how they appear and more interested in what the interaction itself might be revealing.",
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect Identity.\n\nLeaders with this orientation often maintain composure while remaining attentive to how their presence is perceived by others. During challenging moments, attention often moves toward responding in a way that reflects the kind of leader they aim to be.",
      bullets: ["consider how their response will be interpreted during difficult conversations","respond carefully when challenged in public settings","remain composed while addressing disagreement","balance authenticity with maintaining leadership presence"],
      bulletsNote: "These leaders often bring awareness of social dynamics and leadership presence to challenging interactions.",
      possible: "Protect Identity can strengthen leadership credibility.\n\nLeaders operating this way frequently maintain confidence during difficult discussions, communicate thoughtfully when tension is present, and help others feel heard while maintaining leadership authority.",
      shift: "As leaders continue developing in this domain, presence often becomes less about how one's response appears and more about what the moment itself might reveal.\n\nThis may involve experimenting with allowing feedback or disagreement to remain open longer, becoming curious about how others are experiencing the interaction, and letting conversations unfold without needing to manage how one's presence is perceived.",
      reflection: {
        intro: "You may find it useful to reflect on moments where your leadership presence was challenged or questioned.",
        questions: ["Recall a time when someone questioned your approach or decision. What influenced how you responded?","When conversations become tense, how aware are you of how your response may be interpreted?","As you continue developing your leadership approach, where might experimenting with greater openness to the conversation itself deepen your connection with others?"],
      },
    },
    "3": {
      intro: "Your responses suggest that in this domain your leadership patterns tend to align with Protect System.\n\nLeaders with this orientation often respond to interpersonal pressure with genuine curiosity. When tension arises, attention moves toward understanding what the moment might reveal about the conversation, the relationship, or the broader dynamic.\n\nContribution in this domain often shows up through creating space for deeper understanding within difficult conversations.",
      bullets: ["remain curious when others challenge their ideas","explore the underlying dynamics in tense conversations","listen carefully when feedback feels uncomfortable","allow difficult discussions to unfold without rushing to resolution"],
      bulletsNote: "These leaders often bring openness and reflective awareness to interpersonal interactions.",
      possible: "Protect System can support deeper leadership relationships.\n\nLeaders operating this way frequently create environments where honest conversations can occur, encourage learning within difficult discussions, strengthen trust by remaining open to feedback, and help teams explore underlying issues rather than avoiding them.",
      shift: "At this stage, development often involves noticing how one's own presence shapes the conversation.\n\nLeaders may experiment with observing how their reactions influence the dynamics of the discussion, inviting others to explore tensions more openly, and reflecting on how curiosity can support learning across the team.\n\nThese shifts can deepen the leader's ability to create environments where meaningful conversations and learning can occur.",
      reflection: {
        intro: "As you reflect on this domain, you might consider recent conversations where tension or disagreement emerged.",
        questions: ["Think about a recent moment when someone challenged your thinking. What helped you remain curious about the situation?","When feedback feels uncomfortable, what helps you stay open to what might be learned?","As you continue developing your leadership approach, where might experimenting with deeper curiosity about interpersonal dynamics strengthen your leadership presence?"],
      },
    },
  },
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
  const pct = [0,33,58,58,85][pos];

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
      <SH>Your Orientation: {isTransitional ? "Protect Identity (Emerging System Orientation)" : ORIENTATION_LABELS[placement]}</SH>
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
                  <button key={d} onClick={()=>setDomainTab(d)} style={{fontFamily:"system-ui,sans-serif",fontSize:12,padding:"7px 14px",background:domainTab===d?C.deepCharcoal:C.lightSage,color:domainTab===d?C.warmWhite:C.nearBlack,border:`1px solid ${domainTab===d?C.deepCharcoal:C.warmWhite}`,cursor:"pointer",fontWeight:400}}>{DOMAIN_NAMES[d]}</button>
                ))}
              </div>
              <DomainPage domain={domainTab} placement={selectedP.results[domainTab].placement}/>
            </div>
          )}

          {reportTab==="cross"&&(()=>{
            const syn = getSynthesis(selectedP.results);
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
                  {label:"Where Your Patterns Cluster", text:syn.cluster},
                  {label:"Where Tensions Appear", text:syn.tension},
                  {label:"What Development May Look Like", text:syn.development},
                ].map((s,i)=>(
                  <div key={i} style={{marginBottom:24,padding:"20px 22px",background:i===0?C.lightSage:"transparent",borderLeft:`2px solid ${C.slate}`}}>
                    <p style={{fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:C.slate,fontWeight:600,marginBottom:10}}>{s.label}</p>
                    <p style={{fontSize:14,lineHeight:1.85,color:C.nearBlack,fontWeight:300}}>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
            );
          })()}

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
