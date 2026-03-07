const baby = {

birthday:"2025-12-07",

weight:5.8,

interval:3.5

}

let feedingHistory = []

let lastClickTime = 0



function getAge(){

const birth = new Date(baby.birthday)

const now = new Date()

const diff = now - birth

const weeks = Math.floor(diff/(1000*60*60*24*7))

const months = Math.floor(weeks/4)

const remainWeeks = weeks%4

return `${weeks} 週 (${months} 個月又 ${remainWeeks} 週)`

}



function calculateMilk(){

const dailyMilk = baby.weight*150

const feeds = 24/baby.interval

let milk = dailyMilk/feeds

milk = Math.round(milk/10)*10

return milk

}



function powderScoops(ml){

let scoops = ml/30

let base = Math.floor(scoops)

let decimal = scoops-base

if(decimal<0.25){

decimal=0

}else if(decimal<0.75){

decimal=0.5

}else{

decimal=1

}

return base+decimal

}



function formatTime(date){

return date.toLocaleTimeString("zh-TW",{

hour:"2-digit",

minute:"2-digit",

hour12:false

})

}



function render(){

document.getElementById("age").innerText=getAge()

document.getElementById("weight").innerText=baby.weight

const milk=calculateMilk()

document.getElementById("milk").innerText=milk

document.getElementById("powder").innerText=powderScoops(milk)



if(feedingHistory.length>0){

const last=new Date(

feedingHistory[feedingHistory.length-1].time

)

document.getElementById("lastFeed").innerText=

formatTime(last)



const next=

new Date(last.getTime()+baby.interval*60*60*1000)

document.getElementById("nextFeed").innerText=

formatTime(next)

}



updateHistory()

}



document.getElementById("feedBtn").onclick=function(){

const nowClick = Date.now()



if(nowClick - lastClickTime < 10000){

alert("剛剛已記錄")

return

}



lastClickTime = nowClick



if(!confirm("確定記錄餵奶時間？")) return



const now=new Date()



db.collection("feeding").add({

time: now.toISOString(),

amount: calculateMilk()

})

}



function loadData(){

db.collection("feeding")

.orderBy("time")

.onSnapshot(snapshot=>{

feedingHistory=[]



snapshot.forEach(doc=>{

feedingHistory.push(doc.data())

})



render()

})

}



function updateHistory(){

const table=document.getElementById("historyTable")



table.innerHTML=`

<tr>

<th>日期</th>

<th>時間</th>

<th>毫升</th>

<th>間隔</th>

<th>操作</th>

</tr>

`



for(let i=0;i<feedingHistory.length;i++){

const record=feedingHistory[i]

const d=new Date(record.time)



const date=d.toLocaleDateString("zh-TW")

const time=formatTime(d)



let interval="-"



if(i>0){

const prev=new Date(feedingHistory[i-1].time)

const diff=d-prev



const h=Math.floor(diff/(1000*60*60))

const m=Math.floor((diff%(1000*60*60))/(1000*60))



interval=`${h}h${m}m`

}



table.innerHTML+=`

<tr>

<td>${date}</td>

<td>${time}</td>

<td>${record.amount}ml</td>

<td>${interval}</td>

<td>

<button onclick="deleteRecord('${record.time}')">刪除</button>

</td>

</tr>

`

}

}



window.deleteRecord=function(time){

if(!confirm("確定刪除？")) return



db.collection("feeding")

.where("time","==",time)

.get()

.then(snapshot=>{

snapshot.forEach(doc=>{

db.collection("feeding").doc(doc.id).delete()

})

})

}



render()

loadData()