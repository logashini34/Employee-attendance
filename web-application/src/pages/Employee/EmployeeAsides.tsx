import { Home, User, Calendar, LogOut, Check, BellRing } from "lucide-react";
import { useState, useEffect } from "react";

export const DashboardSidebar: React.FC = () => {
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
        <aside className="h-full w-20 flex flex-col items-center bg-white py-8 pt-4 ">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mb-12 ">
                <div className="w-4 h-4 bg-white rounded-tr-lg rounded-bl-lg"></div>
            </div>

            <nav className="flex-1 flex flex-col gap-8 w-full items-center">
                <button className="text-indigo-600 p-2 rounded-xl bg-indigo-50">
                    <Home size={24} strokeWidth={2.5} />
                </button>
                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <User size={24} />
                </button>
                <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Calendar size={24} />
                </button>
            </nav>

            <div className="flex flex-col items-center gap-6 mt-auto">
                <div className="flex flex-col items-center justify-center w-12 h-12 bg-gray-50 rounded-xl">
                    <span className="text-xs font-bold text-gray-800 leading-none">
                        {hours}:{minutes}
                    </span>
                    <span className="text-[9px] text-gray-500 font-medium leading-none mt-0.5">
                        {amPm}
                    </span>
                </div>

                <button className="text-gray-400 hover:text-red-500 transition-colors" onClick={() => {
                    localStorage.clear();
                    window.location.href = "/auth/sign-in"
                }} >
                    <LogOut size={24} />
                </button>
            </div>
        </aside>
    );
};

interface NavbarProps {
    date?: string;
    shiftName?: string;
    shiftTime?: string;
    userName?: string;
    userAvatarUrl?: string;
    hasNotification?: boolean;
}

export const DashboardNavbar: React.FC<NavbarProps> = ({
    date,
    shiftName,
    shiftTime,
    userName,
    userAvatarUrl,
    hasNotification,
}) => {
    return (
        <div className="w-full bg-white px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
                <div className="flex flex-col gap-1 cursor-pointer group">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        Attendance
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-800 font-bold text-lg leading-none group-hover:text-blue-600 transition-colors">
                            {date}
                        </span>
                        <Calendar className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" strokeWidth={2} />
                    </div>
                </div>

                <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>

                <div className="flex flex-col gap-1 cursor-pointer group">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                        {shiftName}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-bold text-lg leading-none group-hover:text-blue-600 transition-colors">
                            {shiftTime}
                        </span>
                        <Check className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" strokeWidth={2} />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 md:gap-8 ml-auto md:ml-0">
                <button className="relative p-1 hover:bg-slate-50 rounded-full transition-colors group">
                    <BellRing className="w-6 h-6 text-slate-600 group-hover:text-slate-800" strokeWidth={2} />
                    {hasNotification && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                    )}
                </button>

                <div className="flex items-center gap-3 pl-4 pr-1 py-1 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full cursor-pointer">
                    <span className="text-sm font-semibold text-slate-700">{userName}</span>
                    <img
                        src={userAvatarUrl}
                        alt={userName}
                        className="w-9 h-9 rounded-full object-cover border-2 border-white"
                    />
                </div>
            </div>
        </div>
    );
};