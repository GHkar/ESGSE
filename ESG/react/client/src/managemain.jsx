import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverIP, S3URL } from "./config";
import { EthProviderManage } from "./contexts/EthContext";
import NewUserList from "./formComponent/newUserList";

export default function Managemain() {
  const [imageList, setImageList] = useState([]);
  const [FeedData, setFeedList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totaldon, setTotalDon] = useState(100);
  const [havedon, setHaveDon] = useState(50);
  const [custom, setCustom] = useState(0);
  const [take, setTake] = useState(0);
  const [tbcid, setTbcid] = useState("");
  const [company, setCompany] = useState('');
  const [comtoken, setComtoken] = useState('');

  const handleCustom = (e) => {
    setCustom(e.target.value);
  };

  const handleTake = (e) => {
    setTake(e.target.value);
  };

  const handleBcid = (e) => {
    setTbcid(e.target.value);
  }

  const onClickTake = (value, from) => {
    value = parseInt(value, 10);
    let jsondata = {
      "tokenvalue": value,
      "bcid": from,
    };

    const request1 = axios.post(serverIP + "/admins/seizure", JSON.stringify(jsondata), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    axios.all([request1])
      .then(axios.spread((response2) => {
        // 두 개의 요청이 모두 성공한 경우 실행되는 코드
        if (response2.data.success) {
          alert("정상 처리 완료");
          setHaveDon((prevHaveDon) => prevHaveDon + value);
        }
        else {
          alert("블록체인 ID를 확인해주세요");
        }
      }))
      .catch(error => {
        // 요청 중 하나라도 실패한 경우 실행되는 코드
        console.error(error);
      });
  }

  const handleHavedon = (event, value) => {
    value = parseInt(value, 10); // value 값을 정수로 변환

    if (event === 0) {
      setHaveDon((prevHaveDon) => prevHaveDon + value);
      setTotalDon((prevTotalDon) => prevTotalDon + value);
      setCustom(0);
      const formData = new FormData();
      formData.append('plusnum', value);
      const reviewPromise = axios.post(serverIP + "/admins/plus", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      axios.all([reviewPromise])
        .then(axios.spread((response1) => {
          // 두 개의 요청이 모두 성공한 경우 실행되는 코드
        }))
        .catch(error => {
          // 요청 중 하나라도 실패한 경우 실행되는 코드
          console.error(error);
        });
    } else {
      // 감소값이 현재 보유한 don 값보다 크면 현재 보유한 don 값으로 설정
      if (value > havedon) {
        value = havedon;
        alert("현재 보유 코인량 보다 감소시킬 수 없습니다.")
      } else {
        setHaveDon((prevHaveDon) => prevHaveDon - value);
        setTotalDon((prevTotalDon) => prevTotalDon - value);
        setCustom(0);
        const formData = new FormData();
        formData.append('minusnum', value);
        const reviewPromise = axios.post(serverIP + "/admins/minus", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        axios.all([reviewPromise])
          .then(axios.spread((response1) => {
            // 두 개의 요청이 모두 성공한 경우 실행되는 코드
          }))
          .catch(error => {
            // 요청 중 하나라도 실패한 경우 실행되는 코드
            console.error(error);
          });
      }
    }
  };

  useEffect(() => {
    // 기업 리스트와 태그 정보 동시에 가져오기
    const fetchData = async () => {

      try {
        const [companyListResponse, tagListResponse, feedListResponse, adminDataResponse, totalTokenResponse] = await axios.all([
          axios.get(serverIP + '/companies'),
          axios.get(serverIP + '/tags'),
          axios.get(serverIP + '/feeds/admins'),
          axios.get(serverIP + '/admins'),
          axios.get(serverIP + '/admins/totals'),

        ]);

        const companyListData = companyListResponse.data.data;
        const tagListData = tagListResponse.data.data;
        const feedListData = feedListResponse.data.data;
        const adminsData = adminDataResponse.data.data;
        const totalToken = totalTokenResponse.data.data;

        setFeedList(feedListData);
        setHaveDon(adminsData);
        setTotalDon(totalToken);

        if (Array.isArray(companyListData) && Array.isArray(tagListData)) {
          const updatedImageList = companyListData.map((data, index) => {
            const imageInfo = {
              id: data[0],
              name: data[1],
              bucketName: data[2],
              imageName: data[3],
              tagArray: tagListData[index] && tagListData[index][1] ? tagListData[index][1].split('/') : [],
              tokenvalue: data[4],
              href: `managemain/${data[0]}`
            };

            return imageInfo;
          });
          setImageList(updatedImageList);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const tagprint = (arr) => {
    return arr.map((tag, index) => (
      <span
        className="inline-flex w-full h-full items-center d-flex justify-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
        key={index}
      >
        {tag}
      </span>
    ));
  };

  const handleSearch = () => {
    if (searchTerm === "") {
      return imageList;
    } else {
      return imageList.filter((product) => {
        // 기업 이름 또는 태그에서 검색어를 포함하는지 확인
        const includesName = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const includesTag = product.tagArray.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return includesName || includesTag;
      });
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  return (
    <EthProviderManage>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-white py-3 shadow z-10">
          <div className="container px-5">
            <a className="navbar-brand" href="/">
              <span className="fw-bolder text-primary">ESGSE</span>
            </a>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 small fw-bolder">
              <li className="nav-item">
                <a className="nav-link" href="/managemain">관리자 페이지</a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="bg-white">
          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div className="mx-auto max-w-2xl px-4 pt-4 pb-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
              <div className="mb-3 grid grid-cols-2">
                <div>
                  <div className="d-flex justify-between">
                    <h2 className="text-4xl font-bold tracking-tight">보유 코인</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mr-3">
                    <div>
                      보유 코인
                      <div className="card p-3 mb-3">
                        <p className="text-indigo-600 fw-bolder m-0" id="balance">{havedon} don</p>
                      </div>
                    </div>
                    <div>
                      전체 코인
                      <div className="card p-3 mb-3">
                        <p className="text-indigo-600 fw-bolder m-0" id="total">{totaldon} don</p>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-between">
                    <h2 className="text-4xl font-bold tracking-tight">전체 코인량 조절</h2>
                  </div>
                  <div className="grid grid-cols-3 mb-3 place-content-center">
                    <input
                      type="number"
                      name="price"
                      value={custom}
                      id="priceID"
                      onChange={handleCustom}
                      className="border-0 mx-3 w-1/8 pl-3 text-gray-900 ring-2 ring-inset ring-indigo-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 h-full rounded-md text-xl"
                      placeholder="100"
                    />
                    <button
                      onClick={() => handleHavedon(0, custom)}
                      className="flex mx-3 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      id="increase"
                    >
                      증가
                    </button>
                    <button
                      onClick={() => handleHavedon(1, custom)}
                      className="flex mx-3 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      id="decrease"
                    >
                      감소
                    </button>
                  </div>
                  <div className="d-flex justify-between">
                    <h2 className="text-4xl font-bold tracking-tight">악용 고객 코인 회수</h2>
                  </div>
                  <div className="grid grid-cols-3 place-content-center">
                    <input
                      type="number"
                      name="price"
                      id="priceC"
                      onChange={handleTake}
                      className="border-0 mx-3 w-1/8 pl-3 text-gray-900 ring-2 ring-inset ring-indigo-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 h-full rounded-md text-xl"
                      placeholder="100"
                    />
                    <input
                      type="text"
                      name="bcid"
                      id="companyId"
                      // onChange={handledon}
                      className="border-0 mx-3 w-1/8 pl-3 text-gray-900 ring-2 ring-inset ring-indigo-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 h-full rounded-md text-xl"
                      placeholder="블록체인 ID"
                    />

                    <button
                      className="flex mx-3 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      id="confiscate"
                    >
                      몰수
                    </button>
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-between">
                    <h2 className="text-4xl font-bold tracking-tight">관리자 피드</h2>
                  </div>
                  <div className="card overflow-hidden shadow rounded-4 border-0 mb-5">
                    <div className="card-body p-0 h-80">
                      <div className="border-0 rounded-4 h-full w-full p-4 overflow-y-scroll">
                        {FeedData.map((feed) => (
                          <div
                            className="flex justify-between border-solid border-2 border-indigo-600 px-3 py-3 mb-2 rounded-md"
                            key={feed.time}
                          >
                            <div className="w-3/5">
                              <p className="text-secondary fw-bolder m-0">{
                                feed.content.slice(0, -7)
                              }</p>
                              <p className="text-secondary fw-bolder m-0">
                                {feed.content.slice(-7)}
                              </p>
                            </div>
                            <div className="commentMargin" style={{ marginRight: '15px' }}>
                              <span className="commentLabel">{feed.time}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <NewUserList />
              <div className="d-flex justify-between">
                <h2 className="text-4xl font-bold tracking-tight">기업 리스트</h2>
                <div>
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="border border-gray-300 rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-indigo-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {handleSearch().map((product) => (
                  <a href={product.href}>
                    <div key={product.id} className="group relative">
                      <div className="min-h-80 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                        <img
                          src={"https://" + product.bucketName + S3URL + product.imageName}
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                          alt={product.name}
                        />
                      </div>
                      <div className="mt-4 flex justify-between w-auto">
                        <div className="w-full">
                          <h3 className="text-sm text-gray-700">

                            <div className="flex justify-between">
                              <div>
                                {product.name}
                              </div>
                              <div className="text-indigo-600 fw-bolder">
                                금액 달성률 : {product.tokenvalue}%
                              </div>
                            </div>
                          </h3>
                          <div className="grid gap-x-1 gap-y-4 grid-cols-3 w-full h-1/2 items-center">
                            {tagprint(product.tagArray)}
                          </div>
                        </div>
                      </div>

                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </EthProviderManage>
  );
}
