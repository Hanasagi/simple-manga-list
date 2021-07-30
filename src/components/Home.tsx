import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import React from 'react';
import {
  RouteProps
} from 'react-router';

import {
  BarcodeScanner
} from '@ionic-native/barcode-scanner';
import { HTTP } from '@ionic-native/http';

interface Props {
  alldata: any,
  data: any
  get: any
  update: any
  delete: any
  handleChange: any,
  create: any,
  changeDataState:any
}

class Home extends React.Component < Props > {

  constructor(props: any) {
    super(props)
    console.log(props)
  }

  state = {
    stringEncoded: '',
    dataEncode: ''
  }

  render() {

    const dataToScan = async () => {
      const data = await BarcodeScanner.scan();
      this.setState({
        stringEncoded: data.text
      })
      fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:" + this.state.stringEncoded + "&key=AIzaSyCoxS6O4YfwkNs87X59KRcoEOxZWU7Xlpg")
        .then((r) => {
          return r.json();
        })
        .then(r => {this.props.changeDataState(r)})
        .catch(function(error) {
          console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
        });
    };

    let handleSubmit = async (e:any) => {
    e.preventDefault();
    console.log()
    HTTP.get("https://www.googleapis.com/books/v1/volumes?q=isbn:" + this.props.data.ISBN + "&key=AIzaSyCoxS6O4YfwkNs87X59KRcoEOxZWU7Xlpg",{},{})
            .then(r => {
              return r.data;
            })
            .then(r => {

            this.props.changeDataState(r)
          })
           .catch(function(error) {
              console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
            });
    }

    return (
		 <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Ionic QR/Barcode Scanner Example</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        <IonButton onClick={dataToScan}>
          <strong>AAAAAAA</strong>
          </IonButton>
        </IonContent>
        <form onSubmit={handleSubmit}>
            <IonInput name="title" placeholder="title" onIonChange={this.props.handleChange}></IonInput>
            <IonInput name="volume"  placeholder="volume" onIonChange={this.props.handleChange}></IonInput>
            <IonInput name="thumbnail" placeholder="thumbnail" onIonChange={this.props.handleChange}></IonInput>
            <IonInput name="ISBN" placeholder="ISBN" onIonChange={this.props.handleChange}></IonInput>
            <input type="submit"/>
        </form>
      </IonPage >
    );
  }

};

export default Home;
