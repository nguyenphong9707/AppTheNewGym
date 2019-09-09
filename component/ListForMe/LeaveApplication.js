import React, { PureComponent } from 'react'
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
import {connect} from 'react-redux';
import LeaveList from './LeaveList';
import Spinner from 'react-native-spinkit';


class LeaveApplication extends PureComponent {
    constructor(props){
        super(props);
        this.state=({
            id_user:'',
            Token:'',
            mang:[],
            Loading:true,
        })
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem('Token');
        if (token) {
            this.setState({ Token: token });
            fetch("http://hr.thenewgym.vn/api/leave_form/" + this.props.MyId + "?token=" + token,{
            method: "GET",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({
                    mang: res.leave_form.reverse(), 
                    Loading:false,})
            })
            .catch((error)=>{
                console.log('loi')
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
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={{flex:0.2,paddingLeft:10}}
                        onPress={()=> {this.props.navigation.openDrawer()}}>

                        <Icon name="bars" size={20} color='black'/>
                    </TouchableOpacity>
                    <View style={{flex:0.6, justifyContent:'center', alignItems:'center'}}>
                    <Image style={{width:100, height:46}} source={require('../img/logo.png')}/>
                    </View>
                    <TouchableOpacity
                        style={{flex:0.2, alignItems:'flex-end', marginRight:10}}
                        onPress={this._logout}
                    >
                        <Icon name="sign-out" size={20} color='black'/>
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>
                        {
                        this.state.Loading ? <Spinner color={'#05a9d7'} size={40} type={'9CubeGrid'}/>
                        :
                        <LeaveList
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

export default connect(StatetoProps)(LeaveApplication);

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
});
