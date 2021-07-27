import { 
  IonContent, 
  IonInput, 
  IonButton, 
  IonItem, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar } from '@ionic/react';
import React from 'react';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

class Home extends React.Component {

  state = {
    stringEncoded: '',
    encodeResponse: 'Hello World',
    dataEncode: ''
  }

  handleChange = (e: any) => {
    const { value, name } = e.target;
    this.setState({ 
      [name]: value }
    );
    console.log(this.state);
  };

  render() {

    const dataToScan = async () => {
      const data = await BarcodeScanner.scan();
      alert(JSON.stringify(data));
      this.setState({ stringEncoded: data.text })
      fetch("https://openlibrary.org/api/books?bibkeys=ISBN:"+this.state.stringEncoded+"&jscmd=details&format=json").then((r)=>{
                               return r.json();
                          }).then(r=>alert(JSON.stringify(r))).catch(function(error) {
                               alert('Il y a eu un problème avec l\'opération fetch: ' + error.message);
                             });
    };

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Ionic QR/Barcode Scanner Example</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

          <strong>Scan Content</strong>

          <IonButton color="danger" expand="block" onClick={dataToScan}>
              Scan Data 
          </IonButton>

        </IonContent>
      </IonPage >
    );
  }

};

export default Home;