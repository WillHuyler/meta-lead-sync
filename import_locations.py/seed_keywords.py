import os
import random
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

CLIENT_KEYWORDS = {
    "High Rise Chimney Sweep & Service": [
        ("chimney sweep near me", 4400), ("chimney repair service", 2900), ("fireplace cleaning", 1900),
        ("chimney liner installation", 1600), ("chimney cap repair", 1300), ("fireplace inspector near me", 1000),
        ("creosote removal service", 880), ("gas fireplace maintenance", 720), ("masonry chimney repair", 590), ("dryer vent cleaning", 3600)
    ],
    "Hyundai": [
        ("hyundai dealer near me", 18100), ("new hyundai suv", 9900), ("hyundai elantra lease", 6600),
        ("hyundai tucson price", 5400), ("hyundai dealership inventory", 4400), ("hyundai palisade for sale", 3600),
        ("hyundai ionic 5 electric", 2900), ("hyundai certified pre owned", 2400), ("hyundai trade in value", 1900), ("best hyundai deals", 1600)
    ],
    "Hyundai Parts and Service": [
        ("hyundai service center", 12100), ("hyundai oil change price", 5400), ("oem hyundai parts online", 3600),
        ("hyundai brake repair", 2900), ("hyundai transmission service", 2200), ("hyundai recall service", 1900),
        ("hyundai battery replacement", 1600), ("hyundai tire alignment", 1300), ("hyundai cabin filter replacement", 880), ("hyundai mechanic near me", 720)
    ],
    "Twin Lakes Boat Rental": [
        ("boat rentals near me", 22000), ("pontoon boat rental twin lakes", 4400), ("jet ski rental near me", 36000),
        ("lake boat hire", 2900), ("weekend boat rental rates", 1900), ("party boat rental near me", 1600),
        ("ski boat rental", 1300), ("half day pontoon rental", 990), ("fishing boat rental lake", 880), ("watercraft rental twin lakes", 590)
    ],
    "Dry Space Crawlspace Solutions": [
        ("crawl space encapsulation", 9900), ("basement waterproofing near me", 8100), ("crawl space repair cost", 5400),
        ("mold remediation service", 4400), ("sump pump installation", 3600), ("vapor barrier installation", 2900),
        ("foundation repair contractor", 2400), ("dehumidifier crawl space", 1900), ("wet basement fix", 1300), ("structural floor repair", 880)
    ],
    "KCW": [
        ("commercial general contractor", 6600), ("tenant buildout contractor", 2900), ("commercial remodeling service", 1900),
        ("retail space renovation", 1600), ("office buildout cost", 1300), ("commercial construction company", 1000),
        ("warehouse buildout contractor", 880), ("commercial repair services", 720), ("facility maintenance vendor", 590), ("commercial framing contractor", 480)
    ],
    "Southeast Motorcycle": [
        ("motorcycle repair shop near me", 14800), ("used motorcycles for sale", 12100), ("motorcycle tire change", 3600),
        ("motorcycle mechanic near me", 2900), ("dirt bike service shop", 2400), ("motorcycle brake repair", 1900),
        ("motorcycle inspection station", 1600), ("cruiser motorcycle parts", 1300), ("motorcycle oil change", 990), ("custom bike tuning shop", 720)
    ],
    "All About Fences": [
        ("fence installation near me", 27100), ("wood fence contractor", 8100), ("vinyl fencing cost", 6600),
        ("chain link fence installer", 4400), ("privacy fence installation", 3600), ("aluminum fence builder", 2900),
        ("gate installation service", 1900), ("fence repair contractor", 1600), ("commercial security fence", 1300), ("custom residential fencing", 990)
    ],
    "CarBahn": [
        ("bmw performance tuning", 4400), ("carbahn performance shop", 2900), ("audi engine tuning service", 1900),
        ("mercedes amg performance upgrades", 1600), ("porsche service specialist", 1300), ("european auto repair shop", 1000),
        ("dyno tuning near me", 880), ("high performance suspension install", 720), ("turbo upgrade installer", 590), ("track car prep shop", 480)
    ],
    "Sicardo Towing": [
        ("towing service near me", 40500), ("24/7 emergency roadside assistance", 18100), ("flatbed tow truck service", 8100),
        ("cheap tow truck near me", 6600), ("car lockout service near me", 5400), ("jump start service cost", 3600),
        ("long distance towing rate", 2900), ("winch out service near me", 1900), ("unauthorized vehicle removal", 1300), ("heavy duty towing company", 990)
    ],
    "Recoat Revolution": [
        ("cabinet refinishing near me", 8100), ("countertop resurfacing cost", 4400), ("kitchen cabinet painting service", 3600),
        ("epoxy countertop installation", 2900), ("tub and tile recoating", 1900), ("cabinet restoration specialist", 1600),
        ("bathroom vanity refinishing", 1300), ("granite resurfacing contractor", 880), ("cabinet refacing vs recoating", 720), ("kitchen makeover contractor", 590)
    ],
    "Koon Cook & Walters": [
        ("personal injury lawyer near me", 33100), ("car accident attorney cost", 14800), ("truck accident lawyer", 8100),
        ("wrongful death attorney", 4400), ("slip and fall injury attorney", 3600), ("medical malpractice lawyer", 2900),
        ("motorcycle accident attorney", 2400), ("workers comp legal advice", 1900), ("best trial lawyers near me", 1600), ("free legal consultation injury", 1300)
    ]
}

