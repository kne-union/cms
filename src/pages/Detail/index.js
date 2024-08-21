import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import { useParams } from 'react-router-dom';
import { Flex } from 'antd';
import style from './style.module.scss';

const Detail = createWithRemoteLoader({
  modules: ['Layout@Page', 'Global@usePreset', 'Image', 'components-ckeditor:Editor']
})(({ remoteModules }) => {
  const [Page, usePreset, Image, Editor] = remoteModules;
  const { apis } = usePreset();
  const { id } = useParams();
  return (
    <Page backgroundColor={'transparent'} noPadding noMargin>
      <Fetch
        {...Object.assign({}, apis.cms.content.getDetail, {
          params: {
            id
          }
        })}
        render={({ data }) => {
          return (
            <Flex vertical>
              <Image className={style['header']} id={data.data.banner[0].id} />
              <div className={style['content']}>
                <h1>{data.data.title}</h1>
                <Editor.Content value={data.data.content} />
              </div>
            </Flex>
          );
        }}
      />
    </Page>
  );
});

export default Detail;
