import { Component, OnInit } from '@angular/core';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { AlldataService } from '../alldata.service';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-paypals',
  templateUrl: './paypals.page.html',
  styleUrls: ['./paypals.page.scss'],
})
export class PaypalsPage implements OnInit {



  ngOnInit() {
  }

  constructor(private modalcont:ModalController, private data:AlldataService,private payPal: PayPal) { }
  paymentAmount: string = ((this.data.grocerytotal+(parseFloat(this.data.distance)*5.5))).toString() ;
  currency: string = 'USD';
  currencyIcon: string = '$';

  payWithPaypal() {
    console.log("Pay ????");
    this.modalcont.dismiss()


  //   this.payPal.init({
  //     PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
  //     PayPalEnvironmentSandbox: 'AQEWlh6KVAMqVwWMwbeDro__MU88dUKdisVCn1DMcp-igKMNWsWW2qvpVEW8KSNq9Zq7Dq_6AqobO6xR'
  //   }).then(() => {
  //     // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
  //     this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
  //       // Only needed if you get an "Internal Service Error" after PayPal login!
  //       //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
  //     })).then(() => {
  //       let payment = new PayPalPayment(this.paymentAmount, this.currency, 'Description', 'sale');
  //       this.payPal.renderSinglePaymentUI(payment).then((res) => {
  //         console.log(res);
  //         // Successfully paid

  //         // Example sandbox response
          
  //         // {
  //         //   "client": {
  //         //     "environment": "sandbox",
  //         //     "product_name": "PayPal iOS SDK",
  //         //     "paypal_sdk_version": "2.16.0",
  //         //     "platform": "iOS"
  //         //   },
  //         //   "response_type": "payment",
  //         //   "response": {
  //         //     "id": "PAY-1AB23456CD789012EF34GHIJ",
  //         //     "state": "approved",
  //         //     "create_time": "2016-10-03T13:33:33Z",
  //         //     "intent": "sale"
  //         //   }
  //         // }
  //       }, () => {
  //         // Error or render dialog closed without being successful
  //       });
  //     }, () => {
  //       // Error in configuration
  //     });
  //   }, () => {
  //     // Error in initialization, maybe PayPal isn't supported or something else
  //   });
   }

   

}
