var state = {}

var loggedInDropdown = [
    {label:"Settings"
      , class:"settings"
      , id:"settings"
      , "data-toggle":"modal"
      , "data-target":"#account-settings-modal"},
    {label:"Logout"
      , class:"settings"
      , id:"user-logout"
      , "data-toggle":"modal"
      , "data-target":"#logged-out-modal"}]

var loggedOutDropdown = [
    {label:"Log In"
      , class:"settings"
      , id:"login"
      , "data-toggle":"modal"
      , "data-target":"#login-modal"}]

var mediumDefaults = [
      {value:"ads"
        , text:"Ads"},
      {value:"email"
        , text:"Email"},
      {value:"referral"
        , text:"Referral"},
      {value:"sms"
        , text:"SMS"},
      {value:"social"
        , text:"Social"}]

var sourceDefaults = [
      {value:"bsd"
        , text:"BSD"},
      {value:"mc"
        , text:"Mailchimp"},
      {value:"ngp"
        , text:"NGP"},
      {value:"fb"
        , text:"Facebook"},
      {value:"ig"
        , text:"Instagram"},
      {value:"tw"
        , text:"Twitter"},
      {value:"hustle"
        , text:"Hustle"}]

var campaignDefaults = [
      {value:"fr"
        , text:"Fundraising"},
      {value:"lb"
        , text:"Listbuilding"},
      {value:"msg"
        , text:"Messaging"},
      {value:"enviro"
        , text:"Environment"},
      {value:"edu"
        , text:"Education"},
      {value:"health"
        , text:"Health Care"},
      {value:"voting"
        , text:"Voting Rights"}]

var senderDefaults = [{value:""
        , text: ""}]

var audienceDefaults = [
      {value:"d"
        , text:"Donors"},
      {value:"nd"
        , text:"Non-Donors"},
      {value:"md"
        , text:"Maxed Donors"},
      {value:"vol"
        , text:"Volunteers"},
      {value:"vl"
        , text:"Volunteer Leaders"},
      {value:"attnd"
        , text:"Event Attendees"}]


var content = function(contentParams){
  var order=['date','sender','subject','audience']
  contentParams.date=contentParams.date.replace(/-/g,"")
  var contentCombine = order.map(function(d){
        return contentParams[d]
      }).join("_");
    return contentCombine;
}

var googleanalytics = function(params){

var gaKeys = Object.keys(params).filter(function(d){
    return params[d]!=""&&params[d]!="___"
  }).map(function(d){
    return "utm_"+d+"="+params[d];
  })

return gaKeys.join("&");

}

var bsd = function(params){
  var sourceOrder=['medium','source','campaign','content']
  var createSource = sourceOrder.map(function(d){
        return params[d]
      }).join("_");
    return "source="+createSource;
}

var actblue = function(params){
  var refCodeOrder=['medium','source','campaign','content']
  var createRefCode = refCodeOrder.map(function(d){
        return params[d]
      }).join("_");
    return "refcode="+createRefCode;
}

var digital8 = function(params){
  var msOrder=['medium','source','campaign','content']
  var createMemberSource = msOrder.map(function(d){
        return params[d]
      }).join("_");
    return "ms="+createMemberSource;
}

var paramFunctions = {
  googleanalytics:googleanalytics,
  bsd:bsd,
  actblue:actblue,
  digital8:digital8
}

$(document).ready(function(){

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      login();
    } else {
      console.log("User is logged out");
    }
  });



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
console.log(tools);

var activeToolNames = $("#tool-select>.btn-group>label.active").map(function(idx,elem){
  return $(elem).text();
}).get();

state.tools=activeToolNames;
console.log(state.tools);

