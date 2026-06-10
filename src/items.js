// LPP Assessment Items — v18 Restoration
// This version reverts the v17 "Universal Prompt Redesign," which replaced the
// original 20 scenario-grounded items with 24 generic, self-contained items and
// new (unreviewed) response options. That rewrite was out of scope.
//
// v18 restores the structure and content from the approved item audit
// (LPP_Item_Audit_Rewrites.docx):
//   - 20 items total (D1-D5: 4 items each).
//   - Original item prompts preserved exactly as audited — each prompt is a
//     short, self-contained scenario beat (no separate SCENARIO_TEXT blocks).
//   - Response options updated to the audit's "Proposed Rewrite" column only.
//     Orientations, prompts, and item order are unchanged from the audited set.
//   - scenarioId remains null — items are self-contained, consistent with how
//     they were audited and approved.
//   - Items renumbered sequentially per domain (D1-Q1..4, D2-Q5..8, D3-Q9..12,
//     D4-Q13..16, D5-Q17..20) for clarity. Content maps 1:1 to the audited
//     D1-Q1..Q4, D2-Q6..Q9, D3-Q11..Q14, D4-Q16..Q19, D5-Q21..Q24.
//
// Domain framing (for reference, not rendered):
//   D1 — As Visibility Shifts      | Tension: Visibility ↔ Impact
//   D2 — As Certainty Fades        | Tension: Correctness ↔ Transparency
//   D3 — As Control Decreases      | Tension: Direct Control ↔ System Trust
//   D4 — As Priorities Diverge     | Tension: Your People ↔ The Whole
//   D5 — As the Moment Intensifies | Tension: Reaction ↔ Curiosity

// ── SCENARIO TEXT ──
// Items are self-contained per the approved audit. Retained as empty object
// for structural compatibility with the app's rendering code.
const SCENARIO_TEXT = {};

// ── ASSESSMENT ITEMS ──
// Format:
//   forced: [id, domain, block, type, null, prompt, [A,B,C,D], [orientA,orientB,orientC,orientD]]
//   single: [id, domain, block, type, null, prompt, [A,B,C,D], [orientA,orientB,orientC,orientD]]
//
// Options are randomized at runtime — orientations travel with their option text as pairs.

