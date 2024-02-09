async function fetchWeatherData(){
  try{
    const apiKeyResponse = await fetch('api_key.txt');
    const apiKey = await apiKeyResponse.text();

    if(apiKey.length == 0){
      throw new Error("Invalid API Key")
    }
    const inputCityName = document.getElementById("inputCityName").value.toLowerCase();
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${inputCityName}&appid=${apiKey}`);
    if(!response.ok){
        document.querySelector(".weatherData").style.display = "none";
        document.querySelector(".errorMessage").style.display = "block";
        throw new Error("Could not fetch resource");
    }
    const weatherData = await response.json();
    console.log(weatherData);

    document.querySelector(".weatherData").style.display = "block";
    document.querySelector(".errorMessage").style.display = "none";

    document.querySelector(".cityName").innerHTML = weatherData.name;
    document.querySelector(".temp").innerHTML = (weatherData.main.temp + (-273.15)).toFixed() + "°C";
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
    if(hourOfTheDay < 0){
      hourOfTheDay += 12;
    }

    if(hourOfTheDay >= 24)
    {
      hourOfTheDay = hourOfTheDay - 24;
    }

    // Fixing Dates System

    var minuteOfTheDay = (localTimeInSecondsOfCity / 3600) - Math.floor(localTimeInSecondsOfCity / 3600);
    minuteOfTheDay = Math.floor(minuteOfTheDay * 60);

    // Format the time in 24-hour format
    const formattedTime = `${hourOfTheDay}:${minuteOfTheDay.toString().padStart(2, '0')}`;
    
    document.querySelector(".currTime").innerHTML = formattedTime;
  
    // Changing icons
    const weatherIcon = document.querySelector(".weatherIcon");

    if(weatherData.weather[0].main == "Clouds"){
      weatherIcon.src = "icon-images/clouds.png";
    }
    else if(weatherData.weather[0].main == "Clear"){
      weatherIcon.src = "icon-images/clear.png";
    }
    else if(weatherData.weather[0].main == "Drizzle"){
      weatherIcon.src = "icon-images/drizzle.png";
    }
    else if(weatherData.weather[0].main == "Mist"){
      weatherIcon.src = "icon-images/mist.png";
    }
    else if(weatherData.weather[0].main == "Rain"){
      weatherIcon.src = "icon-images/rain.png";
    }
    else if(weatherData.weather[0].main == "Snow"){
      weatherIcon.src = "icon-images/snow.png";
    }

  }
  catch(error){
    console.error(error);
  }
}