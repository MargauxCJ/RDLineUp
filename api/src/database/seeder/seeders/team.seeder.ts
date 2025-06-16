import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TeamEntity } from 'src/team/entity/team.entity';
import { ClubEntity } from 'src/club/entity/club.entity';

@Injectable()
export class TeamSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const clubRepo = this.dataSource.getRepository(ClubEntity);
    const teamRepo = this.dataSource.getRepository(TeamEntity);

    const rollerderbyCaen = await clubRepo.findOneBy({ name: 'Roller Derby Caen' });
    if (!rollerderbyCaen) {
      console.error('Club "roller derby caen" not found, please run ClubSeeder first.');
      return;
    }

    const existingLeopard = await teamRepo.findOneBy({ name: 'Léopard Avengers' });
    if (!existingLeopard) {
      const team1 = teamRepo.create({
        name: 'Léopard Avengers',
        club: rollerderbyCaen,
      });
      await teamRepo.save(team1);
      console.log('Team "Léopard Avengers" created');
    } else {
      console.log('Team "Léopard Avengers" already exists');
    }

    const existingPetroleuses = await teamRepo.findOneBy({ name: 'Les Pétroleuses' });
    if (!existingPetroleuses) {
      const team2 = teamRepo.create({
        name: 'Les Pétroleuses',
        club: rollerderbyCaen,
      });
      await teamRepo.save(team2);
      console.log('Team "Les Pétroleuses" created');
    } else {
      console.log('Team "Les Pétroleuses" already exists');
    }
  }
}
