import { Component, OnInit, OnDestroy } from '@angular/core';
import { Student } from '../models/student.model';
import { StudentService } from '../services/student.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  filteredStudents: Student[] = [];
  searchId: string = '';
  isLoading: boolean = false;
  error: string = '';
  
  // Otomatik yenileme için
  private refreshInterval: Subscription | null = null;
  countdown: number = 60; // 60 saniye
  private countdownInterval: Subscription | null = null;
  lastRefreshTime: Date = new Date();

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.loadStudents();
    this.startAutoRefresh();
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadStudents(): void {
    this.isLoading = true;
    this.error = '';
    
    console.log('Öğrenci verileri yükleniyor...');
    
    this.studentService.getStudents().subscribe({
      next: (data) => {
        console.log('API\'den gelen veri:', data);
        this.students = data;
        this.filteredStudents = data;
        this.isLoading = false;
        this.lastRefreshTime = new Date();
        console.log('Öğrenci sayısı:', data.length);
      },
      error: (error) => {
        console.error('API Hatası detayı:', error);
        this.error = 'Öğrenci verileri yüklenirken hata oluştu: ' + error.message;
        this.isLoading = false;
        
        // CORS hatası kontrolü
        if (error.message.includes('CORS') || error.status === 0) {
          this.error = 'CORS hatası: API sunucusu CORS ayarlarını kontrol edin. API\'nin çalıştığından emin olun.';
        }
      }
    });
  }

  onSearch(): void {
    if (!this.searchId.trim()) {
      this.filteredStudents = this.students;
      return;
    }

    const searchIdNum = parseInt(this.searchId.trim());
    if (isNaN(searchIdNum)) {
      this.error = 'Lütfen geçerli bir öğrenci ID girin';
      return;
    }

    this.filteredStudents = this.students.filter(student => 
      student.id === searchIdNum
    );

    if (this.filteredStudents.length === 0) {
      this.error = 'Belirtilen ID ile öğrenci bulunamadı';
    } else {
      this.error = '';
    }
  }

  clearSearch(): void {
    this.searchId = '';
    this.filteredStudents = this.students;
    this.error = '';
  }

  // Otomatik yenileme metodları
  startAutoRefresh(): void {
    // Her 60 saniyede bir veri yenile
    this.refreshInterval = interval(60000).subscribe(() => {
      this.loadStudents();
    });

    // Geri sayım sayacı
    this.countdownInterval = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.countdown = 60;
      }
    });
  }

  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      this.refreshInterval.unsubscribe();
    }
    if (this.countdownInterval) {
      this.countdownInterval.unsubscribe();
    }
  }

  // Manuel yenileme
  refreshData(): void {
    this.loadStudents();
    this.countdown = 60;
    this.lastRefreshTime = new Date();
  }
}
