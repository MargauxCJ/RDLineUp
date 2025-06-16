import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ClubEntity } from 'src/club/entity/club.entity';

@Injectable()
export class ClubSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const clubRepo = this.dataSource.getRepository(ClubEntity);

    const existing = await clubRepo.findOneBy({ name: 'Roller Derby Caen' });
    if (!existing) {
      const club = clubRepo.create({
        name: 'Roller Derby Caen',
        city: 'Caen',
      });
      await clubRepo.save(club);
      console.log('Club "Roller Derby Caen" created');
    } else {
      console.log('Roller Derby Caen" already exists');
    }
  }
}
