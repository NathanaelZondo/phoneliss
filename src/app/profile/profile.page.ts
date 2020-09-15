import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sim } from '@ionic-native/sim/ngx';
import { AlldataService } from '../alldata.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController,LoadingController } from '@ionic/angular';
import * as firebase from "firebase";
import { Device } from '@ionic-native/device/ngx';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
carrier
network
  constructor(private device: Device,public loadingController: LoadingController,public router:Router,private toastCtrl: ToastController,public alldata:AlldataService,private sim: Sim,private http: HttpClient,public alertController: AlertController) { 
    
    
    
    
    this.sim.getSimInfo().then(
      (info) => 
      
      {console.log('Sim info: ', info.carrierName)
      this.network=info.carrierName
    this.carrier=info.carrierName+" Cell Number"
    },
      (err) => console.log('Unable to get sim info: ', err)
    );
    
    this.sim.hasReadPermission().then(
      (info) => console.log('Has permission: ', info)
    );
    
    this.sim.requestReadPermission().then(
      () => console.log('Permission granted'),
      () => console.log('Permission denied')
    );

  }

  ngOnInit() {

  }
  profile:any ={};
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Message <strong>text</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }



  async    Register(profile){

        profile.email = this.alldata.useremail;
         profile.clientuid = this.alldata.clientuid;
       profile.creationdate =new Date();
       profile.deviceid=this.device.uuid;
         console.log(profile)
      // this.profile =profile;
      console.log(profile.phoneNum)


      if(profile.name ==undefined)
{
  let toast = this.toastCtrl.create({
    message: 'Enter your name and surname.',
    duration: 3000,
    position: 'bottom'
  });


  (await toast).present();
}

else
if((profile.phoneNum).toString().length!=10 || profile.phoneNum ==undefined)
{

  let toast = this.toastCtrl.create({
    message: 'Invalid cellphone number length.',
    duration: 3000,
    position: 'bottom'
  });


  (await toast).present(); 
}

else{



       

        console.log(this.profile)
        firebase.auth().currentUser.updateProfile({displayName:this.profile.phoneNum}).then(async res=>{
          console.log("updated")
          const loading = await this.loadingController.create({
            message: 'Please wait...',
            duration: 6000,
            spinner:"bubbles"
          });
          await loading.present();
        })

     



        firebase.firestore().collection('profile').add(this.profile).then(async response =>{ 
            // this.rez.push(JSON.parse(response['_body']));
               console.log("line 135 ",response)
            
             this.router.navigateByUrl('home')
             const toast = await this.toastCtrl.create({
              message: 'Your registration was successful.',
              duration: 3000
            });
            toast.present();
            
              } )
        
          

         

    }
  }



async confirmdetails(profile) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure that you have submitted your correct name and surname, and that \"'+profile.phoneNum +'\" is your current '+this.network+' number?',
      buttons: [
        {
          text: 'Edit',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Yes',
          handler: () => {
            console.log('Confirm Okay');
            this.Register(profile)
          }
        }
      ]
    });

    await alert.present();
  }
}


