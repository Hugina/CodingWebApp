import * as React from 'react';

interface Props {
    children: string
    onClick: () => void; //what is it and why does it have a semicolon at the end? is this attribute a function?
    //first class citzen
    }

const Button = (props:Props) => {

  return (
    <button className= 'btn btn-primary' onClick={props.onClick}> {props.children}</button>
  )
}

export default Button