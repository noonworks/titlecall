(this.webpackJsonptitlecall=this.webpackJsonptitlecall||[]).push([[0],{10:function(e,t,a){e.exports=a(21)},15:function(e,t,a){},16:function(e,t,a){},17:function(e,t,a){},21:function(e,t,a){"use strict";a.r(t);var i=a(0),n=a.n(i),l=a(8),r=a.n(l),c=(a(15),a(2)),s=a(3),h=a(4),o=a(1),d=a(5),u=a(6),v=(a(16),a(17),a(9)),m=a.n(v),g=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var i;return Object(s.a)(this,a),(i=t.call(this,e)).state={image:i.props.image||"",scale:1,died:!1},i.handleDiedCheck=i.handleDiedCheck.bind(Object(o.a)(i)),i.handleNewImage=i.handleNewImage.bind(Object(o.a)(i)),i.handleDeleteImage=i.handleDeleteImage.bind(Object(o.a)(i)),i.handleScale=i.handleScale.bind(Object(o.a)(i)),i}return Object(h.a)(a,[{key:"handleDiedCheck",value:function(){this.setState((function(e){return{died:!e.died}}))}},{key:"handleNewImage",value:function(e){if(e.target){var t=e.target.files;t&&this.setState({image:t[0]})}}},{key:"handleDeleteImage",value:function(){this.setState({image:""})}},{key:"handleScale",value:function(e){var t=parseFloat(e.target.value);this.setState({scale:t})}},{key:"render",value:function(){return n.a.createElement("div",{className:"FaceEditor"},n.a.createElement(m.a,{className:"FaceEditor-Canvas"+(this.state.died?" FaceEditor-Died":""),image:this.state.image,scale:this.state.scale,width:this.props.width,height:this.props.height,border:0}),n.a.createElement("div",{className:"FaceEditor-Controls FaceEditor-Controls-Top"},n.a.createElement("label",null,n.a.createElement("input",{className:"FaceEditor-Controls-Died",type:"checkbox",checked:this.state.died,onChange:this.handleDiedCheck}),"\u6b7b"),n.a.createElement("label",null,"\u753b\u50cf",n.a.createElement("input",{type:"file",accept:"image/*",onChange:this.handleNewImage})),n.a.createElement("label",{className:"FaceEditor-Controls-Delete",onClick:this.handleDeleteImage},"\xd7")),n.a.createElement("div",{className:"FaceEditor-Controls FaceEditor-Controls-Bottom"},n.a.createElement("input",{type:"range",className:"FaceEditor-Controls-Scale",step:"0.01",min:"1",max:"2",value:this.state.scale,onChange:this.handleScale})))}}]),a}(n.a.Component),f="Copyright (C) SQUARE ENIX CO., LTD. All Rights Reserved.";var p=function(e){Object(u.a)(a,e);var t=Object(d.a)(a);function a(e){var i;return Object(s.a)(this,a),(i=t.call(this,e)).canvasPreview=null,i.ctxPreview=null,i.canvasFace=null,i.ctxFace=null,i.canvasTitle=null,i.ctxTitle=null,i.startTime=-1,i.prevFadeRatio=-1,i.frameStartTime=-1,i.gifjs=null,i.dlImage=document.createElement("img"),i.state={length:8,title:"",previewing:!1,canDL:!1,downloadUrl:"",fileName:"",recording:!1,showCopyright:!0},i.handleMemberLengthChange=i.handleMemberLengthChange.bind(Object(o.a)(i)),i.handleChangeTitle=i.handleChangeTitle.bind(Object(o.a)(i)),i.handleClickPreview=i.handleClickPreview.bind(Object(o.a)(i)),i.handleChangeCopyright=i.handleChangeCopyright.bind(Object(o.a)(i)),i.animate=i.animate.bind(Object(o.a)(i)),i}return Object(h.a)(a,[{key:"componentDidMount",value:function(){this.canvasPreview=document.querySelector("#Preview-Canvas"),this.canvasPreview&&(this.ctxPreview=this.canvasPreview.getContext("2d")),this.canvasFace=document.querySelector("#Preview-Canvas-Cache-Face"),this.canvasFace&&(this.ctxFace=this.canvasFace.getContext("2d")),this.canvasTitle=document.querySelector("#Preview-Canvas-Cache-Title"),this.canvasTitle&&(this.ctxTitle=this.canvasTitle.getContext("2d"))}},{key:"faceListClass",value:function(){return this.state.length<=4?"FaceList-Max4":this.state.length<=6?"FaceList-Max3":this.state.length<=8?"FaceList-Max4":"FaceList-Max5"}},{key:"faceList",value:function(){return Array.from({length:this.state.length},(function(e,t){return t})).map((function(e){return n.a.createElement(g,{width:150,height:270,key:e.toString()})}))}},{key:"handleChangeCopyright",value:function(){this.setState((function(e){return{showCopyright:!e.showCopyright}}))}},{key:"handleMemberLengthChange",value:function(e){var t=parseInt(e.target.value);this.setState({length:t})}},{key:"handleChangeTitle",value:function(e){var t=e.target.value||"";this.setState({title:t})}},{key:"handleClickPreview",value:function(){this.canvasPreview&&this.canvasFace&&this.canvasTitle&&(this.drawFaceList(),this.drawTitle(),this.gifjs=new GIF({workerScript:"js/gif.worker.js",quality:10,workers:2,width:480,height:360}),this.startTime=(new Date).getTime(),this.frameStartTime=-1,this.prevFadeRatio=-1,requestAnimationFrame(this.animate),this.setState({previewing:!0,downloadUrl:"",fileName:"",canDL:!1,recording:!0}))}},{key:"addFrame",value:function(e){if(this.ctxPreview&&this.gifjs)if(this.frameStartTime<=0)this.frameStartTime=e;else{var t=e-this.frameStartTime;this.gifjs.addFrame(this.ctxPreview,{copy:!0,delay:t}),this.frameStartTime=e}}},{key:"saveGif",value:function(){if(this.gifjs){var e=this;this.gifjs.on("finished",(function(t){var a=URL.createObjectURL(t);e.dlImage.src=a,e.setState({downloadUrl:a,fileName:(e.state.title||"titlecall")+".gif",canDL:!0,recording:!1})})),this.gifjs.render()}}},{key:"animate",value:function(){if(!(this.startTime<0)){var e=(new Date).getTime(),t=e-this.startTime;if(t>7e3)return this.addFrame(e),void this.saveGif();var a=function(e){return e<=500||e>6500?-100:e<=2700?0:e>3500?101:100*((t=(e-2200)/800)*t*t);var t}(t);this.prevFadeRatio!==a&&(this.addFrame(e),this.drawFrame(a),this.prevFadeRatio=a),requestAnimationFrame(this.animate)}}},{key:"drawFrame",value:function(e){if(this.ctxPreview&&this.ctxFace&&this.ctxTitle&&this.canvasPreview&&this.canvasFace&&this.canvasTitle){if(e<0)return this.ctxPreview.fillStyle="rgb(0, 0, 0)",void this.ctxPreview.fillRect(0,0,480,360);if(this.ctxPreview.globalAlpha=1,this.ctxPreview.drawImage(this.canvasFace,0,0),!(e<1))if(e>100)this.ctxPreview.drawImage(this.canvasTitle,0,0);else{var t=.01*e;this.ctxPreview.globalAlpha=t+.1;var a=8-7*t,i=480*a,n=360*a,l=(i-480)/2*-1,r=(n-360)/2*-1;this.ctxPreview.drawImage(this.canvasTitle,0,0,480,360,l,r,i,n)}}}},{key:"getFaceCanvases",value:function(){var e=document.querySelectorAll(".FaceEditor-Canvas");if(e.length!==this.state.length)return[];if(Array.from(e).map((function(e){return e?e.getContext("2d"):null})).filter((function(e){return!!e})).length!==this.state.length)return[];var t=document.querySelectorAll(".FaceEditor-Controls-Died");return t.length!==this.state.length?[]:Array.from(t).map((function(t,a){return{canvas:e[a]||void 0,died:t.checked||!1}}))}},{key:"getTitle",value:function(){return"\u300c"+(this.state.title||"\u30a8\u30d5\u30a8\u30d5\u30b8\u30e5\u30fc\u30e8\u30f3\u6bba\u4eba\u4e8b\u4ef6")+"\u300d"}},{key:"calculatePosition",value:function(e){var t,a,i=0;e.length<5?(a=480/(e.length+1),i=(360-(t=270*a/150))/2):a=150*(t=180)/270;var n=function(e,n){return Array.from({length:e}).map((function(l,r){return{x:(480-a*e)/2+(a+1)*r,y:n+i,w:a,h:t}}))},l=[];switch(e.length){case 8:l.unshift.apply(l,Object(c.a)(n(4,t+1))),l.unshift.apply(l,Object(c.a)(n(4,0)));break;case 7:l.unshift.apply(l,Object(c.a)(n(3,t+1))),l.unshift.apply(l,Object(c.a)(n(4,0)));break;case 6:l.unshift.apply(l,Object(c.a)(n(3,t+1))),l.unshift.apply(l,Object(c.a)(n(3,0)));break;case 5:l.unshift.apply(l,Object(c.a)(n(2,t+1))),l.unshift.apply(l,Object(c.a)(n(3,0)));break;case 4:l.unshift.apply(l,Object(c.a)(n(4,0)));break;case 3:l.unshift.apply(l,Object(c.a)(n(3,0)));break;case 2:l.unshift.apply(l,Object(c.a)(n(2,0)))}return l}},{key:"drawFaceList",value:function(){if(this.ctxFace){var e=this.getFaceCanvases();if(e.length===this.state.length){var t=this.calculatePosition(e);if(t.length===this.state.length){this.ctxFace.fillStyle="rgb(0, 0, 0)",this.ctxFace.fillRect(0,0,480,360);for(var a=0;a<e.length;a++)if(e[a].died){var i=e[a].canvas;if(i){var n=t[a];this.ctxFace.drawImage(i,0,0,150,270,n.x,n.y,n.w,n.h)}}var l=this.ctxFace.getImageData(0,0,480,360);!function(e){for(var t=0;t<e.length;t+=4){var a=.299*e[t]+.587*e[t+1]+.114*e[t+2];e[t]=a,e[t+1]=a,e[t+2]=a}}(l.data),this.ctxFace.putImageData(l,0,0),this.ctxFace.globalAlpha=.5,this.ctxFace.fillStyle="rgb(0, 0, 0)",this.ctxFace.fillRect(0,0,480,360),this.ctxFace.globalAlpha=1;for(var r=0;r<e.length;r++)if(!e[r].died){var c=e[r].canvas;if(c){var s=t[r];this.ctxFace.drawImage(c,0,0,150,270,s.x,s.y,s.w,s.h)}}this.state.showCopyright&&this.drawCopyright()}}}}},{key:"drawCopyright",value:function(){this.ctxFace&&(this.ctxFace.font="12px 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif",this.ctxFace.textAlign="center",this.ctxFace.lineWidth=5,this.ctxFace.strokeStyle="#FFFFFF",this.ctxFace.globalAlpha=.5,this.ctxFace.strokeText(f,240,356),this.ctxFace.lineWidth=3,this.ctxFace.strokeStyle="#000000",this.ctxFace.globalAlpha=.8,this.ctxFace.strokeText(f,240,356),this.ctxFace.fillStyle="#FFFFFF",this.ctxFace.globalAlpha=1,this.ctxFace.fillText(f,240,356))}},{key:"getFont",value:function(e){return"bold "+e+"px 'Times New Roman', 'YuMincho', 'Hiragino Mincho ProN', 'Yu Mincho', 'MS PMincho', serif"}},{key:"getTextSize",value:function(e,t){for(var a=Math.floor(480/(t.length-2));;){if(e.font=this.getFont(a),e.measureText(t).width<480)break;a--}return a}},{key:"drawTitle",value:function(){if(this.ctxTitle){var e=this.getTitle(),t=this.getTextSize(this.ctxTitle,e);this.ctxTitle.fillStyle="rgb(0, 0, 0)",this.ctxTitle.fillRect(0,0,480,360),this.ctxTitle.fillStyle="rgb(255, 255, 255)",this.ctxTitle.font=this.getFont(t),this.ctxTitle.textAlign="center",this.ctxTitle.fillText(e,240,180)}}},{key:"render",value:function(){return n.a.createElement("div",{className:"App"},n.a.createElement("div",{className:"GeneralControls"},n.a.createElement("table",{className:"GeneralControls-ControlTable"},n.a.createElement("tbody",null,n.a.createElement("tr",null,n.a.createElement("th",null,n.a.createElement("label",{htmlFor:"num_of_suspects"},"\u4eba\u6570")),n.a.createElement("td",null,n.a.createElement("input",{type:"number",id:"num_of_suspects",min:"2",max:"8",value:String(this.state.length),onChange:this.handleMemberLengthChange}),n.a.createElement("span",null,"\uff082\uff5e8\u4eba\uff09"))),n.a.createElement("tr",null,n.a.createElement("th",null,n.a.createElement("label",{htmlFor:"text_title"},"\u30bf\u30a4\u30c8\u30eb")),n.a.createElement("td",null,n.a.createElement("input",{type:"text",id:"text_title",placeholder:"\u30a8\u30d5\u30a8\u30d5\u30b8\u30e5\u30fc\u30e8\u30f3\u6bba\u4eba\u4e8b\u4ef6",value:this.state.title,onChange:this.handleChangeTitle}))),n.a.createElement("tr",null,n.a.createElement("td",null),n.a.createElement("td",null,n.a.createElement("label",{id:"GeneralControls-Copyright"},n.a.createElement("input",{type:"checkbox",checked:this.state.showCopyright,onChange:this.handleChangeCopyright}),"FFXIV\u6a29\u5229\u8868\u8a18\u3092\u633f\u5165\u3059\u308b")))))),n.a.createElement("div",{className:"FaceList "+this.faceListClass()},this.faceList()),n.a.createElement("div",{className:"Preview-Area"},n.a.createElement("button",{className:"Preview-Button",onClick:this.handleClickPreview,disabled:this.state.recording},"\u751f\u6210"),n.a.createElement("canvas",{id:"Preview-Canvas",style:{display:this.state.previewing?"block":"none"},width:480,height:360}),n.a.createElement("canvas",{id:"Preview-Canvas-Cache-Face",width:480,height:360}),n.a.createElement("canvas",{id:"Preview-Canvas-Cache-Title",width:480,height:360}),n.a.createElement("a",{id:"Preview-Canvas-Download-Link",style:{display:this.state.canDL?"inline":"none"},href:this.state.downloadUrl,download:this.state.fileName},"GIF\u3092\u30c0\u30a6\u30f3\u30ed\u30fc\u30c9")))}}]),a}(n.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(n.a.createElement(n.a.StrictMode,null,n.a.createElement(p,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[10,1,2]]]);
//# sourceMappingURL=main.49266b8d.chunk.js.map