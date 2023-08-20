import { useReducer } from 'react'
import './App.scss'
import DigitButton from './DigitButton'
import OperationButton from './OperationButton'

export const ACTIONS = {
  ADD_DIGITS:'add-digit',
  EVALUATE:'evaluate',
  CLEAR:'clear',
  DELETE_DIGIT:'delete-digit',
  CHOOSE_OPERATION:'choose-operation'

}

function reducer(state, {type, payload}){
  switch(type){
    case ACTIONS.ADD_DIGITS:
      if(state.overwrite){
        return {
          ...state,
          currentOperand:payload.digit,
          overwrite:false
        }
      }
      if(payload.digit === "0" && state.currentOperand === "0"){ 
        return state
      }
      if(!state.currentOperand && payload.digit === "."){
         return {
          ...state,
          currentOperand:'0.'
         }
      }
      if(state.currentOperand && payload.digit === "." && state.currentOperand.includes('.')){ 
        return state
      }
      return {
        ...state,
        currentOperand:`${state.currentOperand || ''}${payload.digit}` 
      }
    case ACTIONS.DELETE_DIGIT:
      if(state.overwrite){
        return{
          ...state, 
          overwrite:false,
          currentOperand:null
        }
      }
      if(state.currentOperand==null) return state
      if(state.currentOperand.length===1){
        return {...state, currentOperand:null}
      }
      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand==null && state.previousOperand==null){
        return state
      }
      if(state.currentOperand == null){
        return {
          ...state, 
          operand:payload.operation
        }
      }
      if(state.previousOperand == null){
        return{
          ...state, 
          operand:payload.operation,
          previousOperand:state.currentOperand,
          currentOperand:null
        }
      }
      return{
        ...state,
        previousOperand:evaluate(state),
        operand:payload.operation,
        currentOperand:null
      }
    case ACTIONS.EVALUATE:
      if(state.operand == null || state.currentOperand == null || state.previousOperand == null){
        return state
      }
      return{
        ...state,
        overwrite:true,
        operand:null,
        previousOperand:null,
        currentOperand:evaluate(state),
      }
  }
}

function evaluate({currentOperand,previousOperand,operand}){
  const prev=parseFloat(previousOperand)
  const curr=parseFloat(currentOperand)
  if(isNaN(prev)||isNaN(curr)) return ""
  let computation=''
  switch(operand){
    case '+':
      computation = prev+curr
      break
    case '-':
      computation = prev-curr
      break
    case '*':
      computation = prev*curr
      break
    case '/':
      computation = prev/curr
      break
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {maximumFractionDigits:0})

function formatOperand(oper){
  if(oper == null) return 
  const [integer, decimal] = oper.split('.')
  if(decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operand}, dispatch] = useReducer(reducer, {})


  return (
    <>
      <div className='calculator-grid'>
        <div className='output'>
          <div className='previousOperand'>{formatOperand(previousOperand)}{operand}</div>
          <div className='currentOperand'>{formatOperand(currentOperand)}</div>
        </div>
        <button className='span-two' onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
        <button onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OperationButton operation='/' dispatch={dispatch} />
        <DigitButton digit='1' dispatch={dispatch} />
        <DigitButton digit='2' dispatch={dispatch} />
        <DigitButton digit='3' dispatch={dispatch} />
        <OperationButton operation='*' dispatch={dispatch} />
        <DigitButton digit='4' dispatch={dispatch} />
        <DigitButton digit='5' dispatch={dispatch} />
        <DigitButton digit='6' dispatch={dispatch} />
        <OperationButton operation='-' dispatch={dispatch} />
        <DigitButton digit='7' dispatch={dispatch} />
        <DigitButton digit='8' dispatch={dispatch} />
        <DigitButton digit='9' dispatch={dispatch} />
        <OperationButton operation='+' dispatch={dispatch} />
        <DigitButton digit='.' dispatch={dispatch} />
        <DigitButton digit='0' dispatch={dispatch} />
        <button className='span-two' onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>
      </div>
    </>
  )
}

export default App
