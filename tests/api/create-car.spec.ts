import { test, expect } from '@playwright/test';
import { createCarData } from '../../test-data/create-cars-api.data';
import { createCar, deleteCar, postCar } from '../../api-helpers/cars.api';
import { CreateCarResponse } from '../../api-helpers/types';

test.describe('POST /api/cars', () => {

  let createdCarId: number | null = null;

  test.afterEach(async ({ request }) => {
    if (createdCarId) {
      await deleteCar(request, createdCarId);
      createdCarId = null;
    }
  });

  test('Positive: create car', async ({ request }) => {

    const body: CreateCarResponse = await createCar(
      request,
      createCarData.valid
    );

    expect(body.status).toBe('ok');
    expect(body.data.carBrandId).toBe(createCarData.valid.carBrandId);
    expect(body.data.carModelId).toBe(createCarData.valid.carModelId)
    expect(body.data.initialMileage).toBe(createCarData.valid.mileage);

    createdCarId = body.data.id;
  });

  test.describe('Negative: Required fiedls validation', () => {
    createCarData.requiredFieldCases.forEach(({ name, payload, expectedMessage }) => {
      test(`Negative: ${name}`, async ({ request }) => {
        const { response, body } = await postCar(request, payload);

        expect(response.status()).toBe(400);
        expect(body.status).toBe('error');
        expect(body.message).toBe(expectedMessage);
      });
    });
  });

  test.describe('Negative: unexisted brands and models', () => {
    createCarData.notFoundCases.forEach(({ name, payload, expectedMessage }) => {
      test(`Negative: ${name}`, async ({ request }) => {
        const { response, body } = await postCar(request, payload);

        expect(response.status()).toBe(404);
        expect(body.status).toBe('error');
        expect(body.message).toBe(expectedMessage);
      });
    });
  });

  test.describe('Negative: mileage validation', () => {
    createCarData.mileageValidationCases.forEach(({ name, payload, expectedMessage }) => {
      test(`Negative: ${name}`, async ({ request }) => {
        const { response, body } = await postCar(request, payload);

        expect(response.status()).toBe(400);
        expect(body.status).toBe('error');
        expect(body.message).toBe(expectedMessage);
      });
    });
  });
});
