import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {AnswerInterface, ChatDataInterface} from "../../../../interfaces/chat";
import {FormControl, Validators} from "@angular/forms";
import {CustomerService} from "../../../../services/customer.service";
import {stringReplace} from "../../../../methods/string-replace";

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, OnDestroy {
  @Input() data: ChatDataInterface[] | [] = [];
  currentId: number | undefined;
  subscription : Subscription = new Subscription();
  controls: AnswerInterface[] = [];

  inputValidation = new FormControl('', []);
  inputValue = '';
  inputControl: AnswerInterface | null = null;

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
    this.inputControl= null;
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
      this.inputValidation.setValidators([Validators.required])
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

  async onInput (control: AnswerInterface,e: any) {
    this.inputValue = e.target.value;
    this.inputControl = control;
  }

  async onDrop (e: any | AnswerInterface) {
    this.dropValue = e.value.user_message;
    this.dropControl = e.value;

    await this.onSelect(e.value);
  }

  async onOutlet (btn: AnswerInterface) {
    this.outletControl = btn;

    await this.onSelect(btn);
  }


  async onInputNext(control: AnswerInterface, inputControlArray?: AnswerInterface[]) {
    if(this.inputValidation.errors || !inputControlArray?.length) {
      return;
    }
    const new_control = inputControlArray[0];
    if(new_control.bot_message) {
      new_control.bot_message = stringReplace(new_control.bot_message, this.inputValue);
    }
    if(new_control.user_message) {
      new_control.user_message = stringReplace(new_control.user_message, this.inputValue);
    }

    await this.onSelect(new_control);
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
    const next = control?.next_step?.data?.id;

    next && await this.router.navigate([], {
      relativeTo: this.route, queryParamsHandling: 'merge',
      queryParams: {
        progress: next
      },
    });

    await control?.user_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: control.id,
      next_id: next ? next : 0,
      type: 'user-q',
      text: control.user_message,
      // @ts-ignore
      step: control.step,
    })

    await control?.bot_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: 0,
      next_id: 0,
      type: 'bot-q',
      text: control.bot_message,
      // @ts-ignore
      step: control.step
    });
  }

  async onSelect( control: AnswerInterface) {
    const next = control?.next_step?.data?.id;

    next && await this.router.navigate([], {
      relativeTo: this.route, queryParamsHandling: 'merge',
      queryParams: {
        progress: next
      },
    });

    await control?.user_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: control.id,
      next_id: next ? next : 0,
      type: 'user',
      text: control.user_message,
      // @ts-ignore
      step: control.step,
    })

    await control?.bot_message && this.customerService.setProgress({
      id: control.group_id ? control.group_id : 0,
      answer_id: 0,
      next_id: 0,
      type: 'bot',
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

  isControlGroupDisabled(type: 'outlined-button-item' | 'dropdown-item') {
    const progress = this.customerService.getProgress();
    const elements = this.controls.filter(el => el.control_type === type);
    let disable = false;

    if(progress?.length && elements.length) {
      elements.map(el => {
        const res = progress.find(d => el.group_id === d.id && el.id === d.answer_id);

        if(!!res) {
          disable = true;
        }
      })
    }

    return disable;
  }

  filterByType(data: AnswerInterface[], type: 'button-next' | 'outlined-button-item' | 'dropdown-item' | 'circle' | 'input') {
    return data.filter(el => el.control_type === type)
  }
}
