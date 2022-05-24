import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import { Select } from 'antd';

import { useGetAccountInfo } from '@elrondnetwork/dapp-core';

import { routeNames } from 'routes';

import CEOImage from '../../assets/img/team/CEO.png';

import './index.scss';

const { Option } = Select;

const Breeding = () => {

  const navigate = useNavigate();
  const { address } = useGetAccountInfo();
  const isLoggedIn = Boolean(address);

  const handleChange = (value: { value: string; label: React.ReactNode }) => {
    console.log(value); // { value: "lucy", key: "lucy", label: "Lucy (101)" }
  };

  return (
    <>
      <Container className='custom-breeding-container'>
        <Row>
          <Col lg={1} md={1} sm={12}></Col>
          <Col lg={4} md={4} sm={12}>
            <div className='nft-male-collection'>
              <h3 className='nft-type'>Male (ORC-248190)</h3>
              <Select
                className='nft-selector'
                labelInValue
                defaultValue={{ value: 'ORC-248190-01', label: 'ORC-248190-01' }}
                onChange={handleChange}
              >
                <Option value='ORC-248190-01'>ORC-248190-01</Option>
                <Option value='ORC-248190-02'>ORC-248190-02</Option>
                <Option value='ORC-248190-03'>ORC-248190-03</Option>
              </Select>
              <img src={CEOImage} className='nft-image'></img>
            </div>
          </Col>
          <Col lg={2} md={2} sm={12} className='nft-plus'>
            <h1 className='nft-breeding-text'> + </h1>
          </Col>
          <Col lg={4} md={4} sm={12}>
            <div className='nft-female-collection'>
              <h3 className='nft-type'>Female (ORC-248190)</h3>
              <Select
                className='nft-selector'
                labelInValue
                defaultValue={{ value: 'ORC-248190-01', label: 'ORC-248190-01' }}
                onChange={handleChange}
              >
                <Option value='ORC-248190-01'>ORC-248190-01</Option>
                <Option value='ORC-248190-02'>ORC-248190-02</Option>
                <Option value='ORC-248190-03'>ORC-248190-03</Option>
              </Select>
              <img src={CEOImage} className='nft-image'></img>
            </div>
          </Col>
          <Col lg={1} md={1} sm={12}></Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Button className='nft-start-breeding-buttons'>Start Breeding</Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Breeding;
