import cctv from "@/assets/cat-cctv.jpg";
import lock from "@/assets/cat-lock.jpg";
import gate from "@/assets/cat-gate.jpg";
import curtain from "@/assets/cat-curtain.jpg";
import lift from "@/assets/cat-lift.jpg";
import touch from "@/assets/cat-touch.jpg";
import sensor from "@/assets/cat-sensor.jpg";
import kit from "@/assets/cat-kit.jpg";

export const categories = [
  { slug: "cctv-surveillance", name: "CCTV & Surveillance", tagline: "Keep an eye on what matters most", image: cctv },
  { slug: "digital-door-lock", name: "Digital Door Locks", tagline: "Keyless. Effortless. Secure.", image: lock },
  { slug: "gate-automation", name: "Gate Automation", tagline: "Drive in. Gate opens.", image: gate },
  { slug: "curtain-blinds", name: "Curtain & Blinds Automation", tagline: "Wake up to natural light", image: curtain },
  { slug: "lift-automation", name: "Lift Automation", tagline: "Smart vertical living", image: lift },
  { slug: "touch-panels", name: "Touch Panels & Controllers", tagline: "Every room, one tap away", image: touch },
  { slug: "motion-security", name: "Motion Sensors & Security", tagline: "Always watching, never sleeping", image: sensor },
  { slug: "home-kits", name: "Home Automation Kits", tagline: "Your smart home, in one box", image: kit },
];

export const brands = [
  { slug: "hikvision", name: "Hikvision" },
  { slug: "dahua", name: "Dahua" },
  { slug: "cp-plus", name: "CP Plus" },
  { slug: "samsung", name: "Samsung" },
  { slug: "godrej", name: "Godrej" },
  { slug: "philips", name: "Philips" },
  { slug: "bosch", name: "Bosch" },
  { slug: "yale", name: "Yale" },
  { slug: "faac", name: "FAAC" },
  { slug: "bft", name: "BFT" },
  { slug: "nice", name: "Nice" },
  { slug: "came", name: "Came" },
  { slug: "roger", name: "Roger Technology" },
  { slug: "somfy", name: "Somfy" },
  { slug: "dooya", name: "Dooya" },
  { slug: "zemismart", name: "Zemismart" },
  { slug: "eve", name: "Eve" },
  { slug: "schindler", name: "Schindler" },
  { slug: "thyssen", name: "Thyssen" },
  { slug: "sigma", name: "Sigma" },
  { slug: "legrand", name: "Legrand" },
  { slug: "schneider", name: "Schneider" },
  { slug: "lutron", name: "Lutron" },
  { slug: "abb", name: "ABB" },
  { slug: "honeywell", name: "Honeywell" },
  { slug: "paradox", name: "Paradox" },
  { slug: "dsc", name: "DSC" },
  { slug: "risco", name: "Risco" },
  { slug: "smartnest", name: "SmartNest" },
  { slug: "google-nest", name: "Google Nest" },
];

const baseSpecs = (extra = []) => [
  { label: "Warranty", value: "2 Years Manufacturer" },
  { label: "Installation", value: "Included (Certified Technician)" },
  { label: "Support", value: "24/7 On-call" },
  ...extra,
];

