var state = {}

var content = function(contentParams){
  var order=['date','sender','subject','audience']
  contentParams.date=contentParams.date.replace(/-/g,"")
  var contentCombine = order.map(function(d){
        return contentParams[d]
      }).join("_");
    return contentCombine;
}

var gaParams = function(params){

var keys = Object.keys(params).filter(function(d){
    return params[d]!=""&&params[d]!="___"
  }).map(function(d){
    return "utm_"+d+"="+params[d];
  })

return keys.join("&")

}

var bsdParams
var abParams

$(document).ready(function(){

  var updateURL = function(){

    var params={};
    var contentParams={};

    var tools = $("#tool-select>.btn-group>label.active>input").map(function(idx,elem){
      return $(elem).val();
    }).get();

    var unsourcedURL = $("#basic-url").val();

    $(".input-group>.param:not(.content-form)").map(function(idx,elem){
      var id = $(elem).attr("id");
      var value = $(elem).val();
      params[id]=value
    }).get();

    $(".input-group>.content-form").map(function(idx,elem){
      var id = $(elem).attr("id");
      var value = $(elem).val();
      contentParams[id]=value

    }).get();

params.content=content(contentParams);
console.log(params);
console.log(gaParams(params));

$("#url-holder").text("https://"+unsourcedURL+"/?"+gaParams(params))


    state.tools=tools;
    state.params=params;

  }


  $("#test").on("click",function(){
    updateURL();
  })

})
