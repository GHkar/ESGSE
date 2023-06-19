import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";
// 백 데이터 전송용
import { serverIP, dgbID } from "../../config.jsx";
import axios from "axios";

function EthProviderCompany({ children }) {
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

          await dgbTransferBind(contract);
        } catch (err) {
          console.error(err);
        }
        dispatch({
          type: actions.init,
          data: { dgbArtifact, web3, accounts, networkID, contract }
        });
      }
    }, []);


  // dgb 함수 - transfer 송금 / reward 보상 - company 페이지
  // "기부하기" 버튼, "댓글 게시" 버튼 연결
  // transfer, reward 후 트랜잭션 DB에 저장
  const dgbTransferBind = async (instance) => {
    try {
      // 변수 선언
      let dgbInstance, don, toAcc, fromAcc, txid;
      dgbInstance = instance;
      fromAcc = window.web3.currentProvider.selectedAddress.toString();

      // 기부하기 (user -> company)
      const donationButton = document.getElementById("donation");
      donationButton.addEventListener("click", function () {
        don = parseInt(document.getElementById("price").value, 10);
        toAcc = document.getElementById("toAcc").textContent;
        dgbInstance.methods.transfer(toAcc, don).send({ from: fromAcc }).then(async function (receipt) {
          txid = receipt.transactionHash;
          await dgbBack(txid, toAcc, fromAcc, don, "donations");
        }).catch(function (err) {
          console.log(err.message);
        })
      });

      // 댓글 게시 (dgb -> user)
      const commentButton = document.getElementById("comment");
      commentButton.addEventListener("click", function () {
        don = 1;
        dgbInstance.methods.reward(don).send({ from: fromAcc }).then(async function (receipt) {
          txid = receipt.transactionHash;
          await dgbBack(txid, fromAcc, dgbID, don, "comments");
        }).catch(function (err) {
          console.log(err.message);
        })
      });


    } catch (err) {
      console.error(err);
    }
  };

  // Back 서버로 데이터 넘기기
  const dgbBack = async (txid, to, from, value, _type) => {
    try {
      // 변수 선언
      let type, request, data
      const companyId = document.getElementById("companyId").textContent;

      type = _type;  //donations, commments

      data = {
        "transid": txid,
        "fromid": from,
        "toid": to,
        "value": value,
      };

      request = axios.post(serverIP + "/transactions/" + type, JSON.stringify(data), {
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

      alert("트랜잭션이 성공적으로 기록되었습니다.");
      document.location.href = `/home/company/${companyId}`

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

export default EthProviderCompany;
