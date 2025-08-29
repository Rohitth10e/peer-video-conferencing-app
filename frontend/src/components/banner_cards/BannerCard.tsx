import React from "react";

type BannerCardProps = {
    icon: string;
    label: string;
    desc: string;
    color?: string; // optional, in case some icons don’t need custom colors
};

const BannerCard: React.FC<BannerCardProps> = ({ icon, label, desc, color }) => {
    return (
        <div className="card tracking-tighter bg-white p-6 mt-10 w-[280px] flex flex-col items-center border border-zinc-200 rounded-lg hover:shadow-md transition-all duration-200">
            {/* Icon */}
            <div className="pb-3">
                <i className={`fas ${icon} ${color ?? "text-gray-600"} text-3xl`} />
            </div>

            {/* Label & Description */}
            <div className="text-center">
                <h4 className="text-md font-semibold">{label}</h4>
                <p className="text-zinc-500 text-sm">{desc}</p>
            </div>
        </div>
    );
};

export default BannerCard;
