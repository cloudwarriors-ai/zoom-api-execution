const axios = require('axios');
const crypto = require('crypto');

class ZoomAPIClient {
  constructor() {
    this.clientId = process.env.ZOOM_CLIENT_ID;
    this.clientSecret = process.env.ZOOM_CLIENT_SECRET;
    this.accountId = process.env.ZOOM_ACCOUNT_ID;
    this.baseUrl = process.env.ZOOM_API_BASE_URL || 'https://api.zoom.us/v2';
    this.oauthUrl = process.env.ZOOM_OAUTH_URL || 'https://zoom.us/oauth';

    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Generate access token using Server-to-Server OAuth
   */
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

      const response = await axios.post(`${this.oauthUrl}/token`, null, {
        params: {
          grant_type: 'account_credentials',
          account_id: this.accountId
        },
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      // Token expires in 1 hour, set expiry to 50 minutes for safety
      this.tokenExpiry = Date.now() + (50 * 60 * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Failed to get access token:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Make authenticated API request
   */
  async makeRequest(method, endpoint, data = null, params = {}) {
    const token = await this.getAccessToken();

    try {
      const config = {
        method,
        url: `${this.baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params
      };

      if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`API request failed: ${method} ${endpoint}`, error.response?.data || error.message);
      throw error;
    }
  }

  // ===== ZOOM PHONE APIs =====

  /**
   * List phone users
   */
  async getPhoneUsers(params = {}) {
    return this.makeRequest('GET', '/phone/users', null, params);
  }

  /**
   * Get phone user details
   */
  async getPhoneUser(userId) {
    return this.makeRequest('GET', `/phone/users/${userId}`);
  }

  /**
   * Update phone user
   */
  async updatePhoneUser(userId, userData) {
    return this.makeRequest('PATCH', `/phone/users/${userId}`, userData);
  }

  /**
   * List phone numbers
   */
  async getPhoneNumbers(params = {}) {
    return this.makeRequest('GET', '/phone/numbers', null, params);
  }

  /**
   * Get phone number details
   */
  async getPhoneNumber(numberId) {
    return this.makeRequest('GET', `/phone/numbers/${numberId}`);
  }

  /**
   * Unassign a phone number from a user
   */
  async unassignPhoneNumber(numberId) {
    return this.makeRequest('DELETE', `/phone/numbers/${numberId}/assignment`);
  }

  /**
   * Update phone number assignment
   */
  async updatePhoneNumber(numberId, data) {
    return this.makeRequest('PATCH', `/phone/numbers/${numberId}`, data);
  }

  /**
   * Assign phone number to user
   */
  async assignPhoneNumber(numberId, userId) {
    return this.makeRequest('POST', `/phone/numbers/${numberId}/assign`, { user_id: userId });
  }

  /**
   * Unassign phone number from user
   */
  async unassignPhoneNumberFromUser(numberId) {
    return this.makeRequest('DELETE', `/phone/numbers/${numberId}/assignee`);
  }

  /**
   * Assign phone number to user
   */
  async assignPhoneNumberToUser(userId, phoneNumberId) {
    return this.makeRequest('POST', `/phone/users/${userId}/phone_numbers`, {
      phone_numbers: [{ id: phoneNumberId }]
    });
  }

  /**
   * Unassign phone number from specific user
   */
  async unassignPhoneNumberFromUserById(userId, phoneNumberId) {
    return this.makeRequest('DELETE', `/phone/users/${userId}/phone_numbers/${phoneNumberId}`);
  }

  /**
   * Get call logs
   */
  async getCallLogs(params = {}) {
    return this.makeRequest('GET', '/phone/call_logs', null, params);
  }

  /**
   * Get call log details
   */
  async getCallLog(callId) {
    return this.makeRequest('GET', `/phone/call_logs/${callId}`);
  }

  /**
   * Get call queues
   */
  async getCallQueues(params = {}) {
    return this.makeRequest('GET', '/phone/call_queues', null, params);
  }

  /**
   * Get call queue details
   */
  async getCallQueue(queueId) {
    return this.makeRequest('GET', `/phone/call_queues/${queueId}`);
  }

  /**
   * Get call queue members
   */
  async getCallQueueMembers(queueId) {
    return this.makeRequest('GET', `/phone/call_queues/${queueId}/members`);
  }

  /**
   * Get voicemail messages
   */
  async getVoicemails(params = {}) {
    return this.makeRequest('GET', '/phone/voicemail', null, params);
  }

  /**
   * Get voicemail details
   */
  async getVoicemail(voicemailId) {
    return this.makeRequest('GET', `/phone/voicemail/${voicemailId}`);
  }

  /**
   * Get recordings
   */
  async getRecordings(params = {}) {
    return this.makeRequest('GET', '/phone/recordings', null, params);
  }

  /**
   * Get recording details
   */
  async getRecording(recordingId) {
    return this.makeRequest('GET', `/phone/recordings/${recordingId}`);
  }

  /**
   * Get blocked numbers list
   */
  async getBlockedNumbers() {
    return this.makeRequest('GET', '/phone/blocked_numbers');
  }

  /**
   * Get phone settings
   */
  async getPhoneSettings() {
    return this.makeRequest('GET', '/phone/settings');
  }

  // ===== ZOOM CONTACT CENTER APIs =====

  /**
   * List contact center queues
   */
  async getQueues(params = {}) {
    return this.makeRequest('GET', '/contact_center/queues', null, params);
  }

  /**
   * Get queue details
   */
  async getQueue(queueId) {
    return this.makeRequest('GET', `/contact_center/queues/${queueId}`);
  }

  /**
   * Get queue statistics
   */
  async getQueueStats(queueId, params = {}) {
    return this.makeRequest('GET', `/contact_center/queues/${queueId}/statistics`, null, params);
  }

  /**
   * Get queue members
   */
  async getQueueMembers(queueId) {
    return this.makeRequest('GET', `/contact_center/queues/${queueId}/members`);
  }

  /**
   * Get contact center settings
   */
  async getContactCenterSettings() {
    return this.makeRequest('GET', '/contact_center/settings');
  }

  /**
   * Get contact center reports
   */
  async getReports(params = {}) {
    return this.makeRequest('GET', '/contact_center/reports', null, params);
  }

  /**
   * Get contact center analytics
   */
  async getAnalytics(params = {}) {
    return this.makeRequest('GET', '/contact_center/analytics', null, params);
  }

  /**
   * Get real-time metrics
   */
  async getRealTimeMetrics() {
    return this.makeRequest('GET', '/contact_center/realtime_metrics');
  }

  /**
   * List contacts
   */
  async getContacts(params = {}) {
    return this.makeRequest('GET', '/contact_center/contacts', null, params);
  }

  /**
   * Get contact details
   */
  async getContact(contactId) {
    return this.makeRequest('GET', `/contact_center/contacts/${contactId}`);
  }

  /**
   * Create a contact
   */
  async createContact(contactData) {
    return this.makeRequest('POST', '/contact_center/contacts', contactData);
  }

  /**
   * Update a contact
   */
  async updateContact(contactId, contactData) {
    return this.makeRequest('PUT', `/contact_center/contacts/${contactId}`, contactData);
  }

  /**
   * Delete a contact
   */
  async deleteContact(contactId) {
    return this.makeRequest('DELETE', `/contact_center/contacts/${contactId}`);
  }

  /**
   * Get contact interactions
   */
  async getContactInteractions(contactId, params = {}) {
    return this.makeRequest('GET', `/contact_center/contacts/${contactId}/interactions`, null, params);
  }

  /**
   * List dispositions
   */
  async getDispositions() {
    return this.makeRequest('GET', '/contact_center/dispositions');
  }

   /**
    * Get contact center recordings
    */
   async getRecordings(params = {}) {
     return this.makeRequest('GET', '/contact_center/recordings', null, params);
   }

   // ===== SKILLS & SKILL CATEGORIES =====

   /**
    * List skill categories
    */
   async getSkillCategories(params = {}) {
     return this.makeRequest('GET', '/contact_center/skills/categories', null, params);
   }

   /**
    * Create skill category
    */
   async createSkillCategory(categoryData) {
     return this.makeRequest('POST', '/contact_center/skills/categories', categoryData);
   }

   /**
    * Get skill category details
    */
   async getSkillCategory(categoryId) {
     return this.makeRequest('GET', `/contact_center/skills/categories/${categoryId}`);
   }

   /**
    * Update skill category
    */
   async updateSkillCategory(categoryId, categoryData) {
     return this.makeRequest('PATCH', `/contact_center/skills/categories/${categoryId}`, categoryData);
   }

   /**
    * Delete skill category
    */
   async deleteSkillCategory(categoryId) {
     return this.makeRequest('DELETE', `/contact_center/skills/categories/${categoryId}`);
   }

   /**
    * List skills
    */
   async getSkills(params = {}) {
     return this.makeRequest('GET', '/contact_center/skills', null, params);
   }

   /**
    * Create skill
    */
   async createSkill(skillData) {
     return this.makeRequest('POST', '/contact_center/skills', skillData);
   }

   /**
    * Get skill details
    */
   async getSkill(skillId) {
     return this.makeRequest('GET', `/contact_center/skills/${skillId}`);
   }

   /**
    * Update skill
    */
   async updateSkill(skillId, skillData) {
     return this.makeRequest('PATCH', `/contact_center/skills/${skillId}`, skillData);
   }

   /**
    * Delete skill
    */
   async deleteSkill(skillId) {
     return this.makeRequest('DELETE', `/contact_center/skills/${skillId}`);
   }

   /**
    * Get user skills
    */
   async getUserSkills(userId) {
     return this.makeRequest('GET', `/contact_center/users/${userId}/skills`);
   }

   /**
    * Assign skill to user
    */
   async assignSkillToUser(userId, skillId) {
     return this.makeRequest('POST', `/contact_center/users/${userId}/skills`, { skills: [{ skill_id: skillId, proficiency_level: 1 }] });
   }

   /**
    * Remove skill from user
    */
   async removeSkillFromUser(userId, skillId) {
     return this.makeRequest('DELETE', `/contact_center/users/${userId}/skills/${skillId}`);
   }

   // ===== CONTACT CENTER USERS =====

   /**
    * List contact center users
    */
   async getContactCenterUsers(params = {}) {
     return this.makeRequest('GET', '/contact_center/users', null, params);
   }

   /**
    * Get contact center user details
    */
   async getContactCenterUser(userId) {
     return this.makeRequest('GET', `/contact_center/users/${userId}`);
   }

   /**
    * Update contact center user
    */
   async updateContactCenterUser(userId, userData) {
     return this.makeRequest('PATCH', `/contact_center/users/${userId}`, userData);
   }

   // ===== AGENT ROUTING PROFILES =====

   /**
    * List agent routing profiles
    */
   async getAgentRoutingProfiles(params = {}) {
     return this.makeRequest('GET', '/contact_center/agent_routing_profiles', null, params);
   }

   /**
    * Create agent routing profile
    */
   async createAgentRoutingProfile(profileData) {
     return this.makeRequest('POST', '/contact_center/agent_routing_profiles', profileData);
   }

   /**
    * Get agent routing profile details
    */
   async getAgentRoutingProfile(profileId) {
     return this.makeRequest('GET', `/contact_center/agent_routing_profiles/${profileId}`);
   }

   /**
    * Update agent routing profile
    */
   async updateAgentRoutingProfile(profileId, profileData) {
     return this.makeRequest('PATCH', `/contact_center/agent_routing_profiles/${profileId}`, profileData);
   }

   /**
    * Delete agent routing profile
    */
   async deleteAgentRoutingProfile(profileId) {
     return this.makeRequest('DELETE', `/contact_center/agent_routing_profiles/${profileId}`);
   }
 }

module.exports = ZoomAPIClient;