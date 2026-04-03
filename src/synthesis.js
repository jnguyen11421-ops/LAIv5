// LPP Synthesis Engine
// Cluster/risk/question rules + content + getSynthesis()

// ── SYNTHESIS (rule-based) ──
// ── SYNTHESIS CONTENT ──
const SYNTHESIS_CONTENT = {
  clusters: {
    process_dominant: {
      title: "Orchestration Mode",
      text: "Your profile suggests that, under pressure, you tend to default to Orchestration Mode — staying close to how the work is structured and managed as it moves through others. You are likely to trust your judgment more when you have visibility into the process, roles are defined, and standards are holding. This often creates strong reliability, consistency, and dependable delivery. The tradeoff is that leadership can remain too closely tied to process adherence, which others often experience as controlling even when that is not the intent."
    },
    system_dominant: {
      title: "Integration Mode",
      text: "Your profile suggests that, under pressure, you tend to default to Integration Mode — returning to what is solid enough to hold up without your direct involvement. You are likely to trust decisions more when the reasoning is clear, assumptions have been examined, and the work can continue under complexity. This often creates strong judgment, long-range thinking, and genuine psychological security. The tradeoff is that others may not always know when exploration has ended and a clear direction is being held."
    },
    identity_dominant: {
      title: "Navigation Mode",
      text: "Your profile suggests that, under pressure, you tend to default to Navigation Mode — orienting toward how your leadership is landing with others. You are likely to pay close attention to interpretation, credibility, and how your response is being read across different audiences and situations. This often creates thoughtful communication, political awareness, and steadiness in complex interpersonal dynamics. The tradeoff is that too much energy can go into managing how your leadership is understood rather than fully stepping into the tension itself."
    },
    outcome_dominant: {
      title: "Execution Mode",
      text: "Your profile suggests that, under pressure, you tend to default to Execution Mode — moving toward direct action on the result that needs to be protected or achieved. You are likely to trust your footing most when you can step in directly, take action on the outcome, and see your own hand in moving things forward. This often creates decisiveness, strong ownership, and reliable follow-through. The tradeoff is that urgency can narrow the space for others to shape the work, and taking over limits the opportunities others have to grow into ownership."
    },
    mixed_process_identity: {
      title: "Orchestration and Navigation Mode",
      text: "Your profile suggests that, under pressure, you tend to default to both Orchestration Mode and Navigation Mode. This combination means you are rarely just structuring how the work moves. You are also managing how it is being interpreted by others at the same time. That dual attention can make you reliable, politically aware, and steady in complex situations. The tradeoff is that neither the structure nor its interpretation fully runs on its own. Both depend on you. As scope expands, that becomes increasingly difficult to sustain."
    },
    mixed_process_system: {
      title: "Orchestration and Integration Mode",
      text: "Your profile suggests that, under pressure, you tend to default to both Orchestration Mode and Integration Mode. This combination can look like a well-functioning system. The work is structured, the underlying judgment is sound, and things move without obvious friction. The tradeoff is that it is more dependent on you than it appears. You are managing both how the work is organized and whether the underlying judgment is sound, which means the system functions well largely because you are still in it. Ownership spreads more slowly than the surface suggests."
    },
    mixed_identity_system: {
      title: "Navigation and Integration Mode",
      text: "Your profile suggests that, under pressure, you tend to default to both Navigation Mode and Integration Mode. This combination means you are rarely caught off guard. You are reading how you and the situation are being interpreted while also staying with what is fundamentally sound beneath it. That makes you steady, nuanced, and hard to destabilize. The tradeoff is that both modes pull your attention inward under pressure. You are managing interpretation and underlying complexity simultaneously, which can leave others waiting for a direction that hasn't yet surfaced, and can leave you carrying more cognitive and emotional weight than is visible to anyone around you."
    },
    mixed_outcome_system: {
      title: "Execution and Integration Mode",
      text: "Your profile suggests that, under pressure, you tend to default to both Execution Mode and Integration Mode. This combination is relatively rare. It joins a strong drive toward direct action with the capacity to hold complexity and stay with what is fundamentally sound. This often creates leaders who can drive toward results without losing sight of the bigger picture. The tension is that these two modes pull in different directions under pressure. Execution moves toward direct action on the outcome; Integration stays with the underlying logic. When stakes rise, the instinct to act can crowd out the thinking that would make the action more sound, or the thinking can delay action longer than the moment allows."
    },
    mixed_outcome_process: {
      title: "Execution and Orchestration Mode",
      text: "Your profile suggests that, under pressure, you tend to default to both Execution Mode and Orchestration Mode. This is a highly hands-on combination. It joins a strong drive toward direct action on outcomes with close attention to how the work is structured and managed as it moves through others. This often creates leaders with exceptional execution discipline, high standards, and strong follow-through. The tension is that both modes move toward control when pressure rises. There is little in this combination that pulls toward stepping back or allowing ownership to move independently of you. As a result, ownership tends not to fully transfer outward. Not as a choice, but as the natural outcome of how both modes respond when the stakes are high."
    },
    mixed_outcome_identity: {
      title: "Execution and Navigation Mode",
      text: "Your profile suggests that, under pressure, you tend to default to both Execution Mode and Navigation Mode. This combination joins a strong drive toward direct action on outcomes with close attention to how your leadership is being interpreted by others. This often creates leaders who are both decisive and politically aware, able to move quickly while reading the room. The tension is that these two modes can work against each other under pressure. Execution moves directly toward action on the outcome, while Navigation pauses to manage how your actions are being interpreted. When stakes rise, you may find yourself caught between acting decisively and ensuring your actions are being read correctly, and the effort to do both can either delay action or dilute its clarity."
    },
    balanced_profile: {
      title: "Mixed Mode Profile",
      text: "Your profile suggests that, under pressure, you do not default to one consistent mode across domains. Instead, your response shifts depending on the type of pressure or leadership demand you are in. This is common in experienced leaders and can reflect genuine range. The tradeoff is that without a dominant pattern, your leadership can be harder for others to read and predict. The developmental task is not to pick a mode, but to become more conscious of which one you are using in which situations, and to be more transparent with others about how you are approaching the moment."
    }
  },
  risks: {
    reasoning_system_authority_process: {
      title: "Open Thinking, Controlled Execution",
      text: "Your profile combines Integration Mode in Reasoning with Orchestration Mode in Authority. This means your thinking is genuinely open. You examine assumptions, invite complexity, and reason carefully. But how authority is carried out remains closely managed. In practice, others may experience openness in dialogue but not in ownership. They can examine the logic, but still look to you to hold decision authority and ownership. The risk is that reasoning appears distributed, while authority is not. This creates an impression of shared ownership that the structure does not actually support."
    },
    contribution_process_authority_process: {
      title: "Too Close in Two Places",
      text: "Your profile combines Orchestration Mode in both Contribution and Authority. These are the two domains where ownership most needs to move outward. How work travels through others and how accountability is held are both places where your default is to stay closely involved. This often creates strong standards, reliable delivery, and clear oversight. The specific risk is that your involvement fills the space where others' ownership would develop. It is not that others lack capability. It is that the room for them to fully take ownership rarely opens, because you remain closely involved in both places where transfer would have to happen."
    },
    loyalty_identity_presence_identity: {
      title: "Managing Interpretation Where the Stakes Are Highest",
      text: "Your profile combines Navigation Mode in both Loyalty and Presence. These are the two domains where relational stakes and emotional intensity are highest. Your team's interests are on the line and challenge or tension arrives in real time. In both, your default is to attend closely to how your leadership is being interpreted. This creates thoughtfulness and political awareness in moments that require it. Under pressure, your attention shifts toward managing how you are being read rather than staying fully with what is actually happening. As a result, what matters most in the room, what your team needs, or what the moment requires can go unaddressed while you are managing how it is being interpreted."
    },
    process_plus_identity: {
      title: "Managing Structure and Perception Simultaneously",
      text: "Your profile shows a broader pattern of Orchestration Mode and Navigation Mode across domains. Under pressure, this combination means you are simultaneously managing how the work is structured and how it moves, and how your leadership is being interpreted by others. This often creates conscientiousness, reliability, and strong situational awareness. At the same time, you are actively managing both rather than allowing either to run on its own. Neither the structure nor its interpretation runs independently. Both depend on your ongoing attention. As scope or complexity increases, that combination becomes increasingly difficult to sustain."
    },
    system_plus_identity: {
      title: "Deep Reading, Unclear Direction",
      text: "Your profile shows a broader pattern of Integration Mode and Navigation Mode across domains. Under pressure, this combination means you are simultaneously staying with what is fundamentally sound in the situation and tracking how you and the situation are being interpreted. Both are forms of deep reading. One reads the situation itself and one reads how it is being understood. The specific risk is that neither produces a clear signal to others. You may be the most accurate reader in the room and still leave others uncertain about where you stand or what comes next."
    },
    outcome_plus_process: {
      title: "Controlling Both the Output and the Path",
      text: "Your profile shows a broader pattern of Execution Mode and Orchestration Mode across domains. Under pressure, this combination means you are managing both the outcome and how the work is structured and moves through others. This creates strong execution discipline, reliable delivery, and clear direction. The specific risk is that both modes move toward control when pressure rises. One moves toward the outcome and one toward the process. Together they leave little room for others to make meaningful decisions or develop real ownership. Others may be executing well without ever fully leading. Over time, this creates a bottleneck. Work flows back toward you because that is where decisions get made and standards get held. As scope or complexity increases, that becomes unsustainable. Not because the work isn't getting done, but because your involvement is the reason it is."
    },
    identity_plus_system_plus_process: {
      title: "Managing in Three Directions at Once",
      text: "Your profile shows a pattern of Navigation Mode, Integration Mode, and Orchestration Mode across domains. Under pressure, this combination means you are simultaneously managing how the work is structured and moves through others, staying with what is fundamentally sound in the work, and tracking how your leadership is being interpreted. Each of those is a legitimate leadership demand. Together, they converge on you at once. The specific risk is that you become the single point through which structure, judgment, and interpretation all run, which makes the system more dependent on you than it appears and significantly more fragile than it should be."
    },
    balanced_general: {
      title: "Flexibility Without Awareness",
      text: "Your profile does not show a dominant mode across domains. Under pressure, your defaults shift depending on the type of demand you are facing. This can reflect genuine range and adaptability. The specific risk is that these shifts are not always visible or intentional. When they are not, you may default to a mode that does not fit what the situation actually needs. Others may not know how to engage you from one moment to the next. Flexibility without awareness can lead to misalignment in how decisions are made, how ownership is handled, and how your leadership is interpreted. The developmental task is not to settle into one mode, but to become conscious enough of your shifts that they are legible to you and to others."
    }
  },
  questions: {
    contribution: "Where do you still need to see your hand in the work to trust that your contribution is real? And what would it mean to trust it anyway?",
    reasoning: "When you are most certain about your reasoning, what are you least willing to examine — and what might that be protecting?",
    authority: "Where are you holding on to oversight that others could carry — and what does holding it tell you about what you are not yet willing to trust?",
    loyalty: "When priorities pull in different directions, how do you reconcile them — and what does that tell you about what you are most afraid to lose?",
    presence: "When tension enters a conversation, what are you most drawn to do first — and what might you be avoiding by doing it?",
    general_process: "What's keeping you from letting the work move without your involvement — and what would you have to trust for that to feel acceptable?",
    general_identity: "What's keeping you from staying fully with what is happening rather than managing how it is being interpreted — and what are you afraid would happen if you did?",
    general_system: "Where has your thinking become clear enough to act on — and what would it take for others to carry it forward without needing you to hold it?"
  }
};

