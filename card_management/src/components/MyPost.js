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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Item from '../components/Item';
import Axios from 'axios';

const api = Axios.create({
  baseURL: 'http:///10.0.2.2:8000/api/',
});

class MyPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      data_temp: [],
      search: '',
    };
  }

  componentDidMount() {
    this.loadDataAll();
    this._stopAutoPlay();
    this._startAutoPlay();
  }
  _goToNextPage = () => {
    try {
      if (this.props.ReFreshMyPost == true) {
        this.props.dispatch({
          type: 'setReFreshMyPost',
          value: false,
        });
        this.loadDataAll();
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

  loadDataAll = async () => {
    var id = await AsyncStorage.getItem('@IdUser:key');
    api
      .post('kiemtraid', {
        TenDangNhap: id,
      })
      .then((res) => {
        if (res.data.length > 0) {
          api
            .post('dsbaidangcuatoi', {
              IdUser: res.data[0].Id,
            })
            .then((res) => {
              this.setState({
                data: res.data,
                data_temp: res.data,
              });
            });
        }
      });
  };

  renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          this.props.dispatch({
            type: 'setPost',
            value: item,
          });
          this.props.props.navigation.navigate('PostEdit');
        }}>
        <Item props={this.props.props} baidang={item} />
      </TouchableOpacity>
    );
  };

  ItemSeparatorComponent = () => {
    return <View style={{height: 10}}></View>;
  };

  _search(text) {
    let data = [];
    this.state.data_temp.map(function (value) {
      var Tieude = value.Tieude.toLowerCase();
      text = text.toLowerCase();
      if (Tieude.indexOf(text) > -1) {
        data.push(value);
      }
    });
    this.setState({
      data: data,
      search: text,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          hidden={true}
          backgroundColor="white"
          barStyle={'dark-content'}
        />
        <View style={styles.header}>
          <View style={styles.section}>
            <TextInput
              placeholder="Tìm kiếm..."
              style={{
                flex: 1,
                marginLeft: 10,
                height: 35,
                // backgroundColor: 'blue',
              }}
              value={this.state.search}
              onChangeText={(text) => this._search(text)}
            />
            <TouchableOpacity
              onPress={() => this._search('')}
              style={{
                paddingHorizontal: 10,
              }}>
              <Ionicons name="close" color="gray" size={20} />
            </TouchableOpacity>
          </View>
          <LinearGradient
            colors={['#0537ad', '#7cffed']}
            start={{x: 0, y: 1}}
            end={{x: 1, y: 0}}
            style={styles.add}>
            <TouchableOpacity
              onPress={() => this.props.props.navigation.navigate('PostAdd')}>
              <Ionicons name="add" color="white" size={25} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.flatList}>
          {(() => {
            if (this.state.data != null) {
              return (
                <FlatList
                  data={this.state.data}
                  renderItem={this.renderItem}
                  removeClippedSubviews={true}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={this.ItemSeparatorComponent}
                  showsVerticalScrollIndicator={false}
                />
              );
            }
          })()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 5,
  },
  flatList: {
    flex: 1,
    marginTop: 10,
  },
  item: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 7,
    flexDirection: 'row',
    borderRadius: 10,
  },
  image_container: {
    width: 60,
    height: 90,
  },
  image: {
    width: '100%',
    height: '100%',
    borderWidth: 5,
    borderColor: 'white',
    borderRadius: 10,
  },
  content: {
    flex: 1,
    // justifyContent: 'center',
    paddingHorizontal: 5,
    // backgroundColor:'red',
  },
  companyname: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  name: {
    // color: 'white',
    color: '#efefef',
    fontWeight: 'bold',
    fontSize: 12,
  },
  button: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    // backgroundColor: 'red',
    flexDirection: 'row',
  },
  section: {
    flex: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#f2f2f2',
    marginTop: 10,
  },
  add: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
});
function mapStateToProps(state) {
  return {
    ReFreshMyPost: state.ReFreshMyPost,
  };
}
export default connect(mapStateToProps)(MyPost);