COMPETITORS_POOL = {
    "High Rise Chimney Sweep & Service": ["Apex Chimney Care", "Midwest Fireplace Co", "TopHat Sweeps"],
    "Hyundai": ["AutoNation Hyundai", "Heritage Hyundai", "Springfield Motor Group"],
    "Hyundai Parts and Service": ["Pep Boys Auto", "Express Lube Center", "Dealer Direct Parts"],
    "Twin Lakes Boat Rental": ["Lake Fun Rentals", "Waterfront Marina", "Twin Lakes JetSki Club"],
    "Dry Space Crawlspace Solutions": ["Basement Doctor", "Groundworks Waterproofing", "DryPro Solutions"],
    "KCW": ["BuildCorp Commercial", "Metro Build Services", "Titan Contracting"],
    "Southeast Motorcycle": ["Cycle World Depot", "ProRider Garage", "Eagle Powersports"],
    "All About Fences": ["Paramount Fence Inc", "Superior Deck & Fence", "ProGuard Fencing"],
    "CarBahn": ["DINAN Auto Works", "Apex Tuning Labs", "Euro Performance Works"],
    "Sicardo Towing": ["Metro Towing & Recovery", "Priority Tow Truck", "FastResponse Towing"],
    "Recoat Revolution": ["Miracle Method Refinishing", "N-Hue Cabinet Care", "Surface Doctors"],
    "Koon Cook & Walters": ["Morgan & Associates", "The Law Offices of R. Vance", "Pinnacle Injury Law"]
}

def seed_top10_keywords_and_competitors():
    print("--- Seeding Top 10 Keywords & Competitors for 12 Clients ---")
    
    clients = supabase.table("clients").select("id, name").execute().data
    if not clients:
        print("No clients found. Run SQL injection script first.")
        return

    # Clear old rankings
    supabase.table("keyword_rankings").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()

    for client in clients:
        client_name = client["name"]
        client_id = client["id"]

        kw_tuples = CLIENT_KEYWORDS.get(client_name, [("local service provider", 1000)] * 10)
        comps = COMPETITORS_POOL.get(client_name, ["Competitor A", "Competitor B", "Competitor C"])

        for kw_phrase, vol in kw_tuples:
            payload = {
                "client_id": client_id,
                "keyword": kw_phrase,
                "google_rank": random.randint(1, 12),
                "maps_rank": random.randint(1, 7),
                "search_volume": vol,
                "competitor_1": comps[0],
                "competitor_2": comps[1],
                "competitor_3": comps[2]
            }
            supabase.table("keyword_rankings").insert(payload).execute()

        print(f"✔ 10 Top Keywords & Competitors seeded for: {client_name}")

    print("\n--- Complete Keyword & Competitor Seeding Finished! ---")

if __name__ == "__main__":
    seed_top10_keywords_and_competitors()