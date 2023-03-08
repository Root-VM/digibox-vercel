import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AnswerInterface, ChatDataInterface} from "../../../../interfaces/chat";
import {FormControl, Validators} from "@angular/forms";
import {CustomerService} from "../../../../services/customer.service";
import {stringReplace} from "../../../../methods/string-replace";
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DatePipe} from "@angular/common";
import * as moment from "moment";
export const MY_FORMATS = {
  parse: {
    dateInput: "DD.MM.YYYY"
  },
  display: {
    dateInput: "DD.MM.YYYY",
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};
@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe
  ]
})
export class ControlsComponent implements OnInit, OnDestroy {
  @Input() data: ChatDataInterface[] | [] = [];
  currentId: number | undefined;
  subscription : Subscription = new Subscription();
  controls: AnswerInterface[] = [];

  inputValidation = new FormControl('', []);
  inputValue = '';

  dropValidation = new FormControl('', []);
  dropValue = '';
  dropControl: AnswerInterface | null = null;

  outletControl: AnswerInterface | null = null;
  outletRequired = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(() => this.generateControls());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  generateControls() {
    // clear
    this.controls = [];
    this.inputValidation = new FormControl('', []);
    this.inputValue = '';
    this.dropValidation = new FormControl('', []);
    this.dropValue = '';
    this.dropControl= null;
    this.outletControl= null;
    this.outletRequired = false;

    setTimeout(() => {
      if(this.data.length) {
        const progress_query = Number(this.route.snapshot.queryParams?.['progress']);
        const current_data = this.data.find(val => val.id === progress_query)

        if(progress_query && current_data) {
          const answers = current_data?.answers.map(val => {
            return {...val, group_id: current_data.id, step: current_data.step}
          });

          this.currentId = current_data?.id;
          this.controls = answers;

          const input_control = this.controls.find(val => val.control_type === 'input');

          if(!!input_control) {
            this.setInputValidation(input_control);
            return;
          }

          const input_control_a = this.controls.find(val => val.control_type === 'input-autocomplete');

          if(!!input_control_a) {
            this.setInputValidation(input_control_a);
            return;
          }

          const drop_control = this.controls.find(val => val.control_type === 'dropdown-item');

          if(!!drop_control) {
            this.setDropValidation(drop_control);
            return;
          }

          const outlet = this.controls.find(val => val.control_type === 'outlined-button-item');

          if(!!outlet) {
            if(outlet?.control_validation === 'required') {
              this.outletRequired = true;
            }
            return;
          }
        }
      }
    })
  }

