var appne = angular.module('starter.controllers', [])

appne.controller('AppCtrl', function($scope, $state,$ionicModal, $timeout,LoginService) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  //localStorage.removeItem('USER_KEY');
  if(localStorage.getItem('USER_KEY')!== null){

    $state.go("app.home");
  }


  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  /*$scope.closeLogin = function() {
    $scope.modal.hide();
  };*/

  // Open the login modal
  
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {

    /*var check = {"check1":"hi"}
    localStorage.setItem("checking",JSON.stringify(check));*/
    //console.log('Doing login', $scope.loginData);
    LoginService.GetUserDetails($scope.loginData).then(function(vals){

      console.log('Doing login', vals);

      var uservar = {"userKey":vals["data"]['model']['token'],"userID":vals["data"]['model']['id']};
       localStorage.setItem('USER_KEY',JSON.stringify(uservar));
        $state.go("app.home");
      /*var laboo = localStorage.getItem('checking');
      var taboo = JSON.parse(laboo);
      alert(taboo.check1);*/
      //$scope.userDetails = vals;
      //console.log('Doing login', vals["data"]['model']['token']);

      });

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      //$scope.closeLogin();
    }, 1000);
  };
})

appne.controller('BrowseDetailsCtrl', function($scope,$location,BrowseService) {
  
  console.log("BrowseDetailsCtrl");


var obsId = $location.path().split("/")[3];

//console.log(typeof(newUrl.split("/")[3]));
//console.log(obsId);

$scope.obsDetails=BrowseService.getObsList()

//console.log($scope.obsDetails);
browsingArray($scope,$scope.obsDetails,obsId)

  
    //console.log(imgDetails);
})

function browsingArray($scope,obsDetails,obsId){

  var updated ,submited, observed, commonname, sciName, id, notes, author ;


  $scope.insertDetails = [];
  var imgDetails=[];
  //console.log(obsDetails);
  for(i=0;i<obsDetails.length;i++){
    if(obsDetails[i].maxVotedReco.hasOwnProperty('commonNamesRecoList')){
            commonname = obsDetails[i].maxVotedReco.commonNamesRecoList[0].name;
        }else {
          commonname="";
        }

        if(obsDetails[i].maxVotedReco.hasOwnProperty('sciNameReco')){
                sciName = obsDetails[i].maxVotedReco.sciNameReco.name;

          }
      
    else{
      sciName="Unknown";
      commonname="";
      }
      id=obsDetails[i].id;
      
      imgDetails[id] ={};
      for(var j=0;j<obsDetails[i].resource.length;j++){
        //console.log(obsDetails[i].resource[j]);
        
        imgDetails[id][j]=obsDetails[i].resource[j];

      }
      
      //console.log(imgDetails);
      var updated1 = new Date(obsDetails[i].lastRevised.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      var updated2 = updated1.toString();
       updated = updated2.slice(4,15);
       //console.log(updated);
      var submited1 = new Date(obsDetails[i].createdOn.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      var submited2 = updated1.toString();
       submited = updated2.slice(4,15);
      var observed1 = new Date(obsDetails[i].fromDate.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );
      var observed2 = updated1.toString();
       observed = updated2.slice(4,15);
      notes =  obsDetails[i].notes;
      author = obsDetails[i].author.name;
      place = obsDetails[i].reverseGeocodedName;
          $scope.insertDetails.push({"id":id,"scientificName":sciName,"CommonName":commonname,"observed":observed,"updated":updated,"submitted":submited,"author":author,"place":place, "imgDetails":imgDetails, "notes":notes});

    }



    for(var y=0;y<$scope.insertDetails.length;y++){

      if($scope.insertDetails[y].id==obsId){
        $scope.singleObsDetails = [];
        $scope.singleImgDetails = [];
        
        $scope.singleObsDetails.push({"id":$scope.insertDetails[y].id,"scientificName":$scope.insertDetails[y].scientificName,"CommonName":$scope.insertDetails[y].CommonName,"observed":$scope.insertDetails[y].observed,"updated":$scope.insertDetails[y].updated,"submitted":$scope.insertDetails[y].submitted,"author":$scope.insertDetails[y].author,"place":$scope.insertDetails[y].place, "imgDetails":$scope.insertDetails[y].imgDetails[$scope.insertDetails[y].id], "notes":$scope.insertDetails[y].notes});
        console.log($scope.singleObsDetails);
        if($scope.singleObsDetails[0]["notes"].length>0){
          $scope.visible=false;
        }else{
          $scope.visible=true;
        }
        $scope.singleImgDetails.push({"image":$scope.insertDetails[y].imgDetails[$scope.insertDetails[y].id]});
        break;
      }
    }
   
}



appne.controller('NewObservationCtrl', function($scope,$state,$http,LocationService) {
    $(function () {
      $('#check').change(function () {
        console.log(this.checked);
          $(".check1").toggle(this.checked);
      });
  });

    $scope.userGroup = function(){
      alert("user");
    }

    ionic.Platform.ready(function() {

   LocationService.GetLocation().then(function(data){
    console.log(data.latitude,data.longitude);
      var code="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitude+","+data.longitude;
      
      $http.get(code).success(function(dataval){
            //console.log(dataval.results[0]);
            $("#Locationval").text(dataval.results[0]["formatted_address"])
          });
    });
 });




    $scope.gpsButton = function(){
        
          $state.go("app.gps");
    }


});



appne.controller('GPSController', function($scope,$location) {

//alert($location.path());
 var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.mapval = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
          console.log($scope.mapval);
          

            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;




});



appne.controller('HomeController',[ '$scope', '$http', 'BrowseService', function($scope,$http,BrowseService){
  
  $scope.zip="hi";
  
BrowseService.GetBrowseInfo().then(function(speciesGroup){

  console.log(speciesGroup);

} );

  
 
}]);



appne.controller('ListController',[ '$scope', '$http', 'BrowseService', function($scope,$http,BrowseService){
  console.log("hi");
  $scope.details = [];
  $scope.innerDetails = [];
  /*$http.get('js/data3.json').success(function(data){

    //$scope.artists = data;
    
    $scope.innerDetails = data.observationInstanceList;
    console.log(data.observationInstanceList);
    arrayData($scope,data.observationInstanceList,1);
    
  });*/
/*BrowseService.GetBrowseInfo().then(function(speciesGroup){

  console.log(speciesGroup);
} );*/

console.log(BrowseService.getGroupVal());

$scope.listParams = {
  offset:0,
  type:"nearBy",
  maxRadius:50000
}

BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

  console.log("hel");
  arrayData($scope,obsList["data"]["model"]["observationInstanceList"],1,BrowseService);
} );

  $scope.loadMore = function() {
    $scope.noMoreItemsAvailable = false;

    $scope.listParams.offset = $scope.listParams.offset + 24;
    


    BrowseService.GetBrowseList($scope.listParams).then(function(obsList){

      console.log(obsList);
      arrayData($scope,obsList["data"]["model"]["observationInstanceList"],2,BrowseService);
    } );

    $scope.$broadcast('scroll.infiniteScrollComplete');
    /*$http.get('js/data.json').success(function(data) {
      //console.log(data.observationInstanceList);
      arrayData($scope,data.observationInstanceList,2);
      
      //$scope.$digest();
//$timeout(function() {
  $scope.$broadcast('scroll.infiniteScrollComplete');
//});
    });*/
  };


 
}]);


