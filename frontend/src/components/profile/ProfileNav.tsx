import {useNavigate} from "react-router-dom";

function ProfileNav({ updateToggle, setUpdateToggle, handleUpdate }) {
    const navigate = useNavigate();
    return (
        <header className="w-full h-20 px-28 border-b border-zinc-200 bg-white text-zinc-700 tracking-tight box-border flex items-center justify-between">
            <div className="flex items-center gap-4">
                <i className='fas fa-arrow-left' onClick={()=>navigate('/dashboard')}></i>
                <h1 className="text-xl font-semibold">Profile Settings</h1>
            </div>
            {
                !updateToggle ? (<button className='bg-blue-500 p-2 rounded-md text-white' onClick={() =>setUpdateToggle(true)}>Edit Profile</button>) : (<div className='flex items-center gap-2'>
                    <button className='bg-transparent p-2 rounded-md border-zinc-200 border' onClick={()=>setUpdateToggle(false)}>Cancel</button>
                    <button className='bg-yellow-500 p-2 rounded-md text-white' onClick={handleUpdate}>Update</button>
                </div>)
            }
        </header>
    );
}

export default ProfileNav;