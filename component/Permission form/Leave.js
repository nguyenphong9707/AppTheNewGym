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
    Picker,
    KeyboardAvoidingView,
    Platform
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
            name:'',
            lido:'',
            ngaybd:null,
            ShowDayBDVisible: false,
            ngaykt:null,
            ShowDayKTVisible: false,
            noidungldk:'',
            disableddrop:false,
            checkTimebd:null,
            checkTimekt:null,
            id_member:0,
            LoadingPage:true
        })
        this._btnreset = this._btnreset.bind(this)
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
                this.setState({dataPicker : a, LoadingPage:false})

            })
            .catch((error)=>{
                console.log(error)
            })
        }else{
            Alert.alert(
                'Thông báo',
                'Phiên bản đăng nhập đã hết hạn.'
            )
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
            checkTimebd: date,
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
            checkTimekt: date,
            ShowDayKTVisible:false
        })

    }

    hideDateTimePicker=()=>{
        this.setState({
            ShowDayBDVisible: false,
            ShowDayKTVisible: false
        })
    }
    _changtext(text){
        this.setState({
            noidungldk: text,
            lido:'',
            disableddrop: true
        })
    }

    _btnreset = () => {
        this.setState({
            disableddrop: false,
            ngaybd:null,
            ngaykt:null,
            noidungldk:null,
            name:'',
            lido:''
        })
    }

    _changeName = (text) => {
        if(text.length > 0){
            this.state.mangUser.map(w => {
                if(w.name == text){this.setState({ id_member : w.id, name : text})}
                return null
            })
        }else{
            this.setState({ id_member : 0})
        }
    }

    _btnsend = () => {

        if(this.state.ngaybd === null || this.state.ngaykt === null || this.state.lido + this.state.noidungldk === ''){
            Alert.alert(
                'Thông báo',
                'Vui lòng điền đầy đủ thông tin.'
            )
        }else if(this.state.checkTimebd > this.state.checkTimekt){
            Alert.alert(
                'Thông báo',
                'Thời gian không hợp lệ.'
            )
        }else{
            var params = {
                Start_date: this.state.ngaybd,
                End_date:this.state.ngaykt,
                Leave_type:this.state.lido + this.state.noidungldk,
                Id_replace:this.state.id_member
            };
            var formData = new FormData();
            for (var k in params) {
                formData.append(k, params[k]);
            }
            this.setState({Loading:true})
            fetch("http://hr.thenewgym.vn/api/save_lf?token=" + this.state.Token,{
            method: "POST",
            header:{
                'Content-Type': 'application/x-www-form-urlencoded;',
            },
            body: formData
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this._btnreset()
                this.setState({
                    Loading:false
                })
                Alert.alert(
                    'Thông báo',
                    res.message
                )
            })
            .catch((error)=>{
                console.log('loi')
            })
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
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
                {this.state.LoadingPage ? <Spinner color={'#05a9d7'} size={40} type={'9CubeGrid'}/> :
                    <View style={{flex:9}}>
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

                        <View style={{marginTop:20}}>
                            <Text>Người Thay Thế:</Text>
                            <Dropdown
                        containerStyle={styles.Dropdown}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        dropdownOffset={{top: width * 0.01, left : 0}}
                        data={this.state.UserPicker}
                        value={this.state.name}
                        onChangeText={text => this._changeName(text)}/>
                        </View>

                        <View style={{marginTop:20}}>
                            <Text>Lí do:</Text>
                            <Dropdown
                        containerStyle={styles.Dropdown}
                        inputContainerStyle={{ borderBottomColor: 'transparent' }}
                        dropdownOffset={{top: width * 0.01, left : 0}}
                        data={this.state.dataPicker}
                        value={this.state.lido}
                        disabled={this.state.disableddrop}
                        onChangeText={text => this.setState({lido:text})}/>
                            <TextInput
                                    style={{...styles.TextInputContent, marginTop:5}}
                                    multiline={true}
                                    placeholder={'Lí do khác...'}
                                    placeholderTextColor={'gray'}
                                    onChangeText={(noidungldk) => this._changtext(noidungldk)}
                                    value={this.state.noidungldk}
                                    onSubmitEditing={Keyboard.dismiss}
                                />
                        </View>
                        <View>
                        {
                            this.state.Loading ? <Spinner style={{marginTop:30}} color={'#05a9d7'} size={25} type={'Circle'}/> :
                            <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={styles.btn} onPress={this._btnreset}><Text style={{color:'white'}}>Reset</Text></TouchableOpacity>
                            <TouchableOpacity style={{...styles.btn, marginLeft:5}} onPress={this._btnsend}><Text style={{color:'white'}}>Gửi</Text></TouchableOpacity>
                        </View>
                            }
                        </View>
                    </View>
                    </View>
                }
                </View>
                </KeyboardAvoidingView>
        );
    }
}
export default Leave;

const styles = StyleSheet.create({
    container: {
        flex: 10,
    },
    header:{
        marginTop:Platform.OS === 'ios' ? 30 : 0,
        height:Platform.OS === 'ios' ? 70.05 : 52.5,
        flexDirection:'row',
        backgroundColor:'white',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#05a9d7'
    },
    body:{
        flex:9,
        backgroundColor:'#d7f6fe',
        justifyContent:'center',
        alignItems:'center'
    },
    TextInputTime:{
        height:Platform.OS === 'ios' ? 45: 0,
        width:width - 225,
        color:'black',
        borderBottomWidth:1,
        borderBottomColor:'#05a9d7',
        backgroundColor:'rgba(255, 255, 255, 1)',
        borderRadius:10,
        paddingLeft:20,
    },
    Dropdown:{
        width : width * 0.86,
        height : width * 0.118 ,
        borderBottomWidth:1,
        borderBottomColor:'#05a9d7',
        backgroundColor:'rgba(255, 255, 255, 1)',
        borderRadius:10,
        paddingLeft : width * 0.05,
        paddingTop : width * 0.01,
        marginTop:5
    },
    TextInputContent:{
        width:width * 0.86,
        height:100,
        color:'black',
        borderBottomWidth:2,
        borderBottomColor:'#05a9d7',
        backgroundColor:'rgba(255, 255, 255, 1)',
        borderRadius:10,
        textAlignVertical:'top',
        marginTop:10,
        paddingLeft:Platform.OS === 'ios' ? 10: 0,
        paddingTop:Platform.OS === 'ios' ? 10: 0,
    },
    btn:{
        backgroundColor:'rgba(5, 169, 215, 0.7)',
        width:width - 250,
        height:40,
        justifyContent:'center',
        marginTop:20,
        borderRadius:15,
        justifyContent:'center',
        alignItems:'center'
    }
});
