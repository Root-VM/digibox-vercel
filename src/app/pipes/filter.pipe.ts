import { Pipe, PipeTransform } from '@angular/core';
import {AnswerInterface} from "../interfaces/chat";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: AnswerInterface[], filter: Array<string>): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item =>  filter.some(v => item.control_type.includes(v) ));
  }

}
