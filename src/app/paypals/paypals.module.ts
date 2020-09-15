import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaypalsPageRoutingModule } from './paypals-routing.module';

import { PaypalsPage } from './paypals.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaypalsPageRoutingModule
  ],
  declarations: [PaypalsPage]
})
export class PaypalsPageModule {}
