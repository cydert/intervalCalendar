const weeks = ['日', '月', '火', '水', '木', '金', '土']
const date = new Date()

let year = date.getFullYear() //現地年取得
let month = date.getMonth() + 1 //現地月取得（0起点）
const config = {
    show: 3,
}

let every_start_date = "";//基準日 date型(入力取得)
let every_interval_date = -1;//基準日以降何日毎か(入力取得)



//カレンダー表示
function showCalendar(year, month) {
    for ( i = 0; i < config.show; i++) {
        const calendarHtml = createCalendar(year, month)
        const sec = document.createElement('section')
        sec.innerHTML = calendarHtml
        document.querySelector('#calendar').appendChild(sec)

        month++
        if (month > 12) {
            year++
            month = 1
        }
    }
}

//カレンダーhtml生成
function createCalendar(year, month) {
    console.log("create_year:"+year+"month:"+month);
    const startDate = new Date(year, month - 1, 1) // 月の最初の日を取得
    const endDate = new Date(year, month,  0) // 月の最後の日を取得
    const endDayCount = endDate.getDate() // 月の末日
    const lastMonthEndDate = new Date(year, month - 1, 0) // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate() // 前月の末日
    const startDay = startDate.getDay() // 月の最初の日の曜日を取得 0:日曜
    let dayCount = 1 // 日にちのカウント
    let calendarHtml = '' // HTMLを組み立てる変数
    
    let nextMark = -1; //次のマークまであと何日 //every_interval_dateが何日間隔か
    let isIntervalMark = new Boolean(false); //日付間隔マークするか
    //初回の次マーク計算 every_start_dateがあり、every_interval_date が正なら
    if( every_start_date != "" && every_interval_date > -1){
      isIntervalMark = new Boolean(true);
      let firstDate = new Date(year, month - 1, 0);//前月の最後の日
      firstDate.setDate(firstDate.getDate() - startDay + 1); //カレンダー先頭の日付(先月末 - 表示が必要な日数(自分自身も除外なので+1))
      console.log(firstDate);
      console.log(every_start_date);
      console.log("debug:firstDate, every_start_date");
      let difference_day = (( firstDate - every_start_date ) /1000 / 60 / 60 / 24); //カレンダー初日との差分日数
      if(difference_day < 0 ) nextMark = Math.abs(difference_day) % every_interval_date; //基準日が未来の場合
      else nextMark = every_interval_date -(difference_day % every_interval_date); //msを日数に変換,次が何日後か
      if(nextMark == every_interval_date) nextMark=0;
      console.log("differ:" + difference_day);
      console.log("next:" + nextMark);
    }
    // |固定日-最初の日付|/日付間隔
    
    

    calendarHtml += '<h1>' + year  + '/' + month + '</h1>'
    calendarHtml += '<table>'

    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<td>' + weeks[i] + '</td>'
    }

    //カレンダー生成
    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr>'

        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前(前月)
                let num = lastMonthendDayCount - startDay + d + 1 //開始の曜日が遅い分先月表示
                if(isIntervalMark && nextMark == 0){
                  calendarHtml += '<td class="highlight">' + num + '</td>'
                }else{
                  calendarHtml += '<td class="is-disabled">' + num + '</td>'
                }
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた(翌月)
                let num = dayCount - endDayCount
                if(isIntervalMark && nextMark == 0){
                  calendarHtml += '<td class="highlight">' + num + '</td>'
                }else{
                  calendarHtml += '<td class="is-disabled">' + num + '</td>'
                }
                dayCount++
            } else {
                if(isIntervalMark && nextMark == 0){
                  calendarHtml += `<td class="highlight" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`
                }else{
                  calendarHtml += `<td class="calendar_td" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`
                }
                dayCount++
            }
            
            if(isIntervalMark){
                nextMark--;
                if(nextMark < 0) nextMark = every_interval_date-1;
            }
        }
        calendarHtml += '</tr>'
    }
    calendarHtml += '</table>'

    return calendarHtml
}

function moveCalendar(e) {
    document.querySelector('#calendar').innerHTML = ''

    if (e.target.id === 'prev') {
        month--

        if (month < 1) {
            year--
            month = 12
        }
    }

    if (e.target.id === 'next') {
        month++

        if (month > 12) {
            year++
            month = 1
        }
    }

    showCalendar(year, month)
}

//設定日毎のカレンダー色設定
function setEveryColor(e){
    let start_date = document.getElementById('every_start_date');
    let interval_date = document.getElementById('interval_date');
    if(start_date.value == ""){
      //開始日未入力
      return;
    }
    if(interval_date.value == ""){
      //間隔日未入力
      return;
    }
    
    //設定日とカレンダー表示日の差分計算
    //every_start_date = start_date.valueAsDate;
    every_start_date = new Date(start_date.value + " 00:00:00");
    every_interval_date = interval_date.value;

    //debug
    console.log(every_start_date);
    console.log(every_interval_date);

    document.querySelector('#calendar').innerHTML = ''
    showCalendar(year, month)
}

//カレンダー前後設定
document.querySelector('#prev').addEventListener('click', moveCalendar)
document.querySelector('#next').addEventListener('click', moveCalendar)

document.querySelector('#apply_date').addEventListener('click', setEveryColor)

document.addEventListener("click", function(e) {
    if(e.target.classList.contains("calendar_td")) {
        let start_date = document.getElementById('every_start_date');
        start_date.valueAsDate = new Date(e.target.dataset.date + " 09:00:00");//要確認

    }
})

showCalendar(year, month)