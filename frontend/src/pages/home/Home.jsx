import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar, Users, BookOpen, Award,
  ChevronLeft, ChevronRight, Star,
  Clock, CheckCircle2, Globe, TrendingUp,
  MessageSquare, HelpCircle, Mail, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState(null);
  const [currentSpeaker, setCurrentSpeaker] = useState(0);
  const [rotatingText, setRotatingText] = useState("CONFERENCES");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState({
    days: 17, hours: 5, minutes: 28, seconds: 56,
  });

  const rotatingTexts = ["CONFERENCES", "WORKSHOPS", "SEMINARS", "TRAININGS", "MEETUPS"];

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = rotatingTexts.indexOf(rotatingText);
      const nextIndex = (currentIndex + 1) % rotatingTexts.length;
      setRotatingText(rotatingTexts[nextIndex]);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingText]);

  useEffect(() => {
    const targetDate = new Date("2026-06-15T00:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const speakers = [
    { name: "Dr. Elias Zerhouni", title: "Professor of Medicine", institution: "University of Algiers", image: "/src/assets/Elias Zerhouni.jpeg" },
    { name: "Prof. Khaled Bouzid", title: "Research Director", institution: "University of Oran", image: "/src/assets/Khaled Bouzid.jpg.png" },
    { name: "Dr. Sami el mekki", title: "Hospital Director", institution: "CHU Constantine", image: "/src/assets/sami el mekki.jpg" },
    { name: "Dr. Fatima Zohra Boukhemis", title: "Head of Cardiology", institution: "Mustapha Hospital Algiers", image: "/src/assets/Fatima Zohra.jpg.png" },
  ];

  const stats = [
    { icon: <Calendar className="w-6 h-6 text-blue-600" />, value: "50+", label: "Events Organized" },
    { icon: <Users className="w-6 h-6 text-blue-600" />, value: "500+", label: "Professionals" },
    { icon: <BookOpen className="w-6 h-6 text-blue-600" />, value: "100+", label: "Research Papers" },
    { icon: <Globe className="w-6 h-6 text-blue-600" />, value: "10+", label: "Institutions" },
  ];

  const steps = [
    { icon: <Globe className="w-10 h-10 text-blue-600" />, title: "Find Events", description: "Browse healthcare conferences and workshops in Algeria." },
    { icon: <BookOpen className="w-10 h-10 text-blue-600" />, title: "Register Online", description: "Secure your spot with simple online registration." },
    { icon: <Users className="w-10 h-10 text-blue-600" />, title: "Learn & Network", description: "Connect with Algerian healthcare professionals." },
    { icon: <Award className="w-10 h-10 text-blue-600" />, title: "Grow", description: "Earn certificates and enhance your medical career." },
  ];

  const testimonials = [
    { name: "Dr. Ahmed Benali", title: "General Practitioner", text: "Found great local workshops through this platform. Easy to use and very helpful.", rating: 5 },
    { name: "Dr. Salima Lounis", title: "Medical Resident", text: "Perfect for finding continuing education events in our region.", rating: 5 },
    { name: "Prof. Karim Saidi", title: "University Professor", text: "Helped me organize my first research seminar. Good platform for academics.", rating: 4 },
  ];

  const faqs = [
    { question: "How do I register for an event?", answer: "Click 'Register Now' on any event page. Fill your details and you'll get a confirmation email." },
    { question: "Are events free or paid?", answer: "We have both free and paid events. Check each event page for pricing details." },
    { question: "Can students attend these events?", answer: "Yes! Many events offer student discounts. Look for 'Student Rate' on the registration page." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-transparent to-blue-900 mix-blend-multiply" />
          {/* Background pattern or video can go here */}
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 border-blue-400 text-blue-300 font-semibold px-4 py-1 rounded-full uppercase tracking-widest text-xs">
            Connecting Healthcare
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            SCICON <span className="text-blue-500">{rotatingText}</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 font-light max-w-2xl mx-auto leading-relaxed">
            Algeria's leading platform for clinical education, medical research, and professional networking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-lg rounded-full transition-all hover:scale-105 active:scale-95">
              Explore Events <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 h-12 text-lg rounded-full">
              About Us
            </Button>
          </div>
        </div>
      </section>

      {/* Countdown / Next Event Section */}
      <section className="relative z-20 -mt-16 px-4 mb-20">
        <Card className="max-w-5xl mx-auto border-none shadow-2xl bg-white overflow-hidden">
          <div className="grid md:grid-cols-3">
            <div className="md:col-span-1 bg-blue-600 p-8 text-white flex flex-col justify-center">
              <Badge className="w-fit mb-4 bg-white/20 hover:bg-white/20 font-bold border-none text-white">UPCOMING EVENT</Badge>
              <h3 className="text-2xl font-bold mb-2">Health Innovation Summit 2026</h3>
              <p className="text-blue-100 mb-4 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Jan 15-17, 2026</p>
              <Button className="w-fit bg-white text-blue-600 hover:bg-blue-50 font-bold">Register Now</Button>
            </div>
            <div className="md:col-span-2 p-8 bg-white flex flex-col justify-center">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">Countdown to Registration Deadline</h4>
              <div className="grid grid-cols-4 gap-4 text-center">
                {[
                  { value: timeLeft.days, label: "Days" },
                  { value: timeLeft.hours, label: "Hrs" },
                  { value: timeLeft.minutes, label: "Min" },
                  { value: timeLeft.seconds, label: "Sec" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="text-3xl md:text-5xl font-black text-slate-900 tabular-nums">{String(item.value).padStart(2, '0')}</div>
                    <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-tighter mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="flex justify-center mb-4 transition-transform group-hover:scale-110">
                  {stat.icon}
                </div>
                <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">The Platform</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">How SciCon Works</h3>
        </div>

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 bg-white">
              <CardContent className="pt-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 mb-6 font-bold text-blue-600">
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold mb-3 text-slate-900">{step.title}</h4>
                <p className="text-slate-500 leading-relaxed text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Speakers Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-left">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Speakers</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">Algerian Medical Experts & Keynotes</h3>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              Connecting you with distinguished professors and researchers from the top medical institutions across Algeria.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => setCurrentSpeaker((prev) => (prev - 1 + speakers.length) % speakers.length)} variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-200">
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button onClick={() => setCurrentSpeaker((prev) => (prev + 1) % speakers.length)} variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-200">
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md">
            <Card className="border-none shadow-2xl overflow-hidden bg-white">
              <img
                src={speakers[currentSpeaker].image || "/placeholder.svg"}
                alt={speakers[currentSpeaker].name}
                className="w-full h-[450px] object-cover object-top"
              />
              <div className="p-8 text-center bg-white">
                <h4 className="text-2xl font-bold text-slate-900 mb-1">{speakers[currentSpeaker].name}</h4>
                <p className="text-blue-600 font-semibold mb-2">{speakers[currentSpeaker].title}</p>
                <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{speakers[currentSpeaker].institution}</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 text-center mb-16">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">Testimonials</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Voices From the Field</h3>
        </div>

        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="border-none shadow-md bg-white p-8 relative overflow-hidden group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg mr-4">
                  {t.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-900">{t.name}</div>
                  <div className="text-xs text-slate-400 font-semibold uppercase mb-1">{t.institution || t.title}</div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200 fill-slate-200"}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-slate-600 italic leading-relaxed font-medium">"{t.text}"</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Area */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-[0.2em] mb-4">FAQ</h2>
            <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Any Questions?</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300">
                <button
                  className="w-full flex items-center justify-between p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-slate-900">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="p-6 bg-white text-slate-500 leading-relaxed border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-blue-600 text-white relative flex overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-black mb-6 tracking-tight">Stay Updated on Algerian Medical Research</h3>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Join our medical community and receive the latest conference alerts and research calls directly in your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }}>
            <Input
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-100 h-12 rounded-full px-6"
              placeholder="Your email address"
              type="email"
              required
            />
            <Button className="bg-white text-blue-600 hover:bg-slate-100 font-bold px-8 h-12 rounded-full whitespace-nowrap">
              Subscribe Now
            </Button>
          </form>
        </div>
      </section>

      {/* Footer Minimalist */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-black tracking-tighter text-slate-900">SCICON</div>
          <div className="flex gap-8 text-sm font-bold text-slate-400">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
            <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
            <Link to="/legal" className="hover:text-blue-600 transition-colors">Legal</Link>
          </div>
          <div className="text-sm font-bold text-slate-400">
            © {new Date().getFullYear()} SciCon Media. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

// Simple internal component since Badge might be missing
function Badge({ children, className, variant }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
}

// Simple internal component for ChevronDown since it was missing in my thought process imports but used in JSX
function ChevronDown({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}