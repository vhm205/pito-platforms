/* eslint-disable */

export const protobufPackage = 'occasion.event';

export interface OccasionEvent {
  id: number;
  name: string;
  index: number;
  isActive: boolean;
}

export interface CreateOccasionEventRequest {
  name: string;
}

export interface CreateOccasionEventResponse {
  id: number;
}

export interface GetOccasionEventRequest {
  id: number;
}

export interface GetOccasionEventResponse {
  occasionEvent: OccasionEvent | undefined;
}

export interface UpdateOccasionEventRequest {
  id: number;
  name?: string | undefined;
  isActive?: boolean | undefined;
}

export interface UpdateOccasionEventResponse {
  affectedRows: number;
}

export interface DeleteOccasionEventRequest {
  id: number;
}

export interface DeleteOccasionEventResponse {
  success: boolean;
}

export const OCCASION_EVENT_PACKAGE_NAME = 'occasion.event';
