
window.fbAsyncInit = function() {
    FB.init({
        appId      : '573901506285748',
        cookie     : true,
        xfbml      : true,
        version    : 'v2.11'
    });
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function statusChangeCallback(response) {
    if(response.status === 'connected'){
        console.log('logged in.')
        testAPI();
    }else{
        console.log('not authenticated.')
    }
}
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}
function testAPI() {
    FB.api('/me?fields=name,email',function (response) {
        if(response && !response.error){
            console.log(response);
        }else {
            FB.api('/me/feed',function (response) {
                console.log(response);
            })
        }
    })
}