export const products = [
  // CCTV
  { id: "hik-4mp-dome", slug: "hik-4mp-dome", name: "Hikvision 4MP Dome Camera", brand: "hikvision", categorySlug: "cctv-surveillance", image: cctv, images: [cctv, lock, sensor], tag: "Top Seller", shortDescription: "Crystal-clear 4MP indoor surveillance with infrared night vision.", specs: baseSpecs([{ label: "Resolution", value: "4MP (2560x1440)" }, { label: "Night Vision", value: "30m IR" }, { label: "Lens", value: "2.8mm Fixed" }]) },
  { id: "dahua-ir-bullet", slug: "dahua-ir-bullet", name: "Dahua IR Bullet Camera", brand: "dahua", categorySlug: "cctv-surveillance", image: cctv, images: [cctv, lock, sensor], tag: "Trending", shortDescription: "Weatherproof outdoor bullet camera with 80m IR range.", specs: baseSpecs([{ label: "Resolution", value: "5MP" }, { label: "IP Rating", value: "IP67" }, { label: "Night Vision", value: "80m IR" }]) },
  { id: "cpplus-ptz", slug: "cpplus-ptz", name: "CP Plus PTZ Camera", brand: "cp-plus", categorySlug: "cctv-surveillance", image: cctv, images: [cctv, lock, sensor], shortDescription: "360° pan-tilt-zoom camera with 25x optical zoom.", specs: baseSpecs([{ label: "Zoom", value: "25x Optical" }, { label: "Pan", value: "360° endless" }, { label: "Tilt", value: "-15° to +90°" }]) },
  { id: "hik-nvr-8ch", slug: "hik-nvr-8ch", name: "Hikvision 8-Channel NVR Kit", brand: "hikvision", categorySlug: "cctv-surveillance", image: cctv, images: [cctv, lock, sensor], tag: "Featured", shortDescription: "Complete 8-channel NVR with 4 cameras and 2TB storage.", specs: baseSpecs([{ label: "Channels", value: "8" }, { label: "Storage", value: "2TB HDD included" }, { label: "Cameras", value: "4 x 4MP Dome" }]) },
  { id: "dahua-16ch-dvr", slug: "dahua-16ch-dvr", name: "Dahua 16CH DVR System", brand: "dahua", categorySlug: "cctv-surveillance", image: cctv, images: [cctv, lock, sensor], shortDescription: "Enterprise-grade 16-channel DVR for large premises.", specs: baseSpecs([{ label: "Channels", value: "16" }, { label: "Storage", value: "Up to 16TB" }, { label: "Compression", value: "H.265+" }]) },

  // Door locks
  { id: "samsung-shp-dp609", slug: "samsung-shp-dp609", name: "Samsung SHP-DP609 Smart Lock", brand: "samsung", categorySlug: "digital-door-lock", image: lock, images: [lock, cctv, sensor], tag: "Top Seller", shortDescription: "Push-pull smart lock with fingerprint, RFID and PIN access.", specs: baseSpecs([{ label: "Access", value: "Fingerprint / PIN / RFID / Key" }, { label: "Battery", value: "4 x AA (12 months)" }, { label: "Door Thickness", value: "38–80mm" }]) },
  { id: "godrej-eurika-plus", slug: "godrej-eurika-plus", name: "Godrej Eurika Plus", brand: "godrej", categorySlug: "digital-door-lock", image: lock, images: [lock, cctv, sensor], shortDescription: "Made-in-India smart lock with OTP and Bluetooth.", specs: baseSpecs([{ label: "Access", value: "PIN / RFID / Bluetooth / Key" }, { label: "OTP", value: "Yes (Guest Access)" }, { label: "Battery", value: "4 x AA" }]) },
  { id: "philips-easykey-702", slug: "philips-easykey-702", name: "Philips EasyKey 702", brand: "philips", categorySlug: "digital-door-lock", image: lock, images: [lock, cctv, sensor], tag: "Trending", shortDescription: "Sleek European-design lock with anti-peep PIN entry.", specs: baseSpecs([{ label: "Access", value: "Fingerprint / PIN / Card / Key" }, { label: "Capacity", value: "100 Fingerprints" }, { label: "Material", value: "Zinc Alloy" }]) },
  { id: "bosch-3000", slug: "bosch-3000", name: "Bosch Smart Lock 3000", brand: "bosch", categorySlug: "digital-door-lock", image: lock, images: [lock, cctv, sensor], shortDescription: "German engineering with WiFi remote unlock.", specs: baseSpecs([{ label: "Connectivity", value: "WiFi + Bluetooth" }, { label: "App", value: "Bosch Home Connect" }, { label: "Auto-Lock", value: "Configurable" }]) },
  { id: "yale-ydm-3168", slug: "yale-ydm-3168", name: "Yale YDM 3168", brand: "yale", categorySlug: "digital-door-lock", image: lock, images: [lock, cctv, sensor], shortDescription: "Premium mortise-fit smart lock with face-touch sensor.", specs: baseSpecs([{ label: "Access", value: "Fingerprint / PIN / Card / Key" }, { label: "Mortise", value: "Yes" }, { label: "Alarm", value: "Anti-Tamper" }]) },

  // Gate
  { id: "faac-sliding", slug: "faac-sliding", name: "FAAC Sliding Gate Motor", brand: "faac", categorySlug: "gate-automation", image: gate, images: [gate, lock, sensor], tag: "Top Seller", shortDescription: "Heavy-duty Italian sliding gate operator up to 600kg.", specs: baseSpecs([{ label: "Max Gate Weight", value: "600 kg" }, { label: "Speed", value: "12 m/min" }, { label: "Power", value: "230V AC" }]) },
  { id: "bft-deimos-600", slug: "bft-deimos-600", name: "BFT Deimos 600", brand: "bft", categorySlug: "gate-automation", image: gate, images: [gate, lock, sensor], shortDescription: "Compact Italian motor with built-in receiver.", specs: baseSpecs([{ label: "Max Gate Weight", value: "600 kg" }, { label: "Remote", value: "Rolling Code" }]) },
  { id: "nice-road-400", slug: "nice-road-400", name: "Nice Road400", brand: "nice", categorySlug: "gate-automation", image: gate, images: [gate, lock, sensor], tag: "Trending", shortDescription: "Reliable swing gate motor for residential gates.", specs: baseSpecs([{ label: "Type", value: "Swing" }, { label: "Max Leaf", value: "4m / 400kg" }]) },
  { id: "came-bx-78", slug: "came-bx-78", name: "Came BX-78", brand: "came", categorySlug: "gate-automation", image: gate, images: [gate, lock, sensor], shortDescription: "Italian-made sliding gate operator with encoder.", specs: baseSpecs([{ label: "Max Gate Weight", value: "800 kg" }, { label: "Encoder", value: "Magnetic" }]) },
  { id: "roger-heras", slug: "roger-heras", name: "Roger Technology Heras Gate", brand: "roger", categorySlug: "gate-automation", image: gate, images: [gate, lock, sensor], shortDescription: "Industrial-grade heavy-duty gate operator.", specs: baseSpecs([{ label: "Use", value: "Industrial" }, { label: "Max Weight", value: "1500 kg" }]) },

  // Curtain
  { id: "somfy-glydea", slug: "somfy-glydea", name: "Somfy Glydea Curtain Motor", brand: "somfy", categorySlug: "curtain-blinds", image: curtain, images: [curtain, lock, sensor], tag: "Top Seller", shortDescription: "Silent French-made motor for premium curtains.", specs: baseSpecs([{ label: "Noise", value: "<44 dB" }, { label: "Control", value: "RTS / App" }, { label: "Max Weight", value: "60 kg" }]) },
  { id: "dooya-dt82tv", slug: "dooya-dt82tv", name: "Dooya DT82TV", brand: "dooya", categorySlug: "curtain-blinds", image: curtain, images: [curtain, lock, sensor], shortDescription: "Best-value curtain motor with RF + app control.", specs: baseSpecs([{ label: "Control", value: "RF + WiFi (optional)" }, { label: "Max Weight", value: "80 kg" }]) },
  { id: "zemismart-wifi", slug: "zemismart-wifi", name: "Zemismart WiFi Curtain Motor", brand: "zemismart", categorySlug: "curtain-blinds", image: curtain, images: [curtain, lock, sensor], tag: "Trending", shortDescription: "Tuya/Smart Life WiFi curtain motor, no hub needed.", specs: baseSpecs([{ label: "App", value: "Tuya Smart Life" }, { label: "Voice", value: "Alexa / Google" }]) },
  { id: "eve-motionblinds", slug: "eve-motionblinds", name: "Eve MotionBlinds Kit", brand: "eve", categorySlug: "curtain-blinds", image: curtain, images: [curtain, lock, sensor], shortDescription: "Apple HomeKit-native motorised blinds kit.", specs: baseSpecs([{ label: "Ecosystem", value: "Apple HomeKit" }, { label: "Battery", value: "Rechargeable Li-ion" }]) },
  { id: "somfy-irismo", slug: "somfy-irismo", name: "Somfy Irismo Curtain Motor", brand: "somfy", categorySlug: "curtain-blinds", image: curtain, images: [curtain, lock, sensor], tag: "New", shortDescription: "Wire-free curtain motor option with built-in rechargeable battery.", specs: baseSpecs([{ label: "Type", value: "Battery Powered" }, { label: "Battery Life", value: "6-9 months" }]) },

  // Lift
  { id: "schindler-smart-panel", slug: "schindler-smart-panel", name: "Schindler Smart Lift Panel", brand: "schindler", categorySlug: "lift-automation", image: lift, images: [lift, lock, sensor], tag: "Featured", shortDescription: "Touch-enabled destination control panel.", specs: baseSpecs([{ label: "Display", value: "10\" Touch" }, { label: "Connectivity", value: "BMS / IoT" }]) },
  { id: "thyssen-home", slug: "thyssen-home", name: "Thyssen Home Elevator Automation Kit", brand: "thyssen", categorySlug: "lift-automation", image: lift, images: [lift, lock, sensor], shortDescription: "Complete home elevator automation kit.", specs: baseSpecs([{ label: "Floors", value: "Up to 5" }, { label: "Drive", value: "Hydraulic / Traction" }]) },
  { id: "sigma-home-lift", slug: "sigma-home-lift", name: "Sigma Home Lift Controller", brand: "sigma", categorySlug: "lift-automation", image: lift, images: [lift, lock, sensor], shortDescription: "Compact controller for residential lifts.", specs: baseSpecs([{ label: "Capacity", value: "320 kg" }, { label: "Type", value: "MRL" }]) },
  { id: "schindler-clean-mobility", slug: "schindler-clean-mobility", name: "Schindler Clean Mobility Kit", brand: "schindler", categorySlug: "lift-automation", image: lift, images: [lift, lock, sensor], tag: "New", shortDescription: "Touchless elevator control system using gesture sensors and mobile app routing.", specs: baseSpecs([{ label: "Features", value: "Gesture Call / App Dispatch" }, { label: "Air Purifier", value: "Built-in UV-C" }]) },
  { id: "sigma-direct-drive", slug: "sigma-direct-drive", name: "Sigma Direct Drive Controller", brand: "sigma", categorySlug: "lift-automation", image: lift, images: [lift, lock, sensor], shortDescription: "High-performance direct drive controller with backup UPS power integration.", specs: baseSpecs([{ label: "Phase", value: "3-Phase AC" }, { label: "Backup", value: "Automatic Rescue Device" }]) },

  // Touch panels
  { id: "legrand-arteor", slug: "legrand-arteor", name: "Legrand Arteor Touch Panel", brand: "legrand", categorySlug: "touch-panels", image: touch, images: [touch, lock, sensor], tag: "Top Seller", shortDescription: "Elegant glass touch panel for lights, fans, scenes.", specs: baseSpecs([{ label: "Channels", value: "4 / 6 / 8" }, { label: "Protocol", value: "Zigbee / RF" }]) },
  { id: "schneider-wiser", slug: "schneider-wiser", name: "Schneider Wiser Smart Panel", brand: "schneider", categorySlug: "touch-panels", image: touch, images: [touch, lock, sensor], shortDescription: "WiFi smart switches with energy monitoring.", specs: baseSpecs([{ label: "App", value: "Wiser Home" }, { label: "Voice", value: "Alexa / Google" }]) },
  { id: "lutron-grafik-t", slug: "lutron-grafik-t", name: "Lutron Grafik T", brand: "lutron", categorySlug: "touch-panels", image: touch, images: [touch, lock, sensor], tag: "Trending", shortDescription: "Professional dimmer with capacitive touch slider.", specs: baseSpecs([{ label: "Type", value: "Dimmer" }, { label: "Load", value: "Universal" }]) },
  { id: "abb-ibus", slug: "abb-ibus", name: "ABB i-bus Smart Panel", brand: "abb", categorySlug: "touch-panels", image: touch, images: [touch, lock, sensor], shortDescription: "KNX-based premium touch panel for villas.", specs: baseSpecs([{ label: "Protocol", value: "KNX" }, { label: "Display", value: "7\" Color Touch" }]) },
  { id: "legrand-livingnow", slug: "legrand-livingnow", name: "Legrand Living Now Panel", brand: "legrand", categorySlug: "touch-panels", image: touch, images: [touch, lock, sensor], tag: "New", shortDescription: "Smart glass control panel featuring flush keys, customized icons and ambient light.", specs: baseSpecs([{ label: "Design", value: "Italian Frameless" }, { label: "Modules", value: "3 / 4 Modules" }]) },

  // Sensors
  { id: "honeywell-pir", slug: "honeywell-pir", name: "Honeywell PIR Motion Sensor", brand: "honeywell", categorySlug: "motion-security", image: sensor, images: [sensor, lock, cctv], tag: "Top Seller", shortDescription: "Reliable PIR motion sensor with pet immunity.", specs: baseSpecs([{ label: "Range", value: "12m x 12m" }, { label: "Pet Immune", value: "Up to 25kg" }]) },
  { id: "paradox-kit", slug: "paradox-kit", name: "Paradox Security Kit", brand: "paradox", categorySlug: "motion-security", image: sensor, images: [sensor, lock, cctv], shortDescription: "Complete intrusion alarm system with app.", specs: baseSpecs([{ label: "Zones", value: "32" }, { label: "App", value: "Insite Gold" }]) },
  { id: "dsc-neo", slug: "dsc-neo", name: "DSC Neo Alarm Kit", brand: "dsc", categorySlug: "motion-security", image: sensor, images: [sensor, lock, cctv], tag: "Trending", shortDescription: "Wireless alarm system with cloud monitoring.", specs: baseSpecs([{ label: "Wireless", value: "PowerG 2-way" }, { label: "Range", value: "Up to 2 km" }]) },
  { id: "risco-agility", slug: "risco-agility", name: "Risco Agility 4", brand: "risco", categorySlug: "motion-security", image: sensor, images: [sensor, lock, cctv], shortDescription: "Wireless alarm with cameras and video verification.", specs: baseSpecs([{ label: "Cameras", value: "PIR Cam included" }, { label: "App", value: "iRisco" }]) },
  { id: "honeywell-wireless-pir", slug: "honeywell-wireless-pir", name: "Honeywell Wireless PIR", brand: "honeywell", categorySlug: "motion-security", image: sensor, images: [sensor, lock, cctv], tag: "New", shortDescription: "Long-range wireless PIR motion sensor with advanced anti-masking technology.", specs: baseSpecs([{ label: "Frequency", value: "868 MHz" }, { label: "Range", value: "15m detection" }]) },

  // Kits
  { id: "smartnest-starter", slug: "smartnest-starter", name: "SmartNest Starter Kit", brand: "smartnest", categorySlug: "home-kits", image: kit, images: [kit, lock, sensor], tag: "Featured", shortDescription: "Lights + locks + camera — everything to start.", specs: baseSpecs([{ label: "Includes", value: "1 Hub, 4 Bulbs, 1 Lock, 1 Cam" }, { label: "App", value: "SmartNest" }]) },
  { id: "zwave-bundle", slug: "zwave-bundle", name: "Z-Wave Complete Home Bundle", brand: "smartnest", categorySlug: "home-kits", image: kit, images: [kit, lock, sensor], shortDescription: "Z-Wave hub + 12 devices for whole-home control.", specs: baseSpecs([{ label: "Protocol", value: "Z-Wave Plus" }, { label: "Devices", value: "12 included" }]) },
  { id: "zigbee-pro", slug: "zigbee-pro", name: "Zigbee Pro Kit", brand: "smartnest", categorySlug: "home-kits", image: kit, images: [kit, lock, sensor], tag: "Trending", shortDescription: "Mesh-network Zigbee kit for 2BHK homes.", specs: baseSpecs([{ label: "Protocol", value: "Zigbee 3.0" }, { label: "Range", value: "Mesh, expandable" }]) },
  { id: "google-nest-bundle", slug: "google-nest-bundle", name: "Google Nest Ecosystem Bundle", brand: "google-nest", categorySlug: "home-kits", image: kit, images: [kit, lock, sensor], shortDescription: "Nest Hub + Mini + Doorbell + Thermostat.", specs: baseSpecs([{ label: "Voice", value: "Google Assistant" }, { label: "Includes", value: "4 devices" }]) },
  { id: "google-nest-hub-max", slug: "google-nest-hub-max", name: "Google Nest Hub Max Kit", brand: "google-nest", categorySlug: "home-kits", image: kit, images: [kit, lock, sensor], tag: "New", shortDescription: "Ultimate home dashboard package containing Nest Hub Max, smart plugs and voice controllers.", specs: baseSpecs([{ label: "Display", value: "10\" HD screen" }, { label: "Camera", value: "Built-in Nest Cam" }]) },
];

export const getProduct = (slug) => products.find((p) => p.slug === slug || p.id === slug);
export const getCategory = (slug) => categories.find((c) => c.slug === slug);
export const getBrand = (slug) => brands.find((b) => b.slug === slug);
export const productsByCategory = (slug) => products.filter((p) => p.categorySlug === slug);
export const productsByBrand = (slug) => products.filter((p) => p.brand === slug);
export const featuredProducts = products.filter((p) => p.tag === "Featured" || p.tag === "Top Seller").slice(0, 8);
export const topSelling = products.filter((p) => p.tag === "Top Seller");
export const trending = products.filter((p) => p.tag === "Trending");

export const WHATSAPP_NUMBER = "7057953073"; // placeholder
export const PHONE_NUMBER = "+91 9604542530";
export const EMAIL = "smartnest.techlab@gmail.com";
export const whatsappLink = (msg = "Hi SmartNest, I'd like to enquire about a product.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
