import {useState, useEffect} from "react";
import { useSelector, useDispatch } from "react-redux";
import {fetchUser,selectUser, clearUser} from "../../features/user/userSlice.ts";
import type {AppDispatch, RootState} from "../../store.ts";

type ProfileFormProps = {
    updateToggle: boolean;
    formData: {
        name: string;
        email: string;
        company: string;
        job: string;
        location: string;
    };
    updateFormData: React.Dispatch<
        React.SetStateAction<{
        name: string;
        email: string;
        company: string;
        job: string;
        location: string;
        }>
    >;
};

function ProfileForm({ updateToggle, formData, updateFormData }: ProfileFormProps) {

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        const { name, value } = e.target
        updateFormData((prev)=>({
            ...prev,
                [name]:value
        }));
    }

    return (
        <div className="bg-white border max-w-[520px] border-zinc-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm text-left font-semibold p-2">Personal Information</h3>
            <form className="w-full p-5 flex flex-1 flex-wrap gap-2">
                <div className="label-input-style">
                    <label htmlFor="name" className='font-semibold'>Name</label>
                    <input
                        type="text"
                        className="input-style"
                        name="name"
                        readOnly={!updateToggle}
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="label-input-style">
                    <label htmlFor="email" className='font-semibold'>Email</label>
                    <input
                        type="email"
                        className="input-style"
                        name="email"
                        readOnly={!updateToggle}
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="label-input-style">
                    <label htmlFor="company" className='font-semibold'>Company</label>
                    <input
                        type="text"
                        className="input-style"
                        name="company"
                        readOnly={!updateToggle}
                        value={formData.company}
                        onChange={handleChange}
                    />
                </div>
                <div className="label-input-style">
                    <label htmlFor="job" className='font-semibold'>Job</label>
                    <input
                        type="text"
                        className="input-style"
                        name="job"
                        readOnly={!updateToggle}
                        value={formData.job}
                        onChange={handleChange}
                    />
                </div>
                <div className="label-input-style">
                    <label htmlFor="location" className='font-semibold'>Location</label>
                    <input
                        type="text"
                        className="input-style"
                        name="location"
                        readOnly={!updateToggle}
                        value={formData.location}
                        onChange={handleChange}
                    />
                </div>
            </form>
        </div>
    );
}

export default ProfileForm;
