import { createWithRemoteLoader } from '@kne/remote-loader';
import Fetch from '@kne/react-fetch';
import { List } from 'antd';
import { useNavigate } from 'react-router-dom';

const Home = createWithRemoteLoader({
  modules: ['Layout@Page', 'Global@usePreset', 'Image']
})(({ remoteModules }) => {
  const [Page, usePreset, Image] = remoteModules;
  const { apis } = usePreset();
  const navigate = useNavigate();
  return (
    <Page backgroundColor={'transparent'}>
      <div
        style={{
          width: '1100px',
          margin: '0 auto',
          backgroundColor: '#FFF',
          padding: '0 20px',
          flex: 1
        }}
      >
        <Fetch
          {...Object.assign({}, apis.cms.content.getList, {
            params: {
              groupCode: 'homepage',
              objectCode: 'content'
            }
          })}
          render={({ data, reload }) => {
            return (
              <List
                dataSource={data.pageData}
                renderItem={item => {
                  return (
                    <List.Item
                      onClick={() => {
                        navigate(`/detail/${item.id}`);
                      }}
                      extra={
                        <Image
                          id={item.banner[0].id}
                          style={{
                            width: '300px',
                            height: '200px',
                            flex: 'none',
                            marginLeft: '10px'
                          }}
                        />
                      }
                    >
                      {item.content.replace(/<[^>]*>/g, '').substring(0, 300) + '...'}
                    </List.Item>
                  );
                }}
                pagination={
                  data.totalCount > 20
                    ? {
                        pageSize: 20,
                        onChange: page => {
                          reload({
                            params: { currentPage: page }
                          });
                        }
                      }
                    : false
                }
              />
            );
          }}
        />
      </div>
    </Page>
  );
});

export default Home;
