import { useState, useEffect } from 'react'
import { validateEmailFormat } from '../util/utils';
import useDebounce from "../hooks/useDebounce.tsx";

interface RegisterData {
    username: string;
    password: string;
    email: string;
}

export default function useInputValidation(registerData: RegisterData) {
    const [messages, setMessages] = useState(
        {
            username: "Username must be provided.",
            password: "Password must be provided.",
            email: "Email must be provided."
        }   
    )
    const debouncedRegisterData = useDebounce(registerData);

    useEffect(() => {
        if (registerData.password.length < 8) {
            setMessages({ ...messages, password: "Password must be at least 8 characters long." });
        } else {
            setMessages({ ...messages, password: "" })
        }
    }, [debouncedRegisterData.password])

    useEffect(() => {
        if (registerData.username.length < 6) {
            setMessages({ ...messages, username: "Username must be at least 6 characters long." });
        } else {
            setMessages({ ...messages, username: "" })
        }
    }, [debouncedRegisterData.username])

    useEffect(() => {
        if (!validateEmailFormat(registerData.email)) {
            setMessages({ ...messages, email: "Enter a valid email address." });
        } else {
            setMessages({ ...messages, email: "" })
        }
    }, [debouncedRegisterData.email])

    return { messages }
}