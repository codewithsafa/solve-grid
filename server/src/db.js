// SolveMe Database Layer
// Handles Prisma ORM connection to PostgreSQL / Neon with a resilient fallback for local evaluation

require('dotenv').config();
const { seedProblems } = require('./seedData');

let prisma = null;
let usePrisma = false;

const databaseUrl = process.env.DATABASE_URL;

if (databaseUrl && !databaseUrl.includes("YOUR_NEON_DATABASE_CONNECTION_STRING")) {
  try {
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    usePrisma = true;
    console.log("🔌 [SolveMe DB] Prisma ORM initialized with PostgreSQL/Neon.");
  } catch (err) {
    console.warn("⚠️ [SolveMe DB] Prisma client not generated or failed to load. Falling back to local store.");
    usePrisma = false;
  }
} else {
  console.log("ℹ️ [SolveMe DB] Notice: DATABASE_URL is set to placeholder 'YOUR_NEON_DATABASE_CONNECTION_STRING'.");
  console.log("🚀 [SolveMe DB] Running with built-in demonstration dataset (10 realistic civic problems).");
  console.log("👉 To connect live Neon PostgreSQL: Update DATABASE_URL in server/.env, then run: npx prisma db push && npm run seed");
}

// In-memory / Fallback Dataset
let localProblems = JSON.parse(JSON.stringify(seedProblems));

