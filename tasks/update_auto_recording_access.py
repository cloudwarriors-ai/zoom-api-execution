import os
import json
import time
from dotenv import load_dotenv
from zoom_api_client import ZoomAPIClient

load_dotenv()

def main():
    client = ZoomAPIClient()
    
    with open('phone_users.json', 'r') as f:
        phone_users_data = json.load(f)
    
    users = phone_users_data['users']
    
    print(f"Processing {len(users)} users...")
    print("=" * 80)
    
    success_count = 0
    already_exists_count = 0
    error_count = 0
    
    for user in users:
        user_id = user['id']
        email = user['email']
        name = user.get('name', email)
        extension = user.get('extension_number', 'N/A')
        
        print(f"\nProcessing: {name} ({email}) - Ext: {extension}")
        
        try:
            result = client.make_request(
                'POST',
                f'/phone/users/{user_id}/settings/auto_call_recording',
                {
                    'auto_call_recording_access_members': [
                        {
                            'access_user_id': user_id,
                            'allow_download': True,
                            'allow_delete': False
                        }
                    ]
                }
            )
            print(f"  ✓ Successfully added to access member list")
            success_count += 1
            
        except Exception as e:
            error_msg = str(e)
            if 'already exists' in error_msg.lower():
                print(f"  ⚠ Already in access member list, skipping")
                already_exists_count += 1
            else:
                print(f"  ✗ Error: {error_msg}")
                error_count += 1
        
        time.sleep(0.3)
    
    print("\n" + "=" * 80)
    print("SUMMARY:")
    print(f"Total users processed: {len(users)}")
    print(f"Successfully added: {success_count}")
    print(f"Already exists: {already_exists_count}")
    print(f"Errors: {error_count}")
    print("=" * 80)

if __name__ == '__main__':
    main()
