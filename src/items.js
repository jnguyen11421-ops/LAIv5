// LPP Assessment Items — v17 Universal Prompt Redesign
// BREAKING CHANGES from v16:
//   - Rich narrative SCENARIO_TEXT blocks removed. Each item is now self-contained.
//   - Item tuple: scenarioId field set to null (was a scenario key string).
//   - SCENARIO_UNITS_SOURCE updated: units no longer tied to shared scenarios;
//     items within a domain are paired consecutively. D2, D3, D4 have 5, 5, 6 items
//     respectively, so those domains have one solo unit each (single-item array).
//   - buildShuffledUnits no longer reads SCENARIO_TEXT.
//   - App rendering: remove the scenario text block from the UI.
//     Each unit now renders only its item(s) — forced choice + optional single select.
//   - SCENARIO_TEXT retained as empty object for backward compatibility; remove when app is updated.
//   - Item count: 24 items total (was 20). D2: 5, D3: 5, D4: 6, D1/D5: 4 each.

// ── SCENARIO TEXT ──
const SCENARIO_TEXT = {
  "D1-S1": "You've been working with another senior leader from a different department on a proposal that would significantly expand your team's scope. The idea started with you. Over the past month, you pulled in two of your direct reports and the work became genuinely collaborative. The proposal is strong, and if it lands, it will define your team's role for the next year. Your boss is presenting it to the executive team today without you in the room. You find out because you see the meeting on the calendar. No one told you. Your name is not on the final deck.",

  "D1-S2": "You recently moved into a broader leadership role — one you pursued. You now lead a team of leaders. The hands-on work that built your reputation is no longer yours to do. A direct report is now doing the work you were known for, and by most measures, doing it well. Three months in, you notice that your name comes up less in conversations about the work. You are in more meetings, influencing more decisions, but your fingerprints are harder to find.",

  "D2-S1": "You are in a senior leadership team meeting. A decision has been on the table for three weeks. The data is incomplete, the stakeholders are not fully aligned, and two of your peers have taken opposing positions. Your boss turns to you and asks where you stand. Everyone in the room is waiting.",

  "D2-S2": "Six weeks ago you recommended a course of action to your boss and the senior leadership team. You were confident in the reasoning. The decision was made and the team moved on it. The results are in. It didn't work, and the evidence now points directly back to a flaw in your original analysis — one you didn't see at the time.",

  "D3-S1": "You delegated a high-visibility project to a strong direct report three months ago. You gave them real ownership — you meant it. The project is due to land with your boss and two other senior leaders in two weeks. You've been staying out of it, trusting them to run it. Last week you sat in on a check-in and something felt off. The work is moving, but the judgment calls being made are not the ones you would make. Nothing is broken yet. But if it lands the way it's currently heading, the outcome will reflect on your leadership — and not well.",

  "D3-S2": "Your boss has been pushing you to delegate more. You took it seriously. Three months ago you gave a direct report meaningful ownership over a significant piece of work — more than you would have handed off on your own timeline, but you trusted the direction. The work has been moving. Last week your boss reviewed it and came to you directly. They're not questioning the quality. They're questioning how much you handed off. In their view, you delegated decisions that should have stayed with you — decisions you're still accountable for. This lands as a question about your judgment.",

  "D4-S1": "Your organization has just made a decision that directly affects your team. A restructuring means your team will absorb significant additional workload with no additional headcount. The timeline is immediate. Your team is already stretched. You didn't make this decision — it came from above — but you are the one who has to deliver it and own it in front of your people. Your peers are in the same position. No one pushed back in the room when it was decided.",

  "D4-S2": "Your organization is pushing a significant strategic shift. Senior leadership is aligned and the expectation is that you will carry it forward with your team. Your team is not on board. They've been vocal about it — not in a destructive way, but clearly and directly. They have real concerns, some of which you think are legitimate. Your boss knows your team has reservations. The expectation hasn't changed. You are being asked to lead the charge on something your team doesn't believe in.",

  "D5-S1": "You are in a one-on-one with a direct report who has been strong and reliable. They came in to talk about a project issue. Ten minutes in, something shifts. They're not talking about the project anymore. They're telling you they're not sure this role is right for them, that they feel unseen, and that they don't think you've noticed. The emotion is real. The conversation has moved somewhere you didn't expect and you can see they're not done. You have another meeting in twenty minutes.",

  "D5-S2": "You are running a team meeting. The agenda is full and the group is engaged. Midway through, you hit a topic that's been simmering — a decision that affected one team member more than others. They've been quiet until now. Then they're not. The emotion comes out sharply — not at you directly, but it's in the room. Other team members go still. Everyone is watching to see what you do. The agenda is halfway done and the meeting was already tight.",
};