// Domain index to key map
const DOMAIN_KEYS = {1:"contribution", 2:"reasoning", 3:"authority", 4:"loyalty", 5:"presence"};

// Orientation to bucket map (handles both new string keys and legacy placement codes)
const ORIENT_BUCKET = {
  // New string keys from updated question set
  "outcome": "outcome",
  "process": "process",
  "identity": "identity",
  "system": "system",
  // Legacy placement codes (kept for backward compat with saved results)
  "1": "outcome",
  "2a": "process",
  "2b": "identity",
  "3": "system"
};

const ORIENTATION_ORDER = {"1":0,"2a":1,"2b":2,"3":3};

// ── SELECTOR FUNCTION ──
// ── LAYER 2: SYNTHESIS SELECTOR ──

// Orientation bucket translator
const toBucket = placement => ORIENT_BUCKET[placement] || "outcome";

// ── CONFIGURABLE RULES ──
// Each rule: { test: (profile, counts) => bool, key: string }
// Selector walks the array and returns the first match.

const CLUSTER_RULES = [
  // Specific domain combinations first
  {
    test: (p, c) => p.reasoning === "system" && p.authority === "process" && (c.process||0) >= 2,
    key: "mixed_process_system"
  },
  {
    test: (p, c) => p.loyalty === "identity" && p.presence === "identity" && (c.identity||0) >= 2 && (c.process||0) >= 1,
    key: "mixed_process_identity"
  },
  // Count-based dominance
  { test: (p, c) => (c.outcome||0) >= 2 && (c.system||0)   >= 2 && (c.identity||0) === 0 && (c.process||0)  === 0, key: "mixed_outcome_system"   },
  { test: (p, c) => (c.outcome||0) >= 2 && (c.process||0)  >= 2 && (c.system||0)   === 0 && (c.identity||0) === 0, key: "mixed_outcome_process"   },
  { test: (p, c) => (c.outcome||0) >= 2 && (c.identity||0) >= 2 && (c.system||0)   === 0 && (c.process||0)  === 0, key: "mixed_outcome_identity"   },
  { test: (p, c) => (c.process||0)   >= 3, key: "process_dominant"  },
  { test: (p, c) => (c.system||0)    >= 3, key: "system_dominant"   },
  { test: (p, c) => (c.identity||0)  >= 3, key: "identity_dominant" },
  { test: (p, c) => (c.outcome||0)   >= 3, key: "outcome_dominant"  },
  // Fallback — always matches
  { test: () => true, key: "balanced_profile" }
];

