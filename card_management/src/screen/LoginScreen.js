import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MD5 from 'react-native-md5';
import Axios from 'axios';

const api = Axios.create({
  baseURL: 'http:///10.0.2.2:8000/api/',
});

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      borderColor: null,
      email: null,
      password: null,
      status: null,
      show: false,
    };
  }

  componentWillUnmount = async () => {
    if ((await AsyncStorage.getItem('@IdUser:key')) != null) {
      this.props.navigation.navigate('Home');
    }
  };

  onFocus(value) {
    this.setState({
      borderColor: value,
    });
  }

  setIdUser = async (value) => {
    await AsyncStorage.setItem('@IdUser:key', value);
  };

  Login = async () => {
    var email = this.state.email;
    email = email.toLowerCase();
    try {
      if (
        this.state.email != null &&
        this.state.email != '' &&
        this.state.password != null &&
        this.state.password != '' &&
        this.state.show == false
      ) {
        var passMd5 = MD5.hex_md5(this.state.password);
        api
          .post('dangnhap', {
            TenDangNhap: email,
            MatKhau: passMd5,
          })
          .then((res) => {
            if (res.data.length > 0) {
              if (res.data[0].TrangThai == null) {
                this.setIdUser(email);
                this.props.navigation.navigate('Home');
              } else {
                Alert.alert(
                  'Thông báo thông tin đăng nhập !',
                  'Tài khoản này chưa được kích hoạt',
                  [
                    {
                      text: 'Ok',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false},
                );
                this.setState({
                  show: true,
                });
              }
            } else {
              Alert.alert(
                'Thông báo thông tin đăng nhập !',
                'Tài Khoản này không tồn tại',
                [
                  {
                    text: 'Ok',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                ],
                {cancelable: false},
              );
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else if (
        this.state.email != null &&
        this.state.email != '' &&
        this.state.password != null &&
        this.state.password != '' &&
        this.state.show == true
      ) {
        var passMd5 = MD5.hex_md5(this.state.password);
        api
          .post('kichhoat', {
            TenDangNhap: email,
            MatKhau: passMd5,
            TrangThai: this.state.status,
          })
          .then((res) => {
            // console.log(res.data[0].Id);
            if (res.data == 'success') {
              this.setIdUser(email);
              this.props.navigation.navigate('Home');
            } else {
              Alert.alert(
                'Thông báo thông tin đăng nhập !',
                'Mã kích hoạt không đúng !',
                [
                  {
                    text: 'Ok',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                ],
                {cancelable: false},
              );
              this.setState({
                show: true,
              });
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        Alert.alert(
          'Thông báo thông tin đăng nhập !',
          'Vui lòng nhập đầy đủ',
          [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden backgroundColor="white" barStyle={'dark-content'} />
        <Text style={styles.title}>Đăng Nhập</Text>
        <Text style={styles.text}>Đăng nhập với email và mật khẩu </Text>
        <View style={styles.action}>
          <View
            style={[
              styles.section,
              {
                borderColor:
                  this.state.borderColor == 'email' ? '#3465d9' : 'gray',
              },
            ]}>
            <MaterialIcons
              name="email"
              size={25}
              color={this.state.borderColor == 'email' ? '#3465d9' : 'gray'}
            />
            <TextInput
              placeholder={'Email'}
              style={styles.textInput}
              onFocus={() => this.onFocus('email')}
              onChangeText={(value) => this.setState({email: value})}
              value={this.state.email}
            />
          </View>

          <View
            style={[
              styles.section,
              {
                borderColor:
                  this.state.borderColor == 'password' ? '#3465d9' : 'gray',
              },
            ]}>
            <MaterialIcons
              name="lock-outline"
              size={25}
              color={this.state.borderColor == 'password' ? '#3465d9' : 'gray'}
            />
            <TextInput
              placeholder={'Mật Khẩu'}
              style={styles.textInput}
              secureTextEntry
              onFocus={() => this.onFocus('password')}
              onChangeText={(value) => this.setState({password: value})}
              value={this.state.password}
            />
          </View>
          {(() => {
            if (this.state.show == true) {
              return (
                <View
                  style={[
                    styles.section,
                    {
                      borderColor:
                        this.state.borderColor == 'status' ? '#3465d9' : 'gray',
                    },
                  ]}>
                  <MaterialIcons
                    name="confirmation-number"
                    size={25}
                    color={
                      this.state.borderColor == 'status' ? '#3465d9' : 'gray'
                    }
                  />
                  <TextInput
                    placeholder={'Mã kích hoạt tài khoản'}
                    style={styles.textInput}
                    onFocus={() => this.onFocus('status')}
                    onChangeText={(value) => this.setState({status: value})}
                    value={this.state.status}
                  />
                </View>
              );
            }
          })()}
        </View>

        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('ForgetPassWord')}>
          <Text style={styles.forget}>Quên mật khẩu ? </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.login} onPress={() => this.Login()}>
          <Text style={styles.textLogin}> Đăng nhập </Text>
        </TouchableOpacity>
        <View style={styles.signup}>
          <Text
            style={[
              styles.textSignup,
              {
                color: 'gray',
              },
            ]}>
            Không có tài khoản ?
          </Text>

          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text
              style={[
                styles.textSignup,
                {
                  color: '#3465d9',
                  marginLeft: 3,
                },
              ]}>
              Đăng Ký{' '}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 100,
  },
  title: {
    color: '#3465d9',
    // fontWeight: 'bold',
    fontFamily: 'icielCadena',
    fontSize: 30,
  },
  text: {
    color: 'gray',
  },
  section: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 10,
    // backgroundColor:'blue',
    // height:56,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    // backgroundColor:'yellow',
    height: 38,
  },
  forget: {
    textAlign: 'right',
    marginTop: 15,
    color: '#3465d9',
  },
  textLogin: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  login: {
    width: '100%',
    height: 40,
    backgroundColor: '#3465d9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 25,
  },
  signup: {
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textSignup: {
    textAlign: 'center',
  },
});

// function mapStateToProps(state) {
//   return {
//     Id: state.IdUser,
//   };
// }

// export default connect(mapStateToProps)(LoginScreen);
export default connect()(LoginScreen);
