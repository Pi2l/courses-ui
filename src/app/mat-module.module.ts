import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [
    BrowserModule,
    MatButtonModule,
    MatInputModule,
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
  ],
  declarations: [
  ],
})
export class MaterialModule {};