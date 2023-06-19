import React from "react";

export default function Navuser() {
    // local storage에서 userId 값을 가져옴

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow">
            <div className="container px-5">
                <a className="navbar-brand" href="/">
                    <span className="fw-bolder text-primary">ESGSE</span>
                </a>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
                    {/* <li className="nav-item">
                        <a className="nav-link" href="/home">Home</a>
                    </li> */}

                    <li className="nav-item">
                        <a className="nav-link" href={"/home"}>기업 리스트</a>
                    </li>

                    {/* <li className="nav-item">
                        <a className="nav-link" href="/cdetail">기업 페이지</a>
                    </li> */}
                </ul>
            </div>
        </nav>
    );
}
