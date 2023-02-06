import React from 'react'
import './Node.css'
export default function Node(props) {
    const {col,isFinish,isStart,isWall,onMouseDown,onMouseEnter,onMouseUp,row}=props;
    const extraClassName=isFinish?'node-finish':isStart? 'node-start':isWall?'node-wall':'';
  return (
    <td id={`node-${row}-${col}`} className={`node ${extraClassName}`} onMouseDown={()=>onMouseDown(row,col)} onMouseEnter={()=>onMouseEnter(row,col)} onMouseUp={()=>onMouseUp()}>
    </td>
  )
}
