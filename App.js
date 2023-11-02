//импортируем библиотек
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Linking, Keyboard } from 'react-native';
import { Audio } from 'expo-av';
import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';


//задержка
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}


//название фоновой функции
const BACKGROUND_FETCH_TASK = 'background-fetch';


//функция начала фоновой работы
async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 0.0001, // 15 minutes
      stopOnTerminate: false, // android only,
      startOnBoot: true, // android only
    });
}


var flag2 = false



export default function App() {

    const [sound, setSound] = React.useState();//для воспроизведения звука
    const [flag,setFlag] = useState(false)//запущенно ли аудио
    const [link,setLink] = useState('-1')//ссылка на аудио
    

    //функция обновления/загрузки аудио
    async function go() {

        if (link.length > 7){

            setText('Загрузка')

            setWarnCol('#fff')
            setCol(['#1E5945','#1E5945','#1E5945','#1E5945','#1E5945'])

            try{

			    Keyboard.dismiss()

                await registerBackgroundFetchAsync();


                const { sound } = await Audio.Sound.createAsync( { uri: link } );

                
                sound.setOnPlaybackStatusUpdate((status) => {
                    if (!status.didJustFinish) return;
                    sound.playAsync();
                });

                await Audio.setAudioModeAsync({
                    staysActiveInBackground: true,
                });
                await sound.setIsLoopingAsync(true)

                setSound(sound);
    
                sound.playAsync();

                AsyncStorage.setItem("audioLink.", link)
                
                setLink(link)
                
                
                setText('Звуковой файл сейчас проигрывается. Чтобы остановить проигрывание, закройте это приложение, для продолжения - снова его запустите.')


                setFlag(true)
                setWarnCol('#fff')


            }catch(error){

                console.log(error)
                setCol(['#AEAEAE','#fff', '#696969','#009AFF','#fff'])
                setText('Невозможно воспроизвести звуковой файл, обратитесь в поддержку:')
                setWarnCol('red')

            }
            



        }else{

            setCol(['#AEAEAE','#fff', '#696969','#1E5945','#1E5945'])
            setText('Введите ссылку')

        }

    }


    //загрузка из localStorage и отлавливание ошибки в воспроизведении
    React.useEffect(() => {
        AsyncStorage.getItem("audioLink.").then(value => {
            setLink(value + ' ')
        })
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync();
            }
          : undefined;
    }, [sound]);


    //цвета и текст сообщений
    const[col, setCol] = useState(['#1E5945','#1E5945','#1E5945','#1E5945','#1E5945'])
    const[warn_col, setWarnCol] = useState('#fff')
    const[text, setText] = useState('Загрузка')


    //для обновления аудио
    setInterval(function(){
        if (link != '-1' && !flag2){
            flag2 = true
            go()
        }
        
        try {
            if(flag == true){
                sound.playAsync();
            }
        } catch (error) {}
    },1000)


    //для обновления аудио в фоне
    TaskManager.defineTask(BACKGROUND_FETCH_TASK,async () => {
        console.log('background start')
        for(var i = 0; i < 999999999999; i++){
            console.log('updating')
            sound.playAsync();
            sleep(5000)
        }
        return;
    });


    //рендерим
    return (

        <View style={styles.container}>

            <StatusBar style="auto" />

            <Text style={[styles.warn,{color:warn_col}]}>{text}</Text>
            <Text style={[styles.text,{color:col[4]}]}> Телеграм: <Text style={[styles.warn,{color:col[3]}]} onPress={() => {if(col[3] == '#009AFF'){Linking.openURL('https://t.me/mikeai686')}}}>t.me/mikeai686</Text></Text>
            <Text style={[styles.text,{color:col[4]}]}> Email: <Text style={[styles.warn,{color:col[3]}]} onPress={() => {if(col[3] == '#009AFF'){Linking.openURL('mailto:mikeai686@gmail.com')}}}>mikeai686@gmail</Text></Text>

			<TextInput style={[styles.input, {color: col[1], backgroundColor:col[0]}]}
						placeholderTextColor={col[1]}
						placeholder='Ссылка'
                        onChangeText={setLink}
						cursorColor={col[1]}>
			</TextInput>


            <Text style={[styles.button, {backgroundColor: col[2], color: col[1]}]} onPress={go}>Старт</Text>

        </View>

    );
 

}


//стили
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E5945',
        alignItems: 'center',
        justifyContent: 'center',
    },

    warn:{
        fontSize:17,
        width:'90%',
        textAlign:'center'
    },

    link:{
        fontSize:17,
        width:'90%',
        textAlign:'center'
    },

    
    text:{
        fontSize:17,
        width:'90%',
        textAlign:'center',
    },

	input:{

		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		
		width:'70%',
		padding:10,
		marginTop:40,

		borderRadius: 10,
		
		fontSize:17,

	},

    button:{
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width:'40%',
        padding:10,
        marginTop:20,
        fontSize:25,
        backgroundColor: '#575757',
        color:'#fff',
        borderRadius: 20
    }
});



