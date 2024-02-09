async function fetchWeatherData(){
  try{
    const apiKeyResponse = await fetch('api_key.txt');
    const apiKey = await apiKeyResponse.text();
    console.log(apiKey);

    if(apiKey.length == 0){
      throw new Error("Invalid API Key")
    }
    const inputCityName = document.getElementById("inputCityName").value.toLowerCase();
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputCityName}&appid=${apiKey}`);
    if(!response.ok){
        throw new Error("Could not fetch resource");
    }
    const weatherData = await response.json();
    console.log(weatherData);

    document.querySelector(".cityName").innerHTML = weatherData.name;
    document.querySelector(".temp").innerHTML = (weatherData.main.temp/10).toFixed(1) + "°C";
    document.querySelector(".humidity").innerHTML = weatherData.main.humidity + "%";
    document.querySelector(".wind").innerHTML = weatherData.wind.speed + "km/h";
 
    // Timezone Shift in seconds
    const shiftInSecondsUTC = weatherData.timezone;
    // Today's Date
    const currDate = new Date();
    // Timezone shift in local
    const shiftInSecondsLocal = currDate.getTimezoneOffset() * 60;
    // Local Time in seconds
    const localTimeInSeconds = ((currDate.getHours() * 3600) + (currDate.getMinutes() * 60) + (currDate.getSeconds()));
    // Current UTC time in seconds
    const currUTCinSeconds = localTimeInSeconds + shiftInSecondsLocal;
    // Current local time in desired city in seconds
    const localTimeInSecondsOfCity = currUTCinSeconds + shiftInSecondsUTC;
    
    var hourOfTheDay = Math.floor(localTimeInSecondsOfCity / 3600);
    console.log("before calculation " + hourOfTheDay);
    if(hourOfTheDay < 0){
      hourOfTheDay += 12;
    }

    var minuteOfTheDay = (localTimeInSecondsOfCity / 3600) - Math.floor(localTimeInSecondsOfCity / 3600);
    minuteOfTheDay = Math.floor(minuteOfTheDay * 60);

    // Format the time in 24-hour format
    const formattedTime = `${hourOfTheDay}:${minuteOfTheDay.toString().padStart(2, '0')}`;
    
    document.querySelector(".currTime").innerHTML = formattedTime;
  
  }
  catch(error){
    console.error(error);
  }
}