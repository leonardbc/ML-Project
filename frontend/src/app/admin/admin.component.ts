import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent { 
  tabs = [ // List of tabs being displayed and its components
    { label: 'General', component: "GeneralComponent" },
    { label: 'Done', component: "DoneComponent" },
    { label: 'Pending', component: "PendingComponent" },
  ];
}

