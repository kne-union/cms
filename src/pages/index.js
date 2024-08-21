import loadable from '@loadable/component';
import { Spin } from 'antd';

const loadableWithProps = func =>
  loadable(func, {
    fallback: <Spin style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} />
  });

const pages = {
  Home: loadableWithProps(() => import('./Home')),
  Detail: loadableWithProps(() => import('./Detail')),
  Account: loadableWithProps(() => import('./Account')),
  Admin: loadableWithProps(() => import('./Admin')),
  TenantSetting: loadableWithProps(() => import('./TenantSetting')),
  CmsManager: loadableWithProps(() => import('./CmsManager')),
  ContentManager: loadableWithProps(() => import('./ContentManager')),
  FileManager: loadableWithProps(() => import('./FileManager')),
  InitAdmin: loadableWithProps(() => import('./Admin').then(({ InitAdmin }) => InitAdmin)),
  Error: loadableWithProps(() => import('./Error')),
  NotFound: loadableWithProps(() => import('./NotFound'))
};

export default pages;
