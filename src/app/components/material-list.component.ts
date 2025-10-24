import { Component, OnInit, OnDestroy } from '@angular/core';
import { Material } from '../models/material.model';
import { MaterialService } from '../services/material.service';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrls: ['./material-list.component.css']
})
export class MaterialListComponent implements OnInit, OnDestroy {
  materials: Material[] = [];
  filteredMaterials: Material[] = [];
  isLoading = false;
  error: string | null = null;
  searchHisseKodu = '';
  lastRefreshTime = new Date();
  countdown = 30;
  private countdownInterval: any;

  // 🔽 Filtre değişkenleri eklendi
  filters = {
    id: '',
    tarih: '',
    hisseKodu: '',
    islem: '',
    adet: '',
    fiyat: '',
    toplam: '',
    komisyon: '',
    netTutar: '',
    anlikFiyat: '',
    anlikTutar: '',
    karZarar: '',
    karZararYuzde: '',
    ortalamaMaliyet: '',
    aciklama: ''
  };

  // 🔽 Sıralama için eklenen değişkenler
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private materialService: MaterialService) {}

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

  // 🔽 Sıralama fonksiyonu eklendi
  sortData(column: string): void {
    if (this.sortColumn === column) {
      // Aynı kolona tıklanırsa yönü değiştir
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredMaterials.sort((a: any, b: any) => {
      const valueA = a[column];
      const valueB = b[column];

      // 📅 Tarih kolonu için özel sıralama
      if (column === 'tarih') {
        return this.compare(new Date(valueA), new Date(valueB));
      }

      // 🔢 Sayısal kolonlar
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return this.compare(valueA, valueB);
      }

      // 🔤 String kolonlar
      return this.compare(String(valueA), String(valueB));
    });
  }

  private compare(a: any, b: any): number {
    if (a < b) return this.sortDirection === 'asc' ? -1 : 1;
    if (a > b) return this.sortDirection === 'asc' ? 1 : -1;
    return 0;
  }

  // 🔽 Delete fonksiyonu eklendi
  deleteMaterial(material: Material): void {
    if (confirm(`ID: ${material.id} - "${material.hisseKodu}" hisse kodlu materyalı silmek istediğinizden emin misiniz?`)) {
      this.isLoading = true;
      this.error = null;

      this.materialService.deleteMaterial(material.id).subscribe({
        next: () => {
          // Silme işlemi başarılı, listeyi yenile
          this.loadMaterials();
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Materyal silinirken hata oluştu: ' + error.message;
          this.isLoading = false;
        }
      });
    }
  }

  // 🔽 Güncelleme fonksiyonu eklendi
  updateMaterial(material: Material): void {
    // Placeholder: Gerçek uygulamada modal veya sayfa yönlendirmesi olacak
    const updateLink = `https://localhost:5001/api/material/update/${material.id}`;
    alert(`Güncelleme sayfasına yönlendirilecek:\n${updateLink}\n\nAPI henüz hazır değil.`);
  }

  // 🔽 Yeni kayıt fonksiyonu eklendi
  addNewMaterial(): void {
    // Placeholder: Gerçek uygulamada modal veya sayfa yönlendirmesi olacak
    const createLink = 'https://localhost:5001/api/material/create';
    alert(`Yeni kayıt sayfasına yönlendirilecek:\n${createLink}\n\nAPI henüz hazır değil.`);
  }

  // 🔽 Filtreleme fonksiyonları eklendi
  applyFilters(): void {
    this.filteredMaterials = this.materials.filter(material => {
      return this.matchesFilter(material.id.toString(), this.filters.id) &&
             this.matchesFilter(material.tarih, this.filters.tarih) &&
             this.matchesFilter(material.hisseKodu, this.filters.hisseKodu) &&
             this.matchesFilter(material.islem, this.filters.islem) &&
             this.matchesFilter(material.adet.toString(), this.filters.adet) &&
             this.matchesFilter(material.fiyat.toString(), this.filters.fiyat) &&
             this.matchesFilter(material.toplam.toString(), this.filters.toplam) &&
             this.matchesFilter(material.komisyon.toString(), this.filters.komisyon) &&
             this.matchesFilter(material.netTutar.toString(), this.filters.netTutar) &&
             this.matchesFilter(material.anlikFiyat.toString(), this.filters.anlikFiyat) &&
             this.matchesFilter(material.anlikTutar.toString(), this.filters.anlikTutar) &&
             this.matchesFilter(material.karZarar.toString(), this.filters.karZarar) &&
             this.matchesFilter(material.karZararYuzde.toString(), this.filters.karZararYuzde) &&
             this.matchesFilter(material.ortalamaMaliyet?.toString() || '', this.filters.ortalamaMaliyet) &&
             this.matchesFilter(material.aciklama || '', this.filters.aciklama);
    });
  }

  private matchesFilter(value: string, filter: string): boolean {
    if (!filter.trim()) {
      return true;
    }
    return value.toLowerCase().includes(filter.toLowerCase());
  }

  clearAllFilters(): void {
    this.filters = {
      id: '',
      tarih: '',
      hisseKodu: '',
      islem: '',
      adet: '',
      fiyat: '',
      toplam: '',
      komisyon: '',
      netTutar: '',
      anlikFiyat: '',
      anlikTutar: '',
      karZarar: '',
      karZararYuzde: '',
      ortalamaMaliyet: '',
      aciklama: ''
    };
    this.filteredMaterials = this.materials;
  }

  // 🔽 Toplam hesaplama fonksiyonları eklendi
  getTotalAdet(): number {
    return this.filteredMaterials.reduce((sum, material) => sum + material.adet, 0);
  }

  getTotalToplam(): number {
    return this.filteredMaterials.reduce((sum, material) => sum + material.toplam, 0);
  }

  getTotalKomisyon(): number {
    return this.filteredMaterials.reduce((sum, material) => sum + material.komisyon, 0);
  }

  getTotalNetTutar(): number {
    return this.filteredMaterials.reduce((sum, material) => sum + material.netTutar, 0);
  }

  getTotalAnlikTutar(): number {
    return this.filteredMaterials.reduce((sum, material) => sum + material.anlikTutar, 0);
  }

  getTotalKarZarar(): number {
    return this.filteredMaterials.reduce((sum, material) => sum + material.karZarar, 0);
  }

  // 🔽 Doğru hesaplama: (Anlık Tutar - Toplam) / Toplam * 100
  getWeightedKarZararYuzde(): number {
    if (this.filteredMaterials.length === 0) return 0;
    const totalToplam = this.getTotalToplam();
    const totalAnlikTutar = this.getTotalAnlikTutar();
    if (totalToplam === 0) return 0;
    return ((totalAnlikTutar - totalToplam) / totalToplam) * 100;
  }

  // 🔽 Doğru hesaplama: Toplam net tutar / Toplam adet
  getWeightedOrtalamaMaliyet(): number {
    if (this.filteredMaterials.length === 0) return 0;
    const totalNetTutar = this.getTotalNetTutar();
    const totalAdet = this.getTotalAdet();
    if (totalAdet === 0) return 0;
    return totalNetTutar / totalAdet;
  }
}
