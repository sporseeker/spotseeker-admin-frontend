/**
 *
 * ScannerInputField
 *
 */

 import React, { useState, useEffect, useRef, useReducer } from 'react'
 import * as propTypes from 'prop-types'
 import styled from 'styled-components'
 
 const ScannerInputWrapper = styled.input`
   visibility: hidden
   display: none
   width: 0%
 `
 const initialState = {
   barcodeInProgress: false,
   barcodeComplete: false,
   value: ''
 }
 
 const keyDownReducer = (state = initialState, e) => {
   if ((e.shiftKey || e.ctrlKey || e.altKey) && e.key.length > 1) {
     return state
   }
 
   if (e.key === '<') {
     return { ...state, barcodeInProgress: true }
   }
 
   if (e.key === '`') {
     return { ...state, barcodeInProgress: false, barcodeComplete: true }
   }
 
   if (e.key === '_') {
     return {
       ...state,
       barcodeInProgress: false,
       barcodeComplete: false,
       value: ''
     }
   }
 
   if (e.key.length === 1) {
     return { ...state, value: state.value + e.key }
   }
 
   return state
 }
 
 // the current app context would be passed in as a prop to this function
 function ScannerInputField({
   handleScannerInput,
   isScannerInputDisabled,
   isDisabled
 }) {
   const inputRef = useRef(null)
   const [state, dispatch] = useReducer(keyDownReducer, initialState)
   const [Nullarised, setNull] = useState('')
 
   const handleKeysViaReducer = e => {
    e.preventDefault()
    dispatch(e)
  }

   useEffect(() => {
     if (state.barcodeComplete) {
       handleScannerInput(state.value)
       // startFromFresh
       dispatch(new KeyboardEvent('keypress', { key: '_' }))
     }
   }, [state.barcodeComplete])
 
   useEffect(() => {
     document.addEventListener('keydown', handleKeysViaReducer)
 
     return () => document.removeEventListener('keydown', handleKeysViaReducer)
   }, [state])
 
   // focus on the text box at all points. Context awareness will need to come into this.
   useEffect(() => {
     inputRef.current.focus()
     inputRef.current.select()
   }, [])
 
   return (
     <ScannerInputWrapper
       type="text"
       onChange={value => setNull(value)}
       value={state.value}
       disabled={isDisabled || isScannerInputDisabled}
       ref={inputRef}
       tabIndex={-1}
     />
   )
 }
 
 ScannerInputField.propTypes = {
   handleScannerInput: propTypes.func.isRequired,
   isScannerInputDisabled: propTypes.bool.isRequired,
   isDisabled: propTypes.bool.isRequired
 }
 
 ScannerInputWrapper.whyDidYouRender = false
 
 export default ScannerInputField