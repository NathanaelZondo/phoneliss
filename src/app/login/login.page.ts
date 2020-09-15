import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import {  NavParams, AlertController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Device } from '@ionic-native/device/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private platform:Platform,private device: Device,public router:Router,
    public alertCrtl: AlertController,
    public toastCtrl:ToastController,public loadingController:LoadingController) {

    
     }

  ngOnInit() {
  }
  user:any = {} 
  fun(user)
  {
  console.log(user)
  firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(async result => {
    console.log(result.user.emailVerified,'user logged in');

    console.log('Device UUID is: ' + this.device.uuid);
   
    

    if(result.user.emailVerified ==false)
    {
      const alert = await this.alertCrtl.create({
        header: 'Login Error!',
        message: "Your email address has not yet been verified. Check your emails.",
        buttons: ['Dismiss']
      });
  
      await alert.present();
    }
    else
    if(result.user.uid )
    {
      this.router.navigateByUrl('home');
      const toast =  this.toastCtrl.create({
        message: 'Login Successful!',
        duration: 9000
      });
  
  (await toast).present()

     
    
    }



  {
  
  }
  }).catch(async error=> {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;

    console.log(error.message)

    const alert = await this.alertCrtl.create({
      header: 'Login Error!',
      message: error.message,
      buttons: ['Dismiss']
    });

    await alert.present();
    // let alert = this.alertCrtl.create({
    // title: errorCode,
    //   subTitle: errorMessage,
    //   buttons: ['Try Again']
    // })
    // alert.present();
   // ...
  });
  
  }
  
  register(){
    this.router.navigateByUrl('register')
  }

emaillink()
{



  console.log('clicked')
  var actionCodeSettings = {
    
    url:  'http://localhost:8100', // url: 'myfirebase-1b0b9.web.app',
    handleCodeInApp: true
  
  };


  firebase.auth().sendSignInLinkToEmail('fumanizondo@gmail.com', actionCodeSettings)
  .then(function() {

    console.log('it worked')
    // The link was successfully sent. Inform the user.
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', 'fumanizondo@gmail.com');
  })
  .catch(function(error) {
    // Some error occurred, you can inspect the code: error.code
    console.log(error)
  });




}

}
