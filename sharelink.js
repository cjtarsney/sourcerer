var updateShareLink = function(){

//  var sourcedURL = updateURL().val()
  var facebookBaseURL = 'https://www.facebook.com/sharer/sharer.php?u='

  return(facebookBaseURL+(($("#url-holder").text()).replace(/&/g,'%26').replace(/:/g,'%3A')))

;

}
