import { createWithRemoteLoader } from '@kne/remote-loader';

const CmsManager = createWithRemoteLoader({
  modules: ['components-cms:Cms', 'components-ckeditor:Editor']
})(({ remoteModules, ...props }) => {
  const [Cms, Editor] = remoteModules;
  return (
    <Cms
      {...props}
      plugins={{
        fields: {
          CKEditor: Editor
        }
      }}
    />
  );
});

export default CmsManager;
