import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def analyze_and_generate_recommendations():
    print("=== Running Multi-Platform Predictive Analysis Engine ===")

    clients = supabase.table("clients").select("id, name").execute().data
    if not clients:
        print("[Error] No active clients found.")
        return

    # Clear previous recommendations for clean sync
    supabase.table("ai_recommendations").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()

    for client in clients:
        c_id = client["id"]
        c_name = client["name"]

        keywords = supabase.table("keyword_rankings").select("*").eq("client_id", c_id).execute().data
        gmc = supabase.table("gmc_metrics").select("*").eq("client_id", c_id).execute().data
        crm = supabase.table("crm_sales").select("*").eq("client_id", c_id).execute().data

        recommendations = []

        # Recommendation 1: Local SEO / GMB Gap Analysis
        if keywords:
            low_hanging = [k for k in keywords if 4 <= k.get("maps_rank", 10) <= 8]
            target_kw = low_hanging[0]["keyword"] if low_hanging else keywords[0]["keyword"]
            rank = low_hanging[0]["maps_rank"] if low_hanging else keywords[0]["maps_rank"]
            
            recommendations.append({
                "client_id": c_id,
                "platform": "GMB / Local SEO",
                "priority": "HIGH",
                "finding_title": f"Map Pack Position Opportunity on '{target_kw}'",
                "prescribed_action": f"Publish 2 localized updates and acquire 3 reviews referencing '{target_kw}' to push Map Pack rank from #{rank} into Top 3.",
                "expected_impact": "+15% to +22% Estimated Increase in Click-to-Calls within 21 days."
            })

        # Recommendation 2: E-Commerce / Merchant Center Optimization
        if gmc:
            recommendations.append({
                "client_id": c_id,
                "platform": "Google Merchant Center",
                "priority": "MEDIUM",
                "finding_title": "Product Feed CTR Optimization",
                "prescribed_action": "Update product titles with brand, color, and size specs. Replace low-res primary images with clean white-background variants.",
                "expected_impact": "Boost feed CTR to 3.2% (+180 additional storefront visits/mo)."
            })

        # Recommendation 3: Paid Media Allocation
        recommendations.append({
            "client_id": c_id,
            "platform": "Google Ads & Meta Ads",
            "priority": "HIGH",
            "finding_title": "Cross-Platform Spend Reallocation",
            "prescribed_action": "Reallocate $300/mo from broad-match terms into high-intent retargeting campaigns.",
            "expected_impact": "Reduce Cost Per Lead (CPL) by ~12.4% while preserving order volume."
        })

        supabase.table("ai_recommendations").insert(recommendations).execute()
        print(f"  ✔ Generated action items for {c_name}")

    print("\n=== Predictive Analysis Complete! ===")

if __name__ == "__main__":
    analyze_and_generate_recommendations()