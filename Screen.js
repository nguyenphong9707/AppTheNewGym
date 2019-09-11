import React, { Component } from 'react';
import { Text, View, SafeAreaView, ScrollView, Dimensions, Image } from 'react-native'
import { createDrawerNavigator, createBottomTabNavigator, createStackNavigator, createAppContainer, createSwitchNavigator, DrawerItems } from "react-navigation";
import LogInScreen from './component/LogInScreen';
import HomeScreen from './component/HomeScreen';
import AuthloadingScreen from './component/AuthLoadingScreen';
import MyList from './component/ListForMe/MyList';
import Leave from './component/Permission form/Leave';
import LeaveApplication from './component/ListForMe/LeaveApplication';
import Icon from 'react-native-vector-icons/FontAwesome';
import Business from './component/Permission form/Business';
import Member from './component/Members/Members';
import Listmembers from './component/Members/Listmembers';
import LoadingHome from './component/LoadingHome';
import Leavemembers from './component/Members/Leavemembers';

console.disableYellowBox = true;
// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = createStackNavigator({ HomeScreen: HomeScreen });
const AuthStack = createStackNavigator({ LogInScreen: LogInScreen });

const Tabbar = createBottomTabNavigator({
  Business: {
      screen: HomeScreen,
      navigationOptions: {
          title: 'Công Tác',
          header: null,
          tabBarIcon: ({ tintColor }) => (
              <Icon name="wpforms" size={20} color={tintColor}/>
            ),
      }
  },
  Approve: {
      screen: LeaveApplication,
      navigationOptions: {
          title: 'Nghỉ phép',
          header: null,
          tabBarIcon: ({ tintColor }) => (
              <Icon name="wpforms" size={20} color={tintColor}/>
            ),
      }
  },

},{
  initialRouteName: 'Business',
  swipeEnabled:true,
  animationEnabled:true,
  tabBarOptions: {
      style: {
          backgroundColor: 'white',
      },
      activeTintColor:'#003300'
  }
});

const MemberTabNavi = createBottomTabNavigator({
  Listmembers: {
      screen: Listmembers,
      navigationOptions: {
        header: null,
        title: 'công tác',
        tabBarIcon: ({ tintColor }) => (
            <Icon name="wpforms" size={20} color={tintColor}/>
          ),
        
    }
  },

  Leavemembers: {
    screen: Leavemembers,
    navigationOptions: {
      header: null,
      title: 'nghỉ phép',
      tabBarIcon: ({ tintColor }) => (
          <Icon name="wpforms" size={20} color={tintColor}/>
        ),
  }
  },
},{
  initialRouteName: 'Listmembers',
  swipeEnabled:true,
  animationEnabled:true,
  tabBarOptions: {
      style: {
          backgroundColor: 'white',
      },
      activeTintColor:'#003300',
  }
});

const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{ flex:1, }}>
    <View style={{height:65, flexDirection:'row', backgroundColor:'#05a9d7', justifyContent:'center', alignItems:'center'}}>
        <Image source={require('./component/img/User.png')}
        style={{
            height:50,
            width:50,
            borderRadius:30
        }}
        />
        <View style={{marginLeft:10}}></View>
    </View>
    <ScrollView>
        <DrawerItems {...props}/>
    </ScrollView>
  </SafeAreaView>
)
const sideMenu = createDrawerNavigator({
  MyList: {
      screen: Tabbar,
      navigationOptions: {
        header: null,
        title: 'Danh sách của tôi'
    }
  },

  Member: {
    screen: Member,
    navigationOptions: {
      title: 'Danh sách của thành viên'
  }
},

  Buness: {
    screen: Business,
    navigationOptions: {
      title: 'Đơn công tác'
  }
  },
  
  Leave: {
      screen: Leave,
      navigationOptions: {
        title: 'Đơn nghỉ phép'
    }
  },

},{
  initialRouteName: 'MyList',
  drawerPosition:"left",
  contentComponent: CustomDrawerComponent,
});


export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthloadingScreen,
    App: AuthStack,
    LoadingHome: {
      screen: LoadingHome,
      navigationOptions: {
        header: null,
    }
  },
    Auth: sideMenu,
    Members:Member,
    MemberTabNavi: {
      screen: MemberTabNavi,
      navigationOptions: {
        header: null,
    }
    },
  },
  {
    initialRouteName: 'AuthLoading',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#1e90ff'
      },
      headerTintColor: '#fff',
      headerTintStyle: {
        textAlign: 'center',
      }
    }
  },
));

