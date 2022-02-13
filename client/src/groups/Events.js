import React, { Component } from 'react';
import CreateEventForm from './CreateEventForm'
import {Image} from 'cloudinary-react'
import io from "socket.io-client";
import auth from './../auth/auth-helper'
import AwesomeSlider from 'react-awesome-slider';
import 'leaflet/dist/leaflet.css';
import 'react-awesome-slider/dist/styles.css';
import { MapContainer, TileLayer,Circle} from 'react-leaflet'
const mongoose = require("mongoose");


export default class Events extends Component {

  constructor(props) {
    super(props);
    this.state = {
      location:"",
      title:"",
      users:props.users,
      group:props.group,
      level:0,
      events:[],
      page:1,
      pageNum:[],
      currentPageData:[],
      redirect: false,
      updating:false
    }
    this.updateEvents= this.updateEvents.bind(this)
  }


  componentDidMount(){
    let server = "http://localhost:5000";
    let socket
    if(process.env.NODE_ENV=="production"){
      socket=io();
    }
    if(process.env.NODE_ENV=="development"){
      socket=io(server);

    }
    this.getEvents()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.users !== this.props.users) {
      this.setState({users:nextProps.users})
    }
    if (nextProps.group !== this.props.group) {
      this.setState({group:nextProps.group,level:nextProps.group.level,groupsbelow:nextProps.group.groupsbelow})
    }
  }


    decidePage(e,pagenum){
      console.log("decide page",(pagenum*10-10),pagenum*10)
      let currentpage=this.state.events.slice((pagenum*10-10),pagenum*10)
      console.log("currentpage",currentpage)
      this.setState({page:pagenum,currentPageData:currentpage})
    }

    async getEvents(){
      await fetch(`/events/getevents/`+this.props.groupId)
      .then(response => response.json())
      .then(data=>{
        console.log("events",data)
        let events=data
        events.reverse()
        this.setState({events:events})
        console.log("decide events",0,10)
        let currentpage=events.slice(0,10)
        console.log("currentpage",currentpage)
        this.setState({currentPageData:currentpage})
        let pagenum=Math.ceil(data.length/10)
        console.log("page num",pagenum)
        let pagenums=[]
        while(pagenum>0){
          pagenums.push(pagenum)
          pagenum--
        }
        pagenums.reverse()
        console.log(pagenums)
        this.setState({pageNum:pagenums})
      }).catch(err => {
        console.log(err);
      })
    }


    updateEvents(newevent){
      var eventscopy=JSON.parse(JSON.stringify(this.state.events))
      eventscopy.reverse()
      eventscopy.push(newevent)
      eventscopy.reverse()
      this.setState({ events:eventscopy})
      let current=eventscopy.slice((this.state.page*10-10),this.state.page*10)
      console.log(current)
      this.setState({currentPageData:current})
    }

    async sendEventDown(ev){
      let optionsone = {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: ''
      }
      console.log("EVENT",ev)
      fetch("/events/marksentdown/" + ev._id, optionsone
    ).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })

    console.log("GROUPS BELOW",this.state.group.groupsbelow)
    let lowergroupids=[]
    for (let group of this.state.group.groupsbelow){
      console.log("GROUP",group,ev)
      if(group.groupsbelow){
        lowergroupids.push(...group.groupsbelow)
      }
  lowergroupids.push(group._id)
        }
        console.log("lowergroupids",lowergroupids)
  for (let gr of lowergroupids){
    console.log("Lower GROUP",gr,ev._id)
    fetch("/events/sendeventdown/"+ev._id+"/"+gr,  optionsone)
   .catch(err => {
     console.log(err);
   })
  }
        }






        async deleteEvent(e,item){
          var eventscopy=JSON.parse(JSON.stringify(this.state.events))
          function checkEvent(event) {
            return event._id!=item._id
          }
          var d = new Date();
          var n = d.getTime();


          let chatMessage=`deleted an event called ${item.title}`
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

            var filteredapproval=eventscopy.filter(checkEvent)
            console.log(filteredapproval)
            this.setState({events:filteredapproval})
            let current=filteredapproval.slice((this.state.page*10-10),this.state.page*10)
            console.log(current)
            this.setState({currentPageData:current})

            const options = {
              method: 'delete',
              headers: {
                'Content-Type': 'application/json'
              },
              body: ''
            }

            await fetch("/events/"+item._id, options)
            .catch(err => {
              console.log(err);
            })

            const optionstwo = {
              method: 'put',
              headers: {
                'Content-Type': 'application/json'
              },
              body: ''
            }

            await fetch("/groups/removeeventfromgroup/"+this.state.id+"/"+item._id, optionstwo)
            .catch(err => {
              console.log(err);
            })
          }



          approveofevent(e,id){
            var eventscopy=JSON.parse(JSON.stringify(this.state.events))
            function checkEvent() {
              return id!==auth.isAuthenticated().user._id
            }
            for (var ev of eventscopy){
              if (ev._id==id){

                if(!ev.approval.includes(auth.isAuthenticated().user._id)){
                  ev.approval.push(auth.isAuthenticated().user._id)
                }
              }
              let approval=Math.round((ev.approval.length/this.state.users.length)*100)
              console.log("sending down",ev,approval,this.state)
              if ((approval>0.75)&&(this.state.group.level>0)&&(ev.sentdown==false)){
                console.log("sending down",ev,approval)
                ev.sentdown=true
                this.sendEventDown(ev)
              }
            }

            this.setState({events:eventscopy})
            let current=eventscopy.slice((this.state.page*10-10),this.state.page*10)
            console.log(current)
            this.setState({currentPageData:current})
            const options = {
              method: 'put',
              headers: {
                'Content-Type': 'application/json'
              },
              body: ''
            }
            console.log(id,auth.isAuthenticated().user._id)

            fetch("/events/approveofevent/" + id +"/"+ auth.isAuthenticated().user._id, options
          ).then(res => {
            console.log(res);
          }).catch(err => {
            console.log(err);
          })

        }


        withdrawapprovalofevent(e,id){
          var eventscopy=JSON.parse(JSON.stringify(this.state.events))
          function checkEvent(userid) {
            return userid!=auth.isAuthenticated().user._id
          }
          for (var ev of eventscopy){
            if (ev._id==id){


              var filteredapproval=ev.approval.filter(checkEvent)
              ev.approval=filteredapproval
            }
          }
          this.setState({events:eventscopy})
          let current=eventscopy.slice((this.state.page*10-10),this.state.page*10)
          console.log(current)
          this.setState({currentPageData:current})
          const options = {
            method: 'put',
            headers: {
              'Content-Type': 'application/json'
            },
            body: ''
          }
          console.log(id,auth.isAuthenticated().user._id)

          fetch("/events/withdrawapprovalofevent/" + id +"/"+ auth.isAuthenticated().user._id, options
        ).then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err);
        })

      }



      sendEventNotification(item){
        if(!item.notificationsent){
          var eventscopy=JSON.parse(JSON.stringify(this.state.events))
          for (let ev of eventscopy){
            if (ev._id==item._id){
              ev.notificationsent=true
            }}
            this.setState({events:eventscopy})
            let current=eventscopy.slice((this.state.page*10-10),this.state.page*10)
            this.setState({currentPageData:current})
            let userscopy=JSON.parse(JSON.stringify(this.state.users))
            userscopy=userscopy.filter(user=>user.events)
            let emails=userscopy.map(item=>{return item.email})
            let notification={
              emails:emails,
              subject:"New Event Suggestion",
              message:`${item.createdby.name} suggested the event: ${item.title}`
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
            console.log(res);
          }).catch(err => {
            console.log(err);
          })

          const optionstwo = {
            method: 'put',
            headers: {
              'Content-Type': 'application/json'
            },
            body: ''
          }

          fetch("/events/notificationsent/"+item._id, optionstwo
        ) .then(res => {
          console.log(res);
        }).catch(err => {
          console.log(err);
        })
      }
    }




    render() {
      console.log("USERS IN EVENTS",this.props.users)
      var d = new Date();
      var n = d.getTime();

      var eventscomponent=<h3>no events</h3>
      if (this.state.users&&this.state.events){
        console.log("THIS.PROPS.Users",this.props.users)
        eventscomponent=this.state.currentPageData.map(item => {

          let approval=<></>
          approval=Math.round((item.approval.length/this.state.users.length)*100)


          if(approval>=10&&!item.notificationsent){
            this.sendEventNotification(item)
          }



          let attendeenames=[]
          for (let user of this.state.users){
            for (let attendee of item.approval){
              if (attendee==user._id){
                attendeenames.push(user.name)
              }
            }
          }


          return(
            <>
            <div className="eventbox" style={{marginBottom:"1vw"}}>
            <div className="eventcol1">
            <h3>{item.title}</h3>
            <h4>{item.description}</h4>
            {this.state.users&&<h4 className="ruletext">{item.approval.length} people are attending this event</h4>}
            {!item.approval.includes(auth.isAuthenticated().user._id)&&<button className="ruletext" onClick={(e)=>this.approveofevent(e,item._id)}>Attend this event?</button>}
            {item.approval.includes(auth.isAuthenticated().user._id)&&<button className="ruletext" onClick={(e)=>this.withdrawapprovalofevent(e,item._id)}>Don't want to attend anymore?</button>}
            {((item.createdby==auth.isAuthenticated().user._id||this.state.group.groupabove.members.includes(auth.isAuthenticated().user._id))&&approval<75)&&
            <button className="ruletext" onClick={(e)=>this.deleteEvent(e,item)}>Delete?</button>}
            </div>
            <div className="eventimagemapcontainer">
            {item.images&&<div className="eventcol2">
            <Image style={{width:"100%",overflow:"hidden"}} cloudName="julianbullmagic" publicId={item.images[0]} />
            </div>}
            <div className="eventcol3">
            <div className="eventcol3inner">
            {item.coordinates&&<MapContainer center={[item.coordinates[0],item.coordinates[1]]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Circle center={[item.coordinates[0],item.coordinates[1]]} radius={100} />
            </MapContainer>}
            </div>
            </div>
            </div>
            </div>
            </>

          )})
        }





        let inthisgroup=this.state.group.members.map(item=>item._id)
        inthisgroup=inthisgroup.includes(auth.isAuthenticated().user._id)

        return (
          <>
          {inthisgroup&&<h2>Propose an Event</h2>}
          {inthisgroup&&<CreateEventForm updateEvents={this.updateEvents} groupId={this.props.groupId} level={this.state.group.level}/>}
          <h2><strong>Group Events </strong></h2>
          {this.state.pageNum.length>1&&<h4 style={{display:"inline"}}>Choose Page</h4>}
          {(this.state.pageNum.length>1&&this.state.pageNum&&this.state.events)&&this.state.pageNum.map(item=>{
            return (<>
              <button style={{display:"inline"}} onClick={(e) => this.decidePage(e,item)}>{item}</button>
              </>)
            })}
            {eventscomponent}
            {this.state.pageNum.length>1&&<h4 style={{display:"inline"}}>Choose Page</h4>}
            {(this.state.pageNum.length>1&&this.state.pageNum.length>1&&this.state.pageNum&&this.state.events)&&this.state.pageNum.map(item=>{
              return (<>
                <button style={{display:"inline"}} onClick={(e) => this.decidePage(e,item)}>{item}</button>
                </>)
              })}
              </>
            );
          }
        }
