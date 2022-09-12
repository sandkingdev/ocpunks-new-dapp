import Odin from '../../assets/Odin.svg';
import close from '../../assets/close.svg';
import React from 'react';

function History () {
    return (
        <div
          className='modal2'
          style={{marginBottom: '140px'}}
        >
          {/* <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <h3 className='font-24' style={{ fontWeight: 600, fontFamily: 'Chakra Petch' }}>Hey, nice to see you</h3>
          </div>
          <h4 className='font-16' style={{ fontWeight: 400, marginTop: '12px',fontFamily: 'Chakra Petch' }}>Your history is empty</h4> */}
          <div style={{display: 'flex', alignItems: 'center',flexDirection: 'column', gap: '30px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
              <img width='65px' src={Odin} />
              <div style={{marginLeft: '10px'}}>
                <h2 style={{fontFamily: 'Chakra Petch', marginTop: '0.4rem'}}>4 EGLD</h2>
                <p style={{fontFamily: 'Chakra Petch', color: '#ffa8a8'}}>Cacelled</p>
              </div>
              </div>
              <h3 style={{marginBottom: '17px'}}>20 MAR</h3>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
              <img width='65px' src={Odin} />
              <div style={{marginLeft: '10px'}}>
                <h2 style={{fontFamily: 'Chakra Petch', marginTop: '0.4rem'}}>6 EGLD</h2>
                <p style={{fontFamily: 'Chakra Petch', color: 'rgb(155, 195, 255)'}}>In Progress</p>
              </div>
              </div>
              <h3 style={{marginBottom: '17px'}}>14 MAR</h3>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
              <img width='65px' src={Odin} />
              <div style={{marginLeft: '10px'}}>
                <h2 style={{fontFamily: 'Chakra Petch', marginTop: '0.4rem'}}>3 EGLD</h2>
                <p style={{fontFamily: 'Chakra Petch', color: '#98eb98'}}>Successfully Accepted</p>
              </div>
              </div>
              <h3 style={{marginBottom: '17px'}}>8 MAR</h3>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
              <img width='65px' src={Odin} />
              <div style={{marginLeft: '10px'}}>
                <h2 style={{fontFamily: 'Chakra Petch', marginTop: '0.4rem'}}>7 EGLD</h2>
                <p style={{fontFamily: 'Chakra Petch', color: '#ffed52'}}>Sucessfully Sold</p>
              </div>
              </div>
              <h3 style={{marginBottom: '17px'}}>1 MAR</h3>
            </div>
          </div>
        </div>
    );
}

export default History;