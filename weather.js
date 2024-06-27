const button = document.querySelector('.search-section button')
button.addEventListener('click',async function(event){
    const city = document.querySelector('.search').value;
    const API_KEY = 'dd1aa70d9d905e14a075a4c26183a9d2';
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if(response.ok){
        const data = await response.json();
        const currentDate = new Date().toDateString();
        const weather = data.weather[0];
        const timeOption = {
            hour:('numeric','2-digit'),
            minute:('numeric','2-digit')
        }

        // adhan time api
        let adhanData;
        const adhanResponse = await fetch(`https://api.aladhan.com/v1/timings?latitude=${data.coord.lat}&longitude=${data.coord.lon}&method=4`);
        if(adhanResponse.ok){
            adhanData = await adhanResponse.json();            
        }
        const adhanTimes = adhanData.data.timings;
        const times = {};
        for(let prayerName in adhanTimes){
            let prayerTime = adhanTimes[prayerName];
            const [hours,minutes] = prayerTime.split(':').map(Number);
            const unit = hours >= 12 ? 'pm' : 'am';
            const hoursIn12 = hours % 12 || 12;
            times[prayerName] = `${hoursIn12.toString()}:${minutes.toString().padStart(2,'0')}${unit}`
        }
        console.log(times);

        // updating fields
        document.getElementById('date').innerText = currentDate;
        document.querySelector('#logo img').src = `./images/${weather.main.toLowerCase()}.png`;
        document.getElementById('temp').innerText = data.main.temp;
        document.getElementById('place').innerText = city
        document.querySelector('.humidity .count').innerText = data.main.humidity;
        document.getElementById('description').innerText = weather.description
        document.querySelector('.wind .count').innerText = data.wind.speed;
        document.querySelector('.rise .time').innerText = times.Sunrise
        document.querySelector('.set .time').innerText = times.Sunset;
        document.querySelector('.fajr .prayer-time').innerText = times.Fajr
        document.querySelector('.duhr .prayer-time').innerText = times.Dhuhr
        document.querySelector('.asr .prayer-time').innerText = times.Asr
        document.querySelector('.maghrib .prayer-time').innerText = times.Maghrib
        document.querySelector('.isha .prayer-time').innerText = times.Isha

        console.log(adhanData);
    }
})

document.addEventListener('DOMContentLoaded',function(){
    if(navigator.geolocation){
        const API_KEY = 'dd1aa70d9d905e14a075a4c26183a9d2';
        const currentDate = new Date().toDateString();
        navigator.geolocation.getCurrentPosition(async function success(position){
            try{
                const {latitude,longitude} = position.coords;
                const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
                if(response.ok){
                    const data = await response.json();
                    const weather = data.weather[0];
                    const dateOption = {
                        hour:('numeric','2-digit'),
                        minute:('numeric','2-digit')
                    }
                    // finding adhan timings
                    let adhanTimes;
                    const adhanAPIResponse = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=4`);
                    if(adhanAPIResponse.ok){
                        const data = await adhanAPIResponse.json();
                        adhanTimes = data.data.timings;                        
                    }
                    let times = {};
                    for(let prayer in adhanTimes){
                        const [hours,minutes] = adhanTimes[prayer].split(':').map(Number);
                        const unit = hours >= 12 ? 'pm' : 'am'
                        const hours12 = hours % 12 || 12;
                         times[prayer] = `${hours12.toString()}:${minutes.toString().padStart(2,'0')}${unit}`
                    }
                    console.log(adhanTimes);
                    document.getElementById('date').innerText = currentDate;
                    document.querySelector('#logo img').src = `./images/${weather.main.toLowerCase()}.png`;
                    document.getElementById('temp').innerText = data.main.temp;
                    document.getElementById('place').innerText = data.name
                    document.querySelector('.humidity .count').innerText = data.main.humidity;
                    document.getElementById('description').innerText = `${weather.description} in this location`
                    document.querySelector('.wind .count').innerText = data.wind.speed;
                    document.querySelector('.rise .time').innerText = times.Sunrise;
                    document.querySelector('.set .time').innerText = times.Sunset;
                    document.querySelector('.fajr .prayer-time').innerText = times.Fajr;
                    document.querySelector('.duhr .prayer-time').innerText = times.Dhuhr;
                    document.querySelector('.asr .prayer-time').innerText = times.Asr;
                    document.querySelector('.maghrib .prayer-time').innerText = times.Maghrib;
                    document.querySelector('.isha .prayer-time').innerText = times.Isha;
                }
            }
            catch(error){
                window.alert('Geolocation tracking failed')
            }
        })
    }
})

