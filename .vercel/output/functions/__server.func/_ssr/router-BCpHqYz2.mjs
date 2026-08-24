import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as useRouterState, c as Outlet, d as createRootRouteWithContext, f as Link, i as HeadContent, l as lazyRouteComponent, m as useRouter, p as useNavigate, r as Scripts, s as createRouter, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { a as getApp, o as getApps, s as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import "../_libs/firebase.mjs";
import { a as signInWithEmailAndPassword, c as updateProfile, i as onAuthStateChanged, n as createUserWithEmailAndPassword, o as signInWithPopup, r as getAuth, s as signOut, t as GoogleAuthProvider } from "../_libs/firebase__auth.mjs";
import { a as goOnline, c as push, d as remove, f as set, i as goOffline, l as query, n as get, o as onValue, p as update, r as getDatabase, s as orderByChild, t as equalTo, u as ref } from "../_libs/@firebase/database+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BCpHqYz2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-BQScyu86.css";
/**
* Multi-language copy dictionary for Bolo Civic Connect.
*
* getT(lang) returns the full translation dict for a given language.
* The default export `t` is English (for backward-compat with non-reactive
* contexts like meta tags). Reactive components should use useT() from
* language-context.tsx instead.
*/
var LANGUAGES = [
	{
		code: "en",
		label: "English",
		native: "English"
	},
	{
		code: "hi",
		label: "Hindi",
		native: "हिन्दी"
	},
	{
		code: "mr",
		label: "Marathi",
		native: "मराठी"
	},
	{
		code: "bn",
		label: "Bengali",
		native: "বাংলা"
	},
	{
		code: "ta",
		label: "Tamil",
		native: "தமிழ்"
	},
	{
		code: "te",
		label: "Telugu",
		native: "తెలుగు"
	},
	{
		code: "kn",
		label: "Kannada",
		native: "ಕನ್ನಡ"
	},
	{
		code: "gu",
		label: "Gujarati",
		native: "ગુજરાતી"
	}
];
var en = {
	brand: "Bolo",
	tagline: "Civic Connect",
	nav: {
		home: "Home",
		explore: "Explore Issues",
		raise: "Raise an Issue",
		profile: "Your profile",
		language: "Language"
	},
	status: {
		reported: "Problem Reported",
		progress: "Work in Progress",
		solved: "Problem Solved",
		legend: "Status legend"
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
		listCount: (n) => `${n} issues in view`,
		empty: "No issues match these filters yet.",
		reset: "Clear filters"
	},
	explore: {
		title: "Explore issues",
		subtitle: "A visual feed of what people are reporting across the country.",
		cta: "Explore",
		translate: "Auto-translate",
		translateNote: "Translation preview only — no text is actually translated yet."
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
			description: "Please describe the issue in a few sentences."
		},
		groupPhotos: "Photo evidence",
		groupWhat: "What is the issue?",
		groupWhere: "Where and when?",
		groupWho: "About you"
	},
	detail: {
		reportedBy: "Reported by",
		date: "Reported on",
		location: "Location",
		address: "Full address",
		description: "Description",
		close: "Close",
		open: "Open full details",
		gallery: "Photo gallery"
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
		editSuccess: "Profile updated successfully."
	},
	disclaimer: "Prototype with sample data. Not official government information."
};
var translations = {
	en,
	hi: {
		brand: "बोलो",
		tagline: "नागरिक कनेक्ट",
		nav: {
			home: "होम",
			explore: "शिकायतें देखें",
			raise: "शिकायत दर्ज करें",
			profile: "आपकी प्रोफ़ाइल",
			language: "भाषा"
		},
		status: {
			reported: "समस्या दर्ज",
			progress: "कार्य प्रगति पर",
			solved: "समस्या हल",
			legend: "स्थिति विवरण"
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
			listCount: (n) => `दृश्य में ${n} शिकायतें`,
			empty: "इन फ़िल्टर से कोई शिकायत नहीं मिली।",
			reset: "फ़िल्टर साफ़ करें"
		},
		explore: {
			title: "शिकायतें एक्सप्लोर करें",
			subtitle: "देश भर में लोग क्या रिपोर्ट कर रहे हैं।",
			cta: "एक्सप्लोर करें",
			translate: "स्वतः अनुवाद",
			translateNote: "केवल अनुवाद पूर्वावलोकन — अभी कोई वास्तविक अनुवाद नहीं हुआ।"
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
				description: "कृपया कुछ वाक्यों में समस्या बताएं।"
			},
			groupPhotos: "फ़ोटो साक्ष्य",
			groupWhat: "समस्या क्या है?",
			groupWhere: "कहाँ और कब?",
			groupWho: "आपके बारे में"
		},
		detail: {
			reportedBy: "रिपोर्ट किया",
			date: "दर्ज तारीख",
			location: "स्थान",
			address: "पूरा पता",
			description: "विवरण",
			close: "बंद करें",
			open: "पूरी जानकारी खोलें",
			gallery: "फ़ोटो गैलरी"
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
			editSuccess: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई।"
		},
		disclaimer: "नमूना डेटा के साथ प्रोटोटाइप। आधिकारिक सरकारी जानकारी नहीं।"
	},
	mr: {
		brand: "बोलो",
		tagline: "नागरिक कनेक्ट",
		nav: {
			home: "मुख्यपृष्ठ",
			explore: "तक्रारी पहा",
			raise: "तक्रार नोंदवा",
			profile: "तुमची प्रोफाइल",
			language: "भाषा"
		},
		status: {
			reported: "समस्या नोंदवली",
			progress: "काम सुरू आहे",
			solved: "समस्या सुटली",
			legend: "स्थिती माहिती"
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
			listCount: (n) => `दृश्यात ${n} तक्रारी`,
			empty: "या फिल्टरला कोणत्याही तक्रारी नाहीत।",
			reset: "फिल्टर साफ करा"
		},
		explore: {
			title: "तक्रारी एक्सप्लोर करा",
			subtitle: "देशभरात लोक काय तक्रार करत आहेत।",
			cta: "एक्सप्लोर करा",
			translate: "स्वयं-अनुवाद",
			translateNote: "केवळ अनुवाद पूर्वावलोकन।"
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
				description: "कृपया काही वाक्यांत समस्या सांगा।"
			},
			groupPhotos: "फोटो पुरावा",
			groupWhat: "समस्या काय आहे?",
			groupWhere: "कुठे आणि कधी?",
			groupWho: "तुमच्याबद्दल"
		},
		detail: {
			reportedBy: "नोंदवले",
			date: "नोंदणी तारीख",
			location: "स्थान",
			address: "पूर्ण पत्ता",
			description: "वर्णन",
			close: "बंद करा",
			open: "पूर्ण माहिती उघडा",
			gallery: "फोटो गॅलरी"
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
			editSuccess: "प्रोफाइल यशस्वीरित्या अपडेट झाली।"
		},
		disclaimer: "नमुना डेटासह प्रोटोटाइप. अधिकृत सरकारी माहिती नाही।"
	},
	bn: {
		brand: "বলো",
		tagline: "নাগরিক সংযোগ",
		nav: {
			home: "হোম",
			explore: "অভিযোগ দেখুন",
			raise: "অভিযোগ করুন",
			profile: "আপনার প্রোফাইল",
			language: "ভাষা"
		},
		status: {
			reported: "সমস্যা নথিভুক্ত",
			progress: "কাজ চলছে",
			solved: "সমস্যা সমাধান",
			legend: "অবস্থা বিবরণ"
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
			listCount: (n) => `দৃশ্যে ${n}টি অভিযোগ`,
			empty: "এই ফিল্টারে কোনো অভিযোগ পাওয়া যায়নি।",
			reset: "ফিল্টার পরিষ্কার করুন"
		},
		explore: {
			title: "অভিযোগ অন্বেষণ করুন",
			subtitle: "সারা দেশে মানুষ কী রিপোর্ট করছে।",
			cta: "অন্বেষণ করুন",
			translate: "স্বয়ংক্রিয় অনুবাদ",
			translateNote: "শুধুমাত্র অনুবাদ পূর্বরূপ।"
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
				description: "অনুগ্রহ করে কয়েকটি বাক্যে সমস্যা বর্ণনা করুন।"
			},
			groupPhotos: "ছবির প্রমাণ",
			groupWhat: "সমস্যাটি কী?",
			groupWhere: "কোথায় এবং কখন?",
			groupWho: "আপনার সম্পর্কে"
		},
		detail: {
			reportedBy: "রিপোর্ট করেছেন",
			date: "নথিভুক্তির তারিখ",
			location: "অবস্থান",
			address: "সম্পূর্ণ ঠিকানা",
			description: "বিবরণ",
			close: "বন্ধ করুন",
			open: "সম্পূর্ণ বিবরণ খুলুন",
			gallery: "ছবির গ্যালারি"
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
			editSuccess: "প্রোফাইল সফলভাবে আপডেট হয়েছে।"
		},
		disclaimer: "নমুনা ডেটা সহ প্রোটোটাইপ। সরকারি তথ্য নয়।"
	},
	ta: {
		brand: "போலோ",
		tagline: "குடிமக்கள் இணைப்பு",
		nav: {
			home: "முகப்பு",
			explore: "புகார்களை காண்க",
			raise: "புகார் அளிக்க",
			profile: "உங்கள் சுயவிவரம்",
			language: "மொழி"
		},
		status: {
			reported: "பிரச்சினை பதிவு செய்யப்பட்டது",
			progress: "பணி நடந்து கொண்டிருக்கிறது",
			solved: "பிரச்சினை தீர்க்கப்பட்டது",
			legend: "நிலை விளக்கம்"
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
			listCount: (n) => `காட்சியில் ${n} புகார்கள்`,
			empty: "இந்த வடிகட்டிகளில் புகார்கள் இல்லை।",
			reset: "வடிகட்டிகளை அழி"
		},
		explore: {
			title: "புகார்களை ஆய்வு செய்க",
			subtitle: "நாடு முழுவதும் மக்கள் என்ன புகாரளிக்கிறார்கள்.",
			cta: "ஆய்வு செய்க",
			translate: "தானியங்கு மொழிபெயர்ப்பு",
			translateNote: "மொழிபெயர்ப்பு முன்னோட்டம் மட்டுமே।"
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
				description: "சில வாக்கியங்களில் பிரச்சினையை விவரிக்கவும்।"
			},
			groupPhotos: "புகைப்பட சான்று",
			groupWhat: "பிரச்சினை என்ன?",
			groupWhere: "எங்கே மற்றும் எப்போது?",
			groupWho: "உங்களைப் பற்றி"
		},
		detail: {
			reportedBy: "புகாரளித்தவர்",
			date: "பதிவு செய்த தேதி",
			location: "இடம்",
			address: "முழு முகவரி",
			description: "விளக்கம்",
			close: "மூடு",
			open: "முழு விவரங்களை திறக்கவும்",
			gallery: "புகைப்பட தொகுப்பு"
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
			editSuccess: "சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது।"
		},
		disclaimer: "மாதிரி தரவுகளுடன் முன்மாதிரி. அரசு தகவல் அல்ல।"
	},
	te: {
		brand: "బోలో",
		tagline: "పౌర కనెక్ట్",
		nav: {
			home: "హోమ్",
			explore: "ఫిర్యాదులు చూడండి",
			raise: "ఫిర్యాదు చేయండి",
			profile: "మీ ప్రొఫైల్",
			language: "భాష"
		},
		status: {
			reported: "సమస్య నమోదు చేయబడింది",
			progress: "పని జరుగుతోంది",
			solved: "సమస్య పరిష్కరించబడింది",
			legend: "స్థితి వివరణ"
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
			listCount: (n) => `వీక్షణలో ${n} ఫిర్యాదులు`,
			empty: "ఈ ఫిల్టర్లకు ఫిర్యాదులు లేవు.",
			reset: "ఫిల్టర్లు క్లియర్ చేయండి"
		},
		explore: {
			title: "ఫిర్యాదులు అన్వేషించండి",
			subtitle: "దేశవ్యాప్తంగా ప్రజలు ఏమి నివేదిస్తున్నారో చూడండి.",
			cta: "అన్వేషించండి",
			translate: "స్వయంచాలక అనువాదం",
			translateNote: "అనువాద ప్రివ్యూ మాత్రమే."
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
				description: "దయచేసి కొన్ని వాక్యాల్లో సమస్యను వివరించండి."
			},
			groupPhotos: "ఫోటో ఆధారం",
			groupWhat: "సమస్య ఏమిటి?",
			groupWhere: "ఎక్కడ మరియు ఎప్పుడు?",
			groupWho: "మీ గురించి"
		},
		detail: {
			reportedBy: "నివేదించినది",
			date: "నివేదించిన తేదీ",
			location: "స్థానం",
			address: "పూర్తి చిరునామా",
			description: "వివరణ",
			close: "మూసివేయి",
			open: "పూర్తి వివరాలు తెరవండి",
			gallery: "ఫోటో గ్యాలరీ"
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
			editSuccess: "ప్రొఫైల్ విజయవంతంగా నవీకరించబడింది."
		},
		disclaimer: "నమూనా డేటాతో ప్రోటోటైప్. అధికారిక ప్రభుత్వ సమాచారం కాదు."
	},
	kn: {
		brand: "ಬೋಲೋ",
		tagline: "ನಾಗರಿಕ ಸಂಪರ್ಕ",
		nav: {
			home: "ಮನೆ",
			explore: "ದೂರುಗಳನ್ನು ಹುಡುಕಿ",
			raise: "ದೂರು ಸಲ್ಲಿಸಿ",
			profile: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್",
			language: "ಭಾಷೆ"
		},
		status: {
			reported: "ಸಮಸ್ಯೆ ದಾಖಲಾಗಿದೆ",
			progress: "ಕಾರ್ಯ ನಡೆಯುತ್ತಿದೆ",
			solved: "ಸಮಸ್ಯೆ ಪರಿಹಾರವಾಗಿದೆ",
			legend: "ಸ್ಥಿತಿ ವಿವರಣೆ"
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
			listCount: (n) => `ನೋಟದಲ್ಲಿ ${n} ದೂರುಗಳು`,
			empty: "ಈ ಫಿಲ್ಟರ್‌ಗಳಿಗೆ ದೂರುಗಳಿಲ್ಲ.",
			reset: "ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ"
		},
		explore: {
			title: "ದೂರುಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
			subtitle: "ದೇಶಾದ್ಯಂತ ಜನರು ಏನು ವರದಿ ಮಾಡುತ್ತಿದ್ದಾರೆ.",
			cta: "ಅನ್ವೇಷಿಸಿ",
			translate: "ಸ್ವಯಂ ಅನುವಾದ",
			translateNote: "ಅನುವಾದ ಪೂರ್ವವೀಕ್ಷಣೆ ಮಾತ್ರ."
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
				description: "ದಯವಿಟ್ಟು ಕೆಲವು ವಾಕ್ಯಗಳಲ್ಲಿ ಸಮಸ್ಯೆ ವಿವರಿಸಿ."
			},
			groupPhotos: "ಫೋಟೋ ಸಾಕ್ಷ್ಯ",
			groupWhat: "ಸಮಸ್ಯೆ ಏನು?",
			groupWhere: "ಎಲ್ಲಿ ಮತ್ತು ಯಾವಾಗ?",
			groupWho: "ನಿಮ್ಮ ಬಗ್ಗೆ"
		},
		detail: {
			reportedBy: "ವರದಿ ಮಾಡಿದವರು",
			date: "ದಾಖಲಾದ ದಿನಾಂಕ",
			location: "ಸ್ಥಳ",
			address: "ಪೂರ್ಣ ವಿಳಾಸ",
			description: "ವಿವರಣೆ",
			close: "ಮುಚ್ಚಿ",
			open: "ಪೂರ್ಣ ವಿವರಗಳನ್ನು ತೆರೆಯಿರಿ",
			gallery: "ಫೋಟೋ ಗ್ಯಾಲರಿ"
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
			editSuccess: "ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ."
		},
		disclaimer: "ಮಾದರಿ ಡೇಟಾದೊಂದಿಗೆ ಮೂಲರೂಪ. ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಮಾಹಿತಿ ಅಲ್ಲ."
	},
	gu: {
		brand: "બોલો",
		tagline: "નાગરિક કનેક્ટ",
		nav: {
			home: "હોમ",
			explore: "ફરિયાદો જુઓ",
			raise: "ફરિયાદ કરો",
			profile: "તમારી પ્રોફાઇલ",
			language: "ભાષા"
		},
		status: {
			reported: "સમસ્યા નોંધાઈ",
			progress: "કામ ચાલુ છે",
			solved: "સમસ્યા ઉકેલાઈ",
			legend: "સ્થિતિ વિવરણ"
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
			listCount: (n) => `દૃશ્યમાં ${n} ફરિયાદો`,
			empty: "આ ફિલ્ટર સાથે કોઈ ફરિયાદ ન મળી.",
			reset: "ફિલ્ટર સાફ કરો"
		},
		explore: {
			title: "ફરિયાદો એક્સ્પ્લોર કરો",
			subtitle: "દેશભરમાં લોકો શું જાણ કરે છે.",
			cta: "એક્સ્પ્લોર કરો",
			translate: "સ્વત: અનુવાદ",
			translateNote: "ફક્ત અનુવાદ પૂર્વાવલોકન."
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
				description: "કૃપા કરીને થોડા વાક્યોમાં સમસ્યા વર્ણવો."
			},
			groupPhotos: "ફોટો પુરાવો",
			groupWhat: "સમસ્યા શું છે?",
			groupWhere: "ક્યાં અને ક્યારે?",
			groupWho: "તમારા વિશે"
		},
		detail: {
			reportedBy: "જાણ કરી",
			date: "નોંધ તારીખ",
			location: "સ્થળ",
			address: "સંપૂર્ણ સરનામું",
			description: "વર્ણન",
			close: "બંધ કરો",
			open: "સંપૂર્ણ વિગત ખોલો",
			gallery: "ફોટો ગૅલેરી"
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
			editSuccess: "પ્રોફાઇલ સફળતાપૂર્વક અપડેટ થઈ."
		},
		disclaimer: "નમૂના ડેટા સાથે પ્રોટોટાઇપ. સત્તાવાર સરકારી માહિતી નથી."
	}
};
function getT(lang) {
	return translations[lang] ?? en;
}
/** Backward-compat: English dict for non-reactive contexts (e.g. meta tags). */
var t = en;
var LanguageContext = (0, import_react.createContext)({
	language: "en",
	setLanguage: () => {},
	t: getT("en")
});
function LanguageProvider({ children }) {
	const [language, setLanguage] = (0, import_react.useState)("en");
	const value = (0, import_react.useMemo)(() => ({
		language,
		setLanguage,
		t: getT(language)
	}), [language]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageContext.Provider, {
		value,
		children
	});
}
function useLanguage() {
	return (0, import_react.useContext)(LanguageContext);
}
/** Reactive translation hook — re-renders when language changes. */
function useT() {
	return (0, import_react.useContext)(LanguageContext).t;
}
var cachedUserLocation = null;
/**
* Silently auto-detect user's device location on site load (with 10-minute cache)
*/
function initAutoLocationDetection() {
	if (typeof window === "undefined" || !("geolocation" in navigator)) return;
	if (cachedUserLocation && Date.now() - cachedUserLocation.timestamp < 6e5) return;
	navigator.geolocation.getCurrentPosition((pos) => {
		const { latitude, longitude } = pos.coords;
		if (latitude >= 6 && latitude <= 37.5 && longitude >= 67 && longitude <= 98.5) cachedUserLocation = {
			latitude,
			longitude,
			timestamp: Date.now()
		};
	}, (err) => {
		console.debug("Silent geolocation detection skipped:", err.message);
	}, {
		enableHighAccuracy: false,
		timeout: 6e3,
		maximumAge: 3e5
	});
}
function getCachedUserLocation() {
	return cachedUserLocation;
}
var INDIAN_LOCALITIES = [
	{
		keywords: [
			"krishna nagar",
			"krishnanagar delhi",
			"east delhi",
			"laxmi nagar",
			"geeta colony",
			"shahdara",
			"anand vihar",
			"preet vihar",
			"karkardooma",
			"gandhi nagar delhi"
		],
		lat: 28.6606,
		lng: 77.2804,
		city: "Delhi",
		district: "East Delhi",
		state: "Delhi"
	},
	{
		keywords: [
			"dwarka",
			"dwarka sector",
			"uttam nagar",
			"palam",
			"janakpuri",
			"kakrola"
		],
		lat: 28.5921,
		lng: 77.0403,
		city: "New Delhi",
		district: "South West Delhi",
		state: "Delhi"
	},
	{
		keywords: [
			"rohini",
			"pitampura",
			"shalimar bagh",
			"prashant vihar",
			"rithala"
		],
		lat: 28.7159,
		lng: 77.1105,
		city: "Delhi",
		district: "North West Delhi",
		state: "Delhi"
	},
	{
		keywords: [
			"karol bagh",
			"rajendra nagar",
			"patel nagar",
			"shadipur",
			"jhandewalan"
		],
		lat: 28.6517,
		lng: 77.1906,
		city: "New Delhi",
		district: "Central Delhi",
		state: "Delhi"
	},
	{
		keywords: [
			"connaught place",
			"cp delhi",
			"rajiv chowk",
			"india gate",
			"barakhamba",
			"mandir marg"
		],
		lat: 28.6315,
		lng: 77.2167,
		city: "New Delhi",
		district: "New Delhi",
		state: "Delhi"
	},
	{
		keywords: [
			"lajpat nagar",
			"saket",
			"hauz khas",
			"malviya nagar",
			"south extension",
			"greater kailash",
			"gk 1",
			"gk 2",
			"green park",
			"nehru place",
			"kalkaji"
		],
		lat: 28.5677,
		lng: 77.2433,
		city: "New Delhi",
		district: "South Delhi",
		state: "Delhi"
	},
	{
		keywords: [
			"chandni chowk",
			"daryaganj",
			"kashmere gate",
			"red fort",
			"jama masjid delhi"
		],
		lat: 28.6562,
		lng: 77.2307,
		city: "Delhi",
		district: "North Delhi",
		state: "Delhi"
	},
	{
		keywords: [
			"noida",
			"sector 18 noida",
			"sector 62 noida",
			"greater noida",
			"noida extension"
		],
		lat: 28.5355,
		lng: 77.391,
		city: "Noida",
		district: "Gautam Buddha Nagar",
		state: "Uttar Pradesh"
	},
	{
		keywords: [
			"gurugram",
			"gurgaon",
			"cyber city",
			"dlf phase",
			"golf course road",
			"sohna road"
		],
		lat: 28.4595,
		lng: 77.0266,
		city: "Gurugram",
		district: "Gurugram",
		state: "Haryana"
	},
	{
		keywords: [
			"ghaziabad",
			"indirapuram",
			"vaishali ghaziabad",
			"vasundhara"
		],
		lat: 28.6692,
		lng: 77.4538,
		city: "Ghaziabad",
		district: "Ghaziabad",
		state: "Uttar Pradesh"
	},
	{
		keywords: [
			"delhi",
			"new delhi",
			"ncr"
		],
		lat: 28.6139,
		lng: 77.209,
		city: "New Delhi",
		district: "New Delhi",
		state: "Delhi"
	},
	{
		keywords: [
			"kothrud",
			"paud road",
			"shivaji chowk pune",
			"karve road",
			"chandani chowk",
			"vanaz"
		],
		lat: 18.5074,
		lng: 73.8077,
		city: "Pune",
		district: "Pune",
		state: "Maharashtra"
	},
	{
		keywords: [
			"kalyani nagar",
			"viman nagar",
			"kharadi",
			"koregaon park",
			"magarpatta",
			"hadapsar"
		],
		lat: 18.5489,
		lng: 73.9033,
		city: "Pune",
		district: "Pune",
		state: "Maharashtra"
	},
	{
		keywords: [
			"sinhagad road",
			"vadgaon budruk",
			"dhayari",
			"warje",
			"katraj",
			"dhankawadi",
			"ambegaon"
		],
		lat: 18.4636,
		lng: 73.8218,
		city: "Pune",
		district: "Pune",
		state: "Maharashtra"
	},
	{
		keywords: [
			"baner",
			"balewadi",
			"hinjawadi",
			"hinjewadi",
			"wakad",
			"aundh",
			"pashan",
			"bavdhan"
		],
		lat: 18.559,
		lng: 73.7868,
		city: "Pune",
		district: "Pune",
		state: "Maharashtra"
	},
	{
		keywords: [
			"shivajinagar",
			"deccan gymkhana",
			"fc road",
			"jm road",
			"camp pune",
			"swargate"
		],
		lat: 18.5314,
		lng: 73.8446,
		city: "Pune",
		district: "Pune",
		state: "Maharashtra"
	},
	{
		keywords: [
			"pune",
			"pcmc",
			"pimpri",
			"chinchwad",
			"nigdi",
			"bhosari"
		],
		lat: 18.5204,
		lng: 73.8567,
		city: "Pune",
		district: "Pune",
		state: "Maharashtra"
	},
	{
		keywords: [
			"andheri",
			"andheri east",
			"andheri west",
			"juhu",
			"lokhandwala",
			"versova"
		],
		lat: 19.1136,
		lng: 72.8697,
		city: "Mumbai",
		district: "Mumbai Suburban",
		state: "Maharashtra"
	},
	{
		keywords: [
			"bandra",
			"bandra west",
			"bandra east",
			"bkc",
			"bandra kurla complex",
			"khar",
			"santacruz"
		],
		lat: 19.0596,
		lng: 72.8295,
		city: "Mumbai",
		district: "Mumbai Suburban",
		state: "Maharashtra"
	},
	{
		keywords: [
			"borivali",
			"kandivali",
			"malad",
			"goregaon",
			"dahisar"
		],
		lat: 19.2288,
		lng: 72.8541,
		city: "Mumbai",
		district: "Mumbai Suburban",
		state: "Maharashtra"
	},
	{
		keywords: [
			"dadar",
			"parel",
			"worli",
			"lower parel",
			"matunga",
			"mahim"
		],
		lat: 19.0178,
		lng: 72.8478,
		city: "Mumbai",
		district: "Mumbai City",
		state: "Maharashtra"
	},
	{
		keywords: [
			"colaba",
			"marine lines",
			"churchgate",
			"nariman point",
			"fort mumbai",
			"cst",
			"marine drive"
		],
		lat: 18.922,
		lng: 72.8347,
		city: "Mumbai",
		district: "Mumbai City",
		state: "Maharashtra"
	},
	{
		keywords: [
			"thane",
			"ghodbunder",
			"majiwada",
			"naupada",
			"vartak nagar"
		],
		lat: 19.2183,
		lng: 72.9781,
		city: "Thane",
		district: "Thane",
		state: "Maharashtra"
	},
	{
		keywords: [
			"navi mumbai",
			"vashi",
			"nerul",
			"kharghar",
			"belapur",
			"panvel",
			"airoli"
		],
		lat: 19.033,
		lng: 73.0297,
		city: "Navi Mumbai",
		district: "Thane",
		state: "Maharashtra"
	},
	{
		keywords: ["mumbai", "bombay"],
		lat: 19.076,
		lng: 72.8777,
		city: "Mumbai",
		district: "Mumbai City",
		state: "Maharashtra"
	},
	{
		keywords: [
			"nagpur",
			"sitabuldi",
			"dharampeth"
		],
		lat: 21.1458,
		lng: 79.0882,
		city: "Nagpur",
		district: "Nagpur",
		state: "Maharashtra"
	},
	{
		keywords: [
			"nashik",
			"panchavati",
			"cidco nashik"
		],
		lat: 19.9975,
		lng: 73.7898,
		city: "Nashik",
		district: "Nashik",
		state: "Maharashtra"
	},
	{
		keywords: ["aurangabad", "chhatrapati sambhajinagar"],
		lat: 19.8762,
		lng: 75.3433,
		city: "Chhatrapati Sambhajinagar",
		district: "Aurangabad",
		state: "Maharashtra"
	},
	{
		keywords: [
			"jayanagar",
			"jp nagar",
			"banashankari",
			"bsk",
			"padmanabhanagar"
		],
		lat: 12.9299,
		lng: 77.5826,
		city: "Bengaluru",
		district: "Bengaluru Urban",
		state: "Karnataka"
	},
	{
		keywords: [
			"indiranagar",
			"koramangala",
			"domlur",
			"hal",
			"old airport road"
		],
		lat: 12.9784,
		lng: 77.6408,
		city: "Bengaluru",
		district: "Bengaluru Urban",
		state: "Karnataka"
	},
	{
		keywords: [
			"whitefield",
			"marathahalli",
			"mahadevapura",
			"kadugodi",
			"itpl",
			"hoodi"
		],
		lat: 12.9698,
		lng: 77.75,
		city: "Bengaluru",
		district: "Bengaluru Urban",
		state: "Karnataka"
	},
	{
		keywords: [
			"electronic city",
			"harlur",
			"sarjapur",
			"bellandur",
			"hsa layout",
			"hsr"
		],
		lat: 12.8452,
		lng: 77.6602,
		city: "Bengaluru",
		district: "Bengaluru Urban",
		state: "Karnataka"
	},
	{
		keywords: [
			"malleshwaram",
			"rajajinagar",
			"yeshwanthpur",
			"hebbal",
			"yelahanka"
		],
		lat: 13.0031,
		lng: 77.5643,
		city: "Bengaluru",
		district: "Bengaluru Urban",
		state: "Karnataka"
	},
	{
		keywords: [
			"bengaluru",
			"bangalore",
			"bangaluru"
		],
		lat: 12.9716,
		lng: 77.5946,
		city: "Bengaluru",
		district: "Bengaluru Urban",
		state: "Karnataka"
	},
	{
		keywords: ["mysuru", "mysore"],
		lat: 12.2958,
		lng: 76.6394,
		city: "Mysuru",
		district: "Mysuru",
		state: "Karnataka"
	},
	{
		keywords: ["kolar", "kolar town"],
		lat: 13.1357,
		lng: 78.129,
		city: "Kolar",
		district: "Kolar",
		state: "Karnataka"
	},
	{
		keywords: [
			"hubballi",
			"hubli",
			"dharwad"
		],
		lat: 15.3647,
		lng: 75.124,
		city: "Hubballi",
		district: "Dharwad",
		state: "Karnataka"
	},
	{
		keywords: ["mangalore", "mangaluru"],
		lat: 12.9141,
		lng: 74.856,
		city: "Mangaluru",
		district: "Dakshina Kannada",
		state: "Karnataka"
	},
	{
		keywords: [
			"anna salai",
			"teynampet",
			"alwarpet",
			"mylapore",
			"t nagar",
			"mandaveli",
			"royapettah"
		],
		lat: 13.0389,
		lng: 80.2489,
		city: "Chennai",
		district: "Chennai",
		state: "Tamil Nadu"
	},
	{
		keywords: [
			"adyar",
			"besant nagar",
			"thiruvanmiyur",
			"velachery",
			"omr",
			"sholinganallur",
			"guindy"
		],
		lat: 13.0012,
		lng: 80.2565,
		city: "Chennai",
		district: "Chennai",
		state: "Tamil Nadu"
	},
	{
		keywords: [
			"anna nagar",
			"kilpauk",
			"chetpet",
			"egmore",
			"purasaiwakkam"
		],
		lat: 13.085,
		lng: 80.2101,
		city: "Chennai",
		district: "Chennai",
		state: "Tamil Nadu"
	},
	{
		keywords: ["chennai", "madras"],
		lat: 13.0827,
		lng: 80.2707,
		city: "Chennai",
		district: "Chennai",
		state: "Tamil Nadu"
	},
	{
		keywords: [
			"coimbatore",
			"rs puram",
			"peelamedu",
			"gandhipuram"
		],
		lat: 11.0168,
		lng: 76.9558,
		city: "Coimbatore",
		district: "Coimbatore",
		state: "Tamil Nadu"
	},
	{
		keywords: ["madurai"],
		lat: 9.9252,
		lng: 78.1198,
		city: "Madurai",
		district: "Madurai",
		state: "Tamil Nadu"
	},
	{
		keywords: ["tiruchirappalli", "trichy"],
		lat: 10.7905,
		lng: 78.7047,
		city: "Tiruchirappalli",
		district: "Tiruchirappalli",
		state: "Tamil Nadu"
	},
	{
		keywords: ["salem"],
		lat: 11.6643,
		lng: 78.146,
		city: "Salem",
		district: "Salem",
		state: "Tamil Nadu"
	},
	{
		keywords: [
			"salt lake",
			"bidhannagar",
			"sector 5 kolkata",
			"sector v",
			"college more",
			"new town kolkata",
			"rajarhat"
		],
		lat: 22.5776,
		lng: 88.4318,
		city: "Kolkata",
		district: "North 24 Parganas",
		state: "West Bengal"
	},
	{
		keywords: [
			"park street",
			"camac street",
			"esplanade",
			"bhowanipore",
			"gariahat",
			"ballygunge",
			"alipore"
		],
		lat: 22.551,
		lng: 88.3524,
		city: "Kolkata",
		district: "Kolkata",
		state: "West Bengal"
	},
	{
		keywords: [
			"howrah",
			"howrah station",
			"shibpur",
			"santragachi"
		],
		lat: 22.5958,
		lng: 88.2636,
		city: "Howrah",
		district: "Howrah",
		state: "West Bengal"
	},
	{
		keywords: ["kolkata", "calcutta"],
		lat: 22.5726,
		lng: 88.3639,
		city: "Kolkata",
		district: "Kolkata",
		state: "West Bengal"
	},
	{
		keywords: ["siliguri"],
		lat: 26.7271,
		lng: 88.3953,
		city: "Siliguri",
		district: "Darjeeling",
		state: "West Bengal"
	},
	{
		keywords: ["asansol"],
		lat: 23.6739,
		lng: 86.9524,
		city: "Asansol",
		district: "Paschim Bardhaman",
		state: "West Bengal"
	},
	{
		keywords: [
			"amer",
			"amer road",
			"kesar kyari",
			"jal mahal",
			"hawa mahal",
			"pink city"
		],
		lat: 26.9855,
		lng: 75.8513,
		city: "Jaipur",
		district: "Jaipur",
		state: "Rajasthan"
	},
	{
		keywords: [
			"vaishali nagar jaipur",
			"c scheme",
			"malviya nagar jaipur",
			"raja park",
			"mansarovar",
			"tonk road"
		],
		lat: 26.9124,
		lng: 75.7373,
		city: "Jaipur",
		district: "Jaipur",
		state: "Rajasthan"
	},
	{
		keywords: ["jaipur"],
		lat: 26.9124,
		lng: 75.7873,
		city: "Jaipur",
		district: "Jaipur",
		state: "Rajasthan"
	},
	{
		keywords: ["jodhpur"],
		lat: 26.2389,
		lng: 73.0243,
		city: "Jodhpur",
		district: "Jodhpur",
		state: "Rajasthan"
	},
	{
		keywords: ["udaipur"],
		lat: 24.5854,
		lng: 73.7125,
		city: "Udaipur",
		district: "Udaipur",
		state: "Rajasthan"
	},
	{
		keywords: ["kota"],
		lat: 25.2138,
		lng: 75.8648,
		city: "Kota",
		district: "Kota",
		state: "Rajasthan"
	},
	{
		keywords: [
			"maninagar",
			"krishnanagar ahmedabad",
			"paldi",
			"navrangpura",
			"satellite",
			"bodakdev",
			"sg highway",
			"vastrapur",
			"prahlad nagar",
			"bopal"
		],
		lat: 22.9963,
		lng: 72.6009,
		city: "Ahmedabad",
		district: "Ahmedabad",
		state: "Gujarat"
	},
	{
		keywords: [
			"ahmedabad",
			"amdavad",
			"gandhinagar"
		],
		lat: 23.0225,
		lng: 72.5714,
		city: "Ahmedabad",
		district: "Ahmedabad",
		state: "Gujarat"
	},
	{
		keywords: [
			"surat",
			"varachha",
			"adajan",
			"vesu"
		],
		lat: 21.1702,
		lng: 72.8311,
		city: "Surat",
		district: "Surat",
		state: "Gujarat"
	},
	{
		keywords: [
			"vadodara",
			"baroda",
			"alkapuri"
		],
		lat: 22.3072,
		lng: 73.1812,
		city: "Vadodara",
		district: "Vadodara",
		state: "Gujarat"
	},
	{
		keywords: ["rajkot"],
		lat: 22.3039,
		lng: 70.8022,
		city: "Rajkot",
		district: "Rajkot",
		state: "Gujarat"
	},
	{
		keywords: [
			"alambagh",
			"hazratganj",
			"gomti nagar",
			"indira nagar",
			"aliganj",
			"chowk lucknow",
			"aminabad",
			"mahanagar"
		],
		lat: 26.8083,
		lng: 80.8896,
		city: "Lucknow",
		district: "Lucknow",
		state: "Uttar Pradesh"
	},
	{
		keywords: ["lucknow"],
		lat: 26.8467,
		lng: 80.9462,
		city: "Lucknow",
		district: "Lucknow",
		state: "Uttar Pradesh"
	},
	{
		keywords: [
			"kanpur",
			"swaroop nagar",
			"kakadeo"
		],
		lat: 26.4499,
		lng: 80.3319,
		city: "Kanpur",
		district: "Kanpur Nagar",
		state: "Uttar Pradesh"
	},
	{
		keywords: [
			"varanasi",
			"kashi",
			"banaras",
			"assighat",
			"dashashwamedh"
		],
		lat: 25.3176,
		lng: 82.9739,
		city: "Varanasi",
		district: "Varanasi",
		state: "Uttar Pradesh"
	},
	{
		keywords: ["agra", "taj ganj"],
		lat: 27.1767,
		lng: 78.0081,
		city: "Agra",
		district: "Agra",
		state: "Uttar Pradesh"
	},
	{
		keywords: [
			"prayagraj",
			"allahabad",
			"civil lines prayagraj"
		],
		lat: 25.4358,
		lng: 81.8463,
		city: "Prayagraj",
		district: "Prayagraj",
		state: "Uttar Pradesh"
	},
	{
		keywords: ["meerut"],
		lat: 28.9845,
		lng: 77.7064,
		city: "Meerut",
		district: "Meerut",
		state: "Uttar Pradesh"
	},
	{
		keywords: [
			"hitec city",
			"madhapur",
			"gachibowli",
			"jubilee hills",
			"banjara hills",
			"kondapur",
			"kukatpally",
			"secunderabad",
			"begumpet",
			"charminar"
		],
		lat: 17.4435,
		lng: 78.3772,
		city: "Hyderabad",
		district: "Hyderabad",
		state: "Telangana"
	},
	{
		keywords: ["hyderabad"],
		lat: 17.385,
		lng: 78.4867,
		city: "Hyderabad",
		district: "Hyderabad",
		state: "Telangana"
	},
	{
		keywords: ["visakhapatnam", "vizag"],
		lat: 17.6868,
		lng: 83.2185,
		city: "Visakhapatnam",
		district: "Visakhapatnam",
		state: "Andhra Pradesh"
	},
	{
		keywords: ["vijayawada"],
		lat: 16.5062,
		lng: 80.648,
		city: "Vijayawada",
		district: "NTR",
		state: "Andhra Pradesh"
	},
	{
		keywords: [
			"kochi",
			"cochin",
			"ernakulam",
			"kakkanad"
		],
		lat: 9.9312,
		lng: 76.2673,
		city: "Kochi",
		district: "Ernakulam",
		state: "Kerala"
	},
	{
		keywords: ["thiruvananthapuram", "trivandrum"],
		lat: 8.5241,
		lng: 76.9366,
		city: "Thiruvananthapuram",
		district: "Thiruvananthapuram",
		state: "Kerala"
	},
	{
		keywords: [
			"chandigarh",
			"mohali",
			"panchkula"
		],
		lat: 30.7333,
		lng: 76.7794,
		city: "Chandigarh",
		district: "Chandigarh",
		state: "Chandigarh"
	},
	{
		keywords: ["ludhiana"],
		lat: 30.901,
		lng: 75.8573,
		city: "Ludhiana",
		district: "Ludhiana",
		state: "Punjab"
	},
	{
		keywords: ["amritsar", "golden temple"],
		lat: 31.634,
		lng: 74.8723,
		city: "Amritsar",
		district: "Amritsar",
		state: "Punjab"
	},
	{
		keywords: [
			"indore",
			"vijay nagar indore",
			"chappan dukan"
		],
		lat: 22.7196,
		lng: 75.8577,
		city: "Indore",
		district: "Indore",
		state: "Madhya Pradesh"
	},
	{
		keywords: ["bhopal", "mp nagar"],
		lat: 23.2599,
		lng: 77.4126,
		city: "Bhopal",
		district: "Bhopal",
		state: "Madhya Pradesh"
	},
	{
		keywords: [
			"patna",
			"kankarbagh",
			"boring road"
		],
		lat: 25.5941,
		lng: 85.1376,
		city: "Patna",
		district: "Patna",
		state: "Bihar"
	}
];
/**
* Calculates distance in kilometres between two coordinates using Haversine formula
*/
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
	const R = 6371;
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}
/**
* Fast sub-millisecond Resolver: Compares typed location string with dictionary
* and user's auto-detected GPS to resolve exact coordinates, city, district & state.
*/
function resolveLocationCoordinates(locationInput, addressInput = "", manualCoords = null) {
	const combined = `${locationInput} ${addressInput}`.toLowerCase();
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
			source: "exact_match"
		};
	}
	let bestMatch = null;
	let bestScore = 0;
	for (const item of INDIAN_LOCALITIES) for (const kw of item.keywords) if (combined.includes(kw)) {
		const score = kw.length;
		if (score > bestScore) {
			bestScore = score;
			bestMatch = item;
		}
	}
	if (bestMatch) {
		if (cachedUserLocation) {
			if (calculateDistanceKm(cachedUserLocation.latitude, cachedUserLocation.longitude, bestMatch.lat, bestMatch.lng) <= 40) return {
				latitude: cachedUserLocation.latitude,
				longitude: cachedUserLocation.longitude,
				city: bestMatch.city,
				district: bestMatch.district,
				state: bestMatch.state,
				source: "nearby_gps"
			};
		}
		const jitterLat = (Math.random() - .5) * .003;
		const jitterLng = (Math.random() - .5) * .003;
		return {
			latitude: Number((bestMatch.lat + jitterLat).toFixed(5)),
			longitude: Number((bestMatch.lng + jitterLng).toFixed(5)),
			city: bestMatch.city,
			district: bestMatch.district,
			state: bestMatch.state,
			source: "exact_match"
		};
	}
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
			source: "nearby_gps"
		};
	}
	const locParts = locationInput.split(",").map((s) => s.trim()).filter(Boolean);
	const guessedCity = locParts[locParts.length - 1] || "City";
	const guessedDistrict = locParts[Math.max(0, locParts.length - 2)] || guessedCity;
	return {
		latitude: 28.6139 + (Math.random() - .5) * .05,
		longitude: 77.209 + (Math.random() - .5) * .05,
		city: guessedCity,
		district: guessedDistrict,
		state: "Delhi",
		source: "fallback"
	};
}
var firebaseConfig = {
	apiKey: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_FIREBASE_API_KEY": "AIzaSyCvxZOCzHIzVOpDYfffxnKUJmyZbdO6o-0",
		"VITE_FIREBASE_APP_ID": "1:68250444341:web:130a5209df8d13b92c877c",
		"VITE_FIREBASE_AUTH_DOMAIN": "bolo-civic-connect.firebaseapp.com",
		"VITE_FIREBASE_DATABASE_URL": "https://bolo-civic-connect-default-rtdb.asia-southeast1.firebasedatabase.app",
		"VITE_FIREBASE_PROJECT_ID": "bolo-civic-connect",
		"VITE_FIREBASE_STORAGE_BUCKET": "bolo-civic-connect.firebasestorage.app"
	}["VITE_FIREBASE_API_KEY"] || "AIzaSyBoloCivicConnectDemoKeyDummy123",
	authDomain: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_FIREBASE_API_KEY": "AIzaSyCvxZOCzHIzVOpDYfffxnKUJmyZbdO6o-0",
		"VITE_FIREBASE_APP_ID": "1:68250444341:web:130a5209df8d13b92c877c",
		"VITE_FIREBASE_AUTH_DOMAIN": "bolo-civic-connect.firebaseapp.com",
		"VITE_FIREBASE_DATABASE_URL": "https://bolo-civic-connect-default-rtdb.asia-southeast1.firebasedatabase.app",
		"VITE_FIREBASE_PROJECT_ID": "bolo-civic-connect",
		"VITE_FIREBASE_STORAGE_BUCKET": "bolo-civic-connect.firebasestorage.app"
	}["VITE_FIREBASE_AUTH_DOMAIN"] || "bolo-civic-connect.firebaseapp.com",
	databaseURL: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_FIREBASE_API_KEY": "AIzaSyCvxZOCzHIzVOpDYfffxnKUJmyZbdO6o-0",
		"VITE_FIREBASE_APP_ID": "1:68250444341:web:130a5209df8d13b92c877c",
		"VITE_FIREBASE_AUTH_DOMAIN": "bolo-civic-connect.firebaseapp.com",
		"VITE_FIREBASE_DATABASE_URL": "https://bolo-civic-connect-default-rtdb.asia-southeast1.firebasedatabase.app",
		"VITE_FIREBASE_PROJECT_ID": "bolo-civic-connect",
		"VITE_FIREBASE_STORAGE_BUCKET": "bolo-civic-connect.firebasestorage.app"
	}["VITE_FIREBASE_DATABASE_URL"] || "https://bolo-civic-connect-default-rtdb.firebaseio.com",
	projectId: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_FIREBASE_API_KEY": "AIzaSyCvxZOCzHIzVOpDYfffxnKUJmyZbdO6o-0",
		"VITE_FIREBASE_APP_ID": "1:68250444341:web:130a5209df8d13b92c877c",
		"VITE_FIREBASE_AUTH_DOMAIN": "bolo-civic-connect.firebaseapp.com",
		"VITE_FIREBASE_DATABASE_URL": "https://bolo-civic-connect-default-rtdb.asia-southeast1.firebasedatabase.app",
		"VITE_FIREBASE_PROJECT_ID": "bolo-civic-connect",
		"VITE_FIREBASE_STORAGE_BUCKET": "bolo-civic-connect.firebasestorage.app"
	}["VITE_FIREBASE_PROJECT_ID"] || "bolo-civic-connect",
	storageBucket: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_FIREBASE_API_KEY": "AIzaSyCvxZOCzHIzVOpDYfffxnKUJmyZbdO6o-0",
		"VITE_FIREBASE_APP_ID": "1:68250444341:web:130a5209df8d13b92c877c",
		"VITE_FIREBASE_AUTH_DOMAIN": "bolo-civic-connect.firebaseapp.com",
		"VITE_FIREBASE_DATABASE_URL": "https://bolo-civic-connect-default-rtdb.asia-southeast1.firebasedatabase.app",
		"VITE_FIREBASE_PROJECT_ID": "bolo-civic-connect",
		"VITE_FIREBASE_STORAGE_BUCKET": "bolo-civic-connect.firebasestorage.app"
	}["VITE_FIREBASE_STORAGE_BUCKET"] || "bolo-civic-connect.appspot.com",
	appId: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_FIREBASE_API_KEY": "AIzaSyCvxZOCzHIzVOpDYfffxnKUJmyZbdO6o-0",
		"VITE_FIREBASE_APP_ID": "1:68250444341:web:130a5209df8d13b92c877c",
		"VITE_FIREBASE_AUTH_DOMAIN": "bolo-civic-connect.firebaseapp.com",
		"VITE_FIREBASE_DATABASE_URL": "https://bolo-civic-connect-default-rtdb.asia-southeast1.firebasedatabase.app",
		"VITE_FIREBASE_PROJECT_ID": "bolo-civic-connect",
		"VITE_FIREBASE_STORAGE_BUCKET": "bolo-civic-connect.firebasestorage.app"
	}["VITE_FIREBASE_APP_ID"] || "1:1234567890:web:abcdef123456"
};
var app = getApps().length ? getApp() : initializeApp(firebaseConfig);
var auth = getAuth(app);
var db = getDatabase(app);
if (typeof window !== "undefined" && typeof document !== "undefined") {
	let idleTimer = null;
	const IDLE_TIMEOUT_MS = 18e4;
	const handleActive = () => {
		try {
			goOnline(db);
		} catch {}
		if (idleTimer) clearTimeout(idleTimer);
		idleTimer = setTimeout(() => {
			if (document.visibilityState === "hidden") try {
				goOffline(db);
			} catch {}
		}, IDLE_TIMEOUT_MS);
	};
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") try {
			goOffline(db);
		} catch {}
		else handleActive();
	});
	window.addEventListener("focus", handleActive);
	window.addEventListener("mousemove", handleActive, { passive: true });
	window.addEventListener("keydown", handleActive, { passive: true });
	window.addEventListener("touchstart", handleActive, { passive: true });
}
function subscribeToIssues(callback) {
	callback([]);
	const issuesRef = ref(db, "issues");
	return onValue(issuesRef, (snapshot) => {
		if (snapshot.exists()) {
			const val = snapshot.val();
			const list = Object.values(val);
			list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
			callback(list);
		} else callback([]);
	}, (error) => {
		console.warn("Firebase Realtime Database read notice:", error);
		callback([]);
	});
}
function message(error) {
	if (!(error instanceof Error)) return "Something went wrong. Please try again.";
	if (error.message.includes("auth/quota-exceeded")) return "Monthly service quota reached (Spark tier limit: 50,000 active users). Please try again later.";
	if (error.message.includes("auth/too-many-requests")) return "Too many requests. Please wait a moment before trying again.";
	if (error.message.includes("auth/email-already-in-use")) return "This email is already registered. Try signing in.";
	if (error.message.includes("auth/invalid-credential") || error.message.includes("auth/user-not-found") || error.message.includes("auth/wrong-password")) return "Email or password is incorrect.";
	if (error.message.includes("auth/weak-password")) return "Choose a password with at least 6 characters.";
	if (error.message.includes("auth/invalid-verification-code")) return "Invalid OTP code. Please check and try again.";
	if (error.message.includes("max-connections") || error.message.includes("connection-limit")) return "Server is experiencing high traffic (maximum 100 simultaneous users reached). Retrying...";
	return error.message.replace("Firebase: ", "");
}
async function createBoloAccount(input) {
	const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);
	await updateProfile(credential.user, { displayName: input.displayName });
	try {
		await set(ref(db, `users/${credential.user.uid}`), {
			uid: credential.user.uid,
			displayName: input.displayName,
			phone: input.phone,
			email: input.email,
			role: "citizen",
			verified: true,
			createdAt: Date.now()
		});
	} catch (dbErr) {
		console.warn("Could not save user profile to Realtime Database:", dbErr);
	}
	return toBoloUser(credential.user);
}
async function signInToBolo(email, password) {
	return toBoloUser((await signInWithEmailAndPassword(auth, email, password)).user);
}
async function signInWithGoogle() {
	const provider = new GoogleAuthProvider();
	const credential = await signInWithPopup(auth, provider);
	try {
		const userRef = ref(db, `users/${credential.user.uid}`);
		const snap = await get(userRef);
		if (snap.exists()) {
			const existingData = snap.val();
			if (existingData.displayName && existingData.displayName !== credential.user.displayName) await updateProfile(credential.user, { displayName: existingData.displayName });
			await update(userRef, {
				verified: existingData.verified ?? true,
				email: existingData.email || credential.user.email
			});
		} else {
			let existingByEmail = null;
			if (credential.user.email) try {
				const userQuery = query(ref(db, "users"), orderByChild("email"), equalTo(credential.user.email));
				const emailSnap = await get(userQuery);
				if (emailSnap.exists()) {
					const list = Object.values(emailSnap.val());
					if (list.length > 0 && list[0]) existingByEmail = list[0];
				}
			} catch (e) {
				console.warn("Could not check existing user by email:", e);
			}
			const finalDisplayName = existingByEmail?.displayName || credential.user.displayName || "Bolo citizen";
			if (existingByEmail?.displayName && credential.user) await updateProfile(credential.user, { displayName: existingByEmail.displayName });
			await set(userRef, {
				uid: credential.user.uid,
				displayName: finalDisplayName,
				legalName: existingByEmail?.legalName || "",
				email: credential.user.email,
				phone: existingByEmail?.phone || credential.user.phoneNumber || "",
				role: existingByEmail?.role || "citizen",
				verified: true,
				createdAt: existingByEmail?.createdAt || Date.now()
			});
		}
	} catch (dbErr) {
		console.warn("Could not save Google user profile to Realtime Database:", dbErr);
	}
	return toBoloUser(credential.user);
}
async function signOutOfBolo() {
	await signOut(auth);
}
function observeBoloAuth(callback) {
	return onAuthStateChanged(auth, (user) => callback(user ? toBoloUser(user) : null));
}
async function compressImageToBase64(file, maxWidth = 800, quality = .7) {
	return new Promise((resolve) => {
		const img = new Image();
		const url = URL.createObjectURL(file);
		img.onload = () => {
			URL.revokeObjectURL(url);
			const canvas = document.createElement("canvas");
			let { width, height } = img;
			if (width > maxWidth) {
				height = Math.round(height * maxWidth / width);
				width = maxWidth;
			}
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL("image/jpeg", quality));
			} else {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result);
				reader.readAsDataURL(file);
			}
		};
		img.onerror = () => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(file);
		};
		img.src = url;
	});
}
async function submitIssue(user, issue) {
	const issueId = push(ref(db, "issues")).key || `BLO-${Date.now()}`;
	const imageUrls = [];
	for (const file of issue.images) {
		if (!file) continue;
		try {
			const base64Str = await compressImageToBase64(file);
			imageUrls.push(base64Str);
		} catch (err) {
			console.warn("Error compressing image to base64:", err);
		}
	}
	if (imageUrls.length === 0) imageUrls.push("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22450%22%20viewBox%3D%220%200%20600%20450%22%3E%3Crect%20width%3D%22600%22%20height%3D%22450%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20fill%3D%22%239ca3af%22%3ENo%20Image%20Uploaded%3C%2Ftext%3E%3C%2Fsvg%3E");
	const manualCoords = issue.latitude && issue.longitude ? {
		latitude: issue.latitude,
		longitude: issue.longitude
	} : null;
	const resolved = resolveLocationCoordinates(issue.location, issue.address, manualCoords);
	const dateParts = issue.occurredAt ? issue.occurredAt.split("T") : [];
	const dateStr = (dateParts.length > 0 && dateParts[0] ? dateParts[0] : "") || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const fullIssueData = {
		id: issueId,
		title: issue.title.trim(),
		description: issue.description.trim(),
		reporter: issue.reporter.trim() || user.displayName,
		reporterUid: user.uid,
		userId: user.uid,
		reporterEmail: user.email ?? null,
		reporterPhone: user.phone ?? null,
		createdAt: Date.now(),
		date: dateStr,
		status: "reported",
		category: "Civic Issue",
		location: issue.location.trim(),
		address: issue.address.trim(),
		images: imageUrls,
		state: resolved.state,
		district: resolved.district,
		city: resolved.city,
		lat: resolved.latitude,
		lng: resolved.longitude
	};
	try {
		await set(ref(db, `issues/${issueId}`), fullIssueData);
	} catch (err) {
		console.warn("Error setting issue in Realtime Database:", err);
	}
	return issueId;
}
async function updateIssue(issueId, updates) {
	const issueRef = ref(db, `issues/${issueId}`);
	const snap = await get(issueRef);
	if (!snap.exists()) throw new Error("Issue not found in database.");
	const existing = snap.val();
	let finalImages = updates.images ?? existing.images;
	if (updates.newImages && updates.newImages.length > 0) {
		const newBase64s = [];
		for (const file of updates.newImages) try {
			const b64 = await compressImageToBase64(file);
			newBase64s.push(b64);
		} catch (e) {
			console.warn("Error compressing image:", e);
		}
		if (newBase64s.length > 0) finalImages = [...finalImages, ...newBase64s].slice(0, 5);
	}
	let resolvedLat = updates.lat ?? existing.lat;
	let resolvedLng = updates.lng ?? existing.lng;
	let resolvedState = updates.state ?? existing.state;
	let resolvedDistrict = updates.district ?? existing.district;
	let resolvedCity = updates.city ?? existing.city;
	if (updates.location && updates.location !== existing.location || updates.address && updates.address !== existing.address) {
		const resolved = resolveLocationCoordinates(updates.location ?? existing.location, updates.address ?? existing.address, null);
		resolvedLat = resolved.latitude;
		resolvedLng = resolved.longitude;
		resolvedState = resolved.state;
		resolvedDistrict = resolved.district;
		resolvedCity = resolved.city;
	}
	const payload = {
		...updates,
		images: finalImages,
		lat: resolvedLat,
		lng: resolvedLng,
		state: resolvedState,
		district: resolvedDistrict,
		city: resolvedCity
	};
	delete payload.newImages;
	await update(issueRef, payload);
}
async function deleteIssue(issueId) {
	const issueRef = ref(db, `issues/${issueId}`);
	await remove(issueRef);
}
function getFirebaseErrorMessage(error) {
	return message(error);
}
function toBoloUser(user) {
	return {
		uid: user.uid,
		displayName: user.displayName || "Bolo citizen",
		email: user.email ?? null,
		phone: user.phoneNumber ?? null,
		emailVerified: user.emailVerified
	};
}
async function getUserProfile(uid) {
	try {
		const snap = await get(ref(db, `users/${uid}`));
		if (snap.exists()) return snap.val();
		return null;
	} catch {
		return null;
	}
}
async function updateUserProfile(uid, fields) {
	const snap = await get(ref(db, `users/${uid}`));
	const existing = snap.exists() ? snap.val() : {};
	await set(ref(db, `users/${uid}`), {
		...existing,
		...fields,
		uid
	});
	const currentUser = auth.currentUser;
	if (currentUser && fields.displayName) await updateProfile(currentUser, { displayName: fields.displayName });
}
async function getUserIssueCount(uid, userDisplayName, userEmail) {
	try {
		const snap = await get(ref(db, "issues"));
		if (!snap.exists()) return 0;
		const issues = Object.values(snap.val());
		const nameNorm = userDisplayName?.trim().toLowerCase();
		const emailNorm = userEmail?.trim().toLowerCase();
		const emailPrefix = emailNorm ? emailNorm.split("@")[0] : null;
		return issues.filter((i) => {
			if (i.reporterUid && i.reporterUid === uid) return true;
			if (i.userId && i.userId === uid) return true;
			if (emailNorm && i.reporterEmail && i.reporterEmail.toLowerCase() === emailNorm) return true;
			if (nameNorm && i.reporter && i.reporter.trim().toLowerCase() === nameNorm) return true;
			if (emailPrefix && i.reporter && i.reporter.trim().toLowerCase() === emailPrefix) return true;
			return false;
		}).length;
	} catch {
		return 0;
	}
}
var AuthContext = (0, import_react.createContext)({
	user: null,
	loading: false,
	configured: false
});
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const unsubscribe = observeBoloAuth((nextUser) => {
			if (nextUser) document.cookie = "bolo_session=1; Path=/; Max-Age=2592000; SameSite=Lax";
			else document.cookie = "bolo_session=; Path=/; Max-Age=0; SameSite=Lax";
			setUser(nextUser);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			loading,
			configured: true
		},
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(AuthContext);
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Bolo" },
			{
				name: "description",
				content: "Bolo is a citizen-facing prototype for reporting and tracking municipal issues on a live map."
			},
			{
				property: "og:title",
				content: "Bolo"
			},
			{
				property: "og:description",
				content: "Report, explore and follow civic issues in your neighbourhood."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Gabarito:wght@500;600;700;800&family=Nunito+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
			},
			{
				rel: "stylesheet",
				href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SessionGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LanguageProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-center",
			richColors: true
		})] }) }) })
	});
}
function SessionGate({ children }) {
	const { user, loading } = useAuth();
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	(0, import_react.useEffect)(() => {
		if (loading) return;
		if (user && pathname === "/auth") navigate({
			to: "/",
			replace: true
		});
		if (!user && pathname !== "/auth") navigate({
			to: "/auth",
			replace: true
		});
	}, [
		loading,
		navigate,
		pathname,
		user
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-semibold text-muted-foreground",
			children: "Checking your Bolo session…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var $$splitComponentImporter$4 = () => import("./routes-myJ5gsrB.mjs");
var Route$4 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Bolo" },
		{
			name: "description",
			content: "Browse civic complaints on an interactive map: road damage, streetlights, drainage, garbage, water leaks and public spaces."
		},
		{
			property: "og:title",
			content: "Bolo"
		},
		{
			property: "og:description",
			content: "See what your neighbourhood is reporting and how it is progressing."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./auth-CHpmMH24.mjs");
var Route$3 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Welcome to Bolo" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./explore-dU6NVQ5N.mjs");
var Route$2 = createFileRoute("/explore")({
	head: () => ({ meta: [
		{ title: "Explore issues — Bolo" },
		{
			name: "description",
			content: "A visual feed of civic complaints reported across Indian towns and cities, with status and reporter details."
		},
		{
			property: "og:title",
			content: "Explore issues — Bolo"
		},
		{
			property: "og:description",
			content: "Browse a photo-led feed of neighbourhood issues and their progress."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./raise-DUNA4MJH.mjs");
var Route$1 = createFileRoute("/raise")({
	head: () => ({ meta: [
		{ title: "Raise an issue — Bolo" },
		{
			name: "description",
			content: "Report a civic issue with photos, location, address and a detailed description in your preferred language."
		},
		{
			property: "og:title",
			content: "Raise an issue — Bolo"
		},
		{
			property: "og:description",
			content: "Share what needs attention in your area with photos and clear details."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./waitlist-BA1mabX8.mjs");
var Route = createFileRoute("/waitlist")({
	head: () => ({ meta: [{ title: "Join Waitlist — Bolo Civic Connect" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	AuthRoute: Route$3.update({
		id: "/auth",
		path: "/auth",
		getParentRoute: () => Route$5
	}),
	ExploreRoute: Route$2.update({
		id: "/explore",
		path: "/explore",
		getParentRoute: () => Route$5
	}),
	RaiseRoute: Route$1.update({
		id: "/raise",
		path: "/raise",
		getParentRoute: () => Route$5
	}),
	WaitlistRoute: Route.update({
		id: "/waitlist",
		path: "/waitlist",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { initAutoLocationDetection as _, deleteIssue as a, LANGUAGES as b, getUserProfile as c, signOutOfBolo as d, submitIssue as f, getCachedUserLocation as g, updateUserProfile as h, createBoloAccount as i, signInToBolo as l, updateIssue as m, Route$1 as n, getFirebaseErrorMessage as o, subscribeToIssues as p, useAuth as r, getUserIssueCount as s, router_exports as t, signInWithGoogle as u, useLanguage as v, t as x, useT as y };
