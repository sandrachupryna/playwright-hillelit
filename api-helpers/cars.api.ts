import { APIRequestContext } from '@playwright/test';
import { CreateCarResponse } from './types';

export async function postCar(
  request: APIRequestContext,
  payload: object
) {
  const response = await request.post('/api/cars', { data: payload });
  const body = await response.json();

  return { response, body };
}

// high level - for preconditions
export async function createCar(
  request: APIRequestContext,
  payload: object
): Promise<CreateCarResponse> {

  const { response, body } = await postCar(request, payload);

  if (response.status() !== 201) {
    throw new Error(`Car creation failed: ${response.status()}`);
  }

  return body;
}

export async function deleteCar(
  request: APIRequestContext,
  id: number
) {
  const response = await request.delete(`/api/cars/${id}`);

  if (response.status() !== 200) {
    throw new Error(`Car deletion failed for id ${id}: ${response.status()}`);
  }
}