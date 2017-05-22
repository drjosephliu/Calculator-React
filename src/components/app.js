import React, {Component} from 'react';
import _ from 'lodash';
import math from 'mathjs';

import Output from './output';
import Footer from './footer';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      display: '',
      calc: '',
      equals: false
    };
    this.renderNumber = this.renderNumber.bind(this);
    this.renderOperator = this.renderOperator.bind(this);
    this.renderCalc = this.renderCalc.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.clearEntry = this.clearEntry.bind(this);
  }

  renderNumber(event) {
    const { value } = event.target;
    const currentNum = this.state.display;
    const currentCalc = this.state.calc;
    const last = _.last(this.state.calc);
    const checkDot = /\./g;

    if (value == '.' && currentNum.match(checkDot)) {
      if (isNaN(last) && last != '.') {
        this.setState({
          display: '0.',
          calc: currentCalc + '0.'
        });
      }
      else {
        console.log('Error! Invalid input');
      }
    }
    else if (currentNum.length >= 11 && !isNaN(last) && !this.state.equals) {
      console.log('Error! Number too long');
    }
    else if (value == '.' && isNaN(last) && last != '.') {
      this.setState({
        display: '0.',
        calc: currentCalc + '0.'
      });
    }
    else if (isNaN(last) && last != '.') {
      this.setState({
        display: value,
        calc: currentCalc + value
      })
    }
    else if (this.state.equals) {
      this.setState({
        display: value,
        calc: value,
        equals: false
      });
    }
    else {
      this.setState({
        display: currentNum + value,
        calc: currentCalc + value
      });
    }
  }

  renderOperator(event) {
    const { value } = event.target;
    const currentCalc = this.state.calc;
    const last = _.last(this.state.calc);
    const findLastOperator = /(?:\-|\+|\/|\*)(?=[^\-\+\/\*]*$)/;

    //If display is empty, assume it is zero
    if (!this.state.display && !currentCalc) {
      this.setState({
        calc: 0 + value
      });
    }
    // If last char is an operator, replace that with new operator
    else if (isNaN(last) && last != '.') {
      this.setState({
        calc: currentCalc.slice(0, -1) + value
      });
    }
    else if (currentCalc.match(findLastOperator) && !isNaN(last)) {
      this.renderCalc();
      const newCalc = this.state.calc;
      this.setState({
        calc: newCalc + value
      });
    }
    else {
      this.setState({
        calc: currentCalc + value
      });
    }
  }

  renderCalc() {
    const total = eval(this.state.calc);
    var totalPrecise;

    if (total > 1) {
      totalPrecise = math.format(total, { precision: 10 });

      this.setState({
        display: totalPrecise,
        calc: totalPrecise,
        equals: true
      });
    }
    else if (total == 0) {
      totalPrecise = total;

      this.setState({
        display: totalPrecise,
        calc: '',
        equals: true
      });
    }
    else if (total == Infinity || total == -Infinity) {
      totalPrecise = total;

      this.setState({
        display: totalPrecise,
        calc: '',
        equals: true
      });
    }
    else {
      totalPrecise = math.format(total, { precision: 9 });

      this.setState({
        display: totalPrecise,
        calc: totalPrecise,
        equals: true
      });
    }

  }

  clearAll() {
    this.setState({
      display: '',
      calc: ''
    });
  }

  clearEntry() {
    // Finds and truncates the last number in the calc string
    const findLastOperator = /(?:\-|\+|\/|\*)(?=[^\-\+\/\*]*$)/;
    const currentCalc = this.state.calc;
    const last = _.last(currentCalc);

    if (!currentCalc.match(findLastOperator)) {
      this.clearAll();
    }
    else if (isNaN(last) && last != '.') {
      const truncateOperator = currentCalc.slice(0, -1);

      this.setState({
        calc: truncateOperator
      });
    }
    else {
      const truncateCalc = currentCalc.slice(0, currentCalc.match(findLastOperator).index + 1);
      const lastOperator = _.last(truncateCalc);
      document.getElementById(lastOperator).focus();

      this.setState({
        display: '',
        calc: truncateCalc
      });

    }


  }

  render() {
    console.log('Calc:', this.state.calc);

    return (
      <div>
        <div className="container">
          <Output display={this.state.display}/>
          <div className='keypad'>
            <div className='left-three-columns'>
              <div className='even-keys'>
                <button onClick={this.clearAll}>AC</button>
                <button onClick={this.clearEntry}>CE</button>
                <button value='/100' onClick={this.renderOperator}>%</button>

                <button onClick={this.renderNumber} value='7'>7</button>
                <button onClick={this.renderNumber} value='8'>8</button>
                <button onClick={this.renderNumber} value='9'>9</button>

                <button onClick={this.renderNumber} value='4'>4</button>
                <button onClick={this.renderNumber} value='5'>5</button>
                <button onClick={this.renderNumber} value='6'>6</button>

                <button onClick={this.renderNumber} value='1'>1</button>
                <button onClick={this.renderNumber} value='2'>2</button>
                <button onClick={this.renderNumber} value='3'>3</button>
              </div>
              <div className='bottom-row'>
                <button onClick={this.renderNumber} value='0' id='zerobutton'>0</button>
                <button onClick={this.renderNumber} value='.'>.</button>
              </div>
            </div>

            <div className='right-column'>
              <button value='/' id='/' onClick={this.renderOperator}>&divide;</button>
              <button value='*' id='*' onClick={this.renderOperator}>x</button>
              <button value='-' id='-' onClick={this.renderOperator}>-</button>
              <button value='+' id='+' onClick={this.renderOperator}>+</button>
              <button value='=' onClick={this.renderCalc}>=</button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