appne.controller('JoinGroupCtrl',[ '$scope', '$http','$compile','UserGroupService', function($scope,$http,$compile,UserGroupService){
  console.log("jgroup");


  /*$http.get('js/userGroup.json').success(function(data){
    //$scope.artists = data;
    //console.log($scope.artists.observationInstanceList );
    userGroupData($scope,data.userGroupInstanceList);
    
  });*/
UserGroupService.GetUserGroups().then(function(groups){

  console.log(groups['data']['model']);
  userGroupData($scope,groups['data']['model'].userGroupInstanceList);
});
   /*$http.get('js/joinedGroup.json').success(function(data){
    //$scope.artists = data;
    console.log(data.observations );
    checkGroup($scope,data.observations);
    
  });*/

  UserGroupService.GetJoinedGroups().then(function(userGroups){

  console.log(userGroups);
  checkGroup($scope,userGroups['data']['model'].observations,$compile);
  //userGroupData($scope,groups['data']['model'].userGroupInstanceList);
});
}]);


function arrayData($scope,observationInstanceList,num,BrowseService){

BrowseService.setObsList(observationInstanceList);
  console.log("hi");
  //var arr = [];
  var sciName;
  var iconUrl;
  var commonname;
  var id;
  $scope.arr=[];

  for(i=0;i<observationInstanceList.length;i++){

    if(Object.keys(observationInstanceList[i].maxVotedReco).length >0){

      if(observationInstanceList[i].maxVotedReco.hasOwnProperty('commonNamesRecoList')){
            commonname = observationInstanceList[i].maxVotedReco.commonNamesRecoList[0]["name"];
        }else {
          commonname="";
        }

        if(observationInstanceList[i].maxVotedReco.hasOwnProperty('sciNameReco')){
                sciName = observationInstanceList[i].maxVotedReco.sciNameReco.name;

          } 
      
    }else{
      sciName="Unknown";
      commonname="";
    }
    iconUrl=observationInstanceList[i].thumbnail;
    id=observationInstanceList[i].id;
    //alert(sciName);
    if(num==1){
    $scope.details.push({"id":id,"iconUrl":iconUrl,"scientificName":sciName,"CommonName":commonname});
    //$scope.details = arr;
    }else{
      $scope.arr.push({"id":id,"iconUrl":iconUrl,"scientificName":sciName,"CommonName":commonname});
      
    //$scope.noMoreItemsAvailable = true;
    
    
    
    }
  }
  
$scope.details = $scope.details.concat($scope.arr);
//BrowseService.setObsList($scope.details);
 
console.log($scope.details);

}

function userGroupData($scope,userGroupInstanceList){

  var usrGrp = [];

  for(i=0;i<userGroupInstanceList.length;i++){

    usrGrp.push({"id":userGroupInstanceList[i].id,"name":userGroupInstanceList[i].name});

  }
  $scope.usrGrpDetails = usrGrp;
  console.log(usrGrp);
}

function checkGroup($scope,joinedgroup,$compile){

  var joinGrpid;

  for(i=0;i<joinedgroup.length;i++){

    joinGrpid = joinedgroup[i].id;
    console.log(joinGrpid);
    $(".button"+joinGrpid).hide();
    $(".joinedicon"+joinGrpid).addClass($compile("icon ion-checkmark-round"));
     
  }
 
  
}































