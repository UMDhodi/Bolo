import roadImg from "@/assets/issue-road.jpg";
import streetlightImg from "@/assets/issue-streetlight.jpg";
import drainageImg from "@/assets/issue-drainage.jpg";
import garbageImg from "@/assets/issue-garbage.jpg";
import waterImg from "@/assets/issue-water.jpg";
import parkImg from "@/assets/issue-park.jpg";

export type IssueStatus = "reported" | "progress" | "solved";

export type Issue = {
  id: string;
  title: string;
  reporter: string;
  reporterUid?: string;
  userId?: string;
  reporterEmail?: string | null;
  reporterPhone?: string | null;
  createdAt?: number;
  date: string; // ISO
  status: IssueStatus;
  category: string;
  location: string;
  address: string;
  description: string;
  images: string[];
  state: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
};

export const STATUS_META: Record<
  IssueStatus,
  { labelKey: "reported" | "progress" | "solved"; color: string }
> = {
  reported: { labelKey: "reported", color: "var(--status-reported)" },
  progress: { labelKey: "progress", color: "var(--status-progress)" },
  solved: { labelKey: "solved", color: "var(--status-solved)" },
};

export const INDIA_CENTER: [number, number] = [22.55, 79.5];

export const STATE_CENTERS: Record<string, { center: [number, number]; zoom: number }> = {
  Maharashtra: { center: [19.2, 75.5], zoom: 7 },
  Karnataka: { center: [14.8, 76.0], zoom: 7 },
  Delhi: { center: [28.62, 77.14], zoom: 10 },
  "Tamil Nadu": { center: [11.0, 78.4], zoom: 7 },
  "West Bengal": { center: [23.5, 87.9], zoom: 7 },
  Rajasthan: { center: [26.8, 74.2], zoom: 7 },
  Gujarat: { center: [22.6, 71.8], zoom: 7 },
  "Uttar Pradesh": { center: [27.0, 80.5], zoom: 7 },
};

