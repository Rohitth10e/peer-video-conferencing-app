import { useUser } from "../../context/UserContext"

function Nav() {
    const navItems = [
        { label: "Home", href: "/" },
        { label: "Meetings", href: "/meetings" },
        { label: "Team Chat", href: "/chat" },
    ]

    const { user } = useUser()
    const username = user?.username || "User"
    const initials = user?.name
        ?.split(" ")
        .map((word) => word[0]?.toUpperCase())
        .join("")

    return (
        <nav className="w-full h-20 grid grid-cols-3 items-center px-6 border-b border-zinc-200 bg-white text-zinc-700 tracking-tight">
            {/* Left: Logo */}
            <div className="flex items-center">
                <h3 className="font-semibold text-xl text-blue-600">PeerLink</h3>
            </div>

            {/* Center: Nav Links */}
            <ul className="flex justify-center gap-6">
                {navItems.map((item, idx) => (
                    <li key={idx}>
                        <a
                            href={item.href}
                            className="px-3 py-2 rounded-md hover:text-blue-500 hover:bg-blue-100 transition"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>

            {/* Right: Search + Settings + Avatar */}
            <div className="flex justify-end items-center gap-4">
                <div className="flex items-center gap-2 bg-transparent px-3 py-1.5 rounded-md focus-within:ring-2 focus-within:ring-blue-400">
                    <span className="fas fa-search text-zinc-500"></span>
                    <input
                        type="search"
                        placeholder="Search"
                        className="bg-transparent outline-none text-sm text-zinc-700 placeholder:text-zinc-400"
                    />
                </div>

                <span className="fas fa-gear text-zinc-600"></span>
                <span className="hidden sm:inline">{username}</span>

                <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-semibold cursor-pointer">
                    {initials || "U"}
                </div>
            </div>
        </nav>
    )
}

export default Nav
