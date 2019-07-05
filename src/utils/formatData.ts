interface Props {
  [key: string]: any;
}

export function formatData<T extends Props>(data: T[], key: string = 'id') {
  const ids: string[] = [];
  const byIds = data.reduce<{ [key: string]: T }>((acc, val: any) => {
    const id = val[key] as string;
    ids.push(id);
    acc[id] = val;
    return acc;
  }, {});

  return { ids, byIds };
}