export const SEED_ISSUES: Issue[] = [
  {
    id: "BLO-1042",
    title: "Deep potholes flooding the road near Shivaji Chowk",
    reporter: "Ananya Deshmukh",
    date: "2026-08-12",
    status: "reported",
    category: "Road damage",
    location: "Kothrud, Pune",
    address: "Plot 14, Paud Road, near Shivaji Chowk bus stop, Kothrud, Pune 411038",
    description:
      "A stretch of nearly 40 metres has broken up after the last two weeks of rain. Three potholes are more than a foot deep and stay filled with muddy water, so riders cannot judge them. Two-wheelers have skidded here twice this week and the school van slows traffic to a crawl every morning. Requesting patch work and proper camber so water drains towards the roadside channel.",
    images: [roadImg],
    state: "Maharashtra",
    district: "Pune",
    city: "Pune",
    lat: 18.5074,
    lng: 73.8077,
  },
  {
    id: "BLO-1043",
    title: "Streetlights dead for eleven nights on Anna Salai service lane",
    reporter: "Karthik Raman",
    date: "2026-08-09",
    status: "progress",
    category: "Streetlight",
    location: "Teynampet, Chennai",
    address: "Service lane beside 88 Anna Salai, opposite Meridian Apartments, Teynampet, Chennai 600018",
    description:
      "Six consecutive poles on the service lane have not lit up since the 29th. The lane is used by night-shift workers walking to the bus stop and by women returning from the hospital nearby. A ward technician visited and confirmed a cable fault at the junction box; replacement work has been marked as underway. Requesting a temporary portable light until the cable is restored.",
    images: [streetlightImg],
    state: "Tamil Nadu",
    district: "Chennai",
    city: "Chennai",
    lat: 13.0389,
    lng: 80.2489,
  },
  {
    id: "BLO-1044",
    title: "Storm drain choked, sewage backing onto the footpath",
    reporter: "Rukhsana Sheikh",
    date: "2026-08-05",
    status: "reported",
    category: "Drainage",
    location: "Sinhagad Road, Pune",
    address: "Near Ganesh Mandir lane, Sinhagad Road, Vadgaon Budruk, Pune 411051",
    description:
      "The open drain along the shop row is blocked with silt and plastic. Grey water now overflows onto the footpath and stands there through the day, making the entrance to four shops unusable and drawing mosquitoes. Shopkeepers cleared the top layer themselves but the blockage seems to be deeper inside the culvert. Requesting mechanical desilting of the whole stretch.",
    images: [drainageImg],
    state: "Maharashtra",
    district: "Pune",
    city: "Pune",
    lat: 18.4636,
    lng: 73.8218,
  },
  {
    id: "BLO-1045",
    title: "Garbage bins not cleared for four days in Sector 12 market",
    reporter: "Devendra Chauhan",
    date: "2026-08-14",
    status: "reported",
    category: "Garbage collection",
    location: "Dwarka Sector 12, Delhi",
    address: "Community bin point, Block B market, Sector 12, Dwarka, New Delhi 110078",
    description:
      "The six community bins at the market corner are overflowing and waste has spread across the walking path. Stray cattle scatter it further every evening. Vendors say the collection vehicle last came on Sunday. Requesting immediate lifting and a return to the daily morning pickup schedule, plus one additional bin for wet waste.",
    images: [garbageImg],
    state: "Delhi",
    district: "South West Delhi",
    city: "New Delhi",
    lat: 28.5921,
    lng: 77.0403,
  },
  {
    id: "BLO-1046",
    title: "Water main leaking continuously outside Ward 9 office",
    reporter: "Meera Nair",
    date: "2026-07-30",
    status: "progress",
    category: "Water leak",
    location: "Jayanagar, Bengaluru",
    address: "11th Main Road, beside Ward 9 office gate, Jayanagar 4th Block, Bengaluru 560011",
    description:
      "A joint on the 6-inch line has been leaking for over a week. Clean water runs down the slope all day and the road surface beside the footpath has begun to sink. Residents in the two lanes above report low pressure in the morning, likely because of this loss. A valve crew has cordoned the spot and repair is listed as in progress.",
    images: [waterImg],
    state: "Karnataka",
    district: "Bengaluru Urban",
    city: "Bengaluru",
    lat: 12.9299,
    lng: 77.5826,
  },
  {
    id: "BLO-1047",
    title: "Playground swings broken and park overgrown",
    reporter: "Sandeep Patil",
    date: "2026-07-22",
    status: "solved",
    category: "Public space",
    location: "Kalyani Nagar, Pune",
    address: "Shanti Udyan, Lane 6, Kalyani Nagar, Pune 411006",
    description:
      "Two of the four swings had snapped chains and the grass had grown waist-high across half the park, so children stopped using it. The garden department trimmed the lawn, replaced both swing seats and repainted the frame. Benches near the walking track were also refixed. Residents have confirmed the park is usable again.",
    images: [parkImg],
    state: "Maharashtra",
    district: "Pune",
    city: "Pune",
    lat: 18.5489,
    lng: 73.9033,
  },
  {
    id: "BLO-1048",
    title: "Approach road to Kolar bus stand washed out",
    reporter: "Bhavana Reddy",
    date: "2026-08-11",
    status: "progress",
    category: "Road damage",
    location: "Kolar Town",
    address: "Bus stand approach road, near Old Tehsil building, Kolar 563101",
    description:
      "The top layer of the approach road has completely washed away over about 60 metres, leaving loose gravel and exposed stone. Buses jolt badly and passengers with luggage struggle on the slope. Gravel filling has started at the far end and the contractor board is on site. Requesting the remaining stretch be levelled before the next spell of rain.",
    images: [roadImg],
    state: "Karnataka",
    district: "Kolar",
    city: "Kolar",
    lat: 13.1357,
    lng: 78.129,
  },
  {
    id: "BLO-1049",
    title: "Dark stretch near Salt Lake pedestrian crossing",
    reporter: "Arindam Ghosh",
    date: "2026-08-07",
    status: "reported",
    category: "Streetlight",
    location: "Salt Lake Sector 5, Kolkata",
    address: "Near College More crossing, Sector 5, Bidhannagar, Kolkata 700091",
    description:
      "The two high-mast lamps covering the pedestrian crossing have been off for around ten days. Office crowds cross here between 8 and 10 pm and vehicles turning from the flyover cannot see them clearly. A near miss was reported on Tuesday. Requesting urgent restoration, as this is one of the busiest evening crossings in the sector.",
    images: [streetlightImg],
    state: "West Bengal",
    district: "North 24 Parganas",
    city: "Kolkata",
    lat: 22.5776,
    lng: 88.4318,
  },
  {
    id: "BLO-1050",
    title: "Waste dumped at the edge of Amer Road lake bund",
    reporter: "Pooja Rathore",
    date: "2026-08-02",
    status: "solved",
    category: "Garbage collection",
    location: "Amer, Jaipur",
    address: "Lake bund path, near Kesar Kyari gate, Amer Road, Jaipur 302028",
    description:
      "Construction debris and household waste were being dumped along the bund path at night, spoiling a walking route used by visitors and locals. The sanitation team cleared roughly two truckloads, installed a low barrier and put up warning signage. Night patrolling was increased for a fortnight and no fresh dumping has been reported since.",
    images: [garbageImg],
    state: "Rajasthan",
    district: "Jaipur",
    city: "Jaipur",
    lat: 26.9855,
    lng: 75.8513,
  },
  {
    id: "BLO-1051",
    title: "Drain cover missing beside school gate",
    reporter: "Imran Qureshi",
    date: "2026-08-13",
    status: "reported",
    category: "Drainage",
    location: "Maninagar, Ahmedabad",
    address: "Opposite Nutan Vidyalaya gate, Krishnanagar Road, Maninagar, Ahmedabad 380008",
    description:
      "A concrete drain slab right outside the school gate has broken and one section is missing, leaving an open gap about two feet wide. Children step around it in a crowd every afternoon and a parent's scooter wheel already went in once. Requesting a replacement slab immediately and a temporary barricade until then.",
    images: [drainageImg],
    state: "Gujarat",
    district: "Ahmedabad",
    city: "Ahmedabad",
    lat: 22.9963,
    lng: 72.6009,
  },
  {
    id: "BLO-1052",
    title: "Overflowing tap point wasting water in Alambagh",
    reporter: "Shalini Verma",
    date: "2026-07-28",
    status: "solved",
    category: "Water leak",
    location: "Alambagh, Lucknow",
    address: "Public stand post, Sardar Patel Marg, Alambagh, Lucknow 226005",
    description:
      "The public stand post had a broken handle and ran continuously for several days, flooding the corner and leaving slush on the path. The jal kal team replaced the tap assembly and repaired the plinth. Water now stops properly and the surrounding area has dried out. Residents in the lane have confirmed the fix.",
    images: [waterImg],
    state: "Uttar Pradesh",
    district: "Lucknow",
    city: "Lucknow",
    lat: 26.8083,
    lng: 80.8896,
  },
  {
    id: "BLO-1053",
    title: "Community ground lights and seating damaged",
    reporter: "Vikram Solanki",
    date: "2026-08-08",
    status: "progress",
    category: "Public space",
    location: "Vaishali Nagar, Jaipur",
    address: "Ward ground, Sector 4, Vaishali Nagar, Jaipur 302021",
    description:
      "Evening games stopped because two flood lamps on the ground are broken and the spectator benches along the north edge are cracked. Local youth cleaned the ground themselves. The ward has approved lamp replacement and carpentry work, which is now scheduled. Requesting confirmation of the completion date so practice sessions can resume.",
    images: [parkImg],
    state: "Rajasthan",
    district: "Jaipur",
    city: "Jaipur",
    lat: 26.9124,
    lng: 75.7373,
  },
];

export function getStatesFromIssues(issues: Issue[]): string[] {
  return Array.from(new Set(issues.map((i) => i.state))).sort();
}

export function districtsFor(issues: Issue[], state: string): string[] {
  return Array.from(
    new Set(issues.filter((i) => state === "all" || i.state === state).map((i) => i.district)),
  ).sort();
}

export function citiesFor(issues: Issue[], state: string, district: string): string[] {
  return Array.from(
    new Set(
      issues
        .filter(
          (i) =>
            (state === "all" || i.state === state) &&
            (district === "all" || i.district === district),
        )
        .map((i) => i.city),
    ),
  ).sort();
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
