import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
// 백 데이터 전송용
import { serverIP, dgbID } from "../../config.jsx";
import axios from "axios";

function EthProviderEvent({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // dgb 컨트랙트 초기화
  const dgbInit = useCallback(
    async dgbArtifact => {
      if (dgbArtifact) {
        const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        const accounts = await web3.eth.requestAccounts();
        const networkID = await web3.eth.net.getId();
        const { abi } = dgbArtifact;
        let address, contract;

        try {
          address = dgbArtifact.networks[networkID].address;
          contract = new web3.eth.Contract(abi, address);

          await dgbRewardBind(contract);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { dgbArtifact, web3, accounts, networkID, contract }
        });
      }
    }, []);

  // dgb 함수 - reward 보상 - event 페이지
  // "리뷰 게시" 버튼 연결
  // reward 후 트랜잭션 DB에 저장
  const dgbRewardBind = async (instance) => {
    try {
      // 변수 선언
      let dgbInstance, don, fromAcc, txid;
      dgbInstance = instance;
      fromAcc = window.web3.currentProvider.selectedAddress.toString();

      // 리뷰 게시 (dgb -> user)
      const reviewButton = document.getElementById("review");
      reviewButton.addEventListener("click", function () {
        don = 10;
        dgbInstance.methods.reward(don).send({ from: fromAcc }).then(async function (receipt) {
          txid = receipt.transactionHash;
          await dgbBack(txid, fromAcc, dgbID, don);
        }).catch(function (err) {
          console.log(err.message);
        })
      });

    } catch (err) {
      console.error(err);
    }
  };

  // Back 서버로 데이터 넘기기
  const dgbBack = async (txid, to, from, value) => {
    try {
      // 변수 선언
      const companyId = document.getElementById("companyId").textContent;
      const eventIdx = document.getElementById("eventIdx").textContent;
      let request, data

      data = {
        "transid": txid,
        "fromid": from,
        "toid": to,
        "value": value,
      };

      request = axios.post(serverIP + "/transactions/reviews", JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      axios.all([request])
        .then(axios.spread((response) => {
          console.log(response.data);
        }))
        .catch(error => {
          console.error(error);
        });

      alert("리뷰 등록과 트랜잭션 기록이 성공적으로 완료되었습니다.");
      document.location.href = `/event/${companyId}/${eventIdx}`;

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const tryInit = async () => {
      try {
        const dgbArtifact = require("../../contracts/DGB.json");
        dgbInit(dgbArtifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [dgbInit]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      dgbInit(state.dgbArtifact);
    };

    events.forEach(e => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach(e => window.ethereum.removeListener(e, handleChange));
    };
  }, [dgbInit, state.dgbArtifact]);


  return (
    <EthContext.Provider value={{
      state,
      dispatch
    }}>
      {children}
    </EthContext.Provider>
  );
}

export default EthProviderEvent;
