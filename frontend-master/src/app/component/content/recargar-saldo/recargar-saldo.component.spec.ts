import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecargarSaldoComponent } from './recargar-saldo.component';

describe('RecargarSaldoComponent', () => {
  let component: RecargarSaldoComponent;
  let fixture: ComponentFixture<RecargarSaldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecargarSaldoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecargarSaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
