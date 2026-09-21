// Real-world Indian civic problem records uploaded in real_world_assets
// Used by both prisma/seed.js and the fallback in-memory store in src/db.js

const seedProblems = [
  {
    id: "prob_1",
    title: "Damaged pillars and exposed iron rods on ₹64-crore Keni Bridge over Falgu River",
    description: "Bihar may see another bridge collapse. A ₹64-crore worth Keni Bridge in Gaya is already showing damaged pillars and exposed iron rods. In the past 5 years, around 26 bridges have collapsed in Bihar! How long will this mockery of citizens be tolerated? Location: Keni Bridge, Falgu River, Gaya District, Bihar.",
    category: "Civic Infrastructure",
    hashtags: "#bridgecollapse #infrastructure #falgu #gaya #bihar #publicsafety #investigation",
    state: "Bihar",
    district: "Gaya",
    imageUrl: null,
    videoUrl: "/sih/videos/WhatsApp Video 2026-09-20 at 10.49.48 PM.mp4",
    status: "VALIDATED",
    upvotes: 184,
    createdAt: new Date("2026-09-18T14:20:00Z").toISOString(),
    updatedAt: new Date("2026-09-20T18:30:00Z").toISOString(),
    discussions: [
      {
        id: "disc_1_1",
        content: "This video clearly shows pillar base concrete spalling with rebar rusting away under flood currents. Vehicles are still crossing daily!",
        createdAt: new Date("2026-09-19T10:15:00Z").toISOString()
      },
      {
        id: "disc_1_2",
        content: "After the recent bridge collapses across Araria and Siwan, why has no emergency structural audit team visited the Keni bridge site yet?",
        createdAt: new Date("2026-09-19T16:40:00Z").toISOString()
      },
      {
        id: "disc_1_3",
        content: "Heavy overloaded sand dumpers cross every night. Load limits must be enforced with height barriers immediately.",
        createdAt: new Date("2026-09-20T08:20:00Z").toISOString()
      }
    ],
    problemInfos: [
      {
        id: "info_1_1",
        content: "Source attribution: Courtesy from Reddit user u/Weeboo_6969 on r/SabkiPolKhol with ground video documentation.",
        createdAt: new Date("2026-09-18T15:00:00Z").toISOString()
      },
      {
        id: "info_1_2",
        content: "Project details: ₹64-crore high-level RCC bridge constructed over Falgu river connecting rural Gaya with NH-83 bypass.",
        createdAt: new Date("2026-09-19T11:00:00Z").toISOString()
      },
      {
        id: "info_1_3",
        content: "Formal petition submitted to Bihar Rajya Pul Nirman Nigam Limited (BRPNNL) and Road Construction Department (RCD) requesting urgent structural integrity testing.",
        createdAt: new Date("2026-09-20T14:00:00Z").toISOString()
      }
    ]
  },
  {
    id: "prob_2",
    title: "Several open and unattended manholes exposed for months beneath Noida Metro corridor",
    description: "Dangerous road conditions right under the Noida Metro Aqua Line corridor. Several open and unattended manholes have been left exposed for months beneath the metro pillars. With daily traffic, poor lighting in some sections, and water collecting around these openings, it is extremely hazardous for two-wheelers, cyclists, pedestrians, and cars. Many 2-wheelers and e-rickshaws swerve abruptly when driving in traffic to avoid falling in. For the past 2 years there are no warning signs, covers, or barricades. Water accumulation hiding open manholes causes serious risk for commuters, especially during night-time. Authorities need to act before a major accident occurs.",
    category: "Civic Infrastructure",
    hashtags: "#openmanholes #noidametro #aqualine #roadsafety #publicsafety #infrastructure #noida",
    state: "Uttar Pradesh",
    district: "Gautam Buddha Nagar",
    imageUrl: null,
    videoUrl: "/sih/videos/WhatsApp Video 2026-09-20 at 10.49.53 PM.mp4",
    status: "IN_PROGRESS",
    upvotes: 156,
    createdAt: new Date("2026-09-16T09:10:00Z").toISOString(),
    updatedAt: new Date("2026-09-20T21:00:00Z").toISOString(),
    discussions: [
      {
        id: "disc_2_1",
        content: "Saw a delivery rider fall right into one of these pits last week when rain water submerged the lane. Fortunately other commuters pulled him out.",
        createdAt: new Date("2026-09-17T12:00:00Z").toISOString()
      },
      {
        id: "disc_2_2",
        content: "Street lights on this single-lane metro service corridor are dim or non-functional at night, turning these open manholes into deathtraps.",
        createdAt: new Date("2026-09-18T19:30:00Z").toISOString()
      },
      {
        id: "disc_2_3",
        content: "Maintenance sub-contractor placed basic warning cones yesterday afternoon following citizen outcry.",
        createdAt: new Date("2026-09-20T17:45:00Z").toISOString()
      }
    ],
    problemInfos: [
      {
        id: "info_2_1",
        content: "Source attribution: Courtesy from Reddit user u/bulba100 on r/SabkiPolKhol with ground video.",
        createdAt: new Date("2026-09-16T10:00:00Z").toISOString()
      },
      {
        id: "info_2_2",
        content: "Location span: Aqua Line metro pillar numbers 120 through 145 along Noida-Greater Noida Expressway link corridor.",
        createdAt: new Date("2026-09-17T14:30:00Z").toISOString()
      },
      {
        id: "info_2_3",
        content: "Grievance ticket logged with Noida Authority Public Health & Civil Maintenance department (Ticket #NOI-CIV-2026-8819). Cast iron pre-cast lids requisitioned.",
        createdAt: new Date("2026-09-19T16:00:00Z").toISOString()
      }
    ]
  },
  {
    id: "prob_3",
    title: "Dangerous tangled high-voltage electrical wiring and dangling live cables at street intersection",
    description: "Chaotic sight at busy city chauraha in Bokaro: an extreme mess of tangled low-hanging power lines, exposed distribution junction boxes, and illegal cable hookings directly above the pedestrian walkway. Previously someone in the neighborhood touched a pole with a metal rod resulting in severe explosive flash and third-degree burn injuries. During storms, live sparks drop on passing commuters.",
    category: "Public Safety",
    hashtags: "#electricalhazard #livewires #bokaro #jharkhand #publicsafety #electrocution #jbvnl",
    state: "Jharkhand",
    district: "Bokaro",
    imageUrl: "/sih/images/WhatsApp Image 2026-09-20 at 11.40.26 PM.jpeg",
    videoUrl: null,
    status: "UNDER_VALIDATION",
    upvotes: 89,
    createdAt: new Date("2026-09-17T16:45:00Z").toISOString(),
    updatedAt: new Date("2026-09-20T12:00:00Z").toISOString(),
    discussions: [
      {
        id: "disc_3_1",
        content: "When high-body trucks pass this chauraha, their rooftop luggage carriers repeatedly snag against these dangling black wire bundles.",
        createdAt: new Date("2026-09-18T11:20:00Z").toISOString()
      },
      {
        id: "disc_3_2",
        content: "Multiple broadband and local cable TV operators have strung dozens of unbundled cables without safety clamps.",
        createdAt: new Date("2026-09-19T14:10:00Z").toISOString()
      }
    ],
    problemInfos: [
      {
        id: "info_3_1",
        content: "Source attribution: Courtesy from Reddit user u/gilli.admin23 on r/sargodha with field photograph.",
        createdAt: new Date("2026-09-17T17:15:00Z").toISOString()
      },
      {
        id: "info_3_2",
        content: "Jurisdiction: Jharkhand Bijli Vitran Nigam Limited (JBVNL) Bokaro Urban Electric Supply Division.",
        createdAt: new Date("2026-09-18T15:30:00Z").toISOString()
      },
      {
        id: "info_3_3",
        content: "Local merchants association submitted formal memorandum demanding conversion to Aerial Bunched Cables (ABC) or underground trenching.",
        createdAt: new Date("2026-09-20T09:00:00Z").toISOString()
      }
    ]
  },
  {
    id: "prob_4",
    title: "Severe street waterlogging and broken municipal drainage turning residential lane into artificial lake",
    description: "Honestly, walking out of the house after it rains has become an extreme sport. Stagnant wastewater has been sitting on our street for days, getting darker and smellier by the hour. The neighborhood is dealing with collapsed underground drains and blocked culverts. We have complained to the local municipality so many times about the broken drainage system, but nothing ever happens. Mosquitoes and toxic odors are making ground-floor houses unlivable.",
    category: "Sanitation",
    hashtags: "#waterlogging #brokendrainage #deoghar #jharkhand #sanitation #publichealth #civicissue",
    state: "Jharkhand",
    district: "Deoghar",
    imageUrl: "/sih/images/WhatsApp Image 2026-09-21 at 10.25.37 AM.jpeg",
    videoUrl: null,
    status: "CATEGORISED",
    upvotes: 112,
    createdAt: new Date("2026-09-19T08:30:00Z").toISOString(),
    updatedAt: new Date("2026-09-21T07:15:00Z").toISOString(),
    discussions: [
      {
        id: "disc_4_1",
        content: "School children and elderly residents cannot step outside without wading through knee-deep dirty water. Stagnation has lasted over a week.",
        createdAt: new Date("2026-09-19T13:40:00Z").toISOString()
      },
      {
        id: "disc_4_2",
        content: "The local municipal councillor visited 3 days ago and promised suction tankers, but no equipment has arrived on site.",
        createdAt: new Date("2026-09-20T10:15:00Z").toISOString()
      },
      {
        id: "disc_4_3",
        content: "Water is now beginning to backflow into ground floor porticos and water supply sumps.",
        createdAt: new Date("2026-09-21T06:50:00Z").toISOString()
      }
    ],
    problemInfos: [
      {
        id: "info_4_1",
        content: "Source attribution: Image and verification by [absar.ahmed123] via [GENZ MOVEMENT INDIA] Discord community.",
        createdAt: new Date("2026-09-19T09:00:00Z").toISOString()
      },
      {
        id: "info_4_2",
        content: "Location: Residential connector lane between VIP Chowk and Bilasi Town, Ward 14, Deoghar, Jharkhand.",
        createdAt: new Date("2026-09-19T15:00:00Z").toISOString()
      },
      {
        id: "info_4_3",
        content: "Escalated to Deoghar Municipal Corporation (DMC) Sanitation Engineering Cell for deployment of mobile dewatering pumps.",
        createdAt: new Date("2026-09-20T16:20:00Z").toISOString()
      }
    ]
  },
  {
    id: "prob_5",
    title: "Centuries-old subterranean coal seam fires causing ground fissures, toxic sulfur smoke, and subsidence in Jharia",
    description: "Jharia is in imminent danger of massive ground collapse due to rampant underground coal mine fires. Residents urgently need dignified rehabilitation outside the burning coal-bearing zones on the fringe of the coalfield. Jharia has prime reserves of prime metallurgical coking coal required for Indian steel plants, but the fire in underground seams is historic and cannot be extinguished by conventional means despite crores of rupees spent. Toxic sulfur emissions, surface fissures, and hollow voids endanger thousands of families daily.",
    category: "Environment",
    hashtags: "#jhariafires #coalfires #subsidence #dhanbad #jharkhand #environment #pollution #rehabilitation",
    state: "Jharkhand",
    district: "Dhanbad",
    imageUrl: "/sih/images/images.jpg",
    videoUrl: null,
    status: "SUBMITTED",
    upvotes: 245,
    createdAt: new Date("2026-09-15T11:00:00Z").toISOString(),
    updatedAt: new Date("2026-09-21T08:00:00Z").toISOString(),
    discussions: [
      {
        id: "disc_5_1",
        content: "Smoke vents directly through the concrete floor tiles in houses near Kujama. People wake up coughing blood from chronic toxic gas inhalation.",
        createdAt: new Date("2026-09-16T14:30:00Z").toISOString()
      },
      {
        id: "disc_5_2",
        content: "The rehabilitation process at Belgaria township is moving at a snail's pace. Families lack clean water, jobs, and school facilities there.",
        createdAt: new Date("2026-09-18T17:00:00Z").toISOString()
      },
      {
        id: "disc_5_3",
        content: "Geological surveys indicate active subsidence craters within 100 meters of the primary school and marketplace.",
        createdAt: new Date("2026-09-20T11:15:00Z").toISOString()
      }
    ],
    problemInfos: [
      {
        id: "info_5_1",
        content: "Source attribution: As originally documented and shared by Yogendra Keshary on Quora with field documentation.",
        createdAt: new Date("2026-09-15T12:00:00Z").toISOString()
      },
      {
        id: "info_5_2",
        content: "Historical context: Over 70 underground coal fires have burned continuously across the 450 sq km Jharia Coalfield since 1916.",
        createdAt: new Date("2026-09-17T10:00:00Z").toISOString()
      },
      {
        id: "info_5_3",
        content: "Institutional oversight: Jharia Rehabilitation and Development Authority (JRDA) and Bharat Coking Coal Limited (BCCL) master rehabilitation plan.",
        createdAt: new Date("2026-09-19T18:00:00Z").toISOString()
      }
    ]
  }
];

module.exports = { seedProblems };
