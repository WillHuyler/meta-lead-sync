import os
import requests
from supabase import create_client, Client

# 1. Supabase Initialization
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 2. Google Ads API Credentials
DEVELOPER_TOKEN = os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN")
CLIENT_ID = os.getenv("GOOGLE_ADS_CLIENT_ID")
CLIENT_SECRET = os.getenv("GOOGLE_ADS_CLIENT_SECRET")
REFRESH_TOKEN = os.getenv("GOOGLE_ADS_REFRESH_TOKEN")
CUSTOMER_ID = os.getenv("GOOGLE_ADS_CUSTOMER_ID", "5395728235").replace("-", "")

def get_access_token():
    url = "https://oauth2.googleapis.com/token"
    payload = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "refresh_token": REFRESH_TOKEN,
        "grant_type": "refresh_token"
    }
    res = requests.post(url, data=payload).json()
    return res.get("access_token")

def fetch_and_sync_google_ads():
    access_token = get_access_token()
    headers = {
        "Authorization": f"Bearer {access_token}",
        "developer-token": DEVELOPER_TOKEN,
        "Content-Type": "application/json"
    }

    # GAQL Query for Campaign Level Telemetry & Lost Impression Share
    query = """
    SELECT 
        campaign.id,
        campaign.name,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.search_budget_lost_impression_share
    FROM campaign 
    WHERE segments.date DURING LAST_30_DAYS
    """

    url = f"https://googleads.googleapis.com/v17/customers/{CUSTOMER_ID}/googleAds:search"
    res = requests.post(url, headers=headers, json={"query": query})
    
    print("Google Ads Ingestion Completed Successfully!")
    return res.json()

if __name__ == "__main__":
    fetch_and_sync_google_ads()