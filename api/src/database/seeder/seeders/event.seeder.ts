import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EventEntity } from 'src/event/entity/event.entity';
import { ClubEntity } from 'src/club/entity/club.entity';
import {TeamEntity} from 'src/team/entity/team.entity';

@Injectable()
export class EventSeeder {
  constructor(private dataSource: DataSource) {}

  getRandomTeams(teams: TeamEntity[]): TeamEntity[] {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    const numberOfTeams = Math.random() < 0.5 ? 1 : 2;
    return shuffled.slice(0, numberOfTeams);
  }

  async run() {
    const eventRepo = this.dataSource.getRepository(EventEntity);
    const clubRepo = this.dataSource.getRepository(ClubEntity);
    const teamRepo = this.dataSource.getRepository(TeamEntity);

    const club = await clubRepo.findOneBy({ name: 'Roller Derby Caen' });
    if (!club) {
      throw new Error('❌ Club "Roller Derby Caen" introuvable');
    }

    const eventNames = [
      'Championnat Régional 2025',
      'Tournoi Interclubs Janvier',
      'Stage Technique Février',
      'Scrimmage Amical Mars',
      'Camp d’Été Jeunes',
      'Roller Fest 2025',
      'Préparation Playoffs',
      'Tournoi National Estival',
      'Rencontre Mixte Octobre',
      'Clôture de Saison 2025',
      'Championnat Régional 2024',
      'Cloture Régional 2024',
    ];

    for (let i = 0; i < eventNames.length; i++) {
      const existing = await eventRepo.findOneBy({ name: eventNames[i] });
      if (existing) {
        console.log(`✅ "${eventNames[i]}" existe déjà`);
        continue;
      }

      const teamLeopard = await teamRepo.findOneBy({ name: "Léopard Avengers" });
      const teamPetroleuses = await teamRepo.findOneBy({ name: "Les Pétroleuses" });



      const startDate = new Date(2025, i, 10); // mois = 0-based, donc janvier = 0
      const endDate = new Date(2025, i, 12);

      const event = eventRepo.create({
        name: eventNames[i],
        startDate,
        endDate,
        club,
        teams: this.getRandomTeams([teamLeopard, teamPetroleuses]),
      });

      await eventRepo.save(event);
      console.log(`✅ Événement "${eventNames[i]}" créé avec succès`);
    }
  }
}
