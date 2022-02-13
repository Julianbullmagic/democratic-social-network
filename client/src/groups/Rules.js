import React, { Component } from 'react';
import {Image} from 'cloudinary-react'
import CreateRuleForm from './CreateRuleForm'
import auth from './../auth/auth-helper'
import io from "socket.io-client";
const mongoose = require("mongoose");
let server = "http://localhost:5000";
let socket
const MILLISECONDS_IN_A_DAY=86400000
const MILLISECONDS_IN_A_WEEK=604800000
if(process.env.NODE_ENV=="production"){
  socket=io();
}
if(process.env.NODE_ENV=="development"){
  socket=io(server);

}

export default class Rules extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users:props.users,
      rules: [],
      group:props.group,
      page:1,
      pageNum:[],
      currentPageData:[],
      redirect: false,
      updating:false,
      participate:props.participate
    }
    this.updateRules= this.updateRules.bind(this)
    this.sendRuleNotification= this.sendRuleNotification.bind(this)
    this.approveofrule=this.approveofrule.bind(this)
    this.ruleApprovedNotification=this.ruleApprovedNotification.bind(this)
  }



  componentDidMount(props){
    let server = "http://localhost:5000";
    let socket
    if(process.env.NODE_ENV=="production"){
      socket=io();
    }
    if(process.env.NODE_ENV=="development"){
      socket=io(server);

    }
    this.getRules()
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.users !== this.props.users) {
      this.setState({users:nextProps.users})
    }
    if (nextProps.group !== this.props.group) {
      this.setState({group:nextProps.group})
    }
  }


  decidePage(e,pagenum){

    let currentpage=this.state.rules.slice((pagenum*10-10),pagenum*10)

    this.setState({page:pagenum,currentPageData:currentpage})
  }

  async getRules(){
    await fetch(`/rules/getrules/`+this.props.groupId)
    .then(response => response.json())
    .then(data=>{

      let rules=data
      rules.reverse()
      this.setState({rules:rules})


      let currentpage=rules.slice(0,10)

      this.setState({currentPageData:currentpage})

      let pagenum=Math.ceil(data.length/10)

      let pagenums=[]
      while(pagenum>0){
        pagenums.push(pagenum)
        pagenum--
      }
      pagenums.reverse()

      this.setState({pageNum:pagenums})
    })
    .catch(err => {
      console.error(err);
    })
  }

  updateRules(newrule){
    var rulescopy=JSON.parse(JSON.stringify(this.state.rules))

    rulescopy.reverse()
    rulescopy.push(newrule)
    rulescopy.reverse()


    let current=rulescopy.slice((this.state.page*10-10),this.state.page*10)


    this.setState({ rules:rulescopy,currentPageData:current})
  }




  async deleteRule(event,item){

    var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
    function checkRule(rule) {
      return rule._id!=item
    }


    var filteredapproval=rulescopy.filter(checkRule)


    let current=filteredapproval.slice((this.state.page*10-10),this.state.page*10)


    this.setState({ rules:filteredapproval,currentPageData:current})

    let d = new Date();
    let n = d.getTime();


    let chatMessage=`A rule has been deleted because of a lack of support ${item.rule}.
    Rules with less than 75% approval that are more than a week old are deleted`
    let userId=auth.isAuthenticated().user._id
    let userName=auth.isAuthenticated().user.name
    let nowTime=n
    let type="text"

    this.socket.emit("Input Chat Message", {
      chatMessage,
      userId,
      userName,
      nowTime,
      type});
      let userscopy=JSON.parse(JSON.stringify(this.state.users))
      userscopy=userscopy.filter(item=>item.rules)
      let emails=userscopy.map(item=>{return item.email})






      let notification={
        emails:emails,
        subject:"Rule Deleted",
        message:`In the group called ${this.state.group.title} at level ${this.state.group.level}, The rule ${item.rule} has been deleted
        because of lack of support`
      }

      const options = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notification)
      }

      fetch("/groups/sendemailnotification", options
    ) .then(res => {

    }).catch(err => {
      console.error(err);
    })



    const optionstwo = {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    }

    await fetch("/rules/"+item, optionstwo)
    .catch(err => {
      console.error(err);
    })


    const optionsthree = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    }

    await fetch("/groups/removerulefromgroup/"+this.state.id+"/"+item, optionsthree)
    .catch(err => {
      console.error(err);
    })

  }


  approveofrule(e,id){

    let d = new Date();
    let n = d.getTime();
    var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
    function checkRule() {
      return id!==auth.isAuthenticated().user._id
    }
    for (var rule of rulescopy){
      if (rule._id==id){

        if(!rule.approval.includes(auth.isAuthenticated().user._id)){
          rule.approval.push(auth.isAuthenticated().user._id)


          let approval=(rule.approval.length/this.state.users.length)*100

          if (approval>75){
            this.ruleApprovedNotification(rule)
          }

          if (approval<75&&(n-rule.timecreated)>MILLISECONDS_IN_A_WEEK){
            this.deleteRule(rule)
          }
          if(approval>=10&&!rule.notificationsent){
            this.sendRuleNotification(rule)
          }


          if ((approval>75)&&(this.state.group.level>0)&&(rule.sentdown==false)){


            rule.sentdown=true
            this.sendRuleDown(rule)
          }
        }
      }
    }

    this.setState({rules:rulescopy})
    let current=rulescopy.slice((this.state.page*10-10),this.state.page*10)

    this.setState({currentPageData:rulescopy})

    let options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: ''
    }

    fetch("/rules/approveofrule/" + id +"/"+ auth.isAuthenticated().user._id, options
  ).then(res => {

  }).catch(err => {
    console.error(err);
  })
}

