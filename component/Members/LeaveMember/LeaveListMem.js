import React, { PureComponent } from 'react'
import { Text, View, FlatList, StyleSheet, Modal, TouchableOpacity, Dimensions, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Swipeout from 'react-native-swipeout';
import Spinner from 'react-native-spinkit'
import LeaveModalMem from './LeaveModalMem';

const Width = Dimensions.get('window').width;
export default class LeaveListMem extends PureComponent {
    constructor(props){
        super(props);
        this.state=({
            refreshing: false,
            modalVisible: false,
            mangList:[...this.props.mangList],
            Loading:false,
            noidung:null,
            daybd:null,
            daykt:null,
            id_replace: null,
            total:null,
            id_letter:null,
            approve:null
        })
        console.log(this.props.mangList)
    }
    ChangState(visible, noidung, daybd, daykt, replace, total, id, approve) {
        if(replace != null){
            this.setState({
                modalVisible: visible,
                noidung:noidung,
                daybd:daybd,
                daykt:daykt,
                id_replace: replace.name,
                total:total,
                id_letter:id,
                approve:approve
            });
        }else{
            this.setState({
                modalVisible: visible,
                noidung:noidung,
                daybd:daybd,
                daykt:daykt,
                id_replace: '',
                total:total,
                id_letter:id
            });
        }
      }

    _refresh=()=>{
        fetch("http://hr.thenewgym.vn/api/leave_form/" + this.props.id_member + "?token=" + this.props.Token,{
            method: "GET", 
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({
                    mangList:res.leave_form.reverse()
                })
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    _Approve = () =>{
        this.setState({Loading:true})
        var params = {
            Letter_id:this.state.id_letter,
            Approve:1
        };
        var formData = new FormData();
        for (var k in params) {
            formData.append(k, params[k]);
        }
        fetch("http://hr.thenewgym.vn/api/update_lf?token=" + this.props.Token,{
            method: "POST",
            header:{
                'Content-Type': 'application/x-www-form-urlencoded;',
            },
            body: formData
            })
            .then((response)=>response.json())
            .then((res)=>{
                this.setState({
                    mangList:res.leave_form.reverse(),
                    modalVisible:false,
                    Loading:false
                })
            })
            .catch((error)=>{
                console.log(error)
            })
        
    }

    _Deletenow = () => {
        this.setState({Loading:true})
        var params = {
            Letter_id:this.state.id_letter,
            Approve:2
        };
        var formData = new FormData();
        for (var k in params) {
            formData.append(k, params[k]);
        }
        fetch("http://hr.thenewgym.vn/api/update_lf?token=" + this.props.Token,{
            method: "POST",
            header:{
                'Content-Type': 'application/x-www-form-urlencoded;',
            },
            body: formData
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({
                    mangList:res.leave_form.reverse(),
                    modalVisible:false,
                    Loading:false
                })
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    _Delete = () =>{
        Alert.alert(
            'Thông báo',
            'Bạn có chắc muốn xóa ?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {text: 'Xóa', 
              onPress: () => this._Deletenow(),
               style: 'cancel',},
              
            ],
            {cancelable: false},
          );

        
    }

    render() {
        return (
            <View>
                <FlatList
                    refreshing={this.state.refreshing}
                onRefresh={this._refresh}
                data={this.state.mangList}
                renderItem={({item})=>
                <TouchableOpacity
                style={{alignItems:'center'}}
                onPress={() => {
                    this.ChangState(true, item.leave_type, item.start_date, item.end_date, item.id_replace, item.total_date, item.id, item.approve);
                }}>
                <View key={item.id} style={styles.viewList}>
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
                    {this.state.Loading ? <Spinner style={{marginTop:30}} color={'#05a9d7'} size={30} type={'Circle'}/> :
                    <View style={{backgroundColor:'white', height:400, width:300, borderRadius:10, borderTopWidth:2, borderTopColor:'#f36f2C'}}>
                    <View style={{flex:9}}>
                            <LeaveModalMem
                                noidung={this.state.noidung}
                                daybd={this.state.daybd}
                                daykt={this.state.daykt}
                                id_replace = {this.state.id_replace}
                                total = {this.state.total}
                                Token = {this.props.Token}
                            />
                        </View>
                        <View style={{flex:1}}>
                        {this.state.approve == 1 ? 
                        <View style={{flex:1, flexDirection:'row', borderTopWidth:1, borderTopColor:'#cfcfcf'}}>
                            <TouchableOpacity
                                    style={{flex:0.5, borderRightWidth:1, borderRightColor:'#cfcfcf', justifyContent:'center', alignItems:'center'}}
                                    onPress={()=>this.ChangState(false)}
                                >
                                <Text style={{color:'#03323a'}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                    style={{flex:0.5, borderLeftWidth:1, borderLeftColor:'#cfcfcf', justifyContent:'center', alignItems:'center'}}
                                    onPress={()=>this._Delete()}
                                > 
                                <Text style={{color:'red'}}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{flex:1, flexDirection:'row', borderTopWidth:1, borderTopColor:'#cfcfcf'}}>
                            <TouchableOpacity
                                    style={{flex:0.5, borderRightWidth:1, borderRightColor:'#cfcfcf', justifyContent:'center', alignItems:'center'}}
                                    onPress={()=>this.ChangState(false)}
                                >
                                <Text style={{color:'#03323a'}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                    style={{flex:0.5, borderLeftWidth:1, borderLeftColor:'#cfcfcf', borderRightWidth:1, borderRightColor:'#cfcfcf', justifyContent:'center', alignItems:'center'}}
                                    onPress={()=>this._Delete()}
                                >
                                <Text style={{color:'red'}}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                    style={{flex:0.5, borderLeftWidth:1, borderLeftColor:'#cfcfcf', justifyContent:'center', alignItems:'center'}}
                                    onPress={()=>this._Approve()}
                                >
                                <Text style={{color:'#4BB543'}}>Approve</Text>
                            </TouchableOpacity>
                        </View>}
                        
                        </View>
                    </View>
                    }
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
