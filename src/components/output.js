import React, { Component } from 'react';

const Output = (props) => {

  return (
    <div id='output' className='text-right'>
      {props.display ? props.display : 0}
    </div>
  );
}

export default Output;
