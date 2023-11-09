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
  selector: 'app-controls-edit',
  templateUrl: './controls-edit.component.html',
  styleUrls: ['./controls-edit.component.scss'],
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
export class ControlsEditComponent implements OnInit, OnDestroy {
  @Input() data: ChatDataInterface[] | [] = [];
  form: any = new FormGroup({});
  isLinkEdit = false;
  currentId: number | undefined;
  subscription : Subscription = new Subscription();
  controls: AnswerInterface[] = [];

  dropValidation = new FormControl('', []);
  dropValue = '';
  dropControl: AnswerInterface | null = null;

  outletControl: AnswerInterface | null = null;
  outletRequired = false;
  isPersonIdentifying = false;
  dropElSelectedData: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
  ) {}

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(() => {
      this.generateControls();
      this.isLinkEdit = !!this.route.snapshot.queryParams?.['editLink'];
    });
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

          if(current_data?.person_identifying?.length) {
            chat_data = current_data?.person_identifying.map(val => {
              return {...val, group_id: current_data.id, step: current_data.step,
                add_next_on_edit: current_data?.add_next_on_edit,
                remove_next_on_edit: current_data?.remove_next_on_edit}
            });
            this.isPersonIdentifying = true;
          } else {
            chat_data = current_data?.answers.map(val => {
              return {...val, group_id: current_data.id, step: current_data.step,
                add_next_on_edit: current_data?.add_next_on_edit,
                remove_next_on_edit: current_data?.remove_next_on_edit,}
            });
            this.isPersonIdentifying = false;
          }

          this.currentId = current_data?.id;
          this.generateDropValue();
          this.controls = chat_data;

          const input_control = this.controls.find(val => val.control_type === 'input');

          const el_controls = chat_data.filter(el => el?.control_type !== 'button-next' && el?.control_type !== 'dropdown-item')
          const el_drop_ctrl = chat_data.find (el => el?.control_type === 'dropdown-item');

          const full_data = this.customerService.getProgress();
          // set controls
          for (let el of [...el_controls, el_drop_ctrl]) {
            if(el) {
              this.form.addControl(el.id.toString(), this.getInputValidation(el?.control_validation));

              if(full_data && el.id) {
                const found = full_data.find(val => val.answer_id == el?.id);

                console.log(1, found)
                if(found?.clear_text) {
                  this.form.patchValue({[el.id.toString()]: found?.clear_text});

                  if(el?.control_text === 'Geburtsdatum') {
                    this.form.patchValue({[el.id.toString()]: moment(found?.clear_text, "DD.MM.YYYY").toDate()});
                  }
                  if(el?.control_type === 'dropdown-item') {
                    // console.log(3, found, el);
                    this.form.patchValue({[el.id.toString()]: found});
                  }
                }

              }
            }
          }
        }
      }
    })
  }

  getInputValidation(type: string | undefined) {
    if(type === 'required') {
      return new FormControl('', [Validators.required, Validators.minLength(3)])
    }
    if(type === 'email') {
      return new FormControl('', [Validators.required, Validators.pattern("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$")])
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

  async onDrop (e: any | AnswerInterface) {
    this.dropValue = e.value.user_message;
    this.dropControl = e.value;

    await this.onSelect(e.value, true);
  }

  generateDropValue() {
    this.dropElSelectedData = [];
    this.customerService.getProgress().map(val => {
      if(val.id === this.currentId) {
        this.dropElSelectedData.push(String(val.id + ' ' + val.answer_id));
      }
    })
  }

  async onOutlet (control: AnswerInterface, isMultiple?: boolean) {
    if(!isMultiple) {
      await this.customerService.removeUserProgress(control?.group_id);
    }

    this.outletControl = control;

    const next: any = control?.next_step?.data;

    await control?.user_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: control.id,
      next_id: next?.id ? next?.id : 0,
      type: 'user',
      text: control.user_message,
      clear_text: control?.user_message_clear ? control?.user_message_clear : control.user_message,
      text_pdf: control.user_pdf_message,
      // @ts-ignore
      step: control.step,
      is_multiple: true,
      // @ts-ignore
      add_next_on_edit: control?.add_next_on_edit,
      remove_next_on_edit: control?.remove_next_on_edit,
    })

    await control?.bot_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: 0,
      next_id: 0,
      type: 'bot',
      text: control.bot_message,
      text_pdf: '',
      // @ts-ignore
      step: control.step,
      // @ts-ignore
      add_next_on_edit: control?.add_next_on_edit,
      remove_next_on_edit: control?.remove_next_on_edit,
    });

    if(control.add_next_on_edit === control.id) {
      let progress = String(next?.id);
      if(progress.length > 2) {
        progress = progress.substring(0, 2);
      }

      next?.id && await this.router.navigate([], {
        relativeTo: this.route, queryParamsHandling: 'merge',
        queryParams: {
          progress: progress,
          step: next?.attributes?.step
        },
      });
    } else {
      if(control.remove_next_on_edit) {
        await this.customerService.removeUserProgressByStep(control.remove_next_on_edit);
      }
    }

    setTimeout(() => this.generateDropValue());
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

    // next?.id && await this.router.navigate([], {
    //   relativeTo: this.route, queryParamsHandling: 'merge',
    //   queryParams: {
    //     progress: next.id,
    //     step: next?.attributes?.step
    //   },
    // });

    await control?.user_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: control.id,
      next_id: next?.id ? next.id : 0,
      type: 'user-q',
      text: control.user_message,
      clear_text: control?.user_message_clear ? control?.user_message_clear : control.user_message,
      text_pdf: control.user_pdf_message,
      // @ts-ignore
      step: control.step,
      // @ts-ignore
      add_next_on_edit: control?.add_next_on_edit,
      remove_next_on_edit: control?.remove_next_on_edit,
    })

    await control?.bot_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: 0,
      next_id: 0,
      type: 'bot-q',
      text: control.bot_message,
      text_pdf: '',
      // @ts-ignore
      step: control.step,
      // @ts-ignore
      add_next_on_edit: control?.add_next_on_edit,
      remove_next_on_edit: control?.remove_next_on_edit,
    });
  }

  async onInput (e: any) {
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

  async toPreview () {
    if(this.isLinkEdit) {
      await this.router.navigate(['/customer-edit']);
    } else {
      await this.router.navigate(['/preview']);
    }
  }

  async onGroupSelect(answers: Array<AnswerInterface>) {
    for (let answer of answers) {
      const value = this.form.controls[answer.id];

      if(value?.value) {
        answer.group_id = Number(String(answer.group_id) + String(answer.id));

        if(answer?.control_type === 'input' || answer?.control_type === 'input-autocomplete') {
          if(answer?.control_text === "Geburtsdatum") {
            value.value = moment(value.value).format('DD.MM.YYYY');
          }

          if(answer.bot_message) {
            answer.bot_message = stringReplace(answer.bot_message, value?.value);
          }
          if(answer.user_message) {
            answer.user_message = stringReplace(answer.user_message, value?.value);
            answer.user_message_clear = value?.value;
            answer.user_pdf_message = stringReplace(answer.user_pdf_message, value?.value);
          }

          await this.onSelect(answer);
        } else {
          if(answer?.control_type === 'dropdown-item' && value?.value) {
            answer.user_message_clear = value?.value?.id;
            answer = value?.value;
          }
          await this.onSelect(answer);
        }
      }

      // next btn
      if(answer.control_type === "button-next" && answer.next_step?.data?.id) {
        await this.onSelect(answer);
      }
    }
  }

  async onSelect( control: AnswerInterface, stopRedirect?:boolean) {
    const next: any = control?.next_step?.data;

    await control?.user_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: control.id,
      next_id: next?.id ? next?.id : 0,
      type: 'user',
      text: control.user_message,
      clear_text: control?.user_message_clear ? control?.user_message_clear : control.user_message,
      text_pdf: control.user_pdf_message,
      // @ts-ignore
      step: control?.step,
      // @ts-ignore
      add_next_on_edit: control?.add_next_on_edit,
      remove_next_on_edit: control?.remove_next_on_edit,
    })

    await control?.bot_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: 0,
      next_id: 0,
      type: 'bot',
      text_pdf: '',
      text: control.bot_message,
      // @ts-ignore
      step: control.step,
      // @ts-ignore
      add_next_on_edit: control?.add_next_on_edit,
      remove_next_on_edit: control?.remove_next_on_edit,
    });

    if(control.add_next_on_edit === control.id) {
      let progress = String(next?.id);
      if(progress.length > 2) {
        progress = progress.substring(0, 2);
      }

      next?.id && await this.router.navigate([], {
        relativeTo: this.route, queryParamsHandling: 'merge',
        queryParams: {
          progress: progress,
          step: next?.attributes?.step
        },
      });
    } else {
      if(control.remove_next_on_edit) {
        await this.customerService.removeUserProgressByStep(control.remove_next_on_edit);
      }
      !stopRedirect && await this.toPreview();
    }
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
