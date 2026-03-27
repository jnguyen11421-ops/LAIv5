// LPP Synthesis Engine
// Cluster/risk/question rules + content + getSynthesis()

// ── SYNTHESIS (rule-based) ──
// ── SYNTHESIS CONTENT ──
const SYNTHESIS_CONTENT = {
  clusters: {
    process_dominant: {
      title: "Process-anchored leadership",
      text: "Your profile suggests that when leadership gets tense, you often default to staying close to how work is unfolding. You are likely to trust your judgment more when you have visibility into the process, can track how decisions are developing, and can see whether standards are holding. This often creates strong reliability, consistency, and quality control. The tradeoff is that leadership can remain more closely tied to your visibility than to the systems or people carrying the work forward."
    },
    system_dominant: {
      title: "System-oriented leadership",
      text: "Your profile suggests that when leadership moments become difficult, you often default to the underlying logic, structure, or system shaping the work. You are likely to trust decisions more when the reasoning is clear, the architecture makes sense, and the broader system can hold complexity without oversimplifying it. This often creates strong judgment, learning, and long-range thinking. The tradeoff is that others may not always know when to move from exploration into commitment or action."
    },
    identity_dominant: {
      title: "Identity-aware leadership",
      text: "Your profile suggests that when leadership gets tense, you often default to how your leadership stance is being understood by others. You are likely to pay close attention to trust, credibility, interpretation, and how your response lands across different audiences. This often creates thoughtful communication, political awareness, and steadiness in complex situations. The tradeoff is that too much energy can go into managing how leadership is understood rather than fully stepping into the tension itself."
    },
    outcome_dominant: {
      title: "Outcome-driven leadership",
      text: "Your profile suggests that when pressure rises, you often default to the result that needs to be protected or achieved. You are likely to trust your footing most when the direction is clear, the stakes are named, and movement toward the outcome is visible. This often creates decisiveness, momentum, and strong ownership. The tradeoff is that urgency can narrow reflection and reduce space for others to shape the work."
    },
    mixed_process_identity: {
      title: "Careful, high-accountability leadership",
      text: "Your profile suggests a pattern of staying close to both execution and interpretation when leadership gets tense. You may rely on visibility into the work while also paying close attention to how your leadership stance is understood by others. This often creates reliability, thoughtfulness, and strong situational awareness. The tradeoff is that leadership can become more effortful, because you are carrying both the work itself and the social meaning of the work at the same time."
    },
    mixed_process_system: {
      title: "Structured, high-judgment leadership",
      text: "Your profile suggests a pattern of combining strong reasoning with close process visibility. You are likely to value both sound logic and a clear view into how work is unfolding. This often creates thoughtful decisions and dependable execution. The tradeoff is that decision quality may stay high while ownership spreads more slowly, because leadership still relies partly on your proximity to the work."
    },
    mixed_identity_system: {
      title: "Reflective, complex-systems leadership",
      text: "Your profile suggests a pattern of holding both systemic complexity and social interpretation in view when leadership gets tense. You may be skilled at seeing the larger logic of a situation while also tracking how people are receiving the moment. This often creates nuanced judgment and strong relational awareness. The tradeoff is that leadership can become overmanaged if too much attention goes to both the system and the meaning others are making of it."
    },
    balanced_profile: {
      title: "Mixed leadership profile",
      text: "Your profile suggests that you do not rely on one leadership pattern across every domain. Instead, your defaults shift depending on the kind of pressure you are carrying. This is common in experienced leaders. It means your development is less about changing your whole style and more about noticing which pattern you reach for in which kind of moment."
    }
  },
  leverage: {
    contribution: {
      title: "Developmental leverage: Contribution",
      text: "The strongest developmental leverage in your profile appears in Contribution. This domain matters because it shapes how you experience your value as leadership becomes less visible and more distributed. A shift here would likely have effects beyond contribution itself: it can change how much oversight you need, how easily authority spreads through others, and how much your leadership depends on staying close to the work. The key question is whether you can trust your influence even when your involvement is no longer visible."
    },
    reasoning: {
      title: "Developmental leverage: Reasoning",
      text: "The strongest developmental leverage in your profile appears in Reasoning. This domain matters because it shapes how you make sense of uncertainty, explain decisions, and invite others into complex thinking. A shift here would likely affect not only your decisions, but also the quality of dialogue around you. The key question is whether your current reasoning habits create enough room to examine the assumptions built into how you are framing the problem."
    },
    authority: {
      title: "Developmental leverage: Authority",
      text: "The strongest developmental leverage in your profile appears in Authority. This domain matters because it shapes whether leadership capacity stays concentrated around you or becomes more widely held across the team or system. A shift here would likely affect scale, ownership, and the pace at which others grow into judgment. The key question is whether your current oversight gives the system what it truly needs, or whether some of it mainly helps you feel reassured."
    },
    loyalty: {
      title: "Developmental leverage: Loyalty",
      text: "The strongest developmental leverage in your profile appears in Loyalty. This domain matters because it shapes how you carry the tension between your people and the larger system. A shift here would likely affect trust, alignment, and how clearly you can hold difficult decisions without overexplaining or overcorrecting. The key question is whether you can stay present to the cost of a decision without needing to manage how your leadership stance is interpreted."
    },
    presence: {
      title: "Developmental leverage: Presence",
      text: "The strongest developmental leverage in your profile appears in Presence. This domain matters because it shapes what happens in real time when challenge, disagreement, or emotional intensity enters the room. A shift here would likely affect not only your own steadiness, but also how much openness and learning difficult conversations can hold. The key question is whether you can stay curious a little longer before moving to manage, explain, or resolve the moment."
    }
  },
  risks: {
    reasoning_system_authority_process: {
      title: "Pressure risk",
      text: "One tension in your profile is that you may invite openness in how decisions are reasoned through while still staying relatively close to how authority is carried out. In practice, this can create a system where thinking is transparent but decision ownership does not spread as fully as it could. Under pressure, others may understand the logic but still look to you to hold the work together."
    },
    contribution_process_authority_process: {
      title: "Pressure risk",
      text: "A clear pressure pattern in your profile is proximity to execution. In both contribution and authority, you may rely on staying close enough to the work to know it is on track. This often supports strong standards and reliability. Under pressure, though, it can make scale harder because leadership confidence remains tied to your ongoing visibility into how the work is unfolding."
    },
    loyalty_identity_presence_identity: {
      title: "Pressure risk",
      text: "A clear pressure pattern in your profile is careful management of how leadership is understood in relationally charged moments. In both loyalty and presence, you may pay close attention to credibility, trust, and how your response is being interpreted. This often helps you navigate difficult situations thoughtfully. Under pressure, though, it can pull energy away from the deeper issue in the room and toward managing the meaning of the moment."
    },
    process_plus_identity: {
      title: "Pressure risk",
      text: "A broader tension in your profile is that leadership may become effortful in two directions at once: staying close to the work and staying aware of how your leadership stance is being received. This often creates conscientious leadership. Under pressure, though, it can mean you are carrying both execution and interpretation at the same time, which increases load and can slow the spread of ownership."
    },
    system_plus_identity: {
      title: "Pressure risk",
      text: "A broader tension in your profile is the pull to hold both systemic complexity and social interpretation at once. This can make you thoughtful, nuanced, and hard to destabilize. Under pressure, though, too much energy can go into understanding the whole system and tracking how the moment is being read, leaving less room for simplicity, clarity, or direct movement."
    },
    outcome_plus_process: {
      title: "Pressure risk",
      text: "A broader tension in your profile is the pull to protect both the result and the path the work is taking. This can create strong execution discipline and follow-through. Under pressure, though, it can narrow room for experimentation and increase the chance that you re-enter the work before others have fully grown into ownership."
    },
    identity_plus_system_plus_process: {
      title: "Pressure risk",
      text: "Your profile suggests that when stakes rise, you may work hard to keep the system sound, the process visible, and your leadership stance credible all at once. This can make you highly responsible and hard to catch off guard. Under pressure, though, that combination can become heavy: too much leadership load stays with you because you are holding structure, execution, and interpretation simultaneously."
    },
    balanced_general: {
      title: "Pressure risk",
      text: "Because your profile is mixed across domains, the main risk is not one fixed blind spot but a pattern of shifting defaults depending on the situation. Under pressure, this can make your leadership harder for others to predict. The developmental task is not to eliminate that flexibility, but to become more conscious of which pattern you are defaulting to in which kind of moment."
    }
  },
  questions: {
    contribution: "Where does your leadership still depend on staying close enough to the work to feel confident in its direction?",
    reasoning: "What assumptions are built into the way you are currently framing the problem?",
    authority: "Where would reducing oversight create more real ownership rather than more risk?",
    loyalty: "What becomes possible when you stop managing how a difficult decision will be interpreted?",
    presence: "What might you notice if you stayed curious a little longer before moving to explain, manage, or resolve the moment?",
    general_process: "Where are you still using visibility as a substitute for trust?",
    general_identity: "Where are you spending energy managing interpretation rather than staying with the leadership tension itself?",
    general_system: "Where does strong thinking need to turn into clearer authority or action?"
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
  // Match leverage domain directly if a question exists for it
  // (resolved dynamically in selector — these handle the general fallbacks)
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
function getSynthesis(results, leverageDomain) {
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

  // Leverage: accept explicit override, otherwise auto-detect lowest orientation-order domain
  let leverageKey;
  if (leverageDomain && SC.leverage[leverageDomain]) {
    leverageKey = leverageDomain;
  } else {
    const lowestDomain = [1,2,3,4,5].reduce((a, b) =>
      (ORIENTATION_ORDER[results[a].placement]||0) <= (ORIENTATION_ORDER[results[b].placement]||0) ? a : b
    );
    leverageKey = DOMAIN_KEYS[lowestDomain];
  }

  const riskKey = runRules(RISK_RULES, bucketProfile, counts);

  // Question: match leverage domain first, then run general rules
  const questionKey = (SC.questions[leverageKey])
    ? leverageKey
    : runRules(QUESTION_RULES, bucketProfile, counts);

  // ── LAYER 3: CONTENT ASSEMBLY ──
  const cluster  = SC.clusters[clusterKey];
  const leverage = SC.leverage[leverageKey];
  const risk     = SC.risks[riskKey];
  const question = SC.questions[questionKey];

  // Integrative sentence connecting leverage domain to cluster pattern
  const integrativeMap = {
    contribution: "How you experience your contribution shapes everything downstream: how much oversight feels necessary, how readily authority moves to others, and whether your leadership depends on your presence in the work.",
    reasoning:    "How you reason through decisions shapes the quality of conversation around you — and whether others can engage with complexity or mainly follow your lead.",
    authority:    "How authority moves through your team determines whether your leadership scales — or whether capacity quietly accumulates back toward you under pressure.",
    loyalty:      "How you hold the tension between your people and the organization shapes whether difficult decisions land with clarity or get softened in ways that cost trust over time.",
    presence:     "How you respond when pressure enters the room shapes whether difficult conversations open up or close down — and whether the people around you feel they can bring the real issue forward."
  };
  const integrative = integrativeMap[leverageKey] || "";

  return { cluster, leverage, risk, question, integrative };
}


export { SYNTHESIS_CONTENT, CLUSTER_RULES, RISK_RULES, QUESTION_RULES, getSynthesis, DOMAIN_KEYS, ORIENT_BUCKET, ORIENTATION_ORDER };
