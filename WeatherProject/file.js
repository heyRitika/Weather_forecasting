const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");


const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorHandle=document.querySelector(".error-page");

let oldTab=userTab;
const App_id="c3c8fd219e5609f8b7b96f4b3a23e194";
oldTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab){
    if (clickedTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=clickedTab;
        oldTab.classList.add("current-tab");
        if (!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            errorHandle.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            errorHandle.classList.remove("active");
            getFromSessionStorage();
        }
    }

}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);

});
function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if (!localCoordinates){
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    // console.log("Working6");
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    // console.log("Working8");
    try{
        const response=await fetch(
            "https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${App_id}");            
        const data=await response.json();
        // console.log("Working7");

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        // console.log("Working5");

    }catch(err){
        console.log("errrrr");
        loadingScreen.classList.remove("active");

    }
}
function renderWeatherInfo(weatherInfo){
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    cityName.innerText=weatherInfo?.name;
    countryIcon.src=src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`; 
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${Math.round(weatherInfo?.main?.temp-273.15)}°C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
}

function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
        // console.log("Working3");
    }else{
        // show an alert for no geo Support
    }
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
        
    }
    // console.log("Working4");
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
// console.log("Working1");

const grantBtn=document.querySelector("[data-grantAccess]");
grantBtn.addEventListener('click',getLocation);
// console.log("Working2");


let searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    // console.log("working1");
    if (searchInput.value==="")return;
    fetchSearchWeatherInfo(searchInput.value);
});
async function fetchSearchWeatherInfo(city){
    // console.log("working1");

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    errorHandle.classList.remove("active");
    try{
        // console.log("working3");
        const response1=await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${App_id}`);
        // console.log("working6 ");
        if (response1.ok){
            const data1=await response1.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            // console.log("working8");
            renderWeatherInfo(data1);
        }else{
            loadingScreen.classList.remove("active");
            // searchForm.classList.remove("active");
            errorHandle.classList.add("active");
            // console.log("error msg");
        }
        // errorHandle.classList.remove("active");
    }catch(err){
        // console.log(err);
    }
}