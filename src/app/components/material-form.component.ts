import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Material } from '../models/material.model';

@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.component.html',
  styleUrls: ['./material-form.component.css']
})
export class MaterialFormComponent implements OnInit {
  @Input() material: Material | null = null;
  @Input() isEditMode: boolean = false;
  @Output() save = new EventEmitter<Material>();
  @Output() cancel = new EventEmitter<void>();

  formData: Material = {
    id: 0,
    tarih: '',
    hisseKodu: '',
    islem: '',
    adet: 0,
    fiyat: 0,
    toplam: 0,
    komisyon: 0,
    netTutar: 0,
    anlikFiyat: 0,
    anlikTutar: 0,
    karZarar: 0,
    karZararYuzde: 0,
    ortalamaMaliyet: 0,
    aciklama: ''
  };

  ngOnInit(): void {
    if (this.material && this.isEditMode) {
      this.formData = { ...this.material };
    } else {
      // Yeni kayıt için bugünün tarihini varsayılan olarak ayarla
      this.formData.tarih = new Date().toISOString().split('T')[0];
    }
  }

  onSave(): void {
    // Form validasyonu
    if (!this.validateForm()) {
      return;
    }

    // Hesaplamaları yap
    this.calculateFields();
    
    this.save.emit(this.formData);
  }

  onCancel(): void {
    this.cancel.emit();
  }

  private validateForm(): boolean {
    if (!this.formData.tarih || !this.formData.hisseKodu || !this.formData.islem) {
      alert('Tarih, Hisse Kodu ve İşlem alanları zorunludur!');
      return false;
    }
    if (this.formData.adet <= 0 || this.formData.fiyat <= 0) {
      alert('Adet ve Fiyat 0\'dan büyük olmalıdır!');
      return false;
    }
    return true;
  }

  private calculateFields(): void {
    // Toplam hesaplama
    this.formData.toplam = this.formData.adet * this.formData.fiyat;
    
    // Komisyon hesaplama (varsayılan %0.1)
    this.formData.komisyon = this.formData.toplam * 0.001;
    
    // Net tutar hesaplama
    this.formData.netTutar = this.formData.toplam + this.formData.komisyon;
    
    // Anlık tutar hesaplama (varsayılan olarak toplam ile aynı)
    this.formData.anlikTutar = this.formData.toplam;
    
    // Kar/zarar hesaplama
    this.formData.karZarar = this.formData.anlikTutar - this.formData.netTutar;
    
    // Kar/zarar yüzdesi hesaplama
    if (this.formData.netTutar > 0) {
      this.formData.karZararYuzde = (this.formData.karZarar / this.formData.netTutar) * 100;
    }
    
    // Ortalama maliyet hesaplama
    this.formData.ortalamaMaliyet = this.formData.netTutar / this.formData.adet;
  }

  // Placeholder linkler
  getUpdateLink(): string {
    return `https://localhost:5001/api/material/update/${this.formData.id}`;
  }

  getCreateLink(): string {
    return 'https://localhost:5001/api/material/create';
  }
}

