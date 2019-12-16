import { NgModule } from '@angular/core';
import { PrettyNumberComponent } from './pretty-number.component';
import { PrettyNumberDirective } from './pretty-number.directive';
import {DecimalPipe} from '@angular/common';

@NgModule({
  declarations: [PrettyNumberComponent, PrettyNumberDirective],
  imports: [],
  exports: [PrettyNumberComponent, PrettyNumberDirective],
  providers: [DecimalPipe]
})
export class PrettyNumberModule { }
