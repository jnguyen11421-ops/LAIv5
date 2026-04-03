// LPP Report Language
// Keyed by domain number → { name, tension, setup, placements }
// setup: single sentence introducing the domain pressure condition
// Placement paragraphs keyed by: "1", "2a", "2b", "3"
// Leadership Moment content, assets/limitations tables, and
// Questions to Sit With live in DOMAIN_CONTENT / ORIENTATION_CONTENT in App.jsx

const LANG = {
  1:{ name:"As Visibility Shifts", tension:"Visibility ↔ Impact",
    setup:"Pressure builds when your work moves through others and your role becomes less visible, but your impact is still expected.",
    "1":"Your default is to move closer to the work so your judgment is directly shaping the outcome. You trust what you can see and influence directly. This reflects a belief that staying close is what ensures the work is done right. The cost is that ownership doesn't fully move. The work stays tied to you, and others don't fully take it on.",
    "2a":"Your default is to structure the work so it can move without you. You rely on roles, processes, and clear expectations to carry the outcome forward. This reflects a belief that the right structure is what holds the work together. The cost is that the structure can become limiting. The work follows the system, even when the situation requires something different.",
    "2b":"Your default is to make sure your contribution is visible to the people who matter. You track how your role in the work is being understood and adjust how you communicate it in real time. This reflects a belief that if your role in the work isn't visible, your contribution won't be recognized. The cost is that how it lands can start to take priority over taking a clear stand.",
    "3":"Your default is to release your imprint on the work and trust others to carry it forward. You focus on whether the work is becoming what it needs to be rather than whether your role in it remains visible. This reflects a belief that forcing clarity too early limits what the work can become. The cost is that your impact becomes harder to see, even when it's real. Others may not recognize how you're shaping the work."
  },
  2:{ name:"As Certainty Fades", tension:"Correctness ↔ Transparency",
    setup:"Pressure builds when a decision is yours to make or defend and certainty isn't available. The information may be incomplete, conflicting, or too complex to resolve cleanly.",
    "1":"Your default is to move toward a conclusion. You work to determine what to do and move on it with conviction. This reflects a belief that a clear answer is what the situation requires. The cost is that the conclusion can come before the thinking is fully worked through. You move forward with confidence, but the reasoning may not yet support the certainty you're projecting.",
    "2a":"Your default is to build out the reasoning before committing to a conclusion. You slow the process down, name assumptions, and make sure the analysis is complete. This reflects a belief that running the right process is how sound decisions are made. The cost is that the analysis can continue when the situation requires a decision. The reasoning gets stronger, but the process itself can become the obstacle.",
    "2b":"Your default is to stay attuned to how your reasoning is landing in the room. You track how your thinking is being received and adjust how you frame it in real time. This reflects a belief that how your reasoning lands determines whether anything moves. The cost is that how it lands can start to take priority over whether the reasoning itself is sound.",
    "3":"Your default is to stay with the thinking as it unfolds rather than move quickly to a conclusion. You stay with the reasoning as it unfolds, testing assumptions and allowing the picture to change as new information comes in. This reflects a belief that staying open leads to better outcomes than closing too soon, and a tendency to step into the role of the one who holds the thinking until it becomes clear. The cost is that the thinking can keep evolving when others need a decision. Insight deepens, but the moment to act can pass."
  },
  3:{ name:"As Control Decreases", tension:"Direct Control ↔ System Trust",
    setup:"Pressure builds when you're accountable for work that you no longer control directly.",
    "1":"Your default is to step back into the work when the outcome still reflects on you. You move closer so your judgment is directly shaping what gets delivered. This reflects a belief that since you're accountable, you need to be in it. The cost is that ownership doesn't fully transfer, and others have less room to use their own judgment.",
    "2a":"Your default is to tighten the structure around the work as your direct control decreases. You put clearer roles, checkpoints, and expectations in place so the work can be tracked and held without you stepping back in. This reflects a belief that clear roles and processes are what keep accountability from slipping. The cost is that people start following the process instead of taking ownership of what the situation actually requires, and accountability can look held even when no one is truly owning the outcome.",
    "2b":"Your default is to calibrate how and when you step in so your involvement is read correctly. You track how you're being seen, present enough to signal accountability, back enough to signal trust. This reflects a belief that how your authority is perceived matters as much as how you actually hold it, and that managing that perception is part of the job. The cost is that managing how your authority is perceived can delay actually using it. The moment can require a clearer hand than you've shown.",
    "3":"Your default is to look at how accountability is held across the system rather than with any one person. As things shift, you pay attention to whether ownership is holding and give it space rather than stepping in. This reflects a belief that accountability can't sit with any one person and has to be shared across the system. The cost is that when the moment calls for someone to step in directly, you may hold back. Ownership can become diffuse, and others may be left unclear on who is actually accountable."
  },
  4:{ name:"As Priorities Diverge", tension:"Your People ↔ The Whole",
    setup:"Pressure builds when the needs of your team and the needs of the broader organization pull in different directions and you can't fully stand in both places.",
    "1":"Your default is to stand up for your team when their interests are at risk. You make the impact on your team explicit and push back when they're expected to absorb more than their share. This reflects a belief that if it affects your team, you need to advocate for them. The cost is that the broader tradeoff can be harder to hold. When you're standing firmly on one side, the system-level view is harder to carry.",
    "2a":"Your default is to make sure the tension between your team and the organization is worked through explicitly rather than absorbed quietly. You bring the competing priorities into the open and work through what each side needs before moving forward. This reflects a belief that competing priorities need to be worked through explicitly before a direction can be set. The cost is that working the process can delay taking a position. When one side needs you to stand clearly with them, structured handling can feel like avoidance.",
    "2b":"Your default is to manage how your stance is read by both your team and the organization. You track whether you're being seen as fair and credible on both sides and adjust how you communicate your position accordingly. This reflects a belief that how you position yourself between both sides determines whether you can lead either of them. The cost is that managing how your stance lands can delay taking one. When the moment requires you to choose a side clearly, calibrating perception can get in the way.",
    "3":"Your default is to hold the broader context when local pressure makes it hard to see. You hold to what the broader situation requires, even when your team is carrying real cost, and resist shifting to one side even when your team is under pressure. This reflects a belief that decisions need to serve the broader context, even when they create cost for your team. The cost is that your team may experience your steadiness as distance. When they need you to stand with them, holding the broader view can look like you're not."
  },
  5:{ name:"As the Moment Intensifies", tension:"Reaction ↔ Curiosity",
    setup:"PLACEHOLDER — to be written next session.",
    "1":"PLACEHOLDER — Execution Mode portrait for As the Moment Intensifies to be written next session.",
    "2a":"PLACEHOLDER — Orchestration Mode portrait for As the Moment Intensifies to be written next session.",
    "2b":"PLACEHOLDER — Navigation Mode portrait for As the Moment Intensifies to be written next session.",
    "3":"PLACEHOLDER — Integration Mode portrait for As the Moment Intensifies to be written next session."
  }
};


export { LANG };
