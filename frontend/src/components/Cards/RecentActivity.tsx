export default function RecentActivity({ scheduledMeetings, ongoingMeetings }) {
    function formatRelativeDate(isoString: string) {
        const inputDate = new Date(isoString);
        const now = new Date();

        const inputUTC = Date.UTC(
            inputDate.getUTCFullYear(),
            inputDate.getUTCMonth(),
            inputDate.getUTCDate()
        );
        const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

        const diffDays = Math.floor((nowUTC - inputUTC) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays > 2) return `${diffDays} days ago`;

        return inputDate.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    // Merge scheduled and ongoing meetings
    const upcomingMeetings = [...ongoingMeetings, ...scheduledMeetings];

    return (
        <div className="recent-activity w-1/2 mt-5 flex flex-col justify-start bg-white rounded-lg p-5">
            <div className="flex justify-between gap-44">
                <p className="font-semibold text-sm">Upcoming Meetings</p>
                <button className="font-semibold text-sm">View all</button>
            </div>
            <div className="mt-5 w-full text-sm">
                {upcomingMeetings.map((meet) => (
                    <div key={meet._id} className="mb-5 bg-zinc-50 p-2 rounded-md">
                        {/* Meeting Name */}
                        <p className="font-semibold">{meet.meeting_name.charAt(0).toUpperCase() + meet.meeting_name.slice(1)}</p>

                        {/* Badges: Date, Duration, Status */}
                        <div className="flex items-center gap-2 mt-2">
                            {/* Date */}
                            <p className="text-xs w-[72px] text-white bg-blue-500 rounded-lg px-[3px] py-[2px] text-center">
                                {formatRelativeDate(meet.createdAt)}
                            </p>

                            {/* Duration */}
                            <p className="flex gap-1 items-center text-white bg-green-600 rounded-lg px-[3px] py-[2px] text-center text-xs">
                                <i className="fas fa-clock text-xs"></i>
                                <span>{meet.duration} minutes</span>
                            </p>

                            {/* Status Badge */}
                            <p className="flex gap-1 items-center text-white bg-yellow-400 rounded-lg px-[3px] py-[2px] text-center text-xs">
                                <i className="fas fa-check-circle text-xs"></i>
                                <span>{meet.status}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
