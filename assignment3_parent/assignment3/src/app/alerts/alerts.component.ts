import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent {
 @Input() isEmptyTicker: boolean =false
 @Input() isInvalidTicker: boolean =false

 constructor(){}
}
