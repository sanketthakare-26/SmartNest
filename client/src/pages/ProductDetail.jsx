import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import ProductGallery from "../components/product/ProductGallery";
import SpecTable from "../components/product/SpecTable";
import Loader from "../components/common/Loader";
import Button from "../components/common/Button";
import api from "../lib/api";
import { ArrowLeft, MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react";

const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, loading, error } = useFetch(`/products/${slug}`);

  // Form State
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [statusMsg, setStatusMsg] = useState("");

  // Demo Fallback Catalog
  const demoFallbackProducts = {
    "nest-hub-central": {
      _id: "demo-p1",
      name: "Nest Hub Central Console",
      slug: "nest-hub-central",
      price: 299,
      description: "Take control of your home ecosystem with this intuitive, wall-mounted touch console. It pairs directly with voice assist endpoints, security sensors, cameras, and lighting rails. Built-in latency-free chip handles routines locally so your system continues working even if the internet goes offline.",
      images: ["https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=800&q=80"],
      category: { name: "Smart Hubs", description: "Central controllers" },
      brand: { name: "Google" },
      inStock: true,
      specifications: [
        { key: "Screen Size", value: "10.1 Inches IPS LCD" },
        { key: "Connectivity", value: "WiFi 6, Bluetooth 5.2, Thread, Zigbee" },
        { key: "Resolution", value: "1920 x 1200" },
        { key: "Smart Assistant", value: "Google Assistant Built-in" },
        { key: "Processor", value: "Intelligent Neural Core 4" },
      ],
    },
    "aura-bulb-pack": {
      _id: "demo-p2",
      name: "Aura Bulb Automation Pack",
      slug: "aura-bulb-pack",
      price: 49,
      description: "Set the mood with 16 million colors and customizable light scenes. This pack of 4 LED automation bulbs fits standard E27 sockets. Adjust intensities or program sleep schedules directly using the SmartNest application.",
      images: ["https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&w=800&q=80"],
      category: { name: "Lighting" },
      brand: { name: "Philips" },
      inStock: true,
      specifications: [
        { key: "Socket Type", value: "E27" },
        { key: "Lumens", value: "800lm (Equivalent to 60W)" },
        { key: "Color Palette", value: "16 Million Colors RGB + Warm White" },
        { key: "Lifetime", value: "25,000 Hours" },
        { key: "Protocol", value: "Zigbee / Bluetooth" },
      ],
    },
    "sentinel-security-lock": {
      _id: "demo-p3",
      name: "Sentinel Facial Security Lock",
      slug: "sentinel-security-lock",
      price: 199,
      description: "Upgrade your entrance with a secure, keyless, and biometrically advanced lock. Supports high-precision facial recognition scanning, pin pads, card passes, and direct remote unlocking. Includes encrypted logs.",
      images: ["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"],
      category: { name: "Security" },
      brand: { name: "August" },
      inStock: true,
      specifications: [
        { key: "Biometrics", value: "3D IR Facial Scanner & Fingerprint Pad" },
        { key: "Power", value: "Rechargeable Lithium Pack (8 Months Battery)" },
        { key: "Backup", value: "Emergency USB-C Port & Physical Key Override" },
        { key: "App Support", value: "iOS / Android Remote Keys" },
      ],
    },
  };

  const activeProduct = product || demoFallbackProducts[slug];

  useEffect(() => {
    if (activeProduct) {
      setEnquiryForm((prev) => ({
        ...prev,
        message: `Hi, I am interested in the "${activeProduct.name}". Please let me know more about shipping and installation options.`,
      }));
    }
  }, [activeProduct]);

  if (loading && product === null) {
    return (
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <Loader variant="spinner" />
      </div>
    );
  }

  if (!activeProduct) {
    return (
      <div className="py-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center gap-4">
        <AlertCircle className="text-red-400 w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold text-white">Product Not Found</h2>
          <p className="text-gray-400 mt-2">The device you are looking for does not exist in our catalog.</p>
        </div>
        <Link to="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            <span>Return to Catalog</span>
          </Button>
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEnquiryForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitStatus(null);
    setStatusMsg("");

    try {
      await api.post("/enquiries", {
        ...enquiryForm,
        productId: activeProduct._id.startsWith("demo-") ? null : activeProduct._id,
      });
      setSubmitStatus("success");
      setStatusMsg("Thank you! Your enquiry has been received. Our team will reach out shortly.");
      setEnquiryForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setSubmitStatus("error");
      setStatusMsg(err.response?.data?.message || err.message || "Failed to submit enquiry.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const whatsappMessage = `Hi! I would like to enquire about the "${activeProduct.name}" (Price: $${activeProduct.price}) on SmartNest.`;
  const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="py-12 px-6 md:px-12 max-w-7xl mx-auto text-left">
      <Link
        to="/products"
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8 transition"
      >
        <ArrowLeft size={16} />
        <span>Back to products</span>
      </Link>

      {!product && (
        <div className="mb-6 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-xs text-gray-400 flex items-center gap-2">
          <AlertCircle size={14} className="text-primary" />
          <span>Showing offline fallback product. Ensure MongoDB is running to fetch live database records.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left Gallery */}
        <ProductGallery images={activeProduct.images} />

        {/* Right Info */}
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {activeProduct.brand?.name && (
                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500">
                  {activeProduct.brand.name}
                </span>
              )}
              <span className="text-xs font-semibold text-primary px-3 py-0.5 rounded-full bg-primary/10 border border-primary/5">
                {activeProduct.category?.name}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              {activeProduct.name}
            </h1>
          </div>

          <div className="pb-6 border-b border-slate-900">
            <span className="text-xs text-gray-500 block mb-1">Pricing</span>
            <span className="text-3xl font-black text-primary">${activeProduct.price}</span>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-2">Description</h4>
            <p className="text-gray-400 text-sm leading-relaxed">{activeProduct.description}</p>
          </div>

          <div className="flex flex-wrap gap-4 mt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold transition shadow-lg shadow-green-500/10 text-sm"
            >
              <MessageSquare size={18} className="fill-white text-[#25D366]" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Specifications & Query Form Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start pt-12 border-t border-slate-900">
        {/* Tech Specs */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-white">Technical Specifications</h3>
          <SpecTable specs={activeProduct.specifications} />
        </div>

        {/* Enquiry Form */}
        <div className="glass-card p-6 rounded-2xl border border-slate-900 flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Request Information</h3>
            <p className="text-xs text-gray-500">Submit your contact info and our technicians will coordinate.</p>
          </div>

          {submitStatus && (
            <div className={`p-4 rounded-xl border flex items-start gap-2 text-xs ${
              submitStatus === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
              {submitStatus === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{statusMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400">Name</label>
              <input
                type="text"
                name="name"
                required
                value={enquiryForm.name}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                placeholder="Full Name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={enquiryForm.email}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400">Phone Number</label>
              <input
                type="text"
                name="phone"
                required
                value={enquiryForm.phone}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-sm text-white focus:outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400">Enquiry Details</label>
              <textarea
                name="message"
                required
                rows={4}
                value={enquiryForm.message}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2 rounded-lg text-sm text-white focus:outline-none resize-none"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              loading={submitLoading}
              className="w-full mt-2"
            >
              <Send size={16} className="mr-2" />
              <span>Submit Enquiry</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
