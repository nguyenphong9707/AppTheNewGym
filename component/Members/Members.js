import React, { PureComponent } from 'react'
import { Text, View, TouchableOpacity, Image, AsyncStorage, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/SimpleLineIcons';
import Spinner from 'react-native-spinkit'

const Width = Dimensions.get('window').width;
export default class Members extends PureComponent {
    constructor(props){
        super(props)
        this.state=({
            mangUser:[],
            refreshing:false,
            Loading:true,
            Success:null,
            Message:null
        })
    }
    componentDidMount= async()=>{
        const token = await AsyncStorage.getItem('Token');
        if (token) {
            this.setState({ Token: token });
            fetch("http://hr.thenewgym.vn/api/member/manager?token=" + token,{
            method: "GET",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({
                    Success:res.success,
                    Message:res.message,
                    mangUser:res.users,
                    Loading:false
                })
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
        this.props.navigation.navigate('App')
    }

    _ListLetter(){
        this.props.navigation.navigate('MemberTab')
    }
    render() {
        return (
            <View style={{flex:10}}>
            <View style={{height:52.5, flexDirection:'row', backgroundColor:'white', alignItems:'center', borderBottomWidth:1, borderBottomColor:'#05a9d7'}}>
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
            <View style={{flex:9, backgroundColor:'#d7f6fe', alignItems:'center', justifyContent:'center'}}>
                { this.state.Loading ? <Spinner color={'#05a9d7'} size={40} type={'9CubeGrid'}/> :
                    this.state.Success ?
                    <FlatList
                    refreshing={this.state.refreshing}
                    data={this.state.mangUser}
                    renderItem={({item})=>
                        <TouchableOpacity
                            style={{alignItems:'center'}}
                            onPress={()=> this.props.navigation.navigate('MemberTabNavi',{id_member:item.id})}
                        >
                            <View style={styles.viewList}>
                                <View style={{flex:1, paddingLeft:10}}><Icons name="user" size={25}/></View>
                                <View style={{flex:7, paddingLeft:10}}><Text>{item.name}</Text></View>
                                <View style={{flex:2, alignItems:'flex-end', paddingRight: 10}}><Icons name="arrow-right" size={15}/></View>
                            </View>
                        </TouchableOpacity>
                    }
                    />
                    :
                    <Text style={{fontWeight: 'bold',fontSize:15 }}>{this.state.Message}</Text>
                }
            </View>
            
            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewList:{
        flex:10,
        width:Width - 10,
        flexDirection:'row',
        height:50,
        borderRadius:5,
        padding:5,
        marginTop:10,
        backgroundColor:'white',
        elevation: 5,
        alignItems:'center'
    }
})
