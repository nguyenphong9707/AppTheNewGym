import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    StatusBar,AsyncStorage
} from "react-native";

class AuthloadingScreen extends Component {
    constructor(props){
        super(props);
        this._loadData();

    }
    render() {
        return (
            <View style={styles.container}>
            <ActivityIndicator/>
            <StatusBar barStyle="default"/>
            </View>
        );
    }
    _loadData=async ()=>{
        const isloggedIn = await AsyncStorage.getItem('isLoggedIn');
        this.props.navigation.navigate(isloggedIn == '0'? 'App' :'LoadingHome');
    }
}
export default AuthloadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});