if(unsourcedURL.includes("?")){
return ($("#protocol-display>a").text()+(unsourcedURL+"&").replace(/\/\//g, '/')).replace(/http:\/\/https:\//g,"https://").replace(/http:\/\/http:\//g,"http://").replace(/https:\/\/https:\//g,"https://").replace(/https:\/\/http:\//g,"http://") +tools.map(function(d){
  return paramFunctions[d](params)
}).join("&").replace(/ /g,"-");
} else {
  return ($("#protocol-display>a").text()+(unsourcedURL+"/?").replace(/\/\//g, '/')).replace(/http:\/\/https:\//g,"https://").replace(/http:\/\/http:\//g,"http://").replace(/https:\/\/https:\//g,"https://").replace(/https:\/\/http:\//g,"http://") +tools.map(function(d){
    return paramFunctions[d](params)
  }).join("&").replace(/ /g,"-");

}




  }

  var activeToolNames = $("#tool-select>.btn-group>label.active").map(function(idx,elem){
    return $(elem).text();
  }).get();

  state.tools=activeToolNames;
  $("#selected-tools").text("Here's your URL, which includes sourcing for "+state.tools.join(" / ")+":");

  $(".input-group>input").on("change",function(){
    $("#url-holder").text(updateURL());
    $("#url-holder").val(updateURL());
  })

  $("#tool-select>.btn-group>.tool-select").on("click",function(){
    setTimeout(function(){
      $("#url-holder").text(updateURL());
      $("#url-holder").val(updateURL());
      $("#selected-tools").text("Here's your URL, which includes sourcing for "+state.tools.join(" / ")+":");

    },300)
  })

$("#test").on("click",function(){
  window.open($("#url-holder").val(),"_blank");
  ga('send', 'event', 'test', 'click', 'URL Tested');
})

$("#copy").on("click",function(){
  $("#url-holder").select()
  document.execCommand("copy");
  ga('send', 'event', 'copy', 'click', 'URL Copied');
})

$(".dropdown-menu>li").on("click",function(idx,elem){
  var id = $(this).parent().attr("id");
  var value = $(this).attr("value");
  $(".param#"+id).text(value);
  $(".param#"+id).val(value);
  $("#url-holder").text(updateURL());
  $("#url-holder").val(updateURL());
})

$(".protocol-choice>li").on("click",function(idx,elem){
  var protocol = $(this).attr("value");
  console.log(protocol);
  if (protocol=="https://"){

    $("#protocol-display>a").text("https://");
    $(".protocol-choice>li").attr("value","http://");
    $(".protocol-choice>li>a").text("http://");
}
  else {
    $("#protocol-display>a").text("http://");
    $(".protocol-choice>li").attr("value","https://");
    $(".protocol-choice>li>a").text("https://");

}
  var protocol = $(".protocol-choice>li").attr("value");
  console.log(protocol);
  $("#url-holder").text(updateURL());
  $("#url-holder").val(updateURL());
;
})

var mediumSetup = function(options){
  options.map(function(d){
    $("#medium-input-row").first().clone().appendTo("#custom-medium-input")
        .find("#medium-label-input, #medium-tag-input").each(function(input){
          var key = $(this).attr("data-key")
          $(this).val(d[key])
          $(this).text(d[key])
        })
  });

  $("#medium-input-row").first().remove();

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $(".medium-remove-line-button").first().remove();
}

var sourceSetup = function(options){
  options.map(function(d){
    $("#source-input-row").first().clone().appendTo("#custom-source-input")
        .find("#source-label-input, #source-tag-input").each(function(input){
          var key = $(this).attr("data-key")
          $(this).val(d[key])
          $(this).text(d[key])
        })
  });

  $("#source-input-row").first().remove();

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $(".source-remove-line-button").first().remove();
}

var campaignSetup = function(options){
  options.map(function(d){
    $("#campaign-input-row").first().clone().appendTo("#custom-campaign-input")
        .find("#campaign-label-input, #campaign-tag-input").each(function(input){
          var key = $(this).attr("data-key")
          $(this).val(d[key])
          $(this).text(d[key])
        })
  });

  $("#campaign-input-row").first().remove();

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $(".campaign-remove-line-button").first().remove();
}

var senderSetup = function(options){
  options.map(function(d){
    $("#sender-input-row").first().clone().appendTo("#custom-sender-input")
        .find("#sender-label-input, #sender-tag-input").each(function(input){
          var key = $(this).attr("data-key")
          $(this).val(d[key])
          $(this).text(d[key])
        })
  });

  $("#sender-input-row").first().remove();

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $(".sender-remove-line-button").first().remove();
}

var audienceSetup = function(options){
  options.map(function(d){
    $("#audience-input-row").first().clone().appendTo("#custom-audience-input")
        .find("#audience-label-input, #audience-tag-input").each(function(input){
          var key = $(this).attr("data-key")
          $(this).val(d[key])
          $(this).text(d[key])
        })
  });

  $("#audience-input-row").first().remove();

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })

  $(".audience-remove-line-button").first().remove();
}



