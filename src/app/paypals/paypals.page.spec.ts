import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaypalsPage } from './paypals.page';

describe('PaypalsPage', () => {
  let component: PaypalsPage;
  let fixture: ComponentFixture<PaypalsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaypalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
