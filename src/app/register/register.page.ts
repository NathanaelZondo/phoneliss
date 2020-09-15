import { Component, OnInit } from '@angular/core';

import * as firebase from 'firebase';
import {  NavParams, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(public router:Router, 
    public alertController: AlertController,
    public toastCtrl:ToastController,public loadingController:LoadingController) { }

  ngOnInit() {
  }
  user:any = {} 
  async fun(user)
  {
  console.log(user.email)

  if(user.email ==undefined || user.password ==undefined)
  {
console.log('problem')

const alert = await this.alertController.create({
  header: 'Registration Error!',
  message: 'Email address and password are required.',
  buttons: ['OK']
});

await alert.present();


  }
else
{

 firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(async res=>{
     const toast =  this.toastCtrl.create({
    message: 'Registration Successful!',
    duration: 9000
  });

(await toast).present()
 this.router.navigateByUrl('profile') 
 }).catch( async err=>{
   console.log(err)
   const alert = await this.alertController.create({
    header: 'Registration Error!',
    message: err.message,
    buttons: ['OK']
  });
  
  await alert.present();


 }).finally(() =>{
   console.log("finally")
 })


}
  
  
  }
  
  login(){
    
    this.router.navigateByUrl('login')
  }

}
