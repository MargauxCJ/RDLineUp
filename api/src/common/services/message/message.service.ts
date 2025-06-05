import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageService {
  private readonly messages = {
    NOT_FOUND: (entity: string) => `${entity} introuvable.`,
    CREATED: (entity: string) => `${entity} créé avec succés.`,
    UPDATED: (entity: string) => `${entity} modifié avec succés.`,
    DELETED: (entity: string) => `${entity} supprimé avec succés.`,
    FORBIDDEN: "Vous n'êtes pas autorisé(e) a effectuer cette action.",
    ERROR: (entity: string) => `Impossible de créer un(e) ${entity}`,
    FETCH_ERROR: (entity: string) => `Echec de la récupération de ${entity}.`,
    SAVE_ERROR: (entity: string) => `Echec de la sauvegarde de ${entity}.`,

    LOGIN_PASSWORD_FAILED: 'Mot de passe incorrect.',
    EMAIL_NOT_FOUND: 'Aucun compte lié à ce mail.',
    UNKNOW_ERROR: 'Erreur Inconnue.',
    SERVER_ERROR: 'Erreur serveur inattendue.',
  };

  get(messageKey: string, entity?: string): string {
    const message = this.messages[messageKey];
    return typeof message === 'function' ? message(entity) : message;
  }
}
