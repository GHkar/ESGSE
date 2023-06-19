
export default function Navcompany() {
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-white py-3 shadow">
            <div class="container px-5">
                <a class="navbar-brand" href="/">
                    <span class="fw-bolder text-primary">ESGSE</span>
                </a>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
                    {/* <li class="nav-item">
                        <a class="nav-link" href="/home">Home</a>
                    </li> */}

                    <li class="nav-item">
                        <a class="nav-link" href="/">로그 아웃</a>
                    </li>
                    {/* <li class="nav-item">
                        <a class="nav-link" href="/cdetail">기업 페이지</a>
                    </li> */}
                </ul>
            </div>
        </nav>
    );
}
