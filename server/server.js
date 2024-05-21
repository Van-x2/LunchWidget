//Sets up express, also defines usefull variables
const express = require('express')
const app = express()
const port = 3000
let dailyMenuRaw = []
let dailyMenuFormatted = []
let headersList = {
  "x-district": "340"
 }

//function for formatting lunch data
function extractMenuItems(menuList, date) {
  const labelsToExtract = ['Breakfast Entree', 'Daily Snack Selection', 'Lunch Entree', 'Misc.'];
  const menuObject = {"date": date};
  let currentLabel = null;

  menuList.forEach(item => {
      if (labelsToExtract.includes(item)) {
          currentLabel = item;
          menuObject[currentLabel] = [];
      } else if (currentLabel) {
          menuObject[currentLabel].push(item);
      }
  });


  return menuObject;
}
//function for easy access to an organized menu for a given day
function menuForDay(day, data, month) {
  let date

  



  fullMenu = data.data.menu_month_calendar
  let i2 = 0
  while (i2 < fullMenu.length) {
    if(fullMenu[i2] == null) {
    }
    else{
      if(!fullMenu[i2].day){
        dailyMenuList = JSON.parse(data.data.menu_month_calendar[(i2)].setting)
        date = 'Invalid Lunch Day'
      }
      else{
        if(day.length == 1) {
          
          if(fullMenu[i2].day == ('2024-'+month+'-0' + day)) {
            dailyMenuList = JSON.parse(data.data.menu_month_calendar[(i2)].setting)
            date = data.data.menu_month_calendar[(i2)].day
            }

        }
        else{

          if(fullMenu[i2].day == ('2024-'+month+'-' + day)) {
            dailyMenuList = JSON.parse(data.data.menu_month_calendar[(i2)].setting)
            date = data.data.menu_month_calendar[(i2)].day
            } 

        }




        
      }
    }
    
    
    i2 = i2 + 1
    
  }

  let i = 0
  while(i < Object.keys(dailyMenuList.current_display).length) {
   
   dailyMenuRaw.push(dailyMenuList.current_display[i].name)
   
   dailyMenuFormatted = extractMenuItems(dailyMenuRaw, date)
   

   i = i + 1
  }
  return dailyMenuFormatted
}


//activates when user loads the link
app.get('/month=:month/day=:day', (req, res) => {
  let day = (req.params.day);
  let month = (req.params.month);

  if(month.length == 1){
    month = ('0' + month)
  }


  

  
  async function requestDataFromMenu() {
    let response = await fetch("https://www.myschoolmenus.com/api/public/menus/31519?menu_month=2024-"+month+"-01", { 
         method: "GET",
         headers: headersList
       });
       let data = await response.json();
       
       
    //console.log(menuForDay(day, data))
    res.json(menuForDay(day, data, month));


  }
  requestDataFromMenu()
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})