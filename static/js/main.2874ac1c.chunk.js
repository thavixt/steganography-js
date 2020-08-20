(this["webpackJsonpsteganography-js"]=this["webpackJsonpsteganography-js"]||[]).push([[0],{25:function(e){e.exports=JSON.parse('{"en":{"color_selector":{"select_color":"Select a color"},"common":{"clear":"Clear","compare":"Compare","difference":"Difference","download":"Download","image":"Image","mode":"Mode","payload":"Payload","text":"Text"},"comparison":{"diff_color":"Highlighted difference color","first_image":"First image","second_image":"Second image"},"footer":{"inspired_by":"Inspired by Computerphile\'s video"},"image_input":{"select_file":"Select an image file (preferably .bmp/.png)"},"notification":{"decoding_finished":"Decoding finished in {{time}} milliseconds.","diffing_finished":"Diffing finished in {{time}} milliseconds.","encoding_finished":"Encoding finished in {{time}} milliseconds.","error_noty":"Process aborted.<br/>Error message: {{message}}","size_mismatch_confirm":"The payload image will not fit into the source image.\\nContinue anyway?","source_size_too_small":"The source image must be at least 4*4 pixels in size.","text_size_too_big":"The decoded text has been downloaded.\\nPlease be aware that this file might be several MBs in size, and may briefly freeze your text editor when opened.\\n\\nIf you wish to hide some text into your image:\\n\\t- \'Clear\' this text area\\n\\t- type your message here\\n\\t- and click \'Encode\'.","unknown_operation":"Unknown operation - check the console for details."},"progress_bar":{"perf_info":"Usage with high-res images may result in decreased performance."},"text_input":{"label":"Text I/O","large_file_info":"Larger text output will be automatically downloaded as a .txt file. These files can be several MBs in size depending on the source image, so try opening it with a roboust text editor."}}}')},27:function(e,t,a){e.exports=a(45)},32:function(e,t,a){},35:function(e,t,a){},36:function(e,t,a){},37:function(e,t,a){},38:function(e,t,a){},39:function(e,t,a){},44:function(e,t,a){},45:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(23),o=a.n(s),i=(a(32),a(16)),c=a(26),l=a(15),d=a(1),m=(a(33),a(34),a(35),a(13)),u=a(6),h=a(7),p=a(9),g=a(8),f=a(14),v=a.n(f),E=a(10),b=a.n(E),w=Object(n.createContext)((function(e){return"{".concat(e,"}")})),y=function(e){Object(p.a)(a,e);var t=Object(g.a)(a);function a(){var e;Object(u.a)(this,a);for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return(e=t.call.apply(t,[this].concat(s)))._canvas=Object(n.createRef)(),e._fileInput=Object(n.createRef)(),e.state={fileName:"",fileLoaded:!1,scale:"initial"},e.scale=function(t){e.setState({scale:t})},e.handleFileChange=function(t){var a=e._canvas.current,n=a.getContext("2d");if(t){var r,s,o=new FileReader;o.onload=function(){n.clearRect(0,0,a.width,a.height);var e=new Image;e.onload=function(){a.height=e.height,a.width=e.width,n.imageSmoothingEnabled=!1,n.drawImage(e,0,0)},e.src=o.result},o.readAsDataURL(t),e.setState({fileName:t.name,fileLoaded:!0}),null===(r=(s=e.props).onFileLoaded)||void 0===r||r.call(s,!0,t.name)}else{var i,c;e.setState({fileName:"",fileLoaded:!1}),null===(i=(c=e.props).onFileLoaded)||void 0===i||i.call(c,!1,""),n.clearRect(0,0,a.width,a.height),a.height=150,a.width=300}},e.resetState=function(){e.setState({fileName:"",fileLoaded:!1}),!e.props.disableInput&&e._fileInput.current&&(e._fileInput.current.value="");var t=e._canvas.current;t.getContext("2d").clearRect(0,0,t.width,t.height),t.height=150,t.width=300},e.updateImage=function(t,a){e.setState({fileName:a,fileLoaded:!0});var n=e._canvas.current,r=n.getContext("2d");r.clearRect(0,0,n.width,n.height),n.height=t.height,n.width=t.width,r.imageSmoothingEnabled=!1,r.putImageData(t,0,0)},e.downloadCanvas=function(){var t="stegojs_"+(1e6*Math.random()).toFixed()+"_"+e.state.fileName+".bmp";e._canvas.current.toBlob((function(e){e&&v.a.saveAs(e,t)}))},e.handleProcess=function(){var t=e._canvas.current,a=t.getContext("2d").getImageData(0,0,t.width,t.height).data.buffer;e.props.process&&e.props.processName&&e.props.process({process:e.props.processName,image:{buffer:a,width:t.width,height:t.height}})},e}return Object(h.a)(a,[{key:"render",value:function(){var e=this,t=this.context,a=!this.props.clear||!this.state.fileLoaded||this.props.isAProcessActive,n=!this.props.sourceFileLoaded||!this.state.fileLoaded||this.props.isAProcessActive;return r.a.createElement("div",{className:"CanvasSelection"},!this.props.disableInput&&r.a.createElement("div",null,r.a.createElement("label",{className:"label",htmlFor:this.props.id+"-input"},t("image_input:select_file")),r.a.createElement("br",null),r.a.createElement("input",{type:"file",id:this.props.id+"-input",ref:this._fileInput,onChange:function(t){var a;return e.handleFileChange(null===(a=t.target.files)||void 0===a?void 0:a[0])}})),r.a.createElement("br",null),r.a.createElement("div",{hidden:this.props.hideCanvas,className:"section-content scale-transition scale-"+this.state.scale},r.a.createElement("label",{className:"label",htmlFor:this.props.id+"-canvas"},this.state.fileName||"Image"),r.a.createElement("canvas",{id:this.props.id+"-canvas",ref:this._canvas})),r.a.createElement("div",{className:"section-actions secondary"},this.props.clear&&r.a.createElement("button",{className:"waves-effect waves-light btn pink darken-1 black-text",disabled:a,onClick:function(){return e.resetState()}},t("common:clear")),this.props.download&&r.a.createElement("button",{className:"waves-effect waves-light btn pink darken-1 black-text",disabled:a,onClick:function(){return e.downloadCanvas()}},t("common:download"))),r.a.createElement("div",{className:"section-actions"},this.props.process&&r.a.createElement("button",{className:"waves-effect waves-light btn grey darken-4",disabled:n,onClick:function(){return e.handleProcess()}},"encode"===this.props.processName?r.a.createElement("i",{className:"material-icons left"}):r.a.createElement("i",{className:"material-icons right"}),this.props.processName)))}}]),a}(n.Component);y.contextType=w;a(36);var x=function(e){Object(p.a)(a,e);var t=Object(g.a)(a);function a(){var e;Object(u.a)(this,a);for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return(e=t.call.apply(t,[this].concat(s)))._textArea=Object(n.createRef)(),e.resetState=function(){e._textArea.current&&(e._textArea.current.value="")},e.setText=function(t){e._textArea.current&&(e._textArea.current.value=t)},e.handleProcess=function(){var t,a=JSON.stringify(null===(t=e._textArea.current)||void 0===t?void 0:t.value),n=(new TextEncoder).encode(a).buffer;e.props.process&&e.props.processName&&e.props.process({process:e.props.processName,text:{buffer:n,length:a.length}})},e}return Object(h.a)(a,[{key:"render",value:function(){var e=this,t=this.context,a=!this.props.sourceFileLoaded||this.props.isAProcessActive;return r.a.createElement("div",{className:"TextAreaSelection"},r.a.createElement("div",{className:"section-content input-field"},r.a.createElement("label",{className:"label",htmlFor:this.props.id+"-text"},t("text_input:label")," *"),r.a.createElement("br",null),r.a.createElement("br",null),r.a.createElement("textarea",{className:"materialize-textarea textarea",id:this.props.id+"-text",ref:this._textArea}),r.a.createElement("span",null,"* ",r.a.createElement("small",null,t("text_input:large_file_info")))),r.a.createElement("div",{className:"section-actions secondary"},r.a.createElement("button",{className:"waves-effect waves-light btn pink darken-1 black-text",disabled:this.props.isAProcessActive,onClick:function(){return e.resetState()}},t("common:clear"))),r.a.createElement("div",{className:"section-actions"},r.a.createElement("button",{className:"waves-effect waves-light btn grey darken-4",disabled:a,onClick:function(){return e.handleProcess()}},this.props.processName)))}}]),a}(n.Component);x.contextType=w;a(37);function _(e){var t=Object(n.useContext)(w);return r.a.createElement("div",{className:"App-progress",id:e.id||""},r.a.createElement("div",{className:"progress-indicator-wrapper"},r.a.createElement("div",{className:"grey darken-4 progress-indicator "+(e.active?"active":""),style:{width:e.progress+"%"}})),r.a.createElement("label",{className:"progress-description ".concat(e.active?"active":"")},r.a.createElement("span",null,e.progress>0?"".concat(e.progress,"%"):t("progress_bar:perf_info"))))}var N=function(e){Object(p.a)(a,e);var t=Object(g.a)(a);function a(){var e;Object(u.a)(this,a);for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return(e=t.call.apply(t,[this].concat(s)))._sourceCanvas=Object(n.createRef)(),e._resultCanvas=Object(n.createRef)(),e._resultTextArea=Object(n.createRef)(),e.state={mode:"image",sourceFileLoaded:!1,sourceFileName:"",processActive:!1,progress:0},e.decoder=null,e.encoder=null,e.sourceFileLoaded=function(t,a){e.setState({sourceFileLoaded:t,sourceFileName:a})},e.changeOutputMode=function(t){e.setState({mode:t})},e.resetCanvas=function(){document.getElementById("source-input").value="";var e=document.getElementById("source-canvas");e.getContext("2d").clearRect(0,0,e.width,e.height),e.height=150,e.width=300},e.onDecoderMessage=function(t){if(t.data.progressBar&&e.setState({progress:t.data.progressBar}),t.data.error&&(e.setState({processActive:!1}),e.setState({progress:0}),new b.a({theme:"nest",type:"error",layout:"topRight",text:e.context("notification:error_noty",{message:t.data.error}),timeout:5e3}).show()),t.data.done){e.setState({progress:100});var a=e.state.sourceFileName.split(".").shift()+"_stegojs_"+(1e4*Math.random()).toFixed();if("text"===t.data.type){var n=new TextDecoder("utf-8"),r=new DataView(t.data.result.buffer,0,t.data.result.buffer.byteLength),s=JSON.parse(n.decode(r));if(s.length>1e3){var o;null===(o=e._resultTextArea.current)||void 0===o||o.setText(e.context("notification:text_size_too_big"));var i=new Blob(s,{type:"text/plain;charset=utf-8"});v.a.saveAs(i,a+".txt")}else{var c,l=s.join("");null===(c=e._resultTextArea.current)||void 0===c||c.setText(l)}}else if("image"===t.data.type){var d,m,u=new Uint8ClampedArray(t.data.result.buffer),h=new ImageData(u,t.data.result.width,t.data.result.height);null===(d=e._resultCanvas.current)||void 0===d||d.updateImage(h,a+".bmp"),null===(m=e._resultCanvas.current)||void 0===m||m.scale("in")}new b.a({theme:"nest",type:"success",layout:"topRight",text:e.context("notification:decoding_finished",{time:t.data.done}),timeout:5e3}).show(),e.decoder&&(e.decoder.terminate(),e.decoder=null),setTimeout((function(){e.setState({processActive:!1}),e.setState({progress:0})}),1e3)}},e.decode=function(t){if("image"===e.state.mode&&(t.image.height<2||t.image.width<2))new b.a({theme:"nest",type:"error",layout:"topRight",text:e.context("notification:source_size_too_small"),timeout:5e3}).show();else{var a,n;if("image"===e.state.mode)null===(a=e._resultCanvas.current)||void 0===a||a.scale("out");else null===(n=e._resultTextArea.current)||void 0===n||n.resetState();e.setState({processActive:!0}),e.decoder=new Worker("".concat("/steganography-js","/workers/decoder.worker.js")),e.decoder.onmessage=e.onDecoderMessage,e.decoder.postMessage(Object(m.a)(Object(m.a)({},t),{},{mode:e.state.mode}),[t.image.buffer])}},e.onEncoderMessage=function(t){if(t.data.progressBar&&e.setState({progress:t.data.progressBar}),t.data.error&&(e.setState({processActive:!1}),e.setState({progress:0}),new b.a({theme:"nest",type:"error",layout:"topRight",text:e.context("notification:error_noty",{message:t.data.error}),timeout:5e3}).show()),t.data.done){var a,n;e.setState({progress:100});var r=e.state.sourceFileName.split(".").shift()+"_stegojs_"+(1e4*Math.random()).toFixed(),s=new Uint8ClampedArray(t.data.result.buffer),o=new ImageData(s,t.data.result.width,t.data.result.height);null===(a=e._sourceCanvas.current)||void 0===a||a.updateImage(o,r+".bmp"),null===(n=e._sourceCanvas.current)||void 0===n||n.scale("in"),new b.a({theme:"nest",type:"success",layout:"topRight",text:e.context("notification:encoding_finished",{time:t.data.done}),timeout:5e3}).show(),e.encoder&&(e.encoder.terminate(),e.encoder=null),setTimeout((function(){e.setState({processActive:!1}),e.setState({progress:0})}),1e3)}},e.encode=function(t){var a,n,r;e.setState({processActive:!0});var s=document.getElementById("source-canvas"),o=s.getContext("2d").getImageData(0,0,s.width,s.height),i={buffer:o.data.buffer,width:s.width,height:s.height};if("image"===e.state.mode&&t.image){var c;if((2*t.image.height>i.height||2*t.image.width>i.width)&&!window.confirm(e.context("notification:size_mismatch_confirm")))return void e.setState({processActive:!1});n=t.image,r=[o.data.buffer,t.image.buffer],null===(c=e._resultCanvas.current)||void 0===c||c.resetState()}else{if("text"!==e.state.mode||!t.text)return window.alert(e.context("notification:unknown_operation")),void console.error('Encode process "'+e.state.mode+'" is not recognized.');var l;n=t.text,r=[o.data.buffer],null===(l=e._resultTextArea.current)||void 0===l||l.resetState()}null===(a=e._sourceCanvas.current)||void 0===a||a.scale("out"),e.setState({processActive:!0}),e.encoder=new Worker("".concat("/steganography-js","/workers/encoder.worker.js")),e.encoder.onmessage=e.onEncoderMessage,e.encoder.postMessage({image:i,payload:n,mode:e.state.mode,proces:t.process},r)},e}return Object(h.a)(a,[{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement("div",{className:"App-content"},r.a.createElement("div",{className:"output-selector",id:"io-selector"},r.a.createElement("label",{htmlFor:"mode"},this.context("common:payload"),":"),r.a.createElement("label",{className:"radio-label"},r.a.createElement("input",{name:"mode",type:"radio",onChange:function(){return e.changeOutputMode("image")},defaultChecked:!0}),r.a.createElement("span",null,this.context("common:image"))),r.a.createElement("label",{className:"radio-label"},r.a.createElement("input",{name:"mode",type:"radio",onChange:function(){return e.changeOutputMode("text")}}),r.a.createElement("span",null,this.context("common:text")))),r.a.createElement(_,{active:this.state.processActive,progress:this.state.progress,id:"stego-progressbar"}),r.a.createElement("div",{id:"grid-wrapper"},r.a.createElement("div",{className:"grid-element",id:"source-section"},r.a.createElement("h5",{className:"section-title"},"Source image"),r.a.createElement(y,{ref:this._sourceCanvas,id:"source",sourceFileLoaded:!0,onFileLoaded:function(t,a){return e.sourceFileLoaded(t,a)},process:function(t){return e.decode(t)},processName:"decode",isAProcessActive:this.state.processActive,clear:!0,download:!0})),r.a.createElement("div",{className:"grid-element",id:"result-section"},r.a.createElement("h5",{className:"section-title"},this.context("common:payload")),"image"===this.state.mode?r.a.createElement(y,{ref:this._resultCanvas,id:"result",sourceFileLoaded:this.state.sourceFileLoaded,onFileLoaded:function(){},process:function(t){return e.encode(t)},isAProcessActive:this.state.processActive,processName:"encode",clear:!0,download:!0}):r.a.createElement(x,{ref:this._resultTextArea,id:"result",clear:"true",sourceFileLoaded:this.state.sourceFileLoaded,onFileLoaded:function(){},process:function(t){return e.encode(t)},isAProcessActive:this.state.processActive,processName:"encode"})))))}}]),a}(n.Component);N.contextType=w;a(38);var C=function(e){Object(p.a)(a,e);var t=Object(g.a)(a);function a(){var e;Object(u.a)(this,a);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return(e=t.call.apply(t,[this].concat(r))).state={r:101,g:31,b:255,a:255},e.getColor=function(){return e.state},e.setColor=function(t){var a=t.r,n=t.g,r=t.b;e.setState({r:a,g:n,b:r})},e.selectColor=function(t){e.setState(Object(m.a)({},A(t)))},e}return Object(h.a)(a,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"color-selector"},this.context("color_selector:select_color"),":",r.a.createElement("input",{type:"color",onChange:function(t){return e.selectColor(t.target.value)},defaultValue:S(this.state.r,this.state.g,this.state.b)}),r.a.createElement("span",{className:"color-selector-preview",style:{backgroundColor:"rgba(".concat(Object.values(this.state).join(","),")")}}))}}]),a}(n.Component);C.contextType=w;var A=function(e){var t=e.split("#").pop(),a=parseInt(t,16);return{r:a>>16&255,g:a>>8&255,b:255&a}},S=function(e,t,a){return"#"+k(e)+k(t)+k(a)},k=function(e){var t=e.toString(16);return 1===t.length?"0"+t:t},j=function(e){Object(p.a)(a,e);var t=Object(g.a)(a);function a(){var e;Object(u.a)(this,a);for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return(e=t.call.apply(t,[this].concat(s)))._resultCanvas=Object(n.createRef)(),e._colorSelector=Object(n.createRef)(),e._firstImage=Object(n.createRef)(),e._secondImage=Object(n.createRef)(),e.state={processActive:!1,progress:0,firstFile:!1,secondFile:!1},e.differ=null,e.firstFileLoaded=function(t,a){e.setState({firstFile:t})},e.secondFileLoaded=function(t,a){e.setState({secondFile:t})},e.onDifferMessage=function(t){var a=e.context;if(t.data.progressBar&&e.setState({progress:t.data.progressBar}),t.data.error&&(e.setState({processActive:!1,progress:0}),new b.a({theme:"nest",type:"error",layout:"topRight",text:a("notification:error_noty",{message:t.data.error}),timeout:2e3}).show()),t.data.done){var n,r;e.setState({progress:100});var s="diff_stegojs_"+(1e4*Math.random()).toFixed(),o=new Uint8ClampedArray(t.data.result.buffer),i=new ImageData(o,t.data.result.width,t.data.result.height);null===(n=e._resultCanvas.current)||void 0===n||n.updateImage(i,s+".bmp"),null===(r=e._resultCanvas.current)||void 0===r||r.scale("in"),new b.a({theme:"nest",type:"success",layout:"topRight",text:a("notification:diffing_finished",{time:t.data.done}),timeout:5e3}).show(),e.differ&&(e.differ.terminate(),e.differ=null),setTimeout((function(){e.setState({processActive:!1,progress:0})}),1e3)}},e.diff=function(){var t,a,n;null===(t=e._resultCanvas.current)||void 0===t||t.resetState();var r=document.getElementById("first-image-canvas"),s={buffer:r.getContext("2d").getImageData(0,0,r.width,r.height).data.buffer,width:r.width,height:r.height},o=document.getElementById("second-image-canvas"),i={buffer:o.getContext("2d").getImageData(0,0,o.width,o.height).data.buffer,width:o.width,height:o.height},c={process:"diff",mode:"image",diffColor:null===(a=e._colorSelector.current)||void 0===a?void 0:a.getColor(),first:s,second:i},l=[s.buffer,i.buffer];null===(n=e._resultCanvas.current)||void 0===n||n.scale("out"),e.setState({processActive:!0}),e.differ=new Worker("".concat("/steganography-js","/workers/differ.worker.js")),e.differ.onmessage=e.onDifferMessage,e.differ.postMessage(c,l)},e}return Object(h.a)(a,[{key:"render",value:function(){var e=this;return r.a.createElement("div",{className:"App-content pad-top"},r.a.createElement(_,{active:this.state.processActive,progress:this.state.progress}),r.a.createElement("div",{id:"grid-wrapper-vertical"},r.a.createElement("div",{className:"grid-element",id:"first-section",style:{gridColumnStart:1}},r.a.createElement("h5",{className:"section-title"},this.context("comparison:first_image")),r.a.createElement(y,{ref:this._firstImage,id:"first-image",onFileLoaded:function(t,a){return e.firstFileLoaded(t,a)},isAProcessActive:this.state.processActive,hideCanvas:!0})),r.a.createElement("div",{className:"grid-element",id:"second-section",style:{gridColumnStart:1}},r.a.createElement("h5",{className:"section-title"},this.context("comparison:second_image")),r.a.createElement(y,{ref:this._secondImage,id:"second-image",sourceFileLoaded:!0,onFileLoaded:function(t,a){return e.secondFileLoaded(t,a)},isAProcessActive:this.state.processActive,hideCanvas:!0})),r.a.createElement("div",{className:"grid-element",id:"highlight-section",style:{gridColumnStart:1}},r.a.createElement("h5",{className:"section-title"},this.context("comparison:diff_color")),r.a.createElement(C,{ref:this._colorSelector})),r.a.createElement("div",{className:"grid-element",id:"result-section",style:{gridRow:"1 / span 4",gridColumnStart:2}},r.a.createElement("h5",{className:"section-title"},this.context("common:difference")),r.a.createElement(y,{ref:this._resultCanvas,id:"result-image",disableInput:!0}),r.a.createElement("div",{className:"section-actions"},r.a.createElement("button",{className:"waves-effect waves-light btn grey darken-4",disabled:!this.state.firstFile||!this.state.secondFile||this.state.processActive,onClick:this.diff,style:{margin:"auto"}},this.context("common:compare"))))))}}]),a}(n.Component);function F(){return r.a.createElement("div",null,r.a.createElement("div",{className:"App-content pad-top"},r.a.createElement("div",{className:"how"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col s12 m6"},r.a.createElement("h4",null,"What is steganography?"),r.a.createElement("blockquote",null,r.a.createElement("strong",null,"Steganography"),"is the practice of concealing a file, message, image, or video within another file, message, image, or video."),r.a.createElement("p",null,"The advantage of steganography over cryptography alone is that the intended secret message does not attract attention to itself as an object of scrutiny. Plainly visible encrypted messages \u2014 no matter how unbreakable \u2014 arouse interest, and may in themselves be incriminating in countries where encryption is illegal. Thus, whereas cryptography is the practice of protecting the contents of a message alone, steganography is concerned with ",r.a.createElement("strong",null," concealing the fact that a secret message is being sent at all "),", as well as concealing the contents of the message.")),r.a.createElement("div",{className:"col s12 m6"},r.a.createElement("h4",null,"Digital steganography"),r.a.createElement("p",null,"Steganography includes the concealment of information within computer files. In ",r.a.createElement("strong",null,"digital steganography"),", electronic communications may include steganographic coding inside of a transport layer, such as a document file,  image file, program or protocol. ",r.a.createElement("strong",null,"Media files")," are ideal for steganographic transmission because of their large size."),r.a.createElement("p",null,"For example, a sender might start with an innocuous image file and adjust the color of every 100th pixel to correspond to a letter in the alphabet, a change so subtle that someone not specifically looking for it is unlikely to notice it."),r.a.createElement("p",null,"Read below about this application's implementation of digital steganography."),r.a.createElement("p",null,r.a.createElement("small",null,"source: ",r.a.createElement("strong",null,r.a.createElement("a",{href:"https://en.wikipedia.org/wiki/Steganography",target:"_blank",rel:"noopener noreferrer"},"WikiPedia"))))))),r.a.createElement("div",{className:"how"},r.a.createElement("h4",null,"How is it done?"),r.a.createElement("p",null,"This section covers the process of encoding and decoding text from a steganograpic image."),r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col s12 m6"},r.a.createElement("h5",{className:"section-title"},"Decoding",r.a.createElement("small",null,"- reading the hidden data")),r.a.createElement("strong",null,"Step 1:"),r.a.createElement("p",null,"We draw the selected image to a canvas (sometimes in the background), then read it pixel-by-pixel. Each pixel is stored as an array of four 8bit values: ",r.a.createElement("em",null,"red, green, blue and alpha (transparency)")," respectively."),r.a.createElement("pre",null,r.a.createElement("code",null,"[125, 48, 210, 255]")),r.a.createElement("strong",null,"Step 2:"),r.a.createElement("p",null,"These values are then converted to binary."),r.a.createElement("pre",null,r.a.createElement("code",null,"[01111101, 00110000, 11010010, 11111111]")),r.a.createElement("strong",null,"Step 3:"),r.a.createElement("p",null,"We extract the steganographic, ",r.a.createElement("em",null,"hidden")," data by taking the last 2 bits of every byte of each pixel."),r.a.createElement("pre",null,r.a.createElement("code",null,"[01111101, 00110000, 11010010, 11111111]",r.a.createElement("br",null),"[      01,       00,       10,       11]")),r.a.createElement("strong",null,"Step 4:"),r.a.createElement("p",null,"The two least significant, steganographic bits are concatenated in pairs of 4 into 1 bytes each."),r.a.createElement("pre",null,r.a.createElement("code",null,"[...01, ...00, ...10, ...11]"," => 01001011")),r.a.createElement("strong",null,"Step 5:"),r.a.createElement("p",null,"Finally, the bytes are cast to integers, then converted to the appropriate ASCII characters, revealing the steganographic data hidden in the image (if there is any)."),r.a.createElement("pre",null,r.a.createElement("code",null,"01001011 => 075 => K"))),r.a.createElement("div",{className:"col s12 m6"},r.a.createElement("h5",{className:"section-title"},"Encoding",r.a.createElement("small",null,"- hiding your own data")),r.a.createElement("strong",null,"Step 1:"),r.a.createElement("p",null,"Each character of the message is converted to the ASCII number representation of it, then cast to a single byte."),r.a.createElement("pre",null,r.a.createElement("code",null,"a => 097 => 01100001")),r.a.createElement("strong",null,"Step 2:"),r.a.createElement("p",null,"Each byte is cut into 4*2 bits"),r.a.createElement("pre",null,r.a.createElement("code",null,"01100001 => ","01, 10, 00, 01")),r.a.createElement("strong",null,"Step 3:"),r.a.createElement("p",null,"During the decoding proccess, we stored the 8bit representation of the rgba data of each pixel in the original image to avoid parsing it twice. The bit-pairs from the last step replace the last two bits of every byte in the original image."),r.a.createElement("pre",null,r.a.createElement("code",null,"original: ","01111101, 00110000, 11010010, 11111111",r.a.createElement("br",null),"message: ","      01,       10,       00,       01",r.a.createElement("br",null),"new: ","01111101, 00110010, 11010000, 11111101")),r.a.createElement("strong",null,"Step 4:"),r.a.createElement("p",null,"The new byte data (with the message injected) is cast to the ",r.a.createElement("em",null,"red, green, blue and alpha")," channels' integer values. The resulting objects can then be drawn onto the canvas as pixels of the new, steganographic image."),r.a.createElement("pre",null,r.a.createElement("code",null,"[125, 50, 208, 253]")),r.a.createElement("strong",null,"Note:"),r.a.createElement("p",null,"Comparing a pixel from the original image with the same pixel injected with one character of the secret message, we can see that the rgb color and alpha values have not changed drastically. This change is mostly undetectable by the human eye."),r.a.createElement("pre",null,r.a.createElement("code",null,"original: ",r.a.createElement("div",{className:"pixel",id:"p1"}),"[125, 48, 210, 255]",r.a.createElement("br",null),"new: ",r.a.createElement("div",{className:"pixel",id:"p2"}),"[125, 50, 208, 253]")))))))}j.contextType=w;a(39);function O(e){var t=Object(n.useState)(e.basePath),a=Object(i.a)(t,2),s=a[0],o=a[1],c=e.links.map((function(t,a){return r.a.createElement(l.b,{key:a,to:e.basePath+t.path,id:t.name||"",className:s===t.path?"active":"",onClick:function(){return o(t.path)}},t.name)}));return r.a.createElement("header",{className:"App-header grey darken-4"},r.a.createElement("h5",{className:"App-title pink-text text-darken-1"},r.a.createElement("small",null,r.a.createElement("strong",null,r.a.createElement("a",{href:"https://komlosidev.net/"},"thavixt")," /")),r.a.createElement("a",{href:e.basePath},"steganography.js")),r.a.createElement("span",{className:"App-links pink-text text-darken-1"},c))}a(44);function I(){var e=Object(n.useContext)(w);return r.a.createElement("footer",{className:"App-footer grey darken-4 page-footer"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col l6 s12"},r.a.createElement("h5",{className:"pink-text text-darken-1"},"Steganography.js"),r.a.createElement("p",{className:"pink-text text-darken-1"},e("footer:inspired_by")," - ",r.a.createElement("em",null,r.a.createElement("a",{href:"https://www.youtube.com/watch?v=TWEXCYQKyDc",target:"_blank",rel:"noopener noreferrer"},"Secrets Hidden in Images")))))),r.a.createElement("div",{className:"footer-copyright"},r.a.createElement("div",{className:"container pink-text text-darken-1"},r.a.createElement("a",{className:"pink-text text-darken-1 right",href:"https://github.com/thavixt/steganography-js",target:"_blank",rel:"noopener noreferrer"},"github"))))}var T=a(25),L=[{name:"stego",path:""},{name:"compare",path:"compare"},{name:"info",path:"info"}];function P(e){var t=Object(n.useState)(null),a=Object(i.a)(t,2),s=a[0],o=a[1];return Object(n.useEffect)((function(){c.a.init({lng:"en",resources:T}).then((function(e){o((function(){return e}))}))}),[]),s?r.a.createElement(w.Provider,{value:s},r.a.createElement(l.a,null,r.a.createElement("div",{className:"App"},r.a.createElement(O,{links:L,basePath:e.basePath}),r.a.createElement("main",{className:"App-main"},r.a.createElement(d.a,{exact:!0,path:e.basePath+"",render:function(){return r.a.createElement(N,null)}}),r.a.createElement(d.a,{path:e.basePath+"compare",render:function(){return r.a.createElement(j,null)}}),r.a.createElement(d.a,{path:e.basePath+"info",render:function(){return r.a.createElement(F,null)}})),r.a.createElement(I,null)))):r.a.createElement("p",null,"loading...")}window.Worker&&window.Promise&&window.fetch&&window.File&&window.FileReader&&window.FileList&&window.Blob&&window.TextDecoder&&window.TextEncoder||(alert("Your browser is not up-to-date. The application MAY NOT WORK. \rTry using the latest version of Chrome, Edge or Firefox."),console.error("The required APIs are not fully supported in this browser.\nTry using the latest version of Chrome, Edge or Firefox.\nThe required APIs are:\nBlob, fetch, File, FileReader, FileList, Promise, TextDecoder, Worker")),navigator.deviceMemory&&navigator.deviceMemory<2&&console.warn("Low device memory detected:",navigator.deviceMemory+"GB"),navigator.hardwareConcurrency<2&&console.warn("Low number of CPU threads detected:",navigator.hardwareConcurrency),o.a.render(r.a.createElement(P,{basePath:"/steganography-js/"}),document.getElementById("root"))}},[[27,1,2]]]);
//# sourceMappingURL=main.2874ac1c.chunk.js.map