async sendRuleDown(rule){
  let optionsone = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  fetch("/rules/marksentdown/" + rule._id, optionsone
).then(res => {

}).catch(err => {
  console.error(err);
})


let lowergroupids=[]
for (let group of this.state.group.groupsbelow){

  if(group.groupsbelow){
    lowergroupids.push(...group.groupsbelow)
  }
  lowergroupids.push(group._id)
}

for (let gr of lowergroupids){

  fetch("/rules/sendruledown/"+rule._id+"/"+gr,  optionsone)
  .catch(err => {
    console.error(err);
  })
}
}


withdrawapprovalofrule(e,id){
  let d = new Date();
  let n = d.getTime();
  var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
  function checkRule(userid) {
    return userid!=auth.isAuthenticated().user._id
  }
  for (var rule of rulescopy){
    if (rule._id==id){


      var filteredapproval=rule.approval.filter(checkRule)
      rule.approval=filteredapproval
    }
    let approval=(rule.approval.length/this.state.users.length)*100


    if(approval>=10&&!rule.notificationsent){
      this.sendRuleNotification(rule)
    }

    if (approval<75&&(n-rule.timecreated)>MILLISECONDS_IN_A_WEEK){
      this.deleteRule(rule)
    }
  }

  this.setState({rules:rulescopy})
  let current=rulescopy.slice((this.state.page*10-10),this.state.page*10)

  this.setState({currentPageData:current})

  const options = {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: ''
  }

  fetch("/rules/withdrawapprovalofrule/" + id +"/"+ auth.isAuthenticated().user._id, options
) .then(res => {

}).catch(err => {
  console.error(err);
})

}

sendRuleNotification(item){
  if(!item.notificationsent){
    var rulescopy=JSON.parse(JSON.stringify(this.state.rules))
    for (var rule of rulescopy){
      if (rule._id==item._id){
        rule.notificationsent=true
      }}
      this.setState({rules:rulescopy})
      let current=rulescopy.slice((this.state.page*10-10),this.state.page*10)

      this.setState({currentPageData:current})


      let userscopy=JSON.parse(JSON.stringify(this.state.users))




      userscopy=userscopy.filter(user=>user.rules)

      let emails=userscopy.map(item=>{return item.email})



      let d = new Date();
      let n = d.getTime();
      let chatMessage=`Rule suggested: ${item.rule}`
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


        let notification={
          emails:emails,
          subject:"New Rule Suggestion",
          message:`In the group called ${this.state.group.title} at level ${this.state.group.level},${item.createdby.name} suggested the rule: ${item.rule}`
        }

        const options = {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notification)
        }

        fetch("/groups/sendemailnotification", options
      ) .then(res => {

      }).catch(err => {
        console.error(err);
      })

      const optionstwo = {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: ''
      }

      fetch("/rules/notificationsent/"+item._id, optionstwo
    ) .then(res => {

    }).catch(err => {
      console.error(err);
    })
  }
}


ruleApprovedNotification(item){

  let rulescopy=JSON.parse(JSON.stringify(this.state.rules))

  if(!item.ratificationnotificationsent){
    for (let pol of rulescopy){
      if (pol._id==item._id){
        pol.ratificationnotificationsent=true
      }}
      let d = new Date();
      let n = d.getTime();
      let chatMessage=`Rule approved by 75%: ${item.rule}`
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


        this.setState({rules:rulescopy})
        let current=rulescopy.slice((this.state.page*10-10),this.state.page*10)

        this.setState({currentPageData:current})

        let userscopy=JSON.parse(JSON.stringify(this.state.users))




        userscopy=userscopy.filter(user=>user.rulesapproved)

        let emails=userscopy.map(item=>{return item.email})




        let notification={
          emails:emails,
          subject:"A rule has been approved by the group",
          message:`The group called ${this.state.group.title} has a new rule: ${item.rule}`
        }

        const options = {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(notification)
        }

        fetch("/groups/sendemailnotification", options
      ) .then(res => {

      }).catch(err => {
        console.error(err);
      })

      const optionstwo = {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: ''
      }

      fetch("/rules/ruleratificationnotificationsent/"+item._id, optionstwo
    ) .then(res => {

    }).catch(err => {
      console.error(err);
    })
  }
}

