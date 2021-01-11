import * as React from 'react';
import './styles.css';
import { Data } from './App.types';

export default function App() {
  const [data, setData] = React.useState<Data<any>>({ status: 'unfetched' });

  const fetchData = React.useCallback(async () => {
    setData({
      status: 'fetching',
    });

    try {
      const sundayMagazinePage = await fetch(
        'https://www.eenadu.net/sundaymagazine'
      ).then((res) => res.text());

      const articleLinkMatch = sundayMagazinePage.match(
        /<a\s*href="https:\/\/www.eenadu.net\/sundaymagazine\/article\/(\d*?)"\s*>రాశిఫలం/i
      );

      if (!articleLinkMatch?.[1]) {
        throw Error('Could not find article link');
      }

      const raasiPhalamUrl = `https://www.eenadu.net/sundaymagazine/article/${articleLinkMatch[1]}`;

      const rasiPhalamArticle = await fetch(raasiPhalamUrl).then((res) =>
        res.text()
      );

      const rasiPhalamContentMatch = rasiPhalamArticle.match(
        /<\/center>([\s\S\n]*?)<center>/i
      );

      if (!rasiPhalamContentMatch) {
        throw Error('Could not find content');
      }

      console.log(rasiPhalamContentMatch);

      setData({
        status: 'success',
        data: rasiPhalamContentMatch[1],
      });
    } catch (error) {
      setData({
        status: 'error',
        error,
      });
    }
  }, []);

  React.useEffect(() => {
    if (data.status === 'unfetched') {
      fetchData();
    }
  }, [data.status, fetchData]);

  const content = React.useMemo(() => {
    switch (data.status) {
      case 'unfetched':
        return <p>Data is not fetched yet</p>;
      case 'fetching':
        return <p>Loading రాశిఫలం &ellipse;</p>;
      case 'error':
        return <p>Some issue loading రాశిఫలం. Check logs.</p>;
      case 'success':
        return <div dangerouslySetInnerHTML={{ __html: data.data }} />;
    }
  }, [data]);

  return <div id="content">{content}</div>;
}
