import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    Dimensions
} from "react-native";


const width = Dimensions.get('window').width;
class LogInScreen extends Component{
    static navigationOptions={
        header:null
    }
    constructor (props){
        super(props);
        this.state={
            UserName:'',
            PassWord:'',
            kq:'',
            token:''
        }
    }
    
    Login(){
        var params = {
            username: this.state.UserName,
            password: this.state.PassWord,
        };
        
        var formData = new FormData();
        
        for (var k in params) {
            formData.append(k, params[k]);
        }
 
        fetch("http://hr.thenewgym.vn/api/login",{
            method: "POST",
            header:{
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        })
        .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
        .then((res)=>{
            if(res.success == true){
                this.setState({
                    UserName: '',
                    PassWord: '',
                    kq:'',
                    token:res.token
                })
                this._SaveLoading();
                this._SaveToken(this.state.token);
                this.props.navigation.navigate('LoadingHome',{Token:this.state.token})
            }else{
                this.setState({
                    kq:res.message,
                    PassWord: ''
                })
            }
        })
        .catch((error)=>{
            console.log('loi')
        })
    }

    _SaveLoading = async ()=>{
        await AsyncStorage.setItem('isLoggedIn','1');
    }

    _SaveToken = async (token)=>{
        await AsyncStorage.setItem('Token', token);
    }

    render() {
        return (
            <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#d7f6fe'}}>
                <Image style={{marginBottom:30}} source={require('./img/logo.png')}/>
                <TextInput
                    style={styles.TextInput}
                    placeholder={'Nhập tài khoản..'}
                    placeholderTextColor={'gray'}
                    onChangeText={(UserName) => this.setState({UserName})}
                    value={this.state.UserName}
                    autoCapitalize="none"
                />
                <TextInput
                    style={{...styles.TextInput, marginTop:10}}
                    placeholder={'Nhập mật khẩu..'}
                    placeholderTextColor={'gray'}
                    secureTextEntry={true}
                    onChangeText={(PassWord) => this.setState({PassWord})}
                    value={this.state.PassWord}
                    autoCapitalize="none"
                />
                <Text style={{color:'red', marginTop:15}}>{this.state.kq}</Text> 
                <TouchableOpacity
                    onPress={()=>{this.Login()}}
                    style={styles.loginbtn}
                >
                <Text style={{color:'white', textAlign:'center', fontWeight: 'bold'}}>Đăng Nhập</Text>
                </TouchableOpacity>                    
            </View>
        );
    }
}


export default LogInScreen;

const styles = StyleSheet.create({
    TextInput:{
        width:width - 70,
        color:'black',
        borderBottomWidth:2,
        borderBottomColor:'rgba(5, 169, 215, 0.7)',
        borderRadius:15,
        paddingLeft:20,
    },
    loginbtn:{
        backgroundColor:'rgba(5, 169, 215, 0.7)',
        width:200,
        height:40,
        // borderWidth:2,
        // borderColor:'#05a9d7',
        justifyContent:'center',
        marginTop:20,
        borderRadius:15
    }
});