render(props) {

  var d = new Date();
  var n = d.getTime();

  var rulescomponent=<h3>no rules</h3>
  if (this.state.rules){


    rulescomponent=this.state.currentPageData.map(item => {
      let approval=<></>

      if(this.state.users){
        approval=Math.round((item.approval.length/this.state.users.length)*100)
      }
      if (approval<75&&(n-item.timecreated)>MILLISECONDS_IN_A_WEEK){
        this.deleteRule(item)
      }
      if(approval>=10&&!item.notificationsent){
        this.sendRuleNotification(item)
      }
      let approveenames=[]
      for (let user of this.state.users){
        for (let approvee of item.approval){
          if (approvee==user._id){
            approveenames.push(user.name)
          }
        }
      }


      let width=`${(item.approval.length/this.state.users.length)*100}%`

      return(
        <>
        <div className="rule">
        <h3 className="ruletext">{item.rule}, suggested by {item.createdby.name}</h3>
        {(((item.createdby==auth.isAuthenticated().user._id)||this.state.group.groupabove.members.includes(auth.isAuthenticated().user._id))&&approval<75)&&
          <button style={{margin:"0.5vw"}} className="ruletext" onClick={(e)=>this.deleteRule(e,item)}>Delete Rule?</button>}
          {(this.state.group.level==item.level)&&<>
            {(!item.approval.includes(auth.isAuthenticated().user._id))&&<button className="ruletext" onClick={(e)=>this.approveofrule(e,item._id)}>Approve this rule?</button>}
            {(item.approval.includes(auth.isAuthenticated().user._id))&&<button className="ruletext" onClick={(e)=>this.withdrawapprovalofrule(e,item._id)}>Withdraw Approval?</button>}</>}

            <h4 className="ruletext">  {item.explanation},  </h4>
            <h4 className="ruletext">Rule Level {item.level}  </h4>
            {(this.state.group.level==item.level)&&<>
              {this.state.users&&<h4 className="ruletext">,{approval}% of members approve this rule, {item.approval.length}/{this.state.users.length}. Approvees=</h4>}
              {approveenames&&approveenames.map((item,index)=>{return(<><h4 className="ruletext">{item}{(index<(approveenames.length-2))?", ":(index<(approveenames.length-1))?" and ":"."}</h4></>)})}
              <div className="percentagecontainer"><div style={{width:width}} className="percentage"></div></div>
              </>}
              </div>
              </>
            )})
          }

          let inthisgroup=this.state.group.members.map(item=>item._id)
          inthisgroup=inthisgroup.includes(auth.isAuthenticated().user._id)

          return (
            <>
            {inthisgroup&&<h2>Propose a Rule</h2>}
            {inthisgroup&&<CreateRuleForm updateRules={this.updateRules} groupId={this.props.groupId} level={this.state.group.level}/>}
            <h2>Group Rules</h2>
            {this.state.pageNum.length>1&&<h4 style={{display:"inline"}}>Choose Page</h4>}
            {(this.state.pageNum.length>1&&this.state.pageNum&&this.state.rules)&&this.state.pageNum.map(item=>{
              return (<>
                <button style={{display:"inline"}} onClick={(e) => this.decidePage(e,item)}>{item}</button>
                </>)
              })}
              {rulescomponent}
              {this.state.pageNum.length>1&&<h4 style={{display:"inline"}}>Choose Page</h4>}
              {(this.state.pageNum.length>1&&this.state.pageNum&&this.state.rules)&&this.state.pageNum.map(item=>{
                return (<>
                  <button style={{display:"inline"}} onClick={(e) => this.decidePage(e,item)}>{item}</button>
                  </>)
                })}
                <p>Rules that have less than 75% approval and are more than a week old will be deleted. There are some rules you cannot
                directly vote on because they have been approved by representatives of a larger group.
                If you disagree, consult with your
                elected representatives and they may be able to convince you, otherwize you can withdraw your vote from them.
                We live in a very complicated modern world, you cannot be expected to understand everything or even most things, but we can try
                to create circumstances that encourage trust between representatives and their constituency. Democracy book tries to achieve this
                by having fairly small groups, encouraging a closer relationship between elected delegates and their people.
                You may have important information that the delegate can pass onto the representative assembly. It is important that rules for
                larger groups be created by responsible leaders who have consulted with their people, thoroughly discussed the issue and tried
                to arrive at the most informed decision that as many people as possible are happy but also occasionally using authority to
                overule people if absolutely necessary. Coercion is always inferior to persuasion. People comply and follow a rule much more
                willingly and enthusiastically if they understand and agree with it or trust the people who created it.
                Force should only be used to impose rules in dangerous or dire circumstances where persuasion has failed.
                </p>
                </>
              );
            }
          }
