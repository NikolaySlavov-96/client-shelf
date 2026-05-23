import api from './_api';
import { type ISendFileRequest, type ISendFileResponse } from './FileService.interface';

const PREFIX = '/file';

export const sendFile = (data: ISendFileRequest): Promise<ISendFileResponse> =>
    api.post(`${PREFIX}/addImage`, { inputData: data, isImage: true });
