import Nav from "../../components/navbar/Nav.tsx";
import SideBar from "../../components/sidebar/Sidebar.tsx";
import { useUser } from "../../context/UserContext.tsx";
import BannerCard from "../../components/banner_cards/BannerCard.tsx";

function Dashboard() {
    const { user } = useUser();

    const setTime = () => {
        const date = new Date();
        const hours = date.getHours(); // 0–23

        if (hours < 12) {
            return "Good Morning";
        } else if (hours === 12) {
            return "Good Noon";
        } else if (hours < 18) {
            return "Good Afternoon";
        } else {
            return "Good Evening";
        }
    };



    const BannerCardItems = [
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

    return (
        <div className="w-full h-screen bg-blue-50 flex flex-col">
            {/* Top Navbar */}
            <Nav />

            {/* Main Content Layout */}
            <div className="flex flex-1">
                {/* Sidebar (left) */}
                <SideBar />

                {/* Main Section (right) */}
                <div className="flex-1 py-8 px-20 tracking-tighter overflow-y-auto">
                    {/* Greeting */}
                    <h1 className="text-2xl font-semibold mb-1">
                        { setTime() }, {user?.name ?? "User"}!
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Choose between traditional meetings or secure P2P video calls.
                    </p>

                    {/* Banner Section */}
                    <div className="banner flex items-center gap-5 py-5 px-6 mt-5 border border-blue-200 bg-blue-100 w-full rounded-lg shadow-sm">
                        {/* Icon */}
                        <div className="bg-blue-500 text-white p-3 rounded-md">
                            <i className="fas fa-shield-alt"></i>
                        </div>

                        {/* Text */}
                        <div className="flex-1">
                            <h3 className="text-md font-semibold">New: P2P Video Meetings</h3>
                            <p className="text-gray-600 text-sm">
                                End-to-end encrypted, direct peer connections with no server
                                storage.
                            </p>
                        </div>

                        {/* Button */}
                        <button className="bg-blue-500 hover:bg-blue-400 transition text-white px-4 py-2 rounded-md text-sm">
                            Try P2P Now
                        </button>
                    </div>

                    {/* Banner cards */}
                    <div className='flex justify-between gap-2'>
                        {BannerCardItems.map((item) => (
                            <BannerCard icon={item.icon} desc={item.desc} label={item.label} color={item.color} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
