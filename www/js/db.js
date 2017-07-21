var DB = {};
DB.timer_running;

LDPA.core();
console.log(DB);
/*
*   Check new data is available
*   Check the username and password is correct
*   @param old_data , new_data
*
*   @Since 0.7.22
*/
function check_new_data(old_data, new_data){

  var count = Object.keys(old_data).length - 1;
  var jsold = [];
  for (var o = 0; o < count; o++ ){
    jsold.push(old_data[o].JobscheduleID);
  }


  var count0 = Object.keys(new_data).length -1;
  var jsnew = [];
  for (var n = 0; n < count0; n++ ){
    jsnew.push(new_data[n].JobscheduleID);

  }

  if (checkArrays(jsold,jsnew) == false) {
    return true;
  }else{
    return false;
  }

}



/*
*   Get All JobActivity And Store into localstorage
*   @param jsdo ( jobschdeduleid )
*
*   @Since 0.7.15
*/
function get_all_jobactivity(jsdo){

  var jsdo = jsdo;

  $.ajax({
    url: LDPA.RootServer+"/api/ldpa/do_schedule/",

    data: {
      jobscheduleid: jsdo,
    },

    type: "POST",

    dataType: "json",
  })

  .done(function (json) {
    jsondata = json;

    localStorage.setItem('jsdo_'+jsdo,JSON.stringify(jsondata));

  })

  .fail(function (xhr, status, errorThrown) {

    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
  });

}









/*
*   Get All jobschedule Data from Server and Store into localStorage
*   Also check the new data is available or not if yes show message to user
*   @param id
*
*   @Since 0.10.33
*/
DB.get_job_schedule_from_server = function(){

  $.ajax({
    url: LDPA.RootServer+"/api/ldpa/schedule/",
    data: {
      userid: localStorage.getItem('id'),
    },
    type: "POST",
    dataType: "json",
  })
  .done(function (json) {

    // Store all data into localStorage.jobschedule_local
    jsondata = json;
    // jobschedule is in local database or not
    if (localStorage.getItem('jobschedule_local') === null) {
      localStorage.setItem('jobschedule_local',JSON.stringify(json));
      window.location.replace('job-schedule.html');
    }

    jobschedule_local = JSON.parse(localStorage.getItem('jobschedule_local'));

    console.log(jobschedule_local);

    // Check new data is available or not
    var check_new = check_new_data(jobschedule_local , json);

    // if Data new is available show message to user
    if ( check_new ) {
      $('message').show('slow');
      console.log('New Data is Available!');
      localStorage.setItem('jobschedule_new',JSON.stringify(jsondata));
    }

  })
  .fail(function (xhr, status, errorThrown) {
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
  });

}

