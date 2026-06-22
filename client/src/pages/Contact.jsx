import React, { useState } from "react";
import AnimatedSection from "../components/common/AnimatedSection";
import Button from "../components/common/Button";
import api from "../lib/api";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error'
  const [msg, setMsg] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setMsg("");

    try {
      await api.post("/enquiries", form);
      setStatus("success");
      setMsg("Thank you! Your inquiry has been submitted successfully. Our technicians will connect with you shortly.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setStatus("error");
      setMsg(err.response?.data?.message || err.message || "Failed to submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-6 md:px-12 max-w-6xl mx-auto text-left min-h-screen">
      <AnimatedSection className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-3">Get in Touch</h1>
        <p className="text-gray-400 text-sm max-w-xl">
          Interested in scheduling an installation or want to enquire about specific catalog accessories? Drop us a line.
        </p>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Contact Info */}
        <AnimatedSection className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-900 flex flex-col gap-8">
            <h3 className="text-lg font-bold text-white">Contact Details</h3>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/10 shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Call/WhatsApp</h4>
                <p className="text-xs text-gray-500 mt-0.5">Support Desk available 9am - 6pm</p>
                <a href="tel:+1234567890" className="text-sm text-gray-300 hover:text-primary transition mt-1 block">
                  +1 (234) 567-890
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl text-secondary border border-secondary/10 shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Email Support</h4>
                <p className="text-xs text-gray-500 mt-0.5">We reply within 24 hours</p>
                <a href="mailto:support@smartnest.com" className="text-sm text-gray-300 hover:text-primary transition mt-1 block">
                  support@smartnest.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/10 shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm">Innovation Lab</h4>
                <p className="text-sm text-gray-300 mt-1">
                  100 Silicon Blvd, Suite 404<br />San Francisco, CA 94107
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Contact Form */}
        <AnimatedSection className="lg:col-span-2 glass-card p-8 rounded-2xl border border-slate-900">
          <h3 className="text-xl font-bold text-white mb-6">Send an Inquiry</h3>

          {status && (
            <div className={`p-4 rounded-xl border flex items-start gap-2 text-xs mb-6 ${
              status === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
              {status === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-gray-400">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                placeholder="Full Name"
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-1">
              <label className="text-xs font-semibold text-gray-400">Phone Number</label>
              <input
                type="text"
                name="phone"
                required
                value={form.phone}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-400">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-gray-400">Message / Request</label>
              <textarea
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={handleInputChange}
                className="bg-slate-900 border border-slate-800 focus:border-primary px-3 py-2.5 rounded-lg text-sm text-white focus:outline-none resize-none"
                placeholder="How can we help automate your space?"
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" variant="primary" loading={loading} className="px-8 py-3">
                <Send size={16} className="mr-2" />
                <span>Submit Details</span>
              </Button>
            </div>
          </form>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Contact;
