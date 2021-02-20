import React, { Component } from 'react';
import hydroLogo from '../hydro-logo.png';

class Navbar extends Component {
    render() {
       // <input type="checkbox" id="switch" /><label for="switch">Toggle</label>
        return (
            <div className='navbar-border'>
                 <div className='navbar'>
                 <img className="navLogo" src={hydroLogo} border={1} alt="Ditto logo" width={20}></img>
                
               </div>
            </div>
            
        );
    }
}

export default Navbar;