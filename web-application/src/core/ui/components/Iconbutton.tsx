export default function IconButton({ icon, label }: { icon: string, label: string }) {
    return <button className="w-full px-6 py-5 border border-gray-500 transition-base active:bg-gray-200 hover:bg-gray-100 flex items-center gap-4 text-sm cursor-pointer rounded-full">
        <img className="w-6" src={icon} alt={label} />
        <p>{label}</p>
    </button>
}