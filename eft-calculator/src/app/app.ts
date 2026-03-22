import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface Armor { name: string; classLevel: number; }
interface Ammo { name: string; caliber: string; damage: number; penetration: number; }

@Component({
  selector: 'app-root',
  standalone: true,
  // router-outletを使わないので imports から RouterOutlet を外しています
  imports: [CommonModule, FormsModule], 
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit {
  title = 'tarkov-calculator'; // エラー回避用に追加

  armors: Armor[] = [];
  ammos: Ammo[] = [];
  selectedArmor!: Armor;
  selectedAmmo!: Ammo;
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    forkJoin({
      armors: this.http.get<Armor[]>('assets/data/armors.json'),
      ammos: this.http.get<Ammo[]>('assets/data/ammos.json')
    }).subscribe({
      next: (data) => {
        this.armors = data.armors;
        this.ammos = data.ammos;
        if (this.armors.length > 0 && this.ammos.length > 0) {
          this.selectedArmor = this.armors[0];
          this.selectedAmmo = this.ammos[0];
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('データの読み込みに失敗しました。パスを確認してください:', err);
      }
    });
  }

  get penetrationChance(): number {
    if (!this.selectedArmor || !this.selectedAmmo) return 0;
    const armorValue = this.selectedArmor.classLevel * 10;
    const pen = this.selectedAmmo.penetration;
    if (pen >= armorValue + 5) return 100;
    if (pen <= armorValue - 15) return 0;   
    return Math.max(0, Math.min(100, Math.round(50 + (pen - armorValue) * 5)));
  }

  get shotsToKillThorax(): string {
    if (!this.selectedArmor || !this.selectedAmmo) return "";
    const chance = this.penetrationChance;
    if (chance < 10) return "貫通不可";
    let effectiveDamage = this.selectedAmmo.damage;
    if (chance < 80) effectiveDamage *= 0.7;
    return `${Math.ceil(85 / effectiveDamage)}発`;
  }

  get chanceColor(): string {
    const chance = this.penetrationChance;
    return chance >= 80 ? '#27ae60' : (chance >= 40 ? '#f39c12' : '#c0392b');
  }
}