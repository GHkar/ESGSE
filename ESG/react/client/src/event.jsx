
import { useState, useEffect } from "react";
import { json, useParams } from "react-router-dom";
import Nav from "./navuser";
import axios from "axios";
import { serverIP, S3URL } from "./config";
import { EthProviderEvent } from "./contexts/EthContext";

export default function Event() {
    let [mainImg, setMainImg] = useState("");
    const [review, setReview] = useState('');
    const onChange = event => setReview(event.target.value);
    const [eventData, seteventList] = useState([]);
    const [reviewArray, setReviewArray] = useState([]);
    const [userId, setUserId] = useState("");
    const [userName, setUserName] = useState("");
    const [file, setFile] = useState(null); // 파일 변수 추가

    useEffect(() => {
        // 로컬 스토리지에서 id 값 가져오기
        const id = localStorage.getItem("userid");
        const name = localStorage.getItem("username");
        setUserId(id);
        setUserName(name);
    }, []);

    const temp = useParams();                 // 경로에서 company_id를 추출함
    const companyId = temp.companyid
    const eventIdx = temp.eventidx

    const setPreviewImg = (event) => {
        var reader = new FileReader();
        reader.onload = function (event) {
            setMainImg(event.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
        setFile(event.target.files[0]);
    }
    const onSubmit = event => {
        if (!JSON.parse(localStorage.getItem('userpermission'))) {
            alert('접근 권한이 없습니다.\n관리자에게 문의해주세요.')
            return;
        }
        event.preventDefault();
        if (review === '') {
            return;
        }

        if (!file) {
            alert("사진을 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append('eventidx', eventIdx);
        formData.append('userid', userId);
        formData.append('reviewdesc', review);
        formData.append('companyid', companyId);
        formData.append('multipartFile', file);
        formData.append('username', userName);


        const reviewPromise = axios.post(serverIP + "/reviews", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        axios.all([reviewPromise])
            .then(axios.spread((response1) => {
                // 두 개의 요청이 모두 성공한 경우 실행되는 코드
                console.log(response1.data); // FormData 형식으로 파싱된 데이터
            }))
            .catch(error => {
                // 요청 중 하나라도 실패한 경우 실행되는 코드
                console.error(error);
            });

        setReview('');
    };

    useEffect(() => {
        const EventList = axios.get(serverIP + `/events/${companyId}/${eventIdx}`);
        const ReviewList = axios.get(serverIP + `/reviews/${eventIdx}`);

        axios
            .all([EventList, ReviewList])
            .then(axios.spread((eventListResopnse, reviewListResponse) => {
                const eventListData = eventListResopnse.data.data[0];
                const reviewListData = reviewListResponse.data.data;
                seteventList(eventListData);
                setReviewArray(reviewListData);
            }))
            .catch((error) => {
                console.log(error);
            });
    }, [eventIdx]);

    return (
        <EthProviderEvent>
            <div>
                <Nav />
                <section class="py-5 h-auto">
                    <div class="container px-5 mb-5 text-center">
                        <div class="mb-5">
                            <h1 class="display-5 fw-bolder mb-0">
                                <span class="text-gradient d-inline">행사 소개</span>
                            </h1>
                        </div>

                        <div class="row gx-5 justify-content-center">
                            <div class="col-lg-11 col-xl-9 col-xxl-8">
                                {/* Project Card 1*/}
                                <div class="card overflow-hidden shadow rounded-4 border-0 mb-5">
                                    <div class="card-body p-0 h-80">
                                        <div class="d-flex justify-between w-full h-full">
                                            <div class="p-5 grid grid-rows-3 w-full">
                                                <h2 class="fw-bolder d-flex justify-start">{eventData[1]}</h2>
                                                <p className="d-flex justify-start">{eventData[2]}</p>
                                            </div>
                                            <img class="img-fluid w-80" src={"https://" + eventData[3] + S3URL + eventData[4]} alt="..." />
                                        </div>
                                    </div>
                                </div>

                                <div class="text-center">
                                    <h1 class="display-5 fw-bolder mb-5"><span class="text-gradient d-inline">행사 리뷰</span></h1>
                                </div>

                                <div class="card overflow-hidden shadow rounded-4 border-0 mb-5">
                                    <div class="card-body p-0 h-auto">
                                        <div class="border-0 rounded-4 h-auto w-full p-4">
                                            <div className="h-56 overflow-y-scroll">
                                                {reviewArray.map((review, id) => (
                                                    <li key={id} className="reviewText d-flex justify-between bg-light rounded-4 p-3 mb-3 mr-3">
                                                        <div className="reviewMargin w-1/4">

                                                            <span className="reviewNameBold">{review[0]}: </span>
                                                            <span className="commentLabel commentDescLeftAlign">{review[1]}</span>
                                                        </div>
                                                        <div className="commentMargin">
                                                            <span className="commentLabel">{review[2]}</span>
                                                        </div>
                                                        <div className="reviewStart w-48">
                                                            <img src={"https://" + review[3] + S3URL + review[4]} className=" float-right"></img>
                                                        </div>
                                                    </li>
                                                ))}
                                            </div>
                                            <div className="col-span-full">
                                                <div className="mt-2 flex justify-center rounded-lg border border-gray-900/25 w-1/2">
                                                    <div className="text-center">
                                                        <img src={mainImg} className="w-80"></img>
                                                        <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                                            <label
                                                                htmlFor="file-upload"
                                                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                                            >
                                                                <span className="">파일 선택</span>
                                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={setPreviewImg} />
                                                            </label>
                                                        </div>
                                                        <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-full d-flex justify-center pt-3 ">
                                                <div className="reviewContainer w-full" onSubmit={onSubmit}>
                                                    <form className="reviewWrap d-flex justify-between">
                                                        <input
                                                            type="text"
                                                            placeholder="리뷰달기..."
                                                            value={review}
                                                            onChange={onChange}
                                                            className="w-3/4"
                                                        />
                                                        <div className="hidden" id="companyId">{companyId}</div>
                                                        <div className="hidden" id="eventIdx">{eventIdx}</div>
                                                        <button className="commetBtn btn btn-primary px-4 py-2 ml-3" id="review">게시</button>
                                                    </form>
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </EthProviderEvent>
    );
}
