// src/config/sinsConfig.js

export const DEADLY_SINS = {
  LUST: {
    color: "#FF0055", // Neon Pink
    label: "LUST DETECTED",
    questTitle: "IRON RESOLVE",
    questDescription: "Redirect biological surge into muscle failure.",
    tasks: [
      { id: "l1", text: "20 Pushups (Upper Body)", xp: 25 },
      { id: "l2", text: "20 Squats (Lower Body)", xp: 25 }
    ],
    duration: 120 // 2 minutes
  },
  SLOTH: {
    color: "#00AAFF", // Cyan Blue
    label: "SLOTH DETECTED",
    questTitle: "MOMENTUM KICKSTARTER",
    questDescription: "Force immediate movement to break static friction.",
    tasks: [
      { id: "s1", text: "Make Bed / Clean Desk Area", xp: 15 },
      { id: "s2", text: "Do the '5-Minute Rule' on 1 Task", xp: 35 }
    ],
    duration: 300 // 5 minutes
  },
  GLUTTONY: {
    color: "#FFAA00", // Orange
    label: "GLUTTONY DETECTED",
    questTitle: "SYSTEM PURGE",
    questDescription: "Reject junk input. Stabilize internal hydration.",
    tasks: [
      { id: "g1", text: "Drink 500ml Water", xp: 20 },
      { id: "g2", text: "Eat 1 Raw Fruit/Veg OR Fast for 1hr", xp: 30 }
    ],
    duration: 60 // 1 minute
  },
  WRATH: {
    color: "#FF0000", // Red
    label: "WRATH DETECTED",
    questTitle: "COOLING PROTOCOL",
    questDescription: "Lower cortisol levels. Regain logic control.",
    tasks: [
      { id: "w1", text: "Box Breathing (4-4-4-4) x 5 Cycles", xp: 25 },
      { id: "w2", text: "Write the problem down (Log it)", xp: 25 }
    ],
    duration: 180 // 3 minutes
  },
  ENVY: {
    color: "#00FF00", // Green
    label: "ENVY DETECTED",
    questTitle: "SELF-ANALYSIS",
    questDescription: "Stop external comparison. Analyze internal data.",
    tasks: [
      { id: "e1", text: "List 1 Skill you are building", xp: 25 },
      { id: "e2", text: "Analyze: 'How did they do it?' (Learn)", xp: 25 }
    ],
    duration: 300
  },
  GREED: {
    color: "#FFD700", // Gold
    label: "GREED DETECTED",
    questTitle: "ASSET ALLOCATION",
    questDescription: "Channel hunger for 'more' into knowledge/organization.",
    tasks: [
      { id: "gr1", text: "Read 1 Page of Documentation/Book", xp: 30 },
      { id: "gr2", text: "Organize 1 File Folder / Delete Junk", xp: 20 }
    ],
    duration: 600
  },
  PRIDE: {
    color: "#9900FF", // Purple
    label: "PRIDE DETECTED",
    questTitle: "REALITY CHECK",
    questDescription: "Kill the Ego. Accept that you are still learning.",
    tasks: [
      { id: "p1", text: "Review a past failure (Learn from it)", xp: 25 },
      { id: "p2", text: "Help someone else / Document code", xp: 25 }
    ],
    duration: 300
  }
};
