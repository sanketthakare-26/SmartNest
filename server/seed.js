require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const Category = require("./models/Category");
const Brand = require("./models/Brand");
const Product = require("./models/Product");

const categoriesData = [
  { slug: "cctv-surveillance", name: "CCTV & Surveillance", description: "Keep an eye on what matters most", image: "/src/assets/cat-cctv.jpg" },
  { slug: "digital-door-lock", name: "Digital Door Locks", description: "Keyless. Effortless. Secure.", image: "/src/assets/cat-lock.jpg" },
  { slug: "gate-automation", name: "Gate Automation", description: "Drive in. Gate opens.", image: "/src/assets/cat-gate.jpg" },
  { slug: "curtain-blinds", name: "Curtain & Blinds Automation", description: "Wake up to natural light", image: "/src/assets/cat-curtain.jpg" },
  { slug: "lift-automation", name: "Lift Automation", description: "Smart vertical living", image: "/src/assets/cat-lift.jpg" },
  { slug: "touch-panels", name: "Touch Panels & Controllers", description: "Every room, one tap away", image: "/src/assets/cat-touch.jpg" },
  { slug: "motion-security", name: "Motion Sensors & Security", description: "Always watching, never sleeping", image: "/src/assets/cat-sensor.jpg" },
  { slug: "home-kits", name: "Home Automation Kits", description: "Your smart home, in one box", image: "/src/assets/cat-kit.jpg" },
];

