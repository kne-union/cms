import { createWithRemoteLoader } from '@kne/remote-loader';

const FileManager = createWithRemoteLoader({
  modules: ['components-file-manager:FileListPage']
})(({ remoteModules, ...props }) => {
  const [FileListPage] = remoteModules;
  return <FileListPage />;
});

export default FileManager;
