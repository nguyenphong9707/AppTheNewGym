import React, { PureComponent } from 'react'
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    TouchableOpacity,
    Image,
    TextInput,
    Dimensions,
    Keyboard,
    Alert,
    Picker
} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment"
import 'moment/min/moment-with-locales'
import Spinner from 'react-native-spinkit'
import { Dropdown } from 'react-native-material-dropdown';

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
class Leave extends PureComponent {
    constructor(props){
        super(props);
        this.state=({
            Token:'',
            Loading:false,
            mangUser:[],
            UserPicker:[],
            dataPicker : [],
            name:'...',
            lido:'...',
            ngaybd:null,
            ShowDayBDVisible: false,
            ngaykt:null,
            ShowDayKTVisible: false,
        })
    }

    Load_Member(token){
        fetch("http://hr.thenewgym.vn/api/member?token=" + token,{
            method: "GET",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                const name = res.users.map(w=>{
                    return {value : w.name}
                })
                this.setState({
                    UserPicker:name,
                    mangUser:res.users
                 })
            })
            .catch((error)=>{
                console.log('loi')
            })
    }

    async componentDidMount(){
        const token = await AsyncStorage.getItem('Token');
        if(token){
            this.setState({ Token:token })
            fetch("http://hr.thenewgym.vn/api/leave_type?token=" + token,{
            method: "GET",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.Load_Member(token)
                const a = res.leave_type.map(w=>{
                    return {value: w}
                })
                this.setState({dataPicker : a})
                
            })
            .catch((error)=>{
                console.log(error)
            })
        }else{
            this.setState({
                Token:''
            })
        }
    }
    _logout =async ()=>{
        await AsyncStorage.setItem('isLoggedIn','0');
        this.props.navigation.navigate('LogInScreen')
    }

    _showDatebd = () => {
        this.setState({ ShowDayBDVisible: true });
    }

    _showDateBDConfirm = (date) => {
        moment.locale('vi')
        this.setState({ 
            ngaybd : moment(date).format().substring(0,10),
            ShowDayBDVisible:false
        })
        
    }

    _showDatekt = () => {
        this.setState({ ShowDayKTVisible: true });
    }

    _showDateKTConfirm = (date) => {
        moment.locale('vi')
        this.setState({ 
            ngaykt : moment(date).format().substring(0,10),
            ShowDayKTVisible:false
        })
        
    }

    hideDateTimePicker=()=>{
        this.setState({
            ShowDayBDVisible: false,
            ShowDayKTVisible: false
        })
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
                    <View style={{flex:1}}>
                        <Text style={{textAlign:'center', color:'#555859', fontSize:25, marginTop:20, fontWeight: 'bold'}}>Đơn nghỉ phép</Text>
                        
                    </View>

                    <View style={{flex:8, alignItems:'center', paddingTop:30}}>
                    <View style={{flexDirection:'row'}}>
                        <View>
                        <Text>Từ Ngày:</Text>
                            <TouchableOpacity
                                onPress={this._showDatebd}
                            >
                                <TextInput
                                style={{...styles.TextInputTime, marginTop:5}}
                                placeholder={'2019-01-01'}
                                placeholderTextColor={'gray'}
                                onChangeText={(ngaybd) => this.setState({ngaybd})}
                                value={this.state.ngaybd}
                                autoCapitalize="none"
                                editable={false}
                            />
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.ShowDayBDVisible}
                                onConfirm={this._showDateBDConfirm}
                                onCancel={this.hideDateTimePicker}
                                mode={'date'}
                                />
                        </View>

                        <View style={{marginLeft:30}}>
                        <Text>Đến Ngày:</Text>
                            <TouchableOpacity
                                onPress={this._showDatekt}
                            >
                                <TextInput
                                style={{...styles.TextInputTime, marginTop:5}}
                                placeholder={'2019-01-01'}
                                placeholderTextColor={'gray'}
                                onChangeText={(ngaykt) => this.setState({ngaykt})}
                                value={this.state.ngaykt}
                                autoCapitalize="none"
                                editable={false}
                            />
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.ShowDayKTVisible}
                                onConfirm={this._showDateKTConfirm}
                                onCancel={this.hideDateTimePicker}
                                mode={'date'}
                                />
                        </View>
                        </View>

                        <View>
                            <Text>Người Thay Thế:</Text>
                        </View>
                    </View> 
                    <Text>{this.state.reason}</Text>
                </View>
                </View>
        );
    }
}
export default Leave;

const styles = StyleSheet.create({
    container: {
        flex: 10,
    },
    header:{
        height:52.5,
        flexDirection:'row', 
        backgroundColor:'white', 
        alignItems:'center', 
        borderBottomWidth:1, 
        borderBottomColor:'#05a9d7'
    },
    body:{
        flex:9, 
        backgroundColor:'#d7f6fe'
    },
    TextInputTime:{

        width:width - 220,
        color:'black',
        borderBottomWidth:1,
        borderBottomColor:'#05a9d7',
        backgroundColor:'rgba(255, 255, 255, 1)',
        borderRadius:10,
        paddingLeft:20,
    },
});

 {/* <Dropdown
                        containerStyle={{width : width * 0.9 , height : width * 0.1 , borderRadius : 5 , borderWidth : 1 , paddingLeft : width * 0.02, alignSelf: 'center'}}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        dropdownOffset={{top: width * 0.01, left : 0}}
                        data={this.state.dataPicker}
                        value={this.state.lido}
                        onChangeText={text => this.setState({lido:text})}/>

                        <Dropdown
                        containerStyle={{width : width * 0.9 , height : width * 0.1 , borderRadius : 5 , borderWidth : 1 , paddingLeft : width * 0.02, alignSelf: 'center'}}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        dropdownOffset={{top: width * 0.01, left : 0}}
                        data={this.state.UserPicker}
                        value={this.state.name}
                        onChangeText={text => this.setState({name:text})}/> */}