DB.list_schedule = function(){


  var jobschedule_local = JSON.parse(localStorage.getItem('jobschedule_local'));
  // count how many item in jobschedule_local
  var count = Object.keys(jobschedule_local).length - 1;


  //  Make an array for sort by JobscheduleID
  var ar = []
  for(var j = 0; j < count; j++) {
    ar.push(jobschedule_local[j]);
    console.log(jobschedule_local[j].OrderDateTime);
    console.log(new Date(jobschedule_local[j].OrderDateTime).getTime());

  }
  // var bb = [];
  // for(var b = 0; b < count; b++ ){
  //   ar[b].OrderDateTime = new Date(ar[b].OrderDateTime).getTime();
  // }

  ar.sort(function(a,b){
    // return new Date(a.start).getTime() - new Date(b.start).getTime()
    return a.OrderDateTime - b.OrderDateTime; 
  });

  // for(var b = 0; b < count; b++ ){
  //   ar[b].OrderDateTime = new Date(ar[b].OrderDateTime);
  // }

  console.log(ar);

  jobschedule_local = ar;

  // jobtype_color variable
  var jobtype_color;

  // Show item in list
  for (var i = 0; i < count; i++) {

    // Begin jobtype_color
    if(jobschedule_local[i].jobtypename == 'COM') {
      jobtype_color = 'jobtype-COM';
    }else if (jobschedule_local[i].jobtypename == 'AAA') {
      jobtype_color = 'jobtype-AAA';
    }
    else if (jobschedule_local[i].jobtypename == 'AAT') {
      jobtype_color = 'jobtype-AAT';
    }
    else if (jobschedule_local[i].jobtypename == 'AAD') {
      jobtype_color = 'jobtype-AAD';
    }
    else if (jobschedule_local[i].jobtypename == 'SER') {
      jobtype_color = 'jobtype-SER';
    }
    else {
      jobtype_color = '';
    }


    $('.job-schedule-list-show-here').after(
      '<li class="'+jobtype_color+'" onClick=DB.gotodo('+jobschedule_local[i].JobscheduleID+') item='+[i].JobscheduleID+'>' +
      '<div class="id-schedule"><i class="fa fa-key"></i> JS_ID: ' +
      jobschedule_local[i].JobscheduleID +'</div>'+
      '<div class="id-joborder"><i class="fa fa-key"></i> JO_ID: '+jobschedule_local[i].JoborderID+'</div>'+
      '<div class="vesselname-schedule"><i class="fa fa-ship"></i> '+jobschedule_local[i].VesselName +'</div>'+
      '<div class="type-schedule"><i class="fa fa-check"></i> JobType:  '+jobschedule_local[i].jobtypename + '</div>'+
      '<div class="OrderDateTime-schedule"><i class="fa fa-calendar"></i> ' + jobschedule_local[i].OrderDateTime + '</div>'+
      '</li></a>');
    }

  }

  DB.get_schedule_task = function(){
    var new_data = JSON.parse(localStorage.getItem('jobschedule_local'));
    // count how many item in jobschedule_local
    var count = Object.keys(new_data).length - 1;

    /* get_all_jobactivity */
    for(var i =0; i < count; i++){
      get_all_jobactivity(new_data[i].JobscheduleID);
    }
  }


  // Set a item in localstorage for when click on item goto page job
  DB.gotodo = function(x) {
    localStorage.setItem('doschedule' ,x);
    window.location.assign('job-schedule-do.html');
  }


  /**
  *   Show list Dp_list for job-schedule-do page
  *
  *
  *   @since 0.10.33
  **/
  DB.show_do_list = function(){

    // Get id from which jobschedule is Running
    js_doing = localStorage.getItem('doschedule');
    jsdo_doing = JSON.parse(localStorage.getItem('jsdo_'+js_doing));

    // console.log(jsdo_doing);
    var count = Object.keys(jsdo_doing).length - 1 ;


    // Variable for fill in rows
    var done_status_check;
    var job_done_class;

    // Found VesselName From list schedule in localStorage and show in VesselName part
    var job_schedule_local = JSON.parse(localStorage.getItem('jobschedule_local'));
    var count_all_schedule = Object.keys(job_schedule_local).length - 1 ;
    for(var a = 0; a < count_all_schedule; a++){
      if(job_schedule_local[a].JobscheduleID == js_doing){
        $('.VesselName').html(job_schedule_local[a].VesselName);
        $('.JobscheduleID').html(job_schedule_local[a].JobscheduleID);
        $('.JobOrderID').html(job_schedule_local[a].JoborderID);
        $('.JobType').html(job_schedule_local[a].jobtypename);

        break;
      }
    }


    var jobactivityid_list = [];

    // Loop for show list
    for (var i = count -1; i >= 0; i--) {

      jobactivityid_list.push(jsdo_doing[i].JobactivityID);
      // Check the Job is done or ney for show datetime
      if(jsdo_doing[i].EndDateTime == null){
        done_status_check =  '<div class="done_status" id="jobActivityID_'+jsdo_doing[i].JobactivityID+'"> <button class="btnbegin" id onClick="DB.btndone('+jsdo_doing[i].JobactivityID+')"id="this_act_'+jsdo_doing[i].JobactivityID+'"><i class="fa fa-check-square-o" aria-hidden="true"></i> Done </button> </div>';
        job_done_class = '';
      }else {
        done_status_check =  '<div class="done_status" id="jobActivityID_'+jsdo_doing[i].JobactivityID+'">'+jsdo_doing[i].EndDateTime+' </div>';
        job_done_class = 'job_done';
      }

      $('.todo_list').after(
        '<div class="'+job_done_class+' item_todo ActivityID_'+jsdo_doing[i].ActivityID+'" id="task_'+jsdo_doing[i].JobactivityID+'"  Timelimitstoppedbysteps="'+jsdo_doing[i].Timelimitstoppedbysteps+'" TimeLimit="'+jsdo_doing[i].TimeLimit+'" ActivityID="'+jsdo_doing[i].ActivityID+'" HasAdditionalInput="'+jsdo_doing[i].HasAdditionalInput+'">' +
        '<span>'+
        '<div class="id-schedule"><div><i class="fa fa-key" aria-hidden="true"></i>' +jsdo_doing[i].JobactivityID +' - <button class="edit-btn edit-btn-'+jsdo_doing[i].JobactivityID+'" onClick="DB.btnedit('+jsdo_doing[i].JobactivityID+')">edit</button></div><div><strong>'+
        jsdo_doing[i].ActivityName +'</strong></div></div>'+
        '</span><span>'+
        '<div class="hasadditional"></div>'+
        done_status_check +
        '</span>'+
        '<div class="additional" id="additional_'+jsdo_doing[i].JobactivityID+'">'+jsdo_doing[i].Value+'</div></div>'
      );

      $('#additional_'+jsdo_doing[i].JobactivityID+'').html(jsdo_doing[i].Value);


      // Check the Job is done or ney for show edit-btn
      if(jsdo_doing[i].EndDateTime == null){
        $('.edit-btn-'+jsdo_doing[i].JobactivityID+'').hide();
      }else {
        $('.edit-btn-'+jsdo_doing[i].JobactivityID+'').show();
      }




    } // End Loop

    // console.log(jobactivityid_list);
    countjl =  jobactivityid_list.length;

    // Overwrite do job for which one job_done
    var get_job_done = JSON.parse(localStorage.getItem('jsdo_done'));
    var count_job_done = get_job_done.items.length - 1 ;

    for (var o = count_job_done; o > 0; o--) {
      // console.log(get_job_done.items[o].jobActivity);
      for (var c = 0; c < countjl; c++) {
        if(jobactivityid_list[c] == get_job_done.items[o].jobActivity){
          // console.log('yeah its equal '+ jobactivityid_list[c]);
          // here we are , Overwrite task item
          $('#task_'+get_job_done.items[o].jobActivity+'').addClass('job_done');
          $('.edit-btn-'+get_job_done.items[o].jobActivity+'').show();
          $('#jobActivityID_'+get_job_done.items[o].jobActivity+'').html(get_job_done.items[o].datetime);
          $('#additional_'+get_job_done.items[o].jobActivity+'').html(get_job_done.items[o].HasAdditionalInput);
        }
      }
    }
    // console.log(get_job_done);
    // console.log(count_job_done);

  }




  /*
  *   btndone is a button for begin a job when user clicked on it,
  *   System begin a timer for limited select next job
  *
  *   @param x(JobactivityID)
  *
  *   @since 0.8.72
  */
  DB.btndone = function(x){


    // Ask question
    var update = confirm("Do you want to Submit ?");
    // var update = true;
    if (update == true) {

      $('.edit-btn-'+x+'').show();
      // Reset the time
      // msLeft = 0;

      // Get variable x(JobactivityID)
      var x = x;


      // Remove all next job cover color
      // Get id from which jobschedule is Running
      js_doing = localStorage.getItem('doschedule');
      jsdo_doing = JSON.parse(localStorage.getItem('jsdo_'+js_doing));

      var count = Object.keys(jsdo_doing).length - 1 ;

      // Remove all next_job Class
      for(j = 0; j < count; j++){
        $('.next_job').removeClass('next_job');
      }

      $('.item_todo').removeClass('this_job');
      $('#task_'+x).addClass('this_job');


      // var this_task = JSON.parse(localStorage.getItem('jobscheduledooffline'));

      $('#task_'+x).attr('job_done','true');
      $('#task_'+x).addClass('job_done');

      var HasAdditionalInput = $('#task_'+x).attr('HasAdditionalInput');


      if(HasAdditionalInput == 1 ){

        var AdditionalInput_text = prompt("Please enter AdditionalInput", " ");
        if (AdditionalInput_text != null) {
          $('#additional_'+x).html(AdditionalInput_text);
        }
        if(AdditionalInput_text == null ){AdditionalInput_text = '';}
      }

      var next_job = '';
      var  this_ActivityID = $('.this_job').attr('ActivityID');
      next_job = $('.this_job').attr('timelimitstoppedbysteps');


      next_job_split = next_job.split(',');
      for ( var i = 0; next_job_split.length > i; i++ ){
        s = next_job_split[i].trim();
        next_job_split[i] = s;
      }



      for( var o = 0; next_job_split.length > o; o++ ){
        $('.ActivityID_'+next_job_split[o]+'').addClass('next_job');
      }

      var Timelimit = $('#task_'+x).attr('TimeLimit');


      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var hour = today.getHours();
      var minute = today.getMinutes();
      var second = today.getSeconds();

      var yyyy = today.getFullYear();
      if(dd < 10 ){dd = '0'+dd;}
      if(mm < 10 ){ mm='0'+mm;}
      if(hour < 10){hour = '0'+hour;}
      if(minute < 10){minute = '0'+minute;}
      if(second < 10){second = '0'+second;}


      var todaynow = yyyy+'-'+mm+'-'+dd+' '+hour+':'+minute+':'+second;

      var jobActivitynumber = 'jobActivityID_'+x;


      // Added Data to localStorage
      var DATA;
      DATA = JSON.parse(localStorage.getItem('jsdo_done'));

      var count = DATA.items.length

      for(var i = 0; i < count; i++){
        var there_is = '';
        var current_item = DATA.items[i].jobActivity;
        if(current_item == x){
          there_is = i;
          break;
        }
      }

      if(there_is != ''){
        DATA.items[there_is].datetime = todaynow;
      } else {
        DATA.items.push({jobActivity:x,datetime:todaynow,HasAdditionalInput:AdditionalInput_text});
      }

      localStorage.setItem('jsdo_done',JSON.stringify(DATA));

      $('#'+jobActivitynumber+'').html(localStorage.getItem(jobActivitynumber));

      // set which activity is running
      localStorage.setItem('schedule_running',x);

      $('#'+jobActivitynumber+'').html(todaynow);
      // clearInterval(DB.timer_running);
      // DB.timer_down(Timelimit,x);
      DB.countdown(Timelimit,x);


      DB.notification();
      // Added a notify
      var getTime = DB.getTimewithFormat();
      getdata = JSON.parse(localStorage.getItem('notification'));
      var get_position = localStorage.getItem('location');

      getdata.items.push(
        {
          event: x,
          time:getTime,
          type:'done',
          jobActivity: x,
          position: get_position,
        }
      );
      localStorage.setItem('notification',JSON.stringify(getdata));



      // sync with server if server is available
      DB.check_sync_with_server();
      // refresh page
      // location.reload();
    } else { return; } // end question
  }




  DB.countdown = function(timelimit,schedule_running){

    // set Time limit
    var end_time = (Date.now() + (timelimit * 60 * 1000));
    localStorage.setItem('end_time',end_time);
    localStorage.setItem('countdown_ON','ON');

  }

  /**
  *   Count down Timer ( New Generation )
  *   we need a countdown for when time is period
  *   inserted to timer_out and send to server manager
  *
  *   @since 1.5.77
  *
  */
  DB.countdown_timer = function(){

    // Check elapsed time if done close interval
    if(localStorage.getItem('end_time') <= Date.now() && localStorage.getItem('countdown_ON') == 'OFF' ){
      localStorage.setItem('countdown_ON','OFF');
      clearInterval(timeinterval_countdown);
    }else {
      var timeinterval_countdown = setInterval(function(){
        var start_time = Date.now();
        var elapsed = localStorage.getItem('end_time') - start_time;
        localStorage.setItem('countdown_ON','ON');

        // Check elapsed time if done close interval
        if(localStorage.getItem('end_time') === null){
          console.log('yeah its not here');
        }else{
          console.log('yeah its here');
          if(localStorage.getItem('end_time') <= Date.now() ){

            // Set A Notification for time is OVER
            DB.notification();
            // Added a notify
            var getTime = DB.getTimewithFormat();
            getdata = JSON.parse(localStorage.getItem('notification'));
            var get_position = localStorage.getItem('location');

            getdata.items.push(
              {
                event:localStorage.getItem('schedule_running'),
                time:getTime,
                type:'timeover',
                jobActivity: localStorage.getItem('schedule_running'),
                position: get_position,
              }
            );
            localStorage.setItem('notification',JSON.stringify(getdata));

            // sync with server if server is available
            DB.check_sync_with_server();


            localStorage.setItem('countdown_ON','OFF');
            clearInterval(timeinterval_countdown);
          }
      }},1000);
    }
  }
  DB.countdown_timer();









  /**
  *   Edit button for JobSchedule ( Task )
  *   Open lightbox-edit When Click on edit-btn bottom
  *
  *   @since 0.10.33
  */
  DB.btnedit = function(id){
    $('lightbox-edit').attr('attr-id' , id);
    $('lightbox-edit .ActivityID').html(id);

    // check is set in jsdo_done_readyforsync or ney with (JobactivityID and jobActivity)
    var get_data_jsdo_done = JSON.parse(localStorage.getItem('jsdo_done'));
    get_data_jsdo_done_count = get_data_jsdo_done.items.length;

    //  which id request edit
    var getid = $('lightbox-edit').attr('attr-id');


    // console.log(get_data_jsdo_done);
    var which_structure = 1;
    for(d = 0; d < get_data_jsdo_done_count;d++){
      if(getid ==  get_data_jsdo_done.items[d].jobActivity){

        which_structure = 0;
        break;
      }
    }

    if(which_structure == 0){

      console.log(getid);

      // get data from ready for sync
      for(b = 0; b < get_data_jsdo_done_count;b++){
        if(id ==  get_data_jsdo_done.items[b].jobActivity){
          // Make a format datetime for show in input
          var temp_date = get_data_jsdo_done.items[b].datetime;
          console.log(temp_date);
          var temp_date_split = temp_date.split(' ');
          $('.inputdatetime').val(temp_date_split.join('T'));

          // show last inputAdditionalInput
          $('.inputAdditionalInput').val(get_data_jsdo_done.items[b].HasAdditionalInput);
        }
      }
    }
    else if (which_structure == 1) {

      var item_running0 = JSON.parse(localStorage.getItem('doschedule'));
      jsdo  = 'jsdo_'+item_running0;

      var item_running = JSON.parse(localStorage.getItem(jsdo));
      item_running_count = Object.keys(item_running).length - 1 ;

      // Get Data from database (Queue Ready to send)
      var getalldata = JSON.parse(localStorage.getItem(jsdo));

      getalldata_count = Object.keys(getalldata).length - 1;

      for(a = 0; a < getalldata_count;a++){
        if(id ==  getalldata[a].JobactivityID){
          // Make a format datetime for show in input
          var temp_date = getalldata[a].EndDateTime;
          console.log(temp_date);
          var temp_date_split = temp_date.split(' ');
          $('.inputdatetime').val(temp_date_split.join('T'));

          // show last inputAdditionalInput
          $('.inputAdditionalInput').val(getalldata[a].Value);
        }
      }

    }
    console.log(which_structure);





    $('lightbox-edit').css('display','block');


    // DB.notification();
    // Added a notify
    var getTime = DB.getTimewithFormat();
    getdata = JSON.parse(localStorage.getItem('notification'));
    var get_position = localStorage.getItem('location');
    getdata.items.push(
      {
        event: id,
        time:getTime,
        type:'edited',
        jobActivity: id,
        position: get_position,
      }
    );
    localStorage.setItem('notification',JSON.stringify(getdata));



    // sync with server if server is available
    // DB.check_sync_with_server();

  }



  setTimeout(function(){
    // close lightbox-edit when click on Close
    $('.close').click(function(){

      $('.inputAdditionalInput').val('');
      $('.inputdatetime').val('');
      $('lightbox-edit').css('display','none');
    });
  },1000);


  setTimeout(function(){
    $('.submit').click(function(){


      // check is set in jsdo_done_readyforsync or ney with (JobactivityID and jobActivity)
      var get_data_jsdo_done = JSON.parse(localStorage.getItem('jsdo_done'));
      get_data_jsdo_done_count = get_data_jsdo_done.items.length;

      //  which id request edit
      var getid = $('lightbox-edit').attr('attr-id');


      // console.log(get_data_jsdo_done);
      var which_structure_submit = 1;
      for(d = 0; d < get_data_jsdo_done_count;d++){
        if(getid ==  get_data_jsdo_done.items[d].jobActivity){

          which_structure_submit = 0;
          console.log('yeah we are here!');
          break;
        }
      }

      if(which_structure_submit == 0){

        // set format date time

        // Setting new data into jsdo_done_readyforsync After Edited
        // Get Data from database
        var getalldata = JSON.parse(localStorage.getItem('jsdo_done'));
        getalldata_count = getalldata.items.length;

        // set data into database
        for(e = 0; e < getalldata_count;e++){
          if(getid ==  getalldata.items[e].jobActivity){

            // set format date time
            changetimeformat = $('.inputdatetime').val();
            if(changetimeformat != ''){

              chtime = changetimeformat.split('T');
              chtime_count = chtime.length;
              var correcttimeformat;
              correcttimeformat = chtime.join(' ');
              correcttimeformat = correcttimeformat+':00';

              getalldata.items[e].datetime = correcttimeformat;
            }
            getalldata.items[e].HasAdditionalInput = $('.inputAdditionalInput').val();
            localStorage.setItem('jsdo_done',JSON.stringify(getalldata));
          }
        }
        // Reload window
        window.location.replace('job-schedule-do.html');
      } // end which_structure_submit 0
      else if ( which_structure_submit == 1 ){


        // set format date time
        changetimeformat = $('.inputdatetime').val();
        if(changetimeformat != ''){

          chtime = changetimeformat.split('T');
          chtime_count = chtime.length;
          var correcttimeformat;
          correcttimeformat = chtime.join(' ');
          correcttimeformat = correcttimeformat;

        }else{
          correcttimeformat = '';
        }

        var HasAdditionalInput = $('.inputAdditionalInput').val();

        // set for jsdo_done
        DATA = JSON.parse(localStorage.getItem('jsdo_done'));
        DATA.items.push({jobActivity:getid,datetime:correcttimeformat,HasAdditionalInput:HasAdditionalInput});
        localStorage.setItem('jsdo_done',JSON.stringify(DATA));

        // Reload Window
        window.location.replace('job-schedule-do.html');

      }

    });
  });















  /*
  *   Check Sync With Server
  *   @param jsdo (  )
  *
  *   @Since 0.9.42
  */
  DB.check_sync_with_server = function(){

    // get data job_done
    var data_done = JSON.parse(localStorage.getItem('jsdo_done'));
    var count_sync = data_done.items.length;
    // condition for how many job_done
    if (count_sync > 1) {
      setTimeout(function(){
        $('#sync_with_server').html(count_sync-1 +' item(s) recorded, Sync With Server.');
        $('.sync_with_server').show('slow');
        DB.sync_with_server();
        DB.notification();
      },1500);
    }
  }
  DB.check_sync_with_server();


  DB.sendAuto = function(){
    DB.check_sync_with_server();
  }
  setTimeout(function(){
    setInterval(function(){
      DB.sendAuto();
    },10000);
  },10000);


  /*
  *   Sync With Server
  *   @param jsdo (  )
  *
  *   @Since 0.9.42
  */
  DB.sync_with_server = function(){

    var jsdo_done_sync = JSON.parse(localStorage.getItem('jsdo_done'));

    var count_jsdo = jsdo_done_sync['items'].length;



    // Change structure for server
    var newarray = [];
    for(i = 1; i < count_jsdo ; i++){
      if ( jsdo_done_sync['items'][i]['HasAdditionalInput'] != null ) {
        newarray.push(jsdo_done_sync['items'][i]);
      }else{
        jsdo_done_sync['items'][i]['HasAdditionalInput'] = '';
        newarray.push(jsdo_done_sync['items'][i]);
      }
    }

    // ready for sending wiht username
    var  which_user = localStorage.getItem('username');
    $('.show-loading').show();
    $.ajax({
      url: LDPA.RootServer+"/api/ldpa/sync_with_server/",

      data: {
        jsdo_done_readyforsync: newarray,
        which_user: which_user,
      },

      type: "POST",

      dataType: "json",
    })

    .done(function (json) {

      console.log(json);
      $('.show-loading').hide();
      $('#sync_with_server').hide('slow');
      $('message-noty').show('slow');
      localStorage.setItem('jsdo_done_readyforsync', '');
      jsdo_done_default = {items: [
        {jobActivity:-1,datetime:0,HasAdditionalInput:0}
      ]};
      localStorage.setItem('jsdo_done',JSON.stringify(jsdo_done_default));

      // update all jobschedule ( jsdo_X )
      DB.get_schedule_task();
      $('message-noty').html('JobSchedule list updated !');
      $('message-noty').show('slow');
      setTimeout(function(){
        $('message-noty').hide('slow');
      },2000);

      // show a message sync is completed
      setTimeout(function(){
        $('message-noty').html('Sync Completed !');
        $('message-noty').show('slow');
      },2500);

      setTimeout(function(){
        $('message-noty').hide('slow');
      },5000);


    })

    .fail(function (xhr, status, errorThrown) {

      console.log("Error: " + errorThrown);
      console.log("Status: " + status);
      console.dir(xhr);
    });
  }


  setTimeout(function(){
    $('#sync_with_server').click(function(){
      console.log('yeah clicked');
      DB.sync_with_server();
    });
  },2000);





  /*
  *   Function Send notification to server when its available
  *
  *   @since 1.3.0
  */
  DB.sendNotification = function(){


    var get_data_notification = JSON.parse(localStorage.getItem('notification'));

    var get_data_notification_count = get_data_notification.items.length;
    console.log(get_data_notification_count);
    console.log(get_data_notification);
    which_user = localStorage.getItem('id')


    // Change structure for server
    var newarray0 = [];
    for(i = 0; i < get_data_notification_count ; i++){
      newarray0.push(get_data_notification['items'][i]);
    }

    console.log(newarray0);
    if(get_data_notification_count >= 1){


      $.ajax({
        url: LDPA.RootServer+"/api/ldpa/send_notification/",

        data: {
          jsdo_warning: newarray0,
          which_user: which_user,
        },

        type: "POST",

        dataType: "json",
      })

      .done(function (json) {
        // console.log(json);
        localStorage.removeItem('notification');
        // localStorage.setItem('notification','');

      })
      .fail(function (xhr, status, errorThrown) {

        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });

    }

  }


  /*
  *   Function get Time now with format like 2017-02-27 02:39:47
  *
  *   @since 1.3.0
  */
  DB.getTimewithFormat = function(){

    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = today.getMonth()+1;
    var dd = today.getDate();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    if(dd<10){ dd='0'+dd;}
    if(mm<10){ mm='0'+mm;}
    if(h<10){h='0'+h;}
    if(m<10){m='0'+m;}
    if(s<10){s='0'+s;}

    timeanddate = yyyy+'-'+mm+'-'+dd+' '+h+':'+m+':'+s;

    return timeanddate;
  }

  /*
  *   Function append with added element to page work with ID
  *
  *   @since 1.3.0
  */
  DB.notification = function(){

    var getTime = DB.getTimewithFormat();

    var notify = {'event':'','time':'','type':'','jobActivity':'','position':''};
    notify = {items: [
      // {event:-1,time:0}
    ]};

    if(localStorage.getItem('notification') === null ){
      localStorage.setItem('notification',JSON.stringify(notify));
    }

    // getdata = JSON.parse(localStorage.getItem('notification'));
    //
    // getdata.items.push(
    //   {
    //     event:'Submit new notification from new Notification Center',
    //     time:getTime,
    //     type:'warning',
    //   }
    // );
    // localStorage.setItem('notification',JSON.stringify(getdata));

    console.log(JSON.parse(localStorage.getItem('notification')));

    DB.sendNotification();
  }
  DB.notification();
