import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    TouchableOpacity,
    Image,
    Platform
} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
import MyList from "./ListForMe/MyList"
import Members from "./Members/Members";
import Spinner from 'react-native-spinkit';
import LeaveApplication from "./ListForMe/LeaveApplication";
import {connect} from 'react-redux';

class HomeScreen extends Component {
    
    static navigationOptions = {
        title: 'Home',
        header: null,
    }

    constructor(props){
        super(props);
        this.state=({
            id_user:'',
            Token:'',
            mang:[],
            Loading:true,
            letter:14,
            letterApprove:23
        })
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem('Token');
        if (token) {
            this.setState({ Token: token });
            fetch("http://hr.thenewgym.vn/api/work_form/" + this.props.MyId + "?token=" + token,{
            method: "GET",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                a = 0
                b = 0
                res.work_form.map(w=>{
                    return w.approve == 0 ? a++ : a
                })
                res.work_form.map(w=>{
                    return w.approve == 1 ? b++ : b
                })
                this.setState({
                    mang:res.work_form.reverse(),
                    Loading:false,
                    letter:a,
                    letterApprove:b
                })
            })
            .catch((error)=>{
                console.log(error)
            })

        }else{
            this.setState({ Token: '' });
            alert('Phiên bản đăng nhập đã hết hạn.')
        }
    }

    _logout =async ()=>{
        await AsyncStorage.setItem('isLoggedIn','0');
        this.props.navigation.navigate('LogInScreen')
    }


    render() {
        <LeaveApplication userid={'asd'}/>
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{flex:0.2,paddingLeft:10}}
                        onPress={()=> {this.props.navigation.openDrawer()}}>

                        <Icon name="bars" size={20} color='black'/>
                    </TouchableOpacity>
                    <View style={{flex:0.6, justifyContent:'center', alignItems:'center'}}>
                    <Image style={{width:100, height:46}} source={require('./img/logo.png')}/>
                    </View>
                    <TouchableOpacity
                        style={{flex:0.2, alignItems:'flex-end', marginRight:10}}
                        onPress={this._logout}
                    >
                        <Icon name="sign-out" size={20} color='black'/>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, flexDirection:'row', alignItems:'center', backgroundColor:'#d7f6fe'}}>
                    <View style={{flex:0.5, justifyContent:'center', alignItems:'center', zIndex: 0}}>
                        <View style={styles.notification}><Text style={{color:'white', fontSize:10}}>{this.state.letter}</Text></View>
                        <View style={{}}><Text><Icons name="ios-mail" size={32} color='black'/></Text></View>
                    </View>
                    <View style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
                        <View style={styles.notification}><Text style={{color:'white', fontSize:10}}>{this.state.letterApprove}</Text></View>
                        <Text><Icons name="ios-checkmark-circle" size={30} color='green'/></Text>
                    </View>
                </View>
                <View style={styles.body}>
                    {
                        this.state.Loading ? <Spinner color={'#05a9d7'} size={40} type={'9CubeGrid'}/>
                        :
                        <MyList
                            id_user = {this.props.MyId}
                            Token = {this.state.Token}
                            Listmang = {this.state.mang}
                        />
                    }
                </View>

            </View>
        );
    }
}

StatetoProps = (state) => {
    return {
        MyId : state.UserID
    }
}
export default connect(StatetoProps)(HomeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 10,
    },
    header:{
        flex:1,
        flexDirection:'row',
        backgroundColor:'white',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#05a9d7',
        marginTop: Platform.OS === 'ios' ? 30 : 0,
    },
    body:{
        flex:8,
        backgroundColor:'#d7f6fe',
        alignItems:'center',
        justifyContent:'center'

    },
    notification:{
        backgroundColor:'red',
        width: 15,
        height: 15,
        borderRadius: 50,
        borderColor: '#ccc',
        alignItems:'center',
        justifyContent:'center',
        elevation: 8,
        marginBottom: -14,
        marginLeft:23,
        zIndex: 12
    }
});
