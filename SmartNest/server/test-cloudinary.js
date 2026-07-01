require("dotenv").config();
const cloudinary = require("./config/cloudinary");

(async function() {
    console.log("Checking Cloudinary configuration...");
    console.log("Cloud Name:", cloudinary.config().cloud_name);
    console.log("API Key:", cloudinary.config().api_key);
    
    if (!process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET === "your_api_secret_here") {
        console.error("❌ Error: Please replace 'your_api_secret_here' with your real API Secret in server/.env before running this test.");
        return;
    }

    try {
        console.log("Attempting test image upload to Cloudinary...");
        const uploadResult = await cloudinary.uploader.upload(
            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', 
            {
               public_id: 'shoes_test',
            }
        );
        
        console.log("✅ Upload successful!");
        console.log("Upload Result:", uploadResult);
        
        // Optimize delivery by resizing and applying auto-format and auto-quality
        const optimizeUrl = cloudinary.url('shoes_test', {
            fetch_format: 'auto',
            quality: 'auto'
        });
        console.log("Optimized URL:", optimizeUrl);
        
        // Transform the image: auto-crop to square aspect_ratio
        const autoCropUrl = cloudinary.url('shoes_test', {
            crop: 'auto',
            gravity: 'auto',
            width: 500,
            height: 500,
        });
        console.log("Transformed Auto-Crop URL:", autoCropUrl);
        
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:", error);
    }
})();
