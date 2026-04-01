// LPP Assessment Items
// Format: [id, domain, block, type, scenario, prompt, [options], [orientations]]

// ── ASSESSMENT ITEMS ──
// Format:
//   forced: [id, domain, block, "forced", scenario, prompt, [A,B,C,D], [orientA,orientB,orientC,orientD]]
//   single: [id, domain, block, "single", scenario, prompt, [A,B,C,D], [orientA,orientB,orientC,orientD]]
//
// Options are randomized at runtime — orientations travel with their option text as pairs.
// Answer key positions (A/B/C/D) reflect the CANONICAL order for the key document only.

const ITEMS_SOURCE = [
  // ── DOMAIN 1: CONTRIBUTION ──
  ["D1-Q1", 1, 1, "forced",
    "You've been working with another senior leader from a different department on a proposal that would significantly expand your team's scope. The idea started with you. Over the past month, you pulled in two of your direct reports and the work became genuinely collaborative. The proposal is strong, and if it lands, it will define your team's role for the next year. Your boss is presenting it to the executive team today without you in the room. You find out because you see the meeting on the calendar. No one told you. Your name is not on the final deck.",
    "Your boss is in that room right now. You have about ten minutes before the presentation starts. Select the response MOST like you and LEAST like you.",
    ["I reach out to my boss directly. I want to make sure the work is being represented the way I would present it.",
     "I pull up the deck and scan it to see if the framing and sequencing still reflect how we built the argument.",
     "I check whether the co-author's name is on it and start thinking about how this is going to be read if mine isn't there.",
     "I let it go. If the thinking is sound, it will land — with or without my name on it."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q2", 1, 2, "single",
    "You've been working with another senior leader from a different department on a proposal that would significantly expand your team's scope. The idea started with you. Over the past month, you pulled in two of your direct reports and the work became genuinely collaborative. The proposal is strong, and if it lands, it will define your team's role for the next year. Your boss is presenting it to the executive team today without you in the room. You find out because you see the meeting on the calendar. No one told you. Your name is not on the final deck.",
    "A peer mentions in passing that the co-author is getting most of the recognition for the proposal. Which response is most like you?",
    ["I want to correct the record. If this isn't attributed accurately, it changes how my team and I are seen going forward.",
     "I'm less concerned about credit and more focused on whether the implementation will actually follow the logic we built into it.",
     "I'm already thinking about how to respond in a way that acknowledges them and still makes my role clear.",
     "Credit tends to sort itself out over time. What matters is whether the work holds up."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q3", 1, 3, "forced",
    "You recently moved into a broader leadership role — one you pursued. You now lead a team of leaders. The hands-on work that built your reputation is no longer yours to do. A direct report is now doing the work you were known for, and by most measures, doing it well. Three months in, you notice that your name comes up less in conversations about the work. You are in more meetings, influencing more decisions, but your fingerprints are harder to find.",
    "A senior colleague asks what you're working on. You start to answer and realize you're describing work your team is doing, not work you're doing yourself. Select the response MOST like you and LEAST like you.",
    ["I find ways to stay closer to the actual work. I want my thinking directly shaping what gets produced.",
     "I shift the conversation to how the work is being run and the decisions I'm shaping behind it.",
     "I want to make sure I'm describing my role in a way that still feels real and credible.",
     "I sit with the discomfort of it. This is what the role is. Influence doesn't have to be visible to be real."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q4", 1, 4, "single",
    "You recently moved into a broader leadership role — one you pursued. You now lead a team of leaders. The hands-on work that built your reputation is no longer yours to do. A direct report is now doing the work you were known for, and by most measures, doing it well. Three months in, you notice that your name comes up less in conversations about the work. You are in more meetings, influencing more decisions, but your fingerprints are harder to find.",
    "Your direct report gets recognized publicly for work that came directly out of your coaching and direction. Your contribution isn't mentioned. Which response is most like you?",
    ["I'm glad the work landed — and I find a way to stay involved so the next phase reflects my thinking more directly.",
     "I take it as a signal that the structure is working. This is what it should look like when the system is set up well.",
     "I'm already thinking about how to respond in a way that acknowledges them and still makes my role clear.",
     "It doesn't need to come back to me. The work stands on its own."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 2: REASONING ──
  ["D2-Q6", 2, 1, "forced",
    "You are in a senior leadership team meeting. A decision has been on the table for three weeks. The data is incomplete, the stakeholders are not fully aligned, and two of your peers have taken opposing positions. Your boss turns to you and asks where you stand. Everyone in the room is waiting.",
    "You have thirty seconds before the silence becomes its own answer. Select the response MOST like you and LEAST like you.",
    ["I take a position. We have enough to move. The cost of more deliberation is higher than the cost of an imperfect call.",
     "I walk through my thinking out loud before I commit to a position. I'm not ready to land until it all hangs together.",
     "I read the room before I speak. I want to know what will be seen as credible before I put my position on the table.",
     "I say where my thinking is, including what I'm still not sure about. I'm not going to force a conclusion before the assumptions are clear."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q7", 2, 2, "single",
    "You are in a senior leadership team meeting. A decision has been on the table for three weeks. The data is incomplete, the stakeholders are not fully aligned, and two of your peers have taken opposing positions. Your boss turns to you and asks where you stand. Everyone in the room is waiting.",
    "After the meeting, a peer tells you your reasoning was hard to follow. You replay the conversation in your head. Which response is most like you?",
    ["I think about what I should have said to land the point more cleanly — and how this came across to the people in the room.",
     "I go back through the argument to find where the logic broke down. If it was hard to follow, something wasn't fully worked through.",
     "I'm less concerned about how it landed. I think about whether I should have taken a clearer position and moved things forward.",
     "I consider whether the feedback actually points to something in my thinking — or whether the reasoning itself still holds."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q8", 2, 3, "forced",
    "Six weeks ago you recommended a course of action to your boss and the senior leadership team. You were confident in the reasoning. The decision was made and the team moved on it. The results are in. It didn't work, and the evidence now points directly back to a flaw in your original analysis — one you didn't see at the time.",
    "Your boss asks you to come back to the leadership team and walk them through what happened. Select the response MOST like you and LEAST like you.",
    ["I focus on what we learned and where we go from here. I want to get us moving again.",
     "I go back through the original analysis line by line to find exactly where the logic broke down before I present it.",
     "I think carefully about how to present this so it still comes across as sound, even given the outcome.",
     "I go in willing to show the flaw openly, including what I was assuming that turned out to be wrong."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q9", 2, 4, "single",
    "Six weeks ago you recommended a course of action to your boss and the senior leadership team. You were confident in the reasoning. The decision was made and the team moved on it. The results are in. It didn't work, and the evidence now points directly back to a flaw in your original analysis — one you didn't see at the time.",
    "Privately, a trusted peer asks you what you think actually went wrong. Which response is most like you?",
    ["I tell them where I think the call went wrong and what I'd do differently, then I'm ready to move forward.",
     "I walk them through the logic again. I need to find the exact point where the reasoning failed before I can put it down.",
     "I'm honest with them, but I'm also aware this is someone who will form an opinion about my judgment based on what I say.",
     "I tell them what I've been working through, including the assumptions I made and what I'm still testing in my thinking."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 3: AUTHORITY ──
  ["D3-Q11", 3, 1, "forced",
    "You delegated a high-visibility project to a strong direct report three months ago. You gave them real ownership — you meant it. The project is due to land with your boss and two other senior leaders in two weeks. You've been staying out of it, trusting them to run it. Last week you sat in on a check-in and something felt off. The work is moving, but the judgment calls being made are not the ones you would make. Nothing is broken yet. But if it lands the way it's currently heading, the outcome will reflect on your leadership — and not well.",
    "The work is not yours anymore, but the outcome still is. Select the response MOST like you and LEAST like you.",
    ["I step back in. I need my judgment in the work before it lands.",
     "I set up a structured review before it goes out — clear checkpoints, decision clarity, and enough visibility to see where it's heading.",
     "I think about how to get involved without undermining them or making it look like I've lost confidence in my delegation.",
     "I stay out of the content and have a direct conversation about the judgment behind the work — what assumptions are driving it and what needs to be reconsidered."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q12", 3, 2, "single",
    "You delegated a high-visibility project to a strong direct report three months ago. You gave them real ownership — you meant it. The project is due to land with your boss and two other senior leaders in two weeks. You've been staying out of it, trusting them to run it. Last week you sat in on a check-in and something felt off. The work is moving, but the judgment calls being made are not the ones you would make. Nothing is broken yet. But if it lands the way it's currently heading, the outcome will reflect on your leadership — and not well.",
    "The project lands. The senior leaders have questions about some of the judgment calls. Your direct report is in the room. Your boss looks at you. Which response is most like you?",
    ["I answer directly. These are my calls to own. I step in and address it.",
     "I address how the work was structured and where the decision points should have been clearer, so the accountability is traceable.",
     "I answer in a way that protects them while making sure this still reads as under control.",
     "I let them answer first. This is their work. I step in only if something critical is being missed."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q13", 3, 3, "forced",
    "A direct report is six weeks into leading a piece of work you gave them full ownership over. They're capable — you've seen it. But the last three check-ins have left you uneasy. They're making decisions, but the decisions feel tentative. The work isn't off track, but it's not as sharp as it needs to be. You haven't seen anything you could point to and call wrong. You just know that if you were running it, it would be further along and the thinking would be tighter. Nothing has broken. No one else has noticed. But you're watching it closely.",
    "You have another check-in tomorrow. The work is theirs. The outcome is still yours. Select the response MOST like you and LEAST like you.",
    ["I come in with specific input on the decisions I'm watching. My judgment needs to be in the work.",
     "I restructure the check-in — tighter agenda, clearer decision points, and explicit criteria for what needs to land by when.",
     "I think about how to engage without signaling doubt in them or making it look like I'm hovering.",
     "I ask about the assumptions behind the decisions rather than the decisions themselves. I want to understand what's driving the tentativeness before I do anything."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q14", 3, 4, "single",
    "A direct report is six weeks into leading a piece of work you gave them full ownership over. They're capable — you've seen it. But the last three check-ins have left you uneasy. They're making decisions, but the decisions feel tentative. The work isn't off track, but it's not as sharp as it needs to be. You haven't seen anything you could point to and call wrong. You just know that if you were running it, it would be further along and the thinking would be tighter. Nothing has broken. No one else has noticed. But you're watching it closely.",
    "Two weeks later, the work is still moving but still not sharp enough. You're now deciding whether to step in more directly. Which response is most like you?",
    ["I step in. The work reflects on me and it's not where it needs to be. I correct it directly.",
     "I add more structure — clearer milestones, more frequent check-ins, and explicit sign-off points before key decisions move forward.",
     "I think about how stepping in will land and I calibrate accordingly.",
     "I stay with the discomfort and give it more time. If the system is still holding, stepping in now creates a problem that isn't there yet."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 4: LOYALTY ──
  ["D4-Q16", 4, 1, "forced",
    "Your organization has just made a decision that directly affects your team. A restructuring means your team will absorb significant additional workload with no additional headcount. The timeline is immediate. Your team is already stretched. You didn't make this decision — it came from above — but you are the one who has to deliver it and own it in front of your people. Your peers are in the same position. No one pushed back in the room when it was decided.",
    "You are about to meet with your team to deliver the news. Select the response MOST like you and LEAST like you.",
    ["I'm clear on where I stand before I walk in. If there's real cost to my team, I'll name it myself.",
     "I think through how to lay this out so the tradeoffs are clear, the rationale is explicit, and what changes in the work is concrete.",
     "I think about how to deliver this so my team sees I'm with them without it reading as misaligned with the organization.",
     "I deliver it straight. This is the decision and where we're going, even if it's hard for my team right now."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q17", 4, 2, "single",
    "Your organization has just made a decision that directly affects your team. A restructuring means your team will absorb significant additional workload with no additional headcount. The timeline is immediate. Your team is already stretched. You didn't make this decision — it came from above — but you are the one who has to deliver it and own it in front of your people. Your peers are in the same position. No one pushed back in the room when it was decided.",
    "After the meeting, a team member comes to you privately and says the workload increase isn't sustainable. They're right. Which response is most like you?",
    ["I take it back up. If this isn't sustainable, that needs to be said — and I'm the one who should be saying it.",
     "I work with them to map out the load and make the tradeoffs explicit so we're clear on what the work actually demands.",
     "I listen and I'm honest about what I can and can't do, while tracking how I'm coming across in this conversation.",
     "I acknowledge it directly. The decision isn't changing, and I don't want to give false hope."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q18", 4, 3, "forced",
    "Your organization is pushing a significant strategic shift. Senior leadership is aligned and the expectation is that you will carry it forward with your team. Your team is not on board. They've been vocal about it — not in a destructive way, but clearly and directly. They have real concerns, some of which you think are legitimate. Your boss knows your team has reservations. The expectation hasn't changed. You are being asked to lead the charge on something your team doesn't believe in.",
    "You are meeting with your boss to discuss how you'll move this forward with your team. Select the response MOST like you and LEAST like you.",
    ["I'm honest about where my team stands and I make sure the cost of pushing this through is named before we talk about rollout.",
     "I focus on how to structure the rollout — what decisions are fixed, what can change, and how concerns are surfaced and tracked.",
     "I think about how to position myself so I stay credible with my boss without burning trust with my team.",
     "I go in ready to move it forward. If this is where we're going, my job is to lead my team there."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q19", 4, 4, "single",
    "Your organization is pushing a significant strategic shift. Senior leadership is aligned and the expectation is that you will carry it forward with your team. Your team is not on board. They've been vocal about it — not in a destructive way, but clearly and directly. They have real concerns, some of which you think are legitimate. Your boss knows your team has reservations. The expectation hasn't changed. You are being asked to lead the charge on something your team doesn't believe in.",
    "You bring the priority to your team. The pushback is immediate and pointed. A respected team member says directly: \"I don't think you actually believe in this either.\" Which response is most like you?",
    ["I respond directly. I tell them where I stand and what I'm moving forward regardless.",
     "I redirect to specifics — what the concerns are, what can change, and what decisions are fixed.",
     "I'm careful about how I respond, tracking how this will land for my team.",
     "I don't deflect it. I state the position clearly and that we're moving forward."],
    ["outcome", "process", "identity", "system"]],

  // ── DOMAIN 5: PRESENCE ──
  ["D5-Q21", 5, 1, "forced",
    "You are in a one-on-one with a direct report who has been strong and reliable. They came in to talk about a project issue. Ten minutes in, something shifts. They're not talking about the project anymore. They're telling you they're not sure this role is right for them, that they feel unseen, and that they don't think you've noticed. The emotion is real. The conversation has moved somewhere you didn't expect and you can see they're not done. You have another meeting in twenty minutes.",
    "They've just said something that lands harder than anything else in the conversation. The room is quiet. Select the response MOST like you and LEAST like you.",
    ["I address it directly. I name what I'm hearing and move us toward what we should do next.",
     "I slow it down. I reflect back what I'm hearing and give the conversation more structure so we can work through it.",
     "I'm aware of how I'm showing up and I make sure my response lands as steady and that I'm taking this seriously.",
     "I stay in it. I don't move to fix it or reframe it. I want to understand what's underneath what they just said."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q22", 5, 2, "single",
    "You are in a one-on-one with a direct report who has been strong and reliable. They came in to talk about a project issue. Ten minutes in, something shifts. They're not talking about the project anymore. They're telling you they're not sure this role is right for them, that they feel unseen, and that they don't think you've noticed. The emotion is real. The conversation has moved somewhere you didn't expect and you can see they're not done. You have another meeting in twenty minutes.",
    "The twenty minutes is up. The conversation isn't resolved. They're still in it emotionally. Your next meeting is with your boss. Which response is most like you?",
    ["I close it out. I acknowledge what I've heard, commit to a follow-up, and move to my next meeting.",
     "I reset the structure — I name where we are, what's still open, and when we'll pick it back up.",
     "I'm conscious of how I end this and how it's landing for them.",
     "I don't force a close. If this needs more time, I decide in the moment whether the next meeting can wait."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q23", 5, 3, "forced",
    "You are running a team meeting. The agenda is full and the group is engaged. Midway through, you hit a topic that's been simmering — a decision that affected one team member more than others. They've been quiet until now. Then they're not. The emotion comes out sharply — not at you directly, but it's in the room. Other team members go still. Everyone is watching to see what you do. The agenda is halfway done and the meeting was already tight.",
    "The room is waiting. The team member is still visibly activated. Select the response MOST like you and LEAST like you.",
    ["I address it directly. I acknowledge what just happened and move the conversation forward.",
     "I slow the meeting down. I name what's happening and give the conversation enough structure to hold it.",
     "I make sure my response lands as steady and in control.",
     "I don't move to contain it. I stay with what just surfaced and give it space."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q24", 5, 4, "single",
    "You are running a team meeting. The agenda is full and the group is engaged. Midway through, you hit a topic that's been simmering — a decision that affected one team member more than others. They've been quiet until now. Then they're not. The emotion comes out sharply — not at you directly, but it's in the room. Other team members go still. Everyone is watching to see what you do. The agenda is halfway done and the meeting was already tight.",
    "The team member has said what they needed to say. The room is still quiet. The emotion hasn't fully left. Which response is most like you?",
    ["I move us forward. I acknowledge what was said and transition the group back to the work.",
     "I name where we are — what's been said, what's still open, and what happens next.",
     "I choose my words carefully, paying attention to how this is landing in the room.",
     "I don't rush the transition. Something real just happened in this room and I want to make sure we don't move past it."],
    ["outcome", "process", "identity", "system"]],
];

// Randomize options within each item at load time, preserving orient pairing
function shuffleItem(item) {
  const [id, domain, block, type, scenario, prompt, options, orients] = item;
  const pairs = options.map((opt, i) => ({ opt, orient: orients[i] }));
  // Fisher-Yates shuffle
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return [id, domain, block, type, scenario, prompt,
    pairs.map(p => p.opt),
    pairs.map(p => p.orient)
  ];
}

const ITEMS = ITEMS_SOURCE.map(shuffleItem);


export { ITEMS_SOURCE, ITEMS };
