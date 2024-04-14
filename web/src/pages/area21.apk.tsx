import {LoadingPage} from '@/components';
import {useEffect} from 'react';

const DownloadPage = (): JSX.Element => {
  useEffect(() => {
    (async () => {
      const response: Response = await fetch('/apk/area21.apk');
      const blob: Blob = await response.blob();
      const url: string = window.URL.createObjectURL(new Blob([blob]));
      const link: HTMLAnchorElement = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'area21.apk');
      document.body.appendChild(link);
      link.click();
    })();
  }, []);
  return <LoadingPage />;
};

export default DownloadPage;
