import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, MapPin, Phone, Mail, Users, CheckSquare, Award, Menu, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

// --- DATA (Same as before) ---
const services = [
  {
    icon: <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"><Briefcase className="w-8 h-8 text-green-800" /></div>,
    title: "Garden Pods & Offices",
    description: "Custom-designed garden rooms and pods, perfect for home offices, studios, or extra living space.",
  },
  {
    icon: <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"><Briefcase className="w-8 h-8 text-green-800" /></div>,
    title: "Driveway Extensions",
    description: "High-quality paving and extensions to enhance your property's curb appeal and functionality.",
  },
  {
    icon: <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"><Briefcase className="w-8 h-8 text-green-800" /></div>,
    title: "Landscape & Design",
    description: "Comprehensive landscape architecture and construction, from patios to complete garden makeovers.",
  },
  {
    icon: <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"><Briefcase className="w-8 h-8 text-green-800" /></div>,
    title: "General Renovations",
    description: "Expert interior and exterior renovations, extensions, and refurbishments for modern living.",
  },
];
const projects = [
    { id: 1, title: 'Modern Garden Office', region: 'Dublin', imageUrl: 'g_pods.png', service: 'Garden Pods' },
    { id: 2, title: 'Sandstone Driveway', region: 'Cork', imageUrl: 'Driveway.png', service: 'Driveways' },
    { id: 3, title: 'Coastal Landscaping', region: 'Galway', imageUrl: 'landscaping.png', service: 'Landscaping' },
    { id: 4, title: 'Kitchen Extension', region: 'Limerick', imageUrl: 'renovations.png', service: 'Renovations' },
    { id: 5, title: 'City Patio Project', region: 'Dublin', imageUrl: 'dublin_landscaping.png', service: 'Landscaping' },
    { id: 6, title: 'Kildare Home Refurbishment', region: 'Kildare', imageUrl: 'kildare_renovation.png', service: 'Renovations' },
];
const testimonials = [
    { quote: "Caleb Construction built our dream garden office ahead of schedule. The craftsmanship is outstanding. Highly recommended!", name: "John & Mary R.", region: "Dublin" },
    { quote: "Our new driveway is stunning and has completely transformed the front of our house. The team was professional and tidy.", name: "David L.", region: "Cork" },
    { quote: "From design to completion, their landscaping service was impeccable. They listened to our ideas and brought them to life beautifully.", name: "Sarah K.", region: "Galway" }
];

// --- COMPONENTS ---

const AnimatedCounter = ({ target }: { target: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    let start = 0;
                    const end = target;
                    if (start === end) return;
                    let duration = 2000;
                    let increment = end / (duration / 10);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.ceil(start));
                        }
                    }, 10);
                }
            },
            { threshold: 0.5 }
        );
        const currentRef = ref.current;
        if (currentRef) observer.observe(currentRef);
        return () => { if (currentRef) observer.unobserve(currentRef); };
    }, [target]);

    return <span ref={ref} className="text-4xl md:text-5xl font-bold text-green-600">{count}+</span>;
};

type FormErrors = {
    fullName?: string[];
    email?: string[];
    message?: string[];
};

const ContactForm = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');
    const [responseMessage, setResponseMessage] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setErrors({});
        setResponseMessage('');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setStatus('error');
                setResponseMessage(data.message || 'An error occurred.');
                if (data.errors) setErrors(data.errors);
            } else {
                setStatus('success');
                setResponseMessage(data.message);
                setFormData({ fullName: '', email: '', message: '' });
            }
        } catch (err) {
            setStatus('error');
            setResponseMessage('Failed to connect to the server. Please try again later.');
            console.error(err);
        }
    };
    
    if (status === 'success') {
        return (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-green-50 rounded-lg h-full">
                <CheckCircle className="w-16 h-16 text-green-600 mb-4"/>
                <h3 className="text-xl font-semibold text-gray-800">Message Sent!</h3>
                <p className="text-gray-600 mt-2">{responseMessage}</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 transition`} placeholder="John Doe" required />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName[0]}</p>}
            </div>
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 transition`} placeholder="you@example.com" required />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
            </div>
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" rows={5} value={formData.message} onChange={handleChange} className={`w-full px-4 py-3 rounded-lg border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:ring-green-500 focus:border-green-500 transition`} placeholder="Tell us about your project..." required></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message[0]}</p>}
            </div>
            
            {status === 'error' && (
                 <div className="flex items-center p-3 bg-red-50 text-red-700 rounded-lg">
                    <AlertTriangle className="w-5 h-5 mr-2"/>
                    <p className="text-sm">{responseMessage}</p>
                </div>
            )}

            <button type="submit" disabled={status === 'loading'} className="w-full bg-green-700 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-800 transition-colors duration-300 transform hover:scale-105 shadow-md flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed">
                {status === 'loading' ? <Loader2 className="animate-spin" /> : 'Send Message'}
            </button>
        </form>
    )
}

