import { useState, type FormEvent } from "react"
import axios from "../services/axios";
import { useThemeStore } from "../store/useThemeStore";

interface ContactData {
    email: string;
    name: string;
    message: string;
}

export default function Contact(){
    const { theme } = useThemeStore();
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState<null | string>(null);
    const [ contactData, setContactData ] = useState<ContactData>({
        email: "",
        name: "",
        message: ""
    });
 
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)

        try {
            const response = await axios.post("/email", contactData);

            if (response.data.success){
                setError(null);
                setContactData({
                    email: "",  
                    name: "",
                    message: ""
                })
            }
        } catch (err: any) {
            setError(err.response.data?.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex items-center justify-center" data-theme={theme}>
            <div className="border shadow-2xl max-w-xl w-full">
                <div className="mb-8">
                    <h1 className="pt-8 pb-3 font-[Open Sans] font-semibold text-center text-5xl">Contact</h1>
                    <p className="text-center text-md font-[Open Sans]">Got any questions about Certamina? <span className="font-semibold">Let's get in touch.</span></p> 
                </div>
                <div className="p-6">
                    <form className="space-y-7" onSubmit={handleSubmit}>
                        <div className="flex flex-col space-y-1">
                            <label className="label">Email</label>
                            <input type="text" placeholder="Email" className="input w-full" value={contactData.email} onChange={(e) => setContactData({...contactData, email: e.target.value})}/>
                        </div>
                         <div className="flex flex-col space-y-1">
                            <label className="label">Name</label>
                            <input type="text" placeholder="Name" className="input w-full" value={contactData.name} onChange={(e) => setContactData({...contactData, name: e.target.value})}/>
                        </div>
                        <div className="flex flex-col space-y-1">
                            <label className="label">Message</label>
                            <textarea placeholder="Message" className="input w-full textarea" value={contactData.message} onChange={(e) => setContactData({...contactData, message: e.target.value})}></textarea>
                        </div>
                        <div className="p-4">
                            <button className="btn btn-ghost w-full" type="submit">
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner loading-lg"></span>                                    
                                    </>
                                ) : "Send"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}