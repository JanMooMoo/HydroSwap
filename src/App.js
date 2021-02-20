import React, {Component} from 'react';
import './App.css';
import Navbar from './Components/Navbar';
import Countdown from './Components/Countdown';
import HydroLoader from './Components/HydroLoader';
import Web3 from 'web3';
import {hydro_swap_address, hydro_swap_abi} from './hydroSwap';







class App extends Component {
    constructor(props) {
      super(props);
      this.state = {

        toBlock:0,
        fromBlock:0,
        hydroSwap:[],
        deadline:0,
        network:'rinkeby',

        address_swaps:[],
        reservation_status:false,

        loading:true,
        blockError:[],
         
      }
  
    }


async connectWallet(){ 
  //let Web3 = require('web3');
  let ethereum = window.ethereum;
  let web3 = window.web3;

if(typeof ethereum !=='undefined'){
 await ethereum.enable();
 web3 = new Web3(ethereum);  
 
 window.ethereum.on('accountsChanged', function (accounts) {
  window.location.reload();
})
window.ethereum.on('networkChanged', function (netId) {
  window.location.reload();
})
   
    const network = await web3.eth.net.getNetworkType();
    const accounts = await web3.eth.getAccounts();
    const blockNumber = await web3.eth.getBlockNumber();
    if (this._isMounted){
    this.setState({blockNumber:blockNumber,
            account: accounts[0],
            network:network});
        }
    
    const hydroSwap = new web3.eth.Contract(hydro_swap_abi,hydro_swap_address);
      if (this._isMounted){
          this.setState({hydroSwap:hydroSwap});
      }

    const address_swaps = await hydroSwap.methods.checkArray().call()
      if (this._isMounted){
          this.setState({address_swaps:address_swaps},()=>console.log())
      }

    const reservation_status = await hydroSwap.methods.approvedUsers(this.state.account).call()
      if (this._isMounted){
          this.setState({reservation_status:reservation_status},()=>console.log())
        }
    const deadline = await hydroSwap.methods.deadline().call()
      if (this._isMounted){
          this.setState({deadline:new Date(parseInt(deadline,10)*1000)},()=>console.log())
          
        }

    hydroSwap.events.Approved({fromBlock:'latest', toBlock:'latest'})
    .on('data',async(log) => {  
   
      const address_swaps = await hydroSwap.methods.checkArray().call()
        if (this._isMounted){
          this.setState({address_swaps:address_swaps},()=>console.log())
        }
  
      const reservation_status = await hydroSwap.methods.approvedUsers(this.state.account).call()
        if (this._isMounted){
            this.setState({reservation_status:reservation_status},()=>console.log())
        }
    })
    this.setState({loading:false});
}

else if (typeof web3 !== 'undefined'){
console.log('Web3 Detected!')
window.web3 = new Web3(web3.currentProvider)


}

else{console.log('No Web3 Detected')
this.setState({loading:true})
          let Web3 = require('web3');
          const web3 = new Web3('wss://rinkeby.infura.io/ws/v3/72e114745bbf4822b987489c119f858b');
         
          const network = await web3.eth.net.getNetworkType();
          const accounts = await web3.eth.getAccounts();
          const blockNumber = await web3.eth.getBlockNumber();
          if (this._isMounted){
          this.setState({blockNumber:blockNumber});
          }
          if (this._isMounted){
          this.setState({account: accounts[0]}); 
          }
          
          const hydroSwap = new web3.eth.Contract(hydro_swap_abi,hydro_swap_address);
          if (this._isMounted){
              this.setState({hydroSwap:hydroSwap});
          }
      
          const address_swaps = await hydroSwap.methods.checkArray().call()
          if (this._isMounted){
             this.setState({address_swaps:address_swaps},()=>console.log())
          
          }
    
          this.setState({loading:false});
  } 

}



connect = (event)=>{
this.connectWallet()                    
}


reserve = () =>{
  this.state.hydroSwap.methods.getAirdropInBsc().send({from:this.state.account})
}
      
    

   render(){
    let connection = 'disabled';
    let disabled = true;
    if(this.state.account && this.state.network === 'rinkeby'){
      connection = 'search-button'
      disabled = false;
    }
    
  
  return (

   

    <div className="App">
      <Navbar/>
      
       <header className="App-header">

        <button className="search-button"  onClick={this.connect}>Connect Wallet</button>
        <button className={connection} type="button" disabled={disabled} onClick={this.reserve}> Reserve My Hydro </button>
        
        <p>{this.state.network === 'rinkeby'? '':'Wrong Network Please Switch to Rinkeby Network'}</p>

        <div className="body">
          <div className="row">
            <div className="column">
              <p className='disclaimer'>Connected Wallet Address: {this.state.account} </p>
         
              {this.state.reservation_status? <p className='disclaimer2'>Reservation Status:  Reserved</p>:<p className='disclaimer3'>Reservation Status:  No Reservation</p>}
          </div>
        </div>
         
         <div className="table-wrapper">
          <div>{<Countdown deadline={this.state.deadline}/>}</div>
              <table className="table-size">
                  <thead>
                  <tr>
                    <th>No.</th>
                    <th>Ethereum Address</th>            
                  </tr>
              </thead>
              
              <tbody>
              </tbody>
                {!this.state.loading && this.state.address_swaps.slice(0).reverse().map((swaps,index)=> <tr
                 className="cursor-pointer mt-2" key={index}>  
				        <td >{index + 1}</td>   
                <td> <a href={'https://rinkeby.etherscan.io/address/' + swaps} target='blank'>{swaps}</a></td>     
                </tr>  )}             
              </table> 
              {this.state.loading && <HydroLoader />}
             </div>
             <a className='footer'  href={'https://faucet.rinkeby.io/'} target='blank'>Rinkeby Test Ether Available Here</a>
     
         </div>
     </header>
     

    </div>
    
  );
}

componentDidMount() {
  this._isMounted = true; 
  this.connectWallet();
}


}


export default App;