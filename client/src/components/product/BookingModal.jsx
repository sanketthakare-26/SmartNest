import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Phone, MapPin, ChevronLeft, ChevronRight, CalendarDays,
  Clock, User, Mail, PhoneCall, FileText, CheckCircle2, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { schedulesApi, appointmentsApi } from "../../lib/api";
import { toast } from "sonner";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function MiniCalendar({ selectedDate, onSelectDate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-secondary transition">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-bold">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-secondary transition">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;
          const cellDate = new Date(viewYear, viewMonth, day);
          cellDate.setHours(0, 0, 0, 0);
          const isPast = cellDate < today;
          const isSelected = selectedDate && formatDate(cellDate) === selectedDate;
          const isToday = formatDate(cellDate) === formatDate(today);
          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onSelectDate(formatDate(cellDate))}
              className={cn(
                "h-8 w-full text-xs font-semibold rounded-lg transition active:scale-95",
                isPast && "text-muted-foreground/40 cursor-not-allowed",
                !isPast && !isSelected && "hover:bg-secondary/70 text-foreground",
                isSelected && "bg-primary text-primary-foreground shadow-sm",
                isToday && !isSelected && "border border-primary/40 text-primary"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const STEPS = ["Type", "Date & Time", "Your Details", "Confirmed"];
const CONSULTANCY_TYPES = [
  {
    id: "Phone Call",
    icon: Phone,
    title: "Phone Call",
    desc: "One of our consultants will call you at your preferred time to discuss your requirements.",
    color: "text-blue-500",
    bgColor: "bg-blue-50 border-blue-200",
    selectedBg: "bg-blue-500 text-white border-blue-600"
  },
  {
    id: "Physical Visit",
    icon: MapPin,
    title: "Physical Visit",
    desc: "Our expert will visit your site for a free consultation and on-site assessment.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50 border-emerald-200",
    selectedBg: "bg-emerald-500 text-white border-emerald-600"
  }
];

export function BookingModal({ isOpen, onClose, product }) {
  const [step, setStep] = useState(0);
  const [consultancyType, setConsultancyType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [bookedAppointment, setBookedAppointment] = useState(null);

  const loadSlots = useCallback(async (date) => {
    setSlotsLoading(true);
    setAvailableSlots([]);
    setSelectedSlot(null);
    try {
      const res = await schedulesApi.getAvailable(date);
      setAvailableSlots(res.slots || []);
    } catch (err) {
      console.error("Error loading slots:", err);
      setAvailableSlots([]);
      toast.error("Could not load available time slots. Please try again.");
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDate) loadSlots(selectedDate);
  }, [selectedDate, loadSlots]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setConsultancyType(null);
      setSelectedDate(null);
      setAvailableSlots([]);
      setSelectedSlot(null);
      setForm({ name: "", email: "", phone: "", notes: "" });
      setBookedAppointment(null);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const canGoNext = () => {
    if (step === 0) return !!consultancyType;
    if (step === 1) return !!selectedDate && !!selectedSlot;
    if (step === 2) return form.name.trim() && form.email.trim() && form.phone.trim();
    return false;
  };

  const handleNext = () => {
    if (canGoNext()) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!canGoNext()) return;
    setSubmitting(true);
    try {
      const res = await appointmentsApi.create({
        productName: product?.name || "SmartNest Consultation",
        productSlug: product?.slug || "general",
        consultancyType,
        date: selectedDate,
        timeSlot: selectedSlot,
        name: form.name,
        email: form.email,
        phone: form.phone,
        notes: form.notes,
      });
      setBookedAppointment(res.appointment);
      setStep(3);
    } catch (err) {
      toast.error(err.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="relative z-10 w-full max-w-md bg-card border border-border rounded-3xl shadow-lift overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="font-extrabold text-lg text-foreground">Book Consultancy</h2>
                {product && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{product.name}</p>}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-secondary transition text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Step Indicators */}
            {step < 3 && (
              <div className="px-6 pt-4 pb-0">
                <div className="flex items-center gap-2">
                  {STEPS.slice(0, 3).map((label, i) => (
                    <div key={label} className="flex items-center gap-2 flex-1">
                      <div className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition",
                        i < step ? "bg-primary text-primary-foreground" :
                        i === step ? "bg-primary/10 text-primary border border-primary/30" :
                        "bg-secondary text-muted-foreground"
                      )}>
                        {i < step ? "✓" : i + 1}
                      </div>
                      <span className={cn(
                        "text-[11px] font-semibold hidden sm:block",
                        i === step ? "text-foreground" : "text-muted-foreground"
                      )}>{label}</span>
                      {i < 2 && <div className="flex-1 h-px bg-border" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Step 0: Choose Type */}
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-muted-foreground mb-4">
                      How would you like to consult with our smart home experts?
                    </p>
                    {CONSULTANCY_TYPES.map((type) => {
                      const Icon = type.icon;
                      const isSelected = consultancyType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setConsultancyType(type.id)}
                          className={cn(
                            "w-full flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.98]",
                            isSelected ? type.selectedBg : `${type.bgColor} hover:scale-[0.99]`
                          )}
                        >
                          <div className={cn(
                            "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                            isSelected ? "bg-white/20" : "bg-white/80"
                          )}>
                            <Icon className={cn("h-5 w-5", isSelected ? "text-white" : type.color)} />
                          </div>
                          <div>
                            <p className={cn("font-bold text-sm", isSelected ? "text-white" : "text-foreground")}>{type.title}</p>
                            <p className={cn("text-xs mt-0.5 leading-relaxed", isSelected ? "text-white/80" : "text-muted-foreground")}>{type.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Step 1: Date + Time */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-5"
                  >
                    <MiniCalendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

                    {selectedDate && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-4 w-4 text-primary" />
                          <p className="text-sm font-bold text-foreground">
                            Available Slots — {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
                          </p>
                        </div>
                        {slotsLoading ? (
                          <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading slots...</span>
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div className="rounded-2xl bg-secondary/50 py-6 px-4 text-center">
                            <CalendarDays className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                            <p className="text-sm font-semibold text-muted-foreground">No slots available for this date</p>
                            <p className="text-xs text-muted-foreground mt-1">Try selecting another date</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-2">
                            {availableSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={cn(
                                  "rounded-xl border py-2 px-1 text-xs font-semibold transition active:scale-95",
                                  selectedSlot === slot
                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                    : "border-border bg-card text-foreground/80 hover:bg-secondary/60"
                                )}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: User Details */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Please provide your contact information.</p>

                    {[
                      { key: "name", label: "Full Name", icon: User, type: "text", placeholder: "e.g. Rahul Sharma" },
                      { key: "email", label: "Email Address", icon: Mail, type: "email", placeholder: "e.g. rahul@email.com" },
                      { key: "phone", label: "Phone Number", icon: PhoneCall, type: "tel", placeholder: "e.g. 9876543210" },
                    ].map(({ key, label, icon: Icon, type, placeholder }) => (
                      <div key={key} className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label} *</label>
                        <div className="relative">
                          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type={type}
                            value={form[key]}
                            onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                            placeholder={placeholder}
                            required
                            className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3.5 text-sm outline-none focus:border-primary transition"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="space-y-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes (optional)</label>
                      <div className="relative">
                        <FileText className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <textarea
                          value={form.notes}
                          onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))}
                          rows={3}
                          placeholder="Any specific requirements or questions..."
                          className="w-full rounded-xl border border-border bg-background pl-10 pr-3.5 pt-2.5 pb-2.5 text-sm outline-none focus:border-primary transition resize-none"
                        />
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="mt-2 rounded-2xl bg-secondary/50 p-4 space-y-2 text-sm border border-border">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Booking Summary</p>
                      <div className="flex items-center gap-2 text-foreground/80">
                        {consultancyType === "Phone Call" ? <Phone className="h-3.5 w-3.5 text-blue-500" /> : <MapPin className="h-3.5 w-3.5 text-emerald-500" />}
                        <span className="font-semibold">{consultancyType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/80">
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        <span>{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-foreground/80">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span className="font-semibold">{selectedSlot}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Confirmed */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                      className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-100 mx-auto"
                    >
                      <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                    </motion.div>

                    <h3 className="mt-5 text-xl font-extrabold text-foreground">Booking Confirmed!</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your consultancy appointment has been booked. We'll send a confirmation to your email shortly.
                    </p>

                    {bookedAppointment && (
                      <div className="mt-5 rounded-2xl border border-border bg-secondary/40 p-4 text-left space-y-2.5">
                        <DetailRow icon={consultancyType === "Phone Call" ? Phone : MapPin} label="Type" value={bookedAppointment.consultancyType} />
                        <DetailRow icon={CalendarDays} label="Date" value={new Date(bookedAppointment.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} />
                        <DetailRow icon={Clock} label="Time" value={bookedAppointment.timeSlot} />
                        <DetailRow icon={User} label="Name" value={bookedAppointment.name} />
                      </div>
                    )}

                    <button
                      onClick={onClose}
                      className="mt-6 w-full rounded-full bg-foreground px-6 py-3 text-sm font-bold text-background transition hover:opacity-90"
                    >
                      Done
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Nav */}
            {step < 3 && (
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-border">
                {step > 0 ? (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary transition"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {step < 2 ? (
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext()}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-sm font-bold transition",
                      canGoNext()
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-95"
                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canGoNext() || submitting}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition shadow-sm",
                      canGoNext() && !submitting
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                        : "bg-secondary text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Booking...</> : "Confirm Booking"}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="h-4 w-4 text-primary shrink-0" />
      <span className="text-muted-foreground w-12 shrink-0">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

export default BookingModal;
