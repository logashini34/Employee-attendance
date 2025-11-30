import { type LucideProps } from "lucide-react";
import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactElement<LucideProps>
}

export default function StatCard({ title, value, icon }: StatCardProps) {
    return <div className="flex items-center px-6 py-4 bg-white border border-gray-100 rounded-lg hover:shadow-lg transition-shadow duration-200 gap-2">
        {/* Icon Container */}
        <div className="flex items-center justify-center w-12 h-12 mr-4 text-gray-700 bg-gray-100 rounded-xl">
            {/* We clone the element to ensure consistent sizing if not passed in props */}
            {React.cloneElement(icon, { size: 24, strokeWidth: 2 })}
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-500 mb-0.5">
                {title}
            </span>
            <span className="text-2xl font-bold text-gray-900 tracking-tight quicksand">
                {value}
            </span>
        </div>
    </div>
}