// --- MAIN APP COMPONENT ---

export default function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showCookieBanner, setShowCookieBanner] = useState(true);

    const smoothScroll = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
    };

    return (
        <>
            {/* --- SVG FILTER FOR NEW GLASS EFFECT --- */}
            <svg style={{ display: 'none' }}>
              <filter id="container-glass" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence type="fractalNoise" baseFrequency="0.008 0.008" numOctaves="2" seed="92" result="noise" />
                <feGaussianBlur in="noise" stdDeviation="0.02" result="blur" />
                <feDisplacementMap in="SourceGraphic" in2="blur" scale="77" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </svg>

            {/* --- CSS FOR NEW GLASS EFFECT --- */}
            <style jsx="true" global="true">{`
                .glassHeader {
                  position: fixed;
                  top: 16px;
                  left: 50%;
                  transform: translateX(-50%);
                  width: calc(100% - 32px);
                  max-width: 1200px;
                  z-index: 50;
                  border-radius: 999px;
                }
                .glassHeader::before, .mobile-glass-menu::before {
                  content: '';
                  position: absolute;
                  inset: 0;
                  z-index: -2;
                  border-radius: 999px;
                  background-color: rgb(255 255 255 / 10%);
                  box-shadow: inset 2px 2px 0px -2px rgba(255, 255, 255, 0.7), inset 0 0 3px 1px rgba(255, 255, 255, 0.7);
                }
                .glassHeader::after, .mobile-glass-menu::after {
                  content: '';
                  position: absolute;
                  z-index: -1;
                  inset: 0;
                  border-radius: 999px;
                  backdrop-filter: blur(8px);
                  -webkit-backdrop-filter: blur(8px);
                  filter: url(#container-glass);
                  -webkit-filter: url(#container-glass);
                  isolation: isolate;
                  overflow: hidden;
                }
                .glassHeader a {
                   color: white;
                   font-weight: 500;
                   transition: color 0.3s;
                   text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
                .glassHeader a:hover {
                    color:hsl(101, 90.20%, 40.00%);
                }
                .mobile-glass-menu {
                    position: absolute;
                    left: 0;
                    top: 100%;
                    width: 100%;
                    border-radius: 20px;
                    margin-top: 8px;
                }
                .mobile-glass-menu::before {
                    border-radius: 20px;
                }
                .mobile-glass-menu::after {
                    border-radius: 20px;
                }
                .mobile-glass-menu a {
                    color: white;
                    font-weight: 500;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
                #hero {
                  animation: moveBackground 60s linear infinite;
                }
                @keyframes moveBackground {
                  from {
                    background-position: 0% 0%;
                  }
                  to {
                    background-position: 0% -1000%;
                  }
                } 
            `}</style>
            
            <div className="bg-gray-50 text-gray-800 font-sans">
                {/* --- HEADER UPDATED TO USE PILL SHAPE --- */}
                <header className="glassHeader">
                    <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                        <div className="flex items-center justify-between h-16">
                             <a href="#" onClick={smoothScroll('hero')} className="flex items-center">
                                 <img src="/logo.png" alt="Caleb Construction Limited Logo" className="h-55 w-auto" />
                             </a>
                            <nav className="hidden lg:flex items-center space-x-8">
                                <a href="#services" onClick={smoothScroll('services')}>Services</a>
                                <a href="#projects" onClick={smoothScroll('projects')}>Projects</a>
                                <a href="#about" onClick={smoothScroll('about')}>About Us</a>
                                <a href="#contact" onClick={smoothScroll('contact')}>Contact</a>
                            </nav>
                            <a href="#contact" onClick={smoothScroll('contact')} className="hidden lg:inline-block bg-white/20 text-white font-semibold px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 border border-white/30">
                                Get a Quote
                            </a>
                            <div className="lg:hidden">
                                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
                                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {isMenuOpen && (
                        <div className="lg:hidden mobile-glass-menu">
                            <nav className="flex flex-col items-center space-y-4 py-8 relative z-10">
                                <a href="#services" onClick={smoothScroll('services')} className="text-lg">Services</a>
                                <a href="#projects" onClick={smoothScroll('projects')} className="text-lg">Projects</a>
                                <a href="#about" onClick={smoothScroll('about')} className="text-lg">About Us</a>
                                <a href="#contact" onClick={smoothScroll('contact')} className="text-lg">Contact</a>
                                <a href="#contact" onClick={smoothScroll('contact')} className="mt-4 bg-white/20 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/30 border border-white/30">
                                    Get a Quote
                                </a>
                            </nav>
                        </div>
                    )}
                </header>

                {/* --- THE REST OF THE PAGE REMAINS THE SAME --- */}
                <main>
                    <section id="hero" className="relative h-screen flex items-center justify-center pt-20" style={{ backgroundImage: "url(hero-background.jpg)", backgroundSize: '400px' }}>
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 text-center text-white px-4">
                            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>Building Ireland's Future, One Project at a Time.</h1>
                            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-white" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>Expert craftsmanship in renovations, garden pods, and landscaping across Ireland.</p>
                            <a href="#contact" onClick={smoothScroll('contact')} className="bg-green-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                Request a Consultation
                            </a>
                        </div>
                    </section>
                    <section id="services" className="py-20 md:py-28 bg-white">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Services</h2>
                                <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">From concept to completion, we deliver excellence in every detail.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {services.map((service, index) => (
                                    <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center">
                                        {service.icon}
                                        <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-800">{service.title}</h3>
                                        <p className="text-gray-600">{service.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="about" className="py-20 md:py-28 bg-gray-50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Why Choose Caleb Construction?</h2>
                                <p className="text-gray-600 mb-8 text-lg">With over 20 years of experience serving communities across Ireland, we've built our reputation on a foundation of trust, quality, and unwavering commitment to client satisfaction. Our heritage is Irish, and our standards are international.</p>
                                <div className="space-y-4">
                                    <div className="flex items-start"><CheckSquare className="w-6 h-6 text-green-600 mr-4 mt-1 flex-shrink-0" /><div><h4 className="font-semibold text-lg">Uncompromising Quality</h4><p className="text-gray-600">We use only the finest materials and employ skilled craftspeople to ensure a finish that lasts.</p></div></div>
                                    <div className="flex items-start"><Users className="w-6 h-6 text-green-600 mr-4 mt-1 flex-shrink-0" /><div><h4 className="font-semibold text-lg">Client-Centric Approach</h4><p className="text-gray-600">Your vision is our blueprint. We collaborate closely with you at every stage of the project.</p></div></div>
                                    <div className="flex items-start"><Award className="w-6 h-6 text-green-600 mr-4 mt-1 flex-shrink-0" /><div><h4 className="font-semibold text-lg">Local Irish Expertise</h4><p className="text-gray-600">We understand the local landscape, regulations, and aesthetic, ensuring a seamless project flow.</p></div></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-8 text-center p-8 bg-white rounded-xl shadow-lg">
                                <div><AnimatedCounter target={150} /><p className="text-gray-600 mt-2">Projects Completed</p></div>
                                <div><AnimatedCounter target={20} /><p className="text-gray-600 mt-2">Years of Experience</p></div>
                                <div><AnimatedCounter target={98} /><p className="text-gray-600 mt-2">Client Satisfaction (%)</p></div>
                                <div><AnimatedCounter target={4} /><p className="text-gray-600 mt-2">Core Service Areas</p></div>
                            </div>
                        </div>
                    </section>
                    <section id="projects" className="py-20 md:py-28 bg-white">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Recent Work</h2>
                                <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">A portfolio of craftsmanship and quality across Ireland.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {projects.map((project) => (
                                    <div key={project.id} className="group relative overflow-hidden rounded-xl shadow-lg">
                                        <img src={project.imageUrl} alt={project.title} className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                        <div className="absolute bottom-0 left-0 p-6 text-white">
                                            <span className="text-sm bg-green-600 px-2 py-1 rounded">{project.region}</span>
                                            <h3 className="text-xl font-bold mt-2">{project.title}</h3>
                                            <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">{project.service}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="testimonials" className="py-20 md:py-28 bg-green-800 text-white">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold">What Our Clients Say</h2>
                                <p className="text-lg text-green-200 mt-4 max-w-2xl mx-auto">Our reputation is built on the words of our satisfied customers.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {testimonials.map((testimonial, index) => (
                                    <div key={index} className="bg-white/10 p-8 rounded-xl backdrop-blur-sm">
                                        <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                                        <div className="font-bold text-right">
                                            <span className="block">{testimonial.name}</span>
                                            <span className="text-sm text-green-200">{testimonial.region}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section id="contact" className="py-20 md:py-28 bg-gray-50">
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Get in Touch</h2>
                                <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">Ready to start your next project? Contact us today for a free, no-obligation quote.</p>
                            </div>
                            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-xl shadow-lg">
                                <ContactForm />
                                <div className="flex flex-col justify-center">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h3>
                                    <div className="space-y-4 text-gray-600">
                                        <div className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-green-600" /><span>Serving Dublin, Cork, Galway & all of Ireland</span></div>
                                        <div className="flex items-center"><Phone className="w-5 h-5 mr-3 text-green-600" /><a href="tel:+353123456789" className="hover:text-green-800">+353 123 456 789</a></div>
                                        <div className="flex items-center"><Mail className="w-5 h-5 mr-3 text-green-600" /><a href="mailto:contact@calebconstruction.ie" className="hover:text-green-800">contact@calebconstruction.ie</a></div>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">Google Map of Ireland Centered Here</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                 <footer className="bg-gray-800 text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div><h4 className="text-lg font-semibold mb-4">Caleb Construction</h4><p className="text-gray-400">Quality and craftsmanship you can trust. Building across Ireland with pride and precision.</p></div>
                            <div><h4 className="text-lg font-semibold mb-4">Quick Links</h4><ul className="space-y-2"><li><a href="#services" onClick={smoothScroll('services')} className="text-gray-400 hover:text-white">Services</a></li><li><a href="#projects" onClick={smoothScroll('projects')} className="text-gray-400 hover:text-white">Projects</a></li><li><a href="#about" onClick={smoothScroll('about')} className="text-gray-400 hover:text-white">About</a></li><li><a href="#contact" onClick={smoothScroll('contact')} className="text-gray-400 hover:text-white">Contact</a></li></ul></div>
                            <div><h4 className="text-lg font-semibold mb-4">Our Services</h4><ul className="space-y-2">{services.slice(0, 4).map(s => (<li key={s.title}><a href="#services" onClick={smoothScroll('services')} className="text-gray-400 hover:text-white">{s.title}</a></li>))}</ul></div>
                            <div><h4 className="text-lg font-semibold mb-4">Follow Us</h4><div className="flex space-x-4"><a href="#" className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.494v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></a><a href="#" className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919 4.919 1.266.058 1.644.07 4.85.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg></a></div></div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm"><p>&copy; {new Date().getFullYear()} Caleb Construction Limited. All Rights Reserved. | <a href="#" className="hover:text-white">Privacy Policy</a></p></div>
                    </div>
                </footer>
                {showCookieBanner && (
                     <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-sm text-white p-4 z-50">
                        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
                            <p className="text-sm mb-4 md:mb-0">This website uses cookies to ensure you get the best experience. By continuing to browse, you agree to our <a href="#" className="underline hover:text-green-300">Privacy Policy</a>.</p>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => setShowCookieBanner(false)} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm">Decline</button>
                                <button onClick={() => setShowCookieBanner(false)} className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-sm font-semibold">Accept</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
