import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Dropdown, Form, Table } from 'react-bootstrap';
import axios from 'axios';

import {
  refreshAccount,
  sendTransactions,
  useGetAccountInfo,
  useGetNetworkConfig,
  useGetPendingTransactions,
} from '@elrondnetwork/dapp-core';
import {
  Address,
  AbiRegistry,
  SmartContractAbi,
  SmartContract,
  Balance,
  Interaction,
  QueryResponseBundle,
  ProxyProvider,
  GasLimit,
  ContractFunction,
  U32Value,
  ArgSerializer,
  OptionalValue,
  TypedValue,
  BytesValue,
  BigUIntValue,
} from '@elrondnetwork/erdjs';

import {
  convertWeiToEgld,
  convertEsdtToWei,
  formatNumbers
} from '../../utils/convert';

import { sendQuery } from '../../utils/transaction';

import {
  FLIP_CONTRACT_ADDRESS,
  FLIP_CONTRACT_ABI_URL,
  FLIP_CONTRACT_NAME,
  FLIP_GAS_LIMIT,
  FLIP_LAST_TX_SEARCH_COUNT,
  TIMEOUT,
  REWARD_TOKEN_DECIMAL,
  STAKE_TOKEN_ID,
  GATEWAY,
} from '../../config';

import {
  TOKENS
} from 'data';

// import {ZogIcon} from '../../assets/movie/animation.mp4';
import WinLogo from '../../assets/img/win.webp';
import LoseLogo from '../../assets/img/lose.webp';
import CoinLogo from '../../assets/img/coin.gif';

import './index.scss';

function printNumber(v: any) {
  const integral = Math.floor(v);
  let fractional = Math.floor((v - integral) * 100).toString();
  if (fractional.length == 1) fractional = '0' + fractional;
  else if (fractional.length == 0) fractional = '00';

  return (
    <>
      <span className='text2'>{integral.toLocaleString()}</span>
    </>
  );
}

function printAddress(v: any, len = 10) {
  return v.substring(0, len);
}


