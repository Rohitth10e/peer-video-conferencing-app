function SideBar(){
    const sideBarItems = [
        {
            icon: "fa-video", // FontAwesome icon class
            label: "New P2P Meeting",
            desc: "Secure peer-to-peer video call",
            color: "text-green-500",
        },
        {
            icon: "fa-users",
            label: "Traditional Meeting",
            desc: "Server-based group meeting",
            color: "text-blue-500",
        },
        {
            icon: "fa-calendar-alt",
            label: "Schedule",
            desc: "Schedule a future meeting",
            color: "text-green-600",
        },
        {
            icon: "fa-desktop",
            label: "Join Meeting",
            desc: "Join with meeting ID",
            color: "text-purple-500",
        },
    ];

    const personalItems = [
        { icon: "fa-comment", label: "Chat" },
        { icon: "fa-phone", label: "Phone" },
        { icon: "fa-address-book", label: "Contacts" },
    ];

    return (
        <div className="w-64 min-h-screen bg-white border-r-1 border-zinc-100 flex flex-col p-4">
            {/* Quick Actions */}
            <section className="mb-6">
                <h2 className="text-sm font-semibold text-gray-500 mb-3">
                    Quick Actions
                </h2>
                <ul className="space-y-3">
                    {sideBarItems.map((item, idx) => (
                        <li
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                        >
                            <i className={`fas ${item.icon} ${item.color} text-lg`} />
                            <div>
                                <p className="text-sm font-medium">{item.label}</p>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Personal */}
            <section>
                <h2 className="text-sm font-semibold text-gray-500 mb-3">Personal</h2>
                <ul className="space-y-3">
                    {personalItems.map((item, idx) => (
                        <li
                            key={idx}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                        >
                            <i className={`fas ${item.icon} text-gray-600`} />
                            <span className="text-sm">{item.label}</span>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default SideBar