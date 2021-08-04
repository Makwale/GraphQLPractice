import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-unauth',
  templateUrl: './unauth.component.html',
  styleUrls: ['./unauth.component.scss'],
})
export class UnauthComponent implements OnInit {

  constructor(private ptf: Platform) { }

  ngOnInit() {}

}
