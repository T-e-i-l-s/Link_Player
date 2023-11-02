

//задержка
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}


//функция начала фоновой работы это не так важно
async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 0.0001, 
      stopOnTerminate: false,
      startOnBoot: true,
    });
}


//название фоновой функции
const BACKGROUND_FETCH_TASK = 'background-fetch';


//тут то, что тебе нужно
//для обновления аудио в фоне
//TaskManager это такая штука, которая вызывает фоновые задачи
TaskManager.defineTask(BACKGROUND_FETCH_TASK,async () => {

    //запустилась работа в фоне
    console.log('background start')

    //я через for заменил setInterval, тк setInterval не работает в фоне
    for(var i = 0; i < 999999999999; i++){

        console.log('updating')

        //!!!самое важное!!!
        sound.playAsync();//я снова запускаю аудио, эта функция при вызове возобновляет произведение звука, если он остановился
        //(не факт, что у тебя на котлине такое есть, но думаю ты найдешь как заменить)

        //тут я делаю задержку на 5 сек, чтобы лишнего не грузить акум
        sleep(5000)

    }

    return;

});


