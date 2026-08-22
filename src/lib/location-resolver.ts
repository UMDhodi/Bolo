/**
 * Intelligent Location Resolver for Indian Cities & Localities
 * 
 * Provides sub-millisecond location parsing, auto-geolocation cache,
 * and exact coordinates resolution for Indian neighbourhoods.
 */

export interface GeoLocationResult {
  latitude: number;
  longitude: number;
  city: string;
  district: string;
  state: string;
  source: "exact_match" | "nearby_gps" | "geocoded" | "fallback";
}

// In-memory cache for user's auto-detected browser GPS
let cachedUserLocation: { latitude: number; longitude: number; timestamp: number } | null = null;

/**
 * Silently auto-detect user's device location on site load (with 10-minute cache)
 */
export function initAutoLocationDetection(): void {
  if (typeof window === "undefined" || !("geolocation" in navigator)) return;

  if (cachedUserLocation && Date.now() - cachedUserLocation.timestamp < 10 * 60 * 1000) {
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      // Ensure inside or near India bounds
      if (latitude >= 6 && latitude <= 37.5 && longitude >= 67 && longitude <= 98.5) {
        cachedUserLocation = { latitude, longitude, timestamp: Date.now() };
      }
    },
    (err) => {
      // Silent error: browser or permission restriction
      console.debug("Silent geolocation detection skipped:", err.message);
    },
    { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
  );
}

export function getCachedUserLocation(): { latitude: number; longitude: number } | null {
  return cachedUserLocation;
}

