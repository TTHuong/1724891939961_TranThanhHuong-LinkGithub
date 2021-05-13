import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {
  width,
  height,
  standarWidth,
  standardHeight,
} from '../common/CommonComponent';
import * as Animatable from 'react-native-animatable';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SwiperScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation_singup: null,
      animation_login: null,
      show: false,
    };
  }

  componentDidMount = async () => {
    if ((await AsyncStorage.getItem('@IdUser:key')) != null) {
      this.props.navigation.navigate('Home');
    }
  };

  onIndexChanged(index) {
    if (index == 2) {
      this.setState({
        animation_singup: 'bounceInLeft',
        animation_login: 'bounceInRight',
        show: true,
      });
    } else {
      this.setState({
        animation_singup: null,
        animation_login: null,
        show: false,
      });
    }
  }

  render() {
    return (
      <Swiper
        containerStyle={{alignSelf: 'stretch'}}
        // showsButtons={true}
        // autoplayTimeout={3}
        // autoplay={true}
        pagingEnabled={true}
        removeClippedSubviews={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        onIndexChanged={(index) => this.onIndexChanged(index)}>
        <View style={styles.slide}>
          <StatusBar hidden backgroundColor="white" barStyle={'dark-content'} />
          <View style={styles.header}>
            <Image
              source={require('../assets/images/login1.png')}
              style={styles.image}
              resizeMode="stretch"></Image>
          </View>
          <View style={styles.footer}>
            <Text style={styles.title}>LƯU DỮ và KẾT NỐI</Text>
            <Text style={styles.text}>
              Cùng trao cho nhau niềm tin, cùng nhau phát triển{' '}
            </Text>
          </View>
        </View>

        <View style={styles.slide}>
          <View style={styles.header}>
            <Image
              source={require('../assets/images/login2.png')}
              style={styles.image}
              resizeMode="stretch"></Image>
          </View>
          <View style={styles.footer}>
            <Text style={styles.title}>LIÊN HỆ và CHIA SẺ </Text>
            <Text style={styles.text}>
              Cùng trao cho nhau niềm tin, cùng nhau phát triển{' '}
            </Text>
          </View>
        </View>

        <View style={styles.slide}>
          <View style={styles.header}>
            <Image
              source={require('../assets/images/login3.png')}
              style={styles.image}
              resizeMode="stretch"></Image>
          </View>
          <View style={styles.footer}>
            <Text style={styles.title}> LIÊN KẾT </Text>
            <Text style={styles.text}>
              Cùng trao cho nhau niềm tin, cùng nhau phát triển{' '}
            </Text>

            {this.state.show ? (
              <View style={{flexDirection: 'row'}}>
                <Animatable.View
                  animation={this.state.animation_singup}
                  delay={0}
                  duration={1500}
                  useNativeDriver>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('SignUp')}
                    style={[
                      styles.button,
                      {
                        borderColor: '#3465d9',
                        borderWidth: 1,
                        borderRadius: 50,
                        marginTop: 15,
                      },
                    ]}>
                    <Text style={{color: '#3465d9'}}>Đăng Ký</Text>
                  </TouchableOpacity>
                </Animatable.View>

                <Animatable.View
                  animation={this.state.animation_login}
                  delay={0}
                  duration={1500}
                  useNativeDriver>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Login')}
                    style={[
                      styles.button,
                      {
                        backgroundColor: '#3465d9',
                        borderRadius: 50,
                        marginTop: 15,
                        marginLeft: 20,
                      },
                    ]}>
                    <Text style={{color: 'white'}}>Đăng Nhập</Text>
                  </TouchableOpacity>
                </Animatable.View>
              </View>
            ) : null}
          </View>
        </View>
      </Swiper>
    );
  }
}

const height_image = height * 0.5 * 1;
const width_image = height_image * 1.1;
const width_button = width * 0.3;

var styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'blue',
  },
  footer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    // backgroundColor:'yellow',
  },
  image: {
    height: height_image,
    width: width_image,
  },
  title: {
    fontSize: 25,
    color: '#3465d9',
    textAlign: 'center',
    // fontWeight: 'bold',
    fontFamily: 'icielCadena',
  },
  text: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  dot: {
    backgroundColor: 'rgba(52,101,217,4)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    marginVertical: 3,
  },
  activeDot: {
    backgroundColor: '#3465d9',
    width: 20,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    marginVertical: 3,
  },
  button: {
    width: width_button,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default connect()(SwiperScreen);