const db = {
  isPrisma: () => usePrisma,

  // Get all problems with optional search and filters
  async getProblems({ category, status, search, state } = {}) {
    if (usePrisma) {
      try {
        const where = {};
        if (category && category !== "All") where.category = category;
        if (status && status !== "All") where.status = status;
        if (state && state !== "All") where.state = state;
        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { district: { contains: search, mode: 'insensitive' } },
            { hashtags: { contains: search, mode: 'insensitive' } }
          ];
        }
        return await prisma.problem.findMany({
          where,
          include: {
            discussions: { orderBy: { createdAt: 'desc' } },
            problemInfos: { orderBy: { createdAt: 'desc' } }
          },
          orderBy: { createdAt: 'desc' }
        });
      } catch (err) {
        console.warn("Prisma query failed, using local store:", err.message);
      }
    }

    // Local filter
    let results = [...localProblems];
    if (category && category !== "All") {
      results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (status && status !== "All") {
      results = results.filter(p => p.status === status);
    }
    if (state && state !== "All") {
      results = results.filter(p => p.state.toLowerCase() === state.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.hashtags.toLowerCase().includes(q)
      );
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // Get single problem by ID
  async getProblemById(id) {
    if (usePrisma) {
      try {
        return await prisma.problem.findUnique({
          where: { id },
          include: {
            discussions: { orderBy: { createdAt: 'desc' } },
            problemInfos: { orderBy: { createdAt: 'desc' } }
          }
        });
      } catch (err) {
        console.warn("Prisma query failed, using local store:", err.message);
      }
    }
    return localProblems.find(p => p.id === id) || null;
  },

  // Create a new problem (default status: "SUBMITTED")
  async createProblem(data) {
    const newProblem = {
      title: data.title,
      description: data.description,
      category: data.category,
      hashtags: data.hashtags || "",
      state: data.state,
      district: data.district,
      imageUrl: data.imageUrl || null,
      videoUrl: data.videoUrl || null,
      status: "SUBMITTED",
      upvotes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (usePrisma) {
      try {
        return await prisma.problem.create({
          data: newProblem,
          include: {
            discussions: true,
            problemInfos: true
          }
        });
      } catch (err) {
        console.warn("Prisma create failed, saving to local store:", err.message);
      }
    }

    const localItem = {
      ...newProblem,
      id: `prob_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      discussions: [],
      problemInfos: []
    };
    localProblems.unshift(localItem);
    return localItem;
  },

  // Upvote a problem
  async upvoteProblem(id) {
    if (usePrisma) {
      try {
        return await prisma.problem.update({
          where: { id },
          data: { upvotes: { increment: 1 } },
          include: { discussions: true, problemInfos: true }
        });
      } catch (err) {
        console.warn("Prisma upvote failed, updating local store:", err.message);
      }
    }

    const prob = localProblems.find(p => p.id === id);
    if (!prob) return null;
    prob.upvotes = (prob.upvotes || 0) + 1;
    return prob;
  },

  // Update status (Demo Control / Tracking)
  async updateStatus(id, status) {
    const validStatuses = ["SUBMITTED", "CATEGORISED", "UNDER_VALIDATION", "VALIDATED", "IN_PROGRESS", "RESOLVED"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}`);
    }

    if (usePrisma) {
      try {
        return await prisma.problem.update({
          where: { id },
          data: { status, updatedAt: new Date() },
          include: { discussions: true, problemInfos: true }
        });
      } catch (err) {
        console.warn("Prisma updateStatus failed, updating local store:", err.message);
      }
    }

    const prob = localProblems.find(p => p.id === id);
    if (!prob) return null;
    prob.status = status;
    prob.updatedAt = new Date().toISOString();
    return prob;
  },

  // Add a discussion comment
  async addDiscussion(problemId, content) {
    if (!content || !content.trim()) {
      throw new Error("Discussion content cannot be empty");
    }

    if (usePrisma) {
      try {
        return await prisma.discussion.create({
          data: {
            problemId,
            content: content.trim(),
            createdAt: new Date()
          }
        });
      } catch (err) {
        console.warn("Prisma addDiscussion failed, updating local store:", err.message);
      }
    }

    const prob = localProblems.find(p => p.id === problemId);
    if (!prob) return null;
    const newDisc = {
      id: `disc_${Date.now()}`,
      problemId,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };
    if (!prob.discussions) prob.discussions = [];
    prob.discussions.unshift(newDisc);
    return newDisc;
  },

  // Add additional problem information (community context)
  async addProblemInfo(problemId, content) {
    if (!content || !content.trim()) {
      throw new Error("Additional information content cannot be empty");
    }

    if (usePrisma) {
      try {
        return await prisma.problemInfo.create({
          data: {
            problemId,
            content: content.trim(),
            createdAt: new Date()
          }
        });
      } catch (err) {
        console.warn("Prisma addProblemInfo failed, updating local store:", err.message);
      }
    }

    const prob = localProblems.find(p => p.id === problemId);
    if (!prob) return null;
    const newInfo = {
      id: `info_${Date.now()}`,
      problemId,
      content: content.trim(),
      createdAt: new Date().toISOString()
    };
    if (!prob.problemInfos) prob.problemInfos = [];
    prob.problemInfos.unshift(newInfo);
    return newInfo;
  },

  // Get aggregated dashboard statistics
  async getDashboardStats() {
    let all = [];
    if (usePrisma) {
      try {
        all = await prisma.problem.findMany();
      } catch (err) {
        all = localProblems;
      }
    } else {
      all = localProblems;
    }

    const totalProblems = all.length;
    const categoriesSet = new Set(all.map(p => p.category));
    const statesSet = new Set(all.map(p => p.state));
    const districtsSet = new Set(all.map(p => `${p.district}, ${p.state}`));

    // Aggregations
    const byCategory = {};
    const byState = {};
    const byDistrict = {};
    const byStatus = {};

    all.forEach(p => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
      byState[p.state] = (byState[p.state] || 0) + 1;
      const distKey = `${p.district} (${p.state})`;
      byDistrict[distKey] = (byDistrict[distKey] || 0) + 1;
      byStatus[p.status] = (byStatus[p.status] || 0) + 1;
    });

    return {
      totals: {
        problems: totalProblems,
        categories: categoriesSet.size,
        states: statesSet.size,
        districts: districtsSet.size
      },
      byCategory: Object.entries(byCategory).map(([name, count]) => ({ name, count })),
      byState: Object.entries(byState).map(([name, count]) => ({ name, count })),
      byDistrict: Object.entries(byDistrict).map(([name, count]) => ({ name, count })),
      byStatus: Object.entries(byStatus).map(([name, count]) => ({ name, count }))
    };
  }
};

module.exports = db;
