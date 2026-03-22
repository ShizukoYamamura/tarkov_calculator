import { Component } from '@angular/core';

// データモデルの定義
interface Armor { name: string; classLevel: number; }
interface Ammo { name: string; caliber: string; damage: number; penetration: number; }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // === アーマーデータ（Class 2 〜 Class 6） ===
  armors: Armor[] = [
    // Class 2
    { name: 'PACA Soft Armor', classLevel: 2 },
    { name: 'Module-3M body armor', classLevel: 2 },
    // Class 3
    { name: 'Zhuk-3 Press armor', classLevel: 3 },
    { name: 'NFM THOR Concealable', classLevel: 3 },
    { name: 'Kirasa-N', classLevel: 3 },
    // Class 4
    { name: 'Highcom Trooper TFO', classLevel: 4 },
    { name: '6B3TM-01M (Diaper rig)', classLevel: 4 },
    { name: 'Ars Arma TV-110', classLevel: 4 },
    { name: 'Crye Precision AVS', classLevel: 4 },
    // Class 5
    { name: 'FORT Defender-2', classLevel: 5 },
    { name: 'BNTI Korund-VM', classLevel: 5 },
    { name: 'BZh-SN (Killa Armor)', classLevel: 5 },
    { name: 'IOTV Gen4 (High Mobility)', classLevel: 5 },
    { name: 'BSS Mk.1 (Gzhel)', classLevel: 5 },
    // Class 6
    { name: 'LBT-6094A Slick', classLevel: 6 },
    { name: '5.11 Hexgrid', classLevel: 6 },
    { name: '6B43 Zabralo-Sh', classLevel: 6 },
    { name: 'NFM THOR Integrated Carrier', classLevel: 6 }
  ];

  // === 弾薬データ（主要口径網羅） ===
  ammos: Ammo[] = [
    // 9x19mm
    { name: '9x19mm PST gzh', caliber: '9x19', damage: 54, penetration: 20 },
    { name: '9x19mm AP 6.3', caliber: '9x19', damage: 52, penetration: 30 },
    { name: '9x19mm PBP gzh', caliber: '9x19', damage: 52, penetration: 39 },
    // .45 ACP
    { name: '.45 ACP Match FMJ', caliber: '.45 ACP', damage: 72, penetration: 25 },
    { name: '.45 ACP AP', caliber: '.45 ACP', damage: 38, penetration: 38 },
    // 5.45x39mm (AK-74)
    { name: '5.45x39mm PS', caliber: '5.45x39', damage: 50, penetration: 27 },
    { name: '5.45x39mm BT', caliber: '5.45x39', damage: 42, penetration: 37 },
    { name: '5.45x39mm BP', caliber: '5.45x39', damage: 45, penetration: 45 },
    { name: '5.45x39mm BS', caliber: '5.45x39', damage: 40, penetration: 51 },
    { name: '5.45x39mm PPBS (Igolnik)', caliber: '5.45x39', damage: 37, penetration: 62 },
    // 5.56x45mm (M4A1 / HK416)
    { name: '5.56x45mm M855', caliber: '5.56x45', damage: 52, penetration: 30 },
    { name: '5.56x45mm M856A1', caliber: '5.56x45', damage: 51, penetration: 38 },
    { name: '5.56x45mm M855A1', caliber: '5.56x45', damage: 46, penetration: 44 },
    { name: '5.56x45mm M995', caliber: '5.56x45', damage: 40, penetration: 53 },
    // 7.62x39mm (AKM / Mutant)
    { name: '7.62x39mm PS', caliber: '7.62x39', damage: 57, penetration: 35 },
    { name: '7.62x39mm PP', caliber: '7.62x39', damage: 55, penetration: 41 },
    { name: '7.62x39mm BP', caliber: '7.62x39', damage: 58, penetration: 47 },
    { name: '7.62x39mm MAI AP', caliber: '7.62x39', damage: 46, penetration: 58 },
    // 7.62x51mm (SA-58 / SR-25 / M1A)
    { name: '7.62x51mm BCP FMJ', caliber: '7.62x51', damage: 83, penetration: 35 },
    { name: '7.62x51mm M80', caliber: '7.62x51', damage: 80, penetration: 41 },
    { name: '7.62x51mm M62 Tracer', caliber: '7.62x51', damage: 79, penetration: 44 },
    { name: '7.62x51mm M61', caliber: '7.62x51', damage: 70, penetration: 64 },
    // 7.62x54mmR (Mosin / SVDS)
    { name: '7.62x54mmR LPS gzh', caliber: '7.62x54R', damage: 81, penetration: 42 },
    { name: '7.62x54mmR SNB', caliber: '7.62x54R', damage: 75, penetration: 62 },
    { name: '7.62x54mmR BS', caliber: '7.62x54R', damage: 72, penetration: 70 },
    // 12 Gauge (Shotguns)
    { name: '12/70 Magnum buckshot', caliber: '12 Gauge', damage: 400, penetration: 2 }, // 全ペレット命中時の合計ダメージ
    { name: '12/70 Flechette', caliber: '12 Gauge', damage: 200, penetration: 31 }, // ダーツ命中時の合計
    { name: '12/70 AP-20 Slug', caliber: '12 Gauge', damage: 164, penetration: 37 }
  ];

  // 初期選択状態（よくある撃ち合いをデフォルトに）
  selectedArmor: Armor = this.armors.find(a => a.name === 'Highcom Trooper TFO') || this.armors[0];
  selectedAmmo: Ammo = this.ammos.find(a => a.name === '5.45x39mm BT') || this.ammos[0];

  // ============================================
  // 計算ロジック（※簡略化した目安モデル）
  // ============================================

  // 初弾の貫通確率を計算
  get penetrationChance(): number {
    const armorValue = this.selectedArmor.classLevel * 10;
    const pen = this.selectedAmmo.penetration;
    
    // 貫通力がアーマークラス×10を上回ればほぼ確実
    if (pen >= armorValue + 5) return 100;
    // 貫通力が極端に低い場合は弾かれる
    if (pen <= armorValue - 15) return 0;   
    
    // 境界付近の確率計算（簡易線形補間）
    const chance = Math.round(50 + (pen - armorValue) * 5);
    return Math.max(0, Math.min(100, chance));
  }

  // 胸部（HP 85）を倒すのに必要な弾数 (TTK目安)
  get shotsToKillThorax(): string {
    const chance = this.penetrationChance;
    
    if (chance < 10) {
      return "貫通不可（アーマー破壊狙い / 足・顔を狙え）";
    }

    // 散弾（12 Gauge）の特別処理：全弾命中前提の計算
    if (this.selectedAmmo.caliber === '12 Gauge' && this.selectedAmmo.name.includes('buckshot')) {
      return "1ショット（全ペレット命中時・アーマーなし前提）";
    }

    // 貫通時のダメージ減衰を考慮（貫通力がギリギリだとダメージが下がるゲーム内仕様の簡易再現）
    let effectiveDamage = this.selectedAmmo.damage;
    if (chance >= 10 && chance < 80) {
        effectiveDamage = effectiveDamage * 0.7; // ギリギリ貫通時はダメージが約30%減衰すると仮定
    }

    const shots = Math.ceil(85 / effectiveDamage);
    return `${shots}発`;
  }

  // 確率に応じた色分け（CSSのプログレスバー用）
  get chanceColor(): string {
    const chance = this.penetrationChance;
    if (chance >= 80) return '#27ae60'; // 緑（高確率）
    if (chance >= 40) return '#f39c12'; // オレンジ（中確率）
    return '#c0392b'; // 赤（低確率）
  }
}