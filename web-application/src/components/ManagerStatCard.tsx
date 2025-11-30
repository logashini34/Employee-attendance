import { ArrowUpRight } from "lucide-react";

interface ManagerStatCardProps {
    label: string;
    value: number | string;
    accentColor?: string; // tailwind color class
    subtitle?: string;
}

export default function ManagerStatCard({
    label,
    value,
    accentColor = "bg-emerald-50 text-emerald-600",
    subtitle = "For today",
}: ManagerStatCardProps) {
    return (
        <div className="bg-white rounded-xl px-6 py-5 border border-slate-100 flex flex-col gap-3">
            <p className="text-sm text-slate-500 font-medium">{label}</p>
            <p className="text-3xl font-semibold text-slate-900">{value}</p>

            <div className={`inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full w-fit ${accentColor}`}>
                <ArrowUpRight size={14} />
                <span>12.97%</span>
            </div>

            <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
        </div>
    );
}
