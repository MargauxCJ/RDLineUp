import {Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';

@Injectable()
export class SeederService {
  constructor(
    // private readonly categorySeeder: CategorySeeder,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    await this.clearAll();
    // await this.categorySeeder.run();
    console.log('✅ Seeding terminé');
  }

  async clearAll(): Promise<void> {
    console.log('🧹 Nettoyage complet de la base de données...');

    await this.dataSource.query(`
      TRUNCATE TABLE
        category_entity_bands_band,
        est_ent_str_col_of_str_ent,
        establishment_entity_structure_collaborators_structure_entity,
        structure_entity_artistes_band,
        structure_entity_collaborators_of_structure_entity,
        band,
        establishment_entity,
        structure_entity,
        category_entity,
        user_entity
      RESTART IDENTITY CASCADE;
    `);

    console.log('✅ Base de données nettoyée.');
  }
}
