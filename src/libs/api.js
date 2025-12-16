// API utility functions for HR Management System

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<object>} - Response data
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

// AI Agent Coordinator API functions

/**
 * Get Industrial Relations AI Agent features
 * @returns {Promise<object>} - IR features and compliance data
 */
export async function getIndustrialRelations() {
  return apiRequest('/ai-agent-coordinator/industrial-relations');
}

/**
 * Get Employee Relations AI Agent capabilities
 * @returns {Promise<object>} - ER features and compliance data
 */
export async function getEmployeeRelations() {
  return apiRequest('/ai-agent-coordinator/employee-relations');
}

/**
 * Coordinate multiple AI agents for complex HR tasks
 * @param {object} data - Task data
 * @returns {Promise<object>} - Coordination result
 */
export async function coordinateAgents(data) {
  return apiRequest('/ai-agent-coordinator/coordinate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Orchestrate AI agents for complete employee lifecycle
 * @param {object} employeeData - Employee lifecycle data
 * @returns {Promise<object>} - Orchestration result
 */
export async function orchestrateEmployeeLifecycle(employeeData) {
  return apiRequest('/ai-agent-coordinator/employee-lifecycle', {
    method: 'POST',
    body: JSON.stringify({ employeeData }),
  });
}

/**
 * Multi-agent compliance audit orchestration
 * @param {object} auditData - Audit data
 * @returns {Promise<object>} - Audit result
 */
export async function performComplianceAudit(auditData) {
  return apiRequest('/ai-agent-coordinator/compliance-audit', {
    method: 'POST',
    body: JSON.stringify({ auditData }),
  });
}

// HR Data API functions (placeholders for future implementation)

/**
 * Get employee data
 * @param {string} employeeId - Employee ID
 * @returns {Promise<object>} - Employee data
 */
export async function getEmployee(employeeId) {
  return apiRequest(`/employees/${employeeId}`);
}

/**
 * Get attendance records
 * @param {object} filters - Filter parameters
 * @returns {Promise<object>} - Attendance data
 */
export async function getAttendanceRecords(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return apiRequest(`/attendance?${queryString}`);
}

/**
 * Get payroll data
 * @param {object} filters - Filter parameters
 * @returns {Promise<object>} - Payroll data
 */
export async function getPayrollData(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return apiRequest(`/payroll?${queryString}`);
}

/**
 * Get leave management data
 * @param {object} filters - Filter parameters
 * @returns {Promise<object>} - Leave data
 */
export async function getLeaveData(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  return apiRequest(`/leave?${queryString}`);
}
