import { Navigate, Route, Routes } from 'react-router-dom';
import pages from './pages';
import MainLayout, { AfterAdminUserLoginLayout, AfterTenantUserLoginLayout, AfterUserLoginLayout, BeforeLoginLayout } from './MainLayout';
import RightOptions from './RightOptions';
import './index.scss';

const { Home, Detail, Account, Admin, CmsManager, ContentManager, TenantSetting, FileManager, InitAdmin, Error, NotFound } = pages;

const App = ({ globalPreset }) => {
  return (
    <Routes>
      <Route path="account" element={<BeforeLoginLayout preset={globalPreset} themeToken={globalPreset.themeToken} />}>
        <Route path="*" element={<Account baseUrl="/account" isTenant />} />
      </Route>
      <Route path="admin/initAdmin" element={<AfterUserLoginLayout preset={globalPreset} themeToken={globalPreset.themeToken} paths={[]} />}>
        <Route index element={<InitAdmin baseUrl="/admin" />} />
      </Route>
      <Route
        path="admin"
        element={
          <AfterAdminUserLoginLayout
            preset={globalPreset}
            themeToken={globalPreset.themeToken}
            navigation={{
              showIndex: false,
              base: '/admin',
              list: [
                {
                  key: 'home',
                  title: '首页',
                  path: '/admin'
                },
                {
                  key: 'tenant',
                  title: '租户管理',
                  path: '/admin/tenant'
                },
                {
                  key: 'user',
                  title: '用户管理',
                  path: '/admin/user'
                },
                {
                  key: 'permission',
                  title: '应用权限管理',
                  path: '/admin/permission'
                },
                {
                  key: 'log',
                  title: '操作日志',
                  path: '/admin/log'
                },
                {
                  key: 'cms',
                  title: '内容管理',
                  path: '/admin/cms'
                },
                {
                  key: 'file',
                  title: '文件管理',
                  path: '/admin/file'
                }
              ],
              rightOptions: <RightOptions />
            }}
          />
        }
      >
        <Route index element={<Admin baseUrl="/admin" />} />
        <Route path="file" element={<FileManager />} />
        <Route path="cms/*" element={<CmsManager baseUrl={'/admin/cms'} />} />
        <Route path="*" element={<Admin baseUrl="/admin" />} />
      </Route>
      <Route
        path="tenant"
        element={
          <AfterTenantUserLoginLayout
            preset={globalPreset}
            themeToken={globalPreset.themeToken}
            navigation={{
              rightOptions: <RightOptions />,
              base: '/tenant',
              showIndex: false,
              list: [
                {
                  key: 'home',
                  title: '首页',
                  path: '/tenant'
                },
                { key: 'setting', title: '设置', path: '/tenant/setting' }
              ]
            }}
          />
        }
      >
        <Route index element={<ContentManager />} />
        <Route path="setting">
          <Route index element={<TenantSetting baseUrl="/tenant/setting" />} />
          <Route path="*" element={<TenantSetting baseUrl="/tenant/setting" />} />
        </Route>
      </Route>
      <Route element={<MainLayout preset={globalPreset} themeToken={globalPreset.themeToken} paths={[]} />}>
        <Route index element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="error" element={<Error />} />
        <Route path="404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="404" />} />
      </Route>
    </Routes>
  );
};

export default App;
