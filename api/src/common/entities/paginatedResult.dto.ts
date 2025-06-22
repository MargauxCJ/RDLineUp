export class PaginatedResultDto<T> {
  data: T[];          // les données de la page
  total: number;      // nombre total d'éléments dans la base
  page: number;       // numéro de la page actuelle
  limit: number;      // nombre d'éléments par page

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
  }
}
