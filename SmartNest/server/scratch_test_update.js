// Node has global fetch and FormData

async function run() {
  try {
    // 1. We need to login as admin to get a token
    console.log("Logging in as admin...");
    const loginRes = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@smartnest.in", password: "admin" })
    });
    const loginJson = await loginRes.json();
    if (!loginRes.ok) {
      throw new Error("Login failed: " + JSON.stringify(loginJson));
    }
    const token = loginJson.token;
    console.log("✅ Logged in. Token retrieved.");

    // 2. Fetch categories to find CCTV Cameras ID
    console.log("Fetching categories...");
    const catRes = await fetch("http://localhost:5000/api/categories");
    const categories = await catRes.json();
    const cctvCat = categories.find(c => c.slug === "cctv-cameras" || c.name.includes("CCTV"));
    if (!cctvCat) {
      throw new Error("CCTV Cameras category not found in DB.");
    }
    console.log("Found CCTV Category:", cctvCat);

    // 3. Try to update using FormData with a test Cloudinary URL
    console.log("Updating CCTV Category with test Cloudinary URL...");
    const formData = new globalThis.FormData();
    formData.append("name", "CCTV Cameras");
    formData.append("description", "Keep an eye on what matters most.");
    formData.append("image", "https://res.cloudinary.com/dx2nqvwts/image/upload/v1719232313/shoes_test.jpg");

    const updateRes = await fetch(`http://localhost:5000/api/categories/${cctvCat._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    const updateJson = await updateRes.json();
    console.log("Update Response Status:", updateRes.status);
    console.log("Update Response Body:", updateJson);
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
