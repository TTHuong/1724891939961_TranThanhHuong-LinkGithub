import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDate, height, width} from '../common/CommonComponent';
import QRCode from 'react-native-qrcode-svg';
import MD5 from 'react-native-md5';
import {ScrollView} from 'react-native-gesture-handler';
import Axios from 'axios';
import {FireBaseApp} from '../common/FireBaseConfig';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';

const api = Axios.create({
  baseURL: 'http:///10.0.2.2:8000/api/',
});

const storage = FireBaseApp.storage();

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
const Fetch = RNFetchBlob.polyfill.Fetch;
window.fetch = new Fetch({
  auto: true,
  // binaryContentTypes: ['image/', 'video/', 'audio/', 'foo/'],
}).build();

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nguoidung: [],
      HoVaTen: '',
      Email: '',
      FB: '',
      SDT: '',
      Zalo: '',
      AnhDaiDien: '',
      sessionId: '',
      matkhaucu: '',
      matkhaumoi: '',
    };
  }

  logout = async () => {
    await AsyncStorage.removeItem('@IdUser:key');
    this.props.props.navigation.navigate('Swiper');
  };

  loadDataNguoiDung = async () => {
    var TenDangNhap = await AsyncStorage.getItem('@IdUser:key');
    api.post('kiemtraid', {TenDangNhap: TenDangNhap}).then((res) => {
      this.setState({
        nguoidung: res.data,
        HoVaTen: res.data[0].HoVaTen,
        Email: res.data[0].Email,
        FB: res.data[0].FB,
        SDT: res.data[0].SDT,
        Zalo: res.data[0].Zalo,
        AnhDaiDien: res.data[0].AnhDaiDien,
      });
    });
  };

  _goToNextPage = () => {
    try {
      if (this.props.User == true) {
        this.props.dispatch({
          type: 'setUser',
          value: false,
        });
        this.loadDataNguoiDung();
      }

      // console.log(this.props.Refresh);
    } catch (error) {
      console.log(error);
    }
  };

  _startAutoPlay = () => {
    this._timerId = setInterval(this._goToNextPage, 1000);
  };

  _stopAutoPlay = () => {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
  };

  capnhatnguoidung = async () => {
    api
      .post('capnhatnguoidung', {
        Id: this.state.nguoidung[0].Id,
        HoVaTen: this.state.HoVaTen,
        Email: this.state.Email,
        FB: this.state.FB,
        SDT: this.state.SDT,
        Zalo: this.state.Zalo,
      })
      .then((res) => {
        this.loadDataNguoiDung();
      });
    if (this.state.matkhaucu != '' && this.state.matkhaumoi != '') {
      api
        .post('doimatkhaunguoidung', {
          Id: this.state.nguoidung[0].Id,
          MatKhauCu: MD5.hex_md5(this.state.matkhaucu),
          MatKhauMoi: MD5.hex_md5(this.state.matkhaumoi),
        })
        .then((res) => {
          if (res.data == 'sucess') {
            this.setState({
              matkhaucu: '',
              matkhaumoi: '',
            });
            this.logout();
          } else {
            Alert.alert('Thông báo', 'Mật khẩu hiện tại của bạn không đúng', [
              {
                text: 'Ok',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ]);
          }
        });
    }
  };

  macdinh() {
    this.loadDataNguoiDung();
  }

  xoaanh() {
    Alert.alert('Thông báo', 'Bạn thật sự muốn xóa bức ảnh này ?', [
      {
        text: 'Hủy',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Xóa',
        onPress: () => {
          api
            .post('Xoaanhdaidiennguoidung', {Id: this.state.nguoidung[0].Id})
            .then((res) => {
              var desertRef = storage
                .ref('avatar')
                .child(this.state.nguoidung[0].TenAnh);
              desertRef
                .delete()
                .then(function () {
                  console.log('sucess');
                })
                .catch(function (error) {
                  console.log(error);
                });
              this.loadDataNguoiDung();
            })
            .catch((err) => console.log(err));
        },
      },
    ]);
  }

  uploadImage = (uri, mime = 'image/jpeg') => {
    return new Promise((resolve, reject) => {
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      let uploadBlob = null;
      const sessionId =
        MD5.hex_md5(this.state.nguoidung[0].Id) + getDate() + '.jpg';
      this.setState({
        sessionId: sessionId,
      });
      const imageRef = storage.ref('avatar').child(sessionId);
      fs.readFile(uploadUri, 'base64')
        .then((data) => {
          return Blob.build(data, {type: `${mime};BASE64`});
        })
        .then((blob) => {
          uploadBlob = blob;
          return imageRef.put(blob, {contentType: mime});
        })
        .then(() => {
          uploadBlob.close();
          return imageRef.getDownloadURL();
        })
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  themanh = () => {
    ImagePicker.openPicker({
      cropping: true,
    })
      .then((image) => {
        var imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        this.uploadImage(imageUri).then((url) => {
          if (this.state.nguoidung[0].AnhDaiDien != null) {
            api
              .post('Xoaanhdaidiennguoidung', {Id: this.state.nguoidung[0].Id})
              .then((res) => {
                var desertRef = storage
                  .ref('avatar')
                  .child(this.state.nguoidung[0].TenAnh);
                desertRef
                  .delete()
                  .then(function () {
                    console.log('sucess');
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              })
              .catch((err) => console.log(err));

            api
              .post('Themanhdaidiennguoidung', {
                AnhDaiDien: url,
                Id: this.state.nguoidung[0].Id,
                TenAnh: this.state.sessionId,
              })
              .then((res) => {
                this.loadDataNguoiDung();
              });
          } else {
            api
              .post('Themanhdaidiennguoidung', {
                AnhDaiDien: url,
                Id: this.state.nguoidung[0].Id,
                TenAnh: this.state.sessionId,
              })
              .then((res) => {
                this.loadDataNguoiDung();
              });
          }
          console.log(url);
        });
      })
      .catch((e) => console.log(e));
  };

  componentDidMount = async () => {
    this.loadDataNguoiDung();
    this._stopAutoPlay();
    this._startAutoPlay();
  };

  render() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
        }}
        style={styles.container}>
        <StatusBar
          hidden={true}
          backgroundColor="white"
          barStyle={'dark-content'}
        />
        <View
          style={{
            width: width,
            height: 75,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'blue',
          }}>
          <View
            style={{
              width: width,
              height: 20,
              justifyContent: 'center',
              marginBottom: 5,
              // alignItems: 'center',
            }}>
            <Text numberOfLines={1} style={styles.textLogout}>
              Họ Và Tên
            </Text>
          </View>
          <TextInput
            placeholder="Nguyễn Văn A..."
            style={{
              width: '85%',
              height: 45,
              borderRadius: 2,
              borderWidth: 1,
              marginLeft: -60,
              borderColor: '#e0e0e0',
              paddingLeft: 10,
              paddingRight: 10,
              color: 'black',
              // backgroundColor: 'blue',
            }}
            value={this.state.HoVaTen}
            onChangeText={(text) =>
              this.setState({
                HoVaTen: text,
              })
            }
          />
        </View>

        <View
          style={{
            width: width,
            height: 75,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'blue',
          }}>
          <View
            style={{
              width: width,
              height: 20,
              justifyContent: 'center',
              marginBottom: 5,
              // alignItems: 'center',
            }}>
            <Text numberOfLines={1} style={styles.textLogout}>
              Số Điện Thoại
            </Text>
          </View>
          <TextInput
            placeholder="0802943271,..."
            style={{
              width: '85%',
              height: 45,
              borderRadius: 2,
              borderWidth: 1,
              marginLeft: -60,
              borderColor: '#e0e0e0',
              paddingLeft: 10,
              paddingRight: 10,
              color: 'black',
              // backgroundColor: 'blue',
            }}
            value={this.state.SDT}
            onChangeText={(text) =>
              this.setState({
                SDT: text,
              })
            }
          />
        </View>

        <View
          style={{
            width: width,
            height: 75,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'blue',
          }}>
          <View
            style={{
              width: width,
              height: 20,
              justifyContent: 'center',
              marginBottom: 5,
              // alignItems: 'center',
            }}>
            <Text numberOfLines={1} style={styles.textLogout}>
              Email
            </Text>
          </View>
          <TextInput
            placeholder="NguyenVanA@gmail.com,..."
            style={{
              width: '85%',
              height: 45,
              borderRadius: 2,
              borderWidth: 1,
              marginLeft: -60,
              borderColor: '#e0e0e0',
              paddingLeft: 10,
              paddingRight: 10,
              color: 'black',
              // backgroundColor: 'blue',
            }}
            value={this.state.Email}
            onChangeText={(text) =>
              this.setState({
                Email: text,
              })
            }
          />
        </View>

        <View
          style={{
            width: width,
            height: 75,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'blue',
          }}>
          <View
            style={{
              width: width,
              height: 20,
              justifyContent: 'center',
              marginBottom: 5,
              // alignItems: 'center',
            }}>
            <Text numberOfLines={1} style={styles.textLogout}>
              Facebook
            </Text>
          </View>
          <TextInput
            placeholder="https://www.facebook.com/xxx,..."
            style={{
              width: '85%',
              height: 45,
              borderRadius: 2,
              borderWidth: 1,
              marginLeft: -60,
              borderColor: '#e0e0e0',
              paddingLeft: 10,
              paddingRight: 10,
              color: 'black',
              // backgroundColor: 'blue',
            }}
            value={this.state.FB}
            onChangeText={(text) =>
              this.setState({
                FB: text,
              })
            }
          />
        </View>

        <View
          style={{
            width: width,
            height: 75,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'blue',
          }}>
          <View
            style={{
              width: width,
              height: 20,
              justifyContent: 'center',
              marginBottom: 5,
              // alignItems: 'center',
            }}>
            <Text numberOfLines={1} style={styles.textLogout}>
              Zalo
            </Text>
          </View>
          <TextInput
            placeholder="https://chat.zalo.me/?phone=xxx,..."
            style={{
              width: '85%',
              height: 45,
              borderRadius: 2,
              borderWidth: 1,
              marginLeft: -60,
              borderColor: '#e0e0e0',
              paddingLeft: 10,
              paddingRight: 10,
              color: 'black',
              // backgroundColor: 'blue',
            }}
            value={this.state.Zalo}
            onChangeText={(text) =>
              this.setState({
                Zalo: text,
              })
            }
          />
        </View>

        <View
          style={{
            width: width,
            height: 200,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'blue',
          }}>
          <View
            style={{
              width: width,
              height: 20,
              justifyContent: 'center',
              marginBottom: 5,
              // alignItems: 'center',
            }}>
            <Text numberOfLines={1} style={styles.textLogout}>
              Ảnh Đại Diện
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.themanh();
            }}
            style={{
              width: '85%',
              height: 170,
              borderRadius: 2,
              borderWidth: 1,
              marginLeft: -60,
              borderColor: '#e0e0e0',
              paddingLeft: 10,
              paddingRight: 10,
              color: '#898989',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {(() => {
              if (this.state.AnhDaiDien != null) {
                return (
                  <View
                    style={{
                      width: '100%',
                      height: 170,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => this.xoaanh()}
                      style={[
                        styles.close,
                        {
                          width: 30,
                          height: 40,
                        },
                      ]}>
                      <AntDesign name="closecircle" size={25} color="black" />
                    </TouchableOpacity>
                    <Image
                      style={{width: '85%', height: 170}}
                      resizeMode="stretch"
                      source={{
                        uri: this.state.AnhDaiDien,
                      }}
                    />
                  </View>
                );
              } else {
                return (
                  <Image
                    style={{width: '85%', height: 170}}
                    resizeMode="center"
                    source={require('../assets/images/notimage.jpg')}
                  />
                );
              }
            })()}
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: width,
            // height: 75,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: 'blue',
          }}>
          <View
            style={{
              width: width,
              height: 20,
              justifyContent: 'center',
              marginBottom: 5,
              // alignItems: 'center',
            }}>
            <Text numberOfLines={1} style={styles.textLogout}>
              Đổi Mật Khẩu
            </Text>
          </View>
          <TextInput
            placeholder="nhập mật khẩu hiện tại của bạn"
            style={{
              width: '85%',
              height: 45,
              borderRadius: 2,
              borderWidth: 1,
              marginLeft: -60,
              borderColor: '#e0e0e0',
              paddingLeft: 10,
              paddingRight: 10,
              color: 'black',
              // backgroundColor: 'blue',
            }}
            value={this.state.matkhaucu}
            onChangeText={(text) =>
              this.setState({
                matkhaucu: text,
              })
            }
          />
          {(() => {
            if (this.state.matkhaucu != '') {
              return (
                <TextInput
                  placeholder="nhập mật khẩu mới của bạn"
                  style={{
                    width: '85%',
                    height: 45,
                    borderRadius: 2,
                    borderWidth: 1,
                    marginLeft: -60,
                    borderColor:
                      this.state.matkhaucu != ''
                        ? this.state.matkhaumoi != ''
                          ? '#e0e0e0'
                          : '#C90927'
                        : '#e0e0e0',
                    paddingLeft: 10,
                    paddingRight: 10,
                    color: 'black',
                    // backgroundColor: 'blue',
                  }}
                  value={this.state.matkhaumoi}
                  onChangeText={(text) =>
                    this.setState({
                      matkhaumoi: text,
                    })
                  }
                />
              );
            }
          })()}
        </View>

        <View
          style={{
            width: '100%',
            height: 50,
            //   backgroundColor: 'red',
            marginTop: 10,
            marginBottom: 10,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.capnhatnguoidung();
            }}
            style={{
              flex: 1,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#e0e0e0',
              marginLeft: 20,
              marginRight: 10,
            }}>
            <Text
              style={{
                color: '#3465d9',
                fontFamily: 'UTM-DuepuntozeroBold',
                fontSize: 19,
              }}>
              Cập nhật thông tin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.macdinh()}
            style={{
              flex: 1,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#e0e0e0',
              marginLeft: 10,
              marginRight: 20,
            }}>
            <Text
              style={{
                color: '#3465d9',
                fontFamily: 'UTM-DuepuntozeroBold',
                fontSize: 19,
              }}>
              Quay mặc định
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.frameLogout}>
          <TouchableOpacity style={styles.logout} onPress={() => this.logout()}>
            <MaterialCommunityIcons name="logout" color="#3465d9" size={25} />
            <Text style={styles.textLogout}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 5,
  },
  close: {
    position: 'absolute',
    zIndex: 10,
    width: 20,
    height: 40,
    top: 5,
    right: -5,
  },
  frameQr: {
    marginTop: -12,
    marginLeft: 13,
  },
  frameLogout: {
    width: '100%',
    height: 40,
    // backgroundColor: 'red',
    alignItems: 'flex-end',
    // marginTop: 10,
  },
  logout: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor:'red',
    height: '100%',
  },
  textLogout: {
    color: '#3465d9',
    marginLeft: 10,
    fontSize: 15,
    fontWeight: '700',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

MyProfile.propTypes = {
  props: PropTypes.object,
};
function mapStateToProps(state) {
  return {
    User: state.User,
  };
}
export default connect(mapStateToProps)(MyProfile);
