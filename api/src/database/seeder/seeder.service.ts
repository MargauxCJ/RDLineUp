import {Injectable} from '@nestjs/common';
import {DataSource} from 'typeorm';
import {ClubSeeder} from 'src/database/seeder/seeders/club.seeder';
import {TeamSeeder} from 'src/database/seeder/seeders/team.seeder';
import {MemberSeeder} from 'src/database/seeder/seeders/member.seeder';

@Injectable()
export class SeederService {
  constructor(
    private readonly clubSeeder: ClubSeeder,
    private readonly teamSeeder: TeamSeeder,
    private readonly memberSeeder: MemberSeeder,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    await this.clearAll();
    await this.clubSeeder.run();
    await this.teamSeeder.run();
    await this.memberSeeder.run();
    console.log('✅ Seeding terminé');
  }

  async clearAll(): Promise<void> {
    console.log('🧹 Nettoyage complet de la base de données...');

    await this.dataSource.query(`
      TRUNCATE TABLE
        club,
        event,
        game,
        jam,
        lineup,
        member,
        pair,
        team
      RESTART IDENTITY CASCADE;
    `);

    console.log('✅ Base de données nettoyée.');
  }
}
