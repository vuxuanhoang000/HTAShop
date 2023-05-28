import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getAuthToken } from "../../utils/localStorage";

function AuthPage() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get("redirect");
    const redirect = redirectInUrl ? redirectInUrl : "/";

    useEffect(() => {
        if (getAuthToken()) {
            navigate(redirect);
        }
    }, [navigate, redirect]);

    return (
        <div className="container bg-white vh-100">
            <div className="row align-items-center justify-content-center vh-100">
                <div className="col-12 col-md-8 col-lg-6 col-xl-5 rounded bg-light p-5">
                    <Outlet context={{ redirect: redirect }} />
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