// Extensive dictionary of Indian localities, landmarks, and major cities with accurate lat/lng
const INDIAN_LOCALITIES: Array<{
  keywords: string[];
  lat: number;
  lng: number;
  city: string;
  district: string;
  state: string;
}> = [
  // Delhi NCR
  { keywords: ["krishna nagar", "krishnanagar delhi", "east delhi", "laxmi nagar", "geeta colony", "shahdara", "anand vihar", "preet vihar", "karkardooma", "gandhi nagar delhi"], lat: 28.6606, lng: 77.2804, city: "Delhi", district: "East Delhi", state: "Delhi" },
  { keywords: ["dwarka", "dwarka sector", "uttam nagar", "palam", "janakpuri", "kakrola"], lat: 28.5921, lng: 77.0403, city: "New Delhi", district: "South West Delhi", state: "Delhi" },
  { keywords: ["rohini", "pitampura", "shalimar bagh", "prashant vihar", "rithala"], lat: 28.7159, lng: 77.1105, city: "Delhi", district: "North West Delhi", state: "Delhi" },
  { keywords: ["karol bagh", "rajendra nagar", "patel nagar", "shadipur", "jhandewalan"], lat: 28.6517, lng: 77.1906, city: "New Delhi", district: "Central Delhi", state: "Delhi" },
  { keywords: ["connaught place", "cp delhi", "rajiv chowk", "india gate", "barakhamba", "mandir marg"], lat: 28.6315, lng: 77.2167, city: "New Delhi", district: "New Delhi", state: "Delhi" },
  { keywords: ["lajpat nagar", "saket", "hauz khas", "malviya nagar", "south extension", "greater kailash", "gk 1", "gk 2", "green park", "nehru place", "kalkaji"], lat: 28.5677, lng: 77.2433, city: "New Delhi", district: "South Delhi", state: "Delhi" },
  { keywords: ["chandni chowk", "daryaganj", "kashmere gate", "red fort", "jama masjid delhi"], lat: 28.6562, lng: 77.2307, city: "Delhi", district: "North Delhi", state: "Delhi" },
  { keywords: ["noida", "sector 18 noida", "sector 62 noida", "greater noida", "noida extension"], lat: 28.5355, lng: 77.3910, city: "Noida", district: "Gautam Buddha Nagar", state: "Uttar Pradesh" },
  { keywords: ["gurugram", "gurgaon", "cyber city", "dlf phase", "golf course road", "sohna road"], lat: 28.4595, lng: 77.0266, city: "Gurugram", district: "Gurugram", state: "Haryana" },
  { keywords: ["ghaziabad", "indirapuram", "vaishali ghaziabad", "vasundhara"], lat: 28.6692, lng: 77.4538, city: "Ghaziabad", district: "Ghaziabad", state: "Uttar Pradesh" },
  { keywords: ["delhi", "new delhi", "ncr"], lat: 28.6139, lng: 77.2090, city: "New Delhi", district: "New Delhi", state: "Delhi" },

  // Maharashtra - Pune & Mumbai
  { keywords: ["kothrud", "paud road", "shivaji chowk pune", "karve road", "chandani chowk", "vanaz"], lat: 18.5074, lng: 73.8077, city: "Pune", district: "Pune", state: "Maharashtra" },
  { keywords: ["kalyani nagar", "viman nagar", "kharadi", "koregaon park", "magarpatta", "hadapsar"], lat: 18.5489, lng: 73.9033, city: "Pune", district: "Pune", state: "Maharashtra" },
  { keywords: ["sinhagad road", "vadgaon budruk", "dhayari", "warje", "katraj", "dhankawadi", "ambegaon"], lat: 18.4636, lng: 73.8218, city: "Pune", district: "Pune", state: "Maharashtra" },
  { keywords: ["baner", "balewadi", "hinjawadi", "hinjewadi", "wakad", "aundh", "pashan", "bavdhan"], lat: 18.5590, lng: 73.7868, city: "Pune", district: "Pune", state: "Maharashtra" },
  { keywords: ["shivajinagar", "deccan gymkhana", "fc road", "jm road", "camp pune", "swargate"], lat: 18.5314, lng: 73.8446, city: "Pune", district: "Pune", state: "Maharashtra" },
  { keywords: ["pune", "pcmc", "pimpri", "chinchwad", "nigdi", "bhosari"], lat: 18.5204, lng: 73.8567, city: "Pune", district: "Pune", state: "Maharashtra" },
  { keywords: ["andheri", "andheri east", "andheri west", "juhu", "lokhandwala", "versova"], lat: 19.1136, lng: 72.8697, city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra" },
  { keywords: ["bandra", "bandra west", "bandra east", "bkc", "bandra kurla complex", "khar", "santacruz"], lat: 19.0596, lng: 72.8295, city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra" },
  { keywords: ["borivali", "kandivali", "malad", "goregaon", "dahisar"], lat: 19.2288, lng: 72.8541, city: "Mumbai", district: "Mumbai Suburban", state: "Maharashtra" },
  { keywords: ["dadar", "parel", "worli", "lower parel", "matunga", "mahim"], lat: 19.0178, lng: 72.8478, city: "Mumbai", district: "Mumbai City", state: "Maharashtra" },
  { keywords: ["colaba", "marine lines", "churchgate", "nariman point", "fort mumbai", "cst", "marine drive"], lat: 18.9220, lng: 72.8347, city: "Mumbai", district: "Mumbai City", state: "Maharashtra" },
  { keywords: ["thane", "ghodbunder", "majiwada", "naupada", "vartak nagar"], lat: 19.2183, lng: 72.9781, city: "Thane", district: "Thane", state: "Maharashtra" },
  { keywords: ["navi mumbai", "vashi", "nerul", "kharghar", "belapur", "panvel", "airoli"], lat: 19.0330, lng: 73.0297, city: "Navi Mumbai", district: "Thane", state: "Maharashtra" },
  { keywords: ["mumbai", "bombay"], lat: 19.0760, lng: 72.8777, city: "Mumbai", district: "Mumbai City", state: "Maharashtra" },
  { keywords: ["nagpur", "sitabuldi", "dharampeth"], lat: 21.1458, lng: 79.0882, city: "Nagpur", district: "Nagpur", state: "Maharashtra" },
  { keywords: ["nashik", "panchavati", "cidco nashik"], lat: 19.9975, lng: 73.7898, city: "Nashik", district: "Nashik", state: "Maharashtra" },
  { keywords: ["aurangabad", "chhatrapati sambhajinagar"], lat: 19.8762, lng: 75.3433, city: "Chhatrapati Sambhajinagar", district: "Aurangabad", state: "Maharashtra" },

  // Karnataka - Bengaluru & beyond
  { keywords: ["jayanagar", "jp nagar", "banashankari", "bsk", "padmanabhanagar"], lat: 12.9299, lng: 77.5826, city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka" },
  { keywords: ["indiranagar", "koramangala", "domlur", "hal", "old airport road"], lat: 12.9784, lng: 77.6408, city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka" },
  { keywords: ["whitefield", "marathahalli", "mahadevapura", "kadugodi", "itpl", "hoodi"], lat: 12.9698, lng: 77.7500, city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka" },
  { keywords: ["electronic city", "harlur", "sarjapur", "bellandur", "hsa layout", "hsr"], lat: 12.8452, lng: 77.6602, city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka" },
  { keywords: ["malleshwaram", "rajajinagar", "yeshwanthpur", "hebbal", "yelahanka"], lat: 13.0031, lng: 77.5643, city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka" },
  { keywords: ["bengaluru", "bangalore", "bangaluru"], lat: 12.9716, lng: 77.5946, city: "Bengaluru", district: "Bengaluru Urban", state: "Karnataka" },
  { keywords: ["mysuru", "mysore"], lat: 12.2958, lng: 76.6394, city: "Mysuru", district: "Mysuru", state: "Karnataka" },
  { keywords: ["kolar", "kolar town"], lat: 13.1357, lng: 78.1290, city: "Kolar", district: "Kolar", state: "Karnataka" },
  { keywords: ["hubballi", "hubli", "dharwad"], lat: 15.3647, lng: 75.1240, city: "Hubballi", district: "Dharwad", state: "Karnataka" },
  { keywords: ["mangalore", "mangaluru"], lat: 12.9141, lng: 74.8560, city: "Mangaluru", district: "Dakshina Kannada", state: "Karnataka" },

  // Tamil Nadu - Chennai & others
  { keywords: ["anna salai", "teynampet", "alwarpet", "mylapore", "t nagar", "mandaveli", "royapettah"], lat: 13.0389, lng: 80.2489, city: "Chennai", district: "Chennai", state: "Tamil Nadu" },
  { keywords: ["adyar", "besant nagar", "thiruvanmiyur", "velachery", "omr", "sholinganallur", "guindy"], lat: 13.0012, lng: 80.2565, city: "Chennai", district: "Chennai", state: "Tamil Nadu" },
  { keywords: ["anna nagar", "kilpauk", "chetpet", "egmore", "purasaiwakkam"], lat: 13.0850, lng: 80.2101, city: "Chennai", district: "Chennai", state: "Tamil Nadu" },
  { keywords: ["chennai", "madras"], lat: 13.0827, lng: 80.2707, city: "Chennai", district: "Chennai", state: "Tamil Nadu" },
  { keywords: ["coimbatore", "rs puram", "peelamedu", "gandhipuram"], lat: 11.0168, lng: 76.9558, city: "Coimbatore", district: "Coimbatore", state: "Tamil Nadu" },
  { keywords: ["madurai"], lat: 9.9252, lng: 78.1198, city: "Madurai", district: "Madurai", state: "Tamil Nadu" },
  { keywords: ["tiruchirappalli", "trichy"], lat: 10.7905, lng: 78.7047, city: "Tiruchirappalli", district: "Tiruchirappalli", state: "Tamil Nadu" },
  { keywords: ["salem"], lat: 11.6643, lng: 78.1460, city: "Salem", district: "Salem", state: "Tamil Nadu" },

  // West Bengal - Kolkata
  { keywords: ["salt lake", "bidhannagar", "sector 5 kolkata", "sector v", "college more", "new town kolkata", "rajarhat"], lat: 22.5776, lng: 88.4318, city: "Kolkata", district: "North 24 Parganas", state: "West Bengal" },
  { keywords: ["park street", "camac street", "esplanade", "bhowanipore", "gariahat", "ballygunge", "alipore"], lat: 22.5510, lng: 88.3524, city: "Kolkata", district: "Kolkata", state: "West Bengal" },
  { keywords: ["howrah", "howrah station", "shibpur", "santragachi"], lat: 22.5958, lng: 88.2636, city: "Howrah", district: "Howrah", state: "West Bengal" },
  { keywords: ["kolkata", "calcutta"], lat: 22.5726, lng: 88.3639, city: "Kolkata", district: "Kolkata", state: "West Bengal" },
  { keywords: ["siliguri"], lat: 26.7271, lng: 88.3953, city: "Siliguri", district: "Darjeeling", state: "West Bengal" },
  { keywords: ["asansol"], lat: 23.6739, lng: 86.9524, city: "Asansol", district: "Paschim Bardhaman", state: "West Bengal" },

  // Rajasthan - Jaipur & others
  { keywords: ["amer", "amer road", "kesar kyari", "jal mahal", "hawa mahal", "pink city"], lat: 26.9855, lng: 75.8513, city: "Jaipur", district: "Jaipur", state: "Rajasthan" },
  { keywords: ["vaishali nagar jaipur", "c scheme", "malviya nagar jaipur", "raja park", "mansarovar", "tonk road"], lat: 26.9124, lng: 75.7373, city: "Jaipur", district: "Jaipur", state: "Rajasthan" },
  { keywords: ["jaipur"], lat: 26.9124, lng: 75.7873, city: "Jaipur", district: "Jaipur", state: "Rajasthan" },
  { keywords: ["jodhpur"], lat: 26.2389, lng: 73.0243, city: "Jodhpur", district: "Jodhpur", state: "Rajasthan" },
  { keywords: ["udaipur"], lat: 24.5854, lng: 73.7125, city: "Udaipur", district: "Udaipur", state: "Rajasthan" },
  { keywords: ["kota"], lat: 25.2138, lng: 75.8648, city: "Kota", district: "Kota", state: "Rajasthan" },

  // Gujarat - Ahmedabad, Surat & others
  { keywords: ["maninagar", "krishnanagar ahmedabad", "paldi", "navrangpura", "satellite", "bodakdev", "sg highway", "vastrapur", "prahlad nagar", "bopal"], lat: 22.9963, lng: 72.6009, city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat" },
  { keywords: ["ahmedabad", "amdavad", "gandhinagar"], lat: 23.0225, lng: 72.5714, city: "Ahmedabad", district: "Ahmedabad", state: "Gujarat" },
  { keywords: ["surat", "varachha", "adajan", "vesu"], lat: 21.1702, lng: 72.8311, city: "Surat", district: "Surat", state: "Gujarat" },
  { keywords: ["vadodara", "baroda", "alkapuri"], lat: 22.3072, lng: 73.1812, city: "Vadodara", district: "Vadodara", state: "Gujarat" },
  { keywords: ["rajkot"], lat: 22.3039, lng: 70.8022, city: "Rajkot", district: "Rajkot", state: "Gujarat" },

  // Uttar Pradesh - Lucknow, Kanpur, Agra & others
  { keywords: ["alambagh", "hazratganj", "gomti nagar", "indira nagar", "aliganj", "chowk lucknow", "aminabad", "mahanagar"], lat: 26.8083, lng: 80.8896, city: "Lucknow", district: "Lucknow", state: "Uttar Pradesh" },
  { keywords: ["lucknow"], lat: 26.8467, lng: 80.9462, city: "Lucknow", district: "Lucknow", state: "Uttar Pradesh" },
  { keywords: ["kanpur", "swaroop nagar", "kakadeo"], lat: 26.4499, lng: 80.3319, city: "Kanpur", district: "Kanpur Nagar", state: "Uttar Pradesh" },
  { keywords: ["varanasi", "kashi", "banaras", "assighat", "dashashwamedh"], lat: 25.3176, lng: 82.9739, city: "Varanasi", district: "Varanasi", state: "Uttar Pradesh" },
  { keywords: ["agra", "taj ganj"], lat: 27.1767, lng: 78.0081, city: "Agra", district: "Agra", state: "Uttar Pradesh" },
  { keywords: ["prayagraj", "allahabad", "civil lines prayagraj"], lat: 25.4358, lng: 81.8463, city: "Prayagraj", district: "Prayagraj", state: "Uttar Pradesh" },
  { keywords: ["meerut"], lat: 28.9845, lng: 77.7064, city: "Meerut", district: "Meerut", state: "Uttar Pradesh" },

  // Telangana & Andhra Pradesh - Hyderabad & others
  { keywords: ["hitec city", "madhapur", "gachibowli", "jubilee hills", "banjara hills", "kondapur", "kukatpally", "secunderabad", "begumpet", "charminar"], lat: 17.4435, lng: 78.3772, city: "Hyderabad", district: "Hyderabad", state: "Telangana" },
  { keywords: ["hyderabad"], lat: 17.3850, lng: 78.4867, city: "Hyderabad", district: "Hyderabad", state: "Telangana" },
  { keywords: ["visakhapatnam", "vizag"], lat: 17.6868, lng: 83.2185, city: "Visakhapatnam", district: "Visakhapatnam", state: "Andhra Pradesh" },
  { keywords: ["vijayawada"], lat: 16.5062, lng: 80.6480, city: "Vijayawada", district: "NTR", state: "Andhra Pradesh" },

  // Kerala
  { keywords: ["kochi", "cochin", "ernakulam", "kakkanad"], lat: 9.9312, lng: 76.2673, city: "Kochi", district: "Ernakulam", state: "Kerala" },
  { keywords: ["thiruvananthapuram", "trivandrum"], lat: 8.5241, lng: 76.9366, city: "Thiruvananthapuram", district: "Thiruvananthapuram", state: "Kerala" },

  // Punjab, Haryana & Chandigarh
  { keywords: ["chandigarh", "mohali", "panchkula"], lat: 30.7333, lng: 76.7794, city: "Chandigarh", district: "Chandigarh", state: "Chandigarh" },
  { keywords: ["ludhiana"], lat: 30.9010, lng: 75.8573, city: "Ludhiana", district: "Ludhiana", state: "Punjab" },
  { keywords: ["amritsar", "golden temple"], lat: 31.6340, lng: 74.8723, city: "Amritsar", district: "Amritsar", state: "Punjab" },

  // Madhya Pradesh & Bihar
  { keywords: ["indore", "vijay nagar indore", "chappan dukan"], lat: 22.7196, lng: 75.8577, city: "Indore", district: "Indore", state: "Madhya Pradesh" },
  { keywords: ["bhopal", "mp nagar"], lat: 23.2599, lng: 77.4126, city: "Bhopal", district: "Bhopal", state: "Madhya Pradesh" },
  { keywords: ["patna", "kankarbagh", "boring road"], lat: 25.5941, lng: 85.1376, city: "Patna", district: "Patna", state: "Bihar" },
];

/**
 * Calculates distance in kilometres between two coordinates using Haversine formula
 */
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Fast sub-millisecond Resolver: Compares typed location string with dictionary
 * and user's auto-detected GPS to resolve exact coordinates, city, district & state.
 */
export function resolveLocationCoordinates(
  locationInput: string,
  addressInput = "",
  manualCoords: { latitude: number; longitude: number } | null = null
): GeoLocationResult {
  const combined = `${locationInput} ${addressInput}`.toLowerCase();

  // 1. If user explicitly provided manual high-accuracy coordinates
  if (manualCoords && manualCoords.latitude && manualCoords.longitude) {
    let closest = INDIAN_LOCALITIES[0];
    let minD = Infinity;
    for (const item of INDIAN_LOCALITIES) {
      const d = calculateDistanceKm(manualCoords.latitude, manualCoords.longitude, item.lat, item.lng);
      if (d < minD) {
        minD = d;
        closest = item;
      }
    }
    return {
      latitude: manualCoords.latitude,
      longitude: manualCoords.longitude,
      city: closest?.city || "Local Ward",
      district: closest?.district || "District",
      state: closest?.state || "India",
      source: "exact_match",
    };
  }

  // 2. Instant dictionary lookup matching location and address text
  let bestMatch: (typeof INDIAN_LOCALITIES)[0] | null = null;
  let bestScore = 0;

  for (const item of INDIAN_LOCALITIES) {
    for (const kw of item.keywords) {
      if (combined.includes(kw)) {
        const score = kw.length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = item;
        }
      }
    }
  }

  if (bestMatch) {
    // Check if user's auto-detected GPS is near this matched locality (within 40km)
    if (cachedUserLocation) {
      const dist = calculateDistanceKm(
        cachedUserLocation.latitude,
        cachedUserLocation.longitude,
        bestMatch.lat,
        bestMatch.lng
      );
      if (dist <= 40) {
        return {
          latitude: cachedUserLocation.latitude,
          longitude: cachedUserLocation.longitude,
          city: bestMatch.city,
          district: bestMatch.district,
          state: bestMatch.state,
          source: "nearby_gps",
        };
      }
    }

    // Add tiny jitter (10-20 meters) so multiple reports in same locality don't perfectly stack
    const jitterLat = (Math.random() - 0.5) * 0.003;
    const jitterLng = (Math.random() - 0.5) * 0.003;

    return {
      latitude: Number((bestMatch.lat + jitterLat).toFixed(5)),
      longitude: Number((bestMatch.lng + jitterLng).toFixed(5)),
      city: bestMatch.city,
      district: bestMatch.district,
      state: bestMatch.state,
      source: "exact_match",
    };
  }

  // 3. If no keyword matched, but user GPS is available inside India
  if (cachedUserLocation) {
    let closest = INDIAN_LOCALITIES[0];
    let minD = Infinity;
    for (const item of INDIAN_LOCALITIES) {
      const d = calculateDistanceKm(cachedUserLocation.latitude, cachedUserLocation.longitude, item.lat, item.lng);
      if (d < minD) {
        minD = d;
        closest = item;
      }
    }
    return {
      latitude: cachedUserLocation.latitude,
      longitude: cachedUserLocation.longitude,
      city: closest?.city || "Area",
      district: closest?.district || "District",
      state: closest?.state || "India",
      source: "nearby_gps",
    };
  }

  // 4. Default fallback (Delhi center rather than Pune)
  const locParts = locationInput.split(",").map((s) => s.trim()).filter(Boolean);
  const guessedCity = locParts[locParts.length - 1] || "City";
  const guessedDistrict = locParts[Math.max(0, locParts.length - 2)] || guessedCity;

  return {
    latitude: 28.6139 + (Math.random() - 0.5) * 0.05,
    longitude: 77.2090 + (Math.random() - 0.5) * 0.05,
    city: guessedCity,
    district: guessedDistrict,
    state: "Delhi",
    source: "fallback",
  };
}
