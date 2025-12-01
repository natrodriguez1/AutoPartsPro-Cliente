import {servicesMock} from '../data/services.mock';

export function getServiceByParamId(paramId: string) {
  const id = String(paramId);
  return servicesMock.find((s) => String(s.id) === id) ?? null;
}