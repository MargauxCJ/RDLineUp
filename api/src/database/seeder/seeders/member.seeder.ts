import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TeamEntity } from 'src/team/entity/team.entity';
import { ClubEntity } from 'src/club/entity/club.entity';
import {UserEntity, UserRole} from 'src/user/entity/user.entity';
import * as XLSX from 'xlsx';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
@Injectable()
export class MemberSeeder {
  constructor(private dataSource: DataSource) {
  }

  async run() {
    const userRepo = this.dataSource.getRepository(UserEntity);
    const teamRepo = this.dataSource.getRepository(TeamEntity);

    const leopardAvengersTeam = await teamRepo.findOneBy({name: 'Léopard Avengers'});
    if (!leopardAvengersTeam) {
      console.error('Club "Léopard Avengers" not found, please run TeamSeeder first.');
      return;
    }

    const lesPetroleusesTeam = await teamRepo.findOneBy({name: 'Les Pétroleuses'});
    if (!leopardAvengersTeam) {
      console.error('Club "Les Pétroleuses" not found, please run TeamSeeder first.');
      return;
    }

    const filePath = join(__dirname, '..', 'imports', 'member_leopard.xlsx');
    const workbook = XLSX.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const usersData = XLSX.utils.sheet_to_json<{ surname: string; jerseyNum: string }>(worksheet);

    const hashedPassword = await bcrypt.hash('password', 10);

    for (const row of usersData) {
      console.log(row);
      const usernameLower = row.surname
        .normalize("NFD")                   // décompose ü en u + ¨
        .replace(/[\u0300-\u036f]/g, "")    // supprime les diacritiques
        .toLowerCase()
        .replace(/\s+/g, '')                // supprime les espaces
        .replace(/[^a-z0-9]/g, '');

      const user = userRepo.create({
        surname: row.surname,
        email: `${usernameLower}@test.fr`,
        jerseyNum: row.jerseyNum,
        password: hashedPassword,
        role: UserRole.MEMBER_USER,
        teams: [leopardAvengersTeam],
      });

      await userRepo.save(user);

      console.log(`Member "${usernameLower}" created`);
    }

    const coach = userRepo.create({
      surname: 'Praline',
      email: `praline@test.fr`,
      jerseyNum: '1991',
      password: hashedPassword,
      role: UserRole.COACH_USER,
      teams: [leopardAvengersTeam, lesPetroleusesTeam],
      imgProfile: "praline-5ba310d5-a283-4d5a-a585-97bb50d73bc3.jpeg",
    });

    await userRepo.save(coach);

    console.log(`Coach "Praline" created`);


  }
}

