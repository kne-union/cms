import React from 'react';
import { preset as fetchPreset } from '@kne/react-fetch';
import { Spin, Empty, message } from 'antd';
import axios from 'axios';
import { loadModule, preset as remoteLoaderPreset } from '@kne/remote-loader';
import omit from 'lodash/omit';
import merge from 'lodash/merge';
import apis from './apis';

window.PUBLIC_URL = window.runtimePublicUrl || process.env.PUBLIC_URL;

const baseApiUrl = window.runtimeApiUrl || '';

export const globalInit = async () => {
  const ajax = (() => {
    const instance = axios.create({
      baseURL: baseApiUrl,
      validateStatus: function () {
        return true;
      }
    });

    instance.interceptors.request.use(async config => {
      const { default: getToken } = await loadModule('components-account:Account@getToken');
      const token = getToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(response => {
      if (response.status === 401 || response.data.code === 401) {
        const searchParams = new URLSearchParams(window.location.search);
        const referer = encodeURIComponent(window.location.pathname + window.location.search);
        searchParams.append('referer', referer);
        window.location.href = '/account/login?' + searchParams.toString();
        response.showError = false;
      }
      return response;
    });

    instance.interceptors.response.use(
      response => {
        if (response.status !== 200) {
          response.showError !== false && response.config.showError !== false && message.error(response?.data?.msg || '请求发生错误');
        }
        return response;
      },
      error => {
        message.error(error.message || '请求发生错误');
        return Promise.reject(error);
      }
    );

    return params => {
      if (params.hasOwnProperty('loader') && typeof params.loader === 'function') {
        return Promise.resolve(params.loader(omit(params, ['loader'])))
          .then(data => ({
            data: {
              code: 0,
              data
            }
          }))
          .catch(err => {
            message.error(err.message || '请求发生错误');
            return { data: { code: 500, msg: err.message } };
          });
      }
      return instance(params);
    };
  })();

  fetchPreset({
    ajax,
    loading: (
      <Spin
        delay={500}
        style={{
          position: 'absolute',
          left: '50%',
          padding: '10px',
          transform: 'translateX(-50%)'
        }}
      />
    ),
    error: null,
    empty: <Empty />,
    transformResponse: response => {
      const { data } = response;
      response.data = {
        code: data.code === 0 ? 200 : data.code,
        msg: data.msg,
        results: data.data
      };
      return response;
    }
  });
  const registry = {
    url: 'https://uc.fatalent.cn',
    tpl: '{{url}}/packages/@kne-components/{{remote}}/{{version}}/build'
  };

  const componentsCoreRemote = {
    ...registry,
    remote: 'components-core',
    defaultVersion: '0.2.29'
  };
  remoteLoaderPreset({
    remotes: {
      default: componentsCoreRemote,
      'components-core': componentsCoreRemote,
      'components-iconfont': {
        ...registry,
        remote: 'components-iconfont',
        defaultVersion: '0.1.8'
      },
      'components-account': {
        ...registry,
        remote: 'components-account',
        defaultVersion: '0.2.22'
      },
      'components-file-manager': {
        ...registry,
        remote: 'components-file-manager',
        defaultVersion: '0.1.1'
      },
      'components-view': {
        ...registry,
        remote: 'components-view',
        defaultVersion: '0.1.19'
      },
      'components-cms': {
        ...registry,
        remote: 'components-cms',
        defaultVersion: '0.1.1'
      },
      'components-ckeditor': {
        ...registry,
        remote: 'components-ckeditor',
        defaultVersion: '0.1.2'
      },
      'fastify-app':
        process.env.NODE_ENV === 'development'
          ? {
              remote: 'fastify-app',
              url: '/',
              tpl: '{{url}}'
            }
          : {
              ...registry,
              remote: 'fastify-app',
              defaultVersion: process.env.DEFAULT_VERSION
            }
    }
  });

  const accountApis = (await loadModule('components-account:Apis@getApis')).default({ prefix: '/api/v1/account' });

  const fileManagerApis = (await loadModule('components-file-manager:Apis@getApis')).default({ prefix: '/api/v1/static' });

  const cmsApis = (await loadModule('components-cms:Apis@getApis')).default({ prefix: '/api/v1/cms' });

  const ajaxForm = async (url, data, options) => {
    const { default: getToken } = await loadModule('components-account:Account@getToken');
    const token = getToken();
    return await axios.postForm(
      url,
      data,
      merge(
        {},
        {
          baseURL: window.runtimeApiUrl || '',
          validateStatus: function () {
            return true;
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        options
      )
    );
  };

  return {
    ajax,
    ajaxForm,
    staticUrl: baseApiUrl,
    apis: Object.assign(
      {},
      {
        ossStaticUpload: async ({ file }) => {
          const { data } = await ajaxForm(fileManagerApis.upload.url, { file });
          return Object.assign({}, data, {
            data: fileManagerApis.getFile.url.replace('{id}', data.data.id)
          });
        },
        fileManager: fileManagerApis,
        account: accountApis,
        oss: Object.assign({}, fileManagerApis.getFileUrl, {
          paramsType: 'urlParams',
          ignoreSuccessState: true
        }),
        cms: cmsApis,
        ossUpload: async ({ file }) => {
          return await ajaxForm(fileManagerApis.upload.url, { file });
        }
      },
      { project: apis }
    ),
    permissionsPath: 'userInfo.tenantUser.permissions',
    themeToken: {
      colorPrimary: '#4F185A',
      colorPrimaryHover: '#702280'
    }
  };
};
