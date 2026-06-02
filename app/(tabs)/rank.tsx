import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, TouchableOpacity } from "react-native";
import {Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient"
interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  pontuacao: number;
  foto: string;
}
export default function Rank() {
    const [dataUsers,setDataUsers] = useState<User[]>([])
    const router = useRouter();
    const getUsers = () => {
      console.log('abriu')
      console.log(process.env.EXPO_PUBLIC_API_URL)
      fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/usuario`)
          .then(response => response.json())
          .then(json => {
            console.log('deu certo')
            setDataUsers(json)
          })
          .catch(error => {
            console.log("Error fetching users:", error);
          });
          
    }
    
    useEffect(()=>{
      getUsers()
    },[])
    
    return (
      <LinearGradient
    colors={['#003D8C', '#003D8C','#005498', '#0076C0','#0076C0']}   // azul escuro → azul
    style={styles.container}
  >

      <SafeAreaView style={styles.safeArea}>
          
          <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={dataUsers}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.users}
              onPress={() => {
                router.navigate({
                  pathname: '../(userTabs)/userProfile',
                  params: {
                    id: item.id,
                  },
                });
              }}
            >
              {item.foto ? (
                <Image source={{ uri: item.foto }} style={styles.imgUser} />
              ) : (
                <Image source={require("../../assets/images/icon.png")} style={styles.imgUser} />
              )}

              <View style={styles.userInfo}>
                {item.email.length < 20 ? (
                  <Text style={styles.valoresTextoUserEmail}>{item.email}</Text>
                ) : (
                  <Text style={styles.valoresTextoUserEmail}>{item.email.slice(0, 20)}...</Text>
                )}
                <Text style={styles.valoresTextoUserNome}>{item.nome}</Text>
              </View>
            </TouchableOpacity>
          )}
          
        />
      </SafeAreaView>
  </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    height:"100%",
    width:"100%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeArea:{
    flex: 1,              
    width: '100%',
    alignItems: 'center'
  },
  list:{
    width: '80%',        
    maxHeight: '100%', 
    position: 'relative',
    bottom: 20,     
    alignSelf: 'center',
   
  },
  listContent:{
    alignItems: 'center',
    paddingVertical: 10,
    gap: 20

  },
  users:{
    alignItems: 'center',
    backgroundColor: '#d5faff',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    borderRadius: 30,
    flexDirection: 'row',
    marginVertical: 6
  },
  imgUser:{
    height: 60,
    width: 60,
    borderRadius: 30
  },
  userInfo:{
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center'
  },
  valoresTextoUserNome:{
    fontSize:18,
    fontWeight: 'bold'
  },
  valoresTextoUserEmail:{
    fontSize:14
  }
});