const ITEMS_SOURCE = [
  // ── DOMAIN 1: VISIBILITY ──
  ["D1-Q1", 1, 1, "forced", null,
    "Your boss is in that room right now. You have about ten minutes before the presentation starts. Select the response MOST like you and LEAST like you.",
    ["I call my boss. Ten minutes is enough to at least get on the same page before they're in the room.",
     "I open the deck and go through it. If the structure is off, I want to know before it gets in front of that group.",
     "I check whether my name is on it. If it's not, that's a conversation I need to have with my boss — just not right now.",
     "I don't do anything. Either the argument is solid enough to survive the room on its own, or it isn't."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q2", 1, 2, "single", null,
    "A peer mentions in passing that the co-author is getting most of the recognition for the proposal. Which response is most like you?",
    ["I figure out how to correct it. If this is a pattern, it'll matter over time.",
     "My first thought isn't about credit — it's whether whoever's running with this actually understands how the argument was built.",
     "I think about what to say. I don't want to sound like I'm fighting over credit, but I also don't want to say nothing.",
     "I don't do much with it. If the work holds up, that's usually what ends up mattering."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q3", 1, 3, "forced", null,
    "A senior colleague asks what you're working on. You start to answer and realize you're describing work your team is doing, not work you're doing yourself. Select the response MOST like you and LEAST like you.",
    ["I find a way back into the work. I'd rather be close to the output than one step removed from it.",
     "I redirect — I talk about what I'm holding, what decisions are going through me, what the team is working from.",
     "I feel the gap between what I'm describing and what I'm actually doing. I'm not sure I've figured out how to talk about this role yet.",
     "I don't try to fix the answer. This is what the role is now. My influence doesn't have to look the same as it used to."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q4", 1, 4, "single", null,
    "Your direct report gets recognized publicly for work that came directly out of your coaching and direction. Your contribution isn't mentioned. Which response is most like you?",
    ["I'm glad it landed. And I make sure I'm more directly in the next phase.",
     "I take it as a good sign — the team is doing the work without needing my name on it. That's what I was building toward.",
     "I want to acknowledge them publicly, but at some point my boss needs to know where this work is actually coming from.",
     "It doesn't have to come back to me. The work is what it is."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 2: CERTAINTY ──
  ["D2-Q5", 2, 1, "forced", null,
    "You have thirty seconds before the silence becomes its own answer. Select the response MOST like you and LEAST like you.",
    ["I take a position. We have enough. The longer we sit here, the more this costs us.",
     "I start talking through where I actually am. I'm not ready to give a clean answer — I'd rather show my thinking than manufacture certainty.",
     "I take a beat and read the room. I want a sense of who's already dug in before I put myself out there.",
     "I say what I'm still working through. I'm not going to manufacture certainty I don't have just because the room is waiting."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q6", 2, 2, "single", null,
    "After the meeting, a peer tells you your reasoning was hard to follow. You replay the conversation in your head. Which response is most like you?",
    ["I wonder if I overthought it. Maybe I should have just led with a call rather than all the reasoning.",
     "I go back through it. If it was hard to follow, there's a gap somewhere — I need to find where.",
     "I replay it. I know what I was trying to say — I'm trying to figure out where I lost them.",
     "I take it seriously. If it was hard to follow, that might be telling me something about the thinking itself — not just how I explained it."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q7", 2, 3, "forced", null,
    "Your boss asks you to come back to the leadership team and walk them through what happened. Select the response MOST like you and LEAST like you.",
    ["I focus on what's next. I'd rather spend ten minutes on what went wrong and the rest on what we do about it.",
     "I go back through it before I'm in front of anyone. I need to know exactly where the reasoning failed.",
     "I think carefully about how to walk them through it. I need to be honest about what went wrong without it reading like I didn't know what I was doing.",
     "I go in prepared to be direct about it. If there was a flaw in the analysis, I'd rather name it plainly than have someone else find it."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q8", 2, 4, "single", null,
    "Privately, a trusted peer asks you what you think actually went wrong. Which response is most like you?",
    ["I tell them what I'd do differently. And then I'm ready to move. I don't need to keep going over it.",
     "I want to walk through the whole thing again. I haven't found the exact point where it went sideways and I need to before I can move on.",
     "I'm honest — but I'm aware that what I say here is going to be part of how they see my judgment going forward.",
     "I tell them where I still have questions. I don't have a clean explanation yet and I'm not going to act like I do."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 3: CONTROL ──
  ["D3-Q9", 3, 1, "forced", null,
    "The work is not yours anymore, but the outcome still is. Select the response MOST like you and LEAST like you.",
    ["I step back in. I'd rather deal with the awkwardness of that than let this land the way it's heading.",
     "I set up a review — not to take it over, but to have enough visibility before it goes out to know what I'm standing behind.",
     "I think about how to step in without making it look like I've walked back the delegation. I made that call in front of the team.",
     "I don't touch the work itself. I sit down with them and ask them to walk me through what's driving the calls they're making."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q10", 3, 2, "single", null,
    "The project lands. The senior leaders have questions about some of the judgment calls. Your direct report is in the room. Your boss looks at you. Which response is most like you?",
    ["I answer. This is on me — I'm not going to sit there while they field it.",
     "I explain how we structured the decisions and where the handoffs were. If something wasn't clear enough in the process, that's worth naming.",
     "I step in, but I leave room for them to add to it. I don't want it to look like I'm covering for them, and I don't want it to look like I was out of the loop.",
     "I let them answer. I'm accountable for the outcome, but this is their work — and the room should know that."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q11", 3, 3, "forced", null,
    "Your boss has raised it. Your direct report doesn't know yet. Select the response MOST like you and LEAST like you.",
    ["I pull back some of what I handed off. If this is how it's landing with my boss, the delegation went too far.",
     "I map out what I handed off and what I kept, so I can walk my boss through the reasoning before I decide what to change.",
     "I think through what to say to my boss. I need to show I understand the concern — but without making it sound like I've been out of the loop.",
     "I ask my boss to say more before I change anything. If what I handed off isn't what they expected, I need to understand that gap first."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q12", 3, 4, "single", null,
    "You now have to decide what to do with your direct report. Which response is most like you?",
    ["I take back the decisions that should have stayed with me. The delegation was wrong and I need to correct it.",
     "I sit down with them and redraw the line — what's theirs, what's mine, and what comes back through me from here.",
     "I think about how to have this conversation without it landing as a withdrawal of confidence. I gave them real ownership — I don't want this to feel like I'm taking it back.",
     "I'm honest with them — including about where my own judgment fell short. I handed them something I maybe wasn't ready to hand off, and that's on me too."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 4: PRIORITIES ──
  ["D4-Q13", 4, 1, "forced", null,
    "You are about to meet with your team to deliver the news. Select the response MOST like you and LEAST like you.",
    ["I decide where I stand before I walk in. If the cost is real, I'm going to say so directly.",
     "I think through how to lay it out. I want them to understand the reasoning, what's changing, and what they need to do differently — in that order.",
     "I think about how to deliver this honestly without it sounding like I'm throwing the organization under the bus.",
     "I don't dress it up. I tell them what I know about what's driving it and give them space to react. I'm not trying to manage the reaction."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q14", 4, 2, "single", null,
    "After the meeting, a team member comes to you privately and says the workload increase isn't sustainable. They're right. Which response is most like you?",
    ["I go back up and push on it. If this isn't sustainable, that conversation needs to happen above me.",
     "I work through it with them — what the work actually requires, what's realistic, and what we'd have to drop or move. I want it on paper.",
     "I tell them I hear it. I'm honest about what I can actually do from here — and I'm careful not to make promises in the moment I can't keep.",
     "I don't try to make it better than it is. They're right, and the decision isn't changing. I stay in the conversation without trying to resolve it."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q15", 4, 3, "forced", null,
    "You are meeting with your boss to discuss how you'll move this forward with your team. Select the response MOST like you and LEAST like you.",
    ["I lay it out directly. My team isn't on board, the cost is real, and I want that named before we get into rollout.",
     "I focus on the rollout — what's locked, what there's still room to adjust, and how I'll surface concerns as they come up.",
     "I think about how to hold both. I need my boss to know I'll carry this, and I need my team to know I'm not pretending it's easy.",
     "I give my boss the full picture — including what this will cost my team. I'm not changing the direction, but I'm not going in with a rosier version of it either."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q16", 4, 4, "single", null,
    "You bring the priority to your team. The pushback is immediate and pointed. A respected team member says directly: \"I don't think you actually believe in this either.\" Which response is most like you?",
    ["I answer directly. I tell them where I actually stand and that we're moving forward regardless.",
     "I redirect to specifics — what's on the table and what isn't. I want to separate real concerns from ones about a decision that's already been made.",
     "I take a beat. The rest of the room is watching and what I say next is going to shape how the rest of this conversation goes.",
     "I don't deflect it. There's something true in what they said and I'd rather acknowledge that than talk past it."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 5: PRESENCE ──
  ["D5-Q17", 5, 1, "forced", null,
    "They've just said something that lands harder than anything else in the conversation. The room is quiet. Select the response MOST like you and LEAST like you.",
    ["I respond to it. I name what I just heard and ask what they need from me right now.",
     "I slow it down. I ask a question — not to redirect, but to make sure I understand what they're actually telling me before I respond.",
     "I'm aware that how I respond in the next few seconds is going to determine whether this opens or closes.",
     "I don't move to fix it or reframe it. I stay with what they said. I want to understand what's underneath it before I do anything."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q18", 5, 2, "single", null,
    "The twenty minutes is up. The conversation isn't resolved. They're still in it emotionally. Your next meeting is with your boss. Which response is most like you?",
    ["I wrap it up. I tell them I heard them, I'll follow up, and I have to go.",
     "I name where we are — what got said, what's still open, and when we're coming back to it. I want them to know it isn't just being dropped.",
     "I'm thinking about how this ends for them. I don't want to walk out and leave them feeling like I just handled a situation.",
     "I don't push to a close. If the conversation needs more time, I weigh in the moment whether the next meeting can slide."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q19", 5, 3, "forced", null,
    "The room is waiting. The team member is still visibly activated. Select the response MOST like you and LEAST like you.",
    ["I address it. I acknowledge what just happened and move the group forward — it doesn't need to derail everything.",
     "I slow the meeting down. I name what just happened and give it a few minutes before I try to move on.",
     "I'm aware the group is watching me. I don't want to overreact, but I also don't want to brush past it.",
     "I don't move to contain it. Something just surfaced and I'm not ready to say what it means yet. I give it room."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q20", 5, 4, "single", null,
    "The team member has said what they needed to say. The room is still quiet. The emotion hasn't fully left. Which response is most like you?",
    ["I acknowledge it and move us forward. The work is still there and we need to get back to it.",
     "I name where we are — what just happened, what's still open, what we're doing next.",
     "I'm careful about the next thing I say. The room is still in it and I don't want to misdirect it.",
     "I don't rush it. Something real just happened in this room and I'd rather give it a moment than move past it too fast."],
    ["outcome", "process", "identity", "system"]],
];

// ── SCENARIO UNITS ──
// Items are paired consecutively within each domain (forced choice + single select).
// Within-domain unit order shuffles at load time.
const SCENARIO_UNITS_SOURCE = [
  // Domain 1
  { unitId: "D1-U1", domain: 1, items: ["D1-Q1", "D1-Q2"] },
  { unitId: "D1-U2", domain: 1, items: ["D1-Q3", "D1-Q4"] },
  // Domain 2
  { unitId: "D2-U1", domain: 2, items: ["D2-Q5", "D2-Q6"] },
  { unitId: "D2-U2", domain: 2, items: ["D2-Q7", "D2-Q8"] },
  // Domain 3
  { unitId: "D3-U1", domain: 3, items: ["D3-Q9", "D3-Q10"] },
  { unitId: "D3-U2", domain: 3, items: ["D3-Q11", "D3-Q12"] },
  // Domain 4
  { unitId: "D4-U1", domain: 4, items: ["D4-Q13", "D4-Q14"] },
  { unitId: "D4-U2", domain: 4, items: ["D4-Q15", "D4-Q16"] },
  // Domain 5
  { unitId: "D5-U1", domain: 5, items: ["D5-Q17", "D5-Q18"] },
  { unitId: "D5-U2", domain: 5, items: ["D5-Q19", "D5-Q20"] },
];

// Randomize options within each item at load time, preserving orient pairing.
// scenarioId (index 4) is null — items are self-contained.
function shuffleItem(item) {
  const [id, domain, block, type, scenarioId, prompt, options, orients] = item;
  const pairs = options.map((opt, i) => ({ opt, orient: orients[i] }));
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return [id, domain, block, type, scenarioId, prompt,
    pairs.map(p => p.opt),
    pairs.map(p => p.orient)
  ];
}

// Shuffle the order of units within each domain at load time.
// Domain order is fixed: D1 → D2 → D3 → D4 → D5.
// Within-unit item order is fixed: forced choice always index 0, single select always index 1.
function buildShuffledUnits() {
  const itemMap = {};
  ITEMS_SOURCE.forEach(item => { itemMap[item[0]] = shuffleItem(item); });

  const domains = [1, 2, 3, 4, 5];
  const result = [];

  domains.forEach(domain => {
    const domainUnits = SCENARIO_UNITS_SOURCE.filter(u => u.domain === domain);
    for (let i = domainUnits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [domainUnits[i], domainUnits[j]] = [domainUnits[j], domainUnits[i]];
    }
    domainUnits.forEach(unit => {
      result.push({
        unitId: unit.unitId,
        domain: unit.domain,
        scenarioText: null,
        items: unit.items.map(id => itemMap[id]),
      });
    });
  });

  return result;
}

const ITEMS = ITEMS_SOURCE.map(shuffleItem);
const SCENARIO_UNITS_SHUFFLED = buildShuffledUnits();

export { ITEMS_SOURCE, ITEMS, SCENARIO_TEXT, SCENARIO_UNITS_SHUFFLED };
