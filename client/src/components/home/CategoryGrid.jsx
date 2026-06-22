import React from "react";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Loader from "../common/Loader";
import AnimatedSection from "../common/AnimatedSection";
import { ArrowRight, Lightbulb, ShieldAlert, Thermometer, Cpu } from "lucide-react";

const CategoryGrid = () => {
  const { data: categories, loading } = useFetch("/categories");

  // Fallback categories if database is empty/unconfigured
  const defaultCategories = [
    {
      _id: "default-1",
      name: "Lighting & Ambience",
      slug: "lighting-ambience",
      description: "Smart bulbs, neon controllers, and dimmers.",
      icon: <Lightbulb size={24} className="text-yellow-400" />,
      image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=500&q=80",
    },
    {
      _id: "default-2",
      name: "Security & Surveillance",
      slug: "security-surveillance",
      description: "Facial locks, intelligent cameras, and sensors.",
      icon: <ShieldAlert size={24} className="text-red-400" />,
      image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=80",
    },
    {
      _id: "default-3",
      name: "Climate Control",
      slug: "climate-control",
      description: "Automated thermostats and airflow systems.",
      icon: <Thermometer size={24} className="text-blue-400" />,
      image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=500&q=80",
    },
    {
      _id: "default-4",
      name: "Smart Hubs & Controllers",
      slug: "smart-hubs",
      description: "Central neural hubs and voice automation touchpoints.",
      icon: <Cpu size={24} className="text-cyan-400" />,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
    },
  ];

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  // Function to match database categories to icons
  const getIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("light") || lower.includes("ambien")) return <Lightbulb size={24} className="text-yellow-400" />;
    if (lower.includes("secur") || lower.includes("lock") || lower.includes("camera")) return <ShieldAlert size={24} className="text-red-400" />;
    if (lower.includes("temp") || lower.includes("clim") || lower.includes("thermo")) return <Thermometer size={24} className="text-blue-400" />;
    return <Cpu size={24} className="text-cyan-400" />;
  };

  if (loading && categories === null) {
    return (
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <Loader variant="spinner" />
      </div>
    );
  }

  return (
    <section className="py-20 px-6 md:px-12 bg-[#090D15]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
              Browse by Category
            </h2>
            <p className="text-gray-400 max-w-lg">
              Explore specialized environments optimized for security, mood control, energy efficiency, and central operations.
            </p>
          </div>
          <Link
            to="/products"
            className="flex items-center gap-1.5 text-primary hover:text-primary-light transition font-semibold mt-4 md:mt-0 text-sm"
          >
            <span>View All Products</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((cat, idx) => (
            <AnimatedSection
              key={cat._id}
              animation="fade-up"
              delay={idx * 0.1}
              className="group relative h-80 rounded-2xl overflow-hidden glass-card hover:border-primary/30 transition-all duration-300 flex flex-col justify-end p-6 border border-slate-800"
            >
              {/* Background image overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={cat.image || "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=80"}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-20 group-hover:opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
              </div>

              {/* Icon & Details */}
              <div className="relative z-10 flex flex-col gap-3">
                <div className="p-3 bg-slate-900/90 rounded-xl w-fit border border-slate-800 group-hover:border-primary/20 transition-all duration-300">
                  {cat.icon || getIcon(cat.name)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-2">
                    {cat.description || "Browse our selected automation modules."}
                  </p>
                </div>
                <Link
                  to={`/products?category=${cat._id}`}
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold mt-2 group-hover:translate-x-1 transition-transform"
                >
                  <span>Explore Items</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
