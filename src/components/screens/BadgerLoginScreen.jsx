import { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, Dimensions } from "react-native";

const getScreenSize = () => {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    return{screenWidth: screenWidth, screenHeight: screenHeight};
}

function BadgerLoginScreen(props) {
    const [myUsername, setMyUsername] = useState();
    const [myPassword, setMyPassword] = useState();
    return <View style={styles.container}>
        <Text style={styles.pageTitle}>BadgerChat Login</Text>
        <Text style={styles.commonText}>Username</Text>
        <TextInput
        style={styles.textInput} 
        value={myUsername}
        onChangeText={text => setMyUsername(text)}
        ></TextInput>
        <Text style={styles.commonText}>Password</Text>
        <TextInput
        style={styles.textInput} 
        secureTextEntry={true}
        value={myPassword}
        onChangeText={text => setMyPassword(text)}
        ></TextInput>
        <Button color="crimson" title="Login" onPress={() => {
            //Alert.alert("Hmmm...", "I should check the user's credentials first!");
            props.handleLogin(myUsername, myPassword)
        }} />
        <Text style={{ fontSize: getScreenSize().screenHeight/40, margin:getScreenSize().screenHeight/40}}>New Here?</Text>
        <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
        <Button color="grey" title="CONTINUE AS GUEST" onPress={() => props.setIsGuest(true)} />
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageTitle:{
        fontSize: getScreenSize().screenHeight/20,
    },
    commonText:{
        fontSize: getScreenSize().screenHeight/40,
    },
    textInput: {
        height: getScreenSize().screenHeight/20,
        width: getScreenSize().screenWidth/1.5,
        borderColor: 'gray',
        borderWidth: getScreenSize().screenWidth/200,
        padding: getScreenSize().screenWidth/100,
        margin: getScreenSize().screenWidth/75,
      }
});

export default BadgerLoginScreen;