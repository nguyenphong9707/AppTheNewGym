import React, { PureComponent } from 'react'
import { View,
    Text,
    StyleSheet,
    AsyncStorage,
    TouchableOpacity,
    Image } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';
import ViewListMem from './ViewListMem'
import Spinner from 'react-native-spinkit'

class Listmembers extends PureComponent {
    constructor(props){
        super(props);
        this.state=({
            Token:'',
            id_member:'',
            mang:[],
            Loading:true
        })
    }

    _logout =async ()=>{
        await AsyncStorage.setItem('isLoggedIn','0');
        this.props.navigation.navigate('LogInScreen')
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem('Token');
        const id_member = this.props.navigation.dangerouslyGetParent().getParam('id_member')
        if (token) {
            this.setState({ Token: token });
            fetch("http://hr.thenewgym.vn/api/work_form/" + id_member + "?token=" + token,{
            method: "GET",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({
                    mang:res.work_form.reverse(),
                    id_member:id_member,
                    Loading:false
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

    render() {
        const { navigation } = this.props;
        return (
            <View style={styles.container}>
                <View style={{flex:1, flexDirection:'row', backgroundColor:'white', alignItems:'center', borderBottomWidth:1, borderBottomColor:'#05a9d7'}}>
                    <TouchableOpacity
                        style={{flex:0.2,paddingLeft:10}}
                        onPress={()=> this.props.navigation.navigate('Member')}>
                    
                        <Icons name="md-arrow-round-back" size={25} color='black'/>
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
                <View style={{flex:9, backgroundColor:'#d7f6fe', justifyContent:'center', alignItems:'center'}}>
                {
                        this.state.Loading ? <Spinner color={'#05a9d7'} size={40} type={'9CubeGrid'}/> 
                        :
                    <ViewListMem
                        id_member = {this.state.id_member}
                        Token = {this.state.Token}
                        mangList = {this.state.mang}
                    />
                }
                </View>
                
            </View>
        );
    }
}
export default Listmembers;

const styles = StyleSheet.create({
    container: {
        flex: 10,
    }
});