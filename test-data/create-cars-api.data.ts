export const createCarData = {
  valid: {
    carBrandId: 1,
    carModelId: 1,
    mileage: 122,
  },

  requiredFieldCases: [
    {
      name: 'missing mileage',
      payload: {
        carBrandId: 1,
        carModelId: 1,
      },
      expectedMessage: 'Mileage is required',
    },
    {
      name: 'missing brand id',
      payload: {
        carModelId: 1,
        mileage: 122,
      },
      expectedMessage: 'Car brand id is required',
    },
    {
      name: 'missing model id',
      payload: {
        carBrandId: 1,
        mileage: 122,
      },
      expectedMessage: 'Car model id is required',
    },
  ],
  notFoundCases: [
    {
      name: 'invalid brand',
      payload: {
        carBrandId: 999999,
        carModelId: 1,
        mileage: 122
      },
      expectedMessage: 'Brand not found'
    },
    {
      name: 'invalid model',
      payload: {
        carBrandId: 1,
        carModelId: 999999,
        mileage: 122
      },
      expectedMessage: 'Model not found'
    }
  ], 
  mileageValidationCases: [
    {
      name: 'mileage below allowed range',
      payload: {
        carBrandId: 1,
        carModelId: 1,
        mileage: -1
      },
      expectedMessage: 'Mileage has to be from 0 to 999999'
    },
    {
      name: 'mileage above allowed range',
      payload: {
        carBrandId: 1,
        carModelId: 1,
        mileage: 1000000
      },
      expectedMessage: 'Mileage has to be from 0 to 999999'
    }
  ]
};