// LPP Assessment Items
// Format: [id, domain, block, type, scenario, prompt, [options], [orientations]]

// ── ASSESSMENT ITEMS ──
// Format:
//   forced: [id, domain, block, "forced", scenario, prompt, [A,B,C,D], [orientA,orientB,orientC,orientD]]
//   single: [id, domain, block, "single", scenario, prompt, [A,B,C,D], [orientA,orientB,orientC,orientD]]
//   paired: [id, domain, block, "paired", null,     prompt, [A,B],     [orientA,orientB]]
//
// Options are randomized at runtime — orientations travel with their option text as pairs.
// Answer key positions (A/B/C/D) reflect the CANONICAL order for the key document only.

const ITEMS_SOURCE = [
  // ── DOMAIN 1: CONTRIBUTION ──
  ["D1-Q1", 1, 1, "forced",
    "You delegated a visible project to one of your senior managers. The final presentation goes well and your involvement isn't mentioned.",
    "Select the response MOST like you and LEAST like you",
    ["I'm glad it went well. I still find myself wanting to have been more directly involved — it's hard to feel settled when I'm not close to the work.",
     "I follow up with the manager to understand how it came together and whether the approach held.",
     "I'm aware my absence might make it unclear how I contributed.",
     "I notice it worked without me in the room and stay with what that says about how the direction is being carried."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q2", 1, 2, "single",
    "A team member presents work that clearly builds on ideas you introduced earlier.",
    "Which response is most like you?",
    ["If the direction starts drifting, I step in to steer it back. I'm less comfortable leaving it to carry without staying close to how it's applied.",
     "I'm listening for whether the approach held and where it may have shifted from the original direction.",
     "I connect the work back to the direction behind it so the context is clear.",
     "I'm watching how the thinking has evolved and whether the direction is still shaping the work, regardless of whether it's tied back to me."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q3", 1, 3, "forced",
    "You step away from a project and the team runs it successfully without you.",
    "Select the response MOST like you and LEAST like you",
    ["I'm glad it worked, but I find myself wanting to have been more directly involved. It's harder to feel confident in the outcome when I'm not close to the work.",
     "I want to know how they managed it — what decisions they made, what came up, and whether the structure we set up actually held.",
     "I'm thinking about how this reads to the people who matter — whether my role in setting up the conditions is understood, and whether I need to make that clearer.",
     "That's the point. If the team can run it without me, the direction was clear enough and the conditions were right. I'm more interested in what they learned than in being connected to the outcome."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q4", 1, 4, "single",
    "When credit for work is unclear in a leadership setting.",
    "Which response is most like you?",
    ["I'll find a way to clarify it — not aggressively, but clearly. I'm not comfortable letting the ambiguity sit if it means the wrong read becomes the default.",
     "I'm less focused on credit and more on whether people understand how the work actually developed. If the process is misread, the wrong lessons get drawn.",
     "I pay attention to how the contribution is landing — whether my role is being read correctly — and I find a way to make sure it registers without making it a claim.",
     "Credit is less interesting to me than whether the thinking is being used correctly. If the ideas are shaping decisions, it's working — regardless of who gets named."],
    ["outcome", "process", "identity", "system"]],

  ["D1-Q5", 1, 5, "paired",
    "You offer a direction in a leadership discussion, and the group moves forward with a different approach.",
    "Which statement resonates more with your experience?",
    ["My instinct is to step back in and reassert the direction. If I see a better path, I'm not comfortable letting it go without pushing it further.",
     "My instinct is to let it move and pay attention to what the group is responding to. If a different direction is gaining traction, I want to understand what's driving that."],
    ["outcome", "system"]],

  // ── DOMAIN 2: REASONING ──
  ["D2-Q6", 2, 1, "forced",
    "You receive feedback that your reasoning didn't land clearly in a message you delivered.",
    "Select the response MOST like you and LEAST like you",
    ["My first instinct is to clarify the conclusion. If the takeaway wasn't clear, I want to restate it so there's no confusion about where I stand.",
     "I want to walk back through how I explained it — what I emphasized, how I structured it, and where the reasoning may not have held together.",
     "I'm thinking about how it's being interpreted — whether I need to reframe it so it lands the way I intended before that interpretation settles.",
     "I'm curious about the gap between what I intended and how it was understood. That gap is telling me something about my assumptions or how others are reading the situation."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q7", 2, 2, "single",
    "You notice people are interpreting a decision you shaped in different ways.",
    "Which response is most like you?",
    ["I want to step in and restate the conclusion. If people are taking it in different directions, I'd rather bring it back to a clear answer.",
     "I want to understand how those interpretations are forming. Where is the reasoning breaking down, and what's creating the divergence?",
     "I'm paying attention to how the different interpretations are landing across the group and where I need to clarify so it aligns with how I want it understood.",
     "I'm interested in what the different interpretations are revealing. If people are reading it differently, that suggests the underlying reasoning may not be as clear or complete as I thought."],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q8", 2, 3, "forced",
    "A colleague asks why you didn't intervene in a decision your team made.",
    "Select the response MOST like you and LEAST like you",
    ["My first instinct is to explain the outcome I was aiming for — why I made the call I did and why the direction still makes sense.",
     "I explain how the decision was made — what the team knew at the time and how they arrived at it.",
     "I'm thinking about how my response lands — I want it to come across as deliberate and considered, not defensive or disengaged.",
     "I'm interested in what's behind the question. Are they seeing something I missed, or working from a different assumption about what my role should be?"],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q9", 2, 4, "single",
    "You're listening to a senior leadership team discussion about a decision you originally shaped.",
    "Which response is most like you?",
    ["I'm tracking whether the discussion is heading somewhere I'm comfortable with. If it starts moving away from the direction I set, I'll find a moment to reorient it.",
     "I'm listening for whether the process that shaped the original decision is being understood correctly. If people are working from an incomplete picture of how we got here, I want to fill that in.",
     "I'm aware of how I'm reading in the room — whether my engagement is landing as I intend, and whether I need to signal where I stand.",
     "I'm mostly curious about what the discussion is revealing. Are the right questions being asked? Is the original thinking holding up, or is the team finding something in it that I didn't see?"],
    ["outcome", "process", "identity", "system"]],

  ["D2-Q10", 2, 5, "paired",
    "A decision you shaped is being questioned, and the group is split on what to do next.",
    "Which statement resonates more?",
    ["I feel most settled when the reasoning is clear and examinable, even if people land in different places.",
     "I feel most settled when the conclusion is right and the group moves forward with a clear decision."],
    ["system", "outcome"]],

  // ── DOMAIN 3: AUTHORITY ──
  ["D3-Q11", 3, 1, "forced",
    "A project goes off course after being handed to another team.",
    "Select the response MOST like you and LEAST like you",
    ["My first instinct is to step back in. I can see what needs to happen to get it back on track, and leaving it to sort itself out doesn't feel responsible.",
     "I want to understand where it broke down — what wasn't clear, where the handoff failed — and tighten how this work is being managed so it holds next time.",
     "I'm thinking about how this reflects on my decision to hand it off. I make sure I'm visible in how I re-engage so it's clear this is still mine to hold.",
     "I'm less focused on correcting it immediately and more on what in the system allowed it to drift. If it went off course, something in how this is set up isn't holding."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q12", 3, 2, "single",
    "A strategic decision stalls in a senior team meeting. Disagreement continues, and no one is clearly taking ownership of how the group will move forward.",
    "Which response is most like you?",
    ["I step in to drive the decision. If ownership isn't clear, I'll take responsibility for moving it forward so we don't stay stuck.",
     "I focus on how the decision process is being held. If ownership is unclear, we need to reset who is accountable and how decisions are made in this group.",
     "I'm paying attention to how stepping in will land. I want to move things forward, but in a way that maintains my authority without overreaching or creating resistance.",
     "I'm less concerned with who steps in immediately and more with what this is revealing about how authority operates here. If decisions stall like this, something in the system isn't holding."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q13", 3, 3, "forced",
    "A new leader questions how a long-standing approach works.",
    "Select the response MOST like you and LEAST like you",
    ["My first instinct is to step in and clarify what should hold. If the approach is working, I don't want it destabilized before we're clear on what's actually broken.",
     "I want to make sure they understand how the approach works — the decisions behind it, what it replaced, and how it's meant to operate — before anything changes.",
     "I'm thinking about how I engage. I want to be open to the question while making sure I'm not coming across as defensive or attached to the approach.",
     "I'm less focused on the question itself and more on what it's surfacing. If it's challenging something real, I want to understand what in the system may no longer be holding."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q14", 3, 4, "single",
    "You notice people referencing guidance you gave months earlier.",
    "Which response is most like you?",
    ["What matters most is whether that guidance is still producing the right outcome. If it isn't, I'll step in and redirect so it doesn't keep driving the wrong call.",
     "I want to understand how it's being applied. Is it being used as intended, or has it been stretched beyond where it actually fits?",
     "I'm aware of how that reference is landing — what it signals about my role — and I think about whether I need to respond to shape how that's being interpreted.",
     "I'm curious what this says about how direction travels here. If guidance from months ago is still shaping decisions, that tells me something about how authority is held in the system."],
    ["outcome", "process", "identity", "system"]],

  ["D3-Q15", 3, 5, "paired",
    "Someone on your team makes a decision you wouldn't have made, and it's already in motion.",
    "Which resonates more?",
    ["My instinct is to step in and redirect it. If the call isn't right, I don't want it playing out unchecked.",
     "My instinct is to let it play out and then look at what in the system led to that decision being made that way."],
    ["outcome", "system"]],

  // ── DOMAIN 4: LOYALTY ──
  ["D4-Q16", 4, 1, "forced",
    "A difficult decision affects several teams differently.",
    "Select the response MOST like you and LEAST like you",
    ["My first instinct is to look at the impact on my team. If they're absorbing more cost than others, I want to step in and make sure they're not carrying it alone.",
     "The thing I'm tracking is whether the process that produced the decision was sound enough to hold under uneven impact. If it wasn't, that's what needs to be addressed.",
     "I'm tracking how my position is landing with each group — making sure I come across as fair-minded and that the teams who absorbed more cost don't read me as indifferent.",
     "What I'm paying attention to is whether the different impacts were visible when the decision was made, or whether they're surfacing now as a surprise. That tells me something about how well the system held the complexity."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q17", 4, 2, "single",
    "You're asked to represent an organizational position you know your team disagrees with.",
    "Which response is most like you?",
    ["I represent the position. If I've chosen to stay in the role, that's part of what it requires. I'll do it in a way that's honest without undermining the decision.",
     "I focus on how I frame it. I want to present the position clearly and make sure my team understands the reasoning behind it, even if they don't agree.",
     "I'm tracking how I'm coming across to both sides — making sure my team feels heard and leadership sees me as able to hold a difficult position.",
     "I consider whether the disagreement is about the decision itself or what it reveals about how the organization is operating. Those require different responses."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q18", 4, 3, "forced",
    "You find out your team protected their own timeline by shifting work onto another team.",
    "Select the response MOST like you and LEAST like you",
    ["My first instinct is to address the impact. If my team shifted the burden to protect themselves, I need to decide quickly whether to correct it or stand behind it.",
     "I want to understand how it happened — what decision point led to it and whether there's a gap in how we're managing cross-team work.",
     "I'm tracking how this is being read across teams and want to address it in a way that shapes how my team's actions are understood.",
     "I'm interested in what this reveals about how my team understands their role in the broader system. If this felt like a reasonable call to them, that tells me something important."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q19", 4, 4, "single",
    "Advocating for your team's position will likely put you at odds with senior leadership.",
    "Which response is most like you?",
    ["I'm willing to push for my team if I believe they're right. If it creates tension with leadership, I'll deal with that — but I won't leave my team unrepresented.",
     "I want to understand how the position was formed on both sides. If I'm going to advocate, I need to be clear on where the differences actually are.",
     "I'm thinking about how to take a position that supports my team while maintaining credibility with leadership. How I handle it matters as much as what I say.",
     "I'm considering what the tension is revealing. If my team and leadership are misaligned, I want to understand what in the system is creating that gap."],
    ["outcome", "process", "identity", "system"]],

  ["D4-Q20", 4, 5, "paired",
    "You're in a leadership discussion where a decision will benefit the organization but create real strain for your team.",
    "Which resonates more?",
    ["My role is to make decisions that serve the system as a whole, even when there's local cost.",
     "My role is to represent my people strongly and make sure their interests are protected in leadership discussions."],
    ["system", "outcome"]],

  // ── DOMAIN 5: PRESENCE ──
  ["D5-Q21", 5, 1, "forced",
    "A conversation you expected to be routine becomes charged without warning.",
    "Select the response MOST like you and LEAST like you",
    ["I respond directly — clarifying my position and moving the conversation toward resolution so it stays focused.",
     "I pause the exchange and re-structure the conversation — slowing things down, clarifying the concern, and guiding the discussion into a more orderly format.",
     "I step back and adjust how I'm engaging — modulating my tone and framing to ensure my response lands appropriately and the interaction doesn't escalate.",
     "I stay with the tension and invite further exploration — asking questions to understand what's driving the reaction rather than moving to resolve it immediately."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q22", 5, 2, "single",
    "You notice you've stopped listening and started preparing your response.",
    "Which response is most like you?",
    ["I stay with the response I've been forming. I've already identified where I think the conversation needs to go and move forward from there.",
     "I pause and reset the exchange — asking them to restate or clarify their point so I can respond from a more complete understanding.",
     "I re-engage and make sure it's clear I'm present — adjusting how I'm showing up so it doesn't read as disengaged or dismissive.",
     "I notice the shift and stay with it; something moved me toward a conclusion, and I want to understand that before I respond."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q23", 5, 3, "forced",
    "You notice you're feeling frustrated, but the other person hasn't picked up on it. What do you do?",
    "Select the response MOST like you and LEAST like you",
    ["I manage it and keep going. The frustration is there, but I stay focused on moving the conversation toward an outcome.",
     "I pause and reset how the conversation is unfolding. Something isn't working, and I want to adjust the exchange before continuing.",
     "I adjust how I'm coming across and make sure what lands is steadiness, not frustration.",
     "I stay with the frustration without acting on it — letting it be there while I keep listening."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q24", 5, 4, "single",
    "A meeting discussion has drifted and time is limited. What do you do?",
    "Which response is most like you?",
    ["I bring it back directly. If the conversation has drifted, I reorient it so we can move forward.",
     "I step in to reset the conversation — clarifying what we're trying to resolve and tightening how we're moving through it so we use the time well.",
     "I bring it back, trying to keep it from coming across like a correction.",
     "I stay with it long enough to see whether the shift is useful, even if it slows us down."],
    ["outcome", "process", "identity", "system"]],

  ["D5-Q25", 5, 5, "paired",
    "A conversation becomes tense, and there's pressure to either resolve it quickly or stay with what's coming up.",
    "Which resonates more?",
    ["Under pressure, I move the conversation forward, even if not everything is fully explored.",
     "Under pressure, I stay with the tension, even if it slows down getting to resolution."],
    ["outcome", "system"]],
];

// Randomize options within each item at load time, preserving orient pairing
function shuffleItem(item) {
  const [id, domain, block, type, scenario, prompt, options, orients] = item;
  // Paired items must remain in fixed order — do not shuffle
  if (type === "paired") return item;
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
