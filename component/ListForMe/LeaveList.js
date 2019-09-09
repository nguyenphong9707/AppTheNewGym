import React, { PureComponent } from 'react'
import { Text, View, FlatList, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import LeaveModal from './LeaveModal';


const Width = Dimensions.get('window').width;
export default class LeaveList extends PureComponent {
    constructor(props){
        super(props);
        this.state={
            id:'',
            Token:'',
            refreshing: false,
            modalVisible: false,
            noidung:'',
            daybd:'',
            daykt:'',
            id_replace:null,
            mangList:[...this.props.Listmang],
            total:null
        }
    }
    

    ChangState(visible, noidung, daybd, daykt, replace, total) {
        if(replace != null){
            this.setState({
                modalVisible: visible,
                noidung:noidung,
                daybd:daybd,
                daykt:daykt,
                id_replace: replace.name,
                total:total
            });
        }else{
            this.setState({
                modalVisible: visible,
                noidung:noidung,
                daybd:daybd,
                daykt:daykt,
                id_replace: '',
                total:total
            });
        }
      }

    componentWillReceiveProps=(nextProps)=>{
        this.setState({
            mangList:nextProps.Listmang,
            id:nextProps.id_user,
            Token:nextProps.Token,
        })
    }

    _refresh = () => {
        fetch("http://hr.thenewgym.vn/api/leave_form/" + this.state.id + "?token=" + this.state.Token,{
            method: "GET",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({ mangList:res.work_form.reverse() })
            })
            .catch((error)=>{
                console.log('loi')
            })
    }

    render() {
        return(
            <View>
                <FlatList
            refreshing={this.state.refreshing}
            onRefresh={this._refresh}
            data={this.state.mangList}
            renderItem={({item})=>
                <TouchableOpacity
                style={{alignItems:'center'}}
                onPress={() => {
                    this.ChangState(true, item.leave_type, item.start_date, item.end_date, item.id_replace, item.total_date);
                }}>
                <View key={item.Id} style={styles.viewList}>
                    <View style={{flexDirection: 'row'}}>
                        {item.approve == 1 ? <Icon name="ios-checkmark-circle" size={20} color='green'/> : <Icon name="ios-mail" size={20} color='black'/> }
                        <Text style={{fontWeight: 'bold', color: 'black', marginLeft:5}}>Đơn nghỉ phép</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', justifyContent:'space-between'}}>
                        <Text numberOfLines={1}>&emsp;
                                {item.leave_type.length < 35
                                    ? `${item.leave_type}`
                                    : `${item.leave_type.substring(0, 32)}...`}
                        </Text>
                        <Text>
                            {item.start_date}
                        </Text>
                    </View>
                </View>
                </TouchableOpacity>
                    }
                />

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => this.ChangState(false)}
                    >
                        <View style={{flex:10, alignItems:'center', justifyContent:'center', backgroundColor:'rgba(28, 28, 28, 0.49)'}}>
                            <View style={{backgroundColor:'white', height:400, width:300, borderRadius:10, borderTopWidth:2, borderTopColor:'#f36f2C'}}>
                            <View style={{flex:9}}>
                                    <LeaveModal 
                                        noidung={this.state.noidung}
                                        daybd={this.state.daybd}
                                        daykt={this.state.daykt}
                                        id_replace = {this.state.id_replace}
                                        total = {this.state.total}
                                        Token = {this.props.Token}
                                        />
                                </View>
                                <TouchableOpacity
                                        style={{flex:1, borderTopWidth:1, borderTopColor:'#cfcfcf', justifyContent:'center', alignItems:'center'}}
                                        onPress={()=>this.ChangState(false)}
                                    >
                                    <Text style={{color:'#03323a'}}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    viewList:{
        width:Width - 8,
        borderRadius:5,
        borderLeftWidth:3,
        borderLeftColor:'#05a9d7',
        padding:5,
        marginTop:10,
        backgroundColor:'white',
        elevation: 5
    }
})