export type Data<T> =
  | { status: 'fetching' }
  | { status: 'error'; error: Error }
  | { status: 'unfetched' }
  | { status: 'success'; data: T };
