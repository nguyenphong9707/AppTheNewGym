import React, { PureComponent } from 'react'
import { Text, View, AsyncStorage } from 'react-native'
import {connect} from 'react-redux';
import Spinner from 'react-native-spinkit';

class LoadingHome extends PureComponent {
    constructor(props){
        super(props)
        
    }

    async componentDidMount() {
        const token = await AsyncStorage.getItem('Token');
        if (token) {
            fetch("http://hr.thenewgym.vn/api/me?token=" + token,{
            method: "GET",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                const id = res.user.id
                this.props.dispatch({ type: 'USERID', id})
                this.props.navigation.navigate('Auth')
            })
            .catch((error)=>{
                console.log('loi')
            })
 
            
        }else{
            this.setState({ Token: '' });
            alert('Phiên bản đăng nhập đã hết hạn.')
            this.props.navigation.navigate('App')
        }
    }
    render() {
        return (
            <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#d7f6fe'}}>
                <Spinner color={'#05a9d7'} size={40} type={'FadingCircle'}/>
            </View>
        )
    }
}
export default connect()(LoadingHome);
