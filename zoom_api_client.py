import os
import requests
import base64
import time
from typing import Optional, Dict, Any

class ZoomAPIClient:
    def __init__(self):
        self.client_id = os.getenv('ZOOM_CLIENT_ID')
        self.client_secret = os.getenv('ZOOM_CLIENT_SECRET')
        self.account_id = os.getenv('ZOOM_ACCOUNT_ID')
        self.base_url = os.getenv('ZOOM_API_BASE_URL', 'https://api.zoom.us/v2')
        self.oauth_url = os.getenv('ZOOM_OAUTH_URL', 'https://zoom.us/oauth')

        self.access_token: Optional[str] = None
        self.token_expiry: Optional[float] = None

    def get_access_token(self) -> str:
        """Generate access token using Server-to-Server OAuth"""
        if self.access_token and self.token_expiry and time.time() < self.token_expiry:
            return self.access_token

        try:
            auth = base64.b64encode(f"{self.client_id}:{self.client_secret}".encode()).decode()

            response = requests.post(
                f"{self.oauth_url}/token",
                params={
                    'grant_type': 'account_credentials',
                    'account_id': self.account_id
                },
                headers={
                    'Authorization': f'Basic {auth}',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            )

            response.raise_for_status()
            data = response.json()

            self.access_token = data['access_token']
            # Token expires in 1 hour, set expiry to 50 minutes for safety
            self.token_expiry = time.time() + (50 * 60)

            return self.access_token
        except requests.RequestException as e:
            print(f'Failed to get access token: {e}')
            raise

    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Make authenticated API request"""
        token = self.get_access_token()

        try:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }

            url = f"{self.base_url}{endpoint}"

            response = requests.request(
                method,
                url,
                headers=headers,
                json=data,
                params=params
            )

            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f'API request failed: {method} {endpoint} - {e}')
            raise

    # ===== ZOOM PHONE APIs =====

    def get_phone_users(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """List phone users"""
        return self.make_request('GET', '/phone/users', params=params or {})

    def get_phone_user(self, user_id: str) -> Dict[str, Any]:
        """Get phone user details"""
        return self.make_request('GET', f'/phone/users/{user_id}')

    def update_phone_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update phone user"""
        return self.make_request('PATCH', f'/phone/users/{user_id}', user_data)

    def get_phone_numbers(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """List phone numbers"""
        return self.make_request('GET', '/phone/numbers', params=params or {})

    def get_phone_number(self, number_id: str) -> Dict[str, Any]:
        """Get phone number details"""
        return self.make_request('GET', f'/phone/numbers/{number_id}')

    def unassign_phone_number(self, number_id: str) -> Dict[str, Any]:
        """Unassign a phone number"""
        return self.make_request('DELETE', f'/phone/numbers/{number_id}/assignment')

    def update_phone_number(self, number_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Update phone number assignment"""
        return self.make_request('PATCH', f'/phone/numbers/{number_id}', data)

    def assign_phone_number(self, number_id: str, user_id: str) -> Dict[str, Any]:
        """Assign phone number to user"""
        return self.make_request('POST', f'/phone/numbers/{number_id}/assign', {'user_id': user_id})

    def unassign_phone_number_from_user(self, number_id: str) -> Dict[str, Any]:
        """Unassign phone number from user"""
        return self.make_request('DELETE', f'/phone/numbers/{number_id}/assignee')

    def assign_phone_number_to_user(self, user_id: str, phone_number_id: str) -> Dict[str, Any]:
        """Assign phone number to user"""
        return self.make_request('POST', f'/phone/users/{user_id}/phone_numbers', {
            'phone_numbers': [{'id': phone_number_id}]
        })

    def unassign_phone_number_from_user_by_id(self, user_id: str, phone_number_id: str) -> Dict[str, Any]:
        """Unassign phone number from specific user"""
        return self.make_request('DELETE', f'/phone/users/{user_id}/phone_numbers/{phone_number_id}')

    def get_call_logs(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Get call logs"""
        return self.make_request('GET', '/phone/call_logs', params=params or {})

    def get_call_log(self, call_id: str) -> Dict[str, Any]:
        """Get call log details"""
        return self.make_request('GET', f'/phone/call_logs/{call_id}')

    def get_call_queues(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Get call queues"""
        return self.make_request('GET', '/phone/call_queues', params=params or {})

    def get_call_queue(self, queue_id: str) -> Dict[str, Any]:
        """Get call queue details"""
        return self.make_request('GET', f'/phone/call_queues/{queue_id}')

    def get_call_queue_members(self, queue_id: str) -> Dict[str, Any]:
        """Get call queue members"""
        return self.make_request('GET', f'/phone/call_queues/{queue_id}/members')

    def get_voicemails(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Get voicemail messages"""
        return self.make_request('GET', '/phone/voicemail', params=params or {})

    def get_voicemail(self, voicemail_id: str) -> Dict[str, Any]:
        """Get voicemail details"""
        return self.make_request('GET', f'/phone/voicemail/{voicemail_id}')

    def get_recordings(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Get recordings"""
        return self.make_request('GET', '/phone/recordings', params=params or {})

    def get_recording(self, recording_id: str) -> Dict[str, Any]:
        """Get recording details"""
        return self.make_request('GET', f'/phone/recordings/{recording_id}')

    def get_blocked_numbers(self) -> Dict[str, Any]:
        """Get blocked numbers list"""
        return self.make_request('GET', '/phone/blocked_numbers')

    def get_phone_settings(self) -> Dict[str, Any]:
        """Get phone settings"""
        return self.make_request('GET', '/phone/settings')

    # ===== ZOOM CONTACT CENTER APIs =====

    def get_queues(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """List contact center queues"""
        return self.make_request('GET', '/contact_center/queues', params=params or {})

    def get_queue(self, queue_id: str) -> Dict[str, Any]:
        """Get queue details"""
        return self.make_request('GET', f'/contact_center/queues/{queue_id}')

    def get_queue_stats(self, queue_id: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Get queue statistics"""
        return self.make_request('GET', f'/contact_center/queues/{queue_id}/statistics', params=params or {})

    def get_queue_members(self, queue_id: str) -> Dict[str, Any]:
        """Get queue members"""
        return self.make_request('GET', f'/contact_center/queues/{queue_id}/members')

    def get_contact_center_settings(self) -> Dict[str, Any]:
        """Get contact center settings"""
        return self.make_request('GET', '/contact_center/settings')

    def get_reports(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Get contact center reports"""
        return self.make_request('GET', '/contact_center/reports', params=params or {})

    def get_analytics(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Get contact center analytics"""
        return self.make_request('GET', '/contact_center/analytics', params=params or {})

    def get_real_time_metrics(self) -> Dict[str, Any]:
        """Get real-time metrics"""
        return self.make_request('GET', '/contact_center/realtime_metrics')

    def get_contacts(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """List contacts"""
        return self.make_request('GET', '/contact_center/contacts', params=params or {})

    def get_contact(self, contact_id: str) -> Dict[str, Any]:
        """Get contact details"""
        return self.make_request('GET', f'/contact_center/contacts/{contact_id}')

    def create_contact(self, contact_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a contact"""
        return self.make_request('POST', '/contact_center/contacts', contact_data)

    def update_contact(self, contact_id: str, contact_data: Dict[str, Any]) -> Dict[str, Any]:
        """Update a contact"""
        return self.make_request('PUT', f'/contact_center/contacts/{contact_id}', contact_data)

    def delete_contact(self, contact_id: str) -> Dict[str, Any]:
        """Delete a contact"""
        return self.make_request('DELETE', f'/contact_center/contacts/{contact_id}')

    def get_contact_interactions(self, contact_id: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Get contact interactions"""
        return self.make_request('GET', f'/contact_center/contacts/{contact_id}/interactions', params=params or {})

    def get_dispositions(self) -> Dict[str, Any]:
        """List dispositions"""
        return self.make_request('GET', '/contact_center/dispositions')

    def get_contact_center_recordings(self, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Get contact center recordings"""
        return self.make_request('GET', '/contact_center/recordings', params=params or {})