import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaypalsPage } from './paypals.page';

const routes: Routes = [
  {
    path: '',
    component: PaypalsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaypalsPageRoutingModule {}
