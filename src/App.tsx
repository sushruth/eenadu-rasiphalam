import * as React from 'react';
import './styles.css';
import { Data } from './App.types';
import { getRasiPhalalu } from './helper';

export default function App() {
  const [data, setData] = React.useState<Data<any>>({ status: 'unfetched' });
  const [article, setArticle] = React.useState('#');

  const fetchData = React.useCallback(async () => {
    setData({
      status: 'fetching',
    });

    try {
      const [originalArticleLink, rasiphalam] = await getRasiPhalalu();
      setArticle(originalArticleLink);
      setData({
        status: 'success',
        data: rasiphalam,
      });
    } catch (error) {
      console.error(error);
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
        return <p>Loading రాశిఫలం &hellip;</p>;
      case 'error':
        return <p>Some issue loading రాశిఫలం. Check logs.</p>;
      case 'success':
        return (
          <>
            <a href={article} id="articleLink">
              Source &#8599;
            </a>
            <div dangerouslySetInnerHTML={{ __html: data.data }} />
          </>
        );
    }
  }, [data, article]);

  return <div id="content">{content}</div>;
}
