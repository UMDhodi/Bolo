/**
 * Multi-language copy dictionary for Bolo Civic Connect.
 *
 * getT(lang) returns the full translation dict for a given language.
 * The default export `t` is English (for backward-compat with non-reactive
 * contexts like meta tags). Reactive components should use useT() from
 * language-context.tsx instead.
 */

export const LANGUAGES = [
  { code: "en", label: "English",  native: "English" },
  { code: "hi", label: "Hindi",    native: "हिन्दी" },
  { code: "mr", label: "Marathi",  native: "मराठी" },
  { code: "bn", label: "Bengali",  native: "বাংলা" },
  { code: "ta", label: "Tamil",    native: "தமிழ்" },
  { code: "te", label: "Telugu",   native: "తెలుగు" },
  { code: "kn", label: "Kannada",  native: "ಕನ್ನಡ" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export type TranslationDict = {
  brand: string;
  tagline: string;
  nav: {
    home: string;
    explore: string;
    raise: string;
    profile: string;
    language: string;
  };
  status: {
    reported: string;
    progress: string;
    solved: string;
    legend: string;
  };
  home: {
    title: string;
    subtitle: string;
    searchLabel: string;
    searchPlaceholder: string;
    state: string;
    district: string;
    city: string;
    all: string;
    useLocation: string;
    locating: string;
    locationDenied: string;
    locationOn: string;
    listTitle: string;
    listCount: (n: number) => string;
    empty: string;
    reset: string;
  };
  explore: {
    title: string;
    subtitle: string;
    cta: string;
    translate: string;
    translateNote: string;
  };
  raise: {
    title: string;
    subtitle: string;
    photos: string;
    photosHint: string;
    browse: string;
    takePhoto: string;
    titleField: string;
    titlePlaceholder: string;
    reporter: string;
    reporterPlaceholder: string;
    date: string;
    time: string;
    location: string;
    locationPlaceholder: string;
    address: string;
    addressPlaceholder: string;
    description: string;
    descriptionPlaceholder: string;
    language: string;
    languageHint: string;
    submit: string;
    submitting: string;
    required: string;
    success: string;
    errors: {
      title: string;
      reporter: string;
      date: string;
      time: string;
      location: string;
      address: string;
      description: string;
    };
    groupPhotos: string;
    groupWhat: string;
    groupWhere: string;
    groupWho: string;
  };
  detail: {
    reportedBy: string;
    date: string;
    location: string;
    address: string;
    description: string;
    close: string;
    open: string;
    gallery: string;
  };
  profile: {
    title: string;
    editProfile: string;
    saveChanges: string;
    saving: string;
    cancel: string;
    legalName: string;
    mobile: string;
    email: string;
    complaintsRaised: string;
    verified: string;
    notVerified: string;
    signOut: string;
    editSuccess: string;
  };
  disclaimer: string;
};

const en: TranslationDict = {
  brand: "Bolo",
  tagline: "Civic Connect",
  nav: {
    home: "Home",
    explore: "Explore Issues",
    raise: "Raise an Issue",
    profile: "Your profile",
    language: "Language",
  },
  status: {
    reported: "Problem Reported",
    progress: "Work in Progress",
    solved: "Problem Solved",
    legend: "Status legend",
  },
  home: {
    title: "Community issue map",
    subtitle: "Browse civic complaints reported around you.",
    searchLabel: "Search city, village or town",
    searchPlaceholder: "Try “Pune”, “Kolar”, “Dwarka”…",
    state: "State",
    district: "District",
    city: "City",
    all: "All",
    useLocation: "Use my location",
    locating: "Locating…",
    locationDenied: "Location permission not granted — showing all of India.",
    locationOn: "Centred on your state-level area.",
    listTitle: "Reported issues",
    listCount: (n: number) => `${n} issues in view`,
    empty: "No issues match these filters yet.",
    reset: "Clear filters",
  },
  explore: {
    title: "Explore issues",
    subtitle: "A visual feed of what people are reporting across the country.",
    cta: "Explore",
    translate: "Auto-translate",
    translateNote: "Translation preview only — no text is actually translated yet.",
  },
  raise: {
    title: "Raise an issue",
    subtitle: "Share what needs attention in your area. Clear photos and details help crews act faster.",
    photos: "Photos of the issue",
    photosHint: "Drag & drop images here, or click to browse. JPG or PNG, up to 5 images.",
    browse: "Choose images",
    takePhoto: "Take Photo",
    titleField: "Issue title",
    titlePlaceholder: "e.g. Deep potholes near Shivaji Chowk bus stop",
    reporter: "Your name",
    reporterPlaceholder: "e.g. Ananya Deshmukh",
    date: "Date",
    time: "Time",
    location: "Location (area / landmark)",
    locationPlaceholder: "e.g. Kothrud, Pune",
    address: "Full address",
    addressPlaceholder: "House / street / locality, city, PIN code",
    description: "Detailed description",
    descriptionPlaceholder: "Describe what you saw, how long it has been like this, and who is affected.",
    language: "Language for your report",
    languageHint: "Type in your preferred language — the form accepts Indian-language text.",
    submit: "Submit issue",
    submitting: "Submitting…",
    required: "Required",
    success: "Issue submitted successfully.",
    errors: {
      title: "Please add a short title.",
      reporter: "Please enter your name.",
      date: "Please pick a date.",
      time: "Please pick a time.",
      location: "Please add an area or landmark.",
      address: "Please add the full address.",
      description: "Please describe the issue in a few sentences.",
    },
    groupPhotos: "Photo evidence",
    groupWhat: "What is the issue?",
    groupWhere: "Where and when?",
    groupWho: "About you",
  },
  detail: {
    reportedBy: "Reported by",
    date: "Reported on",
    location: "Location",
    address: "Full address",
    description: "Description",
    close: "Close",
    open: "Open full details",
    gallery: "Photo gallery",
  },
  profile: {
    title: "Your Profile",
    editProfile: "Edit Profile",
    saveChanges: "Save Changes",
    saving: "Saving…",
    cancel: "Cancel",
    legalName: "Legal Name",
    mobile: "Mobile Number",
    email: "Email Address",
    complaintsRaised: "Complaints Raised",
    verified: "Verified",
    notVerified: "Not Verified",
    signOut: "Sign out",
    editSuccess: "Profile updated successfully.",
  },
  disclaimer: "Prototype with sample data. Not official government information.",
};

const hi: TranslationDict = {
  brand: "बोलो",
  tagline: "नागरिक कनेक्ट",
  nav: {
    home: "होम",
    explore: "शिकायतें देखें",
    raise: "शिकायत दर्ज करें",
    profile: "आपकी प्रोफ़ाइल",
    language: "भाषा",
  },
  status: {
    reported: "समस्या दर्ज",
    progress: "कार्य प्रगति पर",
    solved: "समस्या हल",
    legend: "स्थिति विवरण",
  },
  home: {
    title: "सामुदायिक शिकायत मानचित्र",
    subtitle: "आपके आसपास की नागरिक शिकायतें देखें।",
    searchLabel: "शहर, गाँव या कस्बा खोजें",
    searchPlaceholder: "जैसे “पुणे”, “कोलार”, “द्वारका”…",
    state: "राज्य",
    district: "जिला",
    city: "शहर",
    all: "सभी",
    useLocation: "मेरा स्थान उपयोग करें",
    locating: "स्थान खोजा जा रहा है…",
    locationDenied: "स्थान अनुमति नहीं मिली — सम्पूर्ण भारत दिखाया जा रहा है।",
    locationOn: "आपके राज्य क्षेत्र पर केन्द्रित।",
    listTitle: "दर्ज शिकायतें",
    listCount: (n: number) => `दृश्य में ${n} शिकायतें`,
    empty: "इन फ़िल्टर से कोई शिकायत नहीं मिली।",
    reset: "फ़िल्टर साफ़ करें",
  },
  explore: {
    title: "शिकायतें एक्सप्लोर करें",
    subtitle: "देश भर में लोग क्या रिपोर्ट कर रहे हैं।",
    cta: "एक्सप्लोर करें",
    translate: "स्वतः अनुवाद",
    translateNote: "केवल अनुवाद पूर्वावलोकन — अभी कोई वास्तविक अनुवाद नहीं हुआ।",
  },
  raise: {
    title: "शिकायत दर्ज करें",
    subtitle: "अपने क्षेत्र की समस्या बताएं। स्पष्ट फ़ोटो और विवरण से कार्य जल्दी होता है।",
    photos: "समस्या की फ़ोटो",
    photosHint: "यहाँ तस्वीरें खींचें या ब्राउज़ करें। JPG या PNG, अधिकतम 5 तस्वीरें।",
    browse: "तस्वीरें चुनें",
    takePhoto: "फ़ोटो खींचें",
    titleField: "शिकायत का शीर्षक",
    titlePlaceholder: "जैसे शिवाजी चौक बस स्टॉप के पास गहरे गड्ढे",
    reporter: "आपका नाम",
    reporterPlaceholder: "जैसे अनन्या देशमुख",
    date: "तारीख",
    time: "समय",
    location: "स्थान (क्षेत्र / लैंडमार्क)",
    locationPlaceholder: "जैसे कोथरूड, पुणे",
    address: "पूरा पता",
    addressPlaceholder: "मकान / सड़क / मोहल्ला, शहर, पिन कोड",
    description: "विस्तृत विवरण",
    descriptionPlaceholder: "आपने क्या देखा, कितने समय से है, और किसे परेशानी है — बताएं।",
    language: "रिपोर्ट की भाषा",
    languageHint: "अपनी पसंदीदा भाषा में लिखें।",
    submit: "शिकायत जमा करें",
    submitting: "जमा हो रहा है…",
    required: "अनिवार्य",
    success: "शिकायत सफलतापूर्वक जमा की गई।",
    errors: {
      title: "कृपया संक्षिप्त शीर्षक लिखें।",
      reporter: "कृपया अपना नाम दर्ज करें।",
      date: "कृपया तारीख चुनें।",
      time: "कृपया समय चुनें।",
      location: "कृपया क्षेत्र या लैंडमार्क दर्ज करें।",
      address: "कृपया पूरा पता दर्ज करें।",
      description: "कृपया कुछ वाक्यों में समस्या बताएं।",
    },
    groupPhotos: "फ़ोटो साक्ष्य",
    groupWhat: "समस्या क्या है?",
    groupWhere: "कहाँ और कब?",
    groupWho: "आपके बारे में",
  },
  detail: {
    reportedBy: "रिपोर्ट किया",
    date: "दर्ज तारीख",
    location: "स्थान",
    address: "पूरा पता",
    description: "विवरण",
    close: "बंद करें",
    open: "पूरी जानकारी खोलें",
    gallery: "फ़ोटो गैलरी",
  },
  profile: {
    title: "आपकी प्रोफ़ाइल",
    editProfile: "प्रोफ़ाइल संपादित करें",
    saveChanges: "बदलाव सहेजें",
    saving: "सहेजा जा रहा है…",
    cancel: "रद्द करें",
    legalName: "कानूनी नाम",
    mobile: "मोबाइल नंबर",
    email: "ईमेल पता",
    complaintsRaised: "दर्ज शिकायतें",
    verified: "सत्यापित",
    notVerified: "असत्यापित",
    signOut: "साइन आउट",
    editSuccess: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई।",
  },
  disclaimer: "नमूना डेटा के साथ प्रोटोटाइप। आधिकारिक सरकारी जानकारी नहीं।",
};

const mr: TranslationDict = {
  brand: "बोलो",
  tagline: "नागरिक कनेक्ट",
  nav: {
    home: "मुख्यपृष्ठ",
    explore: "तक्रारी पहा",
    raise: "तक्रार नोंदवा",
    profile: "तुमची प्रोफाइल",
    language: "भाषा",
  },
  status: {
    reported: "समस्या नोंदवली",
    progress: "काम सुरू आहे",
    solved: "समस्या सुटली",
    legend: "स्थिती माहिती",
  },
  home: {
    title: "सामुदायिक समस्या नकाशा",
    subtitle: "तुमच्या आसपासच्या नागरिक तक्रारी पहा।",
    searchLabel: "शहर, गाव किंवा नगर शोधा",
    searchPlaceholder: "जसे “पुणे”, “नाशिक”, “औरंगाबाद”…",
    state: "राज्य",
    district: "जिल्हा",
    city: "शहर",
    all: "सर्व",
    useLocation: "माझे स्थान वापरा",
    locating: "स्थान शोधत आहे…",
    locationDenied: "स्थान परवानगी नाकारली — संपूर्ण भारत दाखवत आहे।",
    locationOn: "तुमच्या राज्य क्षेत्रावर केंद्रित।",
    listTitle: "नोंदवलेल्या तक्रारी",
    listCount: (n: number) => `दृश्यात ${n} तक्रारी`,
    empty: "या फिल्टरला कोणत्याही तक्रारी नाहीत।",
    reset: "फिल्टर साफ करा",
  },
  explore: {
    title: "तक्रारी एक्सप्लोर करा",
    subtitle: "देशभरात लोक काय तक्रार करत आहेत।",
    cta: "एक्सप्लोर करा",
    translate: "स्वयं-अनुवाद",
    translateNote: "केवळ अनुवाद पूर्वावलोकन।",
  },
  raise: {
    title: "तक्रार नोंदवा",
    subtitle: "तुमच्या क्षेत्रातील समस्या सांगा. स्पष्ट फोटो व माहिती काम लवकर होण्यास मदत करते।",
    photos: "समस्येचे फोटो",
    photosHint: "इथे फोटो ड्रॅग करा किंवा ब्राउज करा. JPG किंवा PNG, जास्तीत जास्त 5 फोटो।",
    browse: "फोटो निवडा",
    takePhoto: "फोटो काढा",
    titleField: "तक्रारीचे शीर्षक",
    titlePlaceholder: "जसे शिवाजी चौक बस थांब्याजवळ मोठे खड्डे",
    reporter: "तुमचे नाव",
    reporterPlaceholder: "जसे अनन्या देशमुख",
    date: "तारीख",
    time: "वेळ",
    location: "स्थान (परिसर / खूण)",
    locationPlaceholder: "जसे कोथरूड, पुणे",
    address: "पूर्ण पत्ता",
    addressPlaceholder: "घर / रस्ता / परिसर, शहर, पिन कोड",
    description: "सविस्तर वर्णन",
    descriptionPlaceholder: "तुम्ही काय पाहिले, किती दिवसांपासून आहे आणि कोणाला त्रास आहे ते सांगा।",
    language: "तक्रारीची भाषा",
    languageHint: "तुमच्या आवडत्या भाषेत लिहा।",
    submit: "तक्रार सादर करा",
    submitting: "सादर होत आहे…",
    required: "आवश्यक",
    success: "तक्रार यशस्वीरित्या सादर झाली।",
    errors: {
      title: "कृपया संक्षिप्त शीर्षक लिहा।",
      reporter: "कृपया तुमचे नाव नमूद करा।",
      date: "कृपया तारीख निवडा।",
      time: "कृपया वेळ निवडा।",
      location: "कृपया परिसर किंवा खूण नमूद करा।",
      address: "कृपया पूर्ण पत्ता नमूद करा।",
      description: "कृपया काही वाक्यांत समस्या सांगा।",
    },
    groupPhotos: "फोटो पुरावा",
    groupWhat: "समस्या काय आहे?",
    groupWhere: "कुठे आणि कधी?",
    groupWho: "तुमच्याबद्दल",
  },
  detail: {
    reportedBy: "नोंदवले",
    date: "नोंदणी तारीख",
    location: "स्थान",
    address: "पूर्ण पत्ता",
    description: "वर्णन",
    close: "बंद करा",
    open: "पूर्ण माहिती उघडा",
    gallery: "फोटो गॅलरी",
  },
  profile: {
    title: "तुमची प्रोफाइल",
    editProfile: "प्रोफाइल संपादित करा",
    saveChanges: "बदल जतन करा",
    saving: "जतन होत आहे…",
    cancel: "रद्द करा",
    legalName: "कायदेशीर नाव",
    mobile: "मोबाइल नंबर",
    email: "ईमेल पत्ता",
    complaintsRaised: "नोंदवलेल्या तक्रारी",
    verified: "सत्यापित",
    notVerified: "असत्यापित",
    signOut: "साइन आउट",
    editSuccess: "प्रोफाइल यशस्वीरित्या अपडेट झाली।",
  },
  disclaimer: "नमुना डेटासह प्रोटोटाइप. अधिकृत सरकारी माहिती नाही।",
};

const bn: TranslationDict = {
  brand: "বলো",
  tagline: "নাগরিক সংযোগ",
  nav: {
    home: "হোম",
    explore: "অভিযোগ দেখুন",
    raise: "অভিযোগ করুন",
    profile: "আপনার প্রোফাইল",
    language: "ভাষা",
  },
  status: {
    reported: "সমস্যা নথিভুক্ত",
    progress: "কাজ চলছে",
    solved: "সমস্যা সমাধান",
    legend: "অবস্থা বিবরণ",
  },
  home: {
    title: "সামুদায়িক সমস্যার মানচিত্র",
    subtitle: "আপনার আশেপাশে রিপোর্ট করা নাগরিক অভিযোগগুলি দেখুন।",
    searchLabel: "শহর, গ্রাম বা নগর অনুসন্ধান করুন",
    searchPlaceholder: "যেমন “পুণে”, “কোলার”, “দ্বারকা”…",
    state: "রাজ্য",
    district: "জেলা",
    city: "শহর",
    all: "সব",
    useLocation: "আমার অবস্থান ব্যবহার করুন",
    locating: "অবস্থান খুঁজছে…",
    locationDenied: "অবস্থানের অনুমতি দেওয়া হয়নি — সমগ্র ভারত দেখানো হচ্ছে।",
    locationOn: "আপনার রাজ্য এলাকায় কেন্দ্রীভূত।",
    listTitle: "নথিভুক্ত অভিযোগ",
    listCount: (n: number) => `দৃশ্যে ${n}টি অভিযোগ`,
    empty: "এই ফিল্টারে কোনো অভিযোগ পাওয়া যায়নি।",
    reset: "ফিল্টার পরিষ্কার করুন",
  },
  explore: {
    title: "অভিযোগ অন্বেষণ করুন",
    subtitle: "সারা দেশে মানুষ কী রিপোর্ট করছে।",
    cta: "অন্বেষণ করুন",
    translate: "স্বয়ংক্রিয় অনুবাদ",
    translateNote: "শুধুমাত্র অনুবাদ পূর্বরূপ।",
  },
  raise: {
    title: "অভিযোগ করুন",
    subtitle: "আপনার এলাকার সমস্যা জানান। স্পষ্ট ছবি ও বিবরণ কাজ দ্রুত করতে সাহায্য করে।",
    photos: "সমস্যার ছবি",
    photosHint: "এখানে ছবি টেনে আনুন বা ব্রাউজ করুন। JPG বা PNG, সর্বোচ্চ ৫টি ছবি।",
    browse: "ছবি বেছে নিন",
    takePhoto: "ছবি তুলুন",
    titleField: "অভিযোগের শিরোনাম",
    titlePlaceholder: "যেমন শিবাজি চক বাস স্টপের কাছে গভীর গর্ত",
    reporter: "আপনার নাম",
    reporterPlaceholder: "যেমন অনন্যা দেশমুখ",
    date: "তারিখ",
    time: "সময়",
    location: "অবস্থান (এলাকা / ল্যান্ডমার্ক)",
    locationPlaceholder: "যেমন কোথরুড, পুণে",
    address: "সম্পূর্ণ ঠিকানা",
    addressPlaceholder: "বাড়ি / রাস্তা / এলাকা, শহর, পিন কোড",
    description: "বিস্তারিত বিবরণ",
    descriptionPlaceholder: "আপনি কী দেখেছেন, কতদিন ধরে আছে এবং কে ক্ষতিগ্রস্ত — জানান।",
    language: "রিপোর্টের ভাষা",
    languageHint: "আপনার পছন্দের ভাষায় লিখুন।",
    submit: "অভিযোগ জমা দিন",
    submitting: "জমা হচ্ছে…",
    required: "আবশ্যক",
    success: "অভিযোগ সফলভাবে জমা হয়েছে।",
    errors: {
      title: "অনুগ্রহ করে একটি সংক্ষিপ্ত শিরোনাম যোগ করুন।",
      reporter: "অনুগ্রহ করে আপনার নাম লিখুন।",
      date: "অনুগ্রহ করে তারিখ বেছে নিন।",
      time: "অনুগ্রহ করে সময় বেছে নিন।",
      location: "অনুগ্রহ করে এলাকা বা ল্যান্ডমার্ক যোগ করুন।",
      address: "অনুগ্রহ করে সম্পূর্ণ ঠিকানা যোগ করুন।",
      description: "অনুগ্রহ করে কয়েকটি বাক্যে সমস্যা বর্ণনা করুন।",
    },
    groupPhotos: "ছবির প্রমাণ",
    groupWhat: "সমস্যাটি কী?",
    groupWhere: "কোথায় এবং কখন?",
    groupWho: "আপনার সম্পর্কে",
  },
  detail: {
    reportedBy: "রিপোর্ট করেছেন",
    date: "নথিভুক্তির তারিখ",
    location: "অবস্থান",
    address: "সম্পূর্ণ ঠিকানা",
    description: "বিবরণ",
    close: "বন্ধ করুন",
    open: "সম্পূর্ণ বিবরণ খুলুন",
    gallery: "ছবির গ্যালারি",
  },
  profile: {
    title: "আপনার প্রোফাইল",
    editProfile: "প্রোফাইল সম্পাদনা করুন",
    saveChanges: "পরিবর্তন সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে…",
    cancel: "বাতিল করুন",
    legalName: "আইনি নাম",
    mobile: "মোবাইল নম্বর",
    email: "ইমেল ঠিকানা",
    complaintsRaised: "দায়ের করা অভিযোগ",
    verified: "যাচাইকৃত",
    notVerified: "অযাচাইকৃত",
    signOut: "সাইন আউট",
    editSuccess: "প্রোফাইল সফলভাবে আপডেট হয়েছে।",
  },
  disclaimer: "নমুনা ডেটা সহ প্রোটোটাইপ। সরকারি তথ্য নয়।",
};

const ta: TranslationDict = {
  brand: "போலோ",
  tagline: "குடிமக்கள் இணைப்பு",
  nav: {
    home: "முகப்பு",
    explore: "புகார்களை காண்க",
    raise: "புகார் அளிக்க",
    profile: "உங்கள் சுயவிவரம்",
    language: "மொழி",
  },
  status: {
    reported: "பிரச்சினை பதிவு செய்யப்பட்டது",
    progress: "பணி நடந்து கொண்டிருக்கிறது",
    solved: "பிரச்சினை தீர்க்கப்பட்டது",
    legend: "நிலை விளக்கம்",
  },
  home: {
    title: "சமூக பிரச்சினை வரைபடம்",
    subtitle: "உங்களைச் சுற்றி புகாரளிக்கப்பட்ட குடிமக்கள் புகார்களை காண்க।",
    searchLabel: "நகரம், கிராமம் அல்லது நகர்ப்புறம் தேடுக",
    searchPlaceholder: "“புணே”, “கோலார்”, “துவாரகா”…",
    state: "மாநிலம்",
    district: "மாவட்டம்",
    city: "நகரம்",
    all: "அனைத்தும்",
    useLocation: "என் இடத்தை பயன்படுத்து",
    locating: "இடம் கண்டறிகிறது…",
    locationDenied: "இட அனுமதி வழங்கப்படவில்லை — முழு இந்தியாவும் காட்டப்படுகிறது।",
    locationOn: "உங்கள் மாநில பகுதியை மையமாகக் கொண்டது।",
    listTitle: "பதிவு செய்யப்பட்ட புகார்கள்",
    listCount: (n: number) => `காட்சியில் ${n} புகார்கள்`,
    empty: "இந்த வடிகட்டிகளில் புகார்கள் இல்லை।",
    reset: "வடிகட்டிகளை அழி",
  },
  explore: {
    title: "புகார்களை ஆய்வு செய்க",
    subtitle: "நாடு முழுவதும் மக்கள் என்ன புகாரளிக்கிறார்கள்.",
    cta: "ஆய்வு செய்க",
    translate: "தானியங்கு மொழிபெயர்ப்பு",
    translateNote: "மொழிபெயர்ப்பு முன்னோட்டம் மட்டுமே।",
  },
  raise: {
    title: "புகார் அளிக்க",
    subtitle: "உங்கள் பகுதியில் கவனிக்க வேண்டியதை தெரிவிக்கவும்.",
    photos: "பிரச்சினையின் புகைப்படங்கள்",
    photosHint: "இங்கே படங்களை இழுக்கவும் அல்லது உலாவுக. JPG அல்லது PNG, 5 படங்கள் வரை।",
    browse: "படங்களை தேர்ந்தெடுக்க",
    takePhoto: "புகைப்படம் எடுக்க",
    titleField: "புகார் தலைப்பு",
    titlePlaceholder: "எ.கா. சிவாஜி சதுக்கம் பேருந்து நிறுத்தத்தருகில் ஆழமான குழிகள்",
    reporter: "உங்கள் பெயர்",
    reporterPlaceholder: "எ.கா. அனன்யா தேஷ்முக்",
    date: "தேதி",
    time: "நேரம்",
    location: "இடம் (பகுதி / அடையாளம்)",
    locationPlaceholder: "எ.கா. கோத்ருட், புணே",
    address: "முழு முகவரி",
    addressPlaceholder: "வீடு / தெரு / பகுதி, நகரம், பின் குறியீடு",
    description: "விரிவான விளக்கம்",
    descriptionPlaceholder: "நீங்கள் என்ன பார்த்தீர்கள், எவ்வளவு காலமாக இருக்கிறது என்று கூறுங்கள்।",
    language: "அறிக்கையின் மொழி",
    languageHint: "உங்கள் விருப்பமான மொழியில் எழுதுக।",
    submit: "புகாரை சமர்ப்பி",
    submitting: "சமர்ப்பிக்கப்படுகிறது…",
    required: "தேவையானது",
    success: "புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது।",
    errors: {
      title: "ஒரு சுருக்கமான தலைப்பைச் சேர்க்கவும்।",
      reporter: "உங்கள் பெயரை உள்ளிடவும்।",
      date: "தேதியை தேர்ந்தெடுக்கவும்।",
      time: "நேரத்தை தேர்ந்தெடுக்கவும்।",
      location: "பகுதி அல்லது அடையாளத்தை உள்ளிடவும்।",
      address: "முழு முகவரியை உள்ளிடவும்।",
      description: "சில வாக்கியங்களில் பிரச்சினையை விவரிக்கவும்।",
    },
    groupPhotos: "புகைப்பட சான்று",
    groupWhat: "பிரச்சினை என்ன?",
    groupWhere: "எங்கே மற்றும் எப்போது?",
    groupWho: "உங்களைப் பற்றி",
  },
  detail: {
    reportedBy: "புகாரளித்தவர்",
    date: "பதிவு செய்த தேதி",
    location: "இடம்",
    address: "முழு முகவரி",
    description: "விளக்கம்",
    close: "மூடு",
    open: "முழு விவரங்களை திறக்கவும்",
    gallery: "புகைப்பட தொகுப்பு",
  },
  profile: {
    title: "உங்கள் சுயவிவரம்",
    editProfile: "சுயவிவரத்தை திருத்து",
    saveChanges: "மாற்றங்களை சேமி",
    saving: "சேமிக்கப்படுகிறது…",
    cancel: "ரத்துசெய்",
    legalName: "சட்டப்பூர்வ பெயர்",
    mobile: "மொபைல் எண்",
    email: "மின்னஞ்சல் முகவரி",
    complaintsRaised: "செய்யப்பட்ட புகார்கள்",
    verified: "சரிபார்க்கப்பட்டது",
    notVerified: "சரிபார்க்கப்படவில்லை",
    signOut: "வெளியேறு",
    editSuccess: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது।",
  },
  disclaimer: "மாதிரி தரவுகளுடன் முன்மாதிரி. அரசு தகவல் அல்ல।",
};

const te: TranslationDict = {
  brand: "బోలో",
  tagline: "పౌర కనెక్ట్",
  nav: {
    home: "హోమ్",
    explore: "ఫిర్యాదులు చూడండి",
    raise: "ఫిర్యాదు చేయండి",
    profile: "మీ ప్రొఫైల్",
    language: "భాష",
  },
  status: {
    reported: "సమస్య నమోదు చేయబడింది",
    progress: "పని జరుగుతోంది",
    solved: "సమస్య పరిష్కరించబడింది",
    legend: "స్థితి వివరణ",
  },
  home: {
    title: "సమాజ సమస్య మ్యాప్",
    subtitle: "మీ చుట్టూ నివేదించబడిన పౌర ఫిర్యాదులు చూడండి.",
    searchLabel: "నగరం, గ్రామం లేదా పట్టణం వెతకండి",
    searchPlaceholder: "“పుణే”, “కోలార్”, “ద్వారక”…",
    state: "రాష్ట్రం",
    district: "జిల్లా",
    city: "నగరం",
    all: "అన్నీ",
    useLocation: "నా స్థానం ఉపయోగించు",
    locating: "స్థానం గుర్తిస్తోంది…",
    locationDenied: "స్థాన అనుమతి ఇవ్వబడలేదు — మొత్తం భారతదేశం చూపిస్తోంది.",
    locationOn: "మీ రాష్ట్ర స్థాయి ప్రాంతంపై కేంద్రీకృతమైంది.",
    listTitle: "నివేదించిన ఫిర్యాదులు",
    listCount: (n: number) => `వీక్షణలో ${n} ఫిర్యాదులు`,
    empty: "ఈ ఫిల్టర్లకు ఫిర్యాదులు లేవు.",
    reset: "ఫిల్టర్లు క్లియర్ చేయండి",
  },
  explore: {
    title: "ఫిర్యాదులు అన్వేషించండి",
    subtitle: "దేశవ్యాప్తంగా ప్రజలు ఏమి నివేదిస్తున్నారో చూడండి.",
    cta: "అన్వేషించండి",
    translate: "స్వయంచాలక అనువాదం",
    translateNote: "అనువాద ప్రివ్యూ మాత్రమే.",
  },
  raise: {
    title: "ఫిర్యాదు చేయండి",
    subtitle: "మీ ప్రాంతంలో శ్రద్ధ అవసరమైన దాన్ని తెలపండి.",
    photos: "సమస్య ఫోటోలు",
    photosHint: "ఇక్కడ చిత్రాలు లాగండి లేదా బ్రౌజ్ చేయండి. JPG లేదా PNG, 5 చిత్రాల వరకు.",
    browse: "చిత్రాలు ఎంచుకోండి",
    takePhoto: "ఫోటో తీయండి",
    titleField: "ఫిర్యాదు శీర్షిక",
    titlePlaceholder: "ఉదా. శివాజీ చౌక్ బస్ స్టాప్ దగ్గర లోతైన గుంతలు",
    reporter: "మీ పేరు",
    reporterPlaceholder: "ఉదా. అనన్య దేశముఖ్",
    date: "తేదీ",
    time: "సమయం",
    location: "స్థానం (ప్రాంతం / లాండ్‌మార్క్)",
    locationPlaceholder: "ఉదా. కోత్రుడ్, పుణే",
    address: "పూర్తి చిరునామా",
    addressPlaceholder: "ఇల్లు / వీధి / లోకాలిటీ, నగరం, పిన్ కోడ్",
    description: "వివరణాత్మక వివరణ",
    descriptionPlaceholder: "మీరు ఏమి చూశారు, ఎంత కాలంగా ఉంది, ఎవరు ప్రభావితమవుతున్నారో చెప్పండి.",
    language: "నివేదిక భాష",
    languageHint: "మీకు ఇష్టమైన భాషలో రాయండి.",
    submit: "ఫిర్యాదు సమర్పించండి",
    submitting: "సమర్పిస్తోంది…",
    required: "అవసరం",
    success: "ఫిర్యాదు విజయవంతంగా సమర్పించబడింది.",
    errors: {
      title: "దయచేసి ఒక చిన్న శీర్షిక జోడించండి.",
      reporter: "దయచేసి మీ పేరు నమోదు చేయండి.",
      date: "దయచేసి తేదీ ఎంచుకోండి.",
      time: "దయచేసి సమయం ఎంచుకోండి.",
      location: "దయచేసి ప్రాంతం లేదా లాండ్‌మార్క్ జోడించండి.",
      address: "దయచేసి పూర్తి చిరునామా జోడించండి.",
      description: "దయచేసి కొన్ని వాక్యాల్లో సమస్యను వివరించండి.",
    },
    groupPhotos: "ఫోటో ఆధారం",
    groupWhat: "సమస్య ఏమిటి?",
    groupWhere: "ఎక్కడ మరియు ఎప్పుడు?",
    groupWho: "మీ గురించి",
  },
  detail: {
    reportedBy: "నివేదించినది",
    date: "నివేదించిన తేదీ",
    location: "స్థానం",
    address: "పూర్తి చిరునామా",
    description: "వివరణ",
    close: "మూసివేయి",
    open: "పూర్తి వివరాలు తెరవండి",
    gallery: "ఫోటో గ్యాలరీ",
  },
  profile: {
    title: "మీ ప్రొఫైల్",
    editProfile: "ప్రొఫైల్ సవరించండి",
    saveChanges: "మార్పులు సేవ్ చేయండి",
    saving: "సేవ్ అవుతోంది…",
    cancel: "రద్దు చేయండి",
    legalName: "చట్టబద్ధమైన పేరు",
    mobile: "మొబైల్ నంబర్",
    email: "ఇమెయిల్ చిరునామా",
    complaintsRaised: "నివేదించిన ఫిర్యాదులు",
    verified: "ధృవీకరించబడింది",
    notVerified: "ధృవీకరించబడలేదు",
    signOut: "సైన్ అవుట్",
    editSuccess: "ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది.",
  },
  disclaimer: "నమూనా డేటాతో ప్రోటోటైప్. అధికారిక ప్రభుత్వ సమాచారం కాదు.",
};

const kn: TranslationDict = {
  brand: "ಬೋಲೋ",
  tagline: "ನಾಗರಿಕ ಸಂಪರ್ಕ",
  nav: {
    home: "ಮನೆ",
    explore: "ದೂರುಗಳನ್ನು ಹುಡುಕಿ",
    raise: "ದೂರು ಸಲ್ಲಿಸಿ",
    profile: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್",
    language: "ಭಾಷೆ",
  },
  status: {
    reported: "ಸಮಸ್ಯೆ ದಾಖಲಾಗಿದೆ",
    progress: "ಕಾರ್ಯ ನಡೆಯುತ್ತಿದೆ",
    solved: "ಸಮಸ್ಯೆ ಪರಿಹಾರವಾಗಿದೆ",
    legend: "ಸ್ಥಿತಿ ವಿವರಣೆ",
  },
  home: {
    title: "ಸಮುದಾಯ ಸಮಸ್ಯೆಯ ನಕ್ಷೆ",
    subtitle: "ನಿಮ್ಮ ಸುತ್ತಮುತ್ತ ವರದಿ ಮಾಡಿದ ನಾಗರಿಕ ದೂರುಗಳನ್ನು ನೋಡಿ.",
    searchLabel: "ನಗರ, ಹಳ್ಳಿ ಅಥವಾ ಪಟ್ಟಣ ಹುಡುಕಿ",
    searchPlaceholder: "“ಪುಣೆ”, “ಕೋಲಾರ”, “ದ್ವಾರಕ”…",
    state: "ರಾಜ್ಯ",
    district: "ಜಿಲ್ಲೆ",
    city: "ನಗರ",
    all: "ಎಲ್ಲ",
    useLocation: "ನನ್ನ ಸ್ಥಳ ಬಳಸಿ",
    locating: "ಸ್ಥಳ ಕಂಡುಹಿಡಿಯಲಾಗುತ್ತಿದೆ…",
    locationDenied: "ಸ್ಥಳ ಅನುಮತಿ ನೀಡಲಾಗಿಲ್ಲ — ಇಡೀ ಭಾರತ ತೋರಿಸಲಾಗುತ್ತಿದೆ.",
    locationOn: "ನಿಮ್ಮ ರಾಜ್ಯ ಪ್ರದೇಶದಲ್ಲಿ ಕೇಂದ್ರೀಕೃತ.",
    listTitle: "ದಾಖಲಾದ ದೂರುಗಳು",
    listCount: (n: number) => `ನೋಟದಲ್ಲಿ ${n} ದೂರುಗಳು`,
    empty: "ಈ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ದೂರುಗಳಿಲ್ಲ.",
    reset: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ",
  },
  explore: {
    title: "ದೂರುಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    subtitle: "ದೇಶಾದ್ಯಂತ ಜನರು ಏನು ವರದಿ ಮಾಡುತ್ತಿದ್ದಾರೆ.",
    cta: "ಅನ್ವೇಷಿಸಿ",
    translate: "ಸ್ವಯಂ ಅನುವಾದ",
    translateNote: "ಅನುವಾದ ಪೂರ್ವವೀಕ್ಷಣೆ ಮಾತ್ರ.",
  },
  raise: {
    title: "ದೂರು ಸಲ್ಲಿಸಿ",
    subtitle: "ನಿಮ್ಮ ಪ್ರದೇಶದ ಸಮಸ್ಯೆ ತಿಳಿಸಿ.",
    photos: "ಸಮಸ್ಯೆಯ ಫೋಟೋಗಳು",
    photosHint: "ಇಲ್ಲಿ ಚಿತ್ರಗಳನ್ನು ಎಳೆಯಿರಿ ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಿ. JPG ಅಥವಾ PNG, 5 ಚಿತ್ರಗಳವರೆಗೆ.",
    browse: "ಚಿತ್ರಗಳನ್ನು ಆರಿಸಿ",
    takePhoto: "ಫೋಟೋ ತೆಗೆಯಿರಿ",
    titleField: "ದೂರಿನ ಶೀರ್ಷಿಕೆ",
    titlePlaceholder: "ಉದಾ. ಶಿವಾಜಿ ಚೌಕ್ ಬಸ್ ನಿಲ್ದಾಣದ ಬಳಿ ಆಳವಾದ ಗುಂಡಿಗಳು",
    reporter: "ನಿಮ್ಮ ಹೆಸರು",
    reporterPlaceholder: "ಉದಾ. ಅನನ್ಯ ದೇಶಮುಖ್",
    date: "ದಿನಾಂಕ",
    time: "ಸಮಯ",
    location: "ಸ್ಥಳ (ಪ್ರದೇಶ / ಲ್ಯಾಂಡ್‌ಮಾರ್ಕ್)",
    locationPlaceholder: "ಉದಾ. ಕೋತ್ರುಡ್, ಪುಣೆ",
    address: "ಪೂರ್ಣ ವಿಳಾಸ",
    addressPlaceholder: "ಮನೆ / ರಸ್ತೆ / ಪ್ರದೇಶ, ನಗರ, ಪಿನ್ ಕೋಡ್",
    description: "ವಿಸ್ತೃತ ವಿವರಣೆ",
    descriptionPlaceholder: "ನೀವು ಏನು ನೋಡಿದ್ದೀರಿ, ಎಷ್ಟು ಕಾಲದಿಂದ ಇದೆ ಎಂದು ಹೇಳಿ.",
    language: "ವರದಿಯ ಭಾಷೆ",
    languageHint: "ನಿಮ್ಮ ಇಷ್ಟದ ಭಾಷೆಯಲ್ಲಿ ಬರೆಯಿರಿ.",
    submit: "ದೂರು ಸಲ್ಲಿಸಿ",
    submitting: "ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ…",
    required: "ಅಗತ್ಯ",
    success: "ದೂರು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ.",
    errors: {
      title: "ದಯವಿಟ್ಟು ಒಂದು ಚಿಕ್ಕ ಶೀರ್ಷಿಕೆ ಸೇರಿಸಿ.",
      reporter: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.",
      date: "ದಯವಿಟ್ಟು ದಿನಾಂಕ ಆರಿಸಿ.",
      time: "ದಯವಿಟ್ಟು ಸಮಯ ಆರಿಸಿ.",
      location: "ದಯವಿಟ್ಟು ಪ್ರದೇಶ ಅಥವಾ ಲ್ಯಾಂಡ್‌ಮಾರ್ಕ್ ಸೇರಿಸಿ.",
      address: "ದಯವಿಟ್ಟು ಪೂರ್ಣ ವಿಳಾಸ ಸೇರಿಸಿ.",
      description: "ದಯವಿಟ್ಟು ಕೆಲವು ವಾಕ್ಯಗಳಲ್ಲಿ ಸಮಸ್ಯೆ ವಿವರಿಸಿ.",
    },
    groupPhotos: "ಫೋಟೋ ಸಾಕ್ಷ್ಯ",
    groupWhat: "ಸಮಸ್ಯೆ ಏನು?",
    groupWhere: "ಎಲ್ಲಿ ಮತ್ತು ಯಾವಾಗ?",
    groupWho: "ನಿಮ್ಮ ಬಗ್ಗೆ",
  },
  detail: {
    reportedBy: "ವರದಿ ಮಾಡಿದವರು",
    date: "ದಾಖಲಾದ ದಿನಾಂಕ",
    location: "ಸ್ಥಳ",
    address: "ಪೂರ್ಣ ವಿಳಾಸ",
    description: "ವಿವರಣೆ",
    close: "ಮುಚ್ಚಿ",
    open: "ಪೂರ್ಣ ವಿವರಗಳನ್ನು ತೆರೆಯಿರಿ",
    gallery: "ಫೋಟೋ ಗ್ಯಾಲರಿ",
  },
  profile: {
    title: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್",
    editProfile: "ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ",
    saveChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    saving: "ಉಳಿಸಲಾಗುತ್ತಿದೆ…",
    cancel: "ರದ್ದು ಮಾಡಿ",
    legalName: "ಕಾನೂನು ಹೆಸರು",
    mobile: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    complaintsRaised: "ಸಲ್ಲಿಸಿದ ದೂರುಗಳು",
    verified: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
    notVerified: "ಪರಿಶೀಲಿಸಲಾಗಿಲ್ಲ",
    signOut: "ಸೈನ್ ಔಟ್",
    editSuccess: "ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ.",
  },
  disclaimer: "ಮಾದರಿ ಡೇಟಾದೊಂದಿಗೆ ಮೂಲರೂಪ. ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮಾಹಿತಿ ಅಲ್ಲ.",
};

const gu: TranslationDict = {
  brand: "બોલો",
  tagline: "નાગરિક કનેક્ટ",
  nav: {
    home: "હોમ",
    explore: "ફરિયાદો જુઓ",
    raise: "ફરિયાદ કરો",
    profile: "તમારી પ્રોફાઇલ",
    language: "ભાષા",
  },
  status: {
    reported: "સમસ્યા નોંધાઈ",
    progress: "કામ ચાલુ છે",
    solved: "સમસ્યા ઉકેલાઈ",
    legend: "સ્થિતિ વિવરણ",
  },
  home: {
    title: "સામુદાયિક સમસ્યા નકશો",
    subtitle: "તમારી આસપાસ નોંધાયેલ નાગરિક ફરિયાદો જુઓ.",
    searchLabel: "શહેર, ગામ અથવા નગર શોધો",
    searchPlaceholder: "“પુણે”, “કોલાર”, “દ્વારકા”…",
    state: "રાજ્ય",
    district: "જિલ્લો",
    city: "શહેર",
    all: "બધા",
    useLocation: "મારું સ્થાન ઉપયોગ કરો",
    locating: "સ્થાન શોધી રહ્યા છીએ…",
    locationDenied: "સ્થાન પરવાનગી ન મળી — સમગ્ર ભારત બતાવી રહ્યા છીએ.",
    locationOn: "તમારા રાજ્ય સ્તરના ક્ષેત્ર પર કેન્દ્રિત.",
    listTitle: "નોંધાયેલ ફરિયાદો",
    listCount: (n: number) => `દૃશ્યમાં ${n} ફરિયાદો`,
    empty: "આ ફિલ્ટર સાથે કોઈ ફરિયાદ ન મળી.",
    reset: "ફિલ્ટર સાફ કરો",
  },
  explore: {
    title: "ફરિયાદો એક્સ્પ્લોર કરો",
    subtitle: "દેશભરમાં લોકો શું જાણ કરે છે.",
    cta: "એક્સ્પ્લોર કરો",
    translate: "સ્વત: અનુવાદ",
    translateNote: "ફક્ત અનુવાદ પૂર્વાવલોકન.",
  },
  raise: {
    title: "ફરિયાદ કરો",
    subtitle: "તમારા વિસ્તારની સમસ્યા જણાવો. સ્પષ્ટ ફોટો અને વિગતો ઝડપી કામ કરવામાં મદદ કરે છે.",
    photos: "સમસ્યાના ફોટો",
    photosHint: "અહીં ચિત્રો ખેંચો અથવા બ્રાઉઝ કરો. JPG અથવા PNG, 5 ચિત્રો સુધી.",
    browse: "ચિત્રો પસંદ કરો",
    takePhoto: "ફોટો લો",
    titleField: "ફરિયાદ શીર્ષક",
    titlePlaceholder: "ઉદા. શિવાજી ચૌક બસ સ્ટોપ નજીક ઊંડા ખાડા",
    reporter: "તમારું નામ",
    reporterPlaceholder: "ઉદા. અનન્યા દેશમુખ",
    date: "તારીખ",
    time: "સમય",
    location: "સ્થળ (વિસ્તાર / લેન્ડમાર્ક)",
    locationPlaceholder: "ઉદા. કોથ્રુડ, પુણે",
    address: "સંપૂર્ણ સરનામું",
    addressPlaceholder: "ઘર / શેરી / વિસ્તાર, શહેર, પિન કોડ",
    description: "વિગતવાર વર્ણન",
    descriptionPlaceholder: "તમે શું જોયું, કેટલા સમયથી છે અને કોને અસર થઈ છે — જણાવો.",
    language: "રિપોર્ટની ભાષા",
    languageHint: "તમારી પસંદીદા ભાષામાં લખો.",
    submit: "ફરિયાદ સબમિટ કરો",
    submitting: "સબમિટ થઈ રહ્યું છે…",
    required: "જરૂરી",
    success: "ફરિયાદ સફળતાપૂર્વક સબમિટ થઈ.",
    errors: {
      title: "કૃપા કરીને ટૂંકું શીર્ષક ઉમેરો.",
      reporter: "કૃપા કરીને તમારું નામ દાખલ કરો.",
      date: "કૃપા કરીને તારીખ પસંદ કરો.",
      time: "કૃપા કરીને સમય પસંદ કરો.",
      location: "કૃપા કરીને વિસ્તાર અથવા લેન્ડમાર્ક ઉમેરો.",
      address: "કૃપા કરીને સંપૂર્ણ સરનામું ઉમેરો.",
      description: "કૃપા કરીને થોડા વાક્યોમાં સમસ્યા વર્ણવો.",
    },
    groupPhotos: "ફોટો પુરાવો",
    groupWhat: "સમસ્યા શું છે?",
    groupWhere: "ક્યાં અને ક્યારે?",
    groupWho: "તમારા વિશે",
  },
  detail: {
    reportedBy: "જાણ કરી",
    date: "નોંધ તારીખ",
    location: "સ્થળ",
    address: "સંપૂર્ણ સરનામું",
    description: "વર્ણન",
    close: "બંધ કરો",
    open: "સંપૂર્ણ વિગત ખોલો",
    gallery: "ફોટો ગૅલેરી",
  },
  profile: {
    title: "તમારી પ્રોફાઇલ",
    editProfile: "પ્રોફાઇલ સંપાદિત કરો",
    saveChanges: "ફેરફારો સાચવો",
    saving: "સાચવી રહ્યા છીએ…",
    cancel: "રદ કરો",
    legalName: "કાનૂની નામ",
    mobile: "મોબાઇલ નંબર",
    email: "ઇમેઇલ સરનામું",
    complaintsRaised: "દાખલ ફરિયાદો",
    verified: "ચકાસાયેલ",
    notVerified: "ચકાસાયેલ નથી",
    signOut: "સાઇન આઉટ",
    editSuccess: "પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ.",
  },
  disclaimer: "નમૂના ડેટા સાથે પ્રોટોટાઇપ. સત્તાવાર સરકારી માહિતી નથી.",
};

const translations: Record<LanguageCode, TranslationDict> = {
  en,
  hi,
  mr,
  bn,
  ta,
  te,
  kn,
  gu,
};

export function getT(lang: LanguageCode): TranslationDict {
  return translations[lang] ?? en;
}

/** Backward-compat: English dict for non-reactive contexts (e.g. meta tags). */
export const t = en;
