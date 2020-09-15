import { Injectable } from '@angular/core';
import { AlertController, Config } from '@ionic/angular';
import * as firebase from 'firebase';


@Injectable({
  providedIn: 'root'
})
export class AlldataService {

  constructor(public alertController: AlertController) { 
 
  }



  location
  name;
  phoneNum;
  surname;

distance
duration
start
end
useremail
clientuid
creationdate=(new Date()).toString()
userprofile:any ={}
budget=0
fruit =[]
grocerytotal=0
grocerydata=[]
grocerylength =0
fewds()
{
  // console.log(email,clientuid,cdate)
     console.log(this.useremail,
      this.clientuid,
        this.creationdate )
}

}
