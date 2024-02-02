import { Alert, Button, StyleSheet, Text, View } from "react-native";

function BadgerConversionScreen(props) {
    const toSignup = () => {
        props.setIsGuest(false);
        props.setIsRegistering(true);
    }
    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Ready to signup?</Text>
        <Text>Join BadgerChat to be able to make posts!</Text>
        <Text/>
        <Button title="Signup!" color="darkred" onPress={toSignup}/>

    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default BadgerConversionScreen;