import {
    Redirect,
    Route
} from 'react-router-dom';
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
} from '@ionic/react';
import {
    IonReactRouter
} from '@ionic/react-router';
import {
    ellipse,
    square,
    triangle
} from 'ionicons/icons';
import {
    RouteComponentProps
} from 'react-router';
import Home from './components/Home'
import React from 'react'
import cheerio from 'cheerio';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@capacitor/storage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';


interface State {
    loading: boolean,
        alldata: Array < any > ,
        data: {
            title: string,
            volume: string,
            thumbnail: string,
            ISBN: string
        }
}

class App extends React.Component < any, State > {
    constructor(props: any) {
        super(props);

        this.state = {
            loading: false,
            alldata: [],
            data: {
                title: "",
                volume: "",
                thumbnail: "",
                ISBN: ""
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.getAll = this.getAll.bind(this)
        this.set = this.set.bind(this)
        /*this.get = this.get.bind(this)
        this.delete = this.delete.bind(this)*/
        this.changeDataState = this.changeDataState.bind(this)
    }
    componentDidMount() {
      Storage.set({ key: 'name' , value: 'aaaaaa'})
        let a = Storage.get({ key: 'name' }).then(r=>{
          console.log(r)
          console.log(r.value)
        })
        
    }
    getAll() {
        let key = Storage.keys().then(r => {
            r.keys.forEach(el => {
                Storage.get({ key: el }).then(r => {
                    this.state.alldata.push(r.value)
                });

            })
        })
        this.setState({
            loading: true
        }, () => {
            this.setState({
                loading: false,
            })
        });
    }

    handleSubmit(e: any) {
        e.preventDefault();
    }

    handleChange(e: any) {
        const {
            name,
            value
        } = e.target;
        this.setState({
            data: {
                ...this.state.data,
                [name]: value
            }
        });
    }
    changeDataState(r: any) {
        console.log(r.items[0], r.items[0].volumeInfo.title)
        let title = r.items[0].volumeInfo.title;
        title = title.substring(0, title.indexOf("Tome") - 1)
        let volume = r.items[0].volumeInfo.title;
        volume = volume.substring(volume.length - 1)
        let ISBN = r.items[0].volumeInfo.industryIdentifiers[1];
        let thumbnail = this.scrapeMangaCover(title, volume);

    }
    scrapeMangaCover(title: string, vol: string) {
        let transformTitle1 = (title: string) => {
            let match = title.match(/^l['ea]s?/gm) !;
            title = title.substring(match[0].length, title.length).trim();
            title = title + "-" + match;
            return title;
        }

        let transformTitle2 = (title: string) => {
            title = title.replaceAll(' ', "-");
            if (title.match(/[À-ÖØ-öø-ÿ]/gmu)) title = title.normalize("NFD").replace(/\p{Diacritic}/gu, "");

            let regex = /[^\w\s^-]/gmu;
            if (title.match(regex)) title = title.replace(regex, "");

            regex = /---/gm;
            if (title.match(regex)) title = title.replace(regex, "-");

            title = title.charAt(0).toUpperCase() + title.slice(1);
            return title;
        }
        let convertAndDownload = (link: string) => {

        }

        if (title.match(/^l['ea]s?/gm)) {
            let match = title.match(/^l['ea]s?/gm);
            title = transformTitle1(title);
        }
        title = transformTitle2(title);
        console.log("https://www.manga-news.com/index.php/manga/" + title + "/vol-" + vol)
        HTTP.get("https://www.manga-news.com/index.php/manga/" + title + "/vol-" + vol, {}, {}).then((r) => {
            console.log(r.data)
            return r.data;
        }).then(r => {
            console.log(r)
            const $ = cheerio.load(r)
            console.log($("#picinfo > a > img").attr('src'))
        }).catch(e => console.log(e.message));
    }
    set() {
        Storage.set({ key: this.state.data.title, value: JSON.stringify(this.state.data) })
        this.setState({
            data: {
                title: "",
                volume: "",
                thumbnail: "",
                ISBN: ""
            }
        })
    }

    /*get(title: string) {
        this.setState({
            data: {
                title: "Loading",
                volume: "Loading",
                thumbnail: "Loading",
                ISBN: "Loading"
            }
        }, () => {
            let result = Storage.get({ key: title }).then(r => {
              if(r!==null){
                r = JSON.parse(r.value);
                this.setState({
                    data: {
                        title: r.title,
                        volume: r.volume,
                        thumbnail: r.thumbnail,
                        ISBN: r.ISBN
                    }
                });
              }
            });
        })
    }*/


    delete(title: string) {
        Storage.remove({ key: title })
        this.setState({
            data: {
                title: "",
                volume: "",
                thumbnail: "",
                ISBN: ""
            }
        });
        this.getAll();
    }
    render() {
        const { data, alldata, loading } = this.state
        return (
            <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/home">
                <Home alldata={this.state.alldata}
                              data={this.state.data}
                              /*get={this.get}
                              delete={this.delete}
                              create={this.set}*/
                              handleChange={this.handleChange}
                              changeDataState={this.changeDataState}/>
              </Route>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/tab1">
                <IonIcon icon={triangle} />
                <IonLabel></IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tab2">
                <IonIcon icon={ellipse} />
                <IonLabel>Tab 2</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab3" href="/tab3">
                <IonIcon icon={square} />
                <IonLabel>Tab 3</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
        )
    }

}

export default App;