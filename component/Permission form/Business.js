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
    KeyboardAvoidingView,
    ScrollView,
    Platform
} from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from "react-native-modal-datetime-picker";
import moment from "moment"
import 'moment/min/moment-with-locales'
import Spinner from 'react-native-spinkit'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
class Business extends PureComponent {
    constructor(props){
        super(props);
        this.state=({
            Token:'',
            ShowTimeBDVisible:false,
            ShowTimeKTVisible:false,
            ShowDateVisible:false,
            showtime:'',
            giobd:'',
            giokt:'',
            noidung:'',
            ngay:'',
            Loading:false,
            checkgiobd:null,
            checkgiokt:null
        })
    }
    async componentDidMount(){
        const token = await AsyncStorage.getItem('Token');
        if(token){
            this.setState({
                Token:token
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

    handleDatePicked = (datetime) => {
        moment.locale('vi')
        console.log("A date has been picked: ", moment(datetime).format().substring(11,16));
        date = new Date()
        // console.log(moment(date).format().substring(0,10))
        this.hideDateTimePicker();
    }

    _showtimebd = () => {
        this.setState({ ShowTimeBDVisible: true });
    }

    _showtimebdConfirm = (time) => {
        moment.locale('vi')
        this.setState({
            giobd : moment(time).format().substring(11,19),
            checkgiobd:time,
            ShowTimeBDVisible:false
        })
    }

    _showtimekt = () => {
        this.setState({ ShowTimeKTVisible: true });
    }

    _showtimektConfirm = (time) => {
        moment.locale('vi')
        this.setState({
            giokt : moment(time).format().substring(11,19),
            checkgiokt:time,
            ShowTimeKTVisible:false
        })

    }

    _showDate = () => {
        this.setState({ ShowDateVisible: true });
    }

    _showDateConfirm = (date) => {
        moment.locale('vi')
        this.setState({
            ngay : moment(date).format().substring(0,10),
            ShowDateVisible:false
        })

    }

    hideDateTimePicker=()=>{
        this.setState({
            ShowTimeBDVisible:false,
            ShowTimeKTVisible:false,
            ShowDateVisible:false
        })
    }

    _btnsend = () => {
        console.log(this.state.noidung)
        console.log(this.state.giobd)
        console.log(this.state.giokt)
        console.log(this.state.ngay)
        var params = {
            Work: this.state.noidung,
            Start_time:this.state.giobd,
            End_time:this.state.giokt,
            Date:this.state.ngay
        };
        var formData = new FormData();
        for (var k in params) {
            formData.append(k, params[k]);
        }
        if(this.state.Token == ""){
            alert('Phiên bản đăng nhập đã hết hạn.')
        }else if(this.state.noidung == "" || this.state.giobd == "" || this.state.giokt == "" || this.state.ngay == ""){
            Alert.alert(
                'Thông báo',
                'Vui lòng điền đầy đủ thông tin')
        }else if(this.state.checkgiobd.getHours() == this.state.checkgiokt.getHours() && this.state.checkgiobd.getMinutes() >= this.state.checkgiokt.getMinutes() ){
            Alert.alert(
                'Thông báo',
                'Thời gian không hợp lệ')
        }else if(this.state.checkgiobd.getHours() <= this.state.checkgiokt.getHours()){
            this.setState({Loading:true})
            fetch("http://hr.thenewgym.vn/api/save_wf?token=" + this.state.Token,{
            method: "POST",
            header:{
                'Content-Type': 'application/x-www-form-urlencoded;',
            },
            body: formData
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({
                    giobd:'',
                    giokt:'',
                    ngay:'',
                    noidung:'',
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
        }else{
            Alert.alert(
                'Thông báo',
                'Thời gian không hợp lệ.'
            )
        }

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
                        <Text style={{textAlign:'center', color:'#555859', fontSize:25, marginTop:20, fontWeight: 'bold'}}>Đơn Công Tác</Text>

                    </View>

                    <View style={{flex:8, alignItems:'center', paddingTop:30}}>
                        <View style={{flexDirection:Platform.OS === 'ios'?'column':'row', width:width-50}}>
                            <View>
                            <Text>Từ lúc:</Text>
                            <TouchableOpacity onPress={this._showtimebd}>
                              <View style={styles.TextInput}><Text style={{marginTop:13, fontSize:15}}>{this.state.giobd}</Text></View>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.ShowTimeBDVisible}
                                onConfirm={this._showtimebdConfirm}
                                onCancel={this.hideDateTimePicker}
                                mode={'time'}
                                is24Hour={true}
                                />
                            </View>
                            <View style={{marginLeft:Platform.OS === 'ios'? 0 : 30, paddingTop:Platform.OS === 'ios' ? 15: 0}}>
                            <Text>Đến lúc:</Text>
                            <TouchableOpacity onPress={this._showtimekt}>
                              <View style={styles.TextInput}><Text style={{marginTop:13, fontSize:15}}>{this.state.giokt}</Text></View>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.ShowTimeKTVisible}
                                onConfirm={this._showtimektConfirm}
                                onCancel={this.hideDateTimePicker}
                                mode={'time'}
                                is24Hour={true}
                                />
                            </View>
                        </View>
                        <View style={{paddingTop:20}}>
                            <View>
                                <Text>Ngày:</Text>
                                <TouchableOpacity onPress={this._showDate}>
                                  <View style={{...styles.TextInput, width:width-50}}><Text style={{marginTop:13, fontSize:15}}>{this.state.ngay}</Text></View>
                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.ShowDateVisible}
                                    onConfirm={this._showDateConfirm}
                                    onCancel={this.hideDateTimePicker}
                                    mode={'date'}
                                    />
                            </View>

                            <View style={{marginTop:20}}>
                                <Text>Nội dung công tác:</Text>
                                <TextInput
                                    style={{...styles.TextInputContent, marginTop:10}}
                                    multiline={true}
                                    placeholder={'...'}
                                    placeholderTextColor={'gray'}
                                    onChangeText={(noidung) => this.setState({noidung})}
                                    value={this.state.noidung}
                                    onSubmitEditing={Keyboard.dismiss}
                                />
                            </View>
                        </View>
                        {
                            this.state.Loading ? <Spinner style={{marginTop:30}} color={'#05a9d7'} size={25} type={'Circle'}/> :
                            <TouchableOpacity
                            onPress={this._btnsend}
                            style={styles.btn}>
                                <View>
                                    <Text style={{color:'white'}}>Gửi</Text>
                                </View>
                            </TouchableOpacity>
                        }

                    </View>
                </View>
            </View>
        );
    }
}
export default Business;

const styles = StyleSheet.create({
    container: {
        flex: 10,
    },
    header:{
        flexDirection:'row',
        backgroundColor:'white',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#05a9d7',
        marginTop:Platform.OS === 'ios' ? 30 : 0,
        height:Platform.OS === 'ios' ? 70.05 : 52.5,
    },
    body:{
        flex:9,
        backgroundColor:'#d7f6fe'
    },
    TextInput:{
      marginTop:10,
      height:50,
      width:Platform.OS === 'ios' ? width - 50 : width - 220,
      color:'black',
      backgroundColor:"white",
      borderBottomWidth:1,
      borderBottomColor:'#05a9d7',
      backgroundColor:'rgba(255, 255, 255, 1)',
      borderRadius:10,
      paddingLeft:20,
      height:Platform.OS === 'ios' ? 45: 45,
    },

    TextInputContent:{
        width:width - 50,
        height:100,
        color:'black',
        borderBottomWidth:2,
        borderBottomColor:'#05a9d7',
        backgroundColor:'rgba(255, 255, 255, 1)',
        borderRadius:10,
        textAlignVertical:'top',
        paddingLeft:Platform.OS === 'ios' ? 10: null,
        paddingTop:Platform.OS === 'ios' ? 10: null,
    },
    btn:{
        marginTop:30,
        width:width-150,
        height:40,
        borderWidth:1,
        borderColor:'#05a9d7',
        backgroundColor:'rgba(5, 169, 215, 0.7)',
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
    }
});
