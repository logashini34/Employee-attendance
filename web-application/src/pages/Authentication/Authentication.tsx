import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./SignupSection";
import Signin from "./SigninSection";

export default function Authenticate() {
    return <Routes>
        <Route path="/" element={<Redirect />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-out" />
    </Routes>
}

function Redirect() {
    useEffect(() => {
        window.location.href = "/auth/sign-up"
    }, [])

    return <section></section>
}



