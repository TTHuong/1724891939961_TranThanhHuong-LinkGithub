import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Modal,
  ScrollView,
  Image,
  FlatList,
  Text,
  TextInput,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import {
  width,
  height,
  Region,
  formatMoney,
  openLink,
  call,
  sendEmail,
  notification,
  getDate,
} from '../common/CommonComponent';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
// import Detail from '../components/Detail';
// import Add from '../components/Add';
// import Edit from '../components/Edit';
// import ChooseTemplate from '../components/ChooseTemplate';
import Geocoder from 'react-native-geocoder';
import Axios from 'axios';
import ContentLoader, {
  Rect,
  Circle,
  BulletList,
} from 'react-content-loader/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import MD5 from 'react-native-md5';
import {FireBaseApp} from '../common/FireBaseConfig';
import {Switch} from 'react-native-switch';

const api = Axios.create({
  baseURL: 'http:///10.0.2.2:8000/api/',
});
// const urlImage = 'http:///10.0.2.2:8080/thueoto/public/Images/';

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

class PostEditScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Tieude: this.props.Post.Tieude,
      Gia: this.props.Post.Gia,
      MoTa: this.props.Post.MoTa,
      Hang: this.props.Post.Hang,
      hienthihang: false,
      DongXe: this.props.Post.DongXe,
      NamSanXuat: this.props.Post.NamSanXuat,
      TinhTrang: this.props.Post.TinhTrang,
      HopSo: this.props.Post.HopSo,
      MaLuc: this.props.Post.MaLuc,
      NhienLieu: this.props.Post.NhienLieu,
      XuatSu: this.props.Post.XuatSu,
      KieuDang: this.props.Post.KieuDang,
      SoCho: this.props.Post.SoCho,
      DiaChi: this.props.Post.DiaChi,
      hiendiachi: false,
      SoKmDaDi: this.props.Post.SoKmDaDi,
      BienSoXe: this.props.Post.BienSoXe,
      An:this.props.Post.An,
      AnhXe: [],
      Url: '',
      nguoidung: [],
      sessionId: '',
      region: {
        latitude: parseFloat(this.props.Post.Lat),
        longitude: parseFloat(this.props.Post.Log),
        latitudeDelta: Region.latitudeDelta,
        longitudeDelta: Region.longitudeDelta,
      },
    };
  }
  clear() {
    if (this.google.getAddressText() != '') {
      this.google.clear();
      this.setState({
        region: {
          ...this.state.region,
          latitude: parseFloat(this.props.Post.Lat),
          longitude: parseFloat(this.props.Post.Log),
        },
      });
    }
  }
  async onDoublePress(coordinate, position) {
    var region = {
      latitudeDelta: Region.latitudeDelta,
      longitudeDelta: Region.longitudeDelta,
      latitude: coordinate.nativeEvent.coordinate.latitude,
      longitude: coordinate.nativeEvent.coordinate.longitude,
    };
    Geocoder.fallbackToGoogle('AIzaSyDNI_ZWPqvdS6r6gPVO50I4TlYkfkZdXh8');
    let ret = await Geocoder.geocodePosition({
      lat: coordinate.nativeEvent.coordinate.latitude,
      lng: coordinate.nativeEvent.coordinate.longitude,
    });
    this.setState({
      DiaChi: ret[0].formattedAddress,
      region: region,
    });
  }

  async onDragEnd(e) {
    var region = {
      latitudeDelta: Region.latitudeDelta,
      longitudeDelta: Region.longitudeDelta,
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    };
    Geocoder.fallbackToGoogle('AIzaSyDNI_ZWPqvdS6r6gPVO50I4TlYkfkZdXh8');
    let ret = await Geocoder.geocodePosition({
      lat: e.nativeEvent.coordinate.latitude,
      lng: e.nativeEvent.coordinate.longitude,
    });
    this.setState({
      DiaChi: ret[0].formattedAddress,
      region: region,
    });
  }
  capNhatBaiDang = async () => {
    try {
      if (
        this.state.Tieude != '' &&
        parseInt(this.state.Gia) >= 0 &&
        this.state.MoTa != '' &&
        this.state.Hang != '' &&
        this.state.DongXe != '' &&
        parseInt(this.state.NamSanXuat) >= 0 &&
        this.state.TinhTrang != '' &&
        this.state.HopSo != '' &&
        parseInt(this.state.MaLuc) >= 0 &&
        this.state.NhienLieu != '' &&
        this.state.XuatSu != '' &&
        this.state.KieuDang != '' &&
        parseInt(this.state.SoCho) >= 0 &&
        this.state.DiaChi != '' &&
        parseInt(this.state.SoKmDaDi) >= 0 &&
        this.state.BienSoXe != ''
      ) {
        Alert.alert('Thông báo', 'Bạn thật sự muốn cập nhật lại thông tin ?', [
          {
            text: 'Hủy',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Cập nhật',
            onPress: () => {
              api
                .post('capnhatbaidang', {
                  Id: this.props.Post.Id,
                  Tieude: this.state.Tieude,
                  Gia: parseInt(this.state.Gia),
                  MoTa: this.state.MoTa,
                  Hang: this.state.Hang,
                  DongXe: this.state.DongXe,
                  NamSanXuat: parseInt(this.state.NamSanXuat),
                  TinhTrang: this.state.TinhTrang,
                  HopSo: this.state.HopSo,
                  MaLuc: parseInt(this.state.MaLuc),
                  NhienLieu: this.state.NhienLieu,
                  XuatSu: this.state.XuatSu,
                  KieuDang: this.state.KieuDang,
                  SoCho: parseInt(this.state.SoCho),
                  DiaChi: this.state.DiaChi,
                  SoKmDaDi: parseInt(this.state.SoKmDaDi),
                  BienSoXe: this.state.BienSoXe,
                  An:this.state.An,
                  Lat: this.state.region.latitude,
                  Log: this.state.region.longitude,
                })
                .then((res) => {
                  if (res.data == 'sucess') {
                    notification('Cập nhật dữ liệu thành công');
                    this.props.dispatch({
                      type: 'setRefresh',
                      value: 'MyPost',
                    });
                    this.props.dispatch({
                      type: 'setReFreshMyPost',
                      value: true,
                    });
                  }
                })
                .catch((err) => console.log(err));
            },
          },
        ]);
      } else {
        notification(
          'Cập nhật dữ liệu thất bại! vui lòng điền đầy đủ thông tin',
        );
      }
    } catch {
      (err) => console.log(err);
    }
  };

  loadAnhXe = async () => {
    await api.get('anhxe/' + this.props.Post.Id).then((res) => {
      this.setState({
        AnhXe: res.data,
      });
    });
  };

  xoaanh = async (item) => {
    Alert.alert('Thông báo', 'Bạn thật sự muốn xóa bức ảnh này ?', [
      {
        text: 'Hủy',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Xóa',
        onPress: () => {
          api.post('xoaanh', {Id: item.Id}).then((res) => {
            if (res.data == 'sucess') {
              var desertRef = storage.ref('images').child(item.TenAnh);
              desertRef
                .delete()
                .then(function () {
                  console.log('sucess');
                })
                .catch(function (error) {
                  console.log(error);
                });
              this.loadAnhXe();
            }
          });
        },
      },
    ]);
  };

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
      const imageRef = storage.ref('images').child(sessionId);
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

  themAnhXe = () => {
    ImagePicker.openPicker({
      cropping: true,
    })
      .then((image) => {
        var imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
        this.uploadImage(imageUri).then((url) => {
          console.log(url);
          api
            .post('themanh', {
              IdBaiDang: this.props.Post.Id,
              Links: url,
              TenAnh: this.state.sessionId,
            })
            .then((res) => {
              if (res.data == 'sucess') {
                this.loadAnhXe();
              }
            });
        });
      })
      .catch((e) => console.log(e));
  };

  xoabaiviet = async () => {
    // this.loadAnhXe();
    console.log(this.state.AnhXe[0].TenAnh);
    Alert.alert('Thông báo', 'Bạn thật sự muốn xóa bài viết này ?', [
      {
        text: 'Hủy',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Xóa',
        onPress: () => {
          api
            .post('xoabaiviet', {Id: this.props.Post.Id})
            .then((res) => {
              for (var i = 0; i < this.state.AnhXe.length; i++) {
                var Id = this.state.AnhXe[i].Id;
                var TenAnh = this.state.AnhXe[i].TenAnh;
                api
                  .post('xoaanh', {Id: Id})
                  .then((res) => {
                    var desertRef = storage.ref('images').child(TenAnh);
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
              }
              this.props.dispatch({
                type: 'setReFreshMyPost',
                value: true,
              });
              this.props.navigation.goBack();
            })
            .catch((error) => console.log(error));
        },
      },
    ]);
  };

  componentDidMount = async () => {
    var TenDangNhap = await AsyncStorage.getItem('@IdUser:key');
    BackHandler.removeEventListener('hardwareBackPress', function () {
      return true;
    });
    api.post('kiemtraid', {TenDangNhap: TenDangNhap}).then((res) => {
      this.setState({
        nguoidung: res.data,
      });
    });
    this.loadAnhXe();
  };

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: width,
            height: 40,
            // backgroundColor: 'transparent',
            backgroundColor: 'white',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.props.dispatch({
                type: 'setReFreshMyPost',
                value: true,
              });
              this.props.navigation.goBack();
            }}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons name="chevron-back-sharp" size={27} color="#3465d9" />
          </TouchableOpacity>
          <View style={{flex: 14, justifyContent: 'center'}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                color: '#3465d9',
                fontFamily: 'UTM-DuepuntozeroBold',
                fontSize: 19,
              }}>
              Sửa thông tin bài viết
            </Text>
          </View>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          style={{
            flex: 14,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Tiêu Đề
              </Text>
            </View>
            <TextInput
              placeholder="Tiêu đề"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.Tieude == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={this.state.Tieude}
              onChangeText={(text) =>
                this.setState({
                  Tieude: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Giá
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              placeholder="Giá"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.Gia == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={String(this.state.Gia)}
              onChangeText={(text) =>
                this.setState({
                  Gia: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 200,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Mô Tả
              </Text>
            </View>
            <TextInput
              placeholder="Mô Tả"
              multiline
              style={{
                width: width - 20,
                // height: 45,
                flex: 1,
                textAlignVertical: 'top',
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.MoTa == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={this.state.MoTa}
              onChangeText={(text) =>
                this.setState({
                  MoTa: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Hãng
              </Text>
            </View>
            <TextInput
              placeholder="Hãng"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.Hang == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={this.state.Hang}
              onChangeText={(text) =>
                this.setState({
                  Hang: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Dòng Xe
              </Text>
            </View>
            <TextInput
              placeholder="Dòng Xe"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.DongXe == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={this.state.DongXe}
              onChangeText={(text) =>
                this.setState({
                  DongXe: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Năm Sản Xuất
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              placeholder="Năm Sản Xuất"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor:
                  this.state.NamSanXuat == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={String(this.state.NamSanXuat)}
              onChangeText={(text) =>
                this.setState({
                  NamSanXuat: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Tình Trạng
              </Text>
            </View>
            <TextInput
              placeholder="Tình Trạng"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.TinhTrang == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={this.state.TinhTrang}
              onChangeText={(text) =>
                this.setState({
                  TinhTrang: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Hộp Số
              </Text>
            </View>
            <TextInput
              placeholder="Hộp Số"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.HopSo == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={this.state.HopSo}
              onChangeText={(text) =>
                this.setState({
                  HopSo: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Mã Lực
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              placeholder="Mã Lực"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.MaLuc == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={String(this.state.MaLuc)}
              onChangeText={(text) =>
                this.setState({
                  MaLuc: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Nhiên Liệu
              </Text>
            </View>
            <TextInput
              placeholder="Nhiên Liệu"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.NhienLieu == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={this.state.NhienLieu}
              onChangeText={(text) =>
                this.setState({
                  NhienLieu: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Xuất Sứ
              </Text>
            </View>
            <TextInput
              placeholder="Xuất Sứ"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.XuatSu == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={this.state.XuatSu}
              onChangeText={(text) =>
                this.setState({
                  XuatSu: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Kiểu Dáng
              </Text>
            </View>
            <TextInput
              placeholder="Kiểu Dáng"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.KieuDang == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={this.state.KieuDang}
              onChangeText={(text) =>
                this.setState({
                  KieuDang: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Số Chỗ
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              placeholder="Số Chỗ"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.SoCho == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={String(this.state.SoCho)}
              onChangeText={(text) =>
                this.setState({
                  SoCho: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Địa Chỉ
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                this.setState({
                  hiendiachi: true,
                });
              }}
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                justifyContent: 'center',
                // backgroundColor: 'blue',
              }}>
              <Text
                style={{
                  color: 'black',
                }}>
                {this.state.DiaChi}
              </Text>
            </TouchableOpacity>
            <Modal
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
              animationType="slide"
              transparent={true}
              visible={this.state.hiendiachi}>
              <View
                style={{
                  width: width,
                  height: height,
                }}>
                <View style={styles.searchBar}>
                  <TouchableOpacity
                    style={styles.back}
                    activeOpacity={0.7}
                    onPress={() =>
                      this.setState({
                        hiendiachi: false,
                      })
                    }>
                    <Ionicons
                      name="chevron-back-sharp"
                      size={29}
                      color="white"
                    />
                  </TouchableOpacity>

                  <GooglePlacesAutocomplete
                    ref={(ref) => {
                      this.google = ref;
                    }}
                    placeholder="Tìm kiếm..."
                    enablePoweredByContainer={false}
                    fetchDetails={true}
                    onPress={(data, details = null) => {
                      var region = {
                        latitudeDelta: Region.latitudeDelta,
                        longitudeDelta: Region.longitudeDelta,
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
                      };
                      this.setState({
                        DiaChi: this.google.getAddressText(),
                        region: region,
                      });
                    }}
                    query={{
                      /// kiếm key thì vô trang web này https://tranhieuit.com/share-google-maps-api-key/
                      // hoặc tìm kiếm với từ khoa share key api google
                      key: 'AIzaSyCJqpC7oo-YYJJ1pRVZJgf84qExlHZCWSc',
                      language: 'vn',
                    }}
                    styles={{
                      container: {
                        flex: 13,
                        marginRight: 20,
                        marginTop: 10,
                      },
                      textInput: {
                        paddingRight: 25,
                        height: 40,
                      },
                    }}
                  />

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => this.clear()}
                    style={styles.close}>
                    <Ionicons name="md-close-outline" size={25} color="gray" />
                  </TouchableOpacity>
                </View>
                <MapView
                  onDoublePress={(coordinate, position) => {
                    this.onDoublePress(coordinate, position);
                  }}
                  // showsUserLocation={true}
                  provider={PROVIDER_GOOGLE}
                  region={this.state.region}
                  mapType={'satellite'}
                  style={{
                    width: width,
                    height: height,
                  }}>
                  <Marker
                    draggable
                    coordinate={this.state.region}
                    onDragEnd={(e) => {
                      this.onDragEnd(e);
                    }}
                  />
                </MapView>
              </View>
            </Modal>
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Số Km đã Đi
              </Text>
            </View>
            <TextInput
              keyboardType="numeric"
              placeholder="Số Km đã Đi"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.SoKmDaDi == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={String(this.state.SoKmDaDi)}
              onChangeText={(text) =>
                this.setState({
                  SoKmDaDi: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Biển Số Xe
              </Text>
            </View>
            <TextInput
              placeholder="Biển Số Xe"
              style={{
                width: width - 20,
                height: 45,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: this.state.BienSoXe == '' ? '#C90927' : '#e0e0e0',
                paddingLeft: 10,
                paddingRight: 10,
                // backgroundColor: 'blue',
              }}
              value={this.state.BienSoXe}
              onChangeText={(text) =>
                this.setState({
                  BienSoXe: text,
                })
              }
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 75,
              justifyContent: 'center',
              // alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Ẩn/Hiện
              </Text>
            </View>
            <Switch
              value={this.state.An == 0 ? true : false}
              onValueChange={(val) => {
                if (val) {
                  this.setState({
                    An: 0,
                  });
                } else {
                  this.setState({
                    An: 1,
                  });
                }
              }}
              disabled={false}
              activeText={'On'}
              inActiveText={'Off'}
              circleSize={30}
              barHeight={30}
              circleBorderWidth={1}
              backgroundActive={'#e0e0e0'}
              backgroundInactive={'#e0e0e0'}
              circleActiveColor={'#3465d9'}
              circleInActiveColor={'#a0a0a0'}
              // renderInsideCircle={() => (
              //   <View
              //     style={{
              //       width: 30,
              //       height: 45,
              //       backgroundColor: 'red',
              //     }}></View>
              // )} // custom component to render inside the Switch circle (Text, Image, etc.)
              changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
              innerCircleStyle={{
                alignItems: 'center',
                justifyContent: 'center',
              }} // style for inner animated circle for what you (may) be rendering inside the circle
              outerCircleStyle={{}} // style for outer animated circle
              renderActiveText={false}
              renderInActiveText={false}
              switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
              switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
              switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
              switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
            />
          </View>
          <View
            style={{
              width: width - 20,
              height: 270,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: width - 20,
                height: 20,
                justifyContent: 'center',
                marginBottom: 5,
                // alignItems: 'center',
              }}>
              <Text
                numberOfLines={1}
                style={{
                  color: 'black',
                  fontFamily: 'UVNCHUKY',
                  fontSize: 17,
                }}>
                Ảnh Xe
              </Text>
            </View>
            {(() => {
              if (this.state.AnhXe.length > 0) {
                return (
                  <FlatList
                    horizontal
                    pagingEnabled
                    style={{
                      width: width,
                      height: 250,
                      opacity: 1,
                      // marginTop: 10,
                    }}
                    data={this.state.AnhXe}
                    renderItem={({item}) => (
                      <View
                        style={{
                          width: width,
                          height: 250,
                        }}>
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() => this.xoaanh(item)}
                          style={[
                            styles.close,
                            {
                              width: 30,
                              height: 40,
                            },
                          ]}>
                          <AntDesign
                            name="closecircle"
                            size={25}
                            color="black"
                          />
                        </TouchableOpacity>
                        <Image
                          style={{width: width, height: 250}}
                          resizeMode="stretch"
                          source={{
                            uri: item.Links,
                          }}
                        />
                      </View>
                    )}
                  />
                );
              } else {
                return (
                  <ContentLoader
                    speed={2}
                    width={500}
                    height={500}
                    viewBox="0 100 476 124"
                    backgroundColor="#ededed"
                    foregroundColor="#bfbbbb">
                    <Rect
                      width={500}
                      height={500}
                      stroke="black"
                      // rx="10"
                      // ry="10"
                    />
                  </ContentLoader>
                );
              }
            })()}
          </View>
          <View
            style={{
              width: width,
              height: 50,
              marginTop: 10,
              marginBottom: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                this.themAnhXe();
              }}
              style={{
                width: width / 3,
                height: 40,
                backgroundColor: BulletList,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                marginLeft: 20,
                marginRight: 40,
              }}>
              <Text
                style={{
                  color: '#3465d9',
                  fontFamily: 'UTM-DuepuntozeroBold',
                  fontSize: 19,
                }}>
                Thêm ảnh
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View
          style={{
            width: width,
            height: 50,
              // backgroundColor: 'red',
            marginTop: 10,
            marginBottom: 10,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              this.capNhatBaiDang();
            }}
            style={{
              flex: 1,
              backgroundColor: BulletList,
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
              Cập nhật lại
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.xoabaiviet()}
            style={{
              flex: 1,
              backgroundColor: BulletList,
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
              Xóa bài viết
            </Text>
          </TouchableOpacity>
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
  map: {
    width: width,
    height: height,
    // backgroundColor: 'blue',
  },
  image: {
    width: width,
    height: height / 1.4,
    // backgroundColor: 'red',
  },
  searchBar: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 10,
    width: width,
    // backgroundColor:'blue',
    marginTop: 35,
    justifyContent: 'center',
  },
  back: {
    // backgroundColor:'red',
    // marginTop: 35,
    marginLeft: 15,
    marginTop: 13,
    flex: 2,
  },
  close: {
    position: 'absolute',
    zIndex: 10,
    // backgroundColor: 'black',
    width: 20,
    height: 40,
    marginTop: 10,
    right: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  information: {
    position: 'absolute',
    zIndex: 10,
    height: height / 2.5,
    width: width,
    backgroundColor: 'white',
    top: height - height / 2.5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    // backgroundColor:'blue',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: 'black',
  },
  body: {
    flexDirection: 'column',
    width: '100%',
    paddingTop: 5,
    paddingBottom: 5,
    // backgroundColor:'blue',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    width: width,
    // backgroundColor:'red',
    alignItems: 'center',
    marginBottom: 10,
    paddingRight: 5,
  },
  icon: {
    marginLeft: 20,
    marginRight: 8,
    width: 19,
    height: 19,
    // backgroundColor: 'blue',
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    color: '#383838',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'yellow',
  },
  searchBar: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 10,
    width: width,
    // backgroundColor:'blue',
    marginTop: 35,
    justifyContent: 'center',
  },
});
function mapStateToProps(state) {
  return {
    Post: state.Post,
  };
}
export default connect(mapStateToProps)(PostEditScreen);
