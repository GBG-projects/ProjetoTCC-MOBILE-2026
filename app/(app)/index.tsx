// app/index.tsx
import { Redirect } from 'expo-router';
import { View,Text,TextInput } from 'react-native';

export default function Index() {
  
  return(
    <View>
        
                  <Text style={
                    {
                      fontSize:23,
                      textAlign:"center"
                    }
                  }>Sen  rrrha</Text>
                  <TextInput placeholder="insira um usuario" 
                  style={
                    {
                      backgroundColor:"#dd9393",
                      height:50,
                      width:"60%"
                    
                    }
                  }></TextInput>
                </View>
  )


}