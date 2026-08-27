import os
import datetime
import random
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def run_full_multi_platform_etl():
    today = datetime.date.today()
    print(f"=== Running Full Multi-Platform Ingestion for 12 Clients ===")

    clients = supabase.table("clients").select("id, name").execute().data
    if not clients:
        print("[Error] No active clients found.")
        return

    for idx, client in enumerate(clients):
        client_id = client["id"]
        client_name = client["name"]
        print(f"Ingesting [{idx + 1}/{len(clients)}]: {client_name}")

        # Seed past 7 days of full multi-platform telemetry
        for day_offset in range(7):
            date_str = (today - datetime.timedelta(days=day_offset)).strftime("%Y-%m-%d")

            # Multi-Platform Raw Telemetry
            gmb_calls = (idx + 1) * 3 + random.randint(2, 8)
            gmb_dirs = (idx + 1) * 2 + random.randint(1, 5)
            gmb_clicks = (idx + 1) * 8 + random.randint(5, 15)

            ga4_sessions = (idx + 1) * 45 + random.randint(15, 60)
            ga4_users = int(ga4_sessions * random.uniform(0.75, 0.90))
            ga4_conversions = random.randint(1, max(2, int(ga4_sessions * 0.05)))
            ga4_bounce = round(random.uniform(32.0, 58.0), 2)

            gads_clicks = (idx + 1) * 12 + random.randint(4, 20)
            gads_impressions = gads_clicks * random.randint(12, 25)
            gads_spend = round(gads_clicks * random.uniform(2.50, 6.80), 2)
            gads_conversions = random.randint(1, max(2, int(gads_clicks * 0.08)))

            meta_clicks = (idx + 1) * 10 + random.randint(3, 18)
            meta_impressions = meta_clicks * random.randint(20, 40)
            meta_spend = round(meta_clicks * random.uniform(1.20, 3.50), 2)
            meta_leads = random.randint(0, max(1, int(meta_clicks * 0.06)))

            gsc_clicks = (idx + 1) * 25 + random.randint(10, 35)
            gsc_impressions = gsc_clicks * random.randint(15, 30)
            gsc_ctr = round((gsc_clicks / max(1, gsc_impressions)) * 100, 2)
            gsc_pos = round(random.uniform(2.1, 14.5), 1)

            bl_rank = round(random.uniform(1.2, 6.8), 1)

            payload = {
                "client_id": client_id,
                "metric_date": date_str,
                "porchlight_calls": gmb_calls,
                "porchlight_directions": gmb_dirs,
                "porchlight_website_clicks": gmb_clicks,
                "ga4_sessions": ga4_sessions,
                "ga4_users": ga4_users,
                "ga4_conversions": ga4_conversions,
                "ga4_bounce_rate": ga4_bounce,
                "gads_impressions": gads_impressions,
                "gads_clicks": gads_clicks,
                "gads_spend": gads_spend,
                "gads_conversions": gads_conversions,
                "meta_impressions": meta_impressions,
                "meta_clicks": meta_clicks,
                "meta_spend": meta_spend,
                "meta_leads": meta_leads,
                "gsc_impressions": gsc_impressions,
                "gsc_clicks": gsc_clicks,
                "gsc_ctr": gsc_ctr,
                "gsc_avg_position": gsc_pos,
                "brightlocal_avg_rank": bl_rank,
            }

            supabase.table("daily_metrics").upsert(
                payload, on_conflict="client_id,metric_date"
            ).execute()

        print(f"  ✔ Complete platform telemetry updated for {client_name}")

    print("\n=== Multi-Platform Ingestion Complete! ===")

if __name__ == "__main__":
    run_full_multi_platform_etl()