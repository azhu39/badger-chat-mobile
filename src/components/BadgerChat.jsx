import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';
import { Alert } from 'react-native';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const [curr, setCurr] = useState("");
  useEffect(() => {
    fetch('https://cs571.org/api/f23/hw9/chatrooms', {
      method: "GET",
      headers: {
        "X-CS571-ID": CS571.getBadgerId(),
      }
    })
    .then(res => res.json())
    .then(data => {
      setChatrooms(data)
    })
  }, []);

  function handleLogin(username, password) {
    // hmm... maybe this is helpful!
    fetch(`https://cs571.org/api/f23/hw9/login`,{
      method: "POST",
      headers:{
        "X-CS571-ID": CS571.getBadgerId(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "username": username,
        "password": password
      })
    })
    .then(async (res) => {
      if (res.status === 200) {
        const data = await res.json();
        if (data.token) {
          Alert.alert("Login Successful", "Success!");
          await SecureStore.setItemAsync("token", data.token);
          setCurr(data.user.username);
          //console.log(data.user.username);
          setIsLoggedIn(true);
        } else {
          Alert.alert("Incorrect login", "Please try again!");
        }
      }  else {
        Alert.alert("Incorrect login", "Please try again!");
      }
    })
  }

  function handleSignup(myNewUsername, myNewPassword) {
    
      fetch(`https://cs571.org/api/f23/hw9/register`,{
        method: "POST",
        headers:{
          "X-CS571-ID": CS571.getBadgerId(),
          "Content-Type": "application/json"
        },
        body:JSON.stringify({
          "username": myNewUsername,
          "password": myNewPassword
        })
      })
      .then(async (res) =>{
        if(res.status===200)
        {
          const data = await res.json();
          if(data.token)
          {
            Alert.alert("Signup Successful","Success!");
            await SecureStore.setItemAsync("token",data.token);
            setCurr(data.user.username);
            setIsLoggedIn(true);
          } 
        } else if( res.status===409)
        {
            Alert.alert("Signup failed","This account already exists");
        } else
        {
          Alert.alert("Signup failed","Your username must be 64 characters or fewer and password must be 128 characters or fewer.");
        } 
      })
  }

  const logoutAcc = () => {
    SecureStore.deleteItemAsync("token");
    setCurr("");
    Alert.alert("Logged Out","Successfully logged out!")
    setIsLoggedIn(false);
  }

  if (isLoggedIn||isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} curr={curr}/>}
              </ChatDrawer.Screen>
            })
          }
          {isLoggedIn && (
          <ChatDrawer.Screen name="Logout" options={{drawerItemStyle:{backgroundColor:"crimson"}}}>
            {(props) => <BadgerLogoutScreen logout={logoutAcc} />}
          </ChatDrawer.Screen>
          )}
          {isGuest && (
          <ChatDrawer.Screen name="Signup" options={{drawerItemStyle:{backgroundColor:"crimson"}}}>
            {(props) => <BadgerConversionScreen setIsRegistering={setIsRegistering} setIsGuest={setIsGuest}/>}
          </ChatDrawer.Screen>
          )}
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} setIsGuest={setIsGuest}/>
  }
}