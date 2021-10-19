import React, {useRef,useState} from 'react'
import auth from '../auth/auth-helper'
import io from "socket.io-client";
const mongoose = require("mongoose");


export default function CreateRuleForm(props) {
const ruleValue = React.useRef('')
const explanationValue = React.useRef('')
const [viewForm, setViewForm] = useState(false);
const [toggle, setToggle] = useState(false);
let server = "http://localhost:5000";
let socket = io(server);


async function handleSubmit(e) {
e.preventDefault()
    let d = new Date();
    let n = d.getTime();
    let ruleId=mongoose.Types.ObjectId()
    ruleId=ruleId.toString()

    const newRule={
      _id:ruleId,
      rule: ruleValue.current.value,
      groupId:props.groupId,
      createdby:auth.isAuthenticated().user._id,
      explanation:explanationValue.current.value,
      timecreated:n,
      approval:[auth.isAuthenticated().user._id]
    }

    const newRuleToRender={
      _id:ruleId,
      rule: ruleValue.current.value,
      createdby:auth.isAuthenticated().user,
      explanation:explanationValue.current.value,
      timecreated:n,
      approval:[auth.isAuthenticated().user._id]
    }


    let chatMessage=`created an rule; ${ruleValue.current.value}`
    let userId=auth.isAuthenticated().user._id
    let userName=auth.isAuthenticated().user.name
    let nowTime=n
    let type="text"

    socket.emit("Input Chat Message", {
      chatMessage,
      userId,
      userName,
      nowTime,
      type});



console.log("newPost.group",newRule)
    props.updateRules(newRuleToRender)
    console.log(newRule)
    const options={
        method: "POST",
        body: JSON.stringify(newRule),
        headers: {
            "Content-type": "application/json; charset=UTF-8"}}


      await fetch("/rules/createrule/"+ruleId, options)
              .then(response => response.json()).then(json => console.log(json));
}


  return (
    <>
    <button style={{display:"block"}} onClick={(e) => setViewForm(!viewForm)}>View Create Rule Form?</button>
    <div className='form'  style={{maxHeight:!viewForm?"0":"100vw",overflow:"hidden",transition:"max-height 2s"}}>
      <form className='search-form'>
      <div className="eventformbox">
        <label htmlFor='name'>Rule</label>
        <input
          type='text'
          name='ruleValue'
          id='ruleValue'
          ref={ruleValue}

        />
        </div>
        <div className="eventformbox">
        <label htmlFor='name'>Explanation</label>
        <textarea
          rows="4"
          type='text'
          name='explanationValue'
          id='explanationValue'
          ref={explanationValue}

        />
        </div>
        <button onClick={(e) => handleSubmit(e)}>Submit Rule</button>
      </form>
    </div>
    </>
  )}
