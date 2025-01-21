import { Partner } from '../domain/partner.domain';

export type UpdatePartnerDto = Partial<Omit<Partner, 'id' | 'createdAt'>>;
