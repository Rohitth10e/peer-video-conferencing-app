export default function PastMeetings({meeting}) {
    console.log(meeting[0]);
    function formatRelativeDate(isoString: string) {
        const inputDate = new Date(isoString);
        const now = new Date();

        // Use UTC year, month, date to avoid timezone issues
        const inputUTC = Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate());
        const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

        const diffDays = Math.floor((nowUTC - inputUTC) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays > 2) return `${diffDays} days ago`;

        return inputDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }


    return (
         <div className="past-meetings w-1/2 mt-5 flex flex-col justify-start bg-white rounded-lg p-5">
                 <div className="flex justify-between gap-44 ">
                     <p className="font-semibold text-sm">Past Meetings</p>
                     <button className="font-semibold text-sm">View all</button>
                 </div>
             <div className='mt-5 w-full text-sm'>
                 {meeting.map((meet) => (
                     <div key={meet._id} className="mb-5 bg-zinc-50 p-2 rounded-md">
                         <p className="font-semibold">{meet.meeting_name}</p>
                         <div className='flex items-center gap-2 mt-2'>
                             <p className="text-xs w-[72px] text-white bg-blue-500 rounded-lg px-[3px] py-[2px] text-center">
                                 {formatRelativeDate(meet.createdAt)}
                             </p>
                             <p className='flex gap-1 items-center text-white bg-green-600 rounded-lg px-[3px] py-[2px] text-center text-xs'>
                                 <p><i className="fas fa-clock text-xs"></i></p>
                                 <p className=''>{meet.duration} minutes</p>
                             </p>
                         </div>
                     </div>
                 ))}
             </div>
         </div>
    )
}