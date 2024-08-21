import { createWithRemoteLoader } from '@kne/remote-loader';

const ContentManager = createWithRemoteLoader({
  modules: ['components-cms:Client', 'components-ckeditor:Editor']
})(({ remoteModules, ...props }) => {
  const [Client, Editor] = remoteModules;
  return (
    <Client
      {...props}
      groupCode="homepage"
      plugins={{
        fields: {
          CKEditor: Editor
        }
      }}
    />
  );
});

export default ContentManager;
