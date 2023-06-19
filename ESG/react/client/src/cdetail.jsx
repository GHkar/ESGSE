import Nav from "./navcompany";
import axios from "axios";
import { serverIP, S3URL } from "./config"
import { useEffect, useState } from "react";
import { EthProviderDeploy } from "./contexts/EthContext";


export default function Cdetail() {
    const [comment, setComment] = useState('');
    const [companyId, setCompanyId] = useState("");
    const [companyData, setCompanyDetail] = useState("");
    const [tagData, setTagDetail] = useState("");
    const [eventData, seteventList] = useState([]);
    const [FeedData, setFeedList] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [showWriteButton, setShowWriteButton] = useState(null);
    const [commentArray, setCommentArray] = useState([]);


    const handleReportRequest = () => {
        if (!JSON.parse(localStorage.getItem('userpermission'))) {
            alert('접근 권한이 없습니다.\n관리자에게 문의해주세요.')
            return;
        }
        setShowWriteButton(true);
    };

    useEffect(() => {
        // 로컬 스토리지에서 id 값 가져오기
        const companyId = localStorage.getItem("companyid");
        console.log('id : ' + companyId)
        setCompanyId(companyId);
    }, []);


    useEffect(() => {
        if (companyId) {
            // userId 값이 있을 때에만 API 호출
            const CompanyLDetail = axios.get(serverIP + `/companies/${companyId}`);
            const TagDetail = axios.get(serverIP + `/tags/${companyId}`);
            const EventList = axios.get(serverIP + `/events/${companyId}`);
            const FeedList = axios.get(serverIP + `/feeds/companies/${companyId}`);
            const report = axios.get(serverIP + `/reports/${companyId}`);
            const CommentList = axios.get(serverIP + `/comments/${companyId}`);


            axios
                .all([CompanyLDetail, TagDetail, EventList, FeedList, report, CommentList])
                .then(axios.spread((companyDetailResponse, tagDetailResponse, eventListResopnse, FeedListResponse, reportResponse, commentListResponse) => {
                    const companyDeatilData = companyDetailResponse.data.data;
                    const tagDetailData = tagDetailResponse.data.data[0];
                    const eventListData = eventListResopnse.data.data;
                    const reportData = reportResponse.data.data;
                    const FeedListData = FeedListResponse.data.data;
                    const commentListData = commentListResponse.data.data;
                    setCompanyDetail(companyDeatilData);
                    setTagDetail(tagDetailData);
                    seteventList(eventListData);
                    setFeedList(FeedListData);
                    setReportData(reportData);
                    setShowWriteButton(companyDeatilData.contractaddr);
                    setCommentArray(commentListData);
                }))
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [companyId]);
    console.log('data : ' + companyData)
    localStorage.setItem('companydesc', companyData.companydesc)
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

    // 행사 삭제 버튼
    const onClickDelete = (index) => {
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
        if (confirmDelete) {
            let data = {
                "eventidx": parseInt(eventData[index][0]),
                "filename": eventData[index][4],
            }
            axios.delete(serverIP + "/events", {
                data: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    const res = response.data
                    alert("행사가 삭제됐습니다")
                    document.location.href = `/cdetail/${companyId}`
                })
                .catch((error) => console.log(error));
        }
    }
    const handleDownload = (bname, filename) => {
        const url = "https://" + bname + S3URL + filename;
        const downbload = document.createElement('a');
        downbload.href = url;
        downbload.setAttribute('download', 'test.pdf');
        downbload.setAttribute('type', 'application/json');
        downbload.click();
    };
    return (
        <EthProviderDeploy>
            <div>
                <Nav />
                <div class="container px-5 my-5">
                    <div class="text-center mb-5">
                        <h1 class="display-5 fw-bolder mb-0">
                            {companyData && companyData.companyname && (
                                <span class="text-gradient d-inline">{companyData.companyname}</span>
                            )}
                        </h1>
                        <div class="text-gray-400">
                            기업 블록체인 아이디 : {companyData.bcid}
                        </div>
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
                                            <div class="d-flex align-items-center mb-4">
                                                <div class="feature bg-primary bg-gradient-primary-to-secondary text-white rounded-3 me-3">
                                                    <i class="bi bi-tools"></i>
                                                </div>
                                                <h3 class="fw-bolder mb-0">
                                                    <span class="text-gradient d-inline">기부금 현황</span>
                                                </h3>
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
                                                <div class="d-flex align-items-center bg-light rounded-4 p-3 h-100">{tagprint(tagData && tagData[1])}</div>
                                            </div>
                                        </div>
                                        {/* Languages list*/}
                                        <div class="mb-0">
                                            <div class="d-flex align-items-center mb-4">
                                                <div class="feature bg-primary bg-gradient-primary-to-secondary text-white rounded-3 me-3"></div>
                                                <h3 class="fw-bolder mb-0"><span class="text-gradient d-inline">기업 소개</span></h3>
                                            </div>
                                            <div class="mb-4">
                                                <div className="d-flex align-items-center bg-light rounded-4 p-3 h-100">
                                                    {companyData && companyData.companydesc && (
                                                        <div>{companyData.companydesc}</div>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </section>
                            {/* Experience Section*/}
                            <section>
                                <div className="hidden" id="companyId">{companyId}</div>
                                <div class="d-flex align-items-center justify-content-between mb-4">
                                    <h2 class="text-primary fw-bolder mb-0">ESG 경영 보고서</h2>
                                    {/* Download resume button*/}
                                    {/* Note: Set the link href target to a PDF file within your project*/}
                                    <>
                                        {showWriteButton === null ? (
                                            <button
                                                id="deploy"
                                                className=" rounded-md bg-gradient-primary-to-secondary text-white px-4 py-3 mt-3"
                                                onClick={handleReportRequest}
                                            >
                                                보고서 신청
                                            </button>
                                        ) : (
                                            <a className="btn btn-primary px-4 py-3 mt-3" href="/survey1">
                                                보고서 쓰기
                                            </a>
                                        )}
                                    </>

                                </div>
                                {/* Experience Card 1*/}
                                {reportData.map((data) => (
                                    <div class="card shadow border-0 rounded-4 mb-5">
                                        <div class="card-body p-5 flex justify-between">
                                            <div>
                                                <div class="text-primary fw-bolder mb-2">파일 생성 날짜 : {data[2]}</div>
                                                <div class="small fw-bolder">파일 이름 : {data[4]}</div>

                                            </div>
                                            <div>
                                                <a onClick={() => { handleDownload(data[3], data[4]) }} class="btn btn-primary px-4 py-3 mt-3">
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </section>
                            {/* Education Section*/}
                            <section>
                                <div class="d-flex align-items-center justify-content-between mb-4">
                                    <h2 class="text-secondary fw-bolder d-flex">기업 행사 목록</h2>
                                    <a class="btn btn-primary px-4 py-3" href="/insertevent">
                                        <div class="d-inline-block bi bi-download"></div>
                                        행사 추가하기
                                    </a>
                                </div>
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
                                                                    <div className="grid grid-cols-2">
                                                                        <button
                                                                            type="button">
                                                                            <a class="btn btn-primary btn-lg px-5 py-3 me-sm-3 fs-6 fw-bolder w-auto " href={`/event/${companyId}/${event[0]}`}>리뷰 보러가기</a>
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => onClickDelete(index)}>
                                                                            <a class="btn btn-primary btn-lg px-5 py-3 me-sm-3 fs-6 fw-bolder w-auto">행사 삭제하기</a>
                                                                        </button>
                                                                    </div>
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
                                        <p>기업 행사 목록이 비어 있습니다.</p>
                                    </div>
                                )}
                            </section>
                            <div class="text-center">
                                <h1 class="display-5 fw-bolder mb-0"><span class="text-gradient d-inline">실시간 피드</span></h1>
                            </div>
                            <div class="card overflow-hidden shadow rounded-4 border-0 mb-5">
                                <div class="card-body p-0 h-80">
                                    <div class="border-0 rounded-4 h-full w-full p-4 overflow-y-scroll">
                                        {FeedData.map((feed) => (
                                            <div className="flex justify-between border-solid border-2 border-indigo-600 px-3 py-3 mb-2 rounded-md">
                                                <div className="">
                                                    <p className=" text-secondary fw-bolder m-0">{feed.content}</p>
                                                </div>
                                                <div className="commentMargin" style={{ marginRight: '15px' }}>
                                                    <span className="commentLabel">{feed.time}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="relative isolate overflow-hidden">
                                <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
                                    <h1 class="display-5 fw-bolder mb-3"><span class="text-gradient d-inline">응원 댓글</span></h1>
                                    <ul role="list" className="divide-y  border-solid border-2 border-indigo-600 rounded-lg pr-6">
                                        {commentArray.map((comment, id) => (
                                            <li key={id} className="commentText d-flex justify-between">
                                                <div className="commentMargin">
                                                    <span className=" fw-bolder m-0">{comment[2]}: </span>
                                                    <span className=" fw-bolder m-0">{comment[3]} </span>
                                                </div>
                                                <div className="commentMargin" style={{ marginRight: '15px' }}>
                                                    <span className=" fw-bolder m-0">{comment[4]}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </EthProviderDeploy>
    );
}
