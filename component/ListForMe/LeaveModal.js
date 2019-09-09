import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'

class LeaveModal extends PureComponent {
    constructor(props){
        super(props);
        this.state=({ 
            name_replace:null
        })
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:0.2, alignItems:'center', justifyContent:'center'}}>
                    <Text style={{fontWeight: 'bold', color: 'black', fontSize:18}}>Phiếu Nghỉ Phép</Text>
                </View>
                <View style={{flex:0.1, alignItems:'center', paddingRight:10}}>
                    <Text style={{color: 'gray'}}>Từ: {this.props.daybd}   Đến: {this.props.daykt}</Text>
                    <Text style={{color: 'gray'}}>Tổng ngày : {this.props.total}</Text>
                    {this.props.id_replace ? <Text style={{color: 'gray'}}>Người thay thế : {this.props.id_replace}</Text> :
                    <Text style={{color: 'gray'}}>Người thay thế : ...</Text>}
                </View>
                <View style={{flex:0.8, padding:10}}>
                    <Text style={{color: 'gray', marginTop:30}}>&nbsp;{this.props.noidung}</Text>
                </View>
            </View>
        )
    }
}

export default LeaveModal;