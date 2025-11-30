import {
    Home,
    Users,
    BarChart3,
    Calendar,
    LogOut,
    Check,
    BellRing,
} from "lucide-react";
import { useEffect, useState } from "react";

export const ManagerSidebar: React.FC = () => {
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [amPm, setAmPm] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let h = now.getHours();
            const m = now.getMinutes();

            const ampm = h >= 12 ? "PM" : "AM";
            h = h % 12 || 12;

            setHours(String(h).padStart(2, "0"));
            setMinutes(String(m).padStart(2, "0"));
            setAmPm(ampm);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <aside className="h-full w-20 flex flex-col items-center bg-white py-8 pt-4">
            {/* Logo */}
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mb-12">
                <div className="w-4 h-4 bg-white rounded-tr-lg rounded-bl-lg" />
            </div>

            {/* Nav icons */}
            <nav className="flex-1 flex flex-col gap-8 w-full items-center">
                {/* Dashboard active */}
                <button className="text-indigo-600 p-2 rounded-xl bg-indigo-50">
                    <Home size={24} strokeWidth={2.5} />
                </button>

                {/* Team / Employees */}
                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Users size={24} />
                </button>

                {/* Reports / Analytics */}
                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <BarChart3 size={24} />
                </button>

                {/* Calendar / Scheduling */}
                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Calendar size={24} />
                </button>
            </nav>

            {/* Clock + Logout */}
            <div className="flex flex-col items-center gap-6 mt-auto">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-800 leading-none">
                        {hours}:{minutes}
                    </span>
                    <span className="text-[9px] text-gray-500 font-medium leading-none mt-0.5">
                        {amPm}
                    </span>
                </div>

                <button
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/auth/sign-in";
                    }}
                >
                    <LogOut size={24} />
                </button>
            </div>
        </aside>
    );
};

interface ManagerNavbarProps {
    title?: string;
    date?: string;
    userName?: string;
    userAvatarUrl?: string;
    hasNotification?: boolean;
    subtitleLeft?: string;  // e.g. "Today's overview"
    subtitleRight?: string; // e.g. "Manager · Admin"
}

export const ManagerNavbar: React.FC<ManagerNavbarProps> = ({
    title = "Employee Attendance",
    date,
    userName = "Manager",
    userAvatarUrl = `https://placehold.co/500x500?text=M`,
    hasNotification = false,
    subtitleLeft = "Team attendance and workforce overview",
    subtitleRight = "Manager · Admin",
}) => {
    const today =
        date ||
        new Date().toLocaleDateString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    return (
        <div className="w-full bg-white px-8 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left: title + date */}
            <div className="flex flex-col gap-1">
                <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    {title}
                </h1>
                <p className="text-xs text-slate-400">{subtitleLeft}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{today}</span>
                </div>
            </div>

            {/* Right: notifications + profile */}
            <div className="flex items-center gap-6 md:gap-8 ml-auto md:ml-0">
                <button className="relative p-1 hover:bg-slate-50 rounded-full transition-colors group">
                    <BellRing className="w-6 h-6 text-slate-600 group-hover:text-slate-800" strokeWidth={2} />
                    {hasNotification && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full" />
                    )}
                </button>

                <div className="flex items-center gap-3 pl-4 pr-2 py-1 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full cursor-pointer">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">
                            {userName}
                        </span>
                        <span className="text-[10px] text-slate-400">{subtitleRight}</span>
                    </div>
                    <img
                        src={userAvatarUrl}
                        alt={userName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-white"
                    />
                    <Check className="w-4 h-4 text-slate-500" strokeWidth={2} />
                </div>
            </div>
        </div>
    );
};
