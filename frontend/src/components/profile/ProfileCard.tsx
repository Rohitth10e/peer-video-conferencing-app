import {selectUser} from '../../features/user/userSlice.ts'
import {useSelector} from "react-redux";

function ProfileCard() {
    const user = useSelector(selectUser);
    const initials = user?.name
        ? user.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase()
        : "JD";
    return (
        <div className="w-[320px] bg-white border border-zinc-200 rounded-xl p-6 text-center shadow-sm h-svh">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                { initials }
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-800">{ user?.name ?? 'John Doe'}</h2>
            <p className="text-sm text-gray-500">{ user?.job ?? 'Senior Software Engineer'}</p>
            <span className="text-xs mt-2 inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                Pro Plan
            </span>
            <div className="mt-6 text-left text-sm text-gray-600 space-y-3">
                <div className="flex items-center gap-2">
                    <i className="fas fa-envelope text-gray-500 text-base w-5"></i>
                    <p>{ user?.email ?? 'JohnDoe@gmail.com'}</p>
                </div>
                {/*<div className="flex items-center gap-2">*/}
                {/*    <i className="fas fa-phone text-gray-500 text-base w-5"></i>*/}
                {/*    <p>+1 (555) 123-4567</p>*/}
                {/*</div>*/}
                <div className="flex items-center gap-2">
                    <i className="fas fa-map-marker-alt text-gray-500 text-base w-5"></i>
                    <p>{ user?.location ?? 'San Francisco, CA'}</p>
                </div>
                <div className="flex items-center gap-2">
                    <i className="fas fa-building text-gray-500 text-base w-5"></i>
                    <p>{ user?.company ??'Acme Corporation'}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;