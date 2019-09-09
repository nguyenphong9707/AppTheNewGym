import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'

export default class ModalMember extends PureComponent {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:0.2, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontWeight: 'bold', color: 'black', fontSize:18}}>Phiếu công tác</Text>
                </View>
                <View style={{flex:0.1, alignItems:'center', paddingRight:10}}>
                <Text style={{color: 'gray'}}>Vào lúc: {this.props.timebd.slice(0,5)} - Đến: {this.props.timekt.slice(0,5)}</Text>
                    <Text style={{color: 'gray'}}>Ngày : {this.props.Ngay}</Text>
                </View>
                <View style={{flex:0.8, alignItems:'center', padding:10, marginTop:15}}>
                    <Text style={{color: 'gray'}}>&nbsp;{this.props.noidung}</Text>
                </View>
            </View>
        )
    }
}
