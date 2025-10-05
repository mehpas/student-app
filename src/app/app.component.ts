import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Yönetim Sistemi';
  activeTab: 'students' | 'materials' = 'students';

  setActiveTab(tab: 'students' | 'materials'): void {
    this.activeTab = tab;
  }
}


