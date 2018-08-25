import { AxiosResponse } from 'axios';

export interface Stream {
  stream: AxiosResponse,
  path: string
}
