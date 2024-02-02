import { Alert, Button, StyleSheet, Text, TextInput, View, Dimensions} from "react-native";
import { useState } from "react";
const getScreenSize = () => {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    return{screenWidth: screenWidth, screenHeight: screenHeight};
}

function BadgerRegisterScreen(props) {
    const [myNewUsername, setMyNewUsername] = useState();
    const [myNewPassword, setMyNewPassword] = useState();
    const [myRepPassword, setMyRepPassword] = useState();
    
    return <View style={styles.container}>
        <Text style={styles.pageTitle}>Join BadgerChat!</Text>
        <Text style={styles.commonText}>Username</Text>
        <TextInput
        style={styles.textInput} 
        value={myNewUsername}
        onChangeText={text => setMyNewUsername(text)}
        ></TextInput>
        <Text style={styles.commonText}>Password</Text>
        <TextInput
        style={styles.textInput} 
        secureTextEntry={true}
        value={myNewPassword}
        onChangeText={text => setMyNewPassword(text)}
        ></TextInput>
        <Text style={{ fontSize: getScreenSize().screenHeight/40 }}>Confirm Password</Text>
        <TextInput
        style={styles.textInput} 
        secureTextEntry={true}
        value={myRepPassword}
        onChangeText={text => setMyRepPassword(text)}
        ></TextInput>
        <Text style={{ fontSize: getScreenSize().screenHeight/40, color:"red" }}>{myNewPassword?myNewPassword===myRepPassword?"":"Passwords do not match":"Please enter a password"}</Text>
        <Button color="crimson" title="Signup" disabled={!(myNewPassword&&myRepPassword&&myNewPassword===myRepPassword)} onPress={() => props.handleSignup(myNewUsername,myNewPassword)} />
        <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;