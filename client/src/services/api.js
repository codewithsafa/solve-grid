// SolveMe API Client Service
// Handles all HTTP requests to the backend Express / Prisma API

// const API_BASE = '/api';
const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api`;

/**
 * Fetch all problems with optional filters
 */
export async function getProblems(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'All') query.append('category', params.category);
  if (params.status && params.status !== 'All') query.append('status', params.status);
  if (params.state && params.state !== 'All') query.append('state', params.state);
  if (params.search) query.append('search', params.search);

  const qs = query.toString() ? `?${query.toString()}` : '';
  const res = await fetch(`${API_BASE}/problems${qs}`);
  if (!res.ok) throw new Error(`Failed to fetch problems: ${res.statusText}`);
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch single problem details
 */
export async function getProblemById(id) {
  const res = await fetch(`${API_BASE}/problems/${id}`);
  if (!res.ok) throw new Error(`Problem not found`);
  const json = await res.json();
  return json.data;
}

/**
 * Create a new civic problem report
 */
export async function createProblem(payload) {
  const res = await fetch(`${API_BASE}/problems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to submit problem');
  }
  return json.data;
}

/**
 * Upvote a problem
 */
export async function upvoteProblem(id) {
  const res = await fetch(`${API_BASE}/problems/${id}/upvote`, {
    method: 'POST'
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to upvote problem');
  }
  return json.data;
}

/**
 * Demo Control: Update status of a problem
 */
export async function updateProblemStatus(id, status) {
  const res = await fetch(`${API_BASE}/problems/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to update problem status');
  }
  return json.data;
}

/**
 * Post a discussion comment
 */
export async function postDiscussion(problemId, content) {
  const res = await fetch(`${API_BASE}/problems/${problemId}/discussions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to post discussion');
  }
  return json.data;
}

/**
 * Add community context / problem info
 */
export async function addProblemInfo(problemId, content) {
  const res = await fetch(`${API_BASE}/problems/${problemId}/info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error || 'Failed to add problem info');
  }
  return json.data;
}

/**
 * Fetch dashboard statistics
 */
export async function getDashboardStats() {
  const res = await fetch(`${API_BASE}/dashboard/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard statistics');
  const json = await res.json();
  return json.data;
}
