import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlldataService } from '../alldata.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('mapElement',{static:false}) mapNativeElement: ElementRef;
  @ViewChild('map',  {static: false}) mapElement: ElementRef;
  map: any;
  address:string;
  lat: string;
  long: string;  
  autocomplete: { input: string; };
  autocompleteItems: any[];
  location: any;
  placeid: any;
  GoogleAutocomplete: any;

 
  constructor(private alertController:AlertController,public toastcontroller:ToastController,public load:LoadingController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,    
    public zone: NgZone,private data:AlldataService
  ) {

   

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }
 
  //LOAD THE MAP ONINIT.
  ngOnInit() {
   
  }

  //LOADING THE MAP HAS 2 PARTS.
  loadMap() {
    
    //FIRST GET THE LOCATION FROM THE DEVICE.
    this.geolocation.getCurrentPosition().then((resp) => {
      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      } 
      
      //LOAD THE MAP WITH THE PREVIOUS VALUES AS PARAMETERS.
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude); 
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
      this.map.addListener('tilesloaded', () => {
        console.log('accuracy',this.map, this.map.center.lat());
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
        this.lat = this.map.center.lat()
        this.long = this.map.center.lng()
      }); 
    }).catch((error) => {
      console.log('Error getting location', error);
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

  //FUNCTION SHOWING THE COORDINATES OF THE POINT AT THE CENTER OF THE MAP
  ShowCords(){
    alert('lat' +this.lat+', long'+this.long )
  }
  
  //AUTOCOMPLETE, SIMPLY LOAD THE PLACE USING GOOGLE PREDICTIONS AND RETURNING THE ARRAY.
  UpdateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
      this.zone.run(() => {
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
        });
      });
    });
  }
  
  //wE CALL THIS FROM EACH ITEM.
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

 
  //sIMPLE EXAMPLE TO OPEN AN URL WITH THE PLACEID AS PARAMETER.
  GoTo(placeid){
  
  }
  

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;


  calculateAndDisplayRoute(description) {
    console.log(description)
    const that = this;
    this.directionsService.route({
      origin: description,
      destination: '2691 Intshe Street',
      travelMode: 'DRIVING'
    }, (response, status) => {

      console.log(response.routes[0].legs[0].duration.text)
      console.log(response.routes[0].legs[0].distance.text)
      console.log(response.routes[0].legs[0].start_address)
      console.log(response.routes[0].legs[0].end_address)
      if (status === 'OK') {
        that.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

fruit=this.data.fruit

async info()
{
const ld =this.load.create({
  message:'please wait...',
  spinner:'bubbles',
  duration:3000
})
;(await ld).present()

;(await ld).onDidDismiss().then(res=>{
  console.log(this.data.fruit)
})
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

}