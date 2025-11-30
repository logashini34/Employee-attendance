import { useState } from 'react';
import {
    ArrowRight,
    CheckCircle2,
    Menu,
    Globe,
    Clock,
    Share2,
    Zap,
    Phone
} from 'lucide-react';

// --- Components ---

const Navbar = () => (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-bold text-gray-800">StaffSync</span>
        </div>

        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-1 p-1">
            {['Home', 'Collection', 'Schedule', 'More'].map((item, idx) => (
                <a key={idx} href="#" className={`px-4 py-1 rounded-full text-sm font-medium ${idx === 0 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
                    {item}
                </a>
            ))}
        </div>

        <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600">
                <Globe size={16} />
                <span>EN</span>
            </button>
            <button className="md:hidden">
                <Menu size={24} />
            </button>
        </div>
    </nav>
);

const Hero = () => (
    <section className="pt-16 pb-24 text-center px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                Create employees with <br />
                <span className="text-green-500">your best choice.</span>
            </h1>
            <button className="mt-8 bg-green-500 text-white px-8 py-3 rounded-full font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-200" onClick={() => {window.location.href = "/auth/sign-in"}} >
                Get Started
            </button>
        </div>

        {/* Hero Floating Card */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl p-8 shadow-xl text-left border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Centralize all aspects of <br /> hiring management</h3>
                </div>
                <div className="mt-4 md:mt-0 max-w-sm text-xs text-gray-500">
                    Streamline HR operations, track online attendance, manage employee information, streamline recruitment processes.
                </div>
                <div className="mt-4 md:mt-0 flex gap-2">
                    {/* Placeholder App Store Buttons */}
                    <div className="bg-black text-white px-3 py-1 rounded flex items-center gap-1 text-xs cursor-pointer">
                        <span>Google Play</span>
                    </div>
                    <div className="bg-black text-white px-3 py-1 rounded flex items-center gap-1 text-xs cursor-pointer">
                        <span>App Store</span>
                    </div>
                </div>
            </div>

            {/* Logos */}
            <div className="flex flex-wrap justify-between items-center opacity-50 grayscale gap-8">
                <span className="text-xl font-bold">Agrium</span>
                <span className="text-xl font-bold">Chart</span>
                <span className="text-xl font-bold">MOTUL</span>
                <span className="text-xl font-bold">Ziebart</span>
                <span className="text-xl font-bold">Vespa</span>
            </div>
        </div>
    </section>
);

const Features = () => (
    <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Optimize your <br /> approach</h2>
            <p className="text-gray-500 max-w-lg text-sm ml-auto text-right">
                We provide your internal teams with the tools and resources they need to enhance their capabilities and enable self-service options.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <Clock size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2">Real time report</h3>
                <p className="text-sm text-gray-500 mb-4">Retrieve current HR data and generate instant reports.</p>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                    <ArrowRight size={16} />
                </button>
            </div>

            {/* Card 2 (Active) */}
            <div className="bg-green-500 p-8 rounded-3xl shadow-xl shadow-green-200 text-white transform md:-translate-y-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white mb-6">
                    <Share2 size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2">Streamlined processes</h3>
                <p className="text-sm text-green-100 mb-6">Streamline workflows by simplifying and automating HR tasks.</p>
                <button className="bg-white text-green-600 px-6 py-2 rounded-full text-sm font-bold w-full">
                    Get Started
                </button>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                    <Zap size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2">Highly efficient</h3>
                <p className="text-sm text-gray-500 mb-4">Enhance productivity through streamlined information procedures.</p>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400">
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    </section>
);

const Showcase = () => (
    <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">We make it <span className="text-green-500">easier for you</span></h2>
                <p className="text-gray-500 text-sm">Explore our wide range of powerful tools that enhance productivity.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Box */}
                <div className="bg-white rounded-3xl p-8 relative overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Easy connected with your employee</h3>
                    <p className="text-xs text-gray-500 mb-8">Effortlessly connect with employees through seamless communication.</p>

                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gray-300"></div> {/* Avatar Placeholder */}
                                    <div>
                                        <div className="text-sm font-bold">Employee Name</div>
                                        <div className="text-xs text-gray-400">HR Manager</div>
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                                    <Phone size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Box */}
                <div className="bg-white rounded-3xl p-8 relative overflow-hidden flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Monitor your access analytics</h3>
                    <p className="text-xs text-gray-500 mb-8">Keep track of your devices analytics in real-time.</p>

                    <div className="flex-1 flex justify-center items-end">
                        {/* Simple Phone Mockup */}
                        <div className="border-4 border-gray-800 border-b-0 rounded-t-3xl p-4 w-48 bg-white shadow-2xl">
                            <div className="h-1 w-12 bg-gray-200 mx-auto rounded mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-24 bg-green-50 rounded-lg flex items-end justify-around p-2 pb-0">
                                    <div className="w-2 h-10 bg-green-200 rounded-t"></div>
                                    <div className="w-2 h-16 bg-green-500 rounded-t"></div>
                                    <div className="w-2 h-8 bg-green-200 rounded-t"></div>
                                    <div className="w-2 h-12 bg-green-300 rounded-t"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

const Pricing = () => {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section className="py-20 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Budget-friendly <span className="text-green-500">pricing alternatives</span></h2>
                <div className="inline-flex bg-gray-100 rounded-full p-1">
                    <button
                        onClick={() => setIsYearly(false)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isYearly ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsYearly(true)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isYearly ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                    >
                        Yearly
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Basic Plan */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100">
                    <div className="text-sm font-bold text-gray-500 mb-4">Basic</div>
                    <div className="flex items-end gap-2 mb-6">
                        <span className="text-4xl font-bold text-gray-900">$14.00</span>
                        <span className="text-lg text-gray-400 line-through mb-1">$24.00</span>
                    </div>
                    <button className="w-full py-3 rounded-xl border border-gray-200 text-sm font-bold mb-8 hover:bg-gray-50">Get Started</button>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            Basic HR features to manage employee information
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            Suitable for organizations with limited employees
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            Access to essential analytics tools
                        </li>
                    </ul>
                </div>

                {/* Startup Plan */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 relative">
                    <div className="text-sm font-bold text-gray-500 mb-4">Startup</div>
                    <div className="flex items-end gap-2 mb-6">
                        <span className="text-4xl font-bold text-gray-900">$55.00</span>
                        <span className="text-lg text-gray-400 line-through mb-1">$75.00</span>
                    </div>
                    <button className="w-full py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold mb-8 hover:bg-gray-100">Get Started</button>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            Advanced functionalities for employee performance
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            Integration with popular HR software
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-600">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            Customizable workflows for recruitment
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
};

const Banners = () => (
    <section className="px-4 max-w-7xl mx-auto mb-20 space-y-8">
        {/* Green Banner */}
        <div className="bg-green-500 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-white">
            <div className="z-10 max-w-lg">
                <h3 className="text-2xl font-bold mb-2">Hurry check! There's something new in the custom plan 🚀</h3>
                <div className="flex flex-col gap-2 mt-4 text-sm font-medium opacity-90">
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} /> 24/7 priority customer service</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Best security</div>
                    <div className="flex items-center gap-2"><CheckCircle2 size={16} /> More incentives</div>
                </div>
                <button className="mt-8 bg-white text-green-600 px-6 py-2 rounded-full text-sm font-bold">See all details</button>
            </div>
            <div className="mt-8 md:mt-0 relative z-10">
                {/* Illustration Placeholder */}
                <div className="w-64 h-40 bg-white/20 rounded-xl flex items-center justify-center">
                    <span>Illustration Area</span>
                </div>
            </div>
        </div>

        {/* Dark Banner */}
        <div className="bg-gray-900 rounded-3xl p-8 md:p-16 relative overflow-hidden text-white flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-md z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Trust us, it will all look much easier</h2>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold">Get the app</button>
            </div>
            <div className="mt-8 md:mt-0 relative z-10 flex gap-4">
                {/* Phone Mockups Placeholder */}
                <div className="w-32 h-48 bg-gray-800 rounded-xl border border-gray-700"></div>
                <div className="w-32 h-48 bg-gray-800 rounded-xl border border-gray-700 mt-8"></div>
            </div>

            {/* Background chevron decoration */}
            <div className="absolute right-0 top-0 h-full w-1/3 bg-green-500 opacity-20 skew-x-12 transform translate-x-1/2"></div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">S</div>
                    <span className="font-bold text-gray-800">StaffSync</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    The best HR management service with the latest features and 24 hour support.
                </p>
                <div className="flex gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 cursor-pointer">
                            <Share2 size={14} />
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="font-bold mb-6">Company</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-green-500">Our roots</a></li>
                    <li><a href="#" className="hover:text-green-500">Services</a></li>
                    <li><a href="#" className="hover:text-green-500">Community</a></li>
                    <li><a href="#" className="hover:text-green-500">Career</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold mb-6">Products</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-green-500">Recruitment</a></li>
                    <li><a href="#" className="hover:text-green-500">Onboarding</a></li>
                    <li><a href="#" className="hover:text-green-500">Physiologram</a></li>
                    <li><a href="#" className="hover:text-green-500">Online attendance</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold mb-6">Links</h4>
                <ul className="space-y-4 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-green-500">Support center</a></li>
                    <li><a href="#" className="hover:text-green-500">Contact us</a></li>
                    <li><a href="#" className="hover:text-green-500">FAQs</a></li>
                    <li><a href="#" className="hover:text-green-500">Feedback</a></li>
                </ul>
            </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between text-xs text-gray-400">
            <p>© 2024 StaffSync. Copyrights and all rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#">Privacy</a>
                <a href="#">Terms of Use</a>
            </div>
        </div>
    </footer>
);

export default function LandingPage() {
    return (
        <div className="font-sans text-gray-900 bg-white">
            <Navbar />
            <Hero />
            <Features />
            <Showcase />
            <Pricing />
            <Banners />
            <Footer />
        </div>
    );

}
