/**
*   Count down ( Timer )
*   we need a countdown for when time is period
*   inserted to timer_out and send to server manager
*
*   @since 0.10.33
*
*/
DB.timer_down = function(Timelimit, schedule_running){

  clearInterval(DB.timer_running);

  Timelimit0 = (Date.now() + (Timelimit * 60 * 1000));
  localStorage.setItem('time_left',0);

  localStorage.setItem('time_left',Timelimit0);
  localStorage.setItem('countdown_ON','ON');
  localStorage.setItem('schedule_running',schedule_running);

  if(localStorage.getItem('time_left') > 0 || localStorage.getItem('time_left') != 0){
    DB.timer_running = setInterval(function(){

      localStorage.setItem('countdown_ON','ON');
      localStorage.setItem('schedule_running',schedule_running);
      localStorage.setItem('time_left',localStorage.getItem('time_left') - 1000);
      DB.timer();

    },1000);
  }else {
    clearInterval(DB.timer_running);
    localStorage.setItem('time_left',0);
    localStorage.setItem('countdown_ON','OFF');

  }
}

if(localStorage.getItem('countdown_ON') == 'ON'){
  if( localStorage.getItem('time_left') != 0){
    DB.timer_running = setInterval(function(){

      localStorage.setItem('countdown_ON','ON');
      localStorage.setItem('time_left',localStorage.getItem('time_left') - 1000);
      DB.timer();

    },1000);
  }
}

/**
*   this is check timer is out if yeah set a sending Queue to server
*
*   @since 0.10.33
*
*/
DB.timer = function(){

  var timer_structure = {'id':'','id_user':''};
  timer_structure = {items: [
    {jobActivityid:-1,id_user:0}
  ]};

  if(localStorage.getItem('timer_out') === null ){
    localStorage.setItem('timer_out',JSON.stringify(timer_structure));
  }
  var countdown_ON = localStorage.getItem('countdown_ON');
  var countdown = localStorage.getItem('time_left');
  var schedule_running = localStorage.getItem('schedule_running');

  console.log(countdown);
  console.log(JSON.parse(localStorage.getItem('timer_out')));
  if(countdown < 1 ){
    if ( countdown_ON == 'ON' ){
      old_timer_data = JSON.parse(localStorage.getItem('timer_out'));

      old_timer_data.items.push({
        jobActivityid:schedule_running,
        id_user:localStorage.getItem('id'),
      });
      localStorage.setItem('timer_out',JSON.stringify(old_timer_data));
      clearInterval(DB.timer_running);
    }
  }
}




  DB.send_warning_time_over = function(){

    var timer_structure = {'id':'','id_user':''};
    timer_structure = {items: [
      {jobActivityid:-1,id_user:0}
    ]};

    if(localStorage.getItem('timer_out') === null ){
      localStorage.setItem('timer_out',JSON.stringify(timer_structure));
    }

    var get_data_warining = JSON.parse(localStorage.getItem('timer_out'));

    var get_data_warining_count = get_data_warining.items.length;
    // console.log(get_data_warining_count);
    // console.log(get_data_warining);
    which_user = localStorage.getItem('id')


    // Change structure for server
    var newarray0 = [];
    for(i = 1; i < get_data_warining_count ; i++){
      newarray0.push(get_data_warining['items'][i]);
    }

    if(get_data_warining_count > 1){


      $.ajax({
        url: "http://00p.ir/ldpa/api/ldpa/send_warning_time_over/",

        data: {
          jsdo_warning: newarray0,
          which_user: which_user,
        },

        type: "POST",

        dataType: "json",
      })

      .done(function (json) {
        // console.log(json);
        localStorage.setItem('timer_out','');
        var timer_structure = {'id':'','id_user':''};
        timer_structure = {items: [
          {jobActivityid:-1,id_user:0}
        ]};

        if(localStorage.getItem('timer_out') == '' ){
          localStorage.setItem('timer_out',JSON.stringify(timer_structure));
        }
      })
      .fail(function (xhr, status, errorThrown) {

        console.log("Error: " + errorThrown);
        console.log("Status: " + status);
        console.dir(xhr);
      });

    }
  }
  DB.send_warning_time_over();