const RISK_RULES = [
  // Specific high-value domain combinations in priority order
  {
    test: (p) => p.reasoning === "system" && p.authority === "process",
    key: "reasoning_system_authority_process"
  },
  {
    test: (p) => p.contribution === "process" && p.authority === "process",
    key: "contribution_process_authority_process"
  },
  {
    test: (p) => p.loyalty === "identity" && p.presence === "identity",
    key: "loyalty_identity_presence_identity"
  },
  // Broader combination patterns
  {
    test: (p, c) => (c.identity||0) >= 1 && (c.system||0) >= 1 && (c.process||0) >= 1,
    key: "identity_plus_system_plus_process"
  },
  { test: (p, c) => (c.process||0)  >= 1 && (c.identity||0) >= 1, key: "process_plus_identity" },
  { test: (p, c) => (c.system||0)   >= 1 && (c.identity||0) >= 1, key: "system_plus_identity"  },
  { test: (p, c) => (c.outcome||0)  >= 1 && (c.process||0)  >= 1, key: "outcome_plus_process"  },
  // Fallback — always matches
  { test: () => true, key: "balanced_general" }
];

const QUESTION_RULES = [
  // Mode-based question selection
  { test: (p, c) => (c.process||0)  >= 2, key: "general_process"  },
  { test: (p, c) => (c.identity||0) >= 2, key: "general_identity" },
  { test: (p, c) => (c.system||0)   >= 2, key: "general_system"   },
  // Fallback — always matches
  { test: () => true, key: "general_process" }
];

