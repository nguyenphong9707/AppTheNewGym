import React, { PureComponent } from 'react'
import { Text, View } from 'react-native'
import Screen from './Screen';
import {createStore} from 'redux';
import {Provider} from 'react-redux'
  const defaultState = {
    UserID:null,
    Token:null,
    mangUser:[]
  }
const reducer = (state = defaultState ,action) => {
    switch(action.type){
        case "USERID" : return {UserID:action.id}
        case "SAVE_TOKEN" : return {Token:action.token}
        case "MANG_USER" : return {mangUser:action.mangUser}
        default : return state
    }
}

const store = createStore(reducer);

export default class App extends PureComponent {
  render() {
    return (
      <View style={{flex:1}}>
        <Provider store={store}>
          <Screen/>
        </Provider>
      </View>
    )
  }
}
