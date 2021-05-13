import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Region, height} from './src/common/CommonComponent';
import {Provider} from 'react-redux';
import {createStore, combineReducers} from 'redux';
import Swiper from './src/screen/SwiperScreen';
import SignUp from './src/screen/SignUpScreen';
import Login from './src/screen/LoginScreen';
import ForgetPassWord from './src/screen/ForgetPassWordScreen';
import Home from './src/screen/HomeScreen';
import PostEdit from './src/screen/PostEditScreen';
import PostAdd from './src/screen/PostAddScreen';
import PostDetail from './src/screen/PostDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Swiper"
            options={{title: 'screen Swiper', headerShown: false}}
            component={Swiper}
          />
          <Stack.Screen
            name="Login"
            options={{title: 'screen Login', headerShown: false}}
            component={Login}
          />
          <Stack.Screen
            name="SignUp"
            options={{title: 'screen SignUp', headerShown: false}}
            component={SignUp}
          />
          <Stack.Screen
            name="ForgetPassWord"
            options={{title: 'screen ForgetPassWord', headerShown: false}}
            component={ForgetPassWord}
          />
          <Stack.Screen
            name="Home"
            options={{title: 'screen Home', headerShown: false}}
            component={Home}
          />

          <Stack.Screen
            name="PostAdd"
            options={{title: 'screen PostAdd', headerShown: false}}
            component={PostAdd}
          />

          <Stack.Screen
            name="PostDetail"
            options={{title: 'screen PostDetail', headerShown: false}}
            component={PostDetail}
          />

          <Stack.Screen
            name="PostEdit"
            options={{title: 'screen PostEdit', headerShown: false}}
            component={PostEdit}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

//default state

const defaultState = {
  User: false,
  Post: null,
  ReFreshAll: false,
  ReFreshMyPost: false,
};

//reducer -> tien doan action

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'setPost':
      state = {
        ...state,
        Post: action.value,
      };
      break;
    case 'setReFreshAll':
      state = {
        ...state,
        ReFreshAll: action.value,
      };
      break;
    case 'setReFreshMyPost':
      state = {
        ...state,
        ReFreshMyPost: action.value,
      };
      break;
    case 'setUser':
      state = {
        ...state,
        User: action.value,
      };
      break;
  }
  return state;
};

// tao ra store

const reducers = combineReducers({
  user: userReducer,
});
const store = createStore(userReducer);

//tich hợp vào trong ứng dụng react - Provider -> 1 component - 1 props ->store
