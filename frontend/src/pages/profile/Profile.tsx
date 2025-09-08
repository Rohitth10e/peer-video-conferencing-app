import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {fetchUser, selectUser, updateUser} from "../../features/user/userSlice";
import type { AppDispatch } from "../../store";
import ProfileCard from "../../components/profile/ProfileCard.tsx";
import ProfileForm from "../../components/profile/ProfileForm.tsx";
import ProfileNav from "../../components/profile/ProfileNav.tsx";
import {toast} from "react-toastify";

function Profile() {
    const navigate = useNavigate();
    const [updateToggle, setUpdateToggle] = useState(false);
    const user = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();

    const [formData, updateFormData] = useState({
        name: user?.name ?? "" ,
        email: user?.email ?? "" ,
        company: user?.company ?? "",
        job: user?.job ?? "" ,
        location: user?.location ?? "",
    })

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            dispatch(fetchUser());
        } else {
            console.log("⚠️ No auth token found, user not logged in");
            navigate("/login")
        }
    }, [dispatch]);

    useEffect(()=>{
        if(user){
            updateFormData({
                name: user?.name ?? "" ,
                email: user?.email ?? "" ,
                company: user?.company ?? "",
                job: user?.job ?? "" ,
                location: user?.location ?? "",
            });
        }
    },[user])

    function handleUpdate(e) {
        e.preventDefault();
        dispatch(updateUser(formData))
        setUpdateToggle(false);
        toast.success("Your profile updated successfully.");
    }

    return (
        <>
            <ProfileNav updateToggle={updateToggle} setUpdateToggle={setUpdateToggle} handleUpdate={handleUpdate} />

            <div className="bg-gray-100 min-h-screen p-6 font-sans antialiased text-gray-900">
                <main className="max-w-5xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <ProfileCard />
                    </div>
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <ProfileForm updateToggle={updateToggle} setUpdateToggle={setUpdateToggle} formData={formData} updateFormData={updateFormData} />
                        {/* <MeetingPreferencesCard/> */}
                    </div>
                </main>
            </div>
        </>
    );
}

export default Profile;
