from flask import Flask, request, jsonify, render_template
from zoom_api_client import ZoomAPIClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
zoom_client = ZoomAPIClient()

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "Zoom API Integration"})

# ===== AUTHENTICATION ENDPOINTS =====

@app.route('/api/auth/test')
def test_auth():
    """Test Zoom API authentication"""
    try:
        user_info = zoom_client.makeRequest('GET', '/users/me')
        return jsonify({
            "success": True,
            "user": {
                "id": user_info.get("id"),
                "email": user_info.get("email"),
                "first_name": user_info.get("first_name"),
                "last_name": user_info.get("last_name")
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ===== USER MANAGEMENT ENDPOINTS =====

@app.route('/api/users', methods=['GET'])
def list_users():
    """List phone users"""
    try:
        page_size = request.args.get('page_size', 30, type=int)
        users = zoom_client.getPhoneUsers({"page_size": page_size})
        return jsonify({"success": True, "users": users})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user details"""
    try:
        user = zoom_client.getPhoneUser(user_id)
        return jsonify({"success": True, "user": user})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<user_id>/extension', methods=['PATCH'])
def update_user_extension(user_id):
    """Update user extension"""
    try:
        data = request.get_json()
        new_extension = data.get('extension_number')

        if not new_extension:
            return jsonify({"success": False, "error": "extension_number required"}), 400

        result = zoom_client.updatePhoneUser(user_id, {"extension_number": new_extension})
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ===== PHONE NUMBER ENDPOINTS =====

@app.route('/api/phone-numbers', methods=['GET'])
def list_phone_numbers():
    """List phone numbers"""
    try:
        page_size = request.args.get('page_size', 30, type=int)
        numbers = zoom_client.getPhoneNumbers({"page_size": page_size})
        return jsonify({"success": True, "phone_numbers": numbers})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/phone-numbers/<number_id>', methods=['GET'])
def get_phone_number(number_id):
    """Get phone number details"""
    try:
        number = zoom_client.getPhoneNumber(number_id)
        return jsonify({"success": True, "phone_number": number})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<user_id>/phone-numbers/<number_id>', methods=['POST'])
def assign_phone_number(user_id, number_id):
    """Assign phone number to user"""
    try:
        result = zoom_client.assignPhoneNumberToUser(user_id, number_id)
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/users/<user_id>/phone-numbers/<number_id>', methods=['DELETE'])
def unassign_phone_number(user_id, number_id):
    """Unassign phone number from user"""
    try:
        result = zoom_client.unassignPhoneNumberFromUserById(user_id, number_id)
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ===== CALL LOG ENDPOINTS =====

@app.route('/api/call-logs', methods=['GET'])
def get_call_logs():
    """Get call logs"""
    try:
        page_size = request.args.get('page_size', 30, type=int)
        from_date = request.args.get('from')
        to_date = request.args.get('to')

        params = {"page_size": page_size}
        if from_date:
            params["from"] = from_date
        if to_date:
            params["to"] = to_date

        logs = zoom_client.getCallLogs(params)
        return jsonify({"success": True, "call_logs": logs})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ===== CALL QUEUE ENDPOINTS =====

@app.route('/api/call-queues', methods=['GET'])
def list_call_queues():
    """List call queues"""
    try:
        queues = zoom_client.getCallQueues()
        return jsonify({"success": True, "call_queues": queues})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/call-queues', methods=['POST'])
def create_call_queue():
    """Create a new call queue"""
    try:
        data = request.get_json()
        name = data.get('name')
        site_id = data.get('site_id')
        extension_number = data.get('extension_number')

        if not all([name, site_id, extension_number]):
            return jsonify({"success": False, "error": "name, site_id, and extension_number required"}), 400

        payload = {
            "name": name,
            "site_id": site_id,
            "extension_number": extension_number
        }

        result = zoom_client.makeRequest('POST', '/phone/call_queues', payload)
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/call-queues/<queue_id>', methods=['GET'])
def get_call_queue(queue_id):
    """Get call queue details"""
    try:
        queue = zoom_client.getCallQueue(queue_id)
        return jsonify({"success": True, "call_queue": queue})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/call-queues/<queue_id>', methods=['PATCH'])
def update_call_queue(queue_id):
    """Update call queue"""
    try:
        data = request.get_json()
        result = zoom_client.makeRequest('PATCH', f'/phone/call_queues/{queue_id}', data)
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/call-queues/<queue_id>/members', methods=['POST'])
def add_queue_members(queue_id):
    """Add members to call queue"""
    try:
        data = request.get_json()
        members = data.get('members', {})

        payload = {"members": members}
        result = zoom_client.makeRequest('POST', f'/phone/call_queues/{queue_id}/members', payload)
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/call-queues/<queue_id>/members/<member_id>', methods=['DELETE'])
def remove_queue_member(queue_id, member_id):
    """Remove member from call queue"""
    try:
        result = zoom_client.makeRequest('DELETE', f'/phone/call_queues/{queue_id}/members/{member_id}')
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ===== ZOOM USER MANAGEMENT ENDPOINTS =====

@app.route('/api/zoom-users', methods=['POST'])
def create_zoom_user():
    """Create a new Zoom user account"""
    try:
        data = request.get_json()
        email = data.get('email')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')

        if not email:
            return jsonify({"success": False, "error": "email required"}), 400

        payload = {
            "action": "create",
            "user_info": {
                "email": email,
                "type": 1,  # Basic user
                "first_name": first_name,
                "last_name": last_name
            }
        }

        result = zoom_client.makeRequest('POST', '/users', payload)
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/zoom-users/<user_id>', methods=['DELETE'])
def delete_zoom_user(user_id):
    """Delete a Zoom user account"""
    try:
        result = zoom_client.makeRequest('DELETE', f'/users/{user_id}', {"action": "delete"})
        return jsonify({"success": True, "result": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)