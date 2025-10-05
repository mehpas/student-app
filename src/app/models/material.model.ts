export interface Material {
  id: number;
  tarih: string;
  hisseKodu: string;
  islem: string;
  adet: number;
  fiyat: number;
  toplam: number;
  komisyon: number;
  netTutar: number;
  anlikFiyat: number;
  anlikTutar: number;
  karZarar: number;
  karZararYuzde: number;
  ortalamaMaliyet?: number;
  uyariYuzdesi?: number;
  uyariTutar?: number;
  uyariMiktar?: number;
  aciklama?: string;
}