$("#signup-link>a").on("click", function(){
  $("#login-modal").modal("hide");
})

$("#login-link>a").on("click", function(){
  $("#signup-modal").modal("hide");
})

$("#create-new-project").on("click",function(){
  $("#account-settings-modal").modal("hide");
  mediumSetup(mediumDefaults);
  sourceSetup(sourceDefaults);
  campaignSetup(campaignDefaults);
  senderSetup(senderDefaults);
  audienceSetup(audienceDefaults);
})

$("#new-password-confirm").on("input",function(d){
  console.log("password entered")
  if($("#new-password-confirm").val()===$("#new-password").val()){
          $("#passwords-match").attr("class", "validate fa fa-check");
          $("#passwords-mismatch").attr("class", "hidden validate fa fa-times");
          $("#create-account").attr("disabled",null);
        }else{
          $("#passwords-match").attr("class", "hidden validate fa fa-check");
          $("#passwords-mismatch").attr("class", "validate fa fa-times");
          $("#create-account").attr("disabled","true");
        }

})

var login = function(){
  $("#login-modal").modal('hide');
  $("#signup-modal").modal('hide');
  $("#hamburger-menu>li").remove();
  loggedInDropdown.map(function(d){
    $("<li><a></a></li>")
                      .find("a")
                      .attr("class",d.class)
                      .attr("id",d.id)
                      .attr("value",d.label)
                      .attr("data-toggle",d["data-toggle"])
                      .attr("data-target",d["data-target"])
                      .text(d.label)
                      .end()
                      .appendTo($("#hamburger-menu"))
  });
  $("#user-logout").on("click",function(){
    console.log("step one");
    firebase.auth().signOut().then(function() {
      console.log("step two");
    logout()
    }).catch(function(error) {
    // An error happened.
  });

  })
}

var logout = function(){
  $("#hamburger-menu>li").remove();
  loggedOutDropdown.map(function(d){
    $("<li><a></a></li>")
                      .find("a")
                      .attr("class",d.class)
                      .attr("id",d.id)
                      .attr("value",d.label)
                      .attr("data-toggle",d["data-toggle"])
                      .attr("data-target",d["data-target"])
                      .text(d.label)
                      .end()
                      .appendTo($("#hamburger-menu"))
  })
}



$("#create-account").on("click",function(){
  console.log("test");
  var email = $("#new-username").val()
  var password = $("#new-password").val()
  console.log(email);
  firebase.auth().createUserWithEmailAndPassword(email, password).then(
    function(user){
      firebase.database().ref('users/' + user.uid).set({
        email: email
      }).then(function(){
        login()
      })
    }
  ).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});

})

$("#user-login").on("click",function(){
  var email = $("#username").val()
  var password = $("#password").val()
  firebase.auth().signInWithEmailAndPassword(email, password).then(
    function(user){
      firebase.database().ref('users/' + user.uid).set({
        email: email
      }).then(function(){
        login()
      })
    }
  ).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });
})

$(".remove-line-button").on("click",function(){
  $(this).parent().parent().parent().remove();
})

$(".add-medium-button").on("click",function(){
  $("#medium-input-row").first().clone().appendTo("#custom-medium-input").find("input").val("");

    $(".remove-line-button").on("click",function(){
      $(this).parent().parent().parent().remove();
})
})

$(".add-source-button").on("click",function(){
$("#source-input-row").first().clone().appendTo("#custom-source-input").find("input").val("");

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
})
})

$(".add-campaign-button").on("click",function(){
$("#campaign-input-row").first().clone().appendTo("#custom-campaign-input").find("input").val("");

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
})
})


$(".add-sender-button").on("click",function(){
$("#sender-input-row").first().clone().appendTo("#custom-sender-input").find("input").val("");

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
})
})

$(".add-audience-button").on("click",function(){
$("#audience-input-row").first().clone().appendTo("#custom-audience-input").find("input").val("");

  $(".remove-line-button").on("click",function(){
    $(this).parent().parent().parent().remove();
  })
})

$("nav-tabs>li>a").on("click",function(){
  console.log("nav tab clicked")
  $(this).parent().attr("class","active")
})

})
