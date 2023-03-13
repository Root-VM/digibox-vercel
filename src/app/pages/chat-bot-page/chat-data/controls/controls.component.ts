import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AnswerInterface, ChatDataInterface} from "../../../../interfaces/chat";
import {FormControl, FormGroup, Validators} from "@angular/forms";
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
  form: any = new FormGroup({});
  currentId: number | undefined;
  subscription : Subscription = new Subscription();
  controls: AnswerInterface[] = [];

  dropValidation = new FormControl('', []);
  dropValue = '';
  dropControl: AnswerInterface | null = null;

  outletControl: AnswerInterface | null = null;
  outletRequired = false;
  isPersonIdentifying = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
  ) {}

  ngOnInit() {
    // setInterval(() => console.log(this.form), 5000)
    this.subscription = this.route.queryParams.subscribe(() => this.generateControls());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  generateControls() {
    // clear
    this.controls = [];
    this.form = new FormGroup({});
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
          let chat_data = [];
          console.log(1, current_data)

          if(current_data?.person_identifying?.length) {
            chat_data = current_data?.person_identifying.map(val => {
              return {...val, group_id: current_data.id, step: current_data.step}
            });
            this.isPersonIdentifying = true;
          } else {
            chat_data = current_data?.answers.map(val => {
              return {...val, group_id: current_data.id, step: current_data.step}
            });
            this.isPersonIdentifying = false;
          }

          this.currentId = current_data?.id;
          this.controls = chat_data;

          console.log(132, this.controls);

          const input_control = this.controls.find(val => val.control_type === 'input');

          const el_controls = chat_data.filter(el => el?.control_type !== 'button-next' && el?.control_type !== 'dropdown-item')
          const el_drop_ctrl = chat_data.find (el => el?.control_type === 'dropdown-item');

          // set controls
          for (let el of [...el_controls, el_drop_ctrl]) {
            if(el) {
              this.form.addControl(el.id.toString(), this.getInputValidation(el?.control_validation))
            }
          }

          // if(!!input_control) {
          //   this.setInputValidation(input_control);
          //   return;
          // }
          //
          // const input_control_a = this.controls.find(val => val.control_type === 'input-autocomplete');
          //
          // if(!!input_control_a) {
          //   this.setInputValidation(input_control_a);
          //   return;
          // }
          //
          // const drop_control = this.controls.find(val => val.control_type === 'dropdown-item');
          //
          // if(!!drop_control) {
          //   this.setDropValidation(drop_control);
          //   return;
          // }
          //
          // const outlet = this.controls.find(val => val.control_type === 'outlined-button-item');
          //
          // if(!!outlet) {
          //   if(outlet?.control_validation === 'required') {
          //     this.outletRequired = true;
          //   }
          //   return;
          // }
        }
      }
    })
  }

  getInputValidation(type: string | undefined) {
    if(type === 'required') {
      return new FormControl('', [Validators.required, Validators.minLength(3)])
    }
    if(type === 'email') {
      return new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])
    }
    if(type === 'phone') {
      return new FormControl('+41',[Validators.required, Validators.pattern(/(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/)]);
    }
    if(type === 'zip_code') {
      return new FormControl('', [Validators.required,  Validators.min(1000),
        Validators.max(9999), Validators.pattern(/^\d+$/)]);
    }

    return new FormControl('', [Validators.required])
  }

  setDropValidation(control: AnswerInterface) {
    if(control.control_validation === 'required') {
      this.dropValidation.setValidators([Validators.required])
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

  async onInput (e: any) {
    console.log(123, e);
    // if(e?.source?.value) {
    //   this.inputValue = e.source.value;
    // } else {
    //   this.inputValue = e.target.value;
    // }
    //
    // if(e?.target?.value?._i?.year) {
    //   this.inputValue = moment(e?.target?.value).format('DD.MM.YYYY');
    // }
  }

  async onGroupSelect(answers: Array<AnswerInterface>) {
    console.log(888, answers);
    console.log(999, this.form);

    // return;

    for (let answer of answers) {
      const value = this.form.controls[answer.id];

      if(value?.value) {
        answer.group_id = Number(String(answer.group_id) + String(answer.id));

        if(answer?.control_type === 'input' || answer?.control_type === 'input-autocomplete') {
          if(answer?.control_text === "Geburtsdatum") {
            value.value = moment(value.value).format('DD.MM.YYYY')
          }

          if(answer.bot_message) {
            answer.bot_message = stringReplace(answer.bot_message, value?.value);
          }
          if(answer.user_message) {
            answer.user_message = stringReplace(answer.user_message, value?.value);
            answer.user_pdf_message = stringReplace(answer.user_pdf_message, value?.value);
          }

          await this.onSelect(answer);
        } else {
          await this.onSelect(answer);
        }
      }

      // next btn
      if(answer.control_type === "button-next" && answer.next_step?.data?.id) {
        await this.onSelect(answer);
      }
    }
  }

  async onSelect( control: AnswerInterface) {
    console.log(control.id, control)
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

  filterByType(data: AnswerInterface[], type: 'button-next' | 'outlined-button-item' | 'dropdown-item' | 'circle' | 'input' | 'input-autocomplete'): any {
    return data.filter(el => el.control_type === type)
  }
}