const brandsData = [
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

const imgMap = {
  "cctv-surveillance": "/src/assets/cat-cctv.jpg",
  "digital-door-lock": "/src/assets/cat-lock.jpg",
  "gate-automation": "/src/assets/cat-gate.jpg",
  "curtain-blinds": "/src/assets/cat-curtain.jpg",
  "lift-automation": "/src/assets/cat-lift.jpg",
  "touch-panels": "/src/assets/cat-touch.jpg",
  "motion-security": "/src/assets/cat-sensor.jpg",
  "home-kits": "/src/assets/cat-kit.jpg",
};

const productsData = [
  // CCTV
  { slug: "hik-4mp-dome", name: "Hikvision 4MP Dome Camera", brandSlug: "hikvision", categorySlug: "cctv-surveillance", tag: "Top Seller", shortDescription: "Crystal-clear 4MP indoor surveillance with infrared night vision.", specs: [{label:"Resolution",value:"4MP (2560x1440)"},{label:"Night Vision",value:"30m IR"},{label:"Lens",value:"2.8mm Fixed"}] },
  { slug: "dahua-ir-bullet", name: "Dahua IR Bullet Camera", brandSlug: "dahua", categorySlug: "cctv-surveillance", tag: "Trending", shortDescription: "Weatherproof outdoor bullet camera with 80m IR range.", specs: [{label:"Resolution",value:"5MP"},{label:"IP Rating",value:"IP67"},{label:"Night Vision",value:"80m IR"}] },
  { slug: "cpplus-ptz", name: "CP Plus PTZ Camera", brandSlug: "cp-plus", categorySlug: "cctv-surveillance", shortDescription: "360° pan-tilt-zoom camera with 25x optical zoom.", specs: [{label:"Zoom",value:"25x Optical"},{label:"Pan",value:"360° endless"},{label:"Tilt",value:"-15° to +90°"}] },
  { slug: "hik-nvr-8ch", name: "Hikvision 8-Channel NVR Kit", brandSlug: "hikvision", categorySlug: "cctv-surveillance", tag: "Featured", shortDescription: "Complete 8-channel NVR with 4 cameras and 2TB storage.", specs: [{label:"Channels",value:"8"},{label:"Storage",value:"2TB HDD included"},{label:"Cameras",value:"4 x 4MP Dome"}] },
  { slug: "dahua-16ch-dvr", name: "Dahua 16CH DVR System", brandSlug: "dahua", categorySlug: "cctv-surveillance", shortDescription: "Enterprise-grade 16-channel DVR for large premises.", specs: [{label:"Channels",value:"16"},{label:"Storage",value:"Up to 16TB"},{label:"Compression",value:"H.265+"}] },

  // Door locks
  { slug: "samsung-shp-dp609", name: "Samsung SHP-DP609 Smart Lock", brandSlug: "samsung", categorySlug: "digital-door-lock", tag: "Top Seller", shortDescription: "Push-pull smart lock with fingerprint, RFID and PIN access.", specs: [{label:"Access",value:"Fingerprint / PIN / RFID / Key"},{label:"Battery",value:"4 x AA (12 months)"},{label:"Door Thickness",value:"38–80mm"}] },
  { slug: "godrej-eurika-plus", name: "Godrej Eurika Plus", brandSlug: "godrej", categorySlug: "digital-door-lock", shortDescription: "Made-in-India smart lock with OTP and Bluetooth.", specs: [{label:"Access",value:"PIN / RFID / Bluetooth / Key"},{label:"OTP",value:"Yes (Guest Access)"},{label:"Battery",value:"4 x AA"}] },
  { slug: "philips-easykey-702", name: "Philips EasyKey 702", brandSlug: "philips", categorySlug: "digital-door-lock", tag: "Trending", shortDescription: "Sleek European-design lock with anti-peep PIN entry.", specs: [{label:"Access",value:"Fingerprint / PIN / Card / Key"},{label:"Capacity",value:"100 Fingerprints"},{label:"Material",value:"Zinc Alloy"}] },
  { slug: "bosch-3000", name: "Bosch Smart Lock 3000", brandSlug: "bosch", categorySlug: "digital-door-lock", shortDescription: "German engineering with WiFi remote unlock.", specs: [{label:"Connectivity",value:"WiFi + Bluetooth"},{label:"App",value:"Bosch Home Connect"},{label:"Auto-Lock",value:"Configurable"}] },
  { slug: "yale-ydm-3168", name: "Yale YDM 3168", brandSlug: "yale", categorySlug: "digital-door-lock", shortDescription: "Premium mortise-fit smart lock with face-touch sensor.", specs: [{label:"Access",value:"Fingerprint / PIN / Card / Key"},{label:"Mortise",value:"Yes"},{label:"Alarm",value:"Anti-Tamper"}] },

  // Gate
  { slug: "faac-sliding", name: "FAAC Sliding Gate Motor", brandSlug: "faac", categorySlug: "gate-automation", tag: "Top Seller", shortDescription: "Heavy-duty Italian sliding gate operator up to 600kg.", specs: [{label:"Max Gate Weight",value:"600 kg"},{label:"Speed",value:"12 m/min"},{label:"Power",value:"230V AC"}] },
  { slug: "bft-deimos-600", name: "BFT Deimos 600", brandSlug: "bft", categorySlug: "gate-automation", shortDescription: "Compact Italian motor with built-in receiver.", specs: [{label:"Max Gate Weight",value:"600 kg"},{label:"Remote",value:"Rolling Code"}] },
  { slug: "nice-road-400", name: "Nice Road400", brandSlug: "nice", categorySlug: "gate-automation", tag: "Trending", shortDescription: "Reliable swing gate motor for residential gates.", specs: [{label:"Type",value:"Swing"},{label:"Max Leaf",value:"4m / 400kg"}] },
  { slug: "came-bx-78", name: "Came BX-78", brandSlug: "came", categorySlug: "gate-automation", shortDescription: "Italian-made sliding gate operator with encoder.", specs: [{label:"Max Gate Weight",value:"800 kg"},{label:"Encoder",value:"Magnetic"}] },
  { slug: "roger-heras", name: "Roger Technology Heras Gate", brandSlug: "roger", categorySlug: "gate-automation", shortDescription: "Industrial-grade heavy-duty gate operator.", specs: [{label:"Use",value:"Industrial"},{label:"Max Weight",value:"1500 kg"}] },

  // Curtain
  { slug: "somfy-glydea", name: "Somfy Glydea Curtain Motor", brandSlug: "somfy", categorySlug: "curtain-blinds", tag: "Top Seller", shortDescription: "Silent French-made motor for premium curtains.", specs: [{label:"Noise",value:"<44 dB"},{label:"Control",value:"RTS / App"},{label:"Max Weight",value:"60 kg"}] },
  { slug: "dooya-dt82tv", name: "Dooya DT82TV", brandSlug: "dooya", categorySlug: "curtain-blinds", shortDescription: "Best-value curtain motor with RF + app control.", specs: [{label:"Control",value:"RF + WiFi (optional)"},{label:"Max Weight",value:"80 kg"}] },
  { slug: "zemismart-wifi", name: "Zemismart WiFi Curtain Motor", brandSlug: "zemismart", categorySlug: "curtain-blinds", tag: "Trending", shortDescription: "Tuya/Smart Life WiFi curtain motor, no hub needed.", specs: [{label:"App",value:"Tuya Smart Life"},{label:"Voice",value:"Alexa / Google"}] },
  { slug: "eve-motionblinds", name: "Eve MotionBlinds Kit", brandSlug: "eve", categorySlug: "curtain-blinds", shortDescription: "Apple HomeKit-native motorised blinds kit.", specs: [{label:"Ecosystem",value:"Apple HomeKit"},{label:"Battery",value:"Rechargeable Li-ion"}] },
  { slug: "somfy-irismo", name: "Somfy Irismo Curtain Motor", brandSlug: "somfy", categorySlug: "curtain-blinds", tag: "New", shortDescription: "Wire-free curtain motor option with built-in rechargeable battery.", specs: [{label:"Type",value:"Battery Powered"},{label:"Battery Life",value:"6-9 months"}] },

  // Lift
  { slug: "schindler-smart-panel", name: "Schindler Smart Lift Panel", brandSlug: "schindler", categorySlug: "lift-automation", tag: "Featured", shortDescription: "Touch-enabled destination control panel.", specs: [{label:"Display",value:"10\" Touch"},{label:"Connectivity",value:"BMS / IoT"}] },
  { slug: "thyssen-home", name: "Thyssen Home Elevator Automation Kit", brandSlug: "thyssen", categorySlug: "lift-automation", shortDescription: "Complete home elevator automation kit.", specs: [{label:"Floors",value:"Up to 5"},{label:"Drive",value:"Hydraulic / Traction"}] },
  { slug: "sigma-home-lift", name: "Sigma Home Lift Controller", brandSlug: "sigma", categorySlug: "lift-automation", shortDescription: "Compact controller for residential lifts.", specs: [{label:"Capacity",value:"320 kg"},{label:"Type",value:"MRL"}] },
  { slug: "schindler-clean-mobility", name: "Schindler Clean Mobility Kit", brandSlug: "schindler", categorySlug: "lift-automation", tag: "New", shortDescription: "Touchless elevator control system using gesture sensors and mobile app routing.", specs: [{label:"Features",value:"Gesture Call / App Dispatch"},{label:"Air Purifier",value:"Built-in UV-C"}] },
  { slug: "sigma-direct-drive", name: "Sigma Direct Drive Controller", brandSlug: "sigma", categorySlug: "lift-automation", shortDescription: "High-performance direct drive controller with backup UPS power integration.", specs: [{label:"Phase",value:"3-Phase AC"},{label:"Backup",value:"Automatic Rescue Device"}] },

  // Touch panels
  { slug: "legrand-arteor", name: "Legrand Arteor Touch Panel", brandSlug: "legrand", categorySlug: "touch-panels", tag: "Top Seller", shortDescription: "Elegant glass touch panel for lights, fans, scenes.", specs: [{label:"Channels",value:"4 / 6 / 8"},{label:"Protocol",value:"Zigbee / RF"}] },
  { slug: "schneider-wiser", name: "Schneider Wiser Smart Panel", brandSlug: "schneider", categorySlug: "touch-panels", shortDescription: "WiFi smart switches with energy monitoring.", specs: [{label:"App",value:"Wiser Home"},{label:"Voice",value:"Alexa / Google"}] },
  { slug: "lutron-grafik-t", name: "Lutron Grafik T", brandSlug: "lutron", categorySlug: "touch-panels", tag: "Trending", shortDescription: "Professional dimmer with capacitive touch slider.", specs: [{label:"Type",value:"Dimmer"},{label:"Load",value:"Universal"}] },
  { slug: "abb-ibus", name: "ABB i-bus Smart Panel", brandSlug: "abb", categorySlug: "touch-panels", shortDescription: "KNX-based premium touch panel for villas.", specs: [{label:"Protocol",value:"KNX"},{label:"Display",value:"7\" Color Touch"}] },
  { slug: "legrand-livingnow", name: "Legrand Living Now Panel", brandSlug: "legrand", categorySlug: "touch-panels", tag: "New", shortDescription: "Smart glass control panel featuring flush keys, customized icons and ambient light.", specs: [{label:"Design",value:"Italian Frameless"},{label:"Modules",value:"3 / 4 Modules"}] },

  // Sensors
  { slug: "honeywell-pir", name: "Honeywell PIR Motion Sensor", brandSlug: "honeywell", categorySlug: "motion-security", tag: "Top Seller", shortDescription: "Reliable PIR motion sensor with pet immunity.", specs: [{label:"Range",value:"12m x 12m"},{label:"Pet Immune",value:"Up to 25kg"}] },
  { slug: "paradox-kit", name: "Paradox Security Kit", brandSlug: "paradox", categorySlug: "motion-security", shortDescription: "Complete intrusion alarm system with app.", specs: [{label:"Zones",value:"32"},{label:"App",value:"Insite Gold"}] },
  { slug: "dsc-neo", name: "DSC Neo Alarm Kit", brandSlug: "dsc", categorySlug: "motion-security", tag: "Trending", shortDescription: "Wireless alarm system with cloud monitoring.", specs: [{label:"Wireless",value:"PowerG 2-way"},{label:"Range",value:"Up to 2 km"}] },
  { slug: "risco-agility", name: "Risco Agility 4", brandSlug: "risco", categorySlug: "motion-security", shortDescription: "Wireless alarm with cameras and video verification.", specs: [{label:"Cameras",value:"PIR Cam included"},{label:"App",value:"iRisco"}] },
  { slug: "honeywell-wireless-pir", name: "Honeywell Wireless PIR", brandSlug: "honeywell", categorySlug: "motion-security", tag: "New", shortDescription: "Long-range wireless PIR motion sensor with advanced anti-masking technology.", specs: [{label:"Frequency",value:"868 MHz"},{label:"Range",value:"15m detection"}] },

  // Kits
  { slug: "smartnest-starter", name: "SmartNest Starter Kit", brandSlug: "smartnest", categorySlug: "home-kits", tag: "Featured", shortDescription: "Lights + locks + camera — everything to start.", specs: [{label:"Includes",value:"1 Hub, 4 Bulbs, 1 Lock, 1 Cam"},{label:"App",value:"SmartNest"}] },
  { slug: "zwave-bundle", name: "Z-Wave Complete Home Bundle", brandSlug: "smartnest", categorySlug: "home-kits", shortDescription: "Z-Wave hub + 12 devices for whole-home control.", specs: [{label:"Protocol",value:"Z-Wave Plus"},{label:"Devices",value:"12 included"}] },
  { slug: "zigbee-pro", name: "Zigbee Pro Kit", brandSlug: "smartnest", categorySlug: "home-kits", tag: "Trending", shortDescription: "Mesh-network Zigbee kit for 2BHK homes.", specs: [{label:"Protocol",value:"Zigbee 3.0"},{label:"Range",value:"Mesh, expandable"}] },
  { slug: "google-nest-bundle", name: "Google Nest Ecosystem Bundle", brandSlug: "google-nest", categorySlug: "home-kits", shortDescription: "Nest Hub + Mini + Doorbell + Thermostat.", specs: [{label:"Voice",value:"Google Assistant"},{label:"Includes",value:"4 devices"}] },
  { slug: "google-nest-hub-max", name: "Google Nest Hub Max Kit", brandSlug: "google-nest", categorySlug: "home-kits", tag: "New", shortDescription: "Ultimate home dashboard package containing Nest Hub Max, smart plugs and voice controllers.", specs: [{label:"Display",value:"10\" HD screen"},{label:"Camera",value:"Built-in Nest Cam"}] },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log("✅ Database Connected for seeding.");

    // Seed Categories
    console.log("Seeding categories...");
    const categoryMap = {};
    for (const cat of categoriesData) {
      let dbCat = await Category.findOne({ slug: cat.slug });
      if (!dbCat) {
        dbCat = await Category.create(cat);
        console.log(`+ Created Category: ${cat.name}`);
      } else {
        console.log(`~ Category already exists: ${cat.name}`);
      }
      categoryMap[cat.slug] = dbCat._id;
    }

    // Seed Brands
    console.log("Seeding brands...");
    const brandMap = {};
    for (const brand of brandsData) {
      let dbBrand = await Brand.findOne({ slug: brand.slug });
      if (!dbBrand) {
        dbBrand = await Brand.create(brand);
        console.log(`+ Created Brand: ${brand.name}`);
      } else {
        console.log(`~ Brand already exists: ${brand.name}`);
      }
      brandMap[brand.slug] = dbBrand._id;
    }

    // Seed Products
    console.log("Seeding products...");
    for (const prod of productsData) {
      let dbProd = await Product.findOne({ slug: prod.slug });
      if (!dbProd) {
        const catId = categoryMap[prod.categorySlug];
        const brandId = brandMap[prod.brandSlug];
        if (!catId || !brandId) {
          console.warn(`⚠️ Skipping ${prod.name} due to missing category or brand refs`);
          continue;
        }

        const primaryImage = imgMap[prod.categorySlug] || "/src/assets/hero.jpg";
        const specifications = prod.specs.map(s => ({
          key: s.label,
          value: s.value
        }));

        dbProd = await Product.create({
          name: prod.name,
          slug: prod.slug,
          description: prod.shortDescription,
          price: 199, // default price
          featured: prod.tag === "Featured" || prod.tag === "Top Seller",
          inStock: true,
          specifications,
          images: [primaryImage],
          category: catId,
          brand: brandId,
          isActive: true
        });
        console.log(`+ Created Product: ${prod.name}`);
      } else {
        console.log(`~ Product already exists: ${prod.name}`);
      }
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
