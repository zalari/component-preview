import {Pathname} from 'history';

export type PreviewPaths = Map<Pathname, { label: string; paths?: PreviewPaths }>;