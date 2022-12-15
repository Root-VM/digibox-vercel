import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProgressType} from "./progress-type";
import { fadeInOnEnterAnimation, fadeOutOnLeaveAnimation } from 'angular-animations';

@Component({
  selector: 'app-progress-status',
  templateUrl: './progress-status.component.html',
  styleUrls: ['./progress-status.component.scss'],
  animations: [
    fadeInOnEnterAnimation({duration: 300}),
    fadeOutOnLeaveAnimation({duration: 300})
  ]
})
export class ProgressStatusComponent {
  @Input() show = true;
  @Output() onHide = new EventEmitter();

  hide () {
    this.onHide.emit();
  }
  data: Array<ProgressType> = [
    {
      text: 'Schritt für Schritt zu Ihrer persönlichen Patientenverfügung',
      type: 'completed'
    },
    {
      text: '1.Anweisungen des Patienten',
      type: 'checked'
    },
    {
      text: '2.Weitere wichtige Informationen',
      type: 'checked'
    },
    {
      text: '3.Vertrauensperson bei medizinischen Angelegenheiten',
      type: 'checked'
    },
    {
      text: '4.Behandelnder Arzt',
      type: 'checked'
    },
    {
      text: '5.Persönliche Daten',
      type: 'current'
    },
    {
      text: '6.Patientenverfügung Vorschau',
      type: 'new'
    },
    {
      text: '7.Signatur und Kaufabschluss',
      type: 'new'
    },
    {
      text: '8.Patientenverfügung abschliessen',
      type: 'new'
    },
  ]
}
