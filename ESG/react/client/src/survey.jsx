import { useState, useEffect } from "react";
import Nav from "./navcompany";


export default function Survey() {
    const handleOptionChange = (questionIndex, event) => {
        const value = event.target.value;
        setSelectedOption(questionIndex, value);
    };
    const numberOfQuestions = 5; // 질문의 총 개수

    // 초기값 설정
    const initialOption = '1';

    const [selectedOptions, setSelectedOptions] = useState(
        Array(numberOfQuestions).fill(initialOption)
    );

    // 선택된 옵션들을 저장할 배열
    const setSelectedOption = (questionIndex, value) => {
        setSelectedOptions((prevOptions) => {
            const newOptions = [...prevOptions];
            newOptions[questionIndex] = value;
            return newOptions;
        });
    };
    // 선택된 옵션을 변경하는 함수
    const initialOptioncheckQ5 = [];
    const [selectedOptionsQ5, setSelectedOptionsQ5] = useState(Array(5).fill([...initialOptioncheckQ5]));

    useEffect(() => {
        setSelectedOptionsQ5(prevOptions => {
            const newOptions = [...prevOptions];
            newOptions[0] = ['1']; // 첫 번째 체크 박스 선택
            return newOptions;
        });
    }, []);

    const handleOptionChangecheck = (questionIndex, event, questionType) => {
        const value = event.target.value;

        if (questionType === "Q5") {
            setSelectedOptionsQ5((prevOptions) => {
                const newOptions = [...prevOptions];
                const isChecked = event.target.checked;
                if (isChecked) {
                    // 선택된 값인 경우 추가
                    if (!newOptions[questionIndex].includes(value)) {
                        newOptions[questionIndex] = [...newOptions[questionIndex], value];
                    }
                }
                else {
                    // 선택 해제된 값인 경우 제거
                    newOptions[questionIndex] = newOptions[questionIndex].filter(
                        (option) => option !== value
                    );
                }

                // 최소 하나 이상의 체크 박스가 선택되었는지 확인
                const isAtLeastOneChecked = newOptions.some((options) => options.length > 0);

                // 모든 체크 박스가 체크 해제된 경우 선택된 체크 박스를 다시 체크
                if (!isAtLeastOneChecked) {
                    newOptions[questionIndex] = [value];
                }
                return newOptions;
            });
        };
    }
    const jsonData = {
        P: {
            Q1: [selectedOptions[0]],
            Q2: [selectedOptions[1]],
            Q3: [selectedOptions[2]],
            Q4: [selectedOptions[3]],
            Q5: selectedOptionsQ5.map((options) => options.filter((value) => value.length > 0)).flat(),
        }
    };

    const jsonString = JSON.stringify(jsonData, (key, value) => {
        if (Array.isArray(value)) {
            // 배열인 경우 null 값을 제거하고 값이 있는 요소만 필터링
            const filteredArray = value.filter((item) => item !== null && item.length > 0);
            if (filteredArray.length > 0) {
                return filteredArray;
            }
        }
        return value;
    });
    localStorage.setItem('jsonP', jsonString);

    return (

        <div>
            <Nav />
            <div class="container px-5 my-5">
                <div className="fw-bolder text-3xl mb-3">
                    ESG-P(Publicize)
                </div>
                <div className="shadow p-3 rounded-4 border-solid border-2 border-indigo-600 mb-3">
                    <h3>Q1.</h3>
                    <p>조직의 홈페이지, 지속가능경영보고서, 사업보고서, 기타 간행물 등에 ESG 정보가 종합적으로 수록되어 있는지, ESG 정보공시 여부를 대외에 알리고 있습니까?</p>
                    <div className="grid gap-3 grid-rows-5 w-full" >
                        <ui><input type="radio" name="1" value="1" defaultChecked={selectedOptions[0] === "1"} onChange={(event) => handleOptionChange(0, event)} />조직이 어떠한 방식으로든 ESG 정보를 공시하지 않는다.</ui>
                        <ui><input type="radio" name="1" value="2" checked={selectedOptions[0] === "2"} onChange={(event) => handleOptionChange(0, event)} />조직의 홈페이지, 지속가능경영보고서, 사업보고서, 기타 간행물 등에 ESG 정보를 분산하여 공시하고 있다.</ui>
                        <ui><input type="radio" name="1" value="3" checked={selectedOptions[0] === "3"} onChange={(event) => handleOptionChange(0, event)} />조직의 홈페이지, 지속가능경영보고서, 사업보고서, 기타 간행물 등에 ESG 정보를 통합하여 공시하고 있다. </ui>
                        <ui><input type="radio" name="1" value="4" checked={selectedOptions[0] === "4"} onChange={(event) => handleOptionChange(0, event)} />ESG 정보를 통합한 조직의 홈페이지, 지속가능경영보고서, 사업보고서, 기타 간행물 등을 지정된 장소에 비치하거나, 특정 URL에 담고 있다.</ui>
                        <ui><input type="radio" name="1" value="5" checked={selectedOptions[0] === "5"} onChange={(event) => handleOptionChange(0, event)} />ESG 정보를 통합한 조직의 홈페이지, 지속가능경영보고서, 사업보고서, 기타 간행물 등의 발행여부를 ‘전자공시시스템-자율공시’ 사항으로 알린다.</ui>
                    </div>
                </div>
                <div className="shadow p-3 rounded-4 border-solid border-2 border-indigo-600 mb-3">
                    <h3>Q2.</h3>
                    <p>조직이 ESG 정보공시 일자, 또는 지속가능경영보고서 상 ‘발간 주기’를 확인하여 조직이 1년 단위로 ESG 정보를 공시하고 있습니까?</p>
                    <div className="grid gap-3 grid-rows-3 w-full">
                        <ui><input type="radio" name="2" value="1" defaultChecked={selectedOptions[1] === "1"} onChange={(event) => handleOptionChange(1, event)} />ESG 정보공시 주기를 특정할 수 없거나, 명시하고 있지 않다.</ui>
                        <ui><input type="radio" name="2" value="2" checked={selectedOptions[1] === "2"} onChange={(event) => handleOptionChange(1, event)} />2년 단위로 보고서 발간 및 ESG 정보를 공시하고 있다.</ui>
                        <ui><input type="radio" name="2" value="3" checked={selectedOptions[1] === "3"} onChange={(event) => handleOptionChange(1, event)} />1년 단위로 보고서 발간 및 ESG 정보를 공시하고 있다.</ui>
                    </div>
                </div>
                <div className="shadow p-3 rounded-4 border-solid border-2 border-indigo-600 mb-3">
                    <h3>Q3.</h3>
                    <p>조직의 영향력과 통제력이 미치는 사업장(자회사 포함)의 ESG 정보가 최대한 공시되고 있습니까?</p>
                    <div className="grid gap-3 grid-rows-5 w-full">
                        <ui><input type="radio" name="3" value="1" defaultChecked={selectedOptions[2] === "1"} onChange={(event) => handleOptionChange(2, event)} />ESG 정보공시 범위를 특정할 수 없거나, 명시하고 있지 않다.</ui>
                        <ui><input type="radio" name="3" value="2" checked={selectedOptions[2] === "2"} onChange={(event) => handleOptionChange(2, event)} />조직이 법적으로 직접 소유하고 있는 사업장(ex. 별도재무제표 기준)의 일부 또는 모든 ESG 정보를 공시하고 있다.</ui>
                        <ui><input type="radio" name="3" value="3" checked={selectedOptions[2] === "3"} onChange={(event) => handleOptionChange(2, event)} />조직의 영향력과 통제력 범위에 있는 곳(자회사, 종속법인, 연결실체 등)의 일부 ESG 정보를 공시하고 있다.</ui>
                        <ui><input type="radio" name="3" value="4" checked={selectedOptions[2] === "4"} onChange={(event) => handleOptionChange(2, event)} />조직의 영향력과 통제력 범위에 있는 곳(자회사, 종속법인, 연결실체 등)의 일부 ESG 정보를 공시하고 있다. 단, 조직의 영향력과 통제력 범위로 ESG 정보공시 범위를 확대한다는 계획을 제시하고 있다.</ui>
                        <ui><input type="radio" name="3" value="5" checked={selectedOptions[2] === "5"} onChange={(event) => handleOptionChange(2, event)} />조직의 영향력과 통제력 범위에 있는 곳(자회사, 종속법인, 연결실체 등)의 모든 ESG 정보를 공시하고 있다.</ui>
                    </div>
                </div>
                <div className="shadow p-3 rounded-4 border-solid border-2 border-indigo-600 mb-3">
                    <h3>Q4.</h3>
                    <p>조직이 사업적/사회적 영향력이 높은 핵심이슈에 대해 ‘위험 및 기회 요인’, ‘이슈 관리를 위한 시스템 및 절차’, ‘이슈 관리현황을 점검할 수 있는 성과지표’를 공시하고 있습니까?</p>
                    <div className="grid gap-3 grid-rows-5 w-full">
                        <ui><input type="radio" name="4" value="1" defaultChecked={selectedOptions[3] === "1"} onChange={(event) => handleOptionChange(3, event)} />중대성 평가 결과 또는 ESG 핵심이슈를 공시하고 있지 않다.</ui>
                        <ui><input type="radio" name="4" value="2" checked={selectedOptions[3] === "2"} onChange={(event) => handleOptionChange(3, event)} />중대성 평가 결과와 핵심이슈를 명확히 정의하고 있다.</ui>
                        <ui><input type="radio" name="4" value="3" checked={selectedOptions[3] === "3"} onChange={(event) => handleOptionChange(3, event)} />2단계 + 핵심이슈에 대해 조직이 관리하고 있는 성과지표를 설명하고 있다.</ui>
                        <ui><input type="radio" name="4" value="4" checked={selectedOptions[3] === "4"} onChange={(event) => handleOptionChange(3, event)} />3단계 + 핵심이슈가 사업적/사회적 관점에서 중요한 사유를 설명하고 있다.</ui>
                        <ui><input type="radio" name="4" value="5" checked={selectedOptions[3] === "5"} onChange={(event) => handleOptionChange(3, event)} />4단계 + 핵심이슈를 관리하기 위한 시스템 및 절차를 설명하고 있다.</ui>
                    </div>
                </div>
                <div className="shadow p-3 rounded-4 border-solid border-2 border-indigo-600 mb-3">
                    <h3>Q5.</h3>
                    <p>ESG 정보 검증의견서가 갖추어야 할 요건인 ‘검증기관의 적격성’, ‘검증기관과의 독립성’, ‘검증방법론의 합리성’, ‘검증수준의 명확성’, ‘검증지표의 구체성’이 충족되고 있습니까?</p>
                    <div className="grid gap-3 grid-rows-5 w-full">
                        <ui><input type="checkbox" name="5" value="1" checked={selectedOptionsQ5[0].includes("1")} defaultChecked={true} onChange={(event) => handleOptionChangecheck(0, event, "Q5")} />검증의견서에 검증기관(또는 검증인)이 명시되어 있다. </ui>
                        <ui><input type="checkbox" name="5" value="2" checked={selectedOptionsQ5[1].includes("2")} onChange={(event) => handleOptionChangecheck(1, event, "Q5")} />검증의견서에 검증기관과의 독립성 성명이 포함되어 있다.</ui>
                        <ui><input type="checkbox" name="5" value="3" checked={selectedOptionsQ5[2].includes("3")} onChange={(event) => handleOptionChangecheck(2, event, "Q5")} />검증의견서에 검증표준(방법론)이 제시되어 있다. </ui>
                        <ui><input type="checkbox" name="5" value="4" checked={selectedOptionsQ5[3].includes("4")} onChange={(event) => handleOptionChangecheck(3, event, "Q5")} />검증의견서에 ESG 정보 검증수준을 공개하고 있다. </ui>
                        <ui><input type="checkbox" name="5" value="5" checked={selectedOptionsQ5[4].includes("5")} onChange={(event) => handleOptionChangecheck(4, event, "Q5")} />검증의견서에 제3자 검증기관이 검증한 정보공시 지표가 적시되어 있다. </ui>
                    </div>
                </div>
                <div className="flex items-center justify-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <a aria-current="page" className="relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            1
                        </a>
                        <a href="/survey1" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" >
                            2
                        </a>
                        <a href="/survey2" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" >
                            3
                        </a>
                        <a href="/survey3" className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" >
                            4
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    );
}
