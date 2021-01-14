import React, { Component } from 'react'
import { FlatList, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import * as firebase from "firebase";
import { firebaseConfig } from "./Firebase";


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


export default class Fetch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      listKey: [],
      pressed: false,
      alertToggle: true,
      tempId: 0,
    }
    this.handleClick = this.handleClick.bind(this);
    this.remove = this.remove.bind(this);
  }


  componentDidMount() {

    firebase.database()
      .ref('orders')
      .on('value', (snapshot) => {
        var li = [];
        var lk = [];
        snapshot.forEach((child) => {
          lk.push({
            key: child.key,
          })
          li.push({
            key: child.key,
            id: li.length,
            address: child.val().address,
            city: child.val().city,
            email: child.val().email,
            firstName: child.val().firstName,
            items: child.val().items,
            lastName: child.val().lastName,
            phone: child.val().phone,
            zipCode: child.val().zipCode,
            price: child.val().price,
            date: child.val().date,
          })
        })
        this.setState({ list: li })
        this.setState({ listKey: lk })
      })
  }

  handleClick() {
    this.setState(state => ({
      pressed: !state.pressed
    }));
    this.state.pressed ? alert('true') : alert('false');
  }

  remove(id) {
    firebase.database()
      .ref('orders').child(this.state.listKey[id].key).remove()
  }
  render() {
    return (
      <View style={styles.app}>
        <View style={this.state.alertToggle ? styles.blockHide : styles.blockShow}>
          <View style={this.state.alertToggle ? styles.alertHide : styles.alertShow}>
            <Text style={styles.alertTxt}>Czy na pewno chcesz zakończyć to zamówienie?</Text>
            <TouchableOpacity style={styles.alertDelete} onPress={() => { this.remove(this.state.tempId); this.setState(state => ({ alertToggle: !state.alertToggle })) }}>
              <Text style={styles.alertDeleteTxt}>Usuń zamówienie</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.alertBack} onPress={() => this.setState(state => ({ alertToggle: !state.alertToggle }))}>
              <Text style={styles.alertBackTxt}>Wróć</Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.list.length !== 0 ? <FlatList style={{ width: '100%' }}
          data={this.state.list}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            return (




              <View style={this.state.pressed ? styles.orderNormal : styles.orderHighlighted}>



                <View style={styles.rowOrder}>
                  <Text style={styles.rowTxtOrder}>
                    Zamówienie {item.id + 1}
                  </Text>
                  <Text style={styles.rowTxt}>
                    {item.items.replace(/,/g, '\n')}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.rowTxt}>
                    Cena:
                  </Text>
                  <Text style={styles.rowTxt}>
                    {item.price % 1 ? item.price + '0' : item.price}zł
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.rowTxt}>
                    Imię:
                  </Text>
                  <Text style={styles.rowTxt}>
                    {item.firstName}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.rowTxt}>
                    Nazwisko:
                  </Text>
                  <Text style={styles.rowTxt}>
                    {item.lastName}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.rowTxt}>
                    Ulica i numer:
                  </Text>
                  <Text style={styles.rowTxt}>
                    {item.address}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.rowTxt}>
                    Kod pocztowy:
                  </Text>
                  <Text style={styles.rowTxt}>
                    {item.zipCode}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.rowTxt}>
                    Miasto:
                  </Text>
                  <Text style={styles.rowTxt}>
                    {item.city}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.rowTxt}>
                    Email:
                  </Text>
                  <Text style={styles.rowTxt}>
                    {item.email}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.rowTxt}>
                    Telefon:
                  </Text>
                  <Text style={styles.rowTxt}>
                    {item.phone}
                  </Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.rowTxt}>
                    Data:
                  </Text>
                  <Text style={styles.rowTxt}>
                    {item.date}
                  </Text>
                </View>

                <View style={styles.bttn}>
                  <TouchableOpacity style={this.state.pressed ? styles.doneNormal : styles.doneHighlighted} onPress={() => { this.setState(state => ({ alertToggle: !state.alertToggle })); this.setState({ tempId: item.id }) }}>
                    <Text style={this.state.pressed ? styles.txtBttnNormal : styles.txtBttnHighlighted}>Gotowe</Text>
                  </TouchableOpacity>
                </View>

              </View>


            )
          }}
        /> : <Text style={styles.empty}>Brak zamówień</Text>}

      </View>
    )
  }
}


const styles = StyleSheet.create({
  blockHide: {
    display: 'none',
  },
  blockShow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    zIndex: 2,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(100, 100, 100, 0.9)',
    borderColor: 'black',
    borderWidth: 1,
    borderStyle: 'solid',
  },
  alertTxt: {
    margin: 10,
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  alertBack: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#007bff',
    borderRadius: 5,
    padding: 5,
    paddingBottom: 10,
    paddingTop: 10,
    margin: 5,
  },
  alertBackTxt: {
    fontWeight: 'bold',
  },
  alertDelete: {
    backgroundColor: '#e82a2a',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#007bff',
    borderRadius: 5,
    padding: 5,
    paddingBottom: 10,
    paddingTop: 10,
    margin: 5,
  },
  alertDeleteTxt: {
    color: 'white',
    fontWeight: 'bold',
  },
  alertHide: {
    display: 'none',
  },
  alertShow: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#007bff',
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    elevation: 3,
    zIndex: 3,
    padding: 10,
  },
  rowTxtOrder: {
    margin: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 36,
  },
  rowOrder: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
  },
  rowTxt: {
    margin: 10,
    fontWeight: 'bold',
    fontSize: 15,
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#007bff',
    alignItems: 'center',
  },
  menuBttn: {
    display: 'flex',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#000',
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  menuTxt: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
  },
  orderNormal: {
    display: 'flex',
    backgroundColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 10,
    margin: 10,
    padding: 20,
  },
  orderHighlighted: {
    display: 'flex',
    backgroundColor: '#007bff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 10,
    margin: 10,
    padding: 20,
  },
  txtNormal: {
    color: 'blue',
    fontWeight: 'bold',
  },
  txtHighlighted: {
    color: 'white',
    fontWeight: 'bold',
  },
  txtBttnNormal: {
    color: 'white',
    fontWeight: 'bold',
  },
  txtBttnHighlighted: {
    color: 'black',
    fontWeight: 'bold',
  },
  doneNormal: {
    backgroundColor: '#007bff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 30,

  },
  doneHighlighted: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 30,
  },
  bttn: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 40
  },
  app: {
    marginTop: 50,
  },
  empty: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
  },
});