  setInputValidation(control: AnswerInterface) {
    if(control.control_validation === 'required') {
      this.inputValidation.setValidators([Validators.required, Validators.minLength(3)])
    }
    if(control.control_validation === 'email') {
      this.inputValidation.setValidators([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
    }
    if(control.control_validation === 'phone') {
      this.inputValidation.setValue('+41')
      this.inputValidation.setValidators([Validators.required, Validators.pattern(/(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/)])
    }
    if(control.control_validation === 'zip_code') {
      this.inputValidation.setValidators([Validators.required,  Validators.min(1000),
        Validators.max(9999), Validators.pattern(/^\d+$/)])
    }
  }

  setDropValidation(control: AnswerInterface) {
    if(control.control_validation === 'required') {
      this.dropValidation.setValidators([Validators.required])
    }
  }

  async onInput (e: any) {
    if(e?.source?.value) {
      this.inputValue = e.source.value;
    } else {
      this.inputValue = e.target.value;
    }

    if(e?.target?.value?._i?.year) {
      this.inputValue = moment(e?.target?.value).format('DD.MM.YYYY');
    }
  }

  async onDrop (e: any | AnswerInterface) {
    this.dropValue = e.value.user_message;
    this.dropControl = e.value;

    await this.onSelect(e.value);
  }

  async onOutlet (control: AnswerInterface) {
    this.outletControl = control;

    const next: any = control?.next_step?.data;

    next?.id && await this.router.navigate([], {
      relativeTo: this.route, queryParamsHandling: 'merge',
      queryParams: {
        progress: next?.id,
        step: next?.attributes?.step
      },
    });

    await control?.user_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: control.id,
      next_id: next?.id ? next?.id : 0,
      type: 'user',
      text: control.user_message,
      text_pdf: control.user_pdf_message,
      // @ts-ignore
      step: control.step,
      is_multiple: true,
    })

    await control?.bot_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: 0,
      next_id: 0,
      type: 'bot',
      text: control.bot_message,
      text_pdf: '',
      // @ts-ignore
      step: control.step
    });
  }


  async onInputNext() {
    let inputControlArray: any = [];
    let new_control;

    if(!inputControlArray.length) {
      inputControlArray = this.controls.filter(el => el.control_type === 'input')
    }

    if(!inputControlArray.length) {
      inputControlArray = this.controls.filter(el => el.control_type === 'input-autocomplete')
    }

    if(this.inputValidation.errors || !inputControlArray?.length) {
      return;
    }

    new_control = inputControlArray[0];

    if(new_control.bot_message) {
      new_control.bot_message = stringReplace(new_control.bot_message, this.inputValue);
    }
    if(new_control.user_message) {
      new_control.user_message = stringReplace(new_control.user_message, this.inputValue);
      new_control.user_pdf_message = stringReplace(new_control.user_pdf_message, this.inputValue);
    }

    await this.onSelect(new_control);
    await this.generateControls();
  }

  async onDropNext(btn: AnswerInterface) {
    if(this.dropValidation.errors || !this.dropControl) {
      return;
    }
    await this.onSelect(btn);
  }

  async onOutletNext(btn: AnswerInterface) {
    if(!this.outletControl && this.outletRequired) {
      return;
    }
    await this.onSelect(btn);
  }

  async onSelectQuestion(control: AnswerInterface) {
    const next: any = control?.next_step?.data;

    next?.id && await this.router.navigate([], {
      relativeTo: this.route, queryParamsHandling: 'merge',
      queryParams: {
        progress: next.id,
        step: next?.attributes?.step
      },
    });

    await control?.user_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: control.id,
      next_id: next?.id ? next.id : 0,
      type: 'user-q',
      text: control.user_message,
      text_pdf: control.user_pdf_message,
      // @ts-ignore
      step: control.step,
    })

    await control?.bot_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: 0,
      next_id: 0,
      type: 'bot-q',
      text: control.bot_message,
      text_pdf: '',
      // @ts-ignore
      step: control.step
    });
  }

  async onSelect( control: AnswerInterface) {
    const next: any = control?.next_step?.data;

    next?.id && await this.router.navigate([], {
      relativeTo: this.route, queryParamsHandling: 'merge',
      queryParams: {
        progress: next?.id,
        step: next?.attributes?.step
      },
    });

    await control?.user_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: control.id,
      next_id: next?.id ? next?.id : 0,
      type: 'user',
      text: control.user_message,
      text_pdf: control.user_pdf_message,
      // @ts-ignore
      step: control?.step,
    })

    await control?.bot_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: 0,
      next_id: 0,
      type: 'bot',
      text_pdf: '',
      text: control.bot_message,
      // @ts-ignore
      step: control.step
    });
  }

  isControlDisabled(id: number) {
    const progress_query = Number(this.route.snapshot.queryParams?.['progress']);
    const progress = this.customerService.getProgress();

    if(progress?.length) {
      return  !!progress.find(el => el.id === progress_query && el.answer_id === id);
    }
    return false;
  }

  filterByType(data: AnswerInterface[], type: 'button-next' | 'outlined-button-item' | 'dropdown-item' | 'circle' | 'input' | 'input-autocomplete') {
    return data.filter(el => el.control_type === type)
  }
}
