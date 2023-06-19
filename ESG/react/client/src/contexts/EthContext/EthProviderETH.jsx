import React, { useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";

function EthProviderETH({ children }) {

  // 메타마스크 아이디 받아오기
  useEffect(() => {
    async function main() {
      try {
        // 웹3 연결
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        await ethSend(web3);
      } catch (error) {
        console.error(error);
      }


    }
    main();
  }, [])

  // 이더리움 송금 - managemain - newUserList 페이지
  // "ETH 전송" 버튼, 신규 회원 리스트 연결
  // 체크박스로 선택된 회원에게 이더리움 전송
  const ethSend = async (web3) => {
    try {
      // 변수 선언
      const fromAcc = window.ethereum.selectedAddress.toString();
      const sendButton = document.getElementById("send");
      sendButton.addEventListener("click", function () {

        const selectedEls = document.querySelectorAll("input[type='checkbox']:checked");
        selectedEls.forEach((el) => {
          // 이더리움 전송
          web3.eth.sendTransaction({
            from: fromAcc,
            to: el.name,
            value: web3.utils.toWei('50', 'ether')
          }).then(async function (receipt) {
            console.log(receipt.transactionHash);
          }).catch(function (err) {
            console.log(err.message);
          })
        });
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <EthContext.Provider>
      {children}
    </EthContext.Provider>
  );
}

export default EthProviderETH;