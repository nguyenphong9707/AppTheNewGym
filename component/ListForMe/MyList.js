import React, { PureComponent } from 'react'
import { Text, View, FlatList, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native'
import BusinessModal from './BusinessModal';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/Ionicons';

const Width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export default class MyList extends PureComponent {
    constructor(props){
        super(props);
        this.state={
            id:'',
            Token:'',
            refreshing: false,
            modalVisible: false,
            noidung:'',
            day:'',
            timebd:'',
            timekt:'',
            mangList:[],
            letter:0,
            letterApprove:0
        }
    }

    ChangState(visible, noidung, day, timebd, timekt) {
        this.setState({
            modalVisible: visible,
            noidung:noidung,
            day:day,
            timebd:timebd,
            timekt:timekt,
        });
      }
    
      componentDidMount(){
        {this.setState({mangList:this.props.Listmang})}
      }

    _refresh=()=>{
        fetch("http://hr.thenewgym.vn/api/work_form/" + this.props.id_user + "?token=" + this.props.Token,{
            method: "GET",
            header:{
                "Accept":"application/json",
                "Content-Type":"application/json"
            },
            })
            .then((response)=>response.json()) // Lấy giá trị reponse, =>response.json() ép repose về kiểu json
            .then((res)=>{
                this.setState({
                    mangList:res.work_form.reverse(),
                })
            })
            .catch((error)=>{
                console.log(error)
            })
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
                        <View style={{}}><Text><Icons name="ios-mail" size={32} color='black'/></Text></View>
                    </View>
                    <View style={{flex:0.5, justifyContent:'center', alignItems:'center'}}>
                        <View style={styles.notification}><Text style={{color:'white', fontSize:10}}>{this.state.letterApprove}</Text></View>
                        <Text><Icons name="ios-checkmark-circle" size={30} color='green'/></Text>
                    </View>
        </View>
        {this.state.mangList.length < 1 ?
            <View style={{marginTop:30, alignItems:'center', justifyContent:'center'}}>
                <Text style={{fontWeight: 'bold', color: 'gray', fontSize:15}}>Chưa có đơn nào được tạo.</Text>
            </View>
            :<View>
            </View>
        }
            <FlatList
            refreshing={this.state.refreshing}
            onRefresh={this._refresh}
            data={this.state.mangList}
            renderItem={({item})=>
                <TouchableOpacity
                style={{alignItems:'center'}}
                onPress={() => {
                    this.ChangState(true, item.work, item.date, item.start_time, item.end_time);
                }}>
                <View key={item.Id} style={styles.viewList}>
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
                            {item.date}
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
                            <BusinessModal 
                                noidung={this.state.noidung}
                                Ngay={this.state.day}
                                timebd={this.state.timebd}
                                timekt={this.state.timekt}
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
        marginTop:5,
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
        marginBottom: -14,
        marginLeft:23,
        zIndex: 12
    }
}) 