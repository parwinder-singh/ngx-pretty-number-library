import { NgModule } from '@angular/core';
import { PrettyNumberDirective } from './pretty-number.directive';
import {DecimalPipe} from '@angular/common';

@NgModule({
  declarations: [PrettyNumberDirective],
  imports: [],
  exports: [PrettyNumberDirective],
  providers: [DecimalPipe]
})
export class PrettyNumberModule { }
