const getImagesButton = document.querySelector('main');
var citynamein = document.querySelector('.forminput')
let requestUrl;
var speaktext;
var daydetails;
var clutter = "";
var sugp = document.querySelector('.suggestion');
 getCoordintes();
   
    
   
    citynamein.addEventListener('input', function () {
      // var str = document.querySelector('.forminput').value;
      // const str2 = str.charAt(0).toUpperCase() + str.slice(1,str.length).toLowerCase();
      var myTimeout;
      clearTimeout(myTimeout)
      myTimeout = null;
      if (citynamein.value.trim().length % 3 === 0) {
        console.log(citynamein)
        getsuggestion(citynamein);
      }
      else{

       myTimeout = setTimeout(function () {
        getsuggestion(citynamein.value);
      }, 5000);
      }  
    })

    document.querySelector('.suggestionbox').addEventListener('click', function(dets){
      if(dets.target.classList[0]==='suggest'){
        var that = dets.target;
        citynamein.value = that.textContent;
        // redirectweth(citynamein.value);
        getapiweth(citynamein.value)
          citynamein.value = '';
      sugp.innerHTML = '';

      }
    })


    document.querySelector('#search').addEventListener('click', function () {
      if (citynamein.value.trim().length > 2) {
        getapiweth(citynamein.value);
        sugp.innerHTML = '';
      }
    })

    //change day data by click on bottomele 
  

//email route redirct
document.querySelector('#emailbtn').addEventListener('click', function(){
  axios.post('/email/sent',{
      data: daydetails
  })
})




    //functions
    //get suggetion 
  function getsuggestion(inputdata){
    var requestOptions = {
      method: 'GET',
    };
    var data
    fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${inputdata}&apiKey=d49f176a37304904b140c3df66956d9c`, requestOptions)
      .then(response => response.json())
      .then(result => {
        sugp.innerHTML = ''
        console.log(result)
        result.features.forEach(function(ele){
        var sug = document.createElement('p');
              sug.classList.add('suggest');
              sug.classList.add('suggestele');
              sug.textContent = `${ele.properties.address_line1}`
              sugp.appendChild(sug)
              // sugp.append(sug);

        })
      })
      .catch(error => console.log('error', error));
      
    }

    //get new img by requesturl
    async function getNewImage() {
      let randomNumber = Math.floor(Math.random() * 10);
      return fetch(requestUrl)
        .then((response) => response.json())
        .then((data) => {
          let allImages = data.results[randomNumber];
          return allImages.urls.regular;
        });
    }

    //change img on page
    async function changeimg(data) {
      requestUrl = `https://api.unsplash.com/search/photos?query=${data} day&client_id=Yg1a0mov6k2qf-EgSQ4xnPR6O-eNf8b3FPGagRpOBH4`;

      let randomImage = await getNewImage();
      getImagesButton.style.backgroundImage = ` linear-gradient(
    rgba(0, 0, 0, 0.2), 
    rgba(0, 0, 0, 0.2)
  ),url(${randomImage})`;
    }

    //get cordinate of the cureent location
    function getCoordintes() {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };

      function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
        // console.log(pos);
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
        getCity(coordinates);
        return;

      }

      function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }

      navigator.geolocation.getCurrentPosition(success, error, options);
    }

    // Get city name by cordinate
    function getCity(coordinates) {
      var xhr = new XMLHttpRequest();
      var lat = coordinates[0];
      var lng = coordinates[1];

      // Paste your LocationIQ token below.
      xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.e6238d22e5d05aa7e1b73dfcf0d83220&lat=" + lat + "&lon=" + lng + "&format=json", true);
      xhr.send();
      xhr.onreadystatechange = processRequest;
      xhr.addEventListener("readystatechange", processRequest, false);

      function processRequest(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var response = JSON.parse(xhr.responseText);
          var city = response.address.city;
          console.log(city);
          getapiweth(city);
          return;
        }
      }
    }
    //send forecat data for backend
    function sandforecast(data){
      axios.post('/sandforecast',{
        data:data
      }).then(function(data){
        console.log('done')
      })

    }

    //create bottom cards
    function changedetail(data){
      clutter = '';
     var i = 0;
     console.log(data);
     data.forEach(function(ele){
      if(i!=12){

      
      clutter += `<div data-index="${i}" class="bottomele">
      <p>${ele.time}</p>
      <h1>${ele.temp_c}<span style="font-size: 0.7rem;  position:absolute; ">0</span> C</h1>
  </div>`
  
      }
      i++
    })
     document.querySelector('.bottom').innerHTML = `${clutter}`;
    
    }

  //speaker data build of main page  
function speakmain(){

  document.querySelector('.speak').addEventListener('click', function(){
    axios.post('/speak',{
      text: speaktext,
    }).then(function(data){
      console.log(data.data);
    })
  })
}
   
function apichangetextdetail(data, fore, loc){
  changeimg(fore.day.condition.text);
  document.querySelector('#skytext').textContent = fore.day.condition.text;
     document.querySelector('#cityname').textContent = loc.name;
     document.querySelector('#temp').innerHTML = `${data.temp_c}<span style="font-size: 1rem;  position:absolute; ">0</span> C`;
     document.querySelector('#windspeed').textContent = `${data.wind_kph} km/h`;
     document.querySelector('#winddisplay').textContent = `${data.wind_dir}`;
     document.querySelector('#humidity').textContent = data.humidity;
     document.querySelector('#feelslike').textContent = data.feelslike_c;
     document.querySelector('#day').textContent = fore.day.daily_chance_of_rain;
     document.querySelector('#date').textContent = fore.date;
     document.querySelector('#dayimg').src = `./images/${fore.day.condition.text}.png`
    speaktext = `Location ${loc.name} Today is ${fore.date} Day Start with ${fore.day.condition.text} day temparature ${data.temp_ce} celcious feellike ${data.feelslike_c} degree celcious windspeed ${data.wind_kph} kilometers per hour wind display ${data.wind_diry} Chances for rain are ${fore.day.daily_chance_of_rain} I Hope your day is good thank for coming on the this website`
    changedetail(fore.hour); 
  }


    //get weatherdata
    function getapiweth(cityn){
      const options = {
        method: 'GET',
        url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
        params: {q: `${cityn}`, days: '7'},
        headers: {
          'X-RapidAPI-Key': 'eccc92eb0dmsh3e83af9e4673740p183c24jsnb179f48e746c',
          'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
        }
      };
      
      axios.request(options).then(function (response) {
        console.log(response.data);
        sandforecast(response.data.forecast.forecastday);
        apichangetextdetail(response.data.current, response.data.forecast.forecastday[0], response.data.location)
      }).catch(function (error) {
        console.error(error);
      });
    }