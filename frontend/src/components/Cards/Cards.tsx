export function Cards({ icon, text, color, desc }) {
    const colorMap = {
        green: { bg: 'bg-green-400', text: 'text-white' },
        blue: { bg: 'bg-blue-400', text: 'text-white' },
        purple: { bg: 'bg-purple-400', text: 'text-white' },
        gray: { bg: 'bg-gray-400', text: 'text-white' },
    };

    const { bg, text: iconText } = colorMap[color] || colorMap.gray;

    return (
        <div className="card w-[280px] h-[190px] border border-zinc-300 rounded-md p-4 text-center flex flex-col gap-8 bg-white">
            <div>
                <div className={`inline-block px-2 py-1 rounded-md ${bg}`}>
                    <i className={`fas ${icon} ${iconText} text-md`}></i>
                </div>
                <div className="mt-4">
                    <p className="font-semibold tracking-tight text-md">{text}</p>
                </div>
            </div>
            <div>
                <p className="text-xs text-zinc-500 font-semibold">{desc}</p>
            </div>
        </div>
    );
}