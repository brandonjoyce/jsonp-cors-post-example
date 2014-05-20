//declare the Async-call callback function on the global scope
function myAsyncJSONPCallback(data){
    //clean up 
    var e = document.getElementById(id);
    if (e) e.parentNode.removeChild(e);
    clearTimeout(timeout);

    if (data && data.error){
        //handle errors & TIMEOUTS
        //...
        return;
    }
  console.log(data);
}

var serverUrl          = "http://localhost:3001"
  , params = { param1  : "value of param 1"      //I assume this value to be passed
             , param2  : "value of param 2"      //here I just declare it...
             , callback: "myAsyncJSONPCallback" 
             }
  , clientUtilityUrl   = "http://localhost:3000/client-utility.htm"
  , id     = "some-unique-id"// unique Request ID. You can generate it your own way
  , div    = document.createElement("DIV")       //this is where the actual work start!
  , HTML   = [ "<IFRAME name='ifr_",id,"'></IFRAME>"  
             , "<form target='ifr_",id,"' method='POST' action='",serverUrl 
             , "' id='frm_",id,"' enctype='multipart/form-data'>"
             ]
  , each, pval, timeout;

//augment utility func to make the array a "StringBuffer" - see usage bellow
HTML.add = function(){
              for (var i =0; i < arguments.length; i++) 
                  this[this.length] = arguments[i];
           }

//add rurl to the params object - part of infrastructure work
params.rurl = clientUtilityUrl //ABSOLUTE URL to the utility page must be on
                               //the SAME DOMAIN as page that makes the request

//add all params to composed string of FORM and IFRAME inside the FORM tag  
for(each in params){
    pval = params[each].toString().replace(/\"/g,"&quot;");//assure: that " mark will not break
    HTML.add("<input name='",each,"' value='",pval,"'/>"); //        the composed string      
}
//close FORM tag in composed string and put all parts together
HTML.add("</form>");
HTML = HTML.join("");   //Now the composed HTML string ready :)

//prepare the DIV
div.id = id; // this ID is used to clean-up once the response has come, or timeout is detected
div.style.display = "none"; //assure the DIV will not influence UI

//TRICKY: append the DIV to the DOM and *ONLY THEN* inject the HTML in it
//        for some reason it works in all browsers only this way. Injecting the DIV as part 
//        of a composed string did not always work for me
document.body.appendChild(div);
div.innerHTML = HTML;

//TRICKY: note that myAsyncJSONPCallback must see the 'timeout' variable
timeout = setTimeout("myAsyncJSONPCallback({error:'TIMEOUT'})",4000);
document.getElementById("frm_"+id).submit();
