import Nav from "./navuser";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './App.css';
import { serverIP, S3URL } from "./config";
import './comment.css';
import { EthProviderCompany } from "./contexts/EthContext";


export default function Company() {
    const [comment, setComment] = useState('');
    const onChange = event => {
        setComment(event.target.value);
    }

    const [companyData, setCompanyDetail] = useState("");
    const [tagData, setTagDetail] = useState("");
    const [eventData, seteventList] = useState([]);
    const [commentArray, setCommentArray] = useState([]);
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [reportData, setReportData] = useState([]);
    const [token, setToken] = useState("");
    const [input, setInput] = useState(0);


    const handlechange = (e) => {
        setInput(e.target.value)
    }

    const onClickPost = e => {
        if (!JSON.parse(localStorage.getItem('userpermission'))) {
            alert('접근 권한이 없습니다.\n관리자에게 문의해주세요.')
            return;
        }
        e.preventDefault();

        if (input <= 0) {
            alert("값을 올바르게 적어주세요");
        }
        else if (token < input) {
            alert("보유 토큰이 부족합니다.");
        }
        else { }
    }

    useEffect(() => {
        // 로컬 스토리지에서 id 값 가져오기
        const id = localStorage.getItem("userid");
        const name = localStorage.getItem("username");
        setUserId(id);
        setUserName(name);
    }, []);

    // 한국 시간 함수
    function javaNow() {
        var now = new Date();

        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padStart(2, '0');
        var day = now.getDate().toString().padStart(2, '0');
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        var seconds = now.getSeconds().toString().padStart(2, '0');

        var javaTimestamp = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

        return javaTimestamp;
    }

    const temp = useParams();// 경로에서 company_id를 추출함
    const companyId = temp.companyId

    const onSubmit = event => {
        if (!JSON.parse(localStorage.getItem('userpermission'))) {
            alert('접근 권한이 없습니다.\n관리자에게 문의해주세요.')
            return;
        }

        event.preventDefault();
        if (comment === '') {
            return;
        }
        const newComment = [null, companyId, userId, comment, javaNow()];
        let DBComment = {
            "companyid": companyId,
            "userid": userId,
            "commentdesc": comment,
            "time": javaNow(),
            "companyname": companyData.companyname,
            "username": userName,
        }
        let data = {
            "fromid": "test",
            "toid": localStorage.getItem("userbcid"),
            "value": 10,
        };
        const request1 = axios.post(serverIP + "/comments", JSON.stringify(DBComment), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const request2 = axios.post(serverIP + "/transactions/comments", JSON.stringify(data), {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        axios.all([request1, request2])
            .then(axios.spread((response1, response2) => {
                // 두 개의 요청이 모두 성공한 경우 실행되는 코드
            }))
            .catch(error => {
                // 요청 중 하나라도 실패한 경우 실행되는 코드
                console.error(error);
            });
        setCommentArray(commentValueList => [newComment, ...commentValueList]);
        setComment('');
    };

    useEffect(() => {
        if (companyId) {
            const useriid = localStorage.getItem("userid");
            // userId 값이 있을 때에만 API 호출
            const CompanyLDetail = axios.get(serverIP + `/companies/${companyId}`);
            const TagDetail = axios.get(serverIP + `/tags/${companyId}`);
            const EventList = axios.get(serverIP + `/events/${companyId}`);
            const CommentList = axios.get(serverIP + `/comments/${companyId}`);
            const report = axios.get(serverIP + `/reports/${companyId}`);
            const usertoken = axios.get(serverIP + `/users/tokenvalues/${useriid}`);

            axios
                .all([CompanyLDetail, TagDetail, EventList, CommentList, report, usertoken])
                .then(axios.spread((companyDetailResponse, tagDetailResponse, eventListResopnse, commentListResponse, reportResponse, usertokenResponse) => {
                    const companyDeatilData = companyDetailResponse.data.data;
                    const tagDetailData = tagDetailResponse.data.data[0];
                    const eventListData = eventListResopnse.data.data;
                    const commentListData = commentListResponse.data.data;
                    const reportData = reportResponse.data.data;
                    const userToken = usertokenResponse.data.data;
                    setCompanyDetail(companyDeatilData);
                    setTagDetail(tagDetailData);
                    seteventList(eventListData);
                    setCommentArray(commentListData);
                    setReportData(reportData);
                    setToken(userToken);
                }))
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [companyId]);


    const tagprint = (arr) => {
        if (!arr) {
            return []; // arr이 정의되지 않았거나 null인 경우 빈 배열 반환
        }
        const tags = arr.split('/'); // '/'를 구분자로 사용하여 문자열을 배열로 분할
        const result = [];
        for (let i = 0; i < tags.length; i++) {
            result.push(
                <span className="inline-flex w-full h-full items-center d-flex justify-center rounded-md bg-indigo-50 px-3 py-2 mx-1 text-2xl font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10" key={i}>
                    {tags[i]}
                </span>
            );
        }
        return result;
    };

    const handleDownload = (bname, filename) => {
        const url = "https://" + bname + S3URL + filename;
        const downbload = document.createElement('a');
        downbload.href = url;
        downbload.setAttribute('download', 'ESG경영_보고서');
        downbload.click();
    };

    return (
        <EthProviderCompany>
            <div>
                <Nav />
                <div class="container px-5 my-5">
                    <div class="text-center mb-5">
                        <h1 class="display-5 fw-bolder mb-0"><span class="text-gradient d-inline">{companyData.companyname}</span></h1>
                        <div class="text-gray-400">
                            기업 블록체인 아이디 : <a id="toAcc">{companyData.bcid}</a>
                        </div>
                        <div className="hidden" id="companyId">{companyData.companyid}</div>
                    </div>
                    <div class="row gx-5 justify-content-center mb-4">
                        <div class="col-lg-11 col-xl-9 col-xxl-8">
                            {/* Skills Section*/}
                            <section>
                                {/* Skillset Card*/}
                                <div class="card shadow border-0 rounded-4 mb-5">
                                    <div class="card-body p-5">
                                        {/* Professional skills list*/}
                                        <div class="mb-5">
                                            <div class="d-flex align-items-center mb-4 d-flex">
                                                <div class="feature bg-primary bg-gradient-primary-to-secondary text-white rounded-3 me-3">
                                                    <i class="bi bi-tools"></i>
                                                </div>
                                                <h3 class="fw-bolder mb-0 mr-auto">
                                                    <span class="text-gradient">기부금 현황</span>

                                                </h3>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    id="price"
                                                    placeholder={`보유 토큰 : ${token}`}
                                                    onChange={handlechange}
                                                    className="border-0 mr-3 w-1/8 pl-3 text-gray-900 ring-2 ring-inset ring-indigo-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 h-full rounded-md text-xl"
                                                />
                                                <div className="mr-3 text-xl">
                                                    don
                                                </div>
                                                <a onClick={onClickPost} class="btn btn-primary px-4 py-3 ml-5" id="donation">
                                                    기부하기
                                                </a>
                                            </div>
                                            <div class="mb-4">
                                                <div class="d-flex align-items-center bg-light rounded-4 p-3 h-100 justify-end"> {companyData.tokenvalue} / 100</div>
                                            </div>
                                            <div class="d-flex align-items-center mb-4">
                                                <div class="feature bg-primary bg-gradient-primary-to-secondary text-white rounded-3 me-3">
                                                    <i class="bi bi-tools"></i>
                                                </div>
                                                <h3 class="fw-bolder mb-0">
                                                    <span class="text-gradient d-inline">기업 키워드</span>
                                                </h3>
                                            </div>
                                            <div class="w-full h-full items-center">
                                                <div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">{tagData && tagData[1] && tagprint(tagData[1])}</div>
                                            </div>
                                        </div>
                                        {/* Languages list*/}
                                        <div class="mb-0">
                                            <div class="d-flex align-items-center mb-4">
                                                <div class="feature bg-primary bg-gradient-primary-to-secondary text-white rounded-3 me-3"><i class="bi bi-code-slash"></i></div>
                                                <h3 class="fw-bolder mb-0"><span class="text-gradient d-inline">기업 소개</span></h3>
                                            </div>
                                            <div class="mb-4">
                                                <div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">{companyData.companydesc}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* Experience Section*/}
                            <section>
                                <div class="d-flex align-items-center justify-content-between mb-4">
                                    <h2 class="text-primary fw-bolder mb-0">ESG 경영 보고서</h2>
                                    {/* Download resume button*/}
                                    {/* Note: Set the link href target to a PDF file within your project*/}

                                </div>
                                {reportData.map((data) => (
                                    <div class="card shadow border-0 rounded-4 mb-5">
                                        <div class="card-body p-5 flex justify-between">
                                            <div>
                                                <div class="text-primary fw-bolder mb-2">파일 생성 날짜 : {data[2]}</div>
                                                <div class="small fw-bolder">파일 이름 : {data[4]}</div>
                                            </div>
                                            <div>
                                                <a onClick={() => handleDownload(data[3], data[4])} class="btn btn-primary px-4 py-3 mt-3">
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </section>
                            {/* Education Section*/}
                            <section>
                                <h2 class="text-secondary fw-bolder mb-4">기업 행사 목록</h2>
                                {/* Education Card 1*/}
                                {eventData.length > 0 ? (
                                    eventData.map((event, index) => (
                                        <div class="card shadow border-0 rounded-4 mb-5">
                                            <div class="card-body">
                                                <div class="row align-items-center gx-5">
                                                    <div class="col text-center text-lg-start mb-4 mb-lg-0">
                                                        <div class="card-body p-0 h-80">
                                                            <div class="d-flex justify-between w-full h-full">
                                                                <div class="p-5 grid grid-rows-3 w-full">
                                                                    <h2 class="fw-bolder d-flex justify-start">{event[1]}</h2>
                                                                    <p className="d-flex justify-start">{event[2]}</p>
                                                                    <a class="btn btn-primary btn-lg px-5 py-3 me-sm-3 fs-6 fw-bolder w-3/4" href={`/event/${companyId}/${event[0]}`}>리뷰 보러가기</a>
                                                                </div>
                                                                <img class="img-fluid w-80" src={"https://" + event[3] + S3URL + event[4]} alt="..." />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div class="card shadow border-0 rounded-4 mb-5">
                                        <p>기업 행사가 없습니다.</p>
                                    </div>
                                )}
                            </section>
                            <div class="text-center">
                                <h1 class="display-5 fw-bolder mb-0"><span class="text-gradient d-inline">기업 응원 댓글</span></h1>
                            </div>
                            <div class="card overflow-hidden shadow rounded-4 border-0 mb-5">
                                <div class="card-body p-0 h-80">
                                    <div class="border-0 rounded-4 h-full w-full p-4">
                                        <div className="h-56 overflow-y-scroll">
                                            <ul>
                                                {commentArray.map((comment, id) => (
                                                    <li key={id} className="commentText d-flex justify-between">
                                                        <div className="commentMargin">
                                                            <span className="commentLabel">{comment[2]}: </span>
                                                            <span className="commentLabel commentDescLeftAlign">{comment[3]}</span>                        {/* css 적용 */}
                                                        </div>
                                                        <div className="commentMargin" style={{ marginRight: '15px' }}>
                                                            <span className="commentLabel">{comment[4]}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="w-full d-flex justify-center pt-3 ">
                                            <div className="commentContainer w-full" onSubmit={onSubmit}>
                                                <form className="commentWrap d-flex justify-between">
                                                    <input
                                                        type="text"
                                                        placeholder="댓글달기"
                                                        value={comment}
                                                        onChange={onChange}
                                                        className="w-3/4"
                                                    />
                                                    <button className="commetBtn btn btn-primary px-4 py-2 ml-3" id="comment">게시</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EthProviderCompany>
    );
}