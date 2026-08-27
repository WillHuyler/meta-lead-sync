import os
import requests
from dotenv import load_dotenv
from supabase import create_client, Client
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

# Load Environment Variables
load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials in .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_access_token():
    if not os.path.exists("token.json"):
        raise FileNotFoundError("token.json not found. Run authentication first.")
    
    creds = Credentials.from_authorized_user_file("token.json")
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open("token.json", "w") as token_file:
            token_file.write(creds.to_json())
            
    return creds.token

def import_all_gbp_locations():
    print("--- Fetching All Locations from Google Business Profile Manager ---")
    access_token = get_access_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    # Fetch Accounts
    acc_url = "https://mybusinessaccountmanagement.googleapis.com/v1/accounts"
    acc_res = requests.get(acc_url, headers=headers).json()
    accounts = acc_res.get("accounts", [])

    if not accounts:
        print("[Error] No Google Business accounts found for this token.")
        return

    imported_count = 0

    # Fetch Locations for each Account
    for acc in accounts:
        account_name = acc.get("name")
        loc_url = f"https://mybusinessbusinessinformation.googleapis.com/v1/{account_name}/locations?readMask=name,title"
        
        loc_res = requests.get(loc_url, headers=headers).json()
        locations = loc_res.get("locations", [])

        for loc in locations:
            full_loc_name = loc.get("name", "")
            raw_loc_id = full_loc_name.split("/")[-1] if "/" in full_loc_name else full_loc_name
            title = loc.get("title", "Unnamed Location")

            if raw_loc_id:
                payload = {
                    "name": title,
                    "gmb_location_id": raw_loc_id
                }
                supabase.table("clients").upsert(payload, on_conflict="gmb_location_id").execute()
                print(f"Imported Client: {title} (Location ID: {raw_loc_id})")
                imported_count += 1

    print(f"\n--- Import Complete! {imported_count} client locations synced to Supabase ---")

if __name__ == "__main__":
    import_all_gbp_locations()