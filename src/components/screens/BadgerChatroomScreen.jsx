import { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions, Button, Modal, TextInput, Alert } from "react-native";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import CS571 from '@cs571/mobile-client';
import * as SecureStore from 'expo-secure-store';
const getScreenSize = () => {
    const screenWidth = Math.round(Dimensions.get('window').width);
    const screenHeight = Math.round(Dimensions.get('window').height);
    return{screenWidth: screenWidth, screenHeight: screenHeight};
}

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [modalVisible, setModalVisible] = useState(false);
    const [myTitle, setMyTitle] = useState();
    const [myBody, setMyBody] = useState();
    const loadMessages = () => {
        fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}&page=${activePage}`,{
            method: "GET",
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            setMessages(data.messages);
        })
    }
    const createPost = async() => {
        const token = await SecureStore.getItemAsync("token")
            fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}`,{
                method: "POST",
                headers:{
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body:JSON.stringify({
                    "title":myTitle,
                    "content":myBody
                })
            })
            .then(res => res.json())
            .then(data => {
                if(data.id)
                {
                    Alert.alert("Successfully posted!","Successfully posted!");
                    setModalVisible(false);
                    setActivePage(1);
                    loadMessages();
                } else {
                    Alert.alert("Failed to post your message",data.msg)
                }
            })
    }

    const deletePost = async(currId) => {
        const token = await SecureStore.getItemAsync("token");
        
        fetch(`https://cs571.org/api/f23/hw9/messages?id=${currId}`,{
            method: "DELETE",
            headers:{
                "X-CS571-ID": CS571.getBadgerId(),
                "Authorization": `Bearer ${token}`
            }
        })
        .then(async res => {
            const data = await res.json();
            if(res.status===200)
            {
                Alert.alert("Alert","Successfully deleted the post!");
                loadMessages();
            } else {
                Alert.alert("Error",data.msg)
            }
        })
        
    }

    const getUsername = async() => {
        const username = await SecureStore.getItemAsync("username");
        return username;
    }

    useEffect(loadMessages,[props,activePage]);
    function addPost() {
        setModalVisible(true);
    }
    return <View style={{ flex: 1 }}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Cancel","You discard this draft.");
              setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.modalContainer}>
            <Text style={styles.pageTitle}>Create A Post</Text>
            <Text style={styles.commonText}>Title</Text>
            <TextInput
            style={styles.textInput} 
            value={myTitle}
            onChangeText={text => setMyTitle(text)}
            ></TextInput>
            <Text style={styles.commonText}>Body</Text>
            <TextInput
            style={styles.textInputBody}
            value={myBody}
            onChangeText={text => setMyBody(text)}
            ></TextInput>
                <View style={styles.buttonContainer}>
                    <Button title="CREATE POST" color="grey" disabled={!(myTitle&&myBody)} onPress={createPost}></Button>
                    <Button title="CANCEL" color="grey" onPress={()=> setModalVisible(false)}></Button>
                </View>
                
            </View>
        </Modal>
        <ScrollView>
            {messages.length!==0?
            messages.map(item => <BadgerChatMessage key={item.id} {...item} delete={deletePost} curr={props.curr}>
            </BadgerChatMessage>)
            :<Text
             style={[styles.pageTitle,{marginVertical:getScreenSize().screenHeight/5}]}>
                There's nothing here!
            </Text>}
        </ScrollView>
        <Text style={styles.commonText}>You are on the page {activePage} of 4.</Text>
        <View style={styles.buttonContainer}>
            <View style={{width:"50%"}}>
                <Button title="PREVIOUS PAGE" disabled={activePage===1} onPress={() => setActivePage(activePage-1)}></Button>
            </View>
            <View style={{width:"50%"}}>
                <Button title="NEXT PAGE" disabled={activePage===4} onPress={() => setActivePage(activePage+1)}></Button>
            </View>
        </View>
        {props.curr &&<Button title="ADD POST" color="darkred" onPress={addPost}></Button>}
    </View>
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width:'100%' 
      },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        marginVertical: getScreenSize().screenHeight/12,
        marginHorizontal: getScreenSize().screenWidth/20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: getScreenSize().screenHeight/15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: getScreenSize().screenHeight/200,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    pageTitle:{
        fontSize: getScreenSize().screenHeight/20,
        textAlign: "center",
    },
    commonText:{
        fontSize: getScreenSize().screenHeight/40,
        textAlign: "center",
    },
    textInput: {
        height: getScreenSize().screenHeight/20,
        width: getScreenSize().screenWidth/1.5,
        borderColor: 'gray',
        borderWidth: getScreenSize().screenWidth/200,
        padding: getScreenSize().screenWidth/100,
        margin: getScreenSize().screenWidth/75,
      },
    textInputBody: {
        height: getScreenSize().screenHeight/10,
        width: getScreenSize().screenWidth/1.5,
        borderColor: 'gray',
        borderWidth: getScreenSize().screenWidth/200,
        padding: getScreenSize().screenWidth/100,
        margin: getScreenSize().screenWidth/75,
      }
});

export default BadgerChatroomScreen;