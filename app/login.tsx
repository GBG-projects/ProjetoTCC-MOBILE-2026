

import {Redirect, useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Login(){
  const [User, newUser] = useState('');
  const [Password, newPassword] = useState('');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin(){
    if (!User || !Password) {
    alert("Preencha todos os campos!");
    return;
  }
    console.log("Login feito")
  }

  
      const style = {
        cadastro:{
          color: "#0046d2",
                  fontWeight: "bold",
                  textDecorationLine: "underline",
        }
      }
    return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor:"#26328c"
          }}
        > 
          <View style={{
            backgroundColor:"#5c76d5",
            width:'80%',
            height:"45%",
            borderRadius:20,
            justifyContent:"center",
            alignItems:"center"
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 30, textAlign: "center", position:"relative", top:33}}>
                Focus Flow
              </Text>
          </View>
            <View style={{flex:2, justifyContent:"center", alignItems:"center", position:"relative", bottom:40, gap:20}}>

            <View >
            
              <Text>Usuario</Text>
              <TextInput   value={User} 
              onChangeText={text => newUser(text)}
              placeholder="Insira seu usuario"
              style={
                {
                  flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#dd9393",
                borderRadius: 10,
                paddingHorizontal: 10,
                width: 200,
                height: 50
                
                }
              }></TextInput>
              </View>
            <View>
    
              <Text>Senha</Text>
              <View style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#dd9393",
                borderRadius: 10,
                paddingHorizontal: 10,
                width: 200,
                height: 50
              }}>
                            
              <TextInput
                value={Password}
                onChangeText={newPassword}
                placeholder="Insira sua senha"
                secureTextEntry={!showPassword}
                style={{
                  flex: 1
                }}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="black"
                />
              </TouchableOpacity>

            </View>
            </View>
              <Button title="Entrar" onPress={handleLogin}></Button>
            </View>
            <View style={{width:"100%", justifyContent:"flex-end", position:"relative", right:10, flexDirection:"row"}}>
              <Text>Não tem cadastro ainda?</Text>

            <TouchableOpacity onPress={() => router.navigate("/cadastro")}>
              <Text style={{
                color: "#0046d2",
                  fontWeight: "bold",
                  textDecorationLine: "underline",
              }}>Cadastro</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      );

}