export interface CreateCarResponse {
  status: string;
  data: {
    id: number;
    carBrandId: number;
    carModelId: number;
    initialMileage: number,
    updatedMileageAt: string,
    mileage: number;
    brand: string;
    model: string;
    logo: string;
  };
}