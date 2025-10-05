import { Component, OnInit } from '@angular/core';
import { Material } from '../models/material.model';
import { MaterialService } from '../services/material.service';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css']
})
export class MaterialListComponent implements OnInit {
  materials: Material[] = [];
  filteredMaterials: Material[] = [];
  isLoading = false;
  error: string | null = null;
  searchHisseKodu = '';
  lastRefreshTime = new Date();
  countdown = 30;
  private countdownInterval: any;

  constructor(private materialService: MaterialService) { }

  ngOnInit(): void {
    this.loadMaterials();
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  loadMaterials(): void {
    this.isLoading = true;
    this.error = null;
    
    this.materialService.getMaterials().subscribe({
      next: (data) => {
        this.materials = data;
        this.filteredMaterials = data;
        this.lastRefreshTime = new Date();
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Materyal verileri yüklenirken hata oluştu: ' + error.message;
        this.isLoading = false;
      }
    });
  }

  onSearch(): void {
    if (this.searchHisseKodu.trim()) {
      this.isLoading = true;
      this.error = null;
      
      this.materialService.getMaterialByCode(this.searchHisseKodu.trim()).subscribe({
        next: (data) => {
          this.filteredMaterials = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Arama sırasında hata oluştu: ' + error.message;
          this.isLoading = false;
        }
      });
    } else {
      this.filteredMaterials = this.materials;
    }
  }

  clearSearch(): void {
    this.searchHisseKodu = '';
    this.filteredMaterials = this.materials;
  }

  refreshData(): void {
    this.loadMaterials();
    this.countdown = 120;
  }

  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.refreshData();
      }
    }, 1000);
  }
}


