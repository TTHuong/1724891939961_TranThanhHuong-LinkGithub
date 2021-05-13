import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  BackHandler,
} from 'react-native';
import {width} from '../common/CommonComponent';
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view';
import All from '../components/All';
import MyPost from './../components/MyPost';
import MyProfile from '../components/MyProfile';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {
    if ((await AsyncStorage.getItem('@IdUser:key')) == null) {
      this.props.navigation.navigate('Swiper');
    }
    BackHandler.addEventListener('hardwareBackPress', function () {
      return true;
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={true}
          backgroundColor="white"
          barStyle={'dark-content'}
        />
        <View style={styles.header}>
          <ImageBackground
            source={require('../assets/images/header.png')}
            style={styles.imageBackground}
            resizeMode="contain">
            <Text style={styles.title}>THUÊ XE</Text>
          </ImageBackground>
        </View>
        <View style={styles.tabbar}>
          <ScrollableTabView
            style={{
              marginTop: 20,
            }}
            onChangeTab={(i) => {
              if (i.i == 0) {
                this.props.dispatch({
                  type: 'setReFreshAll',
                  value: true,
                });
              }
              else if(i.i==1){
                this.props.dispatch({
                  type: 'setReFreshMyPost',
                  value: true,
                });
              }
              else if(i.i==2){
                this.props.dispatch({
                  type: 'setUser',
                  value: true,
                });
              }
            }}
            initialPage={0}
            tabBarActiveTextColor="#3465d9"
            tabBarInactiveTextColor="gray"
            tabBarTextStyle={{fontWeight: 'bold'}}
            renderTabBar={() => (
              <DefaultTabBar
                style={{
                  borderWidth: 0,
                }}
                underlineStyle={{
                  backgroundColor: '#3465d9',
                }}
              />
            )}>
            <All tabLabel="Chung" props={this.props}></All>
            <MyPost tabLabel="Riêng Tư" props={this.props}></MyPost>
            <MyProfile tabLabel="Thông Tin" props={this.props}></MyProfile>
          </ScrollableTabView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    // marginTop: -20,
    position: 'absolute',
  },
  tabbar: {
    flex: 1,
    marginTop: width * 0.3,
    paddingHorizontal: 30,
    // backgroundColor:'green'
  },
  imageBackground: {
    width: width * 0.4,
    height: width * 0.4,
    alignItems: 'center',
    // backgroundColor:'red'
  },
  title: {
    color: 'white',
    marginTop: 23,
    // fontWeight: 'bold',
    fontSize: 25,
    fontFamily: 'icielCadena',
  },
});

export default connect()(HomeScreen);
