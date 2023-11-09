import { Pipe, PipeTransform } from '@angular/core';
import {AnswerInterface} from "../interfaces/chat";

@Pipe({
  name: 'filter_autocomplete'
})
export class FilterAutocompletePipe implements PipeTransform {

  transform(items: AnswerInterface[], filter: Array<string>): any {
    if (!items || !filter) {
      return items;
    }

    return items.filter(item => item.control_type === 'input-autocomplete');
  }

}