// ── ASSESSMENT ITEMS ──
// Format:
//   forced: [id, domain, block, type, null, prompt, [A,B,C,D], [orientA,orientB,orientC,orientD]]
//   single: [id, domain, block, type, null, prompt, [A,B,C,D], [orientA,orientB,orientC,orientD]]
//
// scenarioId (index 4) is null in v17 — items carry their own prompt.
// Options are randomized at runtime — orientations travel with their option text as pairs.

const ITEMS_SOURCE = [
  // ── DOMAIN 1: CONTRIBUTION ──
  ["D1-Q1", 1, 1, "forced", null,
    "Work you're responsible for has stalled and the path forward isn't clear. Select the response MOST like you and LEAST like you.",
    ["I get clear on what's actually been tried and what's blocking progress, then form a point of view on what the right next move is.",
     "I map out where the process broke down — what decisions were made, when, and with what information — so we can identify the real source of the problem before we commit to anything new.",
     "I think about who's involved and what they need to hear. I want to have read the situation well enough to lead a productive conversation.",
     "I want to understand the full picture before we problem-solve — what's actually been tried, what constraints are fixed, and what's still unclear."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q2", 1, 2, "single", null,
    "A colleague comes to you stuck and looking for a second opinion. Which response is most like you?",
    ["I get into the details with them. Once I understand what they've actually tried, I usually have a sense of what the next move is.",
     "I ask about their process — how they approached it, what criteria they used, where the gaps might be. The issue is usually in the thinking, not the options.",
     "I think about what kind of support they're actually looking for before I say anything. I ask a few questions to understand the situation and read what would actually be useful.",
     "I try to understand what's making it hard — not just tactically, but what's actually at stake for them. Good advice has to fit the full context."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q3", 1, 3, "forced", null,
    "A deliverable your team owns isn't where it needs to be. Select the response MOST like you and LEAST like you.",
    ["I get directly involved. Whatever needs doing, I roll up my sleeves and do it rather than just pointing at the problem.",
     "I help them get the structure right. Once the logic is sound and the story flows, the rest comes together.",
     "I think about who the audience is and how they're likely to read it. I help calibrate what's being communicated, not just what's being said.",
     "I want to understand what we're actually trying to accomplish before we start fixing. The right move depends on what we're optimizing for."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q4", 1, 4, "single", null,
    "You've been given something significant with real constraints and no clear map. Which response is most like you?",
    ["I get clear on what actually needs to happen and where I need to be personally involved to make sure it goes well.",
     "I start by mapping what needs to happen and in what sequence. A clear structure early on prevents most of the problems that come up later.",
     "I think about the stakeholders — who's involved, what they care about, and where I'll need to build alignment to make this work.",
     "I want to understand the constraints clearly before I start — what's actually fixed, what's flexible, and what trade-offs we're likely to face."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 2: REASONING ──
  ["D2-Q5", 2, 1, "forced", null,
    "The team lands on a recommendation you see differently. Select the response MOST like you and LEAST like you.",
    ["I say what I think. If I see something they're not seeing, I put it on the table — that's what I'm there for.",
     "I ask about their reasoning. I want to understand how they got there before I push back — there may be something in the process I'd want them to revisit.",
     "I pay attention to where the team is before I weigh in. If I push too early or too hard, I'll shut down the conversation rather than open it up.",
     "I ask about what they've considered. If the recommendation doesn't account for something important, that's the conversation worth having."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q6", 2, 2, "single", null,
    "Someone on the team makes a call you think is wrong. Which response is most like you?",
    ["I address it directly. I tell them what I think and why, and we work it out.",
     "I ask how they made the call — what information they were working from, what they considered. That's usually where the gap is.",
     "I think about how I raise this. Getting it right matters as much as being right — a poorly timed pushback can do more damage than the original decision.",
     "I try to understand what led to it before I decide whether it needs to be relitigated. Not every wrong decision is worth reversing."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q7", 2, 3, "forced", null,
    "You disagree with your boss's call. You've already said your piece. Select the response MOST like you and LEAST like you.",
    ["I implement it. I may not agree, but once I've said what I think, it's not my call to make.",
     "I figure out how to execute it in a way that's most likely to work. If it's going to fail, I'd rather it fail cleanly so we can learn something.",
     "I think about how I carry it forward. I want the team to see me supporting the decision without it looking like I've abandoned my own judgment.",
     "I let it go and trust the work to stand on its own. Whether I agreed isn't the determining factor in how well we execute it."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q8", 2, 4, "single", null,
    "A decision is about to be made and you think it's premature. Which response is most like you?",
    ["I say something. I'd rather slow it down and get it right than move fast and clean it up later.",
     "I name what's missing. If we're about to commit without enough information or a clear process, that's worth surfacing.",
     "I read the room before I step in. If the energy is behind this decision, I think about whether this is the moment and the right way to raise it.",
     "I ask what we'd need to feel confident. Often the answer reveals whether we're actually ready or just ready to be done."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q9", 2, 5, "forced", null,
    "Work comes across your desk that isn't up to standard. Select the response MOST like you and LEAST like you.",
    ["I'm direct about what needs to change and specific about why. Vague feedback doesn't help anyone.",
     "I walk them through the gaps systematically. I want them to understand not just what to fix, but where the thinking broke down.",
     "I think about how this person receives feedback before I deliver it. The goal is for it to land in a way they can actually use.",
     "I ask about their process before I give feedback. Sometimes what looks like a quality issue is a resource or clarity issue."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 3: AUTHORITY ──
  ["D3-Q10", 3, 1, "forced", null,
    "You're being pushed to move faster than you think is wise. Select the response MOST like you and LEAST like you.",
    ["I push back. If moving faster is going to create problems I'll have to fix later, I say so.",
     "I map out what's at risk if we skip steps. The pressure usually exists for real reasons — I want to figure out what we can actually move on without compromising the rest.",
     "I think about where the pressure is coming from and what's driving it. How I respond to this will shape how I'm read — I want to push back in a way that lands as thoughtful rather than resistant.",
     "I try to understand what's actually urgent and what just feels urgent. Those are usually different things."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q11", 3, 2, "single", null,
    "Your instinct conflicts with what the data shows. Which response is most like you?",
    ["I trust my read. Data tells you what happened; it doesn't always tell you what to do. I've been in enough situations to know when something isn't adding up.",
     "I look at how the data was gathered before I trust it. Methodology matters — if there's a flaw in the process, the output can't carry the weight we're putting on it.",
     "I think about how I communicate this. If I override the data without explaining my reasoning, I lose credibility even if I'm right — I need to bring people along.",
     "I sit with both. If my instinct and the data are pointing in different directions, that tension is telling me something. I want to understand it before I act."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q12", 3, 3, "forced", null,
    "A call you made isn't working and the team is watching. Select the response MOST like you and LEAST like you.",
    ["I own it and move quickly. I made the call, it's not working, and the most important thing now is what we do next.",
     "I diagnose before I pivot. I want to understand why it didn't work before we change course — otherwise we might make the same mistake differently.",
     "I think about how I handle this in front of the team. How I respond will signal something about the kind of leader I am — I want to own it in a way that builds rather than erodes trust.",
     "I want to understand what the breakdown is revealing before we change course. Sometimes a decision not working is information about the situation, not evidence the decision was wrong."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q13", 3, 4, "single", null,
    "Someone with more authority makes a decision that will create real problems for your team. Which response is most like you?",
    ["I flag it. I don't wait for problems to materialize — I go directly to the source and lay out what I'm seeing.",
     "I document the risks clearly and make sure the right people have seen the analysis. If things go sideways, the concern should already be on record.",
     "I think about how to raise it in a way that actually gets heard. Going in too hard can put the other person on the defensive — I want them to engage with the problem, not react to the challenge.",
     "I distinguish between problems I can work around and problems I actually need to surface. Not every upstream decision requires escalation."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q14", 3, 5, "forced", null,
    "A decision needs to be made and the room is politically complicated. Select the response MOST like you and LEAST like you.",
    ["I say what I think the right call is. I'm not going to sit on my read because the room is complicated.",
     "I try to structure the conversation — what do we actually need to decide, what information do we have, and who needs to weigh in. That creates enough clarity to move.",
     "I read the room carefully. In a politically complicated space, how I enter the conversation matters as much as what I say.",
     "I focus on what the decision actually requires rather than what the dynamics seem to demand. Those are often different."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 4: LOYALTY ──
  ["D4-Q15", 4, 1, "forced", null,
    "Your team is being asked to take on more than they can reasonably handle. Select the response MOST like you and LEAST like you.",
    ["I push back on behalf of the team. I'm not going to let them get buried because no one said anything.",
     "I map out what's actually on the team's plate and what's realistic, and I bring that picture to the conversation. This needs to be a structured ask, not just a complaint.",
     "I think about how to raise this in a way that gets traction. If I come in too hard, I become the problem — I need to make the case in a way that actually lands.",
     "I figure out what we can absorb and what we genuinely can't, and I'm honest about both. The goal isn't to protect the team from all hard things — it's to make sure the hard things are worth it."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q16", 4, 2, "single", null,
    "A strong team member tells you they're thinking about leaving. Which response is most like you?",
    ["I have a direct conversation. I want to know what's actually driving it and whether there's something I can do about it.",
     "I think about what the system has or hasn't provided them. If someone strong is leaving, there's usually something structural — role clarity, growth path, recognition — worth examining.",
     "I pay attention to how I show up in this conversation. If they're sharing this with me, they're deciding whether to trust me with it — I want to respond in a way that honors that.",
     "I get curious. I want to understand what's pulling them toward leaving — not to talk them out of it, but to actually understand what's true for them."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q17", 4, 3, "forced", null,
    "Your team's morale has been low and it's been going on for a while. Select the response MOST like you and LEAST like you.",
    ["I name it directly and move toward action. I don't wait for morale to sort itself out.",
     "I look for the structural source — unclear expectations, insufficient resources, lack of visibility into how their work connects to something bigger. Morale problems usually have diagnosable causes.",
     "I think about who I need to connect with and in what order. Some people are carrying this differently than others — I want to understand the landscape before I address the whole team.",
     "I try to understand what's actually driving it before I respond. Surface-level fixes to morale problems rarely hold."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q18", 4, 4, "single", null,
    "Someone on your team made a significant mistake and the team knows. Which response is most like you?",
    ["I address it quickly and directly — with the person, and with the team if needed. Letting it sit doesn't help anyone.",
     "I distinguish between the immediate issue and the systemic one. Was this a one-off or is there something in the process that made this more likely?",
     "I think about how I handle this publicly. How I respond to mistakes tells the team something about what's safe — I want to get that signal right.",
     "I make sure I understand what actually happened before I respond. The story the team has may not be the full story."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q19", 4, 5, "forced", null,
    "Your team did strong work and the credit is going elsewhere. Select the response MOST like you and LEAST like you.",
    ["I make sure my team's contribution is visible. I'm not going to let the record stand wrong.",
     "I document what was done and by whom. If credit is getting misattributed, a clear record protects the team better than advocacy in the moment.",
     "I think about how I advocate in a way that's effective rather than just reactive. Going in too hot can make it about me rather than the team — I want the work to be what speaks.",
     "I'm more interested in whether the work takes hold than whether the credit does. Recognition tends to work itself out over time."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q20", 4, 6, "single", null,
    "You're being asked to implement a decision you think is bad for your team. Which response is most like you?",
    ["I say what I think before I implement it. My job isn't to execute blindly — it's to make sure the right information is in the room before a decision is locked.",
     "I try to understand the full reasoning before I push back. There may be constraints or context I don't have — the picture I have may be incomplete.",
     "I think about whether this is the moment to push and how to do it in a way that gets heard. Not every hill is worth the credibility it costs to die on.",
     "I hold both realities — that I have real concerns and that this may still be the right call given constraints I can't fully see. I raise what I see and then let the people with the full picture decide."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 5: PRESENCE ──
  ["D5-Q21", 5, 1, "forced", null,
    "Someone says something that shifts the emotional weight of a conversation. Select the response MOST like you and LEAST like you.",
    ["I address it directly. I name what I'm hearing and move the conversation toward what needs to happen.",
     "I give the conversation structure. I reflect back what I understand and make sure we work through it together rather than let it sit unexamined.",
     "Something shifts in me. I'm aware this is a moment I need to get right, and I start thinking about what I should say to make sure they feel genuinely heard and that I'm taking this seriously.",
     "I stay with it. I'm curious about what's underneath — not to fix it, but to actually understand what's true for them."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q22", 5, 2, "single", null,
    "A conversation ends before it's resolved and you're out of time. Which response is most like you?",
    ["I close it out. I acknowledge what I've heard, make a clear commitment to follow up, and move to my next meeting.",
     "I name where we are — what's been said, what's still open, and when we'll pick it back up — before I leave.",
     "I'm conscious of how I end this. I don't want to leave in a way that makes things worse — I want them to feel I took this seriously, and I'm thinking about how to make that clear before I go.",
     "I don't force a close simply because time is up. I make the decision based on what the conversation actually needs rather than the schedule."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q23", 5, 3, "forced", null,
    "Emotion surfaces sharply in a group setting and the room goes still. Select the response MOST like you and LEAST like you.",
    ["I address it directly and move the conversation forward.",
     "I give the moment structure. I name what's in the room and make sure the conversation has enough container to hold it.",
     "I'm tracking the whole room — who's activated, everyone else watching, how I'm coming across — and I make sure my response lands as both caring and steady.",
     "I don't move to contain it. I let it be in the room for a moment — what's here is real and the group can hold it."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q24", 5, 4, "single", null,
    "Something real just happened in the room and everyone is waiting to see how you respond. Which response is most like you?",
    ["I move us forward. I acknowledge the moment and bring the group back to the work.",
     "I name where we are — what's in the room, what it means for the work, and what happens next.",
     "I choose my words carefully. I want to acknowledge what happened genuinely while also giving the group a way forward — I'm aware of how this moment is being read.",
     "I don't rush the transition. I want to understand what it's revealing before we move past it."],
    ["outcome", "process", "identity", "system"]],
];

// ── SCENARIO UNITS ──
// v17: units are no longer tied to shared narrative scenarios.
// Items are paired consecutively within each domain.
// D2, D3, D4 have an odd item each — those domains have one solo unit (items array length 1).
// Within-domain unit order shuffles at load time.
const SCENARIO_UNITS_SOURCE = [
  // Domain 1
  { unitId: "D1-U1", domain: 1, items: ["D1-Q1", "D1-Q2"] },
  { unitId: "D1-U2", domain: 1, items: ["D1-Q3", "D1-Q4"] },
  // Domain 2
  { unitId: "D2-U1", domain: 2, items: ["D2-Q5", "D2-Q6"] },
  { unitId: "D2-U2", domain: 2, items: ["D2-Q7", "D2-Q8"] },
  { unitId: "D2-U3", domain: 2, items: ["D2-Q9"] },
  // Domain 3
  { unitId: "D3-U1", domain: 3, items: ["D3-Q10", "D3-Q11"] },
  { unitId: "D3-U2", domain: 3, items: ["D3-Q12", "D3-Q13"] },
  { unitId: "D3-U3", domain: 3, items: ["D3-Q14"] },
  // Domain 4
  { unitId: "D4-U1", domain: 4, items: ["D4-Q15", "D4-Q16"] },
  { unitId: "D4-U2", domain: 4, items: ["D4-Q17", "D4-Q18"] },
  { unitId: "D4-U3", domain: 4, items: ["D4-Q19", "D4-Q20"] },
  // Domain 5
  { unitId: "D5-U1", domain: 5, items: ["D5-Q21", "D5-Q22"] },
  { unitId: "D5-U2", domain: 5, items: ["D5-Q23", "D5-Q24"] },
];

// Randomize options within each item at load time, preserving orient pairing.
// scenarioId (index 4) is null in v17 but preserved in tuple for structural compatibility.
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
// v17: scenarioText is null — remove scenario text rendering from the app.
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
