import { Component } from '@angular/core';
import { firebaseConfig} from '../app/env';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import * as firebase from 'firebase';
import { LoadingController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { AlldataService } from './alldata.service';
import { ModalController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import {ListPage} from '../app/list/list.page';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  map: any;
  address:string;
  lat: string;
  long: string;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;





  constructor( private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder, 
    private router:Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public toastcontroller:ToastController,private sqlite: SQLite, public modal:ModalController,public data:AlldataService,public alertController: AlertController,public loadingController:LoadingController
  ) {



    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];

    firebase.initializeApp(firebaseConfig)
  
firebase.auth().onAuthStateChanged(user=>{



if(user != null)
{
   this.loada()
   
  console.log('user')
this.data.clientuid=user.uid
this.data.useremail=user.email
this.router.navigateByUrl('home');

firebase.firestore().collection('profile').where('clientuid','==',user.uid).get().then(res=>{
console.log(res)

if(res.empty ==true)
{

this.router.navigateByUrl('profile'); 
}


  res.forEach(val=>{
    console.log('profile = ',val.data())

    this.data.location=val.data().location
  this.data.name=val.data().name
    this.data.phoneNum=val.data().phoneNum
    this.data.surname=val.data().surname

  })
 })  


}
else
{
  console.log('nouser')
  this.router.navigateByUrl('login');
}
})




    this.initializeApp();

  
  
  }




  async loada()
  {
 const load = await this.loadingController.create({spinner:'bubbles',
    duration:3000,
    

  })

  load.present()
load.onDidDismiss().then(res=>{
  this.presentAlertRadio()
})
  }
 
 
  shoppinglist:any;
  selectedshop;

  
  
  
    
  
  
  
    async presentAlertRadio() {
      const alert = await this.alertController.create({
        header: 'Select Provider',
        backdropDismiss:false,
        inputs: [
          {
            name: 'radio1',
            type: 'radio',
            label: 'Provider 1',
            value: 'checkers',
            checked: true
          },
          // {
          //   name: 'radio2',
          //   type: 'radio',
          //   label: 'Checkers',
          //   value: 'checkers'
          // },
          // {
          //   name: 'radio2',
          //   type: 'radio',
          //   label: 'Makro',
          //   value: 'makro'
          // },
          // {
          //   name: 'radio2',
          //   type: 'radio',
          //   label: 'Woolworths',
          //   value: 'woolies'
          // },
          
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
              this.selectedshop='Pick n Pay';
             
              
            }
          }, {
            text: 'Ok',
            handler: (data) => {
             console.log(data)
             this.selectedshop=data;
             
             this.presentCategories()
            
          
            }
          }
        ]
      });
  
      await alert.present();
    }
  
  
    async additem(item)
    {
      console.log(item)
  
      if(this.data.budget==0)
      {
        this.presentAlertPrompt()
      }
      else
      {
      this.data.grocerydata.push(item)
      this.data.grocerylength =this.data.grocerydata.length;
      this.data.grocerytotal=Math.floor((this.data.grocerytotal+parseFloat(item.price))*100)/100;
      console.log(this.data.grocerytotal)
  
      const toast = await this.toastcontroller.create({
        message: item.productName+' added to list.',
        duration: 3000
      });
      toast.present();
      }
    this.presentAlert()
    }
  
  
    async presentAlertPrompt() {
      const alert = await this.alertController.create({
        header: 'Enter your budget.',
        inputs: [
          {
            name: 'budget',
            type: 'number',
            placeholder: '00.00'
          }
     
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (budget) => {
              console.log('Confirm Ok',parseFloat(budget.budget));
              this.data.budget=parseFloat(budget.budget);
            }
          }
        ]
      });
  
      await alert.present();
    }


    async prompt() {
      const alert = await this.alertController.create({
        header: 'Delivery Address!',
        inputs: [
          {
            name: 'name1',
            type: 'text',
            placeholder: 'Enter your delivery address...'
          },
         
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: async (data) => {
              console.log(data.name1);
              this.calculateAndDisplayRoute(data.name1)
              const modal = await this.modal.create({
                component: ListPage,
                backdropDismiss:false
              });
              return await modal.present();
            }
          }
        ]
      });
  
      await alert.present();
    }


  
    async presentModal() {

      const alert = await this.alertController.create({
        header: 'Confirm Address!',
        message: 'Is '+this.data.location+' your delivery address?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
              this.prompt()
            }
          }, {
            text: 'Yes',
            handler:async () => {
              console.log('Confirm Okay');

              this.calculateAndDisplayRoute(this.data.location)
              const modal = await this.modal.create({
                component: ListPage,
                backdropDismiss:false
              });
              return await modal.present();
            }
          }
        ]
      });
  
      await alert.present();


     
    }
  myshop
    async presentCategories() {
      const alert = await this.alertController.create({
        header: 'Categories',
        inputs: [
          {
            name: 'fruit',
            type: 'radio',
            label: 'Canned',
            value: 'canned',
            checked: true
          },
          {
            name: 'cereal',
            type: 'radio',
            label: 'Cereal',
            value: 'cereal'
          },
    
          {
            name: 'deodorant',
            type: 'radio',
            label: 'Deodorant',
            value: 'deodorant'
          }
          ,
          {
            name: 'nappies',
            type: 'radio',
            label: 'Nappies',
            value: 'nappies'
          },
          {
            name: 'bottled',
            type: 'radio',
            label: 'Bottled',
            value: 'bottled'
          },
          {
            name: 'Pharm',
            type: 'radio',
            label: 'Pharmacy',
            value: 'pharmacy'
          },
          {
            name: 'eggs',
            type: 'radio',
            label: 'Eggs',
            value: 'eggs'
          },
          {
            name: 'buiscuits',
            type: 'radio',
            label: 'Biscuits',
            value: 'biscuits'
          },
          {
            name: 'sweets',
            type: 'radio',
            label: 'Sweets',
            value: 'sweets'
          },
          {
            name: 'pulses',
            type: 'radio',
            label: 'Pulses',
            value: 'pulses'
          },
          {
            name: 'bars',
            type: 'radio',
            label: 'Choc Bars',
            value: 'bars'
          },
          {
            name: 'oral',
            type: 'radio',
            label: 'Oralcare',
            value: 'oralcare'
          },
          {
            name: 'sauce',
            type: 'radio',
            label: 'Sauces',
            value: 'sauce'
          },
          {
            name: 'babyfood',
            type: 'radio',
            label: 'Baby Food',
            value: 'babyfood'
          },
          {
            name: 'snacks',
            type: 'radio',
            label: 'Snacks',
            value: 'snacks'
          },
          {
            name: 'juice',
            type: 'radio',
            label: 'Juice',
            value: 'juice'
          },
          {
            name: 'babycare',
            type: 'radio',
            label: 'Baby skin',
            value: 'babylotion'
          },
          {
            name: 'fridge',
            type: 'radio',
            label: 'Bevarages',
            value: 'fridge'
          },
  
          {
            name: 'bath',
            type: 'radio',
            label: 'Hygene',
            value: 'bath'
          },
          {
            name: 'oil',
            type: 'radio',
            label: 'Oil',
            value: 'oil'
          },
          {
            name: 'hot',
            type: 'radio',
            label: 'Hot Chocolate',
            value: 'hotchocoltae'
          },
          {
            name: 'meat',
            type: 'radio',
            label: 'meat',
            value: 'meat'
          },
          {
            name: 'coffee',
            type: 'radio',
            label: 'Coffee',
            value: 'coffee'
          },
          {
            name: 'spread',
            type: 'radio',
            label: 'Spread',
            value: 'spread'
          },
          {
            name: 'pads',
            type: 'radio',
            label: 'Sanitary Pads',
            value: 'pads'
          },
          {
            name: 'nuts',
            type: 'radio',
            label: 'Nuts',
            value: 'nuts'
          },
          {
            name: 'staple',
            type: 'radio',
            label: 'Maize & Rice',
            value: 'staple'
          },
          {
            name: 'milk',
            type: 'radio',
            label: 'Long Life',
            value: 'longlife'
          },
          {
            name: 'spice',
            type: 'radio',
            label: 'Spices',
            value: 'spice'
          },
          {
            name: 'cordials',
            type: 'radio',
            label: 'Cordials',
            value: 'cordials'
          },
          {
            name: 'wipes',
            type: 'radio',
            label: 'Wipes',
            value: 'wipes'
          },
          {
            name: 'bread',
            type: 'radio',
            label: 'Bread',
            value: 'bread'
          },
          {
            name: 'bots',
            type: 'radio',
            label: 'Baby Bottles',
            value: 'babybottles'
          },
          {
            name: 'haircolor',
            type: 'radio',
            label: 'Hair Color',
            value: 'haircolor'
          },
          {
            name: 'frozenpizza',
            type: 'radio',
            label: 'Frozen pizza',
            value: 'frozenpizza'
          },
          {
            name: 'sugar',
            type: 'radio',
            label: 'Sugar',
            value: 'sugar'
          },
          {
            name: 'dairy',
            type: 'radio',
            label: 'Dairy',
            value: 'dairy'
          },
          {
            name: 'bby',
            type: 'radio',
            label: 'Baby Essentials',
            value: 'babyessentials'
          },
          {
            name: 'water',
            type: 'radio',
            label: 'Bottled Water',
            value: 'water'
          },
          {
            name: 'shaving',
            type: 'radio',
            label: 'Shaving',
            value: 'shaving'
          },
          {
            name: 'meds',
            type: 'radio',
            label: 'Baby Meds',
            value: 'babymeds'
          },
          {
            name: 'suncare',
            type: 'radio',
            label: 'Sun Care',
            value: 'suncare'
          },
          {
            name: 'pads',
            type: 'radio',
            label: 'Frozen Fruit',
            value: 'frozenfruit'
          },
          {
            name: 'supp',
            type: 'radio',
            label: 'Supplements',
            value: 'supplements'
          },
  
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (res) => {
              console.log('Confirm Ok',res,);
              // this.data.fruit=[];
              firebase.firestore().collection('ALL').where('shop','==',this.selectedshop).where('type','==',res).get().then(res=>{
                res.forEach(val=>{
                   this.data.fruit.push(val.data())
                  console.log('Fruit = ',val.data())
                })
              })
  
  
  
  console.log(this.myshop)
          
                
        
           
                
        
              
        
  
  
  
            }
          }
        ]
      });
  
      await alert.present();
    }
  
    async search()
    {
  
      const alert = await this.alertController.create({
        header: 'Enter the name of the item you want to search.',
        inputs: [
          {
            name: 'search',
            type: 'text',
            placeholder: 'Type text here...'
          }
     
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (budget) => {
              console.log('Confirm Ok',(budget.search));
              // this.data.fruit=[];
          firebase.firestore().collection('ALL').where("productName","==",budget.search).get().then(res=>{
            res.forEach(val=>{
              // this.data.fruit.push(val.data());
              console.log("search =",val.data())
            })
          })
             
            }
          }
        ]
      });
  
      await alert.present();
  
    }
  
  
    signout()
    {

      firebase.auth().signOut().then(res=>{
console.log(res)
        this.router.navigateByUrl('login')
      });
    }
    profile()
    {
      this.router.navigateByUrl('profile')
    }
  
  
    async presentAlert() {
  
      if(this.data.grocerytotal>this.data.budget)
      {
      const alert = await this.alertController.create({
        header: 'Alert',
        subHeader: 'You have exceeded your budget!',
        // message: 'would you like to increase your budget?',
        buttons: ['OK']
      });
    
      await alert.present();
    }




    }
  

    SelectSearchResult(item) {
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };
      ///WE CAN CONFIGURE MORE COMPLEX FUNCTIONS SUCH AS UPLOAD DATA TO FIRESTORE OR LINK IT TO SOMETHING
      console.log(item)      
     this.ClearAutocomplete()
      this.calculateAndDisplayRoute(item.description)
      // const map = new 
      // // google.maps.Map(this.mapNativeElement.nativeElement, {
      //   zoom: 7,
      //   center: {lat: 41.85, lng: -87.65}
      // });
      // this.directionsDisplay.setMap(map);
    this.nativeGeocoder.forwardGeocode(item.description, options)
    .then((result: NativeGeocoderResult[]) => this.getAddressFromCoords(result[0].latitude,  result[0].longitude))
    .catch((error: any) => console.log(error));
    
    }
    
    
    //lET'S BE CLEAN! THIS WILL JUST CLEAN THE LIST WHEN WE CLOSE THE SEARCH BAR.
    ClearAutocomplete(){
      this.autocompleteItems = []
      this.autocomplete.input = ''
    }
  
 
    
  
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer;
  
  
    calculateAndDisplayRoute(description) {
      console.log(description)
      const that = this;
      this.directionsService.route({
        origin: description,
        destination: '134, Newtown Junction, Carr St &, Miriam Makeba St, Newtown',
        travelMode: 'DRIVING'
      }, (response, status) => {
  console.log(response,status)
      this.data.duration=(response.routes[0].legs[0].duration.text)
        this.data.distance=(response.routes[0].legs[0].distance.text)
      this.data.start=(response.routes[0].legs[0].start_address)
  this.data.end=(response.routes[0].legs[0].end_address)
        if (status === 'OK') {
          that.directionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
    }
  

    getAddressFromCoords(lattitude, longitude) {
      console.log("getAddressFromCoords "+lattitude+" "+longitude);
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5    
      }; 
      this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
        .then((result: NativeGeocoderResult[]) => {
          this.address = "";
          let responseAddress = [];
          for (let [key, value] of Object.entries(result[0])) {
            if(value.length>0)
            responseAddress.push(value); 
          }
          responseAddress.reverse();
          for (let value of responseAddress) {
            this.address += value+", ";
          }
          this.address = this.address.slice(0, -2);
        })
        .catch((error: any) =>{ 
          this.address = "Address Not Available!";
        }); 
    }

  
  


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
