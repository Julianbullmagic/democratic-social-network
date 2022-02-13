import React, {useState,useRef, useEffect} from 'react'
import auth from './../auth/auth-helper'
import Comment from './Comment'
import io from "socket.io-client";
const mongoose = require("mongoose");


export default function Newsfeed (props) {
  const [viewForm, setViewForm] = useState(false);
  const postArea = React.useRef('')
  const [posts, setPosts] = useState([]);
  const [group, setGroup] = useState(props.group);
  const [post, setPost] = useState("");
  const [page, setPage] = useState(1);
  const [pageNum, setPageNum] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [comment, setComment] = useState("");
  const [preview, setPreview] = useState("");
  let server = "http://localhost:5000";
  let socket = io(server);

  useEffect(() => {
    console.log("props",props)
    setGroup(props.group)
    fetch("/posts/getposts/"+props.groupId)
    .then(res => {
      return res.json();
    }).then(posts => {
      console.log("posts!!!!!!!!!!!!!",posts.data)
      let po=posts.data
      po.reverse()
      setPosts(po)

      console.log("decide page",0,10)
      let currentpage=po.slice(0,10)
      console.log("currentpage",currentpage)
      setCurrentPageData(currentpage)

      let pagenum=Math.ceil(posts.data.length/10)
      console.log("page num",pagenum)
      let pagenums=[]
      while(pagenum>0){
        pagenums.push(pagenum)
        pagenum--
      }
      pagenums.reverse()
      console.log(pagenums)
      setPageNum(pagenums)
    }).catch(err => {
      console.log(err);
    })
  },[props])

  useEffect(() => {

    var urlRegex = /(https?:\/\/[^ ]*)/;
    if (post.match(urlRegex)){
      var url = post.match(urlRegex)[0]
      getPreview(url)
    }


  },[post])


  function sendPostDown(posttosend){
    console.log("sending post down",posttosend)

    if(!posttosend.sentdown){
      var postcopy=JSON.parse(JSON.stringify(posts))

for (let po of postcopy){
  if (po._id==posttosend._id.toString()){
    po.sentdown=true
  }
}
      setPosts(postcopy)
      let current=postcopy.slice((page*10-10),page*10)
      console.log(current)
      setCurrentPageData(current)

            const options = {
              method: 'put',
              headers: {
                'Content-Type': 'application/json'
              },
                 body: ''
            }

            fetch("/posts/marksentdown/" + posttosend._id.toString(), options
      ).then(res => {
       console.log(res);
      }).catch(err => {
       console.log(err);
      })

      console.log("GROUPS BELOW",group)
      let lowergroupids=[]
      for (let grou of group.groupsbelow){
        console.log("GROUP",grou,posttosend)
        if(grou.groupsbelow){
          lowergroupids.push(...grou.groupsbelow)
        }
    lowergroupids.push(grou._id)
          }
          console.log("lowergroupids",lowergroupids)
    for (let gr of lowergroupids){
      console.log("Lower GROUP",gr,posttosend._id.toString())
      fetch("/posts/sendpostdown/" + posttosend._id.toString() +"/"+ gr, options
    ).then(res => {
    console.log(res);
    }).catch(err => {
    console.log(err);
    })
    }
    }
  }

  function getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
    ? match[2]
    : null;
  }

  function decidePage(e,pagenum){

    console.log("decide page",(pagenum*10-10),pagenum*10)
    let currentpage=posts.slice((pagenum*10-10),pagenum*10)
    console.log("currentpage",currentpage)
    setPage(pagenum)
    setCurrentPageData(currentpage)
  }

  async function getPreview(url){
    var data = {key: '567204aab52f43be1f7bbd3573ff4875', q: url}

    if (url.includes("youtube")){
      const videoId = getId(url);
      const iframesrc = `http//www.youtube.com/embed/${videoId}`
      data = {key: '567204aab52f43be1f7bbd3573ff4875', q: iframesrc}

    }


    var prev=await fetch('https://api.linkpreview.net', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
    })
    .then(res => res.json())
    .then(response => {return response})
    .catch(err => {
      console.log(err);
    })
    console.log("preview",prev)
    setPreview(prev)
  }


  function handleSubmit(e){
    e.preventDefault()
    var d = new Date();
    var n = d.getTime();
    var postId=mongoose.Types.ObjectId()

    const newPost={
      _id:postId,
      post:post,
      level:group.level,
      groupIds:[props.groupId],
      preview:preview,
      timecreated:n,
      createdby:auth.isAuthenticated().user._id
    }

    let chatMessage=`created an new post`
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


      console.log("newpost",newPost)
      var postscopy=JSON.parse(JSON.stringify(posts))

      postscopy.reverse()
      postscopy.push(newPost)
      postscopy.reverse()

      sendPostNotification(newPost)
      sendPostDown(newPost)

      setPosts(postscopy)
      console.log("page",page)
      let current=postscopy.slice((page*10-10),page*10)
      console.log(current)
      setCurrentPageData(current)

      const options={
        method: "POST",
        body: JSON.stringify(newPost),
        headers: {
          "Content-type": "application/json; charset=UTF-8"}}

          fetch("/posts/createpost/"+postId, options)
          .then(response => response.json())
          .then(json => console.log(json))
          .catch(err => {
            console.log(err);
          })
        }


        function deletePost(e,id) {
          e.preventDefault()
          var postscopy=JSON.parse(JSON.stringify(posts))
          var filteredarray = postscopy.filter(function( obj ) {
            return obj._id !== id;
          });
          setPosts(filteredarray);

          console.log("page",page)
          let current=postscopy.slice((page*10-10),page*10)
          console.log(current)
          setCurrentPageData(current)


          console.log(filteredarray)
          const options={
            method: "Delete",
            body: '',
            headers: {
              "Content-type": "application/json; charset=UTF-8"}}

              var d = new Date();
              var n = d.getTime();


              let chatMessage=`deleted a post`
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

                fetch("/posts/deletepost/"+id, options)
                .then(response => response.json())
                .then(json => console.log(json))
                .catch(err => {
                  console.log(err);
                })

              }



              function sendPostNotification(item){
                let postscopy=JSON.parse(JSON.stringify(posts))
                if(!item.notificationsent){

                  for (var po of postscopy){
                    if (po._id==item._id){
                      po.notificationsent=true
                    }}
                    setPosts(postscopy)
                    let current=postscopy.slice((page*10-10),page*10)
                    console.log(current)
                    setCurrentPageData(current)

                    console.log("sending rule notification",props.users)
                    let emails=props.users.map(item=>{return item.email})


                    console.log(emails)
                    let notification={
                      emails:emails,
                      subject:"New Post",
                      message:`${auth.isAuthenticated().user.name} wrote a post called ${item.post}`
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

                  fetch("/posts/notificationsent/"+item._id, optionstwo
                ) .then(res => {
                  console.log(res);
                }).catch(err => {
                  console.log(err);
                })
              }
            }




            if(preview){
              if(preview.image){
                var previewmapped=<><h2>{preview.title}</h2><img src={preview.image}></img></>
              }

              if(preview.url){
                var previewmapped=<><h2>{preview.title}</h2><iframe src={preview.url}></iframe></>
              }
            }

            var postsmapped=currentPageData.map((item,i)=>{
              if (item.preview){
                if(item.preview.title){
                  if(item.preview.image){
                    var prev=
                    <>
                    <h2>{item.preview.title}</h2>
                    <img src={item.preview.image}></img>

                    </>
                    if(item.preview.url){
                      prev=
                      <>
                      <h2>{item.preview.title}</h2>
                      <iframe src={item.preview.url}></iframe>
                      <img src={item.preview.image}></img>
                      </>
                    }
                  }
                }
              }
console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!",item)
              return (
                <>
                <div key={i} className="postbox">
                <div className="postboxform">
                <h4><strong>Post: </strong>{item.post}</h4>

                {prev&&prev}
                <div><h5 style={{display:"inline"}}><strong> Post by {item.createdby.name}</strong></h5>
              {(item.level>group.level)&&<div><h5 style={{display:"inline"}}><strong>This post has been passed down by a
              level {item.level} group</strong></h5></div>}

                {((item.createdby._id==auth.isAuthenticated().user._id)||
                group.groupabove.members.includes(auth.isAuthenticated().user._id))&&
                  <button style={{display:"inline"}} onClick={(e)=>deletePost(e,item._id)}>Delete Post?</button>}</div>
                {((group.level==item.level)&&!item.sentdown&&(item.level>0))&&
                  <button style={{display:"inline"}}  onClick={(e)=>sendPostDown(item)}>Send Post Down?</button>}
                </div>
                <Comment id={item._id}/>

                </div>
                </>
              )})
              let inthisgroup
              if(group.members){
                inthisgroup=group.members.map(item=>item._id)
                inthisgroup=inthisgroup.includes(auth.isAuthenticated().user._id)
              }

              return (
                <>
                {inthisgroup&&<>
                  <button style={{display:"block"}} onClick={(e) => setViewForm(!viewForm)}>View Write Post Form?</button>

                  <div className="form" style={{maxHeight:!viewForm?"0":"100vw",overflow:"hidden",transition:"max-height 2s"}}>
                  <form style={{display:!viewForm?"none":"block"}}>
                  <div>
                  <label htmlFor='name'>Write Post</label>  <button onClick={(e) => handleSubmit(e)}>New Post?</button>
                  </div>

                  <textarea onChange={(e) => setPost(e.target.value)} ref={postArea} id="story" rows="5" cols="33" />


                  {preview&&previewmapped}
                  </form>

                  </div>
                  </>}

                {pageNum.length>1&&<h4 style={{display:"inline"}}>Choose Page</h4>}
                {(pageNum.length>1&&pageNum&&posts)&&pageNum.map(item=>{
                  return (<>
                    <button style={{display:"inline"}} onClick={(e) => decidePage(e,item)}>{item}</button>
                    </>)
                  })}
                  {postsmapped}
                  <div style={{marginBottom:"5vw"}}>
                  {pageNum.length>1&&<h4 style={{display:"inline"}}>Choose Page</h4>}
                  {(pageNum.length>1&&pageNum&&posts)&&pageNum.map(item=>{
                    return (<>
                      <button style={{display:"inline"}} onClick={(e) => decidePage(e,item)}>{item}</button>
                      </>)
                    })}
                    </div>
                    </>
                  )
                }