// ── RULE RUNNER ──
function runRules(rules, profile, counts) {
  const match = rules.find(r => r.test(profile, counts));
  return match ? match.key : null;
}

// ── SELECTOR FUNCTION ──
function getSynthesis(results) {
  const SC = SYNTHESIS_CONTENT;

  // Layer 1 → profile (domain number → placement string)
  const profile = {
    contribution: results[1].placement,
    reasoning:    results[2].placement,
    authority:    results[3].placement,
    loyalty:      results[4].placement,
    presence:     results[5].placement,
  };

  // Translate placements to orientation buckets for count-based rules
  const bucketProfile = Object.fromEntries(
    Object.entries(profile).map(([k, v]) => [k, toBucket(v)])
  );

  // Count bucket frequencies
  const counts = Object.values(bucketProfile).reduce((acc, b) => {
    acc[b] = (acc[b]||0) + 1; return acc;
  }, {});

  // Run rules to get keys
  const clusterKey = runRules(CLUSTER_RULES, bucketProfile, counts);
  const riskKey = runRules(RISK_RULES, bucketProfile, counts);
  const questionKey = runRules(QUESTION_RULES, bucketProfile, counts);

  // ── LAYER 3: CONTENT ASSEMBLY ──
  const cluster  = SC.clusters[clusterKey];
  const risk     = SC.risks[riskKey];
  const question = SC.questions[questionKey];

  return { cluster, risk, question };
}


export { SYNTHESIS_CONTENT, CLUSTER_RULES, RISK_RULES, QUESTION_RULES, getSynthesis, DOMAIN_KEYS, ORIENT_BUCKET, ORIENTATION_ORDER };
