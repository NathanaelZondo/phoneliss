import { Component, OnInit } from '@angular/core';
import { AlldataService } from '../alldata.service';
import { ToastController,Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { LoadingController,AlertController } from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Observable } from 'rxjs';
import { DatabaseService, Dev } from '../../app/services/database.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Router } from '@angular/router';
import {PaypalsPage} from '../paypals/paypals.page';
@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage   {
  button1:boolean =false;
  button2:boolean=false;
item:any ={};
  pdfObj = null;
  constructor(public alertController:AlertController,public router:Router, private db: DatabaseService,public loadingController: LoadingController,public toastController: ToastController,public data:AlldataService,public modalController: ModalController,private plt: Platform, public fileOpener: FileOpener,private file: File) {

   

   }
delivery=parseFloat(this.data.distance.slice(0, -2))*5.5

ionViewDidLoad()
{
  this.data.duration
  this.data.distance
this.data.start
this.data.end

}


 async delitem(item,index)
  {
console.log(parseFloat(item.price),index)
this.data.grocerytotal =Math.floor((this.data.grocerytotal-parseFloat(item.price))*100)/100
const toast = await this.toastController.create({
  message: item.productName +' removed.\nR'+item.price +' deducted from your total.',
  duration: 4000
});
toast.present();

this.data.grocerydata.splice(index,1);
this.data.grocerylength=this.data.grocerydata.length
  }






  close()
  {
console.log('close')
this.modalController.dismiss()
  }



 async createPdf() {


var shoppinglist =[];

for(let x =0;x<this.data.grocerydata.length;x++)
{
  
  
  
  

  shoppinglist.push([this.data.grocerydata[x].productName+'\t'+'R'+this.data.grocerydata[x].price+'\t'+this.data.grocerydata[x].shop]);
  console.log('shopping List',shoppinglist)

}



    var docDefinition = {
      content: [
        { text: 'Shopping List: ', style: 'header',alignment:'center' },
       
      
 
        { text: 'Your Budget: '+'R'+ this.data.budget.toString()+'\n \n' , style: 'subheader' },
 
      
    
 
 
        {
          ul: shoppinglist
          
        },
        { text: 'Delivery Cost: '+'R'+((parseFloat(this.data.distance)*5.5)).toString(),alignment: 'right' },
        { text: 'Product Cost: '+'R'+(this.data.grocerytotal).toString(),alignment: 'right' },
        { text: 'Total Cost: '+'R'+(this.data.grocerytotal+(parseFloat(this.data.distance)*5.5)).toString(),alignment: 'right' },
      

        
        { text: 'Distance: '+this.data.distance, alignment: 'left' },
        { text:'Duration: '+ this.data.duration, alignment: 'left' },
        { text: 'Customer Address: '+ this.data.start, alignment: 'left'},
        { text: 'Producer Address: '+this.data.end, alignment: 'left'},
        { text: 'Customer Email: '+this.data.useremail, alignment: 'left' },
        { text:'Customer Cell: '+ this.data.phoneNum, alignment: 'left' },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          
        
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    }


    this.pdfObj = pdfMake.createPdf(docDefinition);

    const toast = await this.toastController.create({
      message: 'Pdf successfully created...',
      duration: 2000
    });
    toast.present();

    toast.onDidDismiss().then(async res=>{
      this.downloadPdf()
      const loading = await this.loadingController.create({
        message: 'Downloading pdf...',
        duration: 4000,
        spinner:'crescent'
      });
      await loading.present();

      loading.onDidDismiss().then(res=>{
        
      })
      
    })

  }

  async downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
 
        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.dataDirectory, 'myletter.pdf', blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + 'myletter.pdf', 'application/pdf');
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();





      const loading = await this.loadingController.create({
        message: 'Finalizing...',
        duration: 4000,
        spinner:'crescent'
      });
      await loading.present();

      loading.onDidDismiss().then(res=>{
        this.presentAlert()
      })
      
    
    }
  }
  

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Payment successful',
      message: 'Send the list to the provider to process your order.',
      buttons: ['OK']
    });

    await alert.present();
  }



  ngOninit()
  {
  
  }


  async pay()
{
  const modal = await this.modalController.create({
    component: PaypalsPage,
  
  });
 modal.onDidDismiss().then(res=>{
  this.createPdf()
   console.log("dismissed")
  
 })
  return await modal.present();


}







}







