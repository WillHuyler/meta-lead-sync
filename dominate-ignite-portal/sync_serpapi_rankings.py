import os
import sys
from serpapi import GoogleSearch
from supabase import create_client, Client

# Environment variables
SERPAPI_KEY = os.getenv("SERPAPI_KEY")
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SERPAPI_KEY or not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing required environment variables (SERPAPI_KEY, NEXT_PUBLIC_SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY).")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def run_daily_serp_tracker():
    print("Fetching active clients for rank tracking...")
    
    # Query active clients with their target domains and keywords from Supabase
    response = supabase.table("clients").select("id, domain, target_keywords, location").execute()
    clients = response.data

    if not clients:
        print("No active clients found in database.")
        return

    for client in clients:
        client_id = client.get("id")
        domain = client.get("domain")
        keywords = client.get("target_keywords", [])
        location = client.get("location", "United States")

        if not domain or not keywords:
            print(f"Skipping client {client_id}: Missing domain or target_keywords.")
            continue

        print(f"Processing SerpAPI updates for Client: {client_id} ({domain})")

        for keyword in keywords:
            params = {
                "engine": "google",
                "q": keyword,
                "location": location,
                "gl": "us",
                "hl": "en",
                "api_key": SERPAPI_KEY
            }

            try:
                search = GoogleSearch(params)
                results = search.get_dict()
                organic_results = results.get("organic_results", [])
                
                rank = None
                for item in organic_results:
                    link = item.get("link", "")
                    if domain.lower() in link.lower():
                        rank = item.get("position")
                        break

                # Upsert daily rank result into Supabase
                supabase.table("keyword_rankings").upsert({
                    "client_id": client_id,
                    "keyword": keyword,
                    "rank": rank,
                    "domain": domain
                }, on_conflict="client_id, keyword").execute()

                print(f"  Keyword: '{keyword}' | Rank: {rank if rank else 'Not in Top 100'}")

            except Exception as e:
                print(f"  Error fetching SerpAPI data for keyword '{keyword}': {str(e)}")

if __name__ == "__main__":
    run_daily_serp_tracker()