'use client'
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ContinueButton from "./components/ContinueButton";
import * as Linking from 'expo-linking'


export default function forgetPassword(){
    const [email, setEmail] = useState("");

    const handleForgetPassword = async() => {
        if(!email){
            Alert.alert("Email vazio")
        }
        try{
            console.log('enviou1')

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/notification/restorePassword`,{
                method:"POST",
                headers: {
                    'Content-Type': 'application/json', // Tell the server you're sending JSON
                },
                body: JSON.stringify({email:email})
            })
            
            console.log('enviou2')
        }catch(error){
            console.error("error: ", error)
            console.log('enviou 3')
        }
    }
    

        return(
            <LinearGradient
                colors={['#003D8C', '#003D8C','#005498', '#0076C0','#0076C0']}
                style={styles.container}
            >   
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                            <Image
                              source={require("../assets/images/focusIcon.png")}
                              style={styles.image}
                            />
                          </View>
                    <View style={{alignItems:"center"}}>

                        <Text style={styles.Text}>Digite seu email</Text>
                        <View style={styles.inputContainer}>
                        <Ionicons name="mail" size={24} color="#26328c" />
                        <TextInput
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            style={styles.input}
                        />
                        </View>
                    </View>
                    <ContinueButton onPress={handleForgetPassword} />
                </View>
                <TouchableOpacity onPress={() => Linking.openURL('focusflow://RedefinePassword?token=teste123')}>
                    <Text>Testar deep link</Text>
                </TouchableOpacity>
            </LinearGradient>
        )
    
    
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        height:"100%",
        width:"100%",
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30
  
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#26328c",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#84b7ff",
        borderRadius: 12,
        paddingHorizontal: 15,
        width: "80%",
        height: 55,
        gap: 10,
    },
    ContinueButton: {
    backgroundColor: "#0046d2",
    width: "50%",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  imageContainer: {
    marginBottom: 30,
    position: "relative",
    bottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  Text:{
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20
  }
})