const Coinflip = () => {

  const { address } = useGetAccountInfo();
  const { hasPendingTransactions } = useGetPendingTransactions();
  const { network } = useGetNetworkConfig();
  const isLoggedIn = Boolean(address);
  const proxy = new ProxyProvider(network.apiAddress, { timeout: TIMEOUT });

  // modal
  // const [flipResultModalShow, setFlipResultModalShow] = React.useState<boolean>(false);
  const [flipResult, setFlipResult] = React.useState<boolean>(true);
  const [selectedTokenId, setSelectedTokenId] = React.useState<string>();

  const [balance, setBalance] = React.useState<any>();
  useEffect(() => {
    axios
      .get(`${GATEWAY}/accounts/${address}/tokens/${selectedTokenId}`)
      .then((res) => {
        const token = res.data;
        const balance = token['balance'] / Math.pow(10, token['decimals']);
        setBalance(balance);
      });
  }, [selectedTokenId, hasPendingTransactions]);

  // load smart contract abi and parse it to SmartContract object for tx
  const [contractInteractor, setContractInteractor] = React.useState<any>(undefined);
  React.useEffect(() => {
    (async () => {
      const nftAbiRegistry = await AbiRegistry.load({
        urls: [FLIP_CONTRACT_ABI_URL],
      });
      const contract = new SmartContract({
        address: new Address(FLIP_CONTRACT_ADDRESS),
        abi: new SmartContractAbi(nftAbiRegistry, [FLIP_CONTRACT_NAME]),
      });
      setContractInteractor(contract);
    })();
  }, []); // [] makes useEffect run once

  const [flipPacks, setFlipPacks] = React.useState<any>();
  React.useEffect(() => {
    (async () => {
      if (!contractInteractor) return;
      const interaction: Interaction = contractInteractor.methods.getFlipPacks();

      const res: QueryResponseBundle | undefined = await sendQuery(contractInteractor, proxy, interaction);

      if (!res || !res.returnCode.isSuccess()) return;
      const items = res.firstValue?.valueOf();

      const flipPacks: any = {};
      for (const [_, item] of items) {
        const token_id = item.token_id.toString();
        const lp_fee = item.lp_fee.toNumber();
        const treasury_fee = item.treasury_fee.toNumber();
        const fee = (lp_fee + treasury_fee) / 100;

        const amounts = [];
        for (const amount of item.amounts) {
          amounts.push(convertWeiToEgld(amount, TOKENS[token_id].decimals));
        }

        const flipPack = {
          token_id,
          ticker: TOKENS[token_id].ticker,
          fee,
          amounts,
        };

        flipPacks[flipPack.token_id] = flipPack;
      }

      // ids = ids.sort();
      // const newFlipPacks = {};
      // const EGLD_ID = 'EGLD';
      // newFlipPacks[EGLD_ID] = flipPacks[EGLD_ID];
      // for (const id of ids) {
      //   if (id != EGLD_ID) {
      //     newFlipPacks[id] = flipPacks[id];
      //   }
      // }

      setFlipPacks(flipPacks);
      // console.log('Items: ', flipPacks);

    })();
  }, [contractInteractor]);

  const [sessionId, setSessionId] = React.useState<number>(0);
  const [flipTxs, setFlipTxs] = React.useState<any>();
  React.useEffect(() => {
    (async () => {
      if (!contractInteractor || hasPendingTransactions) return;
      const interaction = contractInteractor.methods.viewLastFlips([new U32Value(10)]);
      const res: QueryResponseBundle | undefined = await sendQuery(contractInteractor, proxy, interaction);

      if (!res || !res.returnCode.isSuccess()) return;
      const items = res.firstValue?.valueOf();
      // console.log('viewLastFlips', items);

      const flipTxs = [];
      for (const item of items) {
        const token_id = item.token_id.toString();
        const ticker = TOKENS[token_id].ticker;
        const amount = convertWeiToEgld(item.amount, TOKENS[token_id].decimals);
        const user_address = item.user_address.toString();
        const timestamp = new Date(item.timestamp.toNumber() * 1000);
        const success = item.success;

        const flipTx = {
          token_id,
          ticker,
          amount,
          user_address,
          timestamp,
          success,
        };

        flipTxs.push(flipTx);
      }
      // console.log('flipTxs', flipTxs);
      setFlipTxs(flipTxs);

      // check for result of last flip tx
      if (sessionId && flipTxs && flipTxs.length > 0 && !hasPendingTransactions) {
        const count = Math.min(FLIP_LAST_TX_SEARCH_COUNT, flipTxs.length);
        for (let i = 0; i < count; i++) {
          const flipTx = flipTxs[i];

          if (flipTx.user_address == address) {
            setFlipResult(flipTx.success);
            // setFlipResultModalShow(true);

            setSessionId(0);
            return;
          }
        }
      }
    })();
  }, [contractInteractor, hasPendingTransactions]);

  function onTokenIdMenuSelect(token_id: any) {
    // console.log('token_id', token_id);
    setSelectedTokenId(token_id);
  }

  // if flipPacks are changed, select the first tokens as selectedTokenId
  React.useEffect(() => {
    if (flipPacks) {
      for (const [key, value] of Object.entries(flipPacks)) {
        setSelectedTokenId(key);
        return;
      }
    }
  }, [flipPacks]);

  const [selectedAmountId, setSelectedAmountId] = React.useState<number>(0);
  function onAmountButtonClick(e: any) {
    setSelectedAmountId(e.currentTarget.value);
  }

  const [flipButtonDisabled, setFlipButtonDisabled] = React.useState<boolean>(true);
  const [flipButtonText, setFlipButtonText] = React.useState<string>('-');
  React.useEffect(() => {
    let flipButtonDisabled = true;
    let flipButtonText = '-';
    if (!isLoggedIn) {
      flipButtonText = 'Connect Wallet';
    } else if (selectedTokenId) {
      try {
        // console.log('selectedTokenId', selectedTokenId);
        // console.log('selectedAmountId', selectedAmountId);
        // console.log('selectedTokenBalance', balance);
        // console.log('flipPacks[selectedTokenId].amounts[selectedAmountId]', flipPacks[selectedTokenId].amounts[selectedAmountId]);
        if (balance >= flipPacks[selectedTokenId].amounts[selectedAmountId]) {
          flipButtonDisabled = false;
          flipButtonText = 'Bet Now';
        } else {
          flipButtonText = 'Not Enough Balance';
        }
      } catch (e: any) {
        console.log(e);
      }
    }
    // console.log(flipButtonText);

    setFlipButtonDisabled(flipButtonDisabled);
    setFlipButtonText(flipButtonText);
  }, [isLoggedIn, selectedTokenId, selectedAmountId, balance, flipPacks]);


  const [flipType, setFlipType] = useState(0);
  const [headStyle, setHeadStyle] = useState('choose-button select-type-button');
  const [tailStyle, setTailStyle] = useState('choose-button ');

  const handleFlipType = (type: any) => {
    if (type === 1) {
      // head
      setHeadStyle('choose-button select-type-button');
      setTailStyle('choose-button');
      setFlipType(1);
    } else if (type === 0) {
      // tail
      setHeadStyle('choose-button');
      setTailStyle('choose-button select-type-button');
      setFlipType(0);
    }
  };

  async function flip() {
    if (!address) return;
    if (!selectedTokenId) return;

    const amount = flipPacks[selectedTokenId].amounts[selectedAmountId];
    const amountInWei: any = convertEsdtToWei(amount, TOKENS[selectedTokenId].decimals);

    const args: TypedValue[] = [
      BytesValue.fromUTF8(selectedTokenId),
      new BigUIntValue(Balance.fromString(amountInWei.valueOf()).valueOf()),
      BytesValue.fromUTF8('flip'),
      new U32Value(flipType),
    ];
    const { argumentsString } = new ArgSerializer().valuesToString(args);
    const data = `ESDTTransfer@${argumentsString}`;

    const tx = {
      receiver: FLIP_CONTRACT_ADDRESS,
      gasLimit: new GasLimit(FLIP_GAS_LIMIT),
      data: data,
    };

    await refreshAccount();
    const { sessionId } = await sendTransactions({
      transactions: tx,
    });

    if (sessionId) {
      setSessionId(parseInt(sessionId));
    }
  }


  return (
    <div className='container'>
      {/* <div className='row justify-content-center'>
        <video loop autoPlay>
          <source
            src='../../assets/movie/animation.mp4'
            type='video/mp4'
          />
        </video>
      </div> */}
      <div className='row justify-content-center'>
        <img src={CoinLogo} className='project-logo'></img>
        {/* {flipResult ? (
          <img src={WinLogo} className='project-logo'></img>
        ) : (
          <img src={LoseLogo} className='project-logo'></img>
        )} */}
      </div>
      <div className='row justify-content-center mt-3'>
        <p className='flip-type'>I choose</p>
      </div>
      <div className='row'>
        <div className='col-lg-3 col-md-3 col-sm-12 col-xs-12'></div>
        <div className='col-lg-3 col-md-3 col-sm-12 col-xs-12 head-container'>
          <button className={headStyle} onClick={() => handleFlipType(1)}>HEADS</button>
        </div>
        <div className='col-lg-3 col-md-3 col-sm-12 col-xs-12 tail-container'>
          <button className={tailStyle} onClick={() => handleFlipType(0)}>TAILS</button>
        </div>
        <div className='col-lg-3 col-md-3 col-sm-12 col-xs-12'></div>
      </div>
      <div className='row justify-content-center mt-3'>
        <p className='bet-type'>and I bet the</p>
        <Dropdown onSelect={onTokenIdMenuSelect} drop='end'>
          <Dropdown.Toggle className='token-id-toggle' id="token-id">
            {selectedTokenId && TOKENS[selectedTokenId] && (
              <>
                <span>$ {TOKENS[selectedTokenId].ticker}</span>
                {/* <img src={TOKENS[selectedTokenId].url} /> */}
              </>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu className='token-id-menu'>
            {
              flipPacks && Object.keys(flipPacks).map((key, index) => (
                <Dropdown.Item eventKey={key} key={`token-id-menu-item-${key}`}>
                  <span>{flipPacks[key].ticker}</span>
                  {/* <img src={TOKENS[key].url} /> */}
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className='row'>
        <Container>
          <Row className='amount-contanier'>
            {
              flipPacks && selectedTokenId && flipPacks[selectedTokenId].amounts.map((v: any, index: any) => (
                <Col xs={6} key={`token-amount-col-${index}`} className='amount-button mt-2'>
                  <button
                    className={index == selectedAmountId ? 'choose-button select-type-button' : 'choose-button'}
                    key={`token-amount-${index}`}
                    value={index}
                    onClick={onAmountButtonClick}
                  >
                    {printNumber(v)}{' '}{flipPacks[selectedTokenId].ticker}
                  </button>
                </Col>
              ))
            }
          </Row>

          <div className='row justify-content-center mt-3'>
            <button
              className='flip-button'
              onClick={flip}
              disabled={flipButtonDisabled}
            >
              {flipButtonText}
            </button>
          </div>

          <div className='history-container'>
            {
              flipTxs && flipTxs.map((v: any, index: any) => (
                <Row className='history-row' key={`flip-tx-row-${index}`}>
                  <Col
                    sm={12}
                    className='history-text'
                    key={`flip-tx-text-${index}`}
                  >
                    Wallet ({printAddress(v.user_address)}...)
                    {v.success ? ' flipped ' : ' rolled '}
                    {printNumber(v.amount)}
                    {' '}${v.ticker} and
                    <span className={v.success ? 'win' : 'lose'}>{v.success ? ' doubled' : ' got pwned'}</span>
                  </Col>
                </Row>
              ))
            }
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Coinflip;
