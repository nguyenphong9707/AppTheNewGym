import React, { PureComponent } from 'react'
import { Text, View, FlatList, StyleSheet, Modal, TouchableOpacity, Dimensions, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import ModalMember from './ModalMember';
import Swipeout from 'react-native-swipeout';
import Spinner from 'react-native-spinkit'

const Width = Dimensions.get('window').width;
export default class ViewListMem extends PureComponent {
    constructor(props){
        super(props);
        this.state=({
            refreshing: false,
            id:null,
            modalVisible: false,
            noidung:null,
            day:null,
            timebd:null,
            timekt:null,
            mangList:[...this.props.mangList],
            id_letter:null,
            Loading:false,
            approve:null,
            letter:0,
            letterApprove:0
        })
    }

    ChangState(visible, noidung, day, timebd, timekt, id, approve) {
        this.setState({
            modalVisible: visible,
            noidung:noidung,
            day:day,
            timebd:timebd,
            timekt:timekt,
            id_letter:id,
            approve:approve
        });
      }


    _refresh=()=>{
        fetch("http://hr.thenewgym.vn/api/work_form/" + this.props.id_member + "?token=" + this.props.Token,{
            method: "GET",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({
                    mangList:res.work_form.reverse()
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
        fetch("http://hr.thenewgym.vn/api/update_wf?token=" + this.props.Token,{
            method: "POST",
            header:{
                'Content-Type': 'application/x-www-form-urlencoded;',
            },
            body: formData
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({
                    mangList:res.work_form.reverse(),
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
        fetch("http://hr.thenewgym.vn/api/update_wf?token=" + this.props.Token,{
            method: "POST",
            header:{
                'Content-Type': 'application/x-www-form-urlencoded;',
            },
            body: formData
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({
                    mangList:res.work_form.reverse(),
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
        a = 0
        b = 0
        this.state.mangList.map(w=>{
            return w.approve == 0 ? a++ : a
        })
        this.state.mangList.map(w=>{
            return w.approve == 1 ? b++ : b
        })
        this.setState({
            letter:a,
            letterApprove:b
        })
        return (
            <View>
            <View style={{height: 60, width:Width, flexDirection:'row', alignItems:'center', backgroundColor:'#d7f6fe'}}>
                    <View style={{flex:0.5, justifyContent:'center', alignItems:'center', zIndex: 0}}>
                        <View style={styles.notification}><Text style={{color:'white', fontSize:10}}>{this.state.letter}</Text></View>
                        <View style={{}}><Text><Icon name="ios-mail" size={32} color='black'/></Text></View>
                    </View>
                    <View style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
                        <View style={styles.notification}><Text style={{color:'white', fontSize:10}}>{this.state.letterApprove}</Text></View>
                        <Text><Icon name="ios-checkmark-circle" size={30} color='green'/></Text>
                    </View>
            </View>
            {this.state.mangList.length < 1 ?
            <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontWeight: 'bold', color: 'gray', fontSize:15}}>Chưa có đơn nào được tạo.</Text>
            </View>
            :
                <FlatList
                    refreshing={this.state.refreshing}
                onRefresh={this._refresh}
                data={this.state.mangList}
                renderItem={({item})=>
                <TouchableOpacity
                style={{alignItems:'center'}}
                onPress={() => {
                    this.ChangState(true, item.work, item.date, item.start_time, item.end_time, item.id, item.approve);
                }}>
                <View key={item.id} style={styles.viewList}>
                    <View style={{flexDirection: 'row'}}>
                        {item.approve == 1 ? <Icon name="ios-checkmark-circle" size={20} color='green'/> : <Icon name="ios-mail" size={20} color='black'/> }
                        <Text style={{fontWeight: 'bold', color: 'black', marginLeft:5}}>Đơn công tác</Text>
                    </View>
                    <View style={{flex:1, flexDirection: 'row', justifyContent:'space-between'}}>
                        <Text numberOfLines={1}>&emsp;
                                {item.work.length < 35
                                    ? `${item.work}`
                                    : `${item.work.substring(0, 32)}...`}
                        </Text>
                        <Text>
                            {item.Ngay}
                        </Text>
                    </View>
                </View>
                </TouchableOpacity>
                }
                    />
            }
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
                            <ModalMember 
                                noidung={this.state.noidung}
                                Ngay={this.state.day}
                                timebd={this.state.timebd}
                                timekt={this.state.timekt}
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
    },
    notification:{
        backgroundColor:'red',
        width: 15,
        height: 15,
        borderRadius: 50,
        borderColor: '#ccc',
        alignItems:'center',
        justifyContent:'center',
        elevation: 8,
        marginBottom: -14,
        marginLeft:23,
        zIndex: 